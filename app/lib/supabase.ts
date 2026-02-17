import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types for database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
      };
      finance_settings: {
        Row: {
          id: string;
          user_id: string;
          monthly_fixed: number;
          monthly_variable: number;
          current_savings: number;
          lump_sum: number;
          start_date: string;
          monthly_income: number;
          income_months: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['finance_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['finance_settings']['Insert']>;
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          category: string;
          amount: number;
          memo?: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
      recurring_expenses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          category: string;
          day_of_month: number;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['recurring_expenses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['recurring_expenses']['Insert']>;
      };
      ideas: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          tags: string[];
          feasibility: number;
          profitability: number;
          interest: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ideas']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ideas']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: 'planned' | 'in-progress' | 'completed' | 'paused';
          progress: number;
          due_date?: string;
          next_action?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          morning_plan?: string;
          morning_mood?: 'happy' | 'neutral' | 'sad';
          morning_energy?: 1 | 2 | 3;
          evening_done?: string;
          evening_learned?: string;
          evening_tomorrow?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_checkins']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['daily_checkins']['Insert']>;
      };
      monthly_budgets: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          budget: number;
          categories: Record<string, number>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['monthly_budgets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['monthly_budgets']['Insert']>;
      };
      finance_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          deadline?: string;
          description?: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['finance_goals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['finance_goals']['Insert']>;
      };
      scenarios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description?: string;
          is_base: boolean;
          total_savings: number;
          monthly_expenses: number;
          monthly_income: number;
          one_time_expenses: unknown; // JSONB
          recurring_items: unknown; // JSONB
          calculated_runway?: number;
          calculated_burn_rate?: number;
          calculated_breakeven_month?: number;
          calculated_end_savings?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scenarios']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scenarios']['Insert']>;
      };
    };
  };
};
