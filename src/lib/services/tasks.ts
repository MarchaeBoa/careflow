"use server";

import { createClient } from "@/lib/supabase/server";
import type { InsertTables, UpdateTables, Tables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateTaskInput = Omit<InsertTables<"tasks">, "id" | "created_at" | "updated_at">;
type UpdateTaskInput = Omit<UpdateTables<"tasks">, "id" | "organization_id" | "created_at">;

interface GetTasksParams {
  orgId: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getTasks(params: GetTasksParams): Promise<ServiceResult<{ tasks: any[]; count: number }>> {
  try {
    const {
      orgId,
      assigneeId,
      status,
      priority,
      search,
      page = 1,
      pageSize = 20,
    } = params;

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(id, full_name, avatar_url), creator:profiles!tasks_creator_id_fkey(id, full_name)", { count: "exact" })
      .eq("organization_id", orgId);

    if (assigneeId) query = query.eq("assignee_id", assigneeId);
    if (status) query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: { tasks: data ?? [], count: count ?? 0 }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch tasks" };
  }
}

export async function getTaskById(id: string): Promise<ServiceResult<any>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(id, full_name, avatar_url, email), creator:profiles!tasks_creator_id_fkey(id, full_name), member:members!tasks_member_id_fkey(id, full_name)")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch task" };
  }
}

export async function createTask(input: CreateTaskInput): Promise<ServiceResult<Tables<"tasks">>> {
  try {
    const supabase = await createClient();

    if (!input.title || !input.organization_id || !input.creator_id) {
      return { data: null, error: "title, organization_id and creator_id are required" };
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...input,
        status: input.status ?? "todo",
        priority: input.priority ?? "medium",
        checklist: input.checklist ?? [],
        tags: input.tags ?? [],
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to create task" };
  }
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<ServiceResult<Tables<"tasks">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update task" };
  }
}

export async function updateTaskStatus(id: string, status: string): Promise<ServiceResult<Tables<"tasks">>> {
  try {
    const supabase = await createClient();

    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    } else {
      updates.completed_at = null;
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update task status" };
  }
}

export async function addComment(taskId: string, _authorId: string, _content: string): Promise<ServiceResult<Tables<"tasks">>> {
  try {
    const supabase = await createClient();

    // Fetch current checklist (used as comment store for now)
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("checklist")
      .eq("id", taskId)
      .single();

    if (fetchError) throw fetchError;

    const comments = task.checklist ?? [];
    comments.push({
      author_id: _authorId,
      content: _content,
      created_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("tasks")
      .update({ checklist: comments, updated_at: new Date().toISOString() })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to add comment" };
  }
}

export async function getTasksByStatus(orgId: string): Promise<ServiceResult<Record<string, number>>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .select("status")
      .eq("organization_id", orgId);

    if (error) throw error;

    const counts: Record<string, number> = {
      todo: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    for (const task of data ?? []) {
      counts[task.status] = (counts[task.status] ?? 0) + 1;
    }

    return { data: counts, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get task counts" };
  }
}
