"use server";

import { createClient } from "@/lib/supabase/server";
import type { InsertTables, UpdateTables, Tables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateMemberInput = Omit<InsertTables<"members">, "id" | "created_at" | "updated_at">;
type UpdateMemberInput = Omit<UpdateTables<"members">, "id" | "organization_id" | "created_at">;

interface GetMembersParams {
  orgId: string;
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  unitId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getMembers(params: GetMembersParams): Promise<ServiceResult<{ members: Tables<"members">[]; count: number }>> {
  try {
    const {
      orgId,
      page = 1,
      pageSize = 20,
      status,
      search,
      sortBy = "full_name",
      sortOrder = "asc",
    } = params;

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("members")
      .select("*", { count: "exact" })
      .eq("organization_id", orgId)
      .is("deleted_at", null);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,nhs_number.ilike.%${search}%`);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: { members: data ?? [], count: count ?? 0 }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch members" };
  }
}

export async function getMemberById(id: string): Promise<ServiceResult<Tables<"members">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch member" };
  }
}

export async function createMember(input: CreateMemberInput): Promise<ServiceResult<Tables<"members">>> {
  try {
    const supabase = await createClient();

    if (!input.full_name || !input.date_of_birth || !input.organization_id) {
      return { data: null, error: "full_name, date_of_birth and organization_id are required" };
    }

    const { data, error } = await supabase
      .from("members")
      .insert({
        ...input,
        status: input.status ?? "active",
        emergency_contacts: input.emergency_contacts ?? [],
        diagnoses: input.diagnoses ?? [],
        documents: input.documents ?? [],
        tags: input.tags ?? [],
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to create member" };
  }
}

export async function updateMember(id: string, input: UpdateMemberInput): Promise<ServiceResult<Tables<"members">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update member" };
  }
}

export async function archiveMember(id: string): Promise<ServiceResult<Tables<"members">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .update({ status: "inactive", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to archive member" };
  }
}
