-- ============================================================================
-- CareFlow - Complete Supabase Database Schema v2.0
-- Multi-tenant care management SaaS
-- ============================================================================
--
-- This schema defines 28 tables, 12 enums, helper functions, triggers,
-- indexes, and Row Level Security policies for a multi-tenant care
-- management platform built on Supabase.
--
-- Run this file against a fresh Supabase project or use migrations.
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- full-text / trigram search


-- ============================================================================
-- 2. ENUMS (12 types)
-- ============================================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin', 'manager', 'staff');

CREATE TYPE member_status AS ENUM ('active', 'inactive', 'discharged', 'on_hold');

CREATE TYPE note_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected');

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');

CREATE TYPE medication_status AS ENUM ('active', 'paused', 'discontinued');

CREATE TYPE medication_log_status AS ENUM ('administered', 'refused', 'missed', 'self_administered');

CREATE TYPE appointment_type AS ENUM ('medical', 'therapy', 'social', 'transport', 'evaluation', 'other');

CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

CREATE TYPE life_plan_status AS ENUM ('active', 'completed', 'on_hold', 'cancelled');

CREATE TYPE resource_type AS ENUM ('pdf', 'video', 'document', 'slide', 'link', 'image');

CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');


-- ============================================================================
-- 3. TABLES (28 total)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 3.1  organizations
-- ---------------------------------------------------------------------------
CREATE TABLE organizations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    logo_url    TEXT,
    description TEXT,
    address     JSONB DEFAULT '{}',
    phone       TEXT,
    email       TEXT,
    website     TEXT,
    settings    JSONB NOT NULL DEFAULT '{}',
    plan        TEXT NOT NULL DEFAULT 'starter',
    max_members INT NOT NULL DEFAULT 50,
    max_users   INT NOT NULL DEFAULT 10,
    timezone    TEXT NOT NULL DEFAULT 'UTC',
    locale      TEXT NOT NULL DEFAULT 'en',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organizations IS 'Top-level tenant entity. Every piece of data belongs to an organization.';

