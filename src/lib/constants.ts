// ─── App Metadata ────────────────────────────────────────────────────────────

export const APP_NAME = "CareFlow" as const;
export const APP_DESCRIPTION =
  "Modern care management platform for organizations" as const;
export const APP_VERSION = "0.1.0" as const;

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ORG_ADMIN: "Organization Admin",
  MANAGER: "Manager",
  STAFF: "Staff",
};

/** Ordered from highest privilege to lowest */
export const ROLE_HIERARCHY: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ORG_ADMIN,
  ROLES.MANAGER,
  ROLES.STAFF,
];

// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  INVITE: "/invite",

  // Auth callbacks
  AUTH_CALLBACK: "/auth/callback",
  AUTH_CONFIRM: "/auth/confirm",

  // Dashboard
  DASHBOARD: "/dashboard",
  OVERVIEW: "/dashboard/overview",

  // Members
  MEMBERS: "/dashboard/members",
  MEMBER_DETAIL: (id: string) => `/dashboard/members/${id}` as const,
  MEMBER_NEW: "/dashboard/members/new",

  // Service Notes
  NOTES: "/dashboard/notes",
  NOTE_DETAIL: (id: string) => `/dashboard/notes/${id}` as const,
  NOTE_NEW: "/dashboard/notes/new",

  // Attendance
  ATTENDANCE: "/dashboard/attendance",

  // Medications
  MEDICATIONS: "/dashboard/medications",

  // Tasks
  TASKS: "/dashboard/tasks",
  TASK_DETAIL: (id: string) => `/dashboard/tasks/${id}` as const,

  // Appointments
  APPOINTMENTS: "/dashboard/appointments",
  APPOINTMENT_DETAIL: (id: string) => `/dashboard/appointments/${id}` as const,

  // Life Plans
  LIFE_PLANS: "/dashboard/life-plans",
  LIFE_PLAN_DETAIL: (id: string) => `/dashboard/life-plans/${id}` as const,

  // Resources
  RESOURCES: "/dashboard/resources",

  // Organization Settings
  SETTINGS: "/dashboard/settings",
  SETTINGS_GENERAL: "/dashboard/settings/general",
  SETTINGS_TEAM: "/dashboard/settings/team",
  SETTINGS_BILLING: "/dashboard/settings/billing",
  SETTINGS_INTEGRATIONS: "/dashboard/settings/integrations",

  // Profile
  PROFILE: "/dashboard/profile",

  // Audit
  AUDIT_LOG: "/dashboard/audit-log",
} as const;

// ─── Member Status ───────────────────────────────────────────────────────────

export const MEMBER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_HOLD: "on_hold",
  DISCHARGED: "discharged",
} as const;

export type MemberStatus = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

// ─── Note Status ─────────────────────────────────────────────────────────────

export const NOTE_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type NoteStatus = (typeof NOTE_STATUS)[keyof typeof NOTE_STATUS];

// ─── Task Priority ───────────────────────────────────────────────────────────

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

// ─── Task Status ─────────────────────────────────────────────────────────────

export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

// ─── Medication Status ───────────────────────────────────────────────────────

export const MEDICATION_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  DISCONTINUED: "discontinued",
} as const;

export type MedicationStatus =
  (typeof MEDICATION_STATUS)[keyof typeof MEDICATION_STATUS];

// ─── Appointment Type ────────────────────────────────────────────────────────

export const APPOINTMENT_TYPE = {
  MEDICAL: "medical",
  THERAPY: "therapy",
  REVIEW: "review",
  ASSESSMENT: "assessment",
  SOCIAL: "social",
  OTHER: "other",
} as const;

export type AppointmentType =
  (typeof APPOINTMENT_TYPE)[keyof typeof APPOINTMENT_TYPE];

// ─── Life Plan Status ────────────────────────────────────────────────────────

export const LIFE_PLAN_STATUS = {
  ACTIVE: "active",
  UNDER_REVIEW: "under_review",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export type LifePlanStatus =
  (typeof LIFE_PLAN_STATUS)[keyof typeof LIFE_PLAN_STATUS];

// ─── Resource Types ──────────────────────────────────────────────────────────

export const RESOURCE_TYPE = {
  PDF: "pdf",
  VIDEO: "video",
  LINK: "link",
  IMAGE: "image",
  DOCUMENT: "document",
} as const;

export type ResourceType = (typeof RESOURCE_TYPE)[keyof typeof RESOURCE_TYPE];

// ─── Organization Plans ──────────────────────────────────────────────────────

export const ORG_PLAN = {
  FREE: "free",
  STARTER: "starter",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
} as const;

export type OrgPlan = (typeof ORG_PLAN)[keyof typeof ORG_PLAN];

// ─── Pagination ──────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── Locales ─────────────────────────────────────────────────────────────────

export const LOCALES = {
  EN: "en",
  PT_BR: "pt-BR",
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export const DEFAULT_LOCALE: Locale = LOCALES.EN;

// ─── Themes ──────────────────────────────────────────────────────────────────

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];
