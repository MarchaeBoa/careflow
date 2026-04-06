import { type Role, ROLES } from "@/lib/constants"

// ─── Permissions ────────────────────────────────────────────────────────────

export type Permission =
  | "members:read"
  | "members:create"
  | "members:update"
  | "members:delete"
  | "notes:read"
  | "notes:create"
  | "notes:update"
  | "notes:delete"
  | "notes:approve"
  | "attendance:read"
  | "attendance:create"
  | "attendance:update"
  | "medications:read"
  | "medications:create"
  | "medications:update"
  | "medications:delete"
  | "medications:administer"
  | "tasks:read"
  | "tasks:create"
  | "tasks:update"
  | "tasks:delete"
  | "tasks:assign"
  | "appointments:read"
  | "appointments:create"
  | "appointments:update"
  | "appointments:delete"
  | "reports:read"
  | "reports:generate"
  | "life_plans:read"
  | "life_plans:create"
  | "life_plans:update"
  | "life_plans:delete"
  | "content:read"
  | "content:create"
  | "content:update"
  | "content:delete"
  | "compliance:read"
  | "compliance:manage"
  | "settings:read"
  | "settings:update"
  | "users:read"
  | "users:invite"
  | "users:manage"
  | "users:delete"
  | "organizations:read"
  | "organizations:update"
  | "audit:read"

// ─── All Permissions (for super_admin) ──────────────────────────────────────

const ALL_PERMISSIONS: Permission[] = [
  "members:read",
  "members:create",
  "members:update",
  "members:delete",
  "notes:read",
  "notes:create",
  "notes:update",
  "notes:delete",
  "notes:approve",
  "attendance:read",
  "attendance:create",
  "attendance:update",
  "medications:read",
  "medications:create",
  "medications:update",
  "medications:delete",
  "medications:administer",
  "tasks:read",
  "tasks:create",
  "tasks:update",
  "tasks:delete",
  "tasks:assign",
  "appointments:read",
  "appointments:create",
  "appointments:update",
  "appointments:delete",
  "reports:read",
  "reports:generate",
  "life_plans:read",
  "life_plans:create",
  "life_plans:update",
  "life_plans:delete",
  "content:read",
  "content:create",
  "content:update",
  "content:delete",
  "compliance:read",
  "compliance:manage",
  "settings:read",
  "settings:update",
  "users:read",
  "users:invite",
  "users:manage",
  "users:delete",
  "organizations:read",
  "organizations:update",
  "audit:read",
]

// ─── Permission Matrix ──────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: [...ALL_PERMISSIONS],

  [ROLES.ORG_ADMIN]: ALL_PERMISSIONS.filter((p) => p !== "users:delete"),

  [ROLES.MANAGER]: [
    "members:read",
    "members:create",
    "members:update",
    "notes:read",
    "notes:create",
    "notes:update",
    "notes:approve",
    "attendance:read",
    "attendance:create",
    "attendance:update",
    "medications:read",
    "medications:create",
    "medications:update",
    "medications:administer",
    "tasks:read",
    "tasks:create",
    "tasks:update",
    "tasks:assign",
    "appointments:read",
    "appointments:create",
    "appointments:update",
    "reports:read",
    "reports:generate",
    "life_plans:read",
    "life_plans:create",
    "life_plans:update",
    "content:read",
    "content:create",
    "content:update",
    "compliance:read",
    "settings:read",
    "users:read",
    "organizations:read",
    "audit:read",
  ],

  [ROLES.STAFF]: [
    "members:read",
    "notes:read",
    "notes:create",
    "attendance:read",
    "attendance:create",
    "medications:read",
    "medications:administer",
    "tasks:read",
    "tasks:create",
    "tasks:update",
    "appointments:read",
    "life_plans:read",
    "content:read",
    "settings:read",
    "organizations:read",
  ],
}

// ─── Role Hierarchy ─────────────────────────────────────────────────────────

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ORG_ADMIN]: 3,
  [ROLES.MANAGER]: 2,
  [ROLES.STAFF]: 1,
}

// ─── Permission Checks ─────────────────────────────────────────────────────

/**
 * Check whether a role has a specific permission.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  if (!permissions) return false
  return permissions.includes(permission)
}

/**
 * Check whether a role has **any** of the given permissions.
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/**
 * Check whether a role has **all** of the given permissions.
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Return the full list of permissions for a role.
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

// ─── Role Helpers ───────────────────────────────────────────────────────────

/**
 * Return a human-readable label in Portuguese for the given role.
 */
export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    [ROLES.SUPER_ADMIN]: "Super Admin",
    [ROLES.ORG_ADMIN]: "Administrador",
    [ROLES.MANAGER]: "Gerente",
    [ROLES.STAFF]: "Equipe",
  }
  return labels[role] ?? role
}

/**
 * Return Tailwind CSS color classes for badges / chips.
 */
export function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    [ROLES.SUPER_ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    [ROLES.ORG_ADMIN]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    [ROLES.MANAGER]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [ROLES.STAFF]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  }
  return colors[role] ?? "bg-gray-100 text-gray-800"
}

/**
 * Check whether `userRole` is strictly above `requiredRole` in the hierarchy.
 */
export function isRoleAbove(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) > (ROLE_HIERARCHY[requiredRole] ?? 0)
}

/**
 * Check whether `userRole` is at or above `requiredRole` in the hierarchy.
 */
export function isRoleAtLeast(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0)
}