-- ---------------------------------------------------------------------------
-- 3.2  organization_units  (replaces the old "locations" table)
-- ---------------------------------------------------------------------------
CREATE TABLE organization_units (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    address         TEXT,
    phone           TEXT,
    manager_id      UUID,  -- FK added after profiles table is created
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    operating_hours JSONB NOT NULL DEFAULT '{}',
    capacity        INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organization_units IS 'Physical or logical units within an organization (wards, buildings, teams).';

-- ---------------------------------------------------------------------------
-- 3.3  profiles  (renamed from user_profiles)
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email         TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    avatar_url    TEXT,
    role          user_role NOT NULL DEFAULT 'staff',
    phone         TEXT,
    job_title     TEXT,
    department    TEXT,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    preferences   JSONB NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Extended profile for every auth.users entry. One row per user.';

-- Now add the deferred FK on organization_units.manager_id
ALTER TABLE organization_units
    ADD CONSTRAINT fk_organization_units_manager
    FOREIGN KEY (manager_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- 3.4  memberships  (enables users to belong to multiple orgs)
-- ---------------------------------------------------------------------------
CREATE TABLE memberships (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role            user_role NOT NULL DEFAULT 'staff',
    is_primary      BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at         TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (user_id, organization_id)
);

COMMENT ON TABLE memberships IS 'Junction table allowing a single user to belong to multiple organizations.';

-- ---------------------------------------------------------------------------
-- 3.5  members  (care recipients / service users)
-- ---------------------------------------------------------------------------
CREATE TABLE members (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    date_of_birth   DATE,
    photo_url       TEXT,
    gender          TEXT,
    address         JSONB NOT NULL DEFAULT '{}',
    phone           TEXT,
    email           TEXT,
    status          member_status NOT NULL DEFAULT 'active',
    primary_unit_id UUID REFERENCES organization_units(id) ON DELETE SET NULL,
    admission_date  DATE,
    discharge_date  DATE,
    internal_notes  TEXT,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE members IS 'Individuals receiving care within an organization.';

-- ---------------------------------------------------------------------------
-- 3.6  emergency_contacts
-- ---------------------------------------------------------------------------
CREATE TABLE emergency_contacts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id    UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    relationship TEXT,
    phone        TEXT NOT NULL,
    email        TEXT,
    address      TEXT,
    is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE emergency_contacts IS 'Emergency contact details for each member.';

-- ---------------------------------------------------------------------------
-- 3.7  member_diagnoses
-- ---------------------------------------------------------------------------
CREATE TABLE member_diagnoses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    diagnosis_code  TEXT,
    diagnosis_name  TEXT NOT NULL,
    description     TEXT,
    diagnosed_date  DATE,
    diagnosed_by    TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE member_diagnoses IS 'Clinical or working diagnoses associated with a member.';

-- ---------------------------------------------------------------------------
-- 3.8  member_documents
-- ---------------------------------------------------------------------------
CREATE TABLE member_documents (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id   UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    file_url    TEXT NOT NULL,
    file_type   TEXT,
    file_size   BIGINT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category    TEXT,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE member_documents IS 'Files (PDFs, images, scans) attached to a member record.';

-- ---------------------------------------------------------------------------
-- 3.9  attendance_records
-- ---------------------------------------------------------------------------
CREATE TABLE attendance_records (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    member_id        UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    staff_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    unit_id          UUID REFERENCES organization_units(id) ON DELETE SET NULL,
    date             DATE NOT NULL,
    check_in         TIMESTAMPTZ,
    check_out        TIMESTAMPTZ,
    status           TEXT NOT NULL DEFAULT 'present'
                         CHECK (status IN ('present', 'absent', 'late', 'excused')),
    duration_minutes INT,          -- calculated by trigger
    notes            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE attendance_records IS 'Daily attendance tracking for members.';

-- ---------------------------------------------------------------------------
-- 3.10 note_templates  (defined before service_notes so FK exists)
-- ---------------------------------------------------------------------------
CREATE TABLE note_templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,
    category        TEXT,
    fields          JSONB NOT NULL DEFAULT '[]',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    usage_count     INT NOT NULL DEFAULT 0,
    created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE note_templates IS 'Reusable templates for service notes.';

-- ---------------------------------------------------------------------------
-- 3.11 service_notes
-- ---------------------------------------------------------------------------
CREATE TABLE service_notes (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    member_id        UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    author_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    content          TEXT NOT NULL,
    summary          TEXT,
    tags             TEXT[] NOT NULL DEFAULT '{}',
    template_id      UUID REFERENCES note_templates(id) ON DELETE SET NULL,
    status           note_status NOT NULL DEFAULT 'draft',
    reviewed_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at      TIMESTAMPTZ,
    rejection_reason TEXT,
    is_ai_assisted   BOOLEAN NOT NULL DEFAULT FALSE,
    ai_model         TEXT,
    word_count       INT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE service_notes IS 'Progress notes, daily notes, and other narrative documentation.';

-- ---------------------------------------------------------------------------
-- 3.12 report_generations
-- ---------------------------------------------------------------------------
CREATE TABLE report_generations (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    member_id         UUID REFERENCES members(id) ON DELETE SET NULL,
    generated_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    report_type       TEXT NOT NULL
                          CHECK (report_type IN (
                              'weekly_summary', 'monthly_review', 'progress_report',
                              'compliance_report', 'custom'
                          )),
    title             TEXT NOT NULL,
    content           TEXT,
    ai_model          TEXT,
    ai_prompt         TEXT,
    input_notes_count INT,
    input_date_from   DATE,
    input_date_to     DATE,
    status            TEXT NOT NULL DEFAULT 'generating'
                          CHECK (status IN (
                              'generating', 'generated', 'reviewed', 'final', 'failed'
                          )),
    reviewed_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at       TIMESTAMPTZ,
    word_count        INT,
    pdf_url           TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE report_generations IS 'AI-generated reports and their review status.';

-- ---------------------------------------------------------------------------
-- 3.13 life_plans
-- ---------------------------------------------------------------------------
CREATE TABLE life_plans (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    member_id        UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    title            TEXT NOT NULL,
    description      TEXT,
    status           life_plan_status NOT NULL DEFAULT 'active',
    start_date       DATE,
    target_date      DATE,
    overall_progress INT NOT NULL DEFAULT 0 CHECK (overall_progress BETWEEN 0 AND 100),
    created_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE life_plans IS 'Person-centred life plans / care plans for members.';

-- ---------------------------------------------------------------------------
-- 3.14 life_plan_goals
-- ---------------------------------------------------------------------------
CREATE TABLE life_plan_goals (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    life_plan_id UUID NOT NULL REFERENCES life_plans(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    description  TEXT,
    category     TEXT,
    target_date  DATE,
    progress     INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    status       TEXT NOT NULL DEFAULT 'in_progress',
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE life_plan_goals IS 'Individual goals within a life plan.';

-- ---------------------------------------------------------------------------
-- 3.15 life_plan_milestones
-- ---------------------------------------------------------------------------
CREATE TABLE life_plan_milestones (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id        UUID NOT NULL REFERENCES life_plan_goals(id) ON DELETE CASCADE,
    title          TEXT NOT NULL,
    description    TEXT,
    is_completed   BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at   TIMESTAMPTZ,
    evidence_url   TEXT,
    evidence_notes TEXT,
    sort_order     INT NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE life_plan_milestones IS 'Milestones / evidence points within a goal.';

-- ---------------------------------------------------------------------------
-- 3.16 life_plan_reviews
-- ---------------------------------------------------------------------------
CREATE TABLE life_plan_reviews (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    life_plan_id     UUID NOT NULL REFERENCES life_plans(id) ON DELETE CASCADE,
    reviewer_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    content          TEXT NOT NULL,
    outcome          TEXT,
    next_review_date DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE life_plan_reviews IS 'Periodic reviews of a life plan by staff.';

-- ---------------------------------------------------------------------------
-- 3.17 medications
-- ---------------------------------------------------------------------------
CREATE TABLE medications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    dosage          TEXT,
    frequency       TEXT NOT NULL,
    route           TEXT,
    instructions    TEXT,
    prescriber      TEXT,
    pharmacy        TEXT,
    start_date      DATE,
    end_date        DATE,
    status          medication_status NOT NULL DEFAULT 'active',
    refill_date     DATE,
    side_effects    TEXT,
    created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE medications IS 'Prescribed medications for members.';

-- ---------------------------------------------------------------------------
-- 3.18 medication_logs
-- ---------------------------------------------------------------------------
CREATE TABLE medication_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_id   UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    administered_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    scheduled_at    TIMESTAMPTZ NOT NULL,
    administered_at TIMESTAMPTZ,
    status          medication_log_status NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE medication_logs IS 'Medication administration records (MAR).';

-- ---------------------------------------------------------------------------
-- 3.19 tasks
-- ---------------------------------------------------------------------------
CREATE TABLE tasks (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title             TEXT NOT NULL,
    description       TEXT,
    assignee_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_by        UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority          task_priority NOT NULL DEFAULT 'medium',
    status            task_status NOT NULL DEFAULT 'todo',
    due_date          TIMESTAMPTZ,
    completed_at      TIMESTAMPTZ,
    checklist         JSONB NOT NULL DEFAULT '[]',
    tags              TEXT[] NOT NULL DEFAULT '{}',
    related_member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE tasks IS 'Action items assigned to staff, optionally linked to a member.';

-- ---------------------------------------------------------------------------
-- 3.20 task_comments
-- ---------------------------------------------------------------------------
CREATE TABLE task_comments (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE task_comments IS 'Threaded comments on a task.';

-- ---------------------------------------------------------------------------
-- 3.21 appointments
-- ---------------------------------------------------------------------------
CREATE TABLE appointments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    type            appointment_type NOT NULL DEFAULT 'other',
    title           TEXT NOT NULL,
    description     TEXT,
    date            DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME,
    location        TEXT,
    responsible_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status          appointment_status NOT NULL DEFAULT 'scheduled',
    notes           TEXT,
    recurrence      JSONB,
    created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE appointments IS 'Scheduled appointments for members.';

-- ---------------------------------------------------------------------------
-- 3.22 transports
-- ---------------------------------------------------------------------------
CREATE TABLE transports (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id    UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    appointment_id     UUID REFERENCES appointments(id) ON DELETE SET NULL,
    member_id          UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    driver_id          UUID REFERENCES profiles(id) ON DELETE SET NULL,
    pickup_address     TEXT,
    dropoff_address    TEXT,
    pickup_time        TIMESTAMPTZ,
    actual_pickup_time TIMESTAMPTZ,
    dropoff_time       TIMESTAMPTZ,
    actual_dropoff_time TIMESTAMPTZ,
    vehicle            TEXT,
    status             TEXT NOT NULL DEFAULT 'scheduled'
                           CHECK (status IN ('scheduled', 'in_transit', 'completed', 'cancelled')),
    notes              TEXT,
    mileage            DECIMAL(8, 2),
    created_by         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE transports IS 'Transport bookings for member appointments and outings.';

-- ---------------------------------------------------------------------------
-- 3.23 content_resources
-- ---------------------------------------------------------------------------
CREATE TABLE content_resources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    type            resource_type NOT NULL,
    url             TEXT,
    file_url        TEXT,
    file_size       BIGINT,
    category        TEXT,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    view_count      INT NOT NULL DEFAULT 0,
    created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE content_resources IS 'Training materials, documents, videos shared within an org.';

-- ---------------------------------------------------------------------------
-- 3.24 content_assignments
-- ---------------------------------------------------------------------------
CREATE TABLE content_assignments (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id   UUID NOT NULL REFERENCES content_resources(id) ON DELETE CASCADE,
    assignee_type TEXT NOT NULL DEFAULT 'user'
                      CHECK (assignee_type IN ('user', 'member', 'team')),
    assignee_id   UUID NOT NULL,
    completed     BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at  TIMESTAMPTZ,
    progress      INT NOT NULL DEFAULT 0,
    assigned_by   UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE content_assignments IS 'Tracks assignment of resources to users, members, or teams.';

-- ---------------------------------------------------------------------------
-- 3.25 compliance_metrics
-- ---------------------------------------------------------------------------
CREATE TABLE compliance_metrics (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    unit_id         UUID REFERENCES organization_units(id) ON DELETE SET NULL,
    metric_type     TEXT NOT NULL
                        CHECK (metric_type IN (
                            'notes_completion', 'attendance_rate', 'medication_compliance',
                            'tasks_completion', 'documentation_timeliness', 'training_completion'
                        )),
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    target_value    DECIMAL(5, 2),
    actual_value    DECIMAL(5, 2),
    score           DECIMAL(5, 2),
    details         JSONB NOT NULL DEFAULT '{}',
    calculated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE compliance_metrics IS 'Periodic compliance / KPI snapshots per org or unit.';

-- ---------------------------------------------------------------------------
-- 3.26 notifications
-- ---------------------------------------------------------------------------
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    message         TEXT,
    type            TEXT NOT NULL DEFAULT 'info'
                        CHECK (type IN (
                            'info', 'success', 'warning', 'error',
                            'task', 'note', 'medication', 'appointment'
                        )),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    action_url      TEXT,
    metadata        JSONB NOT NULL DEFAULT '{}',
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'In-app notifications for users.';

-- ---------------------------------------------------------------------------
-- 3.27 audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       UUID,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    session_id      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Immutable log of all significant data changes.';

-- ---------------------------------------------------------------------------
-- 3.28 compliance_alerts
-- ---------------------------------------------------------------------------
CREATE TABLE compliance_alerts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    severity        alert_severity NOT NULL DEFAULT 'info',
    title           TEXT NOT NULL,
    message         TEXT,
    entity_type     TEXT,
    entity_id       UUID,
    is_resolved     BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at     TIMESTAMPTZ,
    auto_generated  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE compliance_alerts IS 'Compliance warnings and alerts surfaced to org admins.';


-- ============================================================================
-- 4. INDEXES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 4.1  Foreign-key and organization_id indexes
-- ---------------------------------------------------------------------------

-- organization_units
CREATE INDEX idx_organization_units_org_id ON organization_units(organization_id);
CREATE INDEX idx_organization_units_manager ON organization_units(manager_id);

-- profiles
CREATE INDEX idx_profiles_org_id ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- memberships
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_org_id ON memberships(organization_id);
CREATE INDEX idx_memberships_active ON memberships(organization_id) WHERE is_active = TRUE;

-- members
CREATE INDEX idx_members_org_id ON members(organization_id);
CREATE INDEX idx_members_org_status ON members(organization_id, status);
CREATE INDEX idx_members_unit ON members(primary_unit_id);
CREATE INDEX idx_members_created_by ON members(created_by);
CREATE INDEX idx_members_created_at ON members(created_at DESC);

-- emergency_contacts
CREATE INDEX idx_emergency_contacts_member ON emergency_contacts(member_id);

-- member_diagnoses
CREATE INDEX idx_member_diagnoses_member ON member_diagnoses(member_id);

-- member_documents
CREATE INDEX idx_member_documents_member ON member_documents(member_id);
CREATE INDEX idx_member_documents_uploaded_by ON member_documents(uploaded_by);

-- attendance_records
CREATE INDEX idx_attendance_org_id ON attendance_records(organization_id);
CREATE INDEX idx_attendance_member ON attendance_records(member_id);
CREATE INDEX idx_attendance_staff ON attendance_records(staff_id);
CREATE INDEX idx_attendance_unit ON attendance_records(unit_id);
CREATE INDEX idx_attendance_org_date ON attendance_records(organization_id, date DESC);
CREATE INDEX idx_attendance_member_date ON attendance_records(member_id, created_at DESC);

-- note_templates
CREATE INDEX idx_note_templates_org_id ON note_templates(organization_id);
CREATE INDEX idx_note_templates_created_by ON note_templates(created_by);

-- service_notes
CREATE INDEX idx_service_notes_org_id ON service_notes(organization_id);
CREATE INDEX idx_service_notes_member ON service_notes(member_id);
CREATE INDEX idx_service_notes_author ON service_notes(author_id);
CREATE INDEX idx_service_notes_template ON service_notes(template_id);
CREATE INDEX idx_service_notes_reviewed_by ON service_notes(reviewed_by);
CREATE INDEX idx_service_notes_org_status ON service_notes(organization_id, status);
CREATE INDEX idx_service_notes_member_created ON service_notes(member_id, created_at DESC);
CREATE INDEX idx_service_notes_tags ON service_notes USING GIN (tags);

-- report_generations
CREATE INDEX idx_report_gen_org_id ON report_generations(organization_id);
CREATE INDEX idx_report_gen_member ON report_generations(member_id);
CREATE INDEX idx_report_gen_generated_by ON report_generations(generated_by);
CREATE INDEX idx_report_gen_status ON report_generations(organization_id, status);
CREATE INDEX idx_report_gen_created ON report_generations(created_at DESC);

-- life_plans
CREATE INDEX idx_life_plans_org_id ON life_plans(organization_id);
CREATE INDEX idx_life_plans_member ON life_plans(member_id);
CREATE INDEX idx_life_plans_org_status ON life_plans(organization_id, status);
CREATE INDEX idx_life_plans_created_by ON life_plans(created_by);

-- life_plan_goals
CREATE INDEX idx_life_plan_goals_plan ON life_plan_goals(life_plan_id);

-- life_plan_milestones
CREATE INDEX idx_life_plan_milestones_goal ON life_plan_milestones(goal_id);

-- life_plan_reviews
CREATE INDEX idx_life_plan_reviews_plan ON life_plan_reviews(life_plan_id);
CREATE INDEX idx_life_plan_reviews_reviewer ON life_plan_reviews(reviewer_id);

-- medications
CREATE INDEX idx_medications_org_id ON medications(organization_id);
CREATE INDEX idx_medications_member ON medications(member_id);
CREATE INDEX idx_medications_org_status ON medications(organization_id, status);
CREATE INDEX idx_medications_created_by ON medications(created_by);

-- medication_logs
CREATE INDEX idx_medication_logs_medication ON medication_logs(medication_id);
CREATE INDEX idx_medication_logs_member ON medication_logs(member_id);
CREATE INDEX idx_medication_logs_administered_by ON medication_logs(administered_by);
CREATE INDEX idx_medication_logs_scheduled ON medication_logs(scheduled_at DESC);

-- tasks
CREATE INDEX idx_tasks_org_id ON tasks(organization_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_member ON tasks(related_member_id);
CREATE INDEX idx_tasks_org_status ON tasks(organization_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date DESC);
CREATE INDEX idx_tasks_tags ON tasks USING GIN (tags);
CREATE INDEX idx_tasks_checklist ON tasks USING GIN (checklist);

-- task_comments
CREATE INDEX idx_task_comments_task ON task_comments(task_id);
CREATE INDEX idx_task_comments_author ON task_comments(author_id);

-- appointments
CREATE INDEX idx_appointments_org_id ON appointments(organization_id);
CREATE INDEX idx_appointments_member ON appointments(member_id);
CREATE INDEX idx_appointments_responsible ON appointments(responsible_id);
CREATE INDEX idx_appointments_created_by ON appointments(created_by);
CREATE INDEX idx_appointments_org_date ON appointments(organization_id, date DESC);
CREATE INDEX idx_appointments_org_status ON appointments(organization_id, status);
CREATE INDEX idx_appointments_member_created ON appointments(member_id, created_at DESC);

-- transports
CREATE INDEX idx_transports_org_id ON transports(organization_id);
CREATE INDEX idx_transports_appointment ON transports(appointment_id);
CREATE INDEX idx_transports_member ON transports(member_id);
CREATE INDEX idx_transports_driver ON transports(driver_id);
CREATE INDEX idx_transports_org_status ON transports(organization_id, status);
CREATE INDEX idx_transports_created_by ON transports(created_by);

-- content_resources
CREATE INDEX idx_content_resources_org_id ON content_resources(organization_id);
CREATE INDEX idx_content_resources_created_by ON content_resources(created_by);
CREATE INDEX idx_content_resources_tags ON content_resources USING GIN (tags);

-- content_assignments
CREATE INDEX idx_content_assignments_resource ON content_assignments(resource_id);
CREATE INDEX idx_content_assignments_assignee ON content_assignments(assignee_id);
CREATE INDEX idx_content_assignments_assigned_by ON content_assignments(assigned_by);

-- compliance_metrics
CREATE INDEX idx_compliance_metrics_org_id ON compliance_metrics(organization_id);
CREATE INDEX idx_compliance_metrics_unit ON compliance_metrics(unit_id);
CREATE INDEX idx_compliance_metrics_org_type ON compliance_metrics(organization_id, metric_type);
CREATE INDEX idx_compliance_metrics_period ON compliance_metrics(period_start, period_end);
CREATE INDEX idx_compliance_metrics_details ON compliance_metrics USING GIN (details);

-- notifications
CREATE INDEX idx_notifications_org_id ON notifications(organization_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- audit_logs
CREATE INDEX idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- compliance_alerts
CREATE INDEX idx_compliance_alerts_org_id ON compliance_alerts(organization_id);
CREATE INDEX idx_compliance_alerts_resolved_by ON compliance_alerts(resolved_by);
CREATE INDEX idx_compliance_alerts_org_severity ON compliance_alerts(organization_id, severity);

-- ---------------------------------------------------------------------------
-- 4.2  Partial indexes for hot queries
-- ---------------------------------------------------------------------------

-- Unread notifications per user
CREATE INDEX idx_notifications_unread
    ON notifications(user_id, created_at DESC)
    WHERE is_read = FALSE;

-- Unresolved compliance alerts
CREATE INDEX idx_compliance_alerts_unresolved
    ON compliance_alerts(organization_id, created_at DESC)
    WHERE is_resolved = FALSE;

-- Recent audit logs (last 90 days) for fast dashboard queries
CREATE INDEX idx_audit_logs_recent
    ON audit_logs(organization_id, created_at DESC)
    WHERE created_at > (NOW() - INTERVAL '90 days');

-- Active members per org (most common filter)
CREATE INDEX idx_members_active
    ON members(organization_id)
    WHERE status = 'active';

-- Active medications per org
CREATE INDEX idx_medications_active
    ON medications(organization_id, member_id)
    WHERE status = 'active';

-- Open tasks per org
CREATE INDEX idx_tasks_open
    ON tasks(organization_id, assignee_id)
    WHERE status NOT IN ('done', 'cancelled');


-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 5.1  get_user_org_id()  -  returns the primary organization of the caller
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT organization_id
    FROM profiles
    WHERE id = auth.uid()
    LIMIT 1;
$$;

COMMENT ON FUNCTION get_user_org_id IS 'Returns the organization_id of the current authenticated user from profiles.';

-- ---------------------------------------------------------------------------
-- 5.2  get_user_role()  -  returns the role of the caller
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT role
    FROM profiles
    WHERE id = auth.uid()
    LIMIT 1;
$$;

COMMENT ON FUNCTION get_user_role IS 'Returns the role enum value of the current authenticated user.';

-- ---------------------------------------------------------------------------
-- 5.3  is_super_admin()
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
          AND role = 'super_admin'
    );
$$;

COMMENT ON FUNCTION is_super_admin IS 'True when the caller has super_admin role.';

-- ---------------------------------------------------------------------------
-- 5.4  is_org_member(org_id)  -  checks memberships table
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_org_member(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM memberships
        WHERE user_id = auth.uid()
          AND organization_id = p_org_id
          AND is_active = TRUE
    )
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
          AND organization_id = p_org_id
    );
$$;

COMMENT ON FUNCTION is_org_member IS 'True when the caller belongs to the given organization (via memberships or profiles).';

-- ---------------------------------------------------------------------------
-- 5.5  update_updated_at()  -  generic trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at IS 'Sets updated_at to NOW() on every UPDATE.';

-- ---------------------------------------------------------------------------
-- 5.6  handle_new_user()  -  creates a profile row on auth.users insert
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email, 'New User'),
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user IS 'Auto-creates a profiles row when a new auth.users record is inserted.';

-- ---------------------------------------------------------------------------
-- 5.7  calculate_attendance_duration()  -  trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_attendance_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.check_in IS NOT NULL AND NEW.check_out IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.check_out - NEW.check_in))::INT / 60;
    ELSE
        NEW.duration_minutes = NULL;
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION calculate_attendance_duration IS 'Calculates duration_minutes from check_in and check_out timestamps.';

-- ---------------------------------------------------------------------------
-- 5.8  log_audit_event()  -  convenience function to insert audit log
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action      TEXT,
    p_entity_type TEXT,
    p_entity_id   UUID,
    p_old_data    JSONB DEFAULT NULL,
    p_new_data    JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO audit_logs (organization_id, user_id, action, entity_type, entity_id, old_data, new_data)
    VALUES (
        get_user_org_id(),
        auth.uid(),
        p_action,
        p_entity_type,
        p_entity_id,
        p_old_data,
        p_new_data
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

COMMENT ON FUNCTION log_audit_event IS 'Helper to insert an audit_logs row for the current user and org.';

-- ---------------------------------------------------------------------------
-- 5.9  update_life_plan_progress()  -  recalculates overall_progress
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_life_plan_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_avg INT;
    v_plan_id UUID;
BEGIN
    -- Determine which life_plan_id to recalculate
    IF TG_OP = 'DELETE' THEN
        v_plan_id := OLD.life_plan_id;
    ELSE
        v_plan_id := NEW.life_plan_id;
    END IF;

    SELECT COALESCE(AVG(progress), 0)::INT
    INTO v_avg
    FROM life_plan_goals
    WHERE life_plan_id = v_plan_id;

    UPDATE life_plans
    SET overall_progress = v_avg,
        updated_at = NOW()
    WHERE id = v_plan_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_life_plan_progress IS 'Recalculates life_plans.overall_progress as the average of its goals progress.';


-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 6.1  Auth trigger  -  create profile on signup
-- ---------------------------------------------------------------------------
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- 6.2  updated_at triggers on all tables that have updated_at
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_organizations_updated_at
    BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_organization_units_updated_at
    BEFORE UPDATE ON organization_units FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_members_updated_at
    BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_note_templates_updated_at
    BEFORE UPDATE ON note_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_service_notes_updated_at
    BEFORE UPDATE ON service_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_report_generations_updated_at
    BEFORE UPDATE ON report_generations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_life_plans_updated_at
    BEFORE UPDATE ON life_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_life_plan_goals_updated_at
    BEFORE UPDATE ON life_plan_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_medications_updated_at
    BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_transports_updated_at
    BEFORE UPDATE ON transports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_content_resources_updated_at
    BEFORE UPDATE ON content_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 6.3  Attendance duration trigger
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_attendance_duration
    BEFORE INSERT OR UPDATE ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION calculate_attendance_duration();

-- ---------------------------------------------------------------------------
-- 6.4  Life plan progress trigger
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_life_plan_goal_progress
    AFTER INSERT OR UPDATE OR DELETE ON life_plan_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_life_plan_progress();


-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on every table
ALTER TABLE organizations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_units  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships         ENABLE ROW LEVEL SECURITY;
ALTER TABLE members             ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_diagnoses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_documents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_generations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_plan_goals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_plan_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_plan_reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_resources   ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_metrics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts   ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 7.1  organizations
-- ---------------------------------------------------------------------------
-- Super admin: full access
CREATE POLICY "organizations_super_admin_all"
    ON organizations FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Org members: read their own org
CREATE POLICY "organizations_member_select"
    ON organizations FOR SELECT
    USING (is_org_member(id));

-- Org admin: update their own org
CREATE POLICY "organizations_admin_update"
    ON organizations FOR UPDATE
    USING (
        is_org_member(id)
        AND get_user_role() IN ('org_admin')
    )
    WITH CHECK (
        is_org_member(id)
        AND get_user_role() IN ('org_admin')
    );

-- ---------------------------------------------------------------------------
-- 7.2  organization_units
-- ---------------------------------------------------------------------------
CREATE POLICY "org_units_super_admin_all"
    ON organization_units FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "org_units_member_select"
    ON organization_units FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "org_units_admin_manage"
    ON organization_units FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- ---------------------------------------------------------------------------
-- 7.3  profiles
-- ---------------------------------------------------------------------------
CREATE POLICY "profiles_super_admin_all"
    ON profiles FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Users can read profiles in their own org
CREATE POLICY "profiles_org_select"
    ON profiles FOR SELECT
    USING (
        organization_id IS NULL
        OR is_org_member(organization_id)
        OR id = auth.uid()
    );

-- Users can update their own profile
CREATE POLICY "profiles_self_update"
    ON profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Org admin can update profiles in their org
CREATE POLICY "profiles_admin_update"
    ON profiles FOR UPDATE
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin')
    );

-- ---------------------------------------------------------------------------
-- 7.4  memberships
-- ---------------------------------------------------------------------------
CREATE POLICY "memberships_super_admin_all"
    ON memberships FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Users can read their own memberships
CREATE POLICY "memberships_self_select"
    ON memberships FOR SELECT
    USING (user_id = auth.uid());

-- Org admin can manage memberships in their org
CREATE POLICY "memberships_admin_manage"
    ON memberships FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin')
    );

-- ---------------------------------------------------------------------------
-- 7.5  members
-- ---------------------------------------------------------------------------
CREATE POLICY "members_super_admin_all"
    ON members FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "members_org_select"
    ON members FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "members_admin_manager_manage"
    ON members FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- Staff can insert new members
CREATE POLICY "members_staff_insert"
    ON members FOR INSERT
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() = 'staff'
    );

-- ---------------------------------------------------------------------------
-- 7.6  emergency_contacts
-- ---------------------------------------------------------------------------
CREATE POLICY "emergency_contacts_super_admin_all"
    ON emergency_contacts FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "emergency_contacts_org_select"
    ON emergency_contacts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = emergency_contacts.member_id
              AND is_org_member(m.organization_id)
        )
    );

CREATE POLICY "emergency_contacts_admin_manager_manage"
    ON emergency_contacts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = emergency_contacts.member_id
              AND is_org_member(m.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = emergency_contacts.member_id
              AND is_org_member(m.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

CREATE POLICY "emergency_contacts_staff_insert"
    ON emergency_contacts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = emergency_contacts.member_id
              AND is_org_member(m.organization_id)
        )
    );

-- ---------------------------------------------------------------------------
-- 7.7  member_diagnoses
-- ---------------------------------------------------------------------------
CREATE POLICY "member_diagnoses_super_admin_all"
    ON member_diagnoses FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "member_diagnoses_org_select"
    ON member_diagnoses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_diagnoses.member_id
              AND is_org_member(m.organization_id)
        )
    );

CREATE POLICY "member_diagnoses_admin_manager_manage"
    ON member_diagnoses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_diagnoses.member_id
              AND is_org_member(m.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_diagnoses.member_id
              AND is_org_member(m.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

CREATE POLICY "member_diagnoses_staff_insert"
    ON member_diagnoses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_diagnoses.member_id
              AND is_org_member(m.organization_id)
        )
    );

-- ---------------------------------------------------------------------------
-- 7.8  member_documents
-- ---------------------------------------------------------------------------
CREATE POLICY "member_documents_super_admin_all"
    ON member_documents FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "member_documents_org_select"
    ON member_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_documents.member_id
              AND is_org_member(m.organization_id)
        )
    );

CREATE POLICY "member_documents_admin_manager_manage"
    ON member_documents FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_documents.member_id
              AND is_org_member(m.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_documents.member_id
              AND is_org_member(m.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

CREATE POLICY "member_documents_staff_insert"
    ON member_documents FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = member_documents.member_id
              AND is_org_member(m.organization_id)
        )
    );

-- ---------------------------------------------------------------------------
-- 7.9  attendance_records
-- ---------------------------------------------------------------------------
CREATE POLICY "attendance_super_admin_all"
    ON attendance_records FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "attendance_org_select"
    ON attendance_records FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "attendance_admin_manager_manage"
    ON attendance_records FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "attendance_staff_insert"
    ON attendance_records FOR INSERT
    WITH CHECK (is_org_member(organization_id));

CREATE POLICY "attendance_staff_update_own"
    ON attendance_records FOR UPDATE
    USING (
        is_org_member(organization_id)
        AND staff_id = auth.uid()
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND staff_id = auth.uid()
    );

-- ---------------------------------------------------------------------------
-- 7.10 note_templates
-- ---------------------------------------------------------------------------
CREATE POLICY "note_templates_super_admin_all"
    ON note_templates FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "note_templates_org_select"
    ON note_templates FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "note_templates_admin_manager_manage"
    ON note_templates FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- ---------------------------------------------------------------------------
-- 7.11 service_notes  (special: staff can only edit own drafts/rejected)
-- ---------------------------------------------------------------------------
CREATE POLICY "service_notes_super_admin_all"
    ON service_notes FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "service_notes_org_select"
    ON service_notes FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "service_notes_admin_manager_manage"
    ON service_notes FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- Staff can insert notes
CREATE POLICY "service_notes_staff_insert"
    ON service_notes FOR INSERT
    WITH CHECK (
        is_org_member(organization_id)
        AND author_id = auth.uid()
    );

-- Staff can only update their own notes that are draft or rejected
CREATE POLICY "service_notes_staff_update_own"
    ON service_notes FOR UPDATE
    USING (
        is_org_member(organization_id)
        AND author_id = auth.uid()
        AND status IN ('draft', 'rejected')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND author_id = auth.uid()
    );

-- ---------------------------------------------------------------------------
-- 7.12 report_generations
-- ---------------------------------------------------------------------------
CREATE POLICY "report_gen_super_admin_all"
    ON report_generations FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "report_gen_org_select"
    ON report_generations FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "report_gen_admin_manager_manage"
    ON report_generations FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "report_gen_staff_insert"
    ON report_generations FOR INSERT
    WITH CHECK (
        is_org_member(organization_id)
        AND generated_by = auth.uid()
    );

-- ---------------------------------------------------------------------------
-- 7.13 life_plans
-- ---------------------------------------------------------------------------
CREATE POLICY "life_plans_super_admin_all"
    ON life_plans FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "life_plans_org_select"
    ON life_plans FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "life_plans_admin_manager_manage"
    ON life_plans FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "life_plans_staff_insert"
    ON life_plans FOR INSERT
    WITH CHECK (is_org_member(organization_id));

-- ---------------------------------------------------------------------------
-- 7.14 life_plan_goals
-- ---------------------------------------------------------------------------
CREATE POLICY "life_plan_goals_super_admin_all"
    ON life_plan_goals FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "life_plan_goals_org_select"
    ON life_plan_goals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_goals.life_plan_id
              AND is_org_member(lp.organization_id)
        )
    );

CREATE POLICY "life_plan_goals_admin_manager_manage"
    ON life_plan_goals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_goals.life_plan_id
              AND is_org_member(lp.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_goals.life_plan_id
              AND is_org_member(lp.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

CREATE POLICY "life_plan_goals_staff_insert"
    ON life_plan_goals FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_goals.life_plan_id
              AND is_org_member(lp.organization_id)
        )
    );

-- ---------------------------------------------------------------------------
-- 7.15 life_plan_milestones
-- ---------------------------------------------------------------------------
CREATE POLICY "life_plan_milestones_super_admin_all"
    ON life_plan_milestones FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "life_plan_milestones_org_select"
    ON life_plan_milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM life_plan_goals g
            JOIN life_plans lp ON lp.id = g.life_plan_id
            WHERE g.id = life_plan_milestones.goal_id
              AND is_org_member(lp.organization_id)
        )
    );

CREATE POLICY "life_plan_milestones_admin_manager_manage"
    ON life_plan_milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM life_plan_goals g
            JOIN life_plans lp ON lp.id = g.life_plan_id
            WHERE g.id = life_plan_milestones.goal_id
              AND is_org_member(lp.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM life_plan_goals g
            JOIN life_plans lp ON lp.id = g.life_plan_id
            WHERE g.id = life_plan_milestones.goal_id
              AND is_org_member(lp.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

CREATE POLICY "life_plan_milestones_staff_insert"
    ON life_plan_milestones FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM life_plan_goals g
            JOIN life_plans lp ON lp.id = g.life_plan_id
            WHERE g.id = life_plan_milestones.goal_id
              AND is_org_member(lp.organization_id)
        )
    );

-- ---------------------------------------------------------------------------
-- 7.16 life_plan_reviews
-- ---------------------------------------------------------------------------
CREATE POLICY "life_plan_reviews_super_admin_all"
    ON life_plan_reviews FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "life_plan_reviews_org_select"
    ON life_plan_reviews FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_reviews.life_plan_id
              AND is_org_member(lp.organization_id)
        )
    );

