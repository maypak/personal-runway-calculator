-- User Goals (Goal Setting Feature - Priority 1)
-- Created: 2026-02-16
-- Purpose: Allow users to set financial goals (runway or savings amount)
-- Free tier: 1 active goal, Premium: 3 active goals

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Goal configuration
  goal_type TEXT NOT NULL CHECK (goal_type IN ('runway', 'savings')),
  target_value NUMERIC NOT NULL, -- 6 (months) or 30000 ($)
  description TEXT, -- Optional: "Safe quit my job"
  
  -- Status tracking
  is_active BOOLEAN DEFAULT true, -- Only 1 active per user (Free tier)
  achieved_at TIMESTAMPTZ, -- NULL until achieved
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance (frequent queries by user)
CREATE INDEX IF NOT EXISTS idx_user_goals_user_active 
  ON public.user_goals(user_id, is_active DESC);

-- Row Level Security (RLS)
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own goals
CREATE POLICY "Users can view own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_goals_updated_at 
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Note: Free tier limit (1 active goal) enforced in application logic
-- Premium tier (3 active goals) will be implemented later
