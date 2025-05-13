
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define our Database type instead of extending the Supabase generated type
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      motorcycles: {
        Row: {
          id: string;
          customer_id: string;
          make: string;
          model: string;
          year: string;
          license_plate: string;
          vin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          make: string;
          model: string;
          year: string;
          license_plate: string;
          vin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          make?: string;
          model?: string;
          year?: string;
          license_plate?: string;
          vin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      repairs: {
        Row: {
          id: string;
          motorcycle_id: string;
          customer_id: string;
          title: string;
          description: string;
          status: string;
          labor_hours: number | null;
          labor_rate: number | null;
          notes: string | null;
          date_created: string;
          date_updated: string;
          date_completed: string | null;
        };
        Insert: {
          id?: string;
          motorcycle_id: string;
          customer_id: string;
          title: string;
          description: string;
          status?: string;
          labor_hours?: number | null;
          labor_rate?: number | null;
          notes?: string | null;
          date_created?: string;
          date_updated?: string;
          date_completed?: string | null;
        };
        Update: {
          id?: string;
          motorcycle_id?: string;
          customer_id?: string;
          title?: string;
          description?: string;
          status?: string;
          labor_hours?: number | null;
          labor_rate?: number | null;
          notes?: string | null;
          date_created?: string;
          date_updated?: string;
          date_completed?: string | null;
        };
      };
      photos: {
        Row: {
          id: string;
          repair_id: string;
          url: string;
          caption: string | null;
          date_added: string;
        };
        Insert: {
          id?: string;
          repair_id: string;
          url: string;
          caption?: string | null;
          date_added?: string;
        };
        Update: {
          id?: string;
          repair_id?: string;
          url?: string;
          caption?: string | null;
          date_added?: string;
        };
      };
      inventory_parts: {
        Row: {
          id: string;
          name: string;
          part_number: string;
          price: number;
          cost: number;
          quantity: number;
          minimum_quantity: number | null;
          location: string | null;
          supplier: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          part_number: string;
          price: number;
          cost: number;
          quantity?: number;
          minimum_quantity?: number | null;
          location?: string | null;
          supplier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          part_number?: string;
          price?: number;
          cost?: number;
          quantity?: number;
          minimum_quantity?: number | null;
          location?: string | null;
          supplier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      used_parts: {
        Row: {
          id: string;
          repair_id: string;
          part_id: string;
          part_name: string;
          quantity: number;
          price_each: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          repair_id: string;
          part_id: string;
          part_name: string;
          quantity: number;
          price_each: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          repair_id?: string;
          part_id?: string;
          part_name?: string;
          quantity?: number;
          price_each?: number;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          repair_id: string;
          customer_id: string;
          number: string;
          date: string;
          due_date: string;
          subtotal: number;
          tax: number;
          total: number;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          repair_id: string;
          customer_id: string;
          number: string;
          date: string;
          due_date: string;
          subtotal: number;
          tax: number;
          total: number;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          repair_id?: string;
          customer_id?: string;
          number?: string;
          date?: string;
          due_date?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
