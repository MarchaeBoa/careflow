"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Tables, UpdateTables } from "@/lib/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type UpdateProfileInput = Omit<UpdateTables<"profiles">, "id" | "organization_id" | "created_at">;

interface CurrentUser {
  id: string;
  email: string;
  profile: Tables<"profiles"> | null;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<ServiceResult<CurrentUser>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Not authenticated" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return {
        data: { id: user.id, email: user.email ?? "", profile: null },
        error: null,
      };
    }

    return {
      data: {
        id: user.id,
        email: user.email ?? "",
        profile,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get current user" };
  }
}

export async function getUserProfile(userId: string): Promise<ServiceResult<Tables<"profiles">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to get user profile" };
  }
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput): Promise<ServiceResult<Tables<"profiles">>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Failed to update profile" };
  }
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Proceed with redirect even if sign out fails
  }
  redirect("/login");
}
