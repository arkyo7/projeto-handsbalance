export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointment_history: {
        Row: {
          action: string
          actor: string
          appointment_id: string
          created_at: string
          details: string
          id: string
        }
        Insert: {
          action: string
          actor?: string
          appointment_id: string
          created_at?: string
          details?: string
          id?: string
        }
        Update: {
          action?: string
          actor?: string
          appointment_id?: string
          created_at?: string
          details?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          accepted_cancellation_policy: boolean
          accepted_privacy_policy: boolean
          amount_due_cents: number
          appointment_date: string
          created_at: string
          currency: string
          customer_comments: string
          customer_id: string
          duration_minutes: number
          end_time: string
          id: string
          internal_notes: string
          manage_token: string
          payment_mode: Database["public"]["Enums"]["payment_mode"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          price_cents: number
          reference: string
          service_id: string
          service_name: string
          slot: unknown
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          timezone: string
          token_expires_at: string
          updated_at: string
        }
        Insert: {
          accepted_cancellation_policy?: boolean
          accepted_privacy_policy?: boolean
          amount_due_cents?: number
          appointment_date: string
          created_at?: string
          currency?: string
          customer_comments?: string
          customer_id: string
          duration_minutes: number
          end_time: string
          id?: string
          internal_notes?: string
          manage_token: string
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price_cents: number
          reference: string
          service_id: string
          service_name: string
          slot?: unknown
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          timezone?: string
          token_expires_at?: string
          updated_at?: string
        }
        Update: {
          accepted_cancellation_policy?: boolean
          accepted_privacy_policy?: boolean
          amount_due_cents?: number
          appointment_date?: string
          created_at?: string
          currency?: string
          customer_comments?: string
          customer_id?: string
          duration_minutes?: number
          end_time?: string
          id?: string
          internal_notes?: string
          manage_token?: string
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price_cents?: number
          reference?: string
          service_id?: string
          service_name?: string
          slot?: unknown
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          timezone?: string
          token_expires_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_exceptions: {
        Row: {
          created_at: string
          end_time: string
          exception_date: string
          id: string
          note: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time: string
          exception_date: string
          id?: string
          note?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string
          exception_date?: string
          id?: string
          note?: string | null
          start_time?: string
        }
        Relationships: []
      }
      blocked_periods: {
        Row: {
          created_at: string
          end_date: string
          end_time: string | null
          id: string
          reason: string | null
          start_date: string
          start_time: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          end_time?: string | null
          id?: string
          reason?: string | null
          start_date: string
          start_time?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          end_time?: string | null
          id?: string
          reason?: string | null
          start_date?: string
          start_time?: string | null
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string
          id: string
          is_open: boolean
          open_time: string
          updated_at: string
          weekday: number
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          id?: string
          is_open?: boolean
          open_time?: string
          updated_at?: string
          weekday: number
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          id?: string
          is_open?: boolean
          open_time?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          about_text: string
          address_line1: string
          admin_notification_email: string | null
          business_name: string
          cancellation_policy: string
          cancellation_window_hours: number
          city: string
          country: string
          created_at: string
          currency: string
          default_language: string
          deposit_cents: number
          email: string
          emails_configured: boolean
          gap_between_sessions_minutes: number
          gift_card_rules: string | null
          gift_card_validity: string | null
          id: string
          instagram_handle: string | null
          instagram_url: string | null
          internal_notes: string
          max_advance_days: number
          min_notice_hours: number
          payment_mode: Database["public"]["Enums"]["payment_mode"]
          phone: string
          phone_international: string
          postal_code: string
          practitioner_bio: string | null
          practitioner_certifications: string | null
          practitioner_experience: string | null
          practitioner_languages: string | null
          practitioner_name: string | null
          reviews_url: string | null
          show_business_hours: boolean
          slot_interval_minutes: number
          timezone: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          about_text?: string
          address_line1?: string
          admin_notification_email?: string | null
          business_name?: string
          cancellation_policy?: string
          cancellation_window_hours?: number
          city?: string
          country?: string
          created_at?: string
          currency?: string
          default_language?: string
          deposit_cents?: number
          email?: string
          emails_configured?: boolean
          gap_between_sessions_minutes?: number
          gift_card_rules?: string | null
          gift_card_validity?: string | null
          id?: string
          instagram_handle?: string | null
          instagram_url?: string | null
          internal_notes?: string
          max_advance_days?: number
          min_notice_hours?: number
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          phone?: string
          phone_international?: string
          postal_code?: string
          practitioner_bio?: string | null
          practitioner_certifications?: string | null
          practitioner_experience?: string | null
          practitioner_languages?: string | null
          practitioner_name?: string | null
          reviews_url?: string | null
          show_business_hours?: boolean
          slot_interval_minutes?: number
          timezone?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          about_text?: string
          address_line1?: string
          admin_notification_email?: string | null
          business_name?: string
          cancellation_policy?: string
          cancellation_window_hours?: number
          city?: string
          country?: string
          created_at?: string
          currency?: string
          default_language?: string
          deposit_cents?: number
          email?: string
          emails_configured?: boolean
          gap_between_sessions_minutes?: number
          gift_card_rules?: string | null
          gift_card_validity?: string | null
          id?: string
          instagram_handle?: string | null
          instagram_url?: string | null
          internal_notes?: string
          max_advance_days?: number
          min_notice_hours?: number
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          phone?: string
          phone_international?: string
          postal_code?: string
          practitioner_bio?: string | null
          practitioner_certifications?: string | null
          practitioner_experience?: string | null
          practitioner_languages?: string | null
          practitioner_name?: string | null
          reviews_url?: string | null
          show_business_hours?: boolean
          slot_interval_minutes?: number
          timezone?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          country_code: string
          created_at: string
          email: string
          full_name: string
          id: string
          internal_notes: string
          phone: string
          preferred_language: string
          updated_at: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          internal_notes?: string
          phone: string
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          internal_notes?: string
          phone?: string
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          appointment_id: string | null
          created_at: string
          error: string | null
          id: string
          recipient: string
          status: Database["public"]["Enums"]["email_log_status"]
          template: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          recipient: string
          status?: Database["public"]["Enums"]["email_log_status"]
          template: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          recipient?: string
          status?: Database["public"]["Enums"]["email_log_status"]
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_published: boolean
          language: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_published?: boolean
          language?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_published?: boolean
          language?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_featured: boolean
          is_published: boolean
          sort_order: number
        }
        Insert: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
        }
        Update: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          amount_cents: number
          code: string
          created_at: string
          currency: string
          id: string
          is_redeemed: boolean
          payment_status: Database["public"]["Enums"]["payment_status"]
          personal_message: string | null
          purchaser_email: string | null
          purchaser_name: string | null
          recipient_name: string | null
          service_id: string | null
          valid_until: string | null
        }
        Insert: {
          amount_cents: number
          code: string
          created_at?: string
          currency?: string
          id?: string
          is_redeemed?: boolean
          payment_status?: Database["public"]["Enums"]["payment_status"]
          personal_message?: string | null
          purchaser_email?: string | null
          purchaser_name?: string | null
          recipient_name?: string | null
          service_id?: string | null
          valid_until?: string | null
        }
        Update: {
          amount_cents?: number
          code?: string
          created_at?: string
          currency?: string
          id?: string
          is_redeemed?: boolean
          payment_status?: Database["public"]["Enums"]["payment_status"]
          personal_message?: string | null
          purchaser_email?: string | null
          purchaser_name?: string | null
          recipient_name?: string | null
          service_id?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          appointment_id: string | null
          created_at: string
          currency: string
          id: string
          notes: string
          provider: string
          refund_requested: boolean
          refunded_cents: number
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          appointment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string
          provider?: string
          refund_requested?: boolean
          refunded_cents?: number
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          appointment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string
          provider?: string
          refund_requested?: boolean
          refunded_cents?: number
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          is_published: boolean
          language: string
          rating: number
          sort_order: number
          source: string | null
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          language?: string
          rating?: number
          sort_order?: number
          source?: string | null
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          language?: string
          rating?: number
          sort_order?: number
          source?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          buffer_minutes: number
          created_at: string
          description: string
          duration_minutes: number
          id: string
          image_url: string | null
          internal_notes: string
          is_active: boolean
          is_archived: boolean
          is_bookable: boolean
          is_featured: boolean
          name: string
          notes: string
          online_payment_enabled: boolean
          price_cents: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          buffer_minutes?: number
          created_at?: string
          description?: string
          duration_minutes: number
          id?: string
          image_url?: string | null
          internal_notes?: string
          is_active?: boolean
          is_archived?: boolean
          is_bookable?: boolean
          is_featured?: boolean
          name: string
          notes?: string
          online_payment_enabled?: boolean
          price_cents: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          buffer_minutes?: number
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          image_url?: string | null
          internal_notes?: string
          is_active?: boolean
          is_archived?: boolean
          is_bookable?: boolean
          is_featured?: boolean
          name?: string
          notes?: string
          online_payment_enabled?: boolean
          price_cents?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      appointment_status:
        | "pending_payment"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      email_log_status: "pending" | "sent" | "failed"
      payment_mode: "full_payment" | "deposit" | "pay_on_site"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_refunded"
        | "not_required"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
      appointment_status: [
        "pending_payment",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      email_log_status: ["pending", "sent", "failed"],
      payment_mode: ["full_payment", "deposit", "pay_on_site"],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
        "not_required",
      ],
    },
  },
} as const