CREATE POLICY "life_plan_reviews_admin_manager_manage"
    ON life_plan_reviews FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_reviews.life_plan_id
              AND is_org_member(lp.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_reviews.life_plan_id
              AND is_org_member(lp.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

CREATE POLICY "life_plan_reviews_staff_insert"
    ON life_plan_reviews FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM life_plans lp
            WHERE lp.id = life_plan_reviews.life_plan_id
              AND is_org_member(lp.organization_id)
        )
    );

-- ---------------------------------------------------------------------------
-- 7.17 medications
-- ---------------------------------------------------------------------------
CREATE POLICY "medications_super_admin_all"
    ON medications FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "medications_org_select"
    ON medications FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "medications_admin_manager_manage"
    ON medications FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "medications_staff_insert"
    ON medications FOR INSERT
    WITH CHECK (is_org_member(organization_id));

-- ---------------------------------------------------------------------------
-- 7.18 medication_logs
-- ---------------------------------------------------------------------------
CREATE POLICY "medication_logs_super_admin_all"
    ON medication_logs FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "medication_logs_org_select"
    ON medication_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM medications med
            WHERE med.id = medication_logs.medication_id
              AND is_org_member(med.organization_id)
        )
    );

CREATE POLICY "medication_logs_admin_manager_manage"
    ON medication_logs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM medications med
            WHERE med.id = medication_logs.medication_id
              AND is_org_member(med.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM medications med
            WHERE med.id = medication_logs.medication_id
              AND is_org_member(med.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

-- Staff can insert medication logs
CREATE POLICY "medication_logs_staff_insert"
    ON medication_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM medications med
            WHERE med.id = medication_logs.medication_id
              AND is_org_member(med.organization_id)
        )
        AND administered_by = auth.uid()
    );

