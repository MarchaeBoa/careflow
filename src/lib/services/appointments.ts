"use server";

import { createClient } from "@/lib/supabase/server";
import type { InsertTables, UpdateTables, Tables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateAppointmentInput = Omit<InsertTables<"appointments">, "id" | "created_at" | "updated_at">;
type UpdateAppointmentInput = Omit<UpdateTables<"appointments">, "id" | "created_at">;

interface GetAppointmentsParams {
  orgId: string;
  memberId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getAppointments(params: GetAppointmentsParams): Promise<ServiceResult<{ appointments: any[]; count: number }>> {
  try {
    const {
      orgId,
      memberId,
      date,
      dateFrom,
      dateTo,
      type,
      status,
      page = 1,
      pageSize = 20,
    } = params;

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("appointments")
      .select("*, member:members!appointments_member_id_fkey(id, full_name, photo_url), responsible:profiles!appointments_responsible_id_fkey(id, full_name)", { count: "exact" })
      .eq("member.organization_id", orgId);

    if (memberId) query = query.eq("member_id", memberId);
    if (date) query = query.eq("date", date);
    if (dateFrom) query = query.gte("date", dateFrom);
    if (dateTo) query = query.lte("date", dateTo);
    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);

    query = query.order("date", { ascending: true }).order("time", { ascending: true }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: { appointments: data ?? [], count: count ?? 0 }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch appointments" };
  }
}

export async function createAppointment(input: CreateAppointmentInput): Promise<ServiceResult<Tables<"appointments">>> {
  try {
    const supabase = await createClient();

    if (!input.member_id || !input.title || !input.date || !input.time || !input.type) {
      return { data: null, error: "member_id, title, date, time and type are required" };
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        ...input,
        status: input.status ?? "scheduled",
        duration_minutes: input.duration_minutes ?? 30,
        transport_needed: input.transport_needed ?? false,
        reminder_sent: false,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to create appointment" };
  }
}

export async function updateAppointment(id: string, input: UpdateAppointmentInput): Promise<ServiceResult<Tables<"appointments">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("appointments")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update appointment" };
  }
}

export async function updateAppointmentStatus(id: string, status: string): Promise<ServiceResult<Tables<"appointments">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("appointments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update appointment status" };
  }
}

export async function getUpcomingAppointments(orgId: string, limit = 10): Promise<ServiceResult<any[]>> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("appointments")
      .select("*, member:members!appointments_member_id_fkey(id, full_name, photo_url, organization_id), responsible:profiles!appointments_responsible_id_fkey(id, full_name)")
      .eq("member.organization_id", orgId)
      .gte("date", today)
      .neq("status", "cancelled")
      .order("date", { ascending: true })
      .order("time", { ascending: true })
      .limit(limit);

    if (error) throw error;

    return { data: data ?? [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch upcoming appointments" };
  }
}

export async function getAppointmentsByDate(orgId: string, date: string): Promise<ServiceResult<any[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("appointments")
      .select("*, member:members!appointments_member_id_fkey(id, full_name, photo_url, organization_id), responsible:profiles!appointments_responsible_id_fkey(id, full_name)")
      .eq("member.organization_id", orgId)
      .eq("date", date)
      .order("time", { ascending: true });

    if (error) throw error;

    return { data: data ?? [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch appointments for date" };
  }
}
