import { z } from "zod";

// ============================================================================
// CareFlow - Zod Validation Schemas
// Comprehensive validation for all entities
// ============================================================================

// ---------------------------------------------------------------------------
// Shared / Helper Schemas
// ---------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
export type Pagination = z.infer<typeof paginationSchema>;

export const dateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((d) => d.to >= d.from, {
    message: "End date must be on or after the start date",
  });
export type DateRange = z.infer<typeof dateRangeSchema>;

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  filters: z.record(z.string(), z.unknown()).optional(),
});
export type Search = z.infer<typeof searchSchema>;

const uuidField = z.string().uuid();

// Reusable enums matching Postgres enums
const userRoleEnum = z.enum(["super_admin", "org_admin", "manager", "staff"]);
const memberStatusEnum = z.enum(["active", "inactive", "discharged", "on_hold"]);
const noteStatusEnum = z.enum(["draft", "pending_review", "approved", "rejected"]);
const taskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
const taskStatusEnum = z.enum(["todo", "in_progress", "review", "done", "cancelled"]);
const medicationStatusEnum = z.enum(["active", "paused", "discontinued"]);
const appointmentTypeEnum = z.enum(["medical", "therapy", "social", "transport", "evaluation", "other"]);
const appointmentStatusEnum = z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]);
const lifePlanStatusEnum = z.enum(["active", "completed", "on_hold", "cancelled"]);
const resourceTypeEnum = z.enum(["pdf", "video", "document", "slide", "link", "image"]);
const complianceAlertSeverityEnum = z.enum(["info", "warning", "critical"]);

// ---------------------------------------------------------------------------
// 1. Organization
// ---------------------------------------------------------------------------

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  logo_url: z.string().url().nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  address: z.record(z.string(), z.unknown()).optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().nullable().optional(),
  website: z.string().url().nullable().optional(),
  plan: z.string().default("starter"),
  max_members: z.number().int().min(1).default(50),
  max_users: z.number().int().min(1).default(10),
  settings: z.record(z.string(), z.unknown()).optional(),
});
export type CreateOrganization = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;

// ---------------------------------------------------------------------------
// 2. Organization Unit (Location)
// ---------------------------------------------------------------------------

export const createOrganizationUnitSchema = z.object({
  organization_id: uuidField,
  name: z.string().min(2).max(200),
  address: z.string().max(500).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  is_active: z.boolean().default(true),
  operating_hours: z.record(z.string(), z.unknown()).optional(),
});
export type CreateOrganizationUnit = z.infer<typeof createOrganizationUnitSchema>;

export const updateOrganizationUnitSchema = createOrganizationUnitSchema.omit({ organization_id: true }).partial();
export type UpdateOrganizationUnit = z.infer<typeof updateOrganizationUnitSchema>;

// ---------------------------------------------------------------------------
// 3. Profile (update only -- created by auth trigger)
// ---------------------------------------------------------------------------

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
  avatar_url: z.string().url().nullable().optional(),
  role: userRoleEnum.optional(),
  phone: z.string().max(30).nullable().optional(),
  job_title: z.string().max(200).nullable().optional(),
  is_active: z.boolean().optional(),
});
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// ---------------------------------------------------------------------------
// 4. Member
// ---------------------------------------------------------------------------

