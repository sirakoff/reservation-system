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
      accommodations: {
        Row: {
          address: string | null
          capacity: string | null
          created_at: string
          description: string | null
          establishment_id: number | null
          id: number
          name: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          capacity?: string | null
          created_at?: string
          description?: string | null
          establishment_id?: number | null
          id?: number
          name?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          capacity?: string | null
          created_at?: string
          description?: string | null
          establishment_id?: number | null
          id?: number
          name?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          accommodation_id: number | null
          available_slot: string | null
          created_at: string
          date: string | null
          id: number
        }
        Insert: {
          accommodation_id?: number | null
          available_slot?: string | null
          created_at?: string
          date?: string | null
          id?: number
        }
        Update: {
          accommodation_id?: number | null
          available_slot?: string | null
          created_at?: string
          date?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "availability_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          accommodation_id: number | null
          created_at: string
          date: string | null
          details: Json | null
          id: number
          user_id: string | null
        }
        Insert: {
          accommodation_id?: number | null
          created_at?: string
          date?: string | null
          details?: Json | null
          id?: number
          user_id?: string | null
        }
        Update: {
          accommodation_id?: number | null
          created_at?: string
          date?: string | null
          details?: Json | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          created_at: string
          email: string | null
          id: number
          location: string | null
          name: string | null
          owner_id: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          location?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          location?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      galleries: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          accommodation_id: number | null
          created_at: string
          dimensions: Json | null
          establishment_id: number
          gallery_id: number | null
          id: number
          name: string | null
          type: string | null
        }
        Insert: {
          accommodation_id?: number | null
          created_at?: string
          dimensions?: Json | null
          establishment_id: number
          gallery_id?: number | null
          id?: number
          name?: string | null
          type?: string | null
        }
        Update: {
          accommodation_id?: number | null
          created_at?: string
          dimensions?: Json | null
          establishment_id?: number
          gallery_id?: number | null
          id?: number
          name?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_media_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      slots: {
        Row: {
          created_at: string
          id: number
          is_available: boolean | null
          range: unknown | null
          table_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_available?: boolean | null
          range?: unknown | null
          table_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_available?: boolean | null
          range?: unknown | null
          table_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slots_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          capacity: number | null
          created_at: string
          id: number
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: number
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
