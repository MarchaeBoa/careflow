"use client"

import type { Role } from "@/lib/constants"
import { isRoleAtLeast } from "@/lib/auth/rbac"
import { useAuthContext } from "@/components/auth/auth-provider"

interface RequireRoleProps {
  /** Minimum role required to see children */
  role: Role
  children: React.ReactNode
  /** Shown when the user lacks the required role */
  fallback?: React.ReactNode
}

/**
 * Client-side role guard. Renders children only if the current user's
 * role is at or above the required level.
 *
 * ```tsx
 * <RequireRole role="MANAGER">
 *   <SensitivePanel />
 * </RequireRole>
 * ```
 */
export function RequireRole({ role, children, fallback = null }: RequireRoleProps) {
  const { role: userRole, isLoading, isAuthenticated } = useAuthContext()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated || !userRole) {
    return <>{fallback}</>
  }

  if (!isRoleAtLeast(userRole, role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
