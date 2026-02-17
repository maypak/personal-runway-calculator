-- Migration: Scenario Comparison Feature
-- Created: 2026-02-17
-- Author: Senior Frontend Developer
-- Purpose: Enable users to create and compare multiple financial scenarios

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
CREATE INDEX idx_scenarios_user_id ON public.scenarios(user_id);
CREATE INDEX idx_scenarios_user_base ON public.scenarios(user_id, is_base);
CREATE INDEX idx_scenarios_created_at ON public.scenarios(created_at DESC);

-- Ensure only one base scenario per user (enforced at app level + DB constraint)
CREATE UNIQUE INDEX idx_scenarios_one_base_per_user 
  ON public.scenarios(user_id) 
  WHERE is_base = true;

-- Enable Row Level Security
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own scenarios
CREATE POLICY "Users can view own scenarios"
  ON public.scenarios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own scenarios
CREATE POLICY "Users can insert own scenarios"
  ON public.scenarios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own scenarios
CREATE POLICY "Users can update own scenarios"
  ON public.scenarios
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own scenarios (except base)
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

CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comment
COMMENT ON TABLE public.scenarios IS 'Financial scenarios for runway comparison feature. Free tier: 1 non-base scenario, Premium: 3 scenarios.';
COMMENT ON COLUMN public.scenarios.is_base IS 'Only one base scenario per user. Base scenarios cannot be deleted.';
COMMENT ON COLUMN public.scenarios.one_time_expenses IS 'Array of one-time expenses: [{"name": "string", "amount": number, "month": number}]';
COMMENT ON COLUMN public.scenarios.recurring_items IS 'Array of recurring income/expenses: [{"name": "string", "amount": number, "type": "income"|"expense", "startMonth": number, "endMonth": number|null}]';
