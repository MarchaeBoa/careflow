"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Role } from "@/lib/constants"
import type { UserProfile, Organization } from "@/lib/types"
import {
  type Permission,
  hasPermission,
  hasAnyPermission,
  isRoleAtLeast,
} from "@/lib/auth/rbac"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null
  organization: Organization | null
  role: Role | null
  isLoading: boolean
  isAuthenticated: boolean
  // Permission helpers
  can: (permission: Permission) => boolean
  canAny: (permissions: Permission[]) => boolean
  isAdmin: boolean
  isManager: boolean
  isSuperAdmin: boolean
  // Actions
  signOut: () => Promise<void>
  refresh: () => Promise<void>
  switchOrganization: (orgId: string) => Promise<void>
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  // ── Fetch profile + org ───────────────────────────────────────────────

  const fetchProfileAndOrg = useCallback(
    async (userId: string) => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError || !profileData) {
        setProfile(null)
        setOrganization(null)
        return
      }

      const typedProfile = profileData as unknown as UserProfile
      setProfile(typedProfile)

      if (typedProfile.organization_id) {
        const { data: orgData } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", typedProfile.organization_id)
          .single()

        setOrganization(orgData ? (orgData as unknown as Organization) : null)
      } else {
        setOrganization(null)
      }
    },
    [supabase]
  )

  // ── Initial load ──────────────────────────────────────────────────────

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true)

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        setUser(null)
        setProfile(null)
        setOrganization(null)
        return
      }

      setUser(authUser)
      await fetchProfileAndOrg(authUser.id)
    } catch {
      setUser(null)
      setProfile(null)
      setOrganization(null)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, fetchProfileAndOrg])

  // ── Auth state listener ───────────────────────────────────────────────

  useEffect(() => {
    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        await fetchProfileAndOrg(session.user.id)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setOrganization(null)
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadUser, supabase, fetchProfileAndOrg])

  // ── Derived state ─────────────────────────────────────────────────────

  const role = profile?.role ?? null

  const isAuthenticated = !!user && !!profile

  const isSuperAdmin = role === "SUPER_ADMIN"
  const isAdmin =
    role === "SUPER_ADMIN" || role === "ORG_ADMIN"
  const isManager = role
    ? isRoleAtLeast(role, "MANAGER")
    : false

  // ── Permission helpers ────────────────────────────────────────────────

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!role) return false
      return hasPermission(role, permission)
    },
    [role]
  )

  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      if (!role) return false
      return hasAnyPermission(role, permissions)
    },
    [role]
  )

  // ── Actions ───────────────────────────────────────────────────────────

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setOrganization(null)
    router.push("/login")
  }, [supabase, router])

  const refresh = useCallback(async () => {
    await loadUser()
  }, [loadUser])

  const switchOrganization = useCallback(
    async (orgId: string) => {
      if (!user) return

      const { error } = await supabase
        .from("profiles")
        .update({ organization_id: orgId })
        .eq("id", user.id)

      if (!error) {
        await fetchProfileAndOrg(user.id)
        router.refresh()
      }
    },
    [supabase, user, fetchProfileAndOrg, router]
  )

  // ── Return ────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      user,
      profile,
      organization,
      role,
      isLoading,
      isAuthenticated,
      can,
      canAny,
      isAdmin,
      isManager,
      isSuperAdmin,
      signOut,
      refresh,
      switchOrganization,
    }),
    [
      user,
      profile,
      organization,
      role,
      isLoading,
      isAuthenticated,
      can,
      canAny,
      isAdmin,
      isManager,
      isSuperAdmin,
      signOut,
      refresh,
      switchOrganization,
    ]
  )
}
