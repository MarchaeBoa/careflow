import type {
  Role,
  MemberStatus,
  NoteStatus,
  TaskPriority,
  TaskStatus,
  MedicationStatus,
  AppointmentType,
  LifePlanStatus,
  ResourceType,
  OrgPlan,
} from "@/lib/constants";

// ─── Common ──────────────────────────────────────────────────────────────────

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface SoftDelete {
  deleted_at: string | null;
}

// ─── Organization ────────────────────────────────────────────────────────────

export interface OrganizationSettings {
  timezone: string;
  date_format: string;
  default_locale: string;
  features: {
    medications_enabled: boolean;
    life_plans_enabled: boolean;
    attendance_enabled: boolean;
    resources_enabled: boolean;
    appointments_enabled: boolean;
  };
  branding: {
    primary_color: string;
    accent_color: string;
  };
}

export interface Organization extends Timestamps {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  settings: OrganizationSettings;
  plan: OrgPlan;
  owner_id: string;
  max_members: number;
  max_staff: number;
}

// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile extends Timestamps {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: Role;
  organization_id: string;
  phone: string | null;
  job_title: string | null;
  is_active: boolean;
  last_sign_in_at: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  locale: string;
  theme: string;
  notifications_email: boolean;
  notifications_push: boolean;
  notifications_sms: boolean;
}

// ─── Member (Care Recipient) ─────────────────────────────────────────────────

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string | null;
  is_primary: boolean;
}

export interface Diagnosis {
  code: string;
  description: string;
  diagnosed_at: string;
  diagnosed_by: string;
  notes: string | null;
}

export interface MemberDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface Member extends Timestamps, SoftDelete {
  id: string;
  organization_id: string;
  full_name: string;
  date_of_birth: string;
  photo_url: string | null;
  status: MemberStatus;
  gender: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  nhs_number: string | null;
  emergency_contacts: EmergencyContact[];
  diagnoses: Diagnosis[];
  notes: string | null;
  documents: MemberDocument[];
  tags: string[];
  key_worker_id: string | null;
}

// ─── Service Note ────────────────────────────────────────────────────────────

export interface ServiceNote extends Timestamps {
  id: string;
  member_id: string;
  author_id: string;
  content: string;
  tags: string[];
  status: NoteStatus;
  approved_by: string | null;
  approved_at: string | null;
  template_id: string | null;
  attachments: NoteAttachment[];
  is_confidential: boolean;
}

export interface NoteAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface NoteTemplate {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  content_schema: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export interface AttendanceRecord extends Timestamps {
  id: string;
  member_id: string;
  staff_id: string;
  check_in: string;
  check_out: string | null;
  location_id: string | null;
  date: string;
  notes: string | null;
  status: "present" | "absent" | "late" | "excused";
}

export interface AttendanceLocation {
  id: string;
  organization_id: string;
  name: string;
  address: string | null;
  is_active: boolean;
}

// ─── Medication ──────────────────────────────────────────────────────────────

export interface MedicationSchedule {
  frequency: "daily" | "twice_daily" | "weekly" | "monthly" | "as_needed";
  times: string[];
  days_of_week: number[] | null;
  instructions: string | null;
}

export interface MedicationLog {
  id: string;
  administered_at: string;
  administered_by: string;
  status: "given" | "refused" | "missed" | "held";
  notes: string | null;
}

export interface Medication extends Timestamps {
  id: string;
  member_id: string;
  name: string;
  dosage: string;
  form: string | null;
  route: string | null;
  prescriber: string | null;
  pharmacy: string | null;
  schedule: MedicationSchedule;
  status: MedicationStatus;
  start_date: string;
  end_date: string | null;
  side_effects: string | null;
  logs: MedicationLog[];
}

// ─── Task ────────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
}

export interface Task extends Timestamps {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  creator_id: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  checklist: ChecklistItem[];
  tags: string[];
  member_id: string | null;
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export interface Appointment extends Timestamps {
  id: string;
  member_id: string;
  type: AppointmentType;
  title: string;
  date: string;
  time: string;
  duration_minutes: number;
  location: string | null;
  location_id: string | null;
  responsible_id: string | null;
  notes: string | null;
  transport_needed: boolean;
  transport_details: string | null;
  recurrence: AppointmentRecurrence | null;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  reminder_sent: boolean;
}

export interface AppointmentRecurrence {
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  end_date: string | null;
  occurrences: number | null;
}

// ─── Life Plan ───────────────────────────────────────────────────────────────

export interface LifePlanGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_date: string | null;
  status: "not_started" | "in_progress" | "achieved" | "on_hold";
}

export interface LifePlanMilestone {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  target_date: string | null;
  achieved_at: string | null;
  evidence: string | null;
}

export interface LifePlanReview {
  id: string;
  reviewed_by: string;
  reviewed_at: string;
  summary: string;
  next_review_date: string | null;
  attendees: string[];
}

export interface LifePlanEvidence {
  id: string;
  goal_id: string;
  type: "note" | "photo" | "document" | "observation";
  content: string;
  url: string | null;
  recorded_by: string;
  recorded_at: string;
}

export interface LifePlan extends Timestamps {
  id: string;
  member_id: string;
  goals: LifePlanGoal[];
  milestones: LifePlanMilestone[];
  evidence: LifePlanEvidence[];
  reviews: LifePlanReview[];
  status: LifePlanStatus;
  current_review_date: string | null;
  next_review_date: string | null;
}

// ─── Content Resource ────────────────────────────────────────────────────────

export interface ContentResource extends Timestamps {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  url: string;
  category: string;
  tags: string[];
  assigned_to: string[];
  uploaded_by: string;
  file_size: number | null;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: AuditAction;
  entity_type: AuditEntityType;
  entity_id: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "archive"
  | "restore"
  | "approve"
  | "reject"
  | "login"
  | "logout"
  | "export"
  | "import"
  | "invite"
  | "role_change";

export type AuditEntityType =
  | "organization"
  | "user"
  | "member"
  | "note"
  | "attendance"
  | "medication"
  | "task"
  | "appointment"
  | "life_plan"
  | "resource"
  | "template";

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  link: string | null;
  created_at: string;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

// ─── Form Types ──────────────────────────────────────────────────────────────

export type CreateMember = Omit<
  Member,
  "id" | "created_at" | "updated_at" | "deleted_at" | "documents"
>;

export type UpdateMember = Partial<CreateMember>;

export type CreateServiceNote = Omit<
  ServiceNote,
  "id" | "created_at" | "updated_at" | "approved_by" | "approved_at"
>;

export type UpdateServiceNote = Partial<CreateServiceNote>;

export type CreateTask = Omit<
  Task,
  "id" | "created_at" | "updated_at" | "completed_at"
>;

export type UpdateTask = Partial<CreateTask>;

export type CreateAppointment = Omit<
  Appointment,
  "id" | "created_at" | "updated_at" | "reminder_sent"
>;

export type UpdateAppointment = Partial<CreateAppointment>;