-- Staff can update their own medication logs
CREATE POLICY "medication_logs_staff_update_own"
    ON medication_logs FOR UPDATE
    USING (
        administered_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM medications med
            WHERE med.id = medication_logs.medication_id
              AND is_org_member(med.organization_id)
        )
    )
    WITH CHECK (
        administered_by = auth.uid()
    );

-- ---------------------------------------------------------------------------
-- 7.19 tasks
-- ---------------------------------------------------------------------------
CREATE POLICY "tasks_super_admin_all"
    ON tasks FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "tasks_org_select"
    ON tasks FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "tasks_admin_manager_manage"
    ON tasks FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "tasks_staff_insert"
    ON tasks FOR INSERT
    WITH CHECK (is_org_member(organization_id));

-- Staff can update tasks assigned to them
CREATE POLICY "tasks_staff_update_own"
    ON tasks FOR UPDATE
    USING (
        is_org_member(organization_id)
        AND (assignee_id = auth.uid() OR created_by = auth.uid())
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND (assignee_id = auth.uid() OR created_by = auth.uid())
    );

-- ---------------------------------------------------------------------------
-- 7.20 task_comments
-- ---------------------------------------------------------------------------
CREATE POLICY "task_comments_super_admin_all"
    ON task_comments FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "task_comments_org_select"
    ON task_comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.id = task_comments.task_id
              AND is_org_member(t.organization_id)
        )
    );