export const createMemberSchema = z.object({
  organization_id: uuidField,
  full_name: z.string().min(2, "Name must be at least 2 characters").max(200),
  date_of_birth: z.coerce.date().refine(
    (d) => d <= new Date(),
    { message: "Date of birth cannot be in the future" },
  ).nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  gender: z.string().max(50).nullable().optional(),
  address: z.record(z.string(), z.unknown()).optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().nullable().optional(),
  status: memberStatusEnum.default("active"),
  primary_location_id: uuidField.nullable().optional(),
  admission_date: z.coerce.date().nullable().optional(),
  discharge_date: z.coerce.date().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreateMember = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = createMemberSchema.omit({ organization_id: true }).partial();
export type UpdateMember = z.infer<typeof updateMemberSchema>;

// ---------------------------------------------------------------------------
// 5. Emergency Contact
// ---------------------------------------------------------------------------

export const emergencyContactSchema = z.object({
  member_id: uuidField,
  name: z.string().min(1).max(200),
  relationship: z.string().max(100).nullable().optional(),
  phone: z.string().min(5, "Phone number is required").max(30),
  email: z.string().email().nullable().optional(),
  is_primary: z.boolean().default(false),
});
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// ---------------------------------------------------------------------------
// 6. Service Note
// ---------------------------------------------------------------------------

export const createServiceNoteSchema = z.object({
  organization_id: uuidField,
  member_id: uuidField,
  author_id: uuidField,
  content: z.string().min(10, "Content must be at least 10 characters").max(10000),
  summary: z.string().max(500).nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  template_id: uuidField.nullable().optional(),
  status: noteStatusEnum.default("draft"),
  is_ai_generated: z.boolean().default(false),
  ai_metadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreateServiceNote = z.infer<typeof createServiceNoteSchema>;

export const updateServiceNoteSchema = z.object({
  content: z.string().min(10).max(10000).optional(),
  summary: z.string().max(500).nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  status: noteStatusEnum.optional(),
  approved_by: uuidField.nullable().optional(),
  approved_at: z.coerce.date().nullable().optional(),
  rejection_reason: z.string().max(1000).nullable().optional(),
});
export type UpdateServiceNote = z.infer<typeof updateServiceNoteSchema>;

// ---------------------------------------------------------------------------
// 7. Attendance
// ---------------------------------------------------------------------------

export const createAttendanceSchema = z.object({
  organization_id: uuidField,
  member_id: uuidField,
  staff_id: uuidField.nullable().optional(),
  location_id: uuidField.nullable().optional(),
  date: z.coerce.date(),
  check_in: z.coerce.date(),
  status: z.string().max(50).default("present"),
  notes: z.string().max(1000).nullable().optional(),
});
export type CreateAttendance = z.infer<typeof createAttendanceSchema>;

export const updateAttendanceSchema = z.object({
  check_out: z.coerce.date(),
  status: z.string().max(50).optional(),
  notes: z.string().max(1000).nullable().optional(),
});
export type UpdateAttendance = z.infer<typeof updateAttendanceSchema>;

// ---------------------------------------------------------------------------
// 8. Medication
// ---------------------------------------------------------------------------

export const medicationSchema = z.object({
  organization_id: uuidField,
  member_id: uuidField,
  name: z.string().min(1, "Medication name is required").max(300),
  dosage: z.string().min(1, "Dosage is required").max(100),
  frequency: z.string().min(1, "Frequency is required").max(200),
  route: z.string().max(100).nullable().optional(),
  instructions: z.string().max(2000).nullable().optional(),
  prescriber: z.string().max(200).nullable().optional(),
  start_date: z.coerce.date().nullable().optional(),
  end_date: z.coerce.date().nullable().optional(),
  status: medicationStatusEnum.default("active"),
  created_by: uuidField.nullable().optional(),
});
export type Medication = z.infer<typeof medicationSchema>;

export const updateMedicationSchema = medicationSchema
  .omit({ organization_id: true, member_id: true })
  .partial();
export type UpdateMedication = z.infer<typeof updateMedicationSchema>;

// ---------------------------------------------------------------------------
// 9. Medication Log
// ---------------------------------------------------------------------------

export const medicationLogSchema = z.object({
  medication_id: uuidField,
  administered_by: uuidField,
  administered_at: z.coerce.date().default(() => new Date()),
  status: z.string().max(50).default("administered"),
  notes: z.string().max(1000).nullable().optional(),
});
export type MedicationLog = z.infer<typeof medicationLogSchema>;

// ---------------------------------------------------------------------------
// 10. Task
// ---------------------------------------------------------------------------

export const createTaskSchema = z.object({
  organization_id: uuidField,
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(5000).nullable().optional(),
  assignee_id: uuidField.nullable().optional(),
  created_by: uuidField.nullable().optional(),
  priority: taskPriorityEnum.default("medium"),
  status: taskStatusEnum.default("todo"),
  due_date: z.coerce.date().nullable().optional(),
  checklist: z
    .array(
      z.object({
        item: z.string().min(1).max(300),
        done: z.boolean().default(false),
      }),
    )
    .max(50)
    .default([]),
  tags: z.array(z.string().max(50)).max(20).default([]),
});
export type CreateTask = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema
  .omit({ organization_id: true, created_by: true })
  .partial()
  .extend({
    completed_at: z.coerce.date().nullable().optional(),
  });
export type UpdateTask = z.infer<typeof updateTaskSchema>;

// ---------------------------------------------------------------------------
// 11. Task Comment
// ---------------------------------------------------------------------------

export const taskCommentSchema = z.object({
  task_id: uuidField,
  author_id: uuidField,
  content: z.string().min(1, "Comment cannot be empty").max(5000),
});
export type TaskComment = z.infer<typeof taskCommentSchema>;

// ---------------------------------------------------------------------------
// 12. Appointment
// ---------------------------------------------------------------------------

export const appointmentSchema = z.object({
  organization_id: uuidField,
  member_id: uuidField,
  type: appointmentTypeEnum.default("other"),
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(2000).nullable().optional(),
  date: z.coerce.date({ error: "Date is required" }),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM format"),
  end_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be HH:MM format")
    .nullable()
    .optional(),
  location: z.string().max(500).nullable().optional(),
  responsible_id: uuidField.nullable().optional(),
  transport_needed: z.boolean().default(false),
  transport_details: z.record(z.string(), z.unknown()).optional(),
  status: appointmentStatusEnum.default("scheduled"),
  notes: z.string().max(2000).nullable().optional(),
  recurrence: z.record(z.string(), z.unknown()).nullable().optional(),
  created_by: uuidField.nullable().optional(),
});
export type Appointment = z.infer<typeof appointmentSchema>;

export const updateAppointmentSchema = appointmentSchema
  .omit({ organization_id: true, member_id: true, created_by: true })
  .partial();
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;

// ---------------------------------------------------------------------------
// 13. Transport (embedded in appointments via transport_details)
// ---------------------------------------------------------------------------

export const transportSchema = z.object({
  appointment_id: uuidField.optional(),
  pickup_time: z.string().regex(/^\d{2}:\d{2}$/, "Pickup time must be HH:MM format"),
  pickup_location: z.string().min(1).max(500),
  dropoff_location: z.string().min(1).max(500),
  vehicle: z.string().max(200).nullable().optional(),
  driver: z.string().max(200).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  return_trip: z.boolean().default(true),
});
export type Transport = z.infer<typeof transportSchema>;

// ---------------------------------------------------------------------------
// 14. Life Plan
// ---------------------------------------------------------------------------

export const lifePlanSchema = z.object({
  organization_id: uuidField,
  member_id: uuidField,
  title: z.string().min(2).max(300),
  description: z.string().max(5000).nullable().optional(),
  status: lifePlanStatusEnum.default("active"),
  start_date: z.coerce.date().nullable().optional(),
  target_date: z.coerce.date().nullable().optional(),
  created_by: uuidField.nullable().optional(),
});
export type LifePlan = z.infer<typeof lifePlanSchema>;

export const updateLifePlanSchema = lifePlanSchema
  .omit({ organization_id: true, member_id: true, created_by: true })
  .partial();
export type UpdateLifePlan = z.infer<typeof updateLifePlanSchema>;

// ---------------------------------------------------------------------------
// 15. Life Plan Goal
// ---------------------------------------------------------------------------

export const goalSchema = z.object({
  life_plan_id: uuidField,
  title: z.string().min(1).max(300),
  description: z.string().max(2000).nullable().optional(),
  target_date: z.coerce.date().nullable().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  status: z.string().max(50).default("in_progress"),
});
export type Goal = z.infer<typeof goalSchema>;

export const updateGoalSchema = goalSchema.omit({ life_plan_id: true }).partial();
export type UpdateGoal = z.infer<typeof updateGoalSchema>;

// ---------------------------------------------------------------------------
// 16. Life Plan Milestone
// ---------------------------------------------------------------------------

export const milestoneSchema = z.object({
  goal_id: uuidField,
  title: z.string().min(1).max(300),
  description: z.string().max(2000).nullable().optional(),
  is_completed: z.boolean().default(false),
  completed_at: z.coerce.date().nullable().optional(),
  evidence_url: z.string().url().nullable().optional(),
  evidence_notes: z.string().max(2000).nullable().optional(),
});
export type Milestone = z.infer<typeof milestoneSchema>;

export const updateMilestoneSchema = milestoneSchema.omit({ goal_id: true }).partial();
export type UpdateMilestone = z.infer<typeof updateMilestoneSchema>;

// ---------------------------------------------------------------------------
// 17. Report Generation
// ---------------------------------------------------------------------------

export const reportGenerationSchema = z.object({
  organization_id: uuidField,
  title: z.string().min(1).max(300),
  type: z.string().min(1).max(100),
  parameters: z.record(z.string(), z.unknown()).optional(),
  generated_by: uuidField,
  file_url: z.string().url().nullable().optional(),
  status: z.enum(["pending", "generating", "completed", "failed"]).default("pending"),
});
export type ReportGeneration = z.infer<typeof reportGenerationSchema>;

// ---------------------------------------------------------------------------
// 18. Content Resource
// ---------------------------------------------------------------------------

export const contentResourceSchema = z.object({
  organization_id: uuidField,
  title: z.string().min(1).max(300),
  description: z.string().max(2000).nullable().optional(),
  type: resourceTypeEnum,
  url: z.string().url().nullable().optional(),
  file_url: z.string().url().nullable().optional(),
  file_size: z.number().int().min(0).nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  is_published: z.boolean().default(false),
  created_by: uuidField.nullable().optional(),
});
export type ContentResource = z.infer<typeof contentResourceSchema>;

export const updateContentResourceSchema = contentResourceSchema
  .omit({ organization_id: true, created_by: true })
  .partial();
export type UpdateContentResource = z.infer<typeof updateContentResourceSchema>;

// ---------------------------------------------------------------------------
// 19. Compliance Metric
// ---------------------------------------------------------------------------

export const complianceMetricSchema = z.object({
  organization_id: uuidField,
  metric_name: z.string().min(1).max(200),
  value: z.number(),
  target: z.number().nullable().optional(),
  period_start: z.coerce.date(),
  period_end: z.coerce.date(),
  category: z.string().max(100).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type ComplianceMetric = z.infer<typeof complianceMetricSchema>;

// ---------------------------------------------------------------------------
// 20. Notification
// ---------------------------------------------------------------------------

export const notificationSchema = z.object({
  organization_id: uuidField,
  user_id: uuidField,
  title: z.string().min(1).max(300),
  message: z.string().max(2000).nullable().optional(),
  type: z.string().max(50).default("info"),
  is_read: z.boolean().default(false),
  action_url: z.string().max(500).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type Notification = z.infer<typeof notificationSchema>;

// ---------------------------------------------------------------------------
// 21. Compliance Alert
// ---------------------------------------------------------------------------

export const complianceAlertSchema = z.object({
  organization_id: uuidField,
  severity: complianceAlertSeverityEnum.default("info"),
  title: z.string().min(1).max(300),
  message: z.string().max(2000).nullable().optional(),
  entity_type: z.string().max(100).nullable().optional(),
  entity_id: uuidField.nullable().optional(),
  is_resolved: z.boolean().default(false),
  resolved_by: uuidField.nullable().optional(),
  resolved_at: z.coerce.date().nullable().optional(),
});
export type ComplianceAlert = z.infer<typeof complianceAlertSchema>;

// ---------------------------------------------------------------------------
// 22. Note Template
// ---------------------------------------------------------------------------

export const noteTemplateSchema = z.object({
  organization_id: uuidField,
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  category: z.string().max(100).nullable().optional(),
  is_active: z.boolean().default(true),
});
export type NoteTemplate = z.infer<typeof noteTemplateSchema>;

// ---------------------------------------------------------------------------
// 23. Member Diagnosis
// ---------------------------------------------------------------------------

export const memberDiagnosisSchema = z.object({
  member_id: uuidField,
  diagnosis_code: z.string().max(20).nullable().optional(),
  diagnosis_name: z.string().min(1).max(300),
  description: z.string().max(2000).nullable().optional(),
  diagnosed_date: z.coerce.date().nullable().optional(),
  diagnosed_by: z.string().max(200).nullable().optional(),
  is_active: z.boolean().default(true),
});
export type MemberDiagnosis = z.infer<typeof memberDiagnosisSchema>;

// ---------------------------------------------------------------------------
// 24. Member Document
// ---------------------------------------------------------------------------

export const memberDocumentSchema = z.object({
  member_id: uuidField,
  title: z.string().min(1).max(300),
  file_url: z.string().url(),
  file_type: z.string().max(100).nullable().optional(),
  file_size: z.number().int().min(0).nullable().optional(),
  uploaded_by: uuidField.nullable().optional(),
  category: z.string().max(100).nullable().optional(),
});
export type MemberDocument = z.infer<typeof memberDocumentSchema>;

// ---------------------------------------------------------------------------
// 25. Audit Log (read-only, but schema for validation)
// ---------------------------------------------------------------------------

export const auditLogSchema = z.object({
  organization_id: uuidField.nullable().optional(),
  user_id: uuidField.nullable().optional(),
  action: z.string().min(1).max(100),
  entity_type: z.string().min(1).max(100),
  entity_id: uuidField.nullable().optional(),
  old_data: z.record(z.string(), z.unknown()).nullable().optional(),
  new_data: z.record(z.string(), z.unknown()).nullable().optional(),
  ip_address: z.string().max(45).nullable().optional(),
  user_agent: z.string().max(500).nullable().optional(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;

// ---------------------------------------------------------------------------
// Re-export enums for use in forms / selects
// ---------------------------------------------------------------------------

export {
  userRoleEnum,
  memberStatusEnum,
  noteStatusEnum,
  taskPriorityEnum,
  taskStatusEnum,
  medicationStatusEnum,
  appointmentTypeEnum,
  appointmentStatusEnum,
  lifePlanStatusEnum,
  resourceTypeEnum,
  complianceAlertSeverityEnum,
};
