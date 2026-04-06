"use client"

import type { Permission } from "@/lib/auth/rbac"
import { useAuthContext } from "@/components/auth/auth-provider"

interface PermissionGateProps {
  /** Single permission or a list of permissions to check */
  permission: Permission | Permission[]
  /** When multiple permissions: "any" (default) or "all" */
  mode?: "any" | "all"
  children: React.ReactNode
  /** Shown when the user lacks the required permission(s) */
  fallback?: React.ReactNode
}

/**
 * Conditionally renders children based on the user's permissions.
 *
 * ```tsx
 * <PermissionGate permission="members:create">
 *   <AddMemberButton />
 * </PermissionGate>
 *
 * <PermissionGate permission={["reports:read", "reports:generate"]} mode="all">
 *   <ReportsPanel />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  mode = "any",
  children,
  fallback = null,
}: PermissionGateProps) {
  const { can, canAny, isLoading, isAuthenticated } = useAuthContext()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  const permissions = Array.isArray(permission) ? permission : [permission]

  const hasAccess =
    mode === "all"
      ? permissions.every((p) => can(p))
      : canAny(permissions)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
