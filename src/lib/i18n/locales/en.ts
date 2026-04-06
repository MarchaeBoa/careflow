const en = {
  // ─── Common ──────────────────────────────────────────────────────────────
  common: {
    appName: "CareFlow",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    export: "Export",
    import: "Import",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    ok: "OK",
    loading: "Loading...",
    noResults: "No results found",
    noData: "No data available",
    error: "An error occurred",
    success: "Success",
    warning: "Warning",
    info: "Information",
    required: "Required",
    optional: "Optional",
    actions: "Actions",
    status: "Status",
    type: "Type",
    date: "Date",
    time: "Time",
    name: "Name",
    description: "Description",
    notes: "Notes",
    tags: "Tags",
    category: "Category",
    priority: "Priority",
    assignee: "Assignee",
    createdAt: "Created at",
    updatedAt: "Updated at",
    createdBy: "Created by",
    viewAll: "View all",
    showMore: "Show more",
    showLess: "Show less",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    uploadFile: "Upload file",
    downloadFile: "Download file",
    dragAndDrop: "Drag and drop files here",
    or: "or",
    of: "of",
    total: "Total",
    page: "Page",
    rowsPerPage: "Rows per page",
  },

  // ─── Auth ────────────────────────────────────────────────────────────────
  auth: {
    login: "Log in",
    logout: "Log out",
    register: "Register",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset password",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    fullName: "Full name",
    rememberMe: "Remember me",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUp: "Sign up",
    signIn: "Sign in",
    signInWith: "Sign in with",
    orContinueWith: "Or continue with",
    verifyEmail: "Check your email for a verification link",
    passwordReset: "Check your email for a password reset link",
    invalidCredentials: "Invalid email or password",
    accountCreated: "Account created successfully",
  },

  // ─── Navigation ──────────────────────────────────────────────────────────
  nav: {
    dashboard: "Dashboard",
    overview: "Overview",
    members: "Members",
    notes: "Service Notes",
    attendance: "Attendance",
    medications: "Medications",
    tasks: "Tasks",
    appointments: "Appointments",
    lifePlans: "Life Plans",
    resources: "Resources",
    settings: "Settings",
    profile: "Profile",
    auditLog: "Audit Log",
    notifications: "Notifications",
    help: "Help & Support",
  },

  // ─── Dashboard ───────────────────────────────────────────────────────────
  dashboard: {
    welcome: "Welcome back",
    totalMembers: "Total Members",
    activeMembers: "Active Members",
    pendingTasks: "Pending Tasks",
    upcomingAppointments: "Upcoming Appointments",
    pendingNotes: "Pending Notes",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    addMember: "Add Member",
    createNote: "Create Note",
    addTask: "Add Task",
    scheduleAppointment: "Schedule Appointment",
  },

  // ─── Members ─────────────────────────────────────────────────────────────
  members: {
    title: "Members",
    addMember: "Add Member",
    editMember: "Edit Member",
    memberDetails: "Member Details",
    personalInfo: "Personal Information",
    emergencyContacts: "Emergency Contacts",
    diagnoses: "Diagnoses",
    documents: "Documents",
    fullName: "Full Name",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    address: "Address",
    phone: "Phone",
    email: "Email",
    nhsNumber: "NHS Number",
    keyWorker: "Key Worker",
    status: {
      active: "Active",
      inactive: "Inactive",
      on_hold: "On Hold",
      discharged: "Discharged",
    },
  },

  // ─── Service Notes ───────────────────────────────────────────────────────
  notes: {
    title: "Service Notes",
    createNote: "Create Note",
    editNote: "Edit Note",
    noteDetails: "Note Details",
    content: "Content",
    author: "Author",
    member: "Member",
    confidential: "Confidential",
    template: "Template",
    approve: "Approve",
    reject: "Reject",
    status: {
      draft: "Draft",
      submitted: "Submitted",
      approved: "Approved",
      rejected: "Rejected",
    },
  },

  // ─── Attendance ──────────────────────────────────────────────────────────
  attendance: {
    title: "Attendance",
    checkIn: "Check In",
    checkOut: "Check Out",
    location: "Location",
    record: "Record Attendance",
    status: {
      present: "Present",
      absent: "Absent",
      late: "Late",
      excused: "Excused",
    },
  },

  // ─── Medications ─────────────────────────────────────────────────────────
  medications: {
    title: "Medications",
    addMedication: "Add Medication",
    editMedication: "Edit Medication",
    medicationName: "Medication Name",
    dosage: "Dosage",
    frequency: "Frequency",
    prescriber: "Prescriber",
    pharmacy: "Pharmacy",
    startDate: "Start Date",
    endDate: "End Date",
    sideEffects: "Side Effects",
    administrationLog: "Administration Log",
    administer: "Administer",
    status: {
      active: "Active",
      paused: "Paused",
      discontinued: "Discontinued",
    },
    logStatus: {
      given: "Given",
      refused: "Refused",
      missed: "Missed",
      held: "Held",
    },
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────
  tasks: {
    title: "Tasks",
    addTask: "Add Task",
    editTask: "Edit Task",
    taskDetails: "Task Details",
    dueDate: "Due Date",
    checklist: "Checklist",
    addChecklistItem: "Add checklist item",
    priority: {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent",
    },
    status: {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    },
  },

  // ─── Appointments ────────────────────────────────────────────────────────
  appointments: {
    title: "Appointments",
    schedule: "Schedule Appointment",
    editAppointment: "Edit Appointment",
    appointmentDetails: "Appointment Details",
    duration: "Duration",
    transportNeeded: "Transport Needed",
    transportDetails: "Transport Details",
    responsible: "Responsible",
    recurrence: "Recurrence",
    type: {
      medical: "Medical",
      therapy: "Therapy",
      review: "Review",
      assessment: "Assessment",
      social: "Social",
      other: "Other",
    },
    status: {
      scheduled: "Scheduled",
      completed: "Completed",
      cancelled: "Cancelled",
      no_show: "No Show",
    },
  },

  // ─── Life Plans ──────────────────────────────────────────────────────────
  lifePlans: {
    title: "Life Plans",
    createPlan: "Create Life Plan",
    editPlan: "Edit Life Plan",
    planDetails: "Plan Details",
    goals: "Goals",
    milestones: "Milestones",
    evidence: "Evidence",
    reviews: "Reviews",
    addGoal: "Add Goal",
    addMilestone: "Add Milestone",
    addEvidence: "Add Evidence",
    nextReview: "Next Review",
    status: {
      active: "Active",
      under_review: "Under Review",
      completed: "Completed",
      archived: "Archived",
    },
  },

  // ─── Resources ───────────────────────────────────────────────────────────
  resources: {
    title: "Resources",
    addResource: "Add Resource",
    editResource: "Edit Resource",
    resourceDetails: "Resource Details",
    assignTo: "Assign To",
    type: {
      pdf: "PDF",
      video: "Video",
      link: "Link",
      image: "Image",
      document: "Document",
    },
  },

  // ─── Settings ────────────────────────────────────────────────────────────
  settings: {
    title: "Settings",
    general: "General",
    team: "Team",
    billing: "Billing",
    integrations: "Integrations",
    organizationName: "Organization Name",
    organizationSlug: "Organization Slug",
    timezone: "Timezone",
    dateFormat: "Date Format",
    language: "Language",
    theme: "Theme",
    inviteUser: "Invite User",
    manageRoles: "Manage Roles",
    currentPlan: "Current Plan",
    upgradePlan: "Upgrade Plan",
  },

  // ─── Profile ─────────────────────────────────────────────────────────────
  profile: {
    title: "Profile",
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    preferences: "Preferences",
    notificationSettings: "Notification Settings",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
  },

  // ─── Roles ───────────────────────────────────────────────────────────────
  roles: {
    SUPER_ADMIN: "Super Admin",
    ORG_ADMIN: "Organization Admin",
    MANAGER: "Manager",
    STAFF: "Staff",
  },

  // ─── Validation ──────────────────────────────────────────────────────────
  validation: {
    required: "This field is required",
    email: "Please enter a valid email address",
    minLength: "Must be at least {min} characters",
    maxLength: "Must be at most {max} characters",
    passwordMismatch: "Passwords do not match",
    invalidDate: "Please enter a valid date",
    futureDate: "Date must be in the future",
    pastDate: "Date must be in the past",
  },
} as const;

// ─── Deep writable type that widens string literals to `string` ─────────────

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? DeepStringRecord<T[K]>
      : T[K];
};

export type TranslationKeys = DeepStringRecord<typeof en>;
export default en;
