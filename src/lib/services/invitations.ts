"use server"

import { createClient } from "@/lib/supabase/server"
import type { Role } from "@/lib/constants"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InviteUserData {
  email: string
  role: Role
  organizationId: string
  invitedBy: string
  message?: string
}

export interface Invitation {
  id: string
  email: string
  role: Role
  organization_id: string
  invited_by: string
  token: string
  status: "pending" | "accepted" | "cancelled" | "expired"
  message: string | null
  created_at: string
  accepted_at: string | null
  expires_at: string
}

interface ServiceResult<T = unknown> {
  data: T | null
  error: string | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// ─── Invite User ────────────────────────────────────────────────────────────

export async function inviteUser(
  data: InviteUserData
): Promise<ServiceResult<Invitation>> {
  try {
    const supabase = await createClient()

    // Check if user is already a member of this organization
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", data.email)
      .eq("organization_id", data.organizationId)
      .maybeSingle()

    if (existingProfile) {
      return {
        data: null,
        error: "Este usuario ja faz parte da organizacao.",
      }
    }

    // Check for existing pending invitation
    const { data: existingInvite } = await supabase
      .from("invitations" as any)
      .select("id")
      .eq("email", data.email)
      .eq("organization_id", data.organizationId)
      .eq("status", "pending")
      .maybeSingle()

    if (existingInvite) {
      return {
        data: null,
        error: "Ja existe um convite pendente para este e-mail.",
      }
    }

    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Create invitation record
    const { data: invitation, error: insertError } = await supabase
      .from("invitations" as any)
      .insert({
        email: data.email,
        role: data.role,
        organization_id: data.organizationId,
        invited_by: data.invitedBy,
        token,
        status: "pending",
        message: data.message || null,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      // If invitations table doesn't exist, try using Supabase auth invite
      // This is a fallback for when the table hasn't been created yet
      console.error("Invitation insert error:", insertError.message)

      // Attempt to use Supabase auth admin invite as fallback
      // Note: This requires service_role key, which we don't have on client
      return {
        data: null,
        error: `Erro ao criar convite: ${insertError.message}. Verifique se a tabela 'invitations' existe no banco de dados.`,
      }
    }

    // TODO: Send email notification
    // For now, the invitation link can be shared manually:
    // /invite?token={token}&email={email}

    return {
      data: invitation as unknown as Invitation,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: "Erro inesperado ao enviar convite.",
    }
  }
}

// ─── Get Invitation ─────────────────────────────────────────────────────────

export async function getInvitation(
  token: string
): Promise<ServiceResult<Invitation & { organization_name: string; inviter_name: string }>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("invitations" as any)
      .select(`
        *,
        organization:organizations(name),
        inviter:profiles!invited_by(full_name)
      `)
      .eq("token", token)
      .single()

    if (error || !data) {
      return {
        data: null,
        error: "Convite nao encontrado ou invalido.",
      }
    }

    const record = data as any

    // Check expiration
    if (new Date(record.expires_at) < new Date()) {
      // Update status to expired
      await supabase
        .from("invitations" as any)
        .update({ status: "expired" })
        .eq("id", record.id)

      return {
        data: null,
        error: "Este convite expirou.",
      }
    }

    if (record.status !== "pending") {
      return {
        data: null,
        error:
          record.status === "accepted"
            ? "Este convite ja foi aceito."
            : "Este convite foi cancelado.",
      }
    }

    const orgData = record.organization as { name: string } | null
    const inviterData = record.inviter as { full_name: string } | null

    return {
      data: {
        ...record,
        organization_name: orgData?.name ?? "Organizacao",
        inviter_name: inviterData?.full_name ?? "Administrador",
      } as Invitation & { organization_name: string; inviter_name: string },
      error: null,
    }
  } catch {
    return {
      data: null,
      error: "Erro ao buscar convite.",
    }
  }
}

// ─── Accept Invitation ──────────────────────────────────────────────────────

export async function acceptInvitation(
  token: string,
  userId: string
): Promise<ServiceResult<{ organizationId: string }>> {
  try {
    const supabase = await createClient()

    // Get the invitation
    const { data: invitation, error: fetchError } = await supabase
      .from("invitations" as any)
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .single()

    if (fetchError || !invitation) {
      return {
        data: null,
        error: "Convite nao encontrado ou ja foi utilizado.",
      }
    }

    const inv = invitation as any

    // Check expiration
    if (new Date(inv.expires_at) < new Date()) {
      await supabase
        .from("invitations" as any)
        .update({ status: "expired" })
        .eq("id", inv.id)

      return {
        data: null,
        error: "Este convite expirou.",
      }
    }

    // Mark invitation as accepted
    const { error: updateError } = await supabase
      .from("invitations" as any)
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", inv.id)

    if (updateError) {
      return {
        data: null,
        error: "Erro ao aceitar convite.",
      }
    }

    // Update user profile with organization
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        organization_id: inv.organization_id,
        role: inv.role,
        is_active: true,
      })
      .eq("id", userId)

    if (profileError) {
      return {
        data: null,
        error: "Erro ao atualizar perfil.",
      }
    }

    return {
      data: { organizationId: inv.organization_id },
      error: null,
    }
  } catch {
    return {
      data: null,
      error: "Erro inesperado ao aceitar convite.",
    }
  }
}

// ─── Get Pending Invitations ────────────────────────────────────────────────

export async function getPendingInvitations(
  orgId: string
): Promise<ServiceResult<Invitation[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("invitations" as any)
      .select("*")
      .eq("organization_id", orgId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      return {
        data: null,
        error: error.message,
      }
    }

    return {
      data: (data ?? []) as unknown as Invitation[],
      error: null,
    }
  } catch {
    return {
      data: null,
      error: "Erro ao buscar convites pendentes.",
    }
  }
}

// ─── Cancel Invitation ──────────────────────────────────────────────────────

export async function cancelInvitation(
  invitationId: string
): Promise<ServiceResult<{ success: boolean }>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("invitations" as any)
      .update({ status: "cancelled" })
      .eq("id", invitationId)
      .eq("status", "pending")

    if (error) {
      return {
        data: null,
        error: error.message,
      }
    }

    return {
      data: { success: true },
      error: null,
    }
  } catch {
    return {
      data: null,
      error: "Erro ao cancelar convite.",
    }
  }
}
