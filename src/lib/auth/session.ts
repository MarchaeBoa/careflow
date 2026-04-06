import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { type Role, ROLES } from "@/lib/constants"
import {
  type Permission,
  hasPermission,
  isRoleAtLeast,
} from "@/lib/auth/rbac"
import type { UserProfile, Organization } from "@/lib/types"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SessionData {
  user: {
    id: string
    email: string
  }
  profile: UserProfile
  organization: Organization | null
  role: Role
}

// ─── Core Helpers ───────────────────────────────────────────────────────────

/**
 * Get the current authenticated session with profile and organization data.
 * Redirects to /login if not authenticated.
 */
export async function getSession(): Promise<SessionData> {
  const session = await getSessionOrNull()

  if (!session) {
    redirect("/login")
  }

  return session
}

/**
 * Get the current session or return null (no redirect).
 */
export async function getSessionOrNull(): Promise<SessionData | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  const typedProfile = profile as unknown as UserProfile

  // Fetch organization if the user belongs to one
  let organization: Organization | null = null

  if (typedProfile.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", typedProfile.organization_id)
      .single()

    if (org) {
      organization = org as unknown as Organization
    }
  }

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
    },
    profile: typedProfile,
    organization,
    role: typedProfile.role,
  }
}

// ─── Guards ─────────────────────────────────────────────────────────────────

/**
 * Require an authenticated user. Redirects to /login if not authenticated.
 */
export async function requireAuth(): Promise<SessionData> {
  return getSession()
}

/**
 * Require that the user's role is at or above the given level.
 * Redirects to /login if not authenticated, to /dashboard if insufficient role.
 */
export async function requireRole(requiredRole: Role): Promise<SessionData> {
  const session = await getSession()

  if (!isRoleAtLeast(session.role, requiredRole)) {
    redirect("/dashboard?error=insufficient_permissions")
  }

  return session
}

/**
 * Require that the user holds a specific permission.
 * Redirects to /login if not authenticated, to /dashboard if missing permission.
 */
export async function requirePermission(
  permission: Permission
): Promise<SessionData> {
  const session = await getSession()

  if (!hasPermission(session.role, permission)) {
    redirect("/dashboard?error=insufficient_permissions")
  }

  return session
}

/**
 * Require that the user belongs to an organization.
 * Redirects to /onboarding if no organization is set.
 */
export async function requireOrganization(): Promise<
  SessionData & { organization: Organization }
> {
  const session = await getSession()

  if (!session.organization) {
    redirect("/onboarding")
  }

  return session as SessionData & { organization: Organization }
}
