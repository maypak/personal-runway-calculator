-- ============================================
-- P0 CRITICAL: Missing Database Tables
-- Execute this ONCE in Supabase Dashboard > SQL Editor
-- ============================================
-- Project: Personal Runway Calculator
-- Date: 2026-02-18
-- Purpose: Add 3 missing tables to production database
-- Tables: scenarios, fire_settings, phases
-- ============================================

-- ============================================
-- 1. SCENARIOS TABLE (Scenario Comparison Feature)
-- ============================================

-- Create scenarios table
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Scenario metadata
  name TEXT NOT NULL,
  description TEXT,
  is_base BOOLEAN DEFAULT false,
  
  -- Financial data (mirroring finance_settings structure)
  total_savings NUMERIC NOT NULL DEFAULT 0,
  monthly_expenses NUMERIC NOT NULL DEFAULT 0,
  monthly_income NUMERIC DEFAULT 0,
  
  -- One-time expenses (JSONB array)
  -- Structure: [{"name": "Bootcamp", "amount": 5000, "month": 3}]
  one_time_expenses JSONB DEFAULT '[]'::jsonb,
  
  -- Recurring items (JSONB array)
  -- Structure: [{"name": "Freelance", "amount": 2000, "type": "income", "startMonth": 0, "endMonth": null}]
  recurring_items JSONB DEFAULT '[]'::jsonb,
  
  -- Calculated results (cached for performance)
  calculated_runway NUMERIC,
  calculated_burn_rate NUMERIC,
  calculated_breakeven_month INTEGER,
  calculated_end_savings NUMERIC,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_name CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  CONSTRAINT valid_savings CHECK (total_savings >= 0),
  CONSTRAINT valid_expenses CHECK (monthly_expenses >= 0),
  CONSTRAINT valid_income CHECK (monthly_income >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON public.scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_user_base ON public.scenarios(user_id, is_base);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON public.scenarios(created_at DESC);

-- Ensure only one base scenario per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_scenarios_one_base_per_user 
  ON public.scenarios(user_id) 
  WHERE is_base = true;

-- Enable Row Level Security
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own scenarios" ON public.scenarios;
CREATE POLICY "Users can view own scenarios"
  ON public.scenarios
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scenarios" ON public.scenarios;
CREATE POLICY "Users can insert own scenarios"
  ON public.scenarios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own scenarios" ON public.scenarios;
CREATE POLICY "Users can update own scenarios"
  ON public.scenarios
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own non-base scenarios" ON public.scenarios;
CREATE POLICY "Users can delete own non-base scenarios"
  ON public.scenarios
  FOR DELETE
  USING (auth.uid() = user_id AND is_base = false);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_scenarios_updated_at ON public.scenarios;
CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.scenarios IS 'Financial scenarios for runway comparison feature. Free tier: 1 non-base scenario, Premium: 3 scenarios.';
COMMENT ON COLUMN public.scenarios.is_base IS 'Only one base scenario per user. Base scenarios cannot be deleted.';
COMMENT ON COLUMN public.scenarios.one_time_expenses IS 'Array of one-time expenses: [{"name": "string", "amount": number, "month": number}]';
COMMENT ON COLUMN public.scenarios.recurring_items IS 'Array of recurring income/expenses: [{"name": "string", "amount": number, "type": "income"|"expense", "startMonth": number, "endMonth": number|null}]';

-- ============================================
-- 2. FIRE_SETTINGS TABLE (FIRE Calculator Feature)
-- ============================================

-- Create fire_settings table
CREATE TABLE IF NOT EXISTS public.fire_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Investment assumptions
  investment_return_rate NUMERIC DEFAULT 7.0, -- % annual return rate
  safe_withdrawal_rate NUMERIC DEFAULT 4.0,   -- % SWR (4% rule)
  
  -- Optional overrides
  target_annual_expenses NUMERIC, -- null = use monthly_expenses * 12 from finance_settings
  
  -- Calculated fields (cached for performance)
  fi_number NUMERIC, -- Financial Independence Number
  fi_date DATE, -- Projected FI achievement date
  coast_fire_date DATE, -- Date when Coast FIRE is achieved
  lean_fi_number NUMERIC, -- 70% of regular FI Number
  fat_fi_number NUMERIC, -- 150% of regular FI Number
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fire_settings_user ON public.fire_settings(user_id);

-- Enable Row Level Security
ALTER TABLE public.fire_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own fire settings" ON public.fire_settings;
CREATE POLICY "Users can view own fire settings" ON public.fire_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own fire settings" ON public.fire_settings;
CREATE POLICY "Users can insert own fire settings" ON public.fire_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own fire settings" ON public.fire_settings;
CREATE POLICY "Users can update own fire settings" ON public.fire_settings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own fire settings" ON public.fire_settings;
CREATE POLICY "Users can delete own fire settings" ON public.fire_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Updated timestamp trigger
DROP TRIGGER IF EXISTS update_fire_settings_updated_at ON public.fire_settings;
CREATE TRIGGER update_fire_settings_updated_at 
  BEFORE UPDATE ON public.fire_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 3. PHASES TABLE (Phase-based Planning Feature)
-- ============================================

-- Create phases table
CREATE TABLE IF NOT EXISTS public.phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE,
  
  -- Phase metadata
  name TEXT NOT NULL,
  description TEXT,
  phase_order INTEGER NOT NULL DEFAULT 0,
  
  -- Time range (months, 0-indexed)
  start_month INTEGER NOT NULL DEFAULT 0,
  end_month INTEGER NOT NULL,
  
  -- Financial data
  monthly_expenses NUMERIC NOT NULL DEFAULT 0,
  monthly_income NUMERIC DEFAULT 0,
  
  -- One-time expenses (JSONB array)
  -- Structure: [{"name": "Flights", "amount": 2500, "month": 0}]
  -- month is relative to phase start (0 = first month of phase)
  one_time_expenses JSONB DEFAULT '[]'::jsonb,
  
  -- Calculated fields (cached for performance)
  total_burn NUMERIC,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_name CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  CONSTRAINT valid_duration CHECK (end_month > start_month),
  CONSTRAINT valid_expenses CHECK (monthly_expenses >= 0),
  CONSTRAINT valid_income CHECK (monthly_income >= 0),
  CONSTRAINT valid_start_month CHECK (start_month >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_phases_user_id ON public.phases(user_id);
CREATE INDEX IF NOT EXISTS idx_phases_scenario_id ON public.phases(scenario_id);
CREATE INDEX IF NOT EXISTS idx_phases_user_order ON public.phases(user_id, phase_order);
CREATE INDEX IF NOT EXISTS idx_phases_time_range ON public.phases(start_month, end_month);

-- Enable Row Level Security
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own phases" ON public.phases;
CREATE POLICY "Users can view own phases"
  ON public.phases
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own phases" ON public.phases;
CREATE POLICY "Users can insert own phases"
  ON public.phases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own phases" ON public.phases;
CREATE POLICY "Users can update own phases"
  ON public.phases
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own phases" ON public.phases;
CREATE POLICY "Users can delete own phases"
  ON public.phases
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_phases_updated_at ON public.phases;
CREATE TRIGGER update_phases_updated_at
  BEFORE UPDATE ON public.phases
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comments
-- Max 10 phases per user (enforced via trigger instead of CHECK constraint)
CREATE OR REPLACE FUNCTION public.enforce_max_phases()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.phases WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 phases per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_max_phases_trigger ON public.phases;
CREATE TRIGGER enforce_max_phases_trigger
  BEFORE INSERT ON public.phases
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_max_phases();

COMMENT ON TABLE public.phases IS 'Phase-based planning: divide time into phases with different financial patterns (max 10 phases per user)';
COMMENT ON COLUMN public.phases.phase_order IS 'Display order for drag-and-drop reordering';
COMMENT ON COLUMN public.phases.start_month IS '0-indexed month when phase starts';
COMMENT ON COLUMN public.phases.end_month IS '0-indexed month when phase ends (exclusive)';
COMMENT ON COLUMN public.phases.one_time_expenses IS 'Array of one-time expenses: [{"name": "string", "amount": number, "month": number}] where month is relative to phase start';
COMMENT ON COLUMN public.phases.total_burn IS 'Cached total burn for this phase (monthly_expenses * duration + sum of one-time expenses)';

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================
-- Next: Verify tables exist in Dashboard > Database > Tables
-- Expected new tables: scenarios, fire_settings, phases
-- ============================================
