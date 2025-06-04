export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_parts: {
        Row: {
          cost: number
          created_at: string | null
          id: string
          location: string | null
          minimum_quantity: number | null
          name: string
          part_number: string
          price: number
          quantity: number
          supplier: string | null
          updated_at: string | null
        }
        Insert: {
          cost: number
          created_at?: string | null
          id?: string
          location?: string | null
          minimum_quantity?: number | null
          name: string
          part_number: string
          price: number
          quantity?: number
          supplier?: string | null
          updated_at?: string | null
        }
        Update: {
          cost?: number
          created_at?: string | null
          id?: string
          location?: string | null
          minimum_quantity?: number | null
          name?: string
          part_number?: string
          price?: number
          quantity?: number
          supplier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string | null
          customer_id: string
          date: string
          due_date: string
          id: string
          notes: string | null
          number: string
          repair_id: string
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          date: string
          due_date: string
          id?: string
          notes?: string | null
          number: string
          repair_id: string
          status?: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          date?: string
          due_date?: string
          id?: string
          notes?: string | null
          number?: string
          repair_id?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycles: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          license_plate: string
          make: string
          model: string
          updated_at: string | null
          vin: string | null
          year: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          license_plate: string
          make: string
          model: string
          updated_at?: string | null
          vin?: string | null
          year: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          license_plate?: string
          make?: string
          model?: string
          updated_at?: string | null
          vin?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "motorcycles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          date_added: string | null
          id: string
          repair_id: string
          url: string
        }
        Insert: {
          caption?: string | null
          date_added?: string | null
          id?: string
          repair_id: string
          url: string
        }
        Update: {
          caption?: string | null
          date_added?: string | null
          id?: string
          repair_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
        ]
      }
      repairs: {
        Row: {
          customer_id: string
          date_completed: string | null
          date_created: string | null
          date_updated: string | null
          description: string
          id: string
          labor_hours: number | null
          labor_rate: number | null
          motorcycle_id: string
          notes: string | null
          status: string
          title: string
        }
        Insert: {
          customer_id: string
          date_completed?: string | null
          date_created?: string | null
          date_updated?: string | null
          description: string
          id?: string
          labor_hours?: number | null
          labor_rate?: number | null
          motorcycle_id: string
          notes?: string | null
          status?: string
          title: string
        }
        Update: {
          customer_id?: string
          date_completed?: string | null
          date_created?: string | null
          date_updated?: string | null
          description?: string
          id?: string
          labor_hours?: number | null
          labor_rate?: number | null
          motorcycle_id?: string
          notes?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "repairs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycles"
            referencedColumns: ["id"]
          },
        ]
      }
      used_parts: {
        Row: {
          created_at: string | null
          id: string
          part_id: string
          part_name: string
          price_each: number
          quantity: number
          repair_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          part_id: string
          part_name: string
          price_each: number
          quantity: number
          repair_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          part_id?: string
          part_name?: string
          price_each?: number
          quantity?: number
          repair_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "used_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "inventory_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "used_parts_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_or_tech: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_customer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_customer_owner: {
        Args: { customer_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
