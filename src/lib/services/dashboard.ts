"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  attendanceToday: { present: number; absent: number; late: number; rate: number };
  pendingNotes: number;
  complianceScore: number;
  tasksOverdue: number;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getDashboardStats(orgId: string): Promise<ServiceResult<DashboardStats>> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    // Run queries in parallel
    const [membersRes, activeRes, attendanceRes, notesRes, tasksRes] = await Promise.all([
      supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .is("deleted_at", null),
      supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("status", "active")
        .is("deleted_at", null),
      supabase
        .from("attendance_records")
        .select("status")
        .eq("date", today),
      supabase
        .from("service_notes")
        .select("*", { count: "exact", head: true })
        .eq("status", "submitted"),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .lt("due_date", today)
        .in("status", ["todo", "in_progress"]),
    ]);

    const totalMembers = membersRes.count ?? 0;
    const activeMembers = activeRes.count ?? 0;

    const present = attendanceRes.data?.filter((r) => r.status === "present").length ?? 0;
    const late = attendanceRes.data?.filter((r) => r.status === "late").length ?? 0;
    const absent = activeMembers - present - late;
    const rate = activeMembers > 0 ? Math.round(((present + late) / activeMembers) * 100) : 0;

    return {
      data: {
        totalMembers,
        activeMembers,
        attendanceToday: { present, absent: Math.max(absent, 0), late, rate },
        pendingNotes: notesRes.count ?? 0,
        complianceScore: 95, // Placeholder until medication compliance is wired
        tasksOverdue: tasksRes.count ?? 0,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch dashboard stats" };
  }
}

export async function getAttendanceTrend(orgId: string, days: number): Promise<ServiceResult<{ date: string; present: number; absent: number; total: number }[]>> {
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

    const grouped: Record<string, number> = {};
    for (const r of records ?? []) {
      if (r.status === "present" || r.status === "late") {
        grouped[r.date] = (grouped[r.date] ?? 0) + 1;
      }
    }

    const total = totalMembers ?? 0;
    const trend = Object.entries(grouped)
      .map(([date, present]) => ({ date, present, absent: total - present, total }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { data: trend, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get attendance trend" };
  }
}

export async function getNotesSummary(orgId: string, _days: number): Promise<ServiceResult<Record<string, number>>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("service_notes")
      .select("status, member:members!service_notes_member_id_fkey(organization_id)")
      .eq("member.organization_id", orgId);

    if (error) throw error;

    const summary: Record<string, number> = { draft: 0, submitted: 0, approved: 0, rejected: 0 };
    for (const note of data ?? []) {
      if (note.member) {
        summary[note.status] = (summary[note.status] ?? 0) + 1;
      }
    }

    return { data: summary, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get notes summary" };
  }
}

export async function getRecentActivity(orgId: string, limit = 20): Promise<ServiceResult<any[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("audit_logs")
      .select("*, user:profiles!audit_logs_user_id_fkey(id, full_name, avatar_url)")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: data ?? [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get recent activity" };
  }
}

export async function getComplianceAlerts(orgId: string): Promise<ServiceResult<any[]>> {
  try {
    const supabase = await createClient();

    // Get overdue tasks as compliance alerts
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, due_date, priority, assignee:profiles!tasks_assignee_id_fkey(id, full_name)")
      .eq("organization_id", orgId)
      .lt("due_date", today)
      .in("status", ["todo", "in_progress"])
      .order("due_date", { ascending: true })
      .limit(20);

    if (error) throw error;

    return { data: data ?? [], error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get compliance alerts" };
  }
}

export async function getQuickStats(orgId: string): Promise<ServiceResult<{ members: number; staff: number; pendingTasks: number; unreadNotifications: number }>> {
  try {
    const supabase = await createClient();

    const [membersRes, staffRes, tasksRes] = await Promise.all([
      supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("status", "active")
        .is("deleted_at", null),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("is_active", true),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .in("status", ["todo", "in_progress"]),
    ]);

    return {
      data: {
        members: membersRes.count ?? 0,
        staff: staffRes.count ?? 0,
        pendingTasks: tasksRes.count ?? 0,
        unreadNotifications: 0,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get quick stats" };
  }
}
