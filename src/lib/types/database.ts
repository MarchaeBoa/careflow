// ─── Supabase Database Type Definitions ──────────────────────────────────────
// This file defines the shape of the Supabase database for full type safety.
// Regenerate from Supabase CLI with: npx supabase gen types typescript --local

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          settings: Record<string, unknown>;
          plan: string;
          owner_id: string;
          max_members: number;
          max_staff: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          settings?: Record<string, unknown>;
          plan?: string;
          owner_id: string;
          max_members?: number;
          max_staff?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          settings?: Record<string, unknown>;
          plan?: string;
          owner_id?: string;
          max_members?: number;
          max_staff?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: string;
          organization_id: string;
          phone: string | null;
          job_title: string | null;
          is_active: boolean;
          last_sign_in_at: string | null;
          preferences: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: string;
          organization_id: string;
          phone?: string | null;
          job_title?: string | null;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          preferences?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: string;
          organization_id?: string;
          phone?: string | null;
          job_title?: string | null;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          preferences?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      members: {
        Row: {
          id: string;
          organization_id: string;
          full_name: string;
          date_of_birth: string;
          photo_url: string | null;
          status: string;
          gender: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          nhs_number: string | null;
          emergency_contacts: Record<string, unknown>[];
          diagnoses: Record<string, unknown>[];
          notes: string | null;
          documents: Record<string, unknown>[];
          tags: string[];
          key_worker_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          full_name: string;
          date_of_birth: string;
          photo_url?: string | null;
          status?: string;
          gender?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          nhs_number?: string | null;
          emergency_contacts?: Record<string, unknown>[];
          diagnoses?: Record<string, unknown>[];
          notes?: string | null;
          documents?: Record<string, unknown>[];
          tags?: string[];
          key_worker_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          full_name?: string;
          date_of_birth?: string;
          photo_url?: string | null;
          status?: string;
          gender?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          nhs_number?: string | null;
          emergency_contacts?: Record<string, unknown>[];
          diagnoses?: Record<string, unknown>[];
          notes?: string | null;
          documents?: Record<string, unknown>[];
          tags?: string[];
          key_worker_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_key_worker_id_fkey";
            columns: ["key_worker_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      service_notes: {
        Row: {
          id: string;
          member_id: string;
          author_id: string;
          content: string;
          tags: string[];
          status: string;
          approved_by: string | null;
          approved_at: string | null;
          template_id: string | null;
          attachments: Record<string, unknown>[];
          is_confidential: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          author_id: string;
          content: string;
          tags?: string[];
          status?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          template_id?: string | null;
          attachments?: Record<string, unknown>[];
          is_confidential?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          author_id?: string;
          content?: string;
          tags?: string[];
          status?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          template_id?: string | null;
          attachments?: Record<string, unknown>[];
          is_confidential?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_notes_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_notes_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_notes_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_notes_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "note_templates";
            referencedColumns: ["id"];
          }
        ];
      };
      note_templates: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string;
          content_schema: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string;
          content_schema?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string;
          content_schema?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "note_templates_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      attendance_records: {
        Row: {
          id: string;
          member_id: string;
          staff_id: string;
          check_in: string;
          check_out: string | null;
          location_id: string | null;
          date: string;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          staff_id: string;
          check_in: string;
          check_out?: string | null;
          location_id?: string | null;
          date: string;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          staff_id?: string;
          check_in?: string;
          check_out?: string | null;
          location_id?: string | null;
          date?: string;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_records_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_records_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_records_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "attendance_locations";
            referencedColumns: ["id"];
          }
        ];
      };
      attendance_locations: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          address: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          address?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          address?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_locations_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      medications: {
        Row: {
          id: string;
          member_id: string;
          name: string;
          dosage: string;
          form: string | null;
          route: string | null;
          prescriber: string | null;
          pharmacy: string | null;
          schedule: Record<string, unknown>;
          status: string;
          start_date: string;
          end_date: string | null;
          side_effects: string | null;
          logs: Record<string, unknown>[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          name: string;
          dosage: string;
          form?: string | null;
          route?: string | null;
          prescriber?: string | null;
          pharmacy?: string | null;
          schedule?: Record<string, unknown>;
          status?: string;
          start_date: string;
          end_date?: string | null;
          side_effects?: string | null;
          logs?: Record<string, unknown>[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          name?: string;
          dosage?: string;
          form?: string | null;
          route?: string | null;
          prescriber?: string | null;
          pharmacy?: string | null;
          schedule?: Record<string, unknown>;
          status?: string;
          start_date?: string;
          end_date?: string | null;
          side_effects?: string | null;
          logs?: Record<string, unknown>[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medications_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string | null;
          assignee_id: string | null;
          creator_id: string;
          priority: string;
          status: string;
          due_date: string | null;
          completed_at: string | null;
          checklist: Record<string, unknown>[];
          tags: string[];
          member_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description?: string | null;
          assignee_id?: string | null;
          creator_id: string;
          priority?: string;
          status?: string;
          due_date?: string | null;
          completed_at?: string | null;
          checklist?: Record<string, unknown>[];
          tags?: string[];
          member_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          description?: string | null;
          assignee_id?: string | null;
          creator_id?: string;
          priority?: string;
          status?: string;
          due_date?: string | null;
          completed_at?: string | null;
          checklist?: Record<string, unknown>[];
          tags?: string[];
          member_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey";
            columns: ["assignee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      appointments: {
        Row: {
          id: string;
          member_id: string;
          type: string;
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
          recurrence: Record<string, unknown> | null;
          status: string;
          reminder_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          type: string;
          title: string;
          date: string;
          time: string;
          duration_minutes?: number;
          location?: string | null;
          location_id?: string | null;
          responsible_id?: string | null;
          notes?: string | null;
          transport_needed?: boolean;
          transport_details?: string | null;
          recurrence?: Record<string, unknown> | null;
          status?: string;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          type?: string;
          title?: string;
          date?: string;
          time?: string;
          duration_minutes?: number;
          location?: string | null;
          location_id?: string | null;
          responsible_id?: string | null;
          notes?: string | null;
          transport_needed?: boolean;
          transport_details?: string | null;
          recurrence?: Record<string, unknown> | null;
          status?: string;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_responsible_id_fkey";
            columns: ["responsible_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      life_plans: {
        Row: {
          id: string;
          member_id: string;
          goals: Record<string, unknown>[];
          milestones: Record<string, unknown>[];
          evidence: Record<string, unknown>[];
          reviews: Record<string, unknown>[];
          status: string;
          current_review_date: string | null;
          next_review_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          goals?: Record<string, unknown>[];
          milestones?: Record<string, unknown>[];
          evidence?: Record<string, unknown>[];
          reviews?: Record<string, unknown>[];
          status?: string;
          current_review_date?: string | null;
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          goals?: Record<string, unknown>[];
          milestones?: Record<string, unknown>[];
          evidence?: Record<string, unknown>[];
          reviews?: Record<string, unknown>[];
          status?: string;
          current_review_date?: string | null;
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "life_plans_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      content_resources: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string | null;
          type: string;
          url: string;
          category: string;
          tags: string[];
          assigned_to: string[];
          uploaded_by: string;
          file_size: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description?: string | null;
          type: string;
          url: string;
          category: string;
          tags?: string[];
          assigned_to?: string[];
          uploaded_by: string;
          file_size?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          url?: string;
          category?: string;
          tags?: string[];
          assigned_to?: string[];
          uploaded_by?: string;
          file_size?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_resources_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_resources_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Record<string, unknown>;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Record<string, unknown>;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Record<string, unknown>;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_organization_stats: {
        Args: { org_id: string };
        Returns: {
          total_members: number;
          active_members: number;
          total_staff: number;
          pending_tasks: number;
          upcoming_appointments: number;
          pending_notes: number;
        }[];
      };
    };
    Enums: {
      user_role: "SUPER_ADMIN" | "ORG_ADMIN" | "MANAGER" | "STAFF";
      member_status: "active" | "inactive" | "on_hold" | "discharged";
      note_status: "draft" | "submitted" | "approved" | "rejected";
      task_priority: "low" | "medium" | "high" | "urgent";
      task_status: "todo" | "in_progress" | "completed" | "cancelled";
      medication_status: "active" | "paused" | "discontinued";
      appointment_type:
        | "medical"
        | "therapy"
        | "review"
        | "assessment"
        | "social"
        | "other";
      life_plan_status:
        | "active"
        | "under_review"
        | "completed"
        | "archived";
      resource_type: "pdf" | "video" | "link" | "image" | "document";
      org_plan: "free" | "starter" | "professional" | "enterprise";
    };
    CompositeTypes: Record<string, never>;
  };
}

// ─── Helper types for table access ───────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
