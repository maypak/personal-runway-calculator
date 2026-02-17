-- ============================================
-- FIRE Settings Table
-- Created: 2026-02-17
-- Purpose: Store FIRE (Financial Independence, Retire Early) calculation settings
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.fire_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- SELECT policy
DROP POLICY IF EXISTS "Users can view own fire settings" ON public.fire_settings;
CREATE POLICY "Users can view own fire settings" ON public.fire_settings
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT policy
DROP POLICY IF EXISTS "Users can insert own fire settings" ON public.fire_settings;
CREATE POLICY "Users can insert own fire settings" ON public.fire_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
DROP POLICY IF EXISTS "Users can update own fire settings" ON public.fire_settings;
CREATE POLICY "Users can update own fire settings" ON public.fire_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE policy
DROP POLICY IF EXISTS "Users can delete own fire settings" ON public.fire_settings;
CREATE POLICY "Users can delete own fire settings" ON public.fire_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_fire_settings_updated_at ON public.fire_settings;
CREATE TRIGGER update_fire_settings_updated_at 
  BEFORE UPDATE ON public.fire_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Migration Complete
-- Next: Create fireCalculator.ts utilities
-- ============================================
