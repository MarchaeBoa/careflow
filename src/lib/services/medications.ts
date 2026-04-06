"use server";

import { createClient } from "@/lib/supabase/server";
import type { InsertTables, UpdateTables, Tables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateMedicationInput = Omit<InsertTables<"medications">, "id" | "created_at" | "updated_at">;
type UpdateMedicationInput = Omit<UpdateTables<"medications">, "id" | "created_at">;

interface GetMedicationsParams {
  orgId: string;
  memberId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface LogAdministrationInput {
  medicationId: string;
  memberId: string;
  administeredBy: string;
  status: string;
  notes?: string;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getMedications(params: GetMedicationsParams): Promise<ServiceResult<{ medications: any[]; count: number }>> {
  try {
    const { orgId, memberId, status, page = 1, pageSize = 20 } = params;

    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("medications")
      .select("*, member:members!medications_member_id_fkey(id, full_name, organization_id)", { count: "exact" })
      .eq("member.organization_id", orgId);

    if (memberId) query = query.eq("member_id", memberId);
    if (status) query = query.eq("status", status);

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: { medications: data ?? [], count: count ?? 0 }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch medications" };
  }
}

export async function createMedication(input: CreateMedicationInput): Promise<ServiceResult<Tables<"medications">>> {
  try {
    const supabase = await createClient();

    if (!input.member_id || !input.name || !input.dosage || !input.start_date) {
      return { data: null, error: "member_id, name, dosage and start_date are required" };
    }

    const { data, error } = await supabase
      .from("medications")
      .insert({
        ...input,
        status: input.status ?? "active",
        schedule: input.schedule ?? {},
        logs: input.logs ?? [],
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to create medication" };
  }
}

export async function updateMedication(id: string, input: UpdateMedicationInput): Promise<ServiceResult<Tables<"medications">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("medications")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update medication" };
  }
}

export async function logAdministration(input: LogAdministrationInput): Promise<ServiceResult<Tables<"medications">>> {
  try {
    const supabase = await createClient();

    const { data: medication, error: fetchError } = await supabase
      .from("medications")
      .select("logs")
      .eq("id", input.medicationId)
      .single();

    if (fetchError) throw fetchError;

    const logs = medication.logs ?? [];
    logs.push({
      administered_by: input.administeredBy,
      status: input.status,
      notes: input.notes ?? "",
      administered_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("medications")
      .update({ logs, updated_at: new Date().toISOString() })
      .eq("id", input.medicationId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to log administration" };
  }
}

export async function getMedicationLogs(medicationId: string, page = 1, pageSize = 20): Promise<ServiceResult<{ logs: Record<string, unknown>[]; count: number }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("medications")
      .select("logs")
      .eq("id", medicationId)
      .single();

    if (error) throw error;

    const allLogs = (data.logs ?? []) as Record<string, unknown>[];
    const sorted = allLogs.sort((a, b) =>
      String(b.administered_at ?? "").localeCompare(String(a.administered_at ?? ""))
    );

    const from = (page - 1) * pageSize;
    const paged = sorted.slice(from, from + pageSize);

    return { data: { logs: paged, count: allLogs.length }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch medication logs" };
  }
}

export async function getDueMedications(orgId: string): Promise<ServiceResult<any[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("medications")
      .select("*, member:members!medications_member_id_fkey(id, full_name, organization_id)")
      .eq("status", "active")
      .eq("member.organization_id", orgId);

    if (error) throw error;

    // Filter to medications whose schedule indicates they are due
    // Since schedule is a JSON field, filtering happens client-side
    const due = (data ?? []).filter((med) => {
      if (!med.member) return false;
      return true; // In production, compare schedule times with current time
    });

    return { data: due, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to fetch due medications" };
  }
}

export async function getMedicationCompliance(orgId: string): Promise<ServiceResult<{ rate: number; total: number; administered: number }>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("medications")
      .select("logs, member:members!medications_member_id_fkey(organization_id)")
      .eq("status", "active")
      .eq("member.organization_id", orgId);

    if (error) throw error;

    let totalDoses = 0;
    let administeredDoses = 0;

    for (const med of data ?? []) {
      if (!med.member) continue;
      const logs = (med.logs ?? []) as Record<string, unknown>[];
      totalDoses += logs.length;
      administeredDoses += logs.filter((l) => l.status === "administered").length;
    }

    const rate = totalDoses > 0 ? Math.round((administeredDoses / totalDoses) * 100) : 100;

    return { data: { rate, total: totalDoses, administered: administeredDoses }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get compliance" };
  }
}
