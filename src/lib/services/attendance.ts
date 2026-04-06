"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GetAttendanceParams {
  orgId: string;
  date?: string;
  unitId?: string;
  staffId?: string;
  page?: number;
  pageSize?: number;
}

interface CheckInInput {
  orgId: string;
  memberId: string;
  staffId: string;
  unitId?: string;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
}

interface DailyAggregate {
  date: string;
  present: number;
  absent: number;
  total: number;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getAttendance(params: GetAttendanceParams): Promise<ServiceResult<{ records: any[]; count: number }>> {
  try {
    const { orgId, date, unitId, staffId, page = 1, pageSize = 50 } = params;

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("attendance_records")
      .select("*, member:members!attendance_records_member_id_fkey(id, full_name, photo_url), staff:profiles!attendance_records_staff_id_fkey(id, full_name)", { count: "exact" })
      .eq("member.organization_id", orgId);

    if (date) query = query.eq("date", date);
    if (unitId) query = query.eq("location_id", unitId);
    if (staffId) query = query.eq("staff_id", staffId);

    query = query.order("check_in", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: { records: data ?? [], count: count ?? 0 }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch attendance" };
  }
}

export async function checkIn(input: CheckInInput): Promise<ServiceResult<Tables<"attendance_records">>> {
  try {
    const supabase = await createClient();
    const now = new Date();

    const { data, error } = await supabase
      .from("attendance_records")
      .insert({
        member_id: input.memberId,
        staff_id: input.staffId,
        location_id: input.unitId ?? null,
        check_in: now.toISOString(),
        date: now.toISOString().split("T")[0],
        status: "present",
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to check in" };
  }
}

export async function checkOut(recordId: string): Promise<ServiceResult<Tables<"attendance_records">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("attendance_records")
      .update({
        check_out: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", recordId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to check out" };
  }
}

export async function getAttendanceSummary(orgId: string, date: string): Promise<ServiceResult<AttendanceSummary>> {
  try {
    const supabase = await createClient();

    // Get total active members
    const { count: totalMembers } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "active")
      .is("deleted_at", null);

    // Get attendance for the date
    const { data: records } = await supabase
      .from("attendance_records")
      .select("status")
      .eq("date", date);

    const present = records?.filter((r) => r.status === "present").length ?? 0;
    const late = records?.filter((r) => r.status === "late").length ?? 0;
    const total = totalMembers ?? 0;
    const absent = total - present - late;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return {
      data: { present, absent, late, total, rate },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get attendance summary" };
  }
}

export async function getAttendanceTrend(orgId: string, days: number): Promise<ServiceResult<DailyAggregate[]>> {
  try {
    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count: totalMembers } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "active")
      .is("deleted_at", null);

    const { data: records, error } = await supabase
      .from("attendance_records")
      .select("date, status")
      .gte("date", startDate.toISOString().split("T")[0]);

    if (error) throw error;

    // Group by date
    const grouped: Record<string, { present: number; absent: number }> = {};
    for (const record of records ?? []) {
      if (!grouped[record.date]) {
        grouped[record.date] = { present: 0, absent: 0 };
      }
      if (record.status === "present" || record.status === "late") {
        grouped[record.date].present++;
      }
    }

    const total = totalMembers ?? 0;
    const trend: DailyAggregate[] = Object.entries(grouped)
      .map(([date, counts]) => ({
        date,
        present: counts.present,
        absent: total - counts.present,
        total,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { data: trend, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get attendance trend" };
  }
}
