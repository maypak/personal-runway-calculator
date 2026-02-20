-- Migration: Phase-based Planning Feature
-- Created: 2026-02-17
-- Author: Senior Frontend Developer
-- Purpose: Enable users to divide time into phases with different financial patterns

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
CREATE INDEX idx_phases_user_id ON public.phases(user_id);
CREATE INDEX idx_phases_scenario_id ON public.phases(scenario_id);
CREATE INDEX idx_phases_user_order ON public.phases(user_id, phase_order);
CREATE INDEX idx_phases_time_range ON public.phases(start_month, end_month);

-- Enable Row Level Security
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own phases
CREATE POLICY "Users can view own phases"
  ON public.phases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own phases (max 10 enforced by constraint)
CREATE POLICY "Users can insert own phases"
  ON public.phases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own phases
CREATE POLICY "Users can update own phases"
  ON public.phases
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own phases
CREATE POLICY "Users can delete own phases"
  ON public.phases
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_phases_updated_at
  BEFORE UPDATE ON public.phases
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.phases IS 'Phase-based planning: divide time into phases with different financial patterns (max 10 phases per user)';
COMMENT ON COLUMN public.phases.phase_order IS 'Display order for drag-and-drop reordering';
COMMENT ON COLUMN public.phases.start_month IS '0-indexed month when phase starts';
COMMENT ON COLUMN public.phases.end_month IS '0-indexed month when phase ends (exclusive)';
COMMENT ON COLUMN public.phases.one_time_expenses IS 'Array of one-time expenses: [{"name": "string", "amount": number, "month": number}] where month is relative to phase start';
COMMENT ON COLUMN public.phases.total_burn IS 'Cached total burn for this phase (monthly_expenses * duration + sum of one-time expenses)';
