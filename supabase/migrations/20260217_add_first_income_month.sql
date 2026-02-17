-- Migration: Add first_income_month column
-- Created: 2026-02-17
-- Author: Senior Frontend Developer
-- Purpose: Fix BUG-001 - Track when income starts (burn rate reduction)

-- Add new column for first income month
ALTER TABLE public.scenarios 
ADD COLUMN IF NOT EXISTS calculated_first_income_month INTEGER;

-- Add helpful comment
COMMENT ON COLUMN public.scenarios.calculated_first_income_month IS 'First month where income > 0 (burn rate reduction starts). NULL if no income ever.';
