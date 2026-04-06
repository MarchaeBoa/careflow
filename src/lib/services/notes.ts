"use server";

import { createClient } from "@/lib/supabase/server";
import type { InsertTables, UpdateTables, Tables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateNoteInput = Omit<InsertTables<"service_notes">, "id" | "created_at" | "updated_at">;
type UpdateNoteInput = Omit<UpdateTables<"service_notes">, "id" | "author_id" | "created_at">;

interface GetNotesParams {
  orgId: string;
  page?: number;
  pageSize?: number;
  status?: string;
  memberId?: string;
  authorId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getNotes(params: GetNotesParams): Promise<ServiceResult<{ notes: any[]; count: number }>> {
  try {
    const {
      orgId,
      page = 1,
      pageSize = 20,
      status,
      memberId,
      authorId,
      search,
      dateFrom,
      dateTo,
    } = params;

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("service_notes")
      .select("*, member:members!service_notes_member_id_fkey(id, full_name), author:profiles!service_notes_author_id_fkey(id, full_name, avatar_url)", { count: "exact" })
      .eq("member.organization_id", orgId);

    if (status) query = query.eq("status", status);
    if (memberId) query = query.eq("member_id", memberId);
    if (authorId) query = query.eq("author_id", authorId);
    if (search) query = query.ilike("content", `%${search}%`);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: { notes: data ?? [], count: count ?? 0 }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch notes" };
  }
}

export async function getNoteById(id: string): Promise<ServiceResult<any>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("service_notes")
      .select("*, member:members!service_notes_member_id_fkey(id, full_name, photo_url), author:profiles!service_notes_author_id_fkey(id, full_name, avatar_url), reviewer:profiles!service_notes_approved_by_fkey(id, full_name)")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch note" };
  }
}

export async function createNote(input: CreateNoteInput): Promise<ServiceResult<Tables<"service_notes">>> {
  try {
    const supabase = await createClient();

    if (!input.member_id || !input.author_id || !input.content) {
      return { data: null, error: "member_id, author_id and content are required" };
    }

    const { data, error } = await supabase
      .from("service_notes")
      .insert({
        ...input,
        status: input.status ?? "draft",
        tags: input.tags ?? [],
        attachments: input.attachments ?? [],
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to create note" };
  }
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<ServiceResult<Tables<"service_notes">>> {
  try {
    const supabase = await createClient();

    // Only allow editing if note is draft or rejected
    const { data: existing, error: fetchError } = await supabase
      .from("service_notes")
      .select("status, author_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (!["draft", "rejected"].includes(existing.status)) {
      return { data: null, error: "Only draft or rejected notes can be edited" };
    }

    const { data, error } = await supabase
      .from("service_notes")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update note" };
  }
}

export async function approveNote(id: string, reviewerId: string): Promise<ServiceResult<Tables<"service_notes">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("service_notes")
      .update({
        status: "approved",
        approved_by: reviewerId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to approve note" };
  }
}

export async function rejectNote(id: string, reviewerId: string, _reason: string): Promise<ServiceResult<Tables<"service_notes">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("service_notes")
      .update({
        status: "rejected",
        approved_by: reviewerId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to reject note" };
  }
}

export async function getNotesByMember(memberId: string, limit = 10): Promise<ServiceResult<any[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("service_notes")
      .select("*, author:profiles!service_notes_author_id_fkey(id, full_name, avatar_url)")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: data ?? [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch member notes" };
  }
}
