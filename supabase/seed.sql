-- ============================================================================
-- CareFlow - Comprehensive Seed Data
-- Description: Demo data for development and testing
-- Version: 2.0.0
--
-- IMPORTANT: user_profiles references auth.users(id). In production, the
-- handle_new_user() trigger creates profiles automatically when a user signs
-- up via Supabase Auth. For seeding, we insert directly into user_profiles
-- using fixed UUIDs. In a real environment, corresponding auth.users rows
-- must exist (or the FK must be temporarily deferred/disabled).
-- ============================================================================

-- Clean slate (order matters due to FK constraints)
TRUNCATE
    compliance_alerts,
    audit_logs,
    notifications,
    content_assignments,
    content_resources,
    life_plan_reviews,
    life_plan_milestones,
    life_plan_goals,
    life_plans,
    appointments,
    task_comments,
    tasks,
    medication_logs,
    medications,
    attendance_records,
    note_templates,
    service_notes,
    member_documents,
    member_diagnoses,
    emergency_contacts,
    members,
    user_profiles,
    locations,
    organizations
CASCADE;

-- ===========================================
-- 1. ORGANIZATIONS (2)
-- ===========================================
INSERT INTO organizations (id, name, slug, description, address, phone, email, website, plan, max_members, max_users, settings) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Sunrise Care Center',
    'sunrise-care-center',
    'A leading provider of person-centered care services in Portland.',
    '{"street": "450 Sunrise Boulevard", "city": "Portland", "state": "OR", "zip": "97201"}',
    '+1-503-555-0100',
    'admin@sunrisecare.example.com',
    'https://sunrisecare.example.com',
    'starter',
    50,
    10,
    '{"timezone": "America/Los_Angeles", "language": "en", "features": {"ai_notes": true, "life_plans": true, "medications": true}}'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Harbor Health Services',
    'harbor-health-services',
    'Comprehensive health and disability support services across Washington.',
    '{"street": "800 Harbor Drive", "city": "Seattle", "state": "WA", "zip": "98101"}',
    '+1-206-555-0200',
    'admin@harborhealth.example.com',
    'https://harborhealth.example.com',
    'professional',
    100,
    25,
    '{"timezone": "America/Los_Angeles", "language": "en", "features": {"ai_notes": true, "life_plans": true, "medications": true, "transports": true}}'
);