CREATE POLICY "task_comments_org_insert"
    ON task_comments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.id = task_comments.task_id
              AND is_org_member(t.organization_id)
        )
        AND author_id = auth.uid()
    );

CREATE POLICY "task_comments_admin_manager_delete"
    ON task_comments FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.id = task_comments.task_id
              AND is_org_member(t.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

-- ---------------------------------------------------------------------------
-- 7.21 appointments
-- ---------------------------------------------------------------------------
CREATE POLICY "appointments_super_admin_all"
    ON appointments FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "appointments_org_select"
    ON appointments FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "appointments_admin_manager_manage"
    ON appointments FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "appointments_staff_insert"
    ON appointments FOR INSERT
    WITH CHECK (is_org_member(organization_id));

CREATE POLICY "appointments_staff_update_own"
    ON appointments FOR UPDATE
    USING (
        is_org_member(organization_id)
        AND (responsible_id = auth.uid() OR created_by = auth.uid())
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND (responsible_id = auth.uid() OR created_by = auth.uid())
    );

-- ---------------------------------------------------------------------------
-- 7.22 transports
-- ---------------------------------------------------------------------------
CREATE POLICY "transports_super_admin_all"
    ON transports FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "transports_org_select"
    ON transports FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "transports_admin_manager_manage"
    ON transports FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

CREATE POLICY "transports_staff_insert"
    ON transports FOR INSERT
    WITH CHECK (is_org_member(organization_id));

CREATE POLICY "transports_driver_update"
    ON transports FOR UPDATE
    USING (
        is_org_member(organization_id)
        AND driver_id = auth.uid()
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND driver_id = auth.uid()
    );

-- ---------------------------------------------------------------------------
-- 7.23 content_resources
-- ---------------------------------------------------------------------------
CREATE POLICY "content_resources_super_admin_all"
    ON content_resources FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "content_resources_org_select"
    ON content_resources FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "content_resources_admin_manager_manage"
    ON content_resources FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- ---------------------------------------------------------------------------
-- 7.24 content_assignments
-- ---------------------------------------------------------------------------
CREATE POLICY "content_assignments_super_admin_all"
    ON content_assignments FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "content_assignments_org_select"
    ON content_assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM content_resources cr
            WHERE cr.id = content_assignments.resource_id
              AND is_org_member(cr.organization_id)
        )
    );

