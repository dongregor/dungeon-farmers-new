/**
 * Supabase Database Types
 *
 * This file is a placeholder. To generate actual types from your Supabase schema:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Generate types: supabase gen types typescript --project-id YOUR_PROJECT_ID > app/types/database.types.ts
 *
 * Or use the Supabase Dashboard:
 * Settings -> API -> Generate Types -> TypeScript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your table types here after generating from Supabase
      // Example:
      // heroes: {
      //   Row: { id: string; name: string; ... }
      //   Insert: { id?: string; name: string; ... }
      //   Update: { id?: string; name?: string; ... }
      // }
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
  }
}