-- ===========================================
-- 2. LOCATIONS (3 for org1, 2 for org2)
-- ===========================================
INSERT INTO locations (id, organization_id, name, address, phone, is_active, operating_hours) VALUES
-- Sunrise Care Center locations
('loc-00001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Main Campus', '450 Sunrise Blvd, Portland, OR 97201', '+1-503-555-0101', TRUE, '{"mon-fri": "07:00-19:00", "sat": "08:00-16:00", "sun": "closed"}'),
('loc-00002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'Eastside Day Center', '1200 E Burnside St, Portland, OR 97214', '+1-503-555-0102', TRUE, '{"mon-fri": "08:00-17:00", "sat": "closed", "sun": "closed"}'),
('loc-00003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 'Residential Wing A', '450 Sunrise Blvd Wing A, Portland, OR 97201', '+1-503-555-0103', TRUE, '{"mon-sun": "00:00-23:59"}'),
-- Harbor Health Services locations
('loc-00004-0004-0004-0004-000000000004', '22222222-2222-2222-2222-222222222222', 'Downtown Clinic', '800 Harbor Dr, Seattle, WA 98101', '+1-206-555-0201', TRUE, '{"mon-fri": "08:00-18:00", "sat": "09:00-14:00", "sun": "closed"}'),
('loc-00005-0005-0005-0005-000000000005', '22222222-2222-2222-2222-222222222222', 'Northgate Community Hub', '350 Northgate Way, Seattle, WA 98125', '+1-206-555-0202', TRUE, '{"mon-fri": "09:00-17:00", "sat": "closed", "sun": "closed"}');

-- ===========================================
-- 3. USER PROFILES (6 staff with fixed UUIDs)
-- In production, auth.users rows are created first via Supabase Auth,
-- then the handle_new_user() trigger auto-creates user_profiles.
-- ===========================================
INSERT INTO user_profiles (id, organization_id, email, full_name, avatar_url, role, phone, job_title, is_active) VALUES
-- UUID: aaaaaaaa-... Sarah Chen, org_admin at Sunrise
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'sarah.chen@sunrisecare.example.com', 'Sarah Chen', NULL, 'org_admin', '+1-503-555-0201', 'Center Director', TRUE),
-- UUID: bbbbbbbb-... James Okonkwo, manager at Sunrise
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'james.okonkwo@sunrisecare.example.com', 'James Okonkwo', NULL, 'manager', '+1-503-555-0202', 'Care Manager', TRUE),
-- UUID: cccccccc-... Maria Santos, staff at Sunrise
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'maria.santos@sunrisecare.example.com', 'Maria Santos', NULL, 'staff', '+1-503-555-0203', 'Care Coordinator', TRUE),
-- UUID: dddddddd-... Alex Nguyen, staff at Sunrise
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'alex.nguyen@sunrisecare.example.com', 'Alex Nguyen', NULL, 'staff', '+1-503-555-0204', 'Support Worker', TRUE),
-- UUID: eeeeeeee-... Lisa Thompson, org_admin at Harbor
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'lisa.thompson@harborhealth.example.com', 'Lisa Thompson', NULL, 'org_admin', '+1-206-555-0205', 'Clinical Director', TRUE),
-- UUID: ffffffff-... Daniel Kim, staff at Harbor
('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'daniel.kim@harborhealth.example.com', 'Daniel Kim', NULL, 'staff', '+1-206-555-0206', 'Behavioral Analyst', TRUE);

-- ===========================================
-- 4. MEMBERS (25 total: 20 Sunrise, 5 Harbor)
-- ===========================================
INSERT INTO members (id, organization_id, full_name, date_of_birth, gender, address, phone, email, status, primary_location_id, admission_date, notes, metadata, created_by) VALUES
-- Sunrise Care Center members (20)
('m0000001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Robert Williams',   '1958-03-15', 'male',   '{"street":"123 Oak Ln","city":"Portland","state":"OR","zip":"97201"}', '+1-503-555-1001', 'rwilliams@example.com',  'active',     'loc-00001-0001-0001-0001-000000000001', '2024-01-10', 'Enjoys gardening. Requires mobility assistance.', '{"allergies":["penicillin"],"blood_type":"A+"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'Eleanor Mitchell',   '1945-07-22', 'female', '{"street":"456 Maple Ave","city":"Portland","state":"OR","zip":"97202"}', '+1-503-555-1002', 'emitchell@example.com',  'active',     'loc-00003-0003-0003-0003-000000000003', '2023-11-05', 'Former school teacher. Loves music therapy.', '{"blood_type":"O+"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 'David Park',         '1972-11-08', 'male',   '{"street":"789 Pine St","city":"Portland","state":"OR","zip":"97203"}', '+1-503-555-1003', 'dpark@example.com',      'active',     'loc-00001-0001-0001-0001-000000000001', '2024-03-20', 'Participates in art therapy. Goal: independent living.', '{"allergies":["latex"],"blood_type":"B+"}', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('m0000004-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', 'Susan Harper',       '1960-05-30', 'female', '{"street":"321 Elm Dr","city":"Portland","state":"OR","zip":"97204"}', '+1-503-555-1004', 'sharper@example.com',    'active',     'loc-00002-0002-0002-0002-000000000002', '2024-02-14', 'Attends day program three times per week.', '{}', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('m0000005-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', 'Michael Torres',     '1980-09-12', 'male',   '{"street":"654 Cedar Blvd","city":"Portland","state":"OR","zip":"97205"}', '+1-503-555-1005', 'mtorres@example.com',    'active',     'loc-00001-0001-0001-0001-000000000001', '2023-08-01', 'Works at community garden. Excellent progress.', '{"allergies":["shellfish"],"blood_type":"AB+"}', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('m0000006-0006-0006-0006-000000000006', '11111111-1111-1111-1111-111111111111', 'Patricia Jones',     '1955-12-03', 'female', '{"street":"987 Birch Rd","city":"Portland","state":"OR","zip":"97206"}', '+1-503-555-1006', NULL,                     'active',     'loc-00003-0003-0003-0003-000000000003', '2024-04-01', 'Requires dietary monitoring. Diabetes management.', '{"allergies":["sulfa drugs"],"blood_type":"A-"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000007-0007-0007-0007-000000000007', '11111111-1111-1111-1111-111111111111', 'James Richardson',   '1968-02-18', 'male',   '{"street":"147 Walnut St","city":"Portland","state":"OR","zip":"97207"}', '+1-503-555-1007', 'jrichardson@example.com','active',     'loc-00001-0001-0001-0001-000000000001', '2023-12-15', 'Enjoys woodworking. Progressing with social skills.', '{}', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('m0000008-0008-0008-0008-000000000008', '11111111-1111-1111-1111-111111111111', 'Linda Chang',        '1950-08-25', 'female', '{"street":"258 Ash Ave","city":"Portland","state":"OR","zip":"97208"}', '+1-503-555-1008', 'lchang@example.com',     'active',     'loc-00002-0002-0002-0002-000000000002', '2024-01-22', 'Bilingual English/Mandarin. Prefers mornings.', '{"blood_type":"O-"}', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('m0000009-0009-0009-0009-000000000009', '11111111-1111-1111-1111-111111111111', 'Thomas Brown',       '1975-04-07', 'male',   '{"street":"369 Spruce Ln","city":"Portland","state":"OR","zip":"97209"}', '+1-503-555-1009', NULL,                     'active',     'loc-00001-0001-0001-0001-000000000001', '2023-09-10', 'Library volunteer. Focus on vocational training.', '{}', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('m0000010-0010-0010-0010-000000000010', '11111111-1111-1111-1111-111111111111', 'Margaret White',     '1942-06-14', 'female', '{"street":"741 Poplar Dr","city":"Portland","state":"OR","zip":"97210"}', '+1-503-555-1010', 'mwhite@example.com',     'active',     'loc-00003-0003-0003-0003-000000000003', '2023-07-20', 'Painting and crafts. Needs hearing assistance.', '{"allergies":["aspirin"],"blood_type":"B-"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000011-0011-0011-0011-000000000011', '11111111-1111-1111-1111-111111111111', 'William Davis',      '1963-10-29', 'male',   '{"street":"852 Willow Way","city":"Portland","state":"OR","zip":"97211"}', '+1-503-555-1011', 'wdavis@example.com',     'active',     'loc-00001-0001-0001-0001-000000000001', '2024-05-01', 'Settling in well. Enjoys cooking classes.', '{}', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('m0000012-0012-0012-0012-000000000012', '11111111-1111-1111-1111-111111111111', 'Dorothy Anderson',   '1948-01-16', 'female', '{"street":"963 Cherry Ct","city":"Portland","state":"OR","zip":"97212"}', '+1-503-555-1012', NULL,                     'inactive',   'loc-00002-0002-0002-0002-000000000002', '2023-06-15', 'Temporarily inactive due to hospital stay.', '{}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000013-0013-0013-0013-000000000013', '11111111-1111-1111-1111-111111111111', 'Richard Lee',        '1970-03-21', 'male',   '{"street":"174 Redwood Rd","city":"Portland","state":"OR","zip":"97213"}', '+1-503-555-1013', 'rlee@example.com',       'active',     'loc-00001-0001-0001-0001-000000000001', '2024-02-28', 'Tech enthusiast. Uses tablet for communication.', '{}', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('m0000014-0014-0014-0014-000000000014', '11111111-1111-1111-1111-111111111111', 'Barbara Wilson',     '1957-11-05', 'female', '{"street":"285 Magnolia St","city":"Portland","state":"OR","zip":"97214"}', '+1-503-555-1014', 'bwilson@example.com',    'active',     'loc-00003-0003-0003-0003-000000000003', '2023-10-08', 'Yoga and meditation group participant.', '{"allergies":["nuts"],"blood_type":"A+"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000015-0015-0015-0015-000000000015', '11111111-1111-1111-1111-111111111111', 'Charles Martin',     '1965-07-19', 'male',   '{"street":"396 Dogwood Dr","city":"Portland","state":"OR","zip":"97215"}', '+1-503-555-1015', NULL,                     'on_hold',    'loc-00001-0001-0001-0001-000000000001', '2024-01-05', 'On hold pending reassessment.', '{}', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('m0000016-0016-0016-0016-000000000016', '11111111-1111-1111-1111-111111111111', 'Jennifer Taylor',    '1982-09-28', 'female', '{"street":"507 Hazel Ln","city":"Portland","state":"OR","zip":"97216"}', '+1-503-555-1016', 'jtaylor@example.com',    'active',     'loc-00002-0002-0002-0002-000000000002', '2024-03-15', 'Young adult program. Employment readiness focus.', '{}', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('m0000017-0017-0017-0017-000000000017', '11111111-1111-1111-1111-111111111111', 'George Harris',      '1953-04-11', 'male',   '{"street":"618 Ivy Ct","city":"Portland","state":"OR","zip":"97217"}', '+1-503-555-1017', 'gharris@example.com',    'active',     'loc-00003-0003-0003-0003-000000000003', '2023-05-20', 'Military veteran. Enjoys chess and board games.', '{"blood_type":"O+"}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000018-0018-0018-0018-000000000018', '11111111-1111-1111-1111-111111111111', 'Nancy Clark',        '1978-12-07', 'female', '{"street":"729 Laurel Ave","city":"Portland","state":"OR","zip":"97218"}', '+1-503-555-1018', 'nclark@example.com',     'active',     'loc-00001-0001-0001-0001-000000000001', '2024-04-10', 'Active in community outreach. Strong advocate.', '{}', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('m0000019-0019-0019-0019-000000000019', '11111111-1111-1111-1111-111111111111', 'Kenneth Robinson',   '1960-08-03', 'male',   '{"street":"840 Oakwood Pl","city":"Portland","state":"OR","zip":"97219"}', '+1-503-555-1019', NULL,                     'discharged', 'loc-00001-0001-0001-0001-000000000001', '2023-03-01', 'Successfully transitioned to independent living.', '{}', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('m0000020-0020-0020-0020-000000000020', '11111111-1111-1111-1111-111111111111', 'Carol Adams',        '1947-02-26', 'female', '{"street":"951 Palm Rd","city":"Portland","state":"OR","zip":"97220"}', '+1-503-555-1020', 'cadams@example.com',     'active',     'loc-00003-0003-0003-0003-000000000003', '2024-05-15', 'Loves gardening and baking.', '{}', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
-- Harbor Health Services members (5)
('m0000021-0021-0021-0021-000000000021', '22222222-2222-2222-2222-222222222222', 'Amanda Foster',      '1985-06-10', 'female', '{"street":"100 1st Ave","city":"Seattle","state":"WA","zip":"98101"}', '+1-206-555-1021', 'afoster@example.com',    'active',     'loc-00004-0004-0004-0004-000000000004', '2024-06-01', 'New participant. Community integration focus.', '{}', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('m0000022-0022-0022-0022-000000000022', '22222222-2222-2222-2222-222222222222', 'Brian Maxwell',      '1970-02-14', 'male',   '{"street":"200 2nd Ave","city":"Seattle","state":"WA","zip":"98102"}', '+1-206-555-1022', 'bmaxwell@example.com',   'active',     'loc-00004-0004-0004-0004-000000000004', '2024-01-15', 'Vocational rehabilitation. Part-time retail.', '{}', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('m0000023-0023-0023-0023-000000000023', '22222222-2222-2222-2222-222222222222', 'Christina Reyes',    '1992-08-30', 'female', '{"street":"300 3rd Ave","city":"Seattle","state":"WA","zip":"98103"}', '+1-206-555-1023', 'creyes@example.com',     'active',     'loc-00005-0005-0005-0005-000000000005', '2024-03-10', 'Young adult. Transition to employment.', '{}', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
('m0000024-0024-0024-0024-000000000024', '22222222-2222-2222-2222-222222222222', 'Derek Washington',   '1965-11-22', 'male',   '{"street":"400 4th Ave","city":"Seattle","state":"WA","zip":"98104"}', '+1-206-555-1024', NULL,                     'inactive',   'loc-00005-0005-0005-0005-000000000005', '2023-10-01', 'On medical leave. Expected return soon.', '{}', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('m0000025-0025-0025-0025-000000000025', '22222222-2222-2222-2222-222222222222', 'Eva Johansson',      '1978-04-17', 'female', '{"street":"500 5th Ave","city":"Seattle","state":"WA","zip":"98105"}', '+1-206-555-1025', 'ejohansson@example.com', 'active',     'loc-00004-0004-0004-0004-000000000004', '2024-07-01', 'Bilingual Swedish/English. Art therapy program.', '{"allergies":["dairy"]}', 'ffffffff-ffff-ffff-ffff-ffffffffffff');

-- ===========================================
-- 5. EMERGENCY CONTACTS (12)
-- ===========================================
INSERT INTO emergency_contacts (member_id, name, relationship, phone, email, is_primary) VALUES
('m0000001-0001-0001-0001-000000000001', 'Janet Williams',   'Spouse',   '+1-503-555-2001', 'jwilliams@example.com', TRUE),
('m0000001-0001-0001-0001-000000000001', 'Mark Williams',    'Son',      '+1-503-555-2002', 'mwilliams@example.com', FALSE),
('m0000002-0002-0002-0002-000000000002', 'Tom Mitchell',     'Son',      '+1-503-555-2003', 'tmitchell@example.com', TRUE),
('m0000003-0003-0003-0003-000000000003', 'Grace Park',       'Sister',   '+1-503-555-2004', 'gpark@example.com',     TRUE),
('m0000005-0005-0005-0005-000000000005', 'Elena Torres',     'Mother',   '+1-503-555-2005', 'etorres@example.com',   TRUE),
('m0000006-0006-0006-0006-000000000006', 'Steven Jones',     'Husband',  '+1-503-555-2006', 'sjones@example.com',    TRUE),
('m0000010-0010-0010-0010-000000000010', 'Alice White',      'Daughter', '+1-503-555-2007', 'awhite@example.com',    TRUE),
('m0000014-0014-0014-0014-000000000014', 'Frank Wilson',     'Brother',  '+1-503-555-2008', 'fwilson@example.com',   TRUE),
('m0000017-0017-0017-0017-000000000017', 'Diane Harris',     'Wife',     '+1-503-555-2009', 'dharris@example.com',   TRUE),
('m0000021-0021-0021-0021-000000000021', 'Ray Foster',       'Father',   '+1-206-555-2010', 'rfoster@example.com',   TRUE),
('m0000022-0022-0022-0022-000000000022', 'Laura Maxwell',    'Wife',     '+1-206-555-2011', 'lmaxwell@example.com',  TRUE),
('m0000025-0025-0025-0025-000000000025', 'Karl Johansson',   'Husband',  '+1-206-555-2012', 'kjohansson@example.com',TRUE);

-- ===========================================
-- 6. MEMBER DIAGNOSES (8)
-- ===========================================
INSERT INTO member_diagnoses (member_id, diagnosis_code, diagnosis_name, description, diagnosed_date, diagnosed_by, is_active) VALUES
('m0000001-0001-0001-0001-000000000001', 'F32.1', 'Major Depressive Disorder, moderate', 'Moderate episodes, responds well to current treatment plan.', '2022-06-10', 'Dr. Sarah Kim', TRUE),
('m0000002-0002-0002-0002-000000000002', 'F03.90', 'Unspecified Dementia', 'Early-stage dementia. Cognitive decline noted over past 18 months.', '2023-03-15', 'Dr. Robert Chen', TRUE),
('m0000003-0003-0003-0003-000000000003', 'F84.0', 'Autism Spectrum Disorder', 'Level 1 support needs. Strong in visual and systematic tasks.', '2010-09-20', 'Dr. Maria Lopez', TRUE),
('m0000005-0005-0005-0005-000000000005', 'F31.9', 'Bipolar Disorder, unspecified', 'Stable on current medication regimen. Quarterly reviews.', '2018-11-05', 'Dr. James Park', TRUE),
('m0000006-0006-0006-0006-000000000006', 'E11.9', 'Type 2 Diabetes Mellitus', 'Managed with diet and Metformin. HbA1c target 7.0%.', '2019-04-22', 'Dr. Amy Walsh', TRUE),
('m0000010-0010-0010-0010-000000000010', 'H91.90', 'Hearing Loss, bilateral', 'Uses hearing aids. Preferential seating in group activities.', '2020-01-10', 'Dr. Kevin Cho', TRUE),
('m0000014-0014-0014-0014-000000000014', 'M54.5', 'Low Back Pain', 'Chronic. Physical therapy twice weekly. Avoid heavy lifting.', '2021-08-17', 'Dr. Lisa Brown', TRUE),
('m0000022-0022-0022-0022-000000000022', 'F41.1', 'Generalized Anxiety Disorder', 'Responds well to CBT. Medication: Sertraline 50mg daily.', '2023-05-01', 'Dr. Natalie Green', TRUE);

-- ===========================================
-- 7. NOTE TEMPLATES (5)
-- ===========================================
INSERT INTO note_templates (id, organization_id, title, content, category, is_active) VALUES
('nt000001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Daily Support Note',        'Date: {{date}}\nMember: {{member_name}}\n\nActivities participated in:\n- \n\nMood/Behavior observations:\n\nGoals worked on:\n\nFollow-up needed:', 'daily', TRUE),
('nt000002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'Incident Report',           'Date/Time: {{datetime}}\nMember: {{member_name}}\nLocation: {{location}}\n\nDescription of incident:\n\nAction taken:\n\nWitnesses:\n\nFollow-up plan:', 'incident', TRUE),
('nt000003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 'Medication Administration', 'Date: {{date}}\nMember: {{member_name}}\n\nMedication administered:\nDose:\nTime:\nRoute:\n\nObservations after administration:\n\nSide effects noted:', 'medication', TRUE),
('nt000004-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', 'Monthly Review',            'Review Period: {{start_date}} to {{end_date}}\nMember: {{member_name}}\n\nProgress summary:\n\nGoals met:\n\nChallenges:\n\nRecommendations for next period:', 'review', TRUE),
('nt000005-0005-0005-0005-000000000005', '22222222-2222-2222-2222-222222222222', 'Behavioral Assessment',     'Date: {{date}}\nMember: {{member_name}}\nAssessor: {{staff_name}}\n\nBehavior observed:\nAntecedent:\nBehavior:\nConsequence:\n\nRecommended intervention:', 'assessment', TRUE);

-- ===========================================
-- 8. SERVICE NOTES (60)
-- ===========================================
INSERT INTO service_notes (organization_id, member_id, author_id, content, summary, tags, template_id, status, is_ai_generated, created_at) VALUES
-- Draft notes
('11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Robert participated in morning exercise group. He walked 15 minutes on the track with a walker. Mood was positive and he socialized with peers during the cooldown period. No complaints of pain reported.', 'Morning exercise participation. Positive mood.', '{daily,exercise,mobility}', 'nt000001-0001-0001-0001-000000000001', 'draft', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000002-0002-0002-0002-000000000002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Eleanor attended music therapy session. She was able to recall lyrics to several familiar songs and appeared emotionally engaged. Brief confusion noted when transitioning between activities but redirected successfully.', 'Music therapy session. Good recall, mild confusion on transitions.', '{daily,music-therapy,cognition}', NULL, 'draft', FALSE, NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'm0000003-0003-0003-0003-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'David completed a watercolor painting during art therapy. He demonstrated improved fine motor control compared to last month. He expressed interest in displaying his work in the community gallery.', 'Art therapy session. Improved fine motor skills. Wants gallery display.', '{daily,art-therapy,progress}', NULL, 'draft', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000004-0004-0004-0004-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Susan arrived at the day center at 9:15 AM. She participated in the cooking skills workshop and successfully prepared a simple pasta dish with minimal assistance. Staff noted she was quieter than usual during lunch.', 'Day program attendance. Cooking workshop completed with minimal help.', '{daily,cooking,life-skills}', 'nt000001-0001-0001-0001-000000000001', 'draft', FALSE, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Michael spent the morning at the community garden. He watered plants, weeded two raised beds, and helped a new volunteer with planting seedlings. Demonstrated excellent leadership and communication.', 'Community garden work. Leadership demonstrated with new volunteer.', '{daily,garden,vocational,leadership}', NULL, 'draft', FALSE, NOW() - INTERVAL '1 day'),
-- Pending review notes
('11111111-1111-1111-1111-111111111111', 'm0000006-0006-0006-0006-000000000006', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Patricia blood glucose reading this morning was 145 mg/dL (target <140). Dietary review conducted; she acknowledged consuming extra carbohydrates at dinner last night. Encouraged adherence to meal plan. Will monitor closely for the next 48 hours.', 'Elevated blood glucose. Dietary counseling provided.', '{health,diabetes,monitoring}', 'nt000003-0003-0003-0003-000000000003', 'pending_review', FALSE, NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'm0000007-0007-0007-0007-000000000007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'James worked on a birdhouse project in the woodworking shop. He followed the blueprint with minimal prompts and completed the assembly phase. Social interaction with workshop peers was appropriate and he initiated conversation twice.', 'Woodworking session. Blueprint following. Positive social interaction.', '{daily,woodworking,social-skills}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'm0000008-0008-0008-0008-000000000008', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Linda participated in the bilingual reading circle. She read a short passage in Mandarin to the group and helped translate vocabulary for other participants. Engaged and enthusiastic throughout the session.', 'Bilingual reading circle. Read in Mandarin and helped translate.', '{daily,language,social,reading}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000009-0009-0009-0009-000000000009', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Thomas completed his library volunteer shift from 10 AM to 1 PM. Supervisor feedback was positive, noting he shelved over 200 books accurately. Brief anxiety noted during a crowded period but he used coping strategies independently.', 'Library volunteer shift completed. Good supervisor feedback.', '{vocational,library,anxiety-management}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm0000010-0010-0010-0010-000000000010', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Margaret attended the painting class today. She was able to hear instructor directions with her new hearing aids positioned correctly. Completed a landscape painting. She mentioned some discomfort in her left ear which we will follow up on.', 'Painting class. New hearing aids working well. Minor ear discomfort.', '{daily,painting,hearing,health}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '2 days'),
-- Approved notes
('11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Weekly review: Robert has shown consistent improvement in mobility over the past week. He is now able to walk 20 minutes with a walker compared to 10 minutes last month. Mood has been stable. He expressed a desire to start using a cane instead of the walker.', 'Weekly review. Mobility improvement. Wants to transition to cane.', '{review,mobility,progress}', 'nt000004-0004-0004-0004-000000000004', 'approved', FALSE, NOW() - INTERVAL '7 days'),
('11111111-1111-1111-1111-111111111111', 'm0000003-0003-0003-0003-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Monthly progress report for David. Art therapy goals on track. Independent living skills have improved with consistent meal preparation practice. He now cooks breakfast independently three days per week. Social engagement continues to grow.', 'Monthly progress. Art and cooking goals on track. Growing independence.', '{monthly,progress,independent-living}', 'nt000004-0004-0004-0004-000000000004', 'approved', FALSE, NOW() - INTERVAL '14 days'),
('11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Michael successfully completed his vocational assessment at the garden center. Supervisor recommended him for extended hours. He demonstrates reliability, task completion, and positive workplace social skills.', 'Vocational assessment passed. Recommended for extended hours.', '{vocational,assessment,milestone}', NULL, 'approved', FALSE, NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-111111111111', 'm0000011-0011-0011-0011-000000000011', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'William attended his first cooking class today. He was engaged and followed instructions well. He made a simple soup from scratch with staff supervision. He expressed interest in attending the class weekly.', 'First cooking class. Engaged and successful. Wants to attend weekly.', '{daily,cooking,new-activity}', NULL, 'approved', FALSE, NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'm0000013-0013-0013-0013-000000000013', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Richard explored new assistive technology apps on his tablet. He successfully set up a daily schedule reminder and a picture-based communication board. Staff provided initial guidance; he completed setup independently.', 'Assistive tech setup. Schedule reminders and communication board.', '{technology,communication,independence}', NULL, 'approved', FALSE, NOW() - INTERVAL '6 days'),
('11111111-1111-1111-1111-111111111111', 'm0000014-0014-0014-0014-000000000014', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Barbara participated in yoga class and reported reduced back pain afterward (self-rated 3/10 vs usual 6/10). She completed all modified poses. Meditation portion calmed her noticeably.', 'Yoga class. Reduced back pain. Completed all modified poses.', '{daily,yoga,pain-management,health}', NULL, 'approved', FALSE, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'm0000016-0016-0016-0016-000000000016', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Jennifer completed a mock job interview as part of employment readiness. She maintained eye contact, answered behavioral questions appropriately, and dressed professionally. Areas for improvement: reducing filler words.', 'Mock job interview completed. Strong performance. Work on filler words.', '{vocational,interview,employment-readiness}', NULL, 'approved', FALSE, NOW() - INTERVAL '8 days'),
('11111111-1111-1111-1111-111111111111', 'm0000017-0017-0017-0017-000000000017', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'George hosted the weekly chess club meeting. Four members attended. He taught a new participant basic openings and demonstrated patience and good instructional skills. Mood was upbeat throughout.', 'Chess club hosted. Taught new participant. Good social engagement.', '{daily,chess,social,recreation}', NULL, 'approved', FALSE, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm0000018-0018-0018-0018-000000000018', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Nancy volunteered at the community food bank this afternoon. She sorted donations for 2 hours and interacted positively with other volunteers. She advocated for bringing more members to volunteer next week.', 'Food bank volunteering. 2 hours sorting. Advocacy for more participation.', '{vocational,volunteering,community,advocacy}', NULL, 'approved', FALSE, NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'm0000020-0020-0020-0020-000000000020', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Carol participated in the baking workshop. She made banana bread following a visual recipe card. She was able to measure ingredients independently and use the oven timer. Product turned out well and she shared with peers.', 'Baking workshop. Banana bread made independently. Shared with peers.', '{daily,baking,life-skills,social}', NULL, 'approved', FALSE, NOW() - INTERVAL '2 days'),
-- Rejected notes
('11111111-1111-1111-1111-111111111111', 'm0000009-0009-0009-0009-000000000009', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Thomas had a good day at the library.', NULL, '{daily}', NULL, 'rejected', FALSE, NOW() - INTERVAL '6 days'),
-- AI-generated notes
('11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Robert demonstrated improved balance during physical therapy today. He completed 3 sets of standing exercises and maintained proper form. Therapist noted reduced reliance on walker for support. He reported feeling confident about his progress and mentioned wanting to try walking with just a cane soon.', 'PT session. Improved balance. Reduced walker reliance.', '{ai-generated,physical-therapy,progress}', NULL, 'approved', TRUE, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Michael attended the job readiness workshop covering workplace communication. He practiced phone etiquette and email writing. He composed a professional email independently and received positive peer feedback. Staff recommend advancing to job shadowing phase.', 'Job readiness workshop. Email writing practice. Ready for job shadowing.', '{ai-generated,vocational,communication}', NULL, 'pending_review', TRUE, NOW() - INTERVAL '2 days'),
-- Harbor Health notes
('22222222-2222-2222-2222-222222222222', 'm0000021-0021-0021-0021-000000000021', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Amanda participated in community integration outing to the local farmers market. She navigated the market independently, made purchases, and engaged in brief social exchanges with vendors. Showed confidence in public settings.', 'Community outing to farmers market. Independent navigation and purchases.', '{daily,community,integration,independence}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'm0000022-0022-0022-0022-000000000022', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Brian completed his shift at the retail store. Manager reported positive performance. Brian handled a challenging customer interaction calmly using the anxiety management techniques practiced in sessions. Breakthrough moment.', 'Retail shift completed. Managed difficult customer interaction well.', '{vocational,retail,anxiety-management,milestone}', NULL, 'approved', FALSE, NOW() - INTERVAL '3 days'),
('22222222-2222-2222-2222-222222222222', 'm0000023-0023-0023-0023-000000000023', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Christina attended a resume writing workshop. She updated her resume with recent volunteer experience and practiced explaining employment gaps confidently. Next step: submit applications to two target employers this week.', 'Resume workshop. Updated resume. Plan to submit 2 applications.', '{vocational,resume,employment}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'm0000025-0025-0025-0025-000000000025', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Eva participated in art therapy using mixed media. She created a collage representing her personal journey. Therapist noted the work demonstrated increased self-awareness and emotional expression compared to previous sessions.', 'Art therapy. Mixed media collage. Improved emotional expression.', '{daily,art-therapy,emotional-expression}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
-- More bulk notes across various members and dates
('11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Robert attended group social skills session. He initiated conversation with two new participants and helped guide a role-playing exercise. Facilitator noted significant improvement in his confidence levels during group settings.', 'Group social skills. Initiated conversation. Improved confidence.', '{daily,social-skills,group}', NULL, 'approved', FALSE, NOW() - INTERVAL '9 days'),
('11111111-1111-1111-1111-111111111111', 'm0000002-0002-0002-0002-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Eleanor joined the morning reminiscence group. She shared vivid memories of her teaching career and recognized photos from the 1970s. Mild orientation difficulty with current date but overall positive cognitive engagement.', 'Reminiscence group. Vivid recall of teaching career. Date confusion.', '{daily,reminiscence,cognition}', NULL, 'approved', FALSE, NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'm0000004-0004-0004-0004-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Susan practiced public transportation skills today. She independently planned a bus route using the transit app on her phone, boarded the correct bus, and arrived at the Eastside Day Center on time. Major milestone achieved.', 'Transit training milestone. Independently planned and completed bus route.', '{life-skills,transportation,milestone,independence}', NULL, 'approved', FALSE, NOW() - INTERVAL '6 days'),
('11111111-1111-1111-1111-111111111111', 'm0000006-0006-0006-0006-000000000006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Patricia attended nutrition education class. Blood glucose this morning was 128 mg/dL (within target). She demonstrated understanding of carbohydrate counting and planned a balanced dinner menu. Dietary compliance improving.', 'Nutrition class. BG 128 within target. Carb counting demonstrated.', '{health,diabetes,nutrition,education}', NULL, 'approved', FALSE, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm0000007-0007-0007-0007-000000000007', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'James completed the birdhouse project. Quality of work was excellent. He presented the finished piece to the group and received applause. He stated he would like to start a new project next week. Positive peer relationships observed.', 'Birdhouse project completed. Presented to group. Excellent quality.', '{woodworking,completion,social,presentation}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000008-0008-0008-0008-000000000008', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Linda led the afternoon Tai Chi session for interested members. Six participants attended. She demonstrated all movements clearly and provided patient corrections. This is a significant leadership role for her.', 'Led Tai Chi session. 6 participants. Demonstrated leadership.', '{daily,tai-chi,leadership,physical-activity}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'm0000011-0011-0011-0011-000000000011', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'William tried the pottery wheel for the first time. He was initially frustrated but persisted with staff encouragement. By the end of the session he had centered clay and made a small bowl. He asked to continue next week.', 'First pottery session. Persisted through frustration. Made a bowl.', '{daily,pottery,resilience,new-activity}', NULL, 'draft', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000013-0013-0013-0013-000000000013', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Richard tested a new speech-to-text app on his tablet during group discussion. The app captured his comments accurately and he was able to contribute to the conversation more fluidly. He plans to use it in community meetings.', 'Speech-to-text app tested in group. Accurate. Plans to use in community.', '{technology,communication,assistive-tech}', NULL, 'approved', FALSE, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'm0000016-0016-0016-0016-000000000016', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jennifer attended financial literacy workshop. She practiced budgeting using a sample paycheck and created a monthly expense plan. She identified areas where she could save and expressed confidence about managing finances independently.', 'Financial literacy. Budget created from sample paycheck. Confident.', '{life-skills,financial-literacy,independence}', NULL, 'approved', FALSE, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm0000017-0017-0017-0017-000000000017', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'George shared stories from his military service during the veterans'' group session. Three other veteran members attended. The group provided mutual support and George appeared more relaxed than in individual sessions.', 'Veterans group session. Shared military stories. Mutual peer support.', '{daily,veterans,peer-support,emotional}', NULL, 'approved', FALSE, NOW() - INTERVAL '7 days'),
('11111111-1111-1111-1111-111111111111', 'm0000018-0018-0018-0018-000000000018', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Nancy organized a member-led feedback session about program activities. She facilitated discussion among 8 participants, documented suggestions, and presented a summary to staff. Exceptional advocacy and organizational skills.', 'Led feedback session. Facilitated 8 participants. Presented summary.', '{advocacy,leadership,community,organization}', NULL, 'approved', FALSE, NOW() - INTERVAL '6 days'),
('11111111-1111-1111-1111-111111111111', 'm0000020-0020-0020-0020-000000000020', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Carol tended the herb garden this morning, identifying and harvesting basil, rosemary, and thyme for the kitchen. She shared knowledge about herb growing with two other members. Plans to start a composting project.', 'Herb garden tending. Shared knowledge. Plans composting project.', '{daily,gardening,knowledge-sharing,plans}', NULL, 'draft', FALSE, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'm0000021-0021-0021-0021-000000000021', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Amanda attended a group outing to the Seattle Art Museum. She engaged with several exhibits, discussed art history with peers, and navigated the museum using the map independently. Growing confidence in unfamiliar public spaces.', 'Museum outing. Engaged with exhibits. Independent navigation.', '{community,outing,independence,art}', NULL, 'approved', FALSE, NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'm0000023-0023-0023-0023-000000000023', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Christina completed two job applications online with minimal staff support. She used her updated resume and tailored cover letters for each position. Follow-up calls scheduled for next week.', 'Submitted 2 job applications. Tailored cover letters. Follow-up next week.', '{vocational,employment,applications,independence}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'm0000025-0025-0025-0025-000000000025', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Eva taught basic Swedish phrases to fellow members during the cultural exchange lunch. She prepared a simple Swedish dish (cinnamon rolls) and shared the recipe. Positive intercultural engagement. She reported feeling valued.', 'Cultural exchange. Taught Swedish phrases. Baked cinnamon rolls.', '{daily,cultural-exchange,cooking,social}', NULL, 'draft', FALSE, NOW() - INTERVAL '2 days'),
-- Additional notes to reach 60 total
('11111111-1111-1111-1111-111111111111', 'm0000003-0003-0003-0003-000000000003', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'David attended his quarterly ISP meeting today. All team members present. Goals updated: art therapy continued, cooking independence increased to 4x/week. New goal added for community volunteering. David provided input on all goals.', 'Quarterly ISP meeting. Goals updated. New community volunteering goal.', '{isp,quarterly,goals,team-meeting}', NULL, 'approved', FALSE, NOW() - INTERVAL '12 days'),
('11111111-1111-1111-1111-111111111111', 'm0000009-0009-0009-0009-000000000009', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Thomas attended a job interview preparation workshop. He practiced answering common questions, maintaining appropriate body language, and dressing for interviews. Staff assessed his readiness as high.', 'Interview prep workshop. Practiced questions and body language. High readiness.', '{vocational,interview-prep,employment-readiness}', NULL, 'approved', FALSE, NOW() - INTERVAL '8 days'),
('11111111-1111-1111-1111-111111111111', 'm0000010-0010-0010-0010-000000000010', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Margaret attended audiologist follow-up appointment. Hearing aids adjusted for improved clarity. She reported better ability to hear group conversations. Ear discomfort resolved with earmold adjustment.', 'Audiology follow-up. Hearing aids adjusted. Discomfort resolved.', '{health,hearing,appointment,follow-up}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000014-0014-0014-0014-000000000014', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Barbara completed 6 weeks of twice-weekly physical therapy. Therapist reports 40% improvement in range of motion. Pain reduced from average 6/10 to 3/10. Maintenance exercises prescribed for home program.', 'PT 6-week milestone. 40% ROM improvement. Pain reduced by half.', '{health,physical-therapy,milestone,progress}', NULL, 'approved', FALSE, NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'm0000011-0011-0011-0011-000000000011', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'William joined the walking group for the first time. Completed a 30-minute walk around the campus trail. He chatted with three other members and plans to attend twice weekly. Good integration with existing group members.', 'Walking group first attendance. 30 min completed. Social engagement.', '{daily,walking,physical-activity,social}', NULL, 'pending_review', FALSE, NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'm0000022-0022-0022-0022-000000000022', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Brian practiced progressive muscle relaxation during the anxiety management group. He reported decreased tension (SUDS rating dropped from 7 to 3). He plans to use the technique before his next work shift.', 'Anxiety group. PMR practiced. SUDS 7 to 3. Plans pre-work use.', '{health,anxiety-management,relaxation,coping}', NULL, 'approved', FALSE, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Michael led the morning stretching routine for the first time. He guided 12 participants through a 15-minute warm-up sequence. His instructions were clear and he offered modifications for those with limited mobility.', 'Led morning stretching. 12 participants. Clear instructions given.', '{daily,exercise,leadership,group}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000007-0007-0007-0007-000000000007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'James expressed interest in selling his woodworking projects at the community craft fair next month. Staff will help him create a pricing list and display plan. This aligns with his vocational and social skills goals.', 'Wants to sell woodwork at craft fair. Staff to assist with planning.', '{vocational,woodworking,entrepreneurship,goals}', NULL, 'draft', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000012-0012-0012-0012-000000000012', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Dorothy had a phone check-in while hospitalized. She reports stable condition and expects to be discharged within two weeks. She is eager to return to the day program. Transition planning to begin upon discharge.', 'Phone check-in during hospital stay. Stable. Discharge in ~2 weeks.', '{health,hospital,check-in,transition}', NULL, 'approved', FALSE, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'm0000015-0015-0015-0015-000000000015', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Care team reviewed Charles'' reassessment results. Cognitive and functional scores improved since last evaluation. Team recommends transitioning from on_hold to active status with updated care plan. Family meeting to be scheduled.', 'Reassessment review. Scores improved. Recommend return to active status.', '{review,reassessment,care-plan,team}', NULL, 'approved', FALSE, NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222222', 'm0000024-0024-0024-0024-000000000024', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Phone check-in with Derek during medical leave. He reports physical therapy is going well and expects medical clearance within 3 weeks. He asked about upcoming program activities. Sent him the monthly calendar.', 'Phone check-in during leave. PT going well. Return in ~3 weeks.', '{health,medical-leave,check-in,follow-up}', NULL, 'approved', FALSE, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm0000002-0002-0002-0002-000000000002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Eleanor was oriented to the new sensory garden space. She explored the various textures, scents, and sounds with visible delight. She was able to name all herb plants by smell. Calming effect noted during and after the visit.', 'Sensory garden orientation. Named herbs by smell. Calming effect.', '{daily,sensory,garden,cognition,wellbeing}', NULL, 'approved', FALSE, NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'm0000004-0004-0004-0004-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Susan completed a grocery shopping trip to practice budgeting and decision-making. She selected items from a list, compared prices, and stayed within a $30 budget. She calculated change correctly at checkout.', 'Grocery shopping practice. Budget adherence. Correct change calculation.', '{life-skills,shopping,budgeting,math}', NULL, 'approved', FALSE, NOW() - INTERVAL '7 days');

-- ===========================================
-- 9. ATTENDANCE RECORDS (14 days for 10 active members)
-- Uses a DO block to generate realistic attendance
-- ===========================================
DO $$
DECLARE
    d DATE;
    member_rec RECORD;
    check_in_time TIMESTAMPTZ;
    check_out_time TIMESTAMPTZ;
    att_status TEXT;
BEGIN
    FOR d IN SELECT generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, '1 day')::date LOOP
        -- Skip Sundays for day-program members
        IF EXTRACT(DOW FROM d) = 0 THEN CONTINUE; END IF;

        FOR member_rec IN
            SELECT id, primary_location_id
            FROM members
            WHERE organization_id = '11111111-1111-1111-1111-111111111111'
              AND status = 'active'
            ORDER BY id
            LIMIT 10
        LOOP
            -- 90% present, 5% absent, 5% late
            IF random() < 0.05 THEN
                att_status := 'absent';
                check_in_time := NULL;
                check_out_time := NULL;
            ELSIF random() < 0.1 THEN
                att_status := 'late';
                check_in_time := d + TIME '09:30' + (random() * INTERVAL '30 minutes');
                check_out_time := d + TIME '16:00' + (random() * INTERVAL '60 minutes');
            ELSE
                att_status := 'present';
                check_in_time := d + TIME '08:00' + (random() * INTERVAL '30 minutes');
                check_out_time := d + TIME '16:00' + (random() * INTERVAL '60 minutes');
            END IF;

            INSERT INTO attendance_records (organization_id, member_id, staff_id, location_id, date, check_in, check_out, status, notes)
            VALUES (
                '11111111-1111-1111-1111-111111111111',
                member_rec.id,
                CASE WHEN random() < 0.5 THEN 'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid
                     ELSE 'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid END,
                member_rec.primary_location_id,
                d,
                check_in_time,
                check_out_time,
                att_status,
                CASE att_status
                    WHEN 'absent' THEN 'Called in - not feeling well'
                    WHEN 'late' THEN 'Transportation delay'
                    ELSE NULL
                END
            );
        END LOOP;
    END LOOP;
END $$;

-- ===========================================
-- 10. MEDICATIONS (15)
-- ===========================================
INSERT INTO medications (id, organization_id, member_id, name, dosage, frequency, route, instructions, prescriber, start_date, end_date, status, created_by) VALUES
('med00001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'Lisinopril',       '10mg',   'Once daily',       'Oral', 'Take in the morning with water. Monitor blood pressure.',       'Dr. Sarah Kim',      '2024-01-15', NULL, 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('med00002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'Sertraline',       '100mg',  'Once daily',       'Oral', 'Take in the morning. Do not discontinue abruptly.',            'Dr. Sarah Kim',      '2022-08-01', NULL, 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('med00003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 'm0000002-0002-0002-0002-000000000002', 'Donepezil',        '5mg',    'Once daily',       'Oral', 'Take at bedtime. For cognitive support.',                      'Dr. Robert Chen',    '2023-04-01', NULL, 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('med00004-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'Lithium Carbonate','300mg',  'Twice daily',      'Oral', 'Take with food. Regular blood level monitoring required.',      'Dr. James Park',     '2019-01-10', NULL, 'active', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('med00005-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'Quetiapine',       '50mg',   'Once daily',       'Oral', 'Take at bedtime. May cause drowsiness.',                       'Dr. James Park',     '2020-03-15', NULL, 'active', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('med00006-0006-0006-0006-000000000006', '11111111-1111-1111-1111-111111111111', 'm0000006-0006-0006-0006-000000000006', 'Metformin',        '500mg',  'Twice daily',      'Oral', 'Take with meals. Monitor blood glucose regularly.',             'Dr. Amy Walsh',      '2019-05-01', NULL, 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('med00007-0007-0007-0007-000000000007', '11111111-1111-1111-1111-111111111111', 'm0000006-0006-0006-0006-000000000006', 'Atorvastatin',     '20mg',   'Once daily',       'Oral', 'Take at bedtime. For cholesterol management.',                 'Dr. Amy Walsh',      '2020-01-20', NULL, 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('med00008-0008-0008-0008-000000000008', '11111111-1111-1111-1111-111111111111', 'm0000010-0010-0010-0010-000000000010', 'Acetaminophen',    '500mg',  'As needed',        'Oral', 'Take for mild pain. Max 3g per day. Avoid with alcohol.',      'Dr. Lisa Brown',     '2023-08-01', NULL, 'active', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('med00009-0009-0009-0009-000000000009', '11111111-1111-1111-1111-111111111111', 'm0000014-0014-0014-0014-000000000014', 'Ibuprofen',        '400mg',  'Three times daily','Oral', 'Take with food for back pain. Use for max 10 days.',           'Dr. Lisa Brown',     '2024-05-01', '2024-05-10', 'discontinued', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('med00010-0010-0010-0010-000000000010', '11111111-1111-1111-1111-111111111111', 'm0000014-0014-0014-0014-000000000014', 'Naproxen',         '250mg',  'Twice daily',      'Oral', 'Take with food. Replacement for ibuprofen.',                   'Dr. Lisa Brown',     '2024-05-11', NULL, 'active', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('med00011-0011-0011-0011-000000000011', '11111111-1111-1111-1111-111111111111', 'm0000017-0017-0017-0017-000000000017', 'Amlodipine',       '5mg',    'Once daily',       'Oral', 'Take in the morning. For blood pressure control.',             'Dr. Kevin Cho',      '2023-06-01', NULL, 'active', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('med00012-0012-0012-0012-000000000012', '11111111-1111-1111-1111-111111111111', 'm0000008-0008-0008-0008-000000000008', 'Omeprazole',       '20mg',   'Once daily',       'Oral', 'Take 30 min before breakfast. For acid reflux.',               'Dr. Amy Walsh',      '2024-02-01', NULL, 'active', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('med00013-0013-0013-0013-000000000013', '22222222-2222-2222-2222-222222222222', 'm0000022-0022-0022-0022-000000000022', 'Sertraline',       '50mg',   'Once daily',       'Oral', 'Take in the morning. For generalized anxiety.',                'Dr. Natalie Green',  '2023-06-01', NULL, 'active', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('med00014-0014-0014-0014-000000000014', '22222222-2222-2222-2222-222222222222', 'm0000025-0025-0025-0025-000000000025', 'Loratadine',       '10mg',   'Once daily',       'Oral', 'Take for dairy allergy symptoms. Non-drowsy antihistamine.',   'Dr. Natalie Green',  '2024-07-15', NULL, 'active', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('med00015-0015-0015-0015-000000000015', '11111111-1111-1111-1111-111111111111', 'm0000003-0003-0003-0003-000000000003', 'Melatonin',        '3mg',    'Once daily',       'Oral', 'Take 30 min before bedtime. For sleep regulation.',            'Dr. Maria Lopez',    '2024-04-01', NULL, 'active', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

-- ===========================================
-- 11. MEDICATION LOGS (30)
-- ===========================================
INSERT INTO medication_logs (medication_id, administered_by, administered_at, status, notes) VALUES
('med00001-0001-0001-0001-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '1 day' + TIME '08:00',  'administered', 'BP 128/82 before administration.'),
('med00001-0001-0001-0001-000000000001', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '2 days' + TIME '08:15', 'administered', NULL),
('med00001-0001-0001-0001-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '3 days' + TIME '08:05', 'administered', NULL),
('med00002-0002-0002-0002-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '1 day' + TIME '08:00',  'administered', NULL),
('med00002-0002-0002-0002-000000000002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '2 days' + TIME '08:10', 'administered', NULL),
('med00003-0003-0003-0003-000000000003', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '21:00', 'administered', 'Taken with evening snack.'),
('med00003-0003-0003-0003-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '21:15', 'administered', NULL),
('med00004-0004-0004-0004-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '1 day' + TIME '08:00',  'administered', 'Morning dose with breakfast.'),
('med00004-0004-0004-0004-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '20:00', 'administered', 'Evening dose with dinner.'),
('med00004-0004-0004-0004-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '08:10', 'administered', NULL),
('med00004-0004-0004-0004-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '2 days' + TIME '20:05', 'administered', NULL),
('med00005-0005-0005-0005-000000000005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '21:30', 'administered', NULL),
('med00005-0005-0005-0005-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '21:00', 'administered', NULL),
('med00006-0006-0006-0006-000000000006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '1 day' + TIME '08:00',  'administered', 'BG 128 mg/dL before breakfast.'),
('med00006-0006-0006-0006-000000000006', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '18:00', 'administered', 'BG 135 mg/dL before dinner.'),
('med00006-0006-0006-0006-000000000006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '08:00', 'administered', 'BG 145 mg/dL. Slightly elevated.'),
('med00006-0006-0006-0006-000000000006', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '2 days' + TIME '18:10', 'administered', NULL),
('med00007-0007-0007-0007-000000000007', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '21:00', 'administered', NULL),
('med00007-0007-0007-0007-000000000007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '21:00', 'administered', NULL),
('med00008-0008-0008-0008-000000000008', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '3 days' + TIME '14:00', 'administered', 'Mild headache reported.'),
('med00010-0010-0010-0010-000000000010', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '08:00', 'administered', 'Back pain 3/10 this morning.'),
('med00010-0010-0010-0010-000000000010', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '1 day' + TIME '20:00', 'administered', NULL),
('med00011-0011-0011-0011-000000000011', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '08:00', 'administered', 'BP 130/85.'),
('med00011-0011-0011-0011-000000000011', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '08:15', 'administered', NULL),
('med00012-0012-0012-0012-000000000012', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '1 day' + TIME '07:30', 'administered', 'Taken 30 min before breakfast.'),
('med00013-0013-0013-0013-000000000013', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW() - INTERVAL '1 day' + TIME '08:00', 'administered', NULL),
('med00013-0013-0013-0013-000000000013', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW() - INTERVAL '2 days' + TIME '08:10', 'administered', NULL),
('med00014-0014-0014-0014-000000000014', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW() - INTERVAL '1 day' + TIME '09:00', 'administered', NULL),
('med00015-0015-0015-0015-000000000015', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day' + TIME '21:30', 'administered', 'Sleep onset ~22:15, improvement noted.'),
('med00015-0015-0015-0015-000000000015', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days' + TIME '21:00', 'administered', NULL);

-- ===========================================
-- 12. TASKS (20)
-- ===========================================
INSERT INTO tasks (id, organization_id, title, description, assignee_id, created_by, priority, status, due_date, completed_at, checklist, tags) VALUES
('task0001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Complete quarterly ISP reviews',          'Review and update Individual Service Plans for all active members.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'high',   'in_progress', NOW() + INTERVAL '7 days',  NULL, '[{"item":"Review Robert Williams ISP","done":true},{"item":"Review Eleanor Mitchell ISP","done":true},{"item":"Review David Park ISP","done":false},{"item":"Review remaining members","done":false}]', '{compliance,isp,quarterly}'),
('task0002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'Order new art supplies',                  'Restock painting and craft supplies for the activity room.', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'medium', 'todo',        NOW() + INTERVAL '3 days',  NULL, '[{"item":"Inventory current supplies","done":true},{"item":"Create order list","done":false},{"item":"Submit purchase order","done":false}]', '{supplies,activities}'),
('task0003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 'Schedule fire drill',                     'Coordinate quarterly fire drill with all locations.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'high',   'todo',        NOW() + INTERVAL '14 days', NULL, '[{"item":"Notify all staff","done":false},{"item":"Coordinate with fire dept","done":false},{"item":"Prepare evacuation routes","done":false},{"item":"Document drill results","done":false}]', '{safety,compliance,fire-drill}'),
('task0004-0004-0004-0004-000000000004', '11111111-1111-1111-1111-111111111111', 'Update medication records',               'Verify and update medication records after pharmacy review.', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'urgent', 'in_progress', NOW() + INTERVAL '2 days',  NULL, '[{"item":"Cross-reference pharmacy list","done":true},{"item":"Update database entries","done":false},{"item":"Get supervisor sign-off","done":false}]', '{medications,compliance,records}'),
('task0005-0005-0005-0005-000000000005', '11111111-1111-1111-1111-111111111111', 'Plan summer activities calendar',         'Design the July/August activities schedule.', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'medium', 'todo',        NOW() + INTERVAL '21 days', NULL, '[{"item":"Survey member preferences","done":false},{"item":"Book external facilitators","done":false},{"item":"Finalize calendar","done":false}]', '{activities,planning,summer}'),
('task0006-0006-0006-0006-000000000006', '11111111-1111-1111-1111-111111111111', 'Fix leaking faucet in Wing A kitchen',    'Maintenance request from residential staff.', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'low',    'done',        NOW() - INTERVAL '2 days',  NOW() - INTERVAL '1 day', '[{"item":"Assess leak","done":true},{"item":"Order parts","done":true},{"item":"Complete repair","done":true}]', '{maintenance,facility}'),
('task0007-0007-0007-0007-000000000007', '11111111-1111-1111-1111-111111111111', 'Prepare annual compliance report',        'Compile data for state regulatory submission.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'urgent', 'in_progress', NOW() + INTERVAL '10 days', NULL, '[{"item":"Gather attendance data","done":true},{"item":"Compile service note stats","done":true},{"item":"Review incident reports","done":false},{"item":"Draft narrative sections","done":false},{"item":"Submit to state","done":false}]', '{compliance,regulatory,annual}'),
('task0008-0008-0008-0008-000000000008', '11111111-1111-1111-1111-111111111111', 'Interview new support worker candidates', 'Three candidates scheduled for the open position.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'high',   'todo',        NOW() + INTERVAL '5 days',  NULL, '[{"item":"Review resumes","done":true},{"item":"Schedule interviews","done":true},{"item":"Conduct interviews","done":false},{"item":"Reference checks","done":false}]', '{hiring,hr}'),
('task0009-0009-0009-0009-000000000009', '11111111-1111-1111-1111-111111111111', 'Organize staff training on de-escalation','Annual refresher training for all direct-care staff.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'medium', 'todo',        NOW() + INTERVAL '30 days', NULL, '[{"item":"Book trainer","done":false},{"item":"Schedule sessions","done":false},{"item":"Distribute materials","done":false}]', '{training,staff,safety}'),
('task0010-0010-0010-0010-000000000010', '11111111-1111-1111-1111-111111111111', 'Update member photo IDs',                 'Annual photo update for member identification badges.', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'low',    'todo',        NOW() + INTERVAL '14 days', NULL, '[{"item":"Set up photo station","done":false},{"item":"Schedule member appointments","done":false},{"item":"Print new badges","done":false}]', '{admin,identification}'),
('task0011-0011-0011-0011-000000000011', '11111111-1111-1111-1111-111111111111', 'Review Dorothy Anderson transition plan', 'Prepare transition plan for Dorothy''s return from hospital.', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'high',   'todo',        NOW() + INTERVAL '10 days', NULL, '[{"item":"Contact hospital discharge planner","done":false},{"item":"Update care plan","done":false},{"item":"Coordinate transport","done":false}]', '{transition,hospital,care-plan}'),
('task0012-0012-0012-0012-000000000012', '11111111-1111-1111-1111-111111111111', 'Set up community craft fair booth',       'Prepare display for member woodworking and art sales.', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'medium', 'todo',        NOW() + INTERVAL '25 days', NULL, '[{"item":"Register for fair","done":true},{"item":"Collect member products","done":false},{"item":"Create pricing tags","done":false},{"item":"Set up display","done":false}]', '{community,vocational,event}'),
-- Harbor Health tasks
('task0013-0013-0013-0013-000000000013', '22222222-2222-2222-2222-222222222222', 'Update behavioral support plans',         'Review and update BSPs for all active members.', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'high',   'in_progress', NOW() + INTERVAL '7 days',  NULL, '[{"item":"Review Amanda BSP","done":true},{"item":"Review Brian BSP","done":false},{"item":"Review Christina BSP","done":false}]', '{compliance,bsp}'),
('task0014-0014-0014-0014-000000000014', '22222222-2222-2222-2222-222222222222', 'Order sensory room equipment',            'New sensory items for the Northgate Community Hub.', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'medium', 'todo',        NOW() + INTERVAL '14 days', NULL, '[{"item":"Research equipment options","done":true},{"item":"Get quotes","done":false},{"item":"Submit PO","done":false}]', '{equipment,sensory,facility}'),
('task0015-0015-0015-0015-000000000015', '22222222-2222-2222-2222-222222222222', 'Coordinate employer site visits',         'Arrange workplace visits for members in job readiness program.', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'medium', 'todo',        NOW() + INTERVAL '10 days', NULL, '[{"item":"Contact partner employers","done":false},{"item":"Schedule visits","done":false},{"item":"Prepare members","done":false}]', '{vocational,employment,community}'),
('task0016-0016-0016-0016-000000000016', '11111111-1111-1111-1111-111111111111', 'Monthly vehicle inspection',              'Inspect and document condition of all transport vehicles.', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'medium', 'done',        NOW() - INTERVAL '5 days',  NOW() - INTERVAL '4 days', '[{"item":"Check van 1","done":true},{"item":"Check van 2","done":true},{"item":"File inspection reports","done":true}]', '{maintenance,transport,compliance}'),
('task0017-0017-0017-0017-000000000017', '11111111-1111-1111-1111-111111111111', 'Renew CPR certifications',                'Staff CPR/First Aid cert renewal due this quarter.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'high',   'todo',        NOW() + INTERVAL '21 days', NULL, '[{"item":"Identify expiring certs","done":true},{"item":"Book training provider","done":false},{"item":"Schedule staff","done":false}]', '{training,compliance,safety}'),
('task0018-0018-0018-0018-000000000018', '11111111-1111-1111-1111-111111111111', 'Review and update emergency procedures',  'Annual review of all emergency response procedures.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'high',   'review',      NOW() + INTERVAL '5 days',  NULL, '[{"item":"Review fire procedures","done":true},{"item":"Review medical emergency procedures","done":true},{"item":"Review evacuation plans","done":true},{"item":"Update contact lists","done":false},{"item":"Distribute to staff","done":false}]', '{safety,compliance,emergency}'),
('task0019-0019-0019-0019-000000000019', '11111111-1111-1111-1111-111111111111', 'Clean and reorganize storage room',       'Eastside Day Center storage needs reorganization.', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'low',    'done',        NOW() - INTERVAL '7 days',  NOW() - INTERVAL '6 days', '[{"item":"Sort items","done":true},{"item":"Dispose of expired supplies","done":true},{"item":"Label shelves","done":true}]', '{maintenance,facility,organization}'),
('task0020-0020-0020-0020-000000000020', '22222222-2222-2222-2222-222222222222', 'Prepare grant application',               'Apply for state community integration grant funding.', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'urgent', 'in_progress', NOW() + INTERVAL '5 days',  NULL, '[{"item":"Gather outcome data","done":true},{"item":"Write narrative","done":true},{"item":"Budget proposal","done":false},{"item":"Submit application","done":false}]', '{grant,funding,compliance}');

-- ===========================================
-- 13. TASK COMMENTS (5)
-- ===========================================
INSERT INTO task_comments (task_id, author_id, content, created_at) VALUES
('task0001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Please prioritize Robert and Eleanor reviews as their annual dates are approaching.', NOW() - INTERVAL '3 days'),
('task0001-0001-0001-0001-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Robert and Eleanor reviews are complete. Moving on to David Park next.', NOW() - INTERVAL '1 day'),
('task0004-0004-0004-0004-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pharmacy list received. Found two discrepancies that need clarification with Dr. Walsh.', NOW() - INTERVAL '2 days'),
('task0007-0007-0007-0007-000000000007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Attendance data and service note statistics are compiled. Need to finish incident report review by Friday.', NOW() - INTERVAL '1 day'),
('task0020-0020-0020-0020-000000000020', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Outcome data shows 85% goal achievement rate. This should strengthen our narrative section significantly.', NOW() - INTERVAL '2 days');

-- ===========================================
-- 14. APPOINTMENTS (12)
-- ===========================================
INSERT INTO appointments (organization_id, member_id, type, title, description, date, start_time, end_time, location, responsible_id, transport_needed, status, notes, created_by) VALUES
('11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'medical',    'Annual physical exam',            'Routine annual physical with Dr. Kim.',      CURRENT_DATE + 3,  '10:00', '11:00', 'Providence Medical Center', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE,  'scheduled', 'Fasting required. Transport arranged.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('11111111-1111-1111-1111-111111111111', 'm0000002-0002-0002-0002-000000000002', 'medical',    'Neurology follow-up',             'Dementia monitoring with Dr. Chen.',          CURRENT_DATE + 5,  '14:00', '15:00', 'OHSU Neurology Clinic', 'dddddddd-dddd-dddd-dddd-dddddddddddd', TRUE,  'scheduled', 'Bring previous test results.', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'therapy',    'Psychiatry medication review',    'Quarterly lithium level check and med review.', CURRENT_DATE + 7, '09:00', '09:45', 'Main Campus Office', 'cccccccc-cccc-cccc-cccc-cccccccccccc', FALSE, 'confirmed', 'Blood draw needed before appointment.', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('11111111-1111-1111-1111-111111111111', 'm0000006-0006-0006-0006-000000000006', 'medical',    'Endocrinology check-up',          'Diabetes management review. HbA1c test.',    CURRENT_DATE + 10, '11:00', '11:45', 'Providence Diabetes Center', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE,  'scheduled', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('11111111-1111-1111-1111-111111111111', 'm0000010-0010-0010-0010-000000000010', 'medical',    'Audiology follow-up',             'Hearing aid adjustment check.',               CURRENT_DATE + 4,  '13:30', '14:00', 'Portland Hearing Center', 'dddddddd-dddd-dddd-dddd-dddddddddddd', TRUE,  'confirmed', 'Left ear discomfort follow-up.', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('11111111-1111-1111-1111-111111111111', 'm0000014-0014-0014-0014-000000000014', 'therapy',    'Physical therapy session',        'Ongoing back rehab. Session 13 of 16.',       CURRENT_DATE + 1,  '10:00', '10:45', 'Main Campus PT Room', 'cccccccc-cccc-cccc-cccc-cccccccccccc', FALSE, 'confirmed', NULL, 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('11111111-1111-1111-1111-111111111111', 'm0000003-0003-0003-0003-000000000003', 'evaluation', 'Vocational skills assessment',    'Assess readiness for community volunteering.', CURRENT_DATE + 6, '09:30', '11:00', 'Eastside Day Center', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', FALSE, 'scheduled', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('11111111-1111-1111-1111-111111111111', 'm0000009-0009-0009-0009-000000000009', 'social',     'Job interview at library',        'Interview for expanded volunteer role.',       CURRENT_DATE + 2,  '14:00', '15:00', 'Multnomah County Library', 'dddddddd-dddd-dddd-dddd-dddddddddddd', FALSE, 'confirmed', 'Bring portfolio and references.', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('11111111-1111-1111-1111-111111111111', 'm0000016-0016-0016-0016-000000000016', 'evaluation', 'Employment readiness evaluation', 'Final assessment before job placement phase.', CURRENT_DATE + 8,  '10:00', '11:30', 'Eastside Day Center', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', FALSE, 'scheduled', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('22222222-2222-2222-2222-222222222222', 'm0000022-0022-0022-0022-000000000022', 'therapy',    'CBT session',                     'Anxiety management therapy session.',         CURRENT_DATE + 2,  '11:00', '12:00', 'Downtown Clinic Room 3', 'ffffffff-ffff-ffff-ffff-ffffffffffff', FALSE, 'confirmed', NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('22222222-2222-2222-2222-222222222222', 'm0000023-0023-0023-0023-000000000023', 'social',     'Employer meet-and-greet',         'Introductory meeting at potential employer.',  CURRENT_DATE + 9,  '13:00', '14:00', 'Pacific Retail Corp', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', TRUE,  'scheduled', 'Bring resume and references.', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('22222222-2222-2222-2222-222222222222', 'm0000025-0025-0025-0025-000000000025', 'therapy',    'Art therapy assessment',          'Quarterly art therapy progress evaluation.',   CURRENT_DATE + 4,  '15:00', '16:00', 'Northgate Community Hub', 'ffffffff-ffff-ffff-ffff-ffffffffffff', FALSE, 'scheduled', NULL, 'ffffffff-ffff-ffff-ffff-ffffffffffff');

-- ===========================================
-- 15. LIFE PLANS (4)
-- ===========================================
INSERT INTO life_plans (id, organization_id, member_id, title, description, status, start_date, target_date, created_by) VALUES
('lp000001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'm0000001-0001-0001-0001-000000000001', 'Robert - Mobility & Independence Plan',   'Improve mobility to reduce walker dependence and increase daily independence.', 'active', '2024-01-15', '2025-01-15', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('lp000002-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 'm0000003-0003-0003-0003-000000000003', 'David - Independent Living & Vocational', 'Build skills for greater independent living and community participation.', 'active', '2024-03-20', '2025-03-20', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('lp000003-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 'm0000005-0005-0005-0005-000000000005', 'Michael - Vocational Advancement',        'Progress from garden volunteer to paid part-time employment.', 'active', '2023-08-15', '2024-08-15', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('lp000004-0004-0004-0004-000000000004', '22222222-2222-2222-2222-222222222222', 'm0000023-0023-0023-0023-000000000023', 'Christina - Employment Pathway',          'Transition from training to competitive employment within 12 months.', 'active', '2024-03-10', '2025-03-10', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- ===========================================
-- 16. LIFE PLAN GOALS (10)
-- ===========================================
INSERT INTO life_plan_goals (id, life_plan_id, title, description, target_date, progress, status) VALUES
('goal0001-0001-0001-0001-000000000001', 'lp000001-0001-0001-0001-000000000001', 'Walk with cane independently',      'Transition from walker to cane for indoor mobility.',    '2024-09-01', 65, 'in_progress'),
('goal0002-0002-0002-0002-000000000002', 'lp000001-0001-0001-0001-000000000001', 'Manage daily medications',           'Self-administer morning medications with reminders.',    '2024-12-01', 40, 'in_progress'),
('goal0003-0003-0003-0003-000000000003', 'lp000001-0001-0001-0001-000000000001', 'Attend community events monthly',   'Participate in at least one community event per month.',  '2025-01-15', 30, 'in_progress'),
('goal0004-0004-0004-0004-000000000004', 'lp000002-0002-0002-0002-000000000002', 'Cook breakfast independently',       'Prepare breakfast 5 days per week without assistance.',   '2024-09-01', 80, 'in_progress'),
('goal0005-0005-0005-0005-000000000005', 'lp000002-0002-0002-0002-000000000002', 'Use public transportation',          'Navigate local bus system for routine trips.',            '2024-12-01', 25, 'in_progress'),
('goal0006-0006-0006-0006-000000000006', 'lp000002-0002-0002-0002-000000000002', 'Volunteer in community',             'Establish regular volunteering role in the community.',   '2025-03-20', 10, 'in_progress'),
('goal0007-0007-0007-0007-000000000007', 'lp000003-0003-0003-0003-000000000003', 'Complete vocational training',       'Finish horticulture certificate program.',                '2024-04-01', 100, 'completed'),
('goal0008-0008-0008-0008-000000000008', 'lp000003-0003-0003-0003-000000000003', 'Obtain paid employment',             'Secure part-time paid position at a garden center.',      '2024-08-15', 60, 'in_progress'),
('goal0009-0009-0009-0009-000000000009', 'lp000004-0004-0004-0004-000000000004', 'Complete resume and portfolio',      'Build professional resume and work portfolio.',           '2024-06-01', 90, 'in_progress'),
('goal0010-0010-0010-0010-000000000010', 'lp000004-0004-0004-0004-000000000004', 'Submit 10 job applications',         'Apply to at least 10 relevant positions.',                '2024-09-01', 20, 'in_progress');

-- ===========================================
-- 17. LIFE PLAN MILESTONES (20)
-- ===========================================
INSERT INTO life_plan_milestones (goal_id, title, description, is_completed, completed_at, evidence_notes) VALUES
('goal0001-0001-0001-0001-000000000001', 'Walk 10 min with walker',           'Baseline established.',                    TRUE,  NOW() - INTERVAL '90 days', 'PT notes confirm 10-min walks achieved consistently.'),
('goal0001-0001-0001-0001-000000000001', 'Walk 20 min with walker',           'Increased endurance.',                     TRUE,  NOW() - INTERVAL '30 days', 'Documented in weekly PT assessment.'),
('goal0001-0001-0001-0001-000000000001', 'Stand for 5 min without support',   'Balance improvement milestone.',           TRUE,  NOW() - INTERVAL '14 days', 'Achieved during PT session. Staff observed.'),
('goal0001-0001-0001-0001-000000000001', 'Walk 5 min with cane (supervised)', 'First cane trial.',                        FALSE, NULL, NULL),
('goal0002-0002-0002-0002-000000000002', 'Identify all medications by name',  'Recognition of daily medications.',        TRUE,  NOW() - INTERVAL '60 days', 'Quiz completed with 100% accuracy.'),
('goal0002-0002-0002-0002-000000000002', 'Use pill organizer independently',  'Fill weekly pill organizer.',              FALSE, NULL, NULL),
('goal0003-0003-0003-0003-000000000003', 'Attend one community event',        'First community outing.',                  TRUE,  NOW() - INTERVAL '45 days', 'Attended local library event with staff support.'),
('goal0003-0003-0003-0003-000000000003', 'Attend event with minimal support', 'Reduced staff accompaniment.',             FALSE, NULL, NULL),
('goal0004-0004-0004-0004-000000000004', 'Make toast and cereal',             'Basic breakfast preparation.',              TRUE,  NOW() - INTERVAL '120 days', 'Observed preparing breakfast independently 3 consecutive days.'),
('goal0004-0004-0004-0004-000000000004', 'Cook eggs safely',                  'Stovetop safety with simple cooking.',      TRUE,  NOW() - INTERVAL '60 days', 'Staff observed safe stove use. Completed safety checklist.'),
('goal0004-0004-0004-0004-000000000004', 'Prepare full breakfast meal',       'Complete breakfast with multiple items.',    TRUE,  NOW() - INTERVAL '14 days', 'Made eggs, toast, and fruit salad independently.'),
('goal0005-0005-0005-0005-000000000005', 'Read bus schedule',                 'Understand route maps and times.',           TRUE,  NOW() - INTERVAL '30 days', 'Successfully read and interpreted 3 different route schedules.'),
('goal0005-0005-0005-0005-000000000005', 'Plan a bus route on app',           'Use transit app for route planning.',        TRUE,  NOW() - INTERVAL '7 days', 'Planned and verified route on phone app.'),
('goal0005-0005-0005-0005-000000000005', 'Complete solo bus trip',            'Independent round-trip bus journey.',        FALSE, NULL, NULL),
('goal0007-0007-0007-0007-000000000007', 'Complete coursework',               'Finish all certificate requirements.',       TRUE,  NOW() - INTERVAL '100 days', 'Certificate awarded. Copy in file.'),
('goal0007-0007-0007-0007-000000000007', 'Pass final assessment',             'Score 80%+ on practical exam.',              TRUE,  NOW() - INTERVAL '95 days', 'Scored 92% on practical assessment.'),
('goal0008-0008-0008-0008-000000000008', 'Complete job application',          'Submit first formal job application.',       TRUE,  NOW() - INTERVAL '30 days', 'Applied to Green Thumb Garden Center.'),
('goal0008-0008-0008-0008-000000000008', 'Attend job interview',             'First formal job interview.',                TRUE,  NOW() - INTERVAL '14 days', 'Interviewed at Green Thumb. Awaiting decision.'),
('goal0009-0009-0009-0009-000000000009', 'Draft initial resume',             'Create first resume version.',               TRUE,  NOW() - INTERVAL '60 days', 'Completed with staff guidance. Reviewed by career counselor.'),
('goal0009-0009-0009-0009-000000000009', 'Update resume with experience',    'Add volunteer and training experience.',     TRUE,  NOW() - INTERVAL '3 days', 'Updated during resume workshop. Professional format.');

-- ===========================================
-- 18. LIFE PLAN REVIEWS (6)
-- ===========================================
INSERT INTO life_plan_reviews (life_plan_id, reviewer_id, content, outcome, next_review_date, created_at) VALUES
('lp000001-0001-0001-0001-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Robert is making steady progress toward mobility goals. PT sessions show measurable improvement in balance and endurance. Recommend continuing current plan with addition of outdoor walking practice.', 'Goals on track. Added outdoor walking component.', CURRENT_DATE + 90, NOW() - INTERVAL '30 days'),
('lp000001-0001-0001-0001-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Initial plan review. Baseline assessments completed. Robert is motivated and engaged. Family supportive of goals.', 'Plan approved. Baselines established.', CURRENT_DATE - 60, NOW() - INTERVAL '150 days'),
('lp000002-0002-0002-0002-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'David has exceeded cooking goals ahead of schedule. Now preparing breakfast independently 4 days/week. Transit skills progressing. Recommend adding community volunteering goal.', 'Exceeded cooking targets. Volunteering goal added.', CURRENT_DATE + 60, NOW() - INTERVAL '14 days'),
('lp000003-0003-0003-0003-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Michael completed his horticulture certificate with a 92% score. He has applied for a position and interviewed. Positive trajectory toward paid employment goal.', 'Certificate complete. Job search active.', CURRENT_DATE + 30, NOW() - INTERVAL '14 days'),
('lp000003-0003-0003-0003-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mid-year review. Michael is halfway through the horticulture program with strong marks. Garden supervisor rates his work ethic as excellent.', 'On track. Strong academic and practical performance.', CURRENT_DATE - 30, NOW() - INTERVAL '120 days'),
('lp000004-0004-0004-0004-000000000004', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Christina has completed her resume and begun applying for positions. Two applications submitted this week. Interview coaching ongoing. Confidence level improving.', 'Resume complete. Application phase begun.', CURRENT_DATE + 60, NOW() - INTERVAL '7 days');

-- ===========================================
-- 19. CONTENT RESOURCES (8)
-- ===========================================
INSERT INTO content_resources (organization_id, title, description, type, url, category, tags, is_published, created_by) VALUES
('11111111-1111-1111-1111-111111111111', 'Emergency Procedures Manual',       'Complete guide to emergency response protocols.',        'pdf',      'https://example.com/docs/emergency-procedures.pdf',    'safety',     '{safety,emergency,compliance}',     TRUE,  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('11111111-1111-1111-1111-111111111111', 'De-escalation Techniques Guide',    'Training material for conflict de-escalation.',          'document', 'https://example.com/docs/de-escalation-guide.pdf',     'training',   '{training,safety,de-escalation}',   TRUE,  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('11111111-1111-1111-1111-111111111111', 'Medication Administration Training','Video course on proper medication administration.',       'video',    'https://example.com/videos/med-admin-training.mp4',    'training',   '{training,medications,compliance}', TRUE,  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('11111111-1111-1111-1111-111111111111', 'Person-Centered Planning Slides',   'Presentation slides for PCP training workshop.',         'slide',    'https://example.com/slides/pcp-workshop.pptx',         'training',   '{training,person-centered,isp}',    TRUE,  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('11111111-1111-1111-1111-111111111111', 'Rights and Responsibilities',       'Member rights and responsibilities document.',           'document', 'https://example.com/docs/rights-responsibilities.pdf', 'compliance', '{compliance,rights,members}',       TRUE,  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('22222222-2222-2222-2222-222222222222', 'Behavioral Support Plan Template',  'Template and guidelines for writing BSPs.',              'document', 'https://example.com/docs/bsp-template.docx',           'clinical',   '{template,bsp,clinical}',           TRUE,  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('22222222-2222-2222-2222-222222222222', 'Community Integration Best Practices','Link to CMS best practices resource.',                 'link',     'https://example.com/resources/community-integration',  'reference',  '{community,integration,best-practices}', TRUE, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('22222222-2222-2222-2222-222222222222', 'First Aid Quick Reference Card',    'Printable quick reference for common first aid.',        'image',    'https://example.com/images/first-aid-card.png',        'safety',     '{safety,first-aid,reference}',      TRUE,  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- ===========================================
-- 20. CONTENT ASSIGNMENTS (5)
-- ===========================================
INSERT INTO content_assignments (resource_id, assignee_type, assignee_id, completed, completed_at, assigned_by) VALUES
((SELECT id FROM content_resources WHERE title = 'De-escalation Techniques Guide' LIMIT 1), 'user', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE,  NOW() - INTERVAL '10 days', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
((SELECT id FROM content_resources WHERE title = 'De-escalation Techniques Guide' LIMIT 1), 'user', 'dddddddd-dddd-dddd-dddd-dddddddddddd', FALSE, NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
((SELECT id FROM content_resources WHERE title = 'Medication Administration Training' LIMIT 1), 'user', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE, NOW() - INTERVAL '30 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
((SELECT id FROM content_resources WHERE title = 'Medication Administration Training' LIMIT 1), 'user', 'dddddddd-dddd-dddd-dddd-dddddddddddd', TRUE, NOW() - INTERVAL '25 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
((SELECT id FROM content_resources WHERE title = 'Behavioral Support Plan Template' LIMIT 1), 'user', 'ffffffff-ffff-ffff-ffff-ffffffffffff', FALSE, NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- ===========================================
-- 21. NOTIFICATIONS (10)
-- ===========================================
INSERT INTO notifications (organization_id, user_id, title, message, type, is_read, action_url, metadata, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ISP Review Due',            'Robert Williams ISP review is due in 7 days.',         'warning',  FALSE, '/members/m0000001-0001-0001-0001-000000000001/life-plan', '{"member_id":"m0000001-0001-0001-0001-000000000001"}', NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Medication Discrepancy',     'Two medication records need pharmacy verification.',    'alert',    FALSE, '/medications',         '{}', NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Compliance Report Due',      'Annual compliance report submission deadline in 10 days.','warning', FALSE, '/compliance/reports',  '{}', NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Training Assignment',        'You have been assigned: De-escalation Techniques Guide.','info',    TRUE,  '/training',            '{}', NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Service Note Approved',      'Your service note for Michael Torres has been approved.','success', TRUE,  '/notes',               '{}', NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Appointment Reminder',       'Robert Williams has an appointment in 3 days.',         'info',     FALSE, '/appointments',        '{"member_id":"m0000001-0001-0001-0001-000000000001"}', NOW()),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'New Task Assigned',          'You have been assigned: Schedule fire drill.',           'info',     TRUE,  '/tasks',               '{}', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Grant Deadline Approaching', 'Grant application due in 5 days.',                      'warning',  FALSE, '/tasks',               '{}', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'BSP Review Needed',          'Brian Maxwell BSP update is pending your review.',      'info',     FALSE, '/members/m0000022-0022-0022-0022-000000000022', '{}', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Member Return Expected',     'Derek Washington expected to return from medical leave in 3 weeks.', 'info', TRUE, '/members/m0000024-0024-0024-0024-000000000024', '{}', NOW() - INTERVAL '4 days');

-- ===========================================
-- 22. COMPLIANCE ALERTS (8)
-- ===========================================
INSERT INTO compliance_alerts (organization_id, severity, title, message, entity_type, entity_id, is_resolved, resolved_by, resolved_at, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'critical', 'Annual compliance report overdue',     'State regulatory report submission deadline was 5 days ago.', 'organization', '11111111-1111-1111-1111-111111111111', FALSE, NULL, NULL, NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'warning',  'ISP review overdue for 2 members',    'Robert Williams and Eleanor Mitchell ISPs past review date.', 'member', NULL, FALSE, NULL, NULL, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'info',     'Staff CPR certifications expiring',    '3 staff members have CPR certs expiring within 30 days.',     'organization', '11111111-1111-1111-1111-111111111111', FALSE, NULL, NULL, NOW() - INTERVAL '7 days'),
('11111111-1111-1111-1111-111111111111', 'warning',  'Medication record discrepancy',        'Pharmacy records do not match 2 internal medication entries.', 'medication', NULL, FALSE, NULL, NULL, NOW() - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'info',     'Fire drill completed',                 'Quarterly fire drill completed successfully at Main Campus.',  'organization', '11111111-1111-1111-1111-111111111111', TRUE, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '30 days', NOW() - INTERVAL '60 days'),
('22222222-2222-2222-2222-222222222222', 'warning',  'BSP update overdue',                   'Brian Maxwell behavioral support plan is 14 days past review.','member', 'm0000022-0022-0022-0022-000000000022', FALSE, NULL, NULL, NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'critical', 'Missing incident report',              'An incident was logged but no formal report was filed.',       'organization', '22222222-2222-2222-2222-222222222222', FALSE, NULL, NULL, NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'info',     'New member onboarding incomplete',     'Amanda Foster missing signed consent forms.',                  'member', 'm0000021-0021-0021-0021-000000000021', FALSE, NULL, NULL, NOW() - INTERVAL '10 days');

-- ===========================================
-- 23. AUDIT LOGS (15)
-- ===========================================
INSERT INTO audit_logs (organization_id, user_id, action, entity_type, entity_id, old_data, new_data, ip_address, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'create',  'member',       'm0000020-0020-0020-0020-000000000020', NULL, '{"full_name":"Carol Adams","status":"active"}', '192.168.1.10', NOW() - INTERVAL '14 days'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'update',  'member',       'm0000015-0015-0015-0015-000000000015', '{"status":"active"}', '{"status":"on_hold"}', '192.168.1.11', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'update',  'member',       'm0000019-0019-0019-0019-000000000019', '{"status":"active"}', '{"status":"discharged"}', '192.168.1.10', NOW() - INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'create',  'service_note', NULL, NULL, '{"member":"Robert Williams","status":"draft"}', '192.168.1.12', NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'update',  'service_note', NULL, '{"status":"pending_review"}', '{"status":"approved"}', '192.168.1.11', NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'update',  'service_note', NULL, '{"status":"pending_review"}', '{"status":"rejected","reason":"Insufficient detail"}', '192.168.1.11', NOW() - INTERVAL '6 days'),
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'create',  'medication',   'med00015-0015-0015-0015-000000000015', NULL, '{"name":"Melatonin","dosage":"3mg","member":"David Park"}', '192.168.1.12', NOW() - INTERVAL '60 days'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'update',  'organization', '11111111-1111-1111-1111-111111111111', '{"plan":"starter"}', '{"plan":"starter","max_members":50}', '192.168.1.10', NOW() - INTERVAL '90 days'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'create',  'life_plan',    'lp000001-0001-0001-0001-000000000001', NULL, '{"title":"Robert - Mobility & Independence Plan"}', '192.168.1.11', NOW() - INTERVAL '150 days'),
('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'update',  'life_plan_goal','goal0007-0007-0007-0007-000000000007', '{"progress":90,"status":"in_progress"}', '{"progress":100,"status":"completed"}', '192.168.1.12', NOW() - INTERVAL '100 days'),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'create',  'member',       'm0000021-0021-0021-0021-000000000021', NULL, '{"full_name":"Amanda Foster","status":"active"}', '10.0.0.5', NOW() - INTERVAL '30 days'),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'update',  'member',       'm0000024-0024-0024-0024-000000000024', '{"status":"active"}', '{"status":"inactive"}', '10.0.0.5', NOW() - INTERVAL '14 days'),
('22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'create',  'service_note', NULL, NULL, '{"member":"Christina Reyes","status":"pending_review"}', '10.0.0.6', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'create',  'task',         'task0020-0020-0020-0020-000000000020', NULL, '{"title":"Prepare grant application","priority":"urgent"}', '10.0.0.5', NOW() - INTERVAL '7 days'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'login',   'user',         'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, '{"ip":"192.168.1.10","method":"password"}', '192.168.1.10', NOW() - INTERVAL '1 hour');

-- ============================================================================
-- Seed complete. Summary:
-- Organizations: 2 | Locations: 5 | Staff Profiles: 6 | Members: 25
-- Emergency Contacts: 12 | Diagnoses: 8 | Note Templates: 5
-- Service Notes: 60 | Attendance: ~130 (generated) | Medications: 15
-- Medication Logs: 30 | Tasks: 20 | Task Comments: 5
-- Appointments: 12 | Life Plans: 4 | Goals: 10 | Milestones: 20
-- Reviews: 6 | Content Resources: 8 | Content Assignments: 5
-- Notifications: 10 | Compliance Alerts: 8 | Audit Logs: 15
-- ============================================================================