CREATE POLICY "content_assignments_admin_manager_manage"
    ON content_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM content_resources cr
            WHERE cr.id = content_assignments.resource_id
              AND is_org_member(cr.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM content_resources cr
            WHERE cr.id = content_assignments.resource_id
              AND is_org_member(cr.organization_id)
              AND get_user_role() IN ('org_admin', 'manager')
        )
    );

-- Assignees can update their own progress
CREATE POLICY "content_assignments_self_update"
    ON content_assignments FOR UPDATE
    USING (assignee_id = auth.uid())
    WITH CHECK (assignee_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7.25 compliance_metrics
-- ---------------------------------------------------------------------------
CREATE POLICY "compliance_metrics_super_admin_all"
    ON compliance_metrics FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "compliance_metrics_org_select"
    ON compliance_metrics FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "compliance_metrics_admin_manage"
    ON compliance_metrics FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- ---------------------------------------------------------------------------
-- 7.26 notifications  (users can only see their own)
-- ---------------------------------------------------------------------------
CREATE POLICY "notifications_super_admin_all"
    ON notifications FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "notifications_self_select"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "notifications_self_update"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Admins and managers can insert notifications for their org
CREATE POLICY "notifications_admin_insert"
    ON notifications FOR INSERT
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );

-- System / service-role can also insert (no RLS bypass needed for service role,
-- but staff triggering notifications via functions will use SECURITY DEFINER)

