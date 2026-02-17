# 🚨 FIRE Settings Migration - URGENT

**Status:** Migration file exists, needs manual application to production
**Created:** 2026-02-17
**Priority:** CRITICAL (blocking production users)

---

## 🎯 Problem

Production users are seeing "Failed to load settings" on `/fire` page because `fire_settings` table doesn't exist in production Supabase.

---

## ✅ Solution Applied

### 1. Code Fallback (DONE ✅)
- Updated `app/hooks/useFIRESettings.ts` to gracefully handle missing table
- Shows default values instead of crashing
- Users can interact with FIRE calculator even without persisted settings
- Commit: "hotfix: Add fire_settings migration and fallback"

### 2. Database Migration (PENDING - Manual Steps Required)

**Migration file:** `supabase/migrations/20260217000003_fire_settings.sql`

---

## 📋 Manual Migration Steps

### Option A: Supabase Dashboard (Recommended - Fastest)

1. **Login to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select project: `jafbkmwaqxyszzccwsls`

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Execute SQL**
   - Copy the entire SQL script below
   - Paste into the editor
   - Click "Run" button

4. **Verify Success**
   - Check for green "Success" message
   - No errors should appear

5. **Test**
   - Visit: https://personal-runway-calculator.vercel.app/fire
   - Page should load without errors
   - Settings should save/load correctly

---

## 📜 SQL Script to Execute

```sql
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
-- ============================================
```

---

## 🔍 Verification Checklist

After running the SQL:

- [ ] No errors in SQL Editor
- [ ] Table appears in "Table Editor" sidebar
- [ ] Visit `/fire` page - no "Failed to load settings" error
- [ ] Try changing investment return rate - saves successfully
- [ ] Refresh page - settings persist
- [ ] Check browser console - no errors

---

## 🛡️ RLS Policies Verified

The migration includes these security policies:

✅ **SELECT** - Users can view only their own settings  
✅ **INSERT** - Users can create only their own settings  
✅ **UPDATE** - Users can update only their own settings  
✅ **DELETE** - Users can delete only their own settings  

All policies filter by `auth.uid() = user_id` - other users are blocked.

---

## 🔄 Alternative: CLI Method (If Login Available)

If you have Supabase CLI access:

```bash
cd personal-runway-calculator
supabase login
supabase link --project-ref jafbkmwaqxyszzccwsls
supabase db push
```

---

## 📊 Current Status

| Item | Status |
|------|--------|
| Migration file | ✅ Exists |
| Code fallback | ✅ Implemented |
| Production DB | ⏳ Pending manual apply |
| RLS policies | ✅ Included in migration |
| Testing | ⏳ After DB migration |

---

## 🚀 Next Steps

1. Execute SQL in Supabase Dashboard (5 minutes)
2. Test `/fire` page in production
3. Delete this file once migration is confirmed
4. Monitor for any user issues

---

**Estimated Time:** 5-10 minutes  
**Risk:** Low (uses CREATE IF NOT EXISTS, won't break existing data)  
**Rollback:** N/A (table is new, safe to drop if needed)