-- ---------------------------------------------------------------------------
-- 7.27 audit_logs  (only org_admin and super_admin can view)
-- ---------------------------------------------------------------------------
CREATE POLICY "audit_logs_super_admin_all"
    ON audit_logs FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "audit_logs_admin_select"
    ON audit_logs FOR SELECT
    USING (
        organization_id IS NOT NULL
        AND is_org_member(organization_id)
        AND get_user_role() = 'org_admin'
    );

-- Insert is allowed for the log_audit_event function (SECURITY DEFINER)
-- Regular users should not insert directly
CREATE POLICY "audit_logs_system_insert"
    ON audit_logs FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        OR is_super_admin()
    );

-- ---------------------------------------------------------------------------
-- 7.28 compliance_alerts
-- ---------------------------------------------------------------------------
CREATE POLICY "compliance_alerts_super_admin_all"
    ON compliance_alerts FOR ALL
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

CREATE POLICY "compliance_alerts_org_select"
    ON compliance_alerts FOR SELECT
    USING (is_org_member(organization_id));

CREATE POLICY "compliance_alerts_admin_manage"
    ON compliance_alerts FOR ALL
    USING (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    )
    WITH CHECK (
        is_org_member(organization_id)
        AND get_user_role() IN ('org_admin', 'manager')
    );


-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- Total: 28 tables, 12 enums, 9 helper functions, 18 triggers, ~100 indexes,
--        ~80 RLS policies.
-- ============================================================================
