# QA Test Scenarios - Personal Runway Calculator

**Created:** 2026-02-15  
**Purpose:** Comprehensive E2E test coverage for daily automated testing  
**Estimated Duration:** 30 minutes (full suite)

---

## 🧪 Test Environment

- **Production URL:** https://personal-runway-calculator.vercel.app
- **Test Account:** qa-test@example.com / TestPass123!
- **Browsers:** Chrome (latest), Safari (latest), Firefox (latest)
- **Mobile:** iOS Safari, Android Chrome (when available)
- **Prerequisites:** Clean browser state (incognito/private mode)

---

## Scenario 1: User Registration & Authentication

### 1.1 Email Signup - New Account Creation

**Priority:** P0 (Critical)

**Steps:**
1. Navigate to production URL
2. Click "Sign Up" or equivalent button
3. Enter email: `qa-test-[timestamp]@example.com`
4. Enter password: `TestPass123!`
5. Confirm password: `TestPass123!`
6. Click "Create Account" / "Sign Up"
7. Check for confirmation email (or verify redirect behavior)
8. Confirm account if email verification required
9. Verify redirect to dashboard/onboarding

**Expected Results:**
- ✅ Account created successfully
- ✅ No console errors
- ✅ User redirected to dashboard or onboarding flow
- ✅ Session token stored (check localStorage/cookies)
- ✅ If email verification required: email received within 2 minutes
- ✅ Confirmation link works and activates account

**Failure Scenarios to Test:**
- Invalid email format → Error message shown
- Weak password → Error message shown
- Password mismatch → Error message shown
- Duplicate email → "Account already exists" message
- Network offline → Graceful error handling

---

### 1.2 OAuth Login - GitHub

**Priority:** P1 (High)

**Steps:**
1. Navigate to production URL
2. Click "Continue with GitHub"
3. Authorize application (if first time)
4. Wait for redirect
5. Verify dashboard loads

**Expected Results:**
- ✅ GitHub OAuth popup opens
- ✅ Authorization completes in <5 seconds
- ✅ User redirected to dashboard
- ✅ User profile populated with GitHub data (name, email)
- ✅ Session persists after browser refresh

**Notes:**
- Test with existing GitHub account
- Test first-time authorization vs. returning user
- Measure redirect latency (should be <3 seconds)

---

### 1.3 OAuth Login - Google

**Priority:** P1 (High)

**Steps:**
1. Navigate to production URL
2. Click "Continue with Google"
3. Select Google account
4. Wait for redirect
5. Verify dashboard loads

**Expected Results:**
- ✅ Google OAuth popup opens
- ✅ Account selection works
- ✅ Redirect to dashboard successful
- ✅ User data populated correctly
- ✅ Session persists

---

### 1.4 Email Login - Existing Account

**Priority:** P0 (Critical)

**Steps:**
1. Navigate to production URL
2. Enter email: `qa-test@example.com`
3. Enter password: `TestPass123!`
4. Click "Log In"
5. Verify dashboard loads

**Expected Results:**
- ✅ Login successful in <2 seconds
- ✅ Dashboard loads with user's existing data
- ✅ No console errors
- ✅ Session token stored

**Failure Scenarios:**
- Wrong password → "Invalid credentials" error
- Non-existent email → "Account not found" error
- Empty fields → Validation errors shown

---

### 1.5 Logout & Re-login

**Priority:** P0 (Critical)

**Steps:**
1. Login with test account
2. Navigate to dashboard
3. Click "Logout" button
4. Verify redirect to login page
5. Attempt to access dashboard URL directly
6. Verify redirect to login (not unauthorized access)
7. Log back in with same credentials
8. Verify data persists

**Expected Results:**
- ✅ Logout clears session
- ✅ Protected routes redirect to login
- ✅ Re-login successful
- ✅ User data intact after re-login

---

## Scenario 2: Financial Settings - Initial Setup

### 2.1 First-Time User - Complete Onboarding

**Priority:** P0 (Critical)

**Steps:**
1. Login with freshly created account
2. Navigate to Financial Settings (or onboarding flow)
3. Fill in all fields:
   - Monthly Fixed Expenses: `3000`
   - Monthly Variable Expenses: `1500`
   - Current Savings: `50000`
   - One-Time Lump Sum: `0`
   - Start Date: `2026-02-01`
   - Monthly Income: `5000` (optional)
   - Income Months: `12` (optional)
4. Click "Save" / "Continue"
5. Verify redirect to dashboard

**Expected Results:**
- ✅ All fields accept input correctly
- ✅ Save completes in <2 seconds
- ✅ Success message shown
- ✅ Dashboard displays calculated runway
- ✅ Data persists after page refresh

---

### 2.2 Monthly Fixed Expenses

**Priority:** P0 (Critical)

**Test Cases:**
- Valid input: `3000` → Accepted ✅
- Zero: `0` → Accepted ✅
- Large number: `999999` → Accepted ✅
- Negative: `-100` → Rejected with error ❌
- Decimal: `1500.50` → Accepted ✅
- Non-numeric: `abc` → Rejected with error ❌
- Empty: `` → Validation error ❌

**Expected Behavior:**
- Only positive numbers (including 0) accepted
- Decimals allowed up to 2 places
- Commas optional (e.g., `1,000` → `1000`)
- Field updates calculations immediately (if live preview enabled)

---

### 2.3 Monthly Variable Expenses

**Priority:** P0 (Critical)

**Test Cases:** Same as 2.2

---

### 2.4 Current Savings

**Priority:** P0 (Critical)

**Test Cases:**
- Valid: `50000` → Accepted ✅
- Zero: `0` → Accepted (but should show warning) ⚠️
- Large: `10000000` → Accepted ✅
- Negative: `-1000` → Rejected ❌
- Decimal: `12345.67` → Accepted ✅

**Expected Behavior:**
- Zero savings triggers warning: "No runway without savings"
- Negative values rejected
- Large numbers formatted with commas (e.g., `1,000,000`)

---

### 2.5 One-Time Lump Sum

**Priority:** P1 (High)

**Test Cases:**
- Zero (most common): `0` → Accepted ✅
- Positive: `10000` → Accepted ✅
- Negative: `-500` → Rejected ❌
- Future lump sum with date → Advanced feature (if supported)

**Expected Behavior:**
- Adds to current savings in calculations
- Clearly labeled (e.g., "Expected bonus, tax refund")

---

### 2.6 Start Date

**Priority:** P0 (Critical)

**Test Cases:**
- Today's date → Accepted ✅
- Past date: `2026-01-01` → Accepted ✅
- Future date: `2026-12-31` → Accepted ✅
- Invalid format: `31-02-2026` → Rejected ❌
- Year 2025 → Accepted (retroactive) ✅

**Expected Behavior:**
- Date picker or manual input
- Format: `YYYY-MM-DD` or localized
- Affects runway calculation start point

---

### 2.7 Monthly Income (Optional)

**Priority:** P1 (High)

**Test Cases:**
- Empty (no income) → Runway decreases over time ✅
- Positive: `5000` → Extends runway ✅
- Zero: `0` → Same as empty ✅
- Greater than expenses → Runway increases indefinitely ✅
- Less than expenses → Runway extends but still decreases ✅

**Expected Behavior:**
- If empty: runway = savings / monthly burn
- If provided: runway calculation adjusts monthly
- Clear explanation in UI (tooltip or help text)

---

### 2.8 Income Months (Optional)

**Priority:** P1 (High)

**Test Cases:**
- Empty (income forever) → Runway calculation assumes perpetual ✅
- `12` months → Income stops after 1 year, then full burn ✅
- `1` month → Income for 1 month only ✅
- `0` months → Same as no income ✅

**Expected Behavior:**
- Only relevant if Monthly Income > 0
- Grayed out if Monthly Income empty
- Affects long-term runway calculation

---

### 2.9 Save Settings

**Priority:** P0 (Critical)

**Steps:**
1. Enter all financial data
2. Click "Save"
3. Observe loading state
4. Verify success message
5. Refresh page
6. Verify all data persists

**Expected Results:**
- ✅ Save button shows loading spinner
- ✅ Success message: "Settings saved successfully"
- ✅ All fields retain values after refresh
- ✅ Dashboard calculations update immediately

**Failure Scenarios:**
- Network offline → "Failed to save" error + retry option
- Database error → Graceful error message + support contact
- Validation error → Highlight invalid fields

---

## Scenario 3: Financial Settings - Data Persistence

### 🔴 REGRESSION TEST: P0 Bug Fixed (2026-02-15)

**Bug History:** This scenario previously failed due to UPSERT + RLS policy conflict.

**Original Issue:**
- Settings saved successfully (optimistic UI update)
- Page refresh → Data loss (only current savings persisted)
- Supabase 409 Conflict errors in console

**Root Cause:** Supabase UPSERT conflicting with separate INSERT/UPDATE RLS policies

**Fix:** Replace UPSERT with conditional INSERT/UPDATE (check existing record first)

**Critical Test Points:**
1. ✅ Save settings → **No 409/406/400 errors in console**
2. ✅ Refresh page → **All values persist** (not just current savings)
3. ✅ Verify Supabase finance_settings table → **Record exists with all fields**

**Regression Prevention:**
- This test must PASS on every deployment
- If 409 errors appear again → Escalate as P0 immediately
- See: `qa-reports/2026-02-15-10-30-P0-FIX.md` for full analysis

---

### 3.1 Reload Page - Data Integrity

**Priority:** P0 (Critical - REGRESSION TEST INCLUDED)

**Steps:**
1. Login and enter financial settings
2. Enter test values:
   - Current Savings: `50000`
   - Lump Sum: `10000`
   - Monthly Income: `3000`
   - Income Months: `6`
   - Monthly Fixed: `2000`
   - Monthly Variable: `1500`
3. Click "Save" or "Done"
4. Verify dashboard shows:
   - Available: `$78,000` (50k + 10k + 3k×6)
   - Monthly: `$3,500` (2k + 1.5k)
   - Runway: `~1yr 10mo`
5. **Hard refresh page** (Ctrl+Shift+R / Cmd+Shift+R)
6. **CRITICAL: Verify ALL values persist:**
   - Current Savings: `50000` ✅
   - Lump Sum: `10000` ✅
   - Monthly Income: `3000` ✅
   - Income Months: `6` ✅
   - Monthly Fixed: `2000` ✅
   - Monthly Variable: `1500` ✅
7. Close browser completely
8. Re-open and login
9. Verify data still persists

**Expected Results:**
- ✅ All fields populated with saved values (not just savings!)
- ✅ No data loss
- ✅ Dashboard calculations match saved data
- ✅ **Console has ZERO errors** (no 409/406/400)

**Regression Check (If this fails, P0 bug has returned):**
- ❌ If only "Current Savings" persists → P0 regression
- ❌ If 409 Conflict errors in console → P0 regression
- ❌ If dashboard shows wrong values → P0 regression

**Debug Steps (If failure):**
1. Open browser DevTools → Console tab
2. Look for Supabase API errors (409, 406, 400)
3. Check Network tab → filter "finance_settings"
4. Screenshot errors and escalate immediately
5. Reference: `qa-reports/2026-02-15-10-30-P0-FIX.md`

---

### 3.2 Edit Existing Data

**Priority:** P0 (Critical)

**Steps:**
1. Login with account that has saved data
2. Navigate to Financial Settings
3. Change "Current Savings" from `50000` → `60000`
4. Click "Save"
5. Refresh page
6. Verify new value `60000` persists
7. Check dashboard calculations updated

**Expected Results:**
- ✅ Edit successful
- ✅ New value persists
- ✅ Dashboard recalculates correctly
- ✅ Old value not recoverable (no undo button expected)

---

### 3.3 Edge Cases - Zero Values

**Priority:** P1 (High)

**Test Case 1: Zero Savings**
- Savings: `0`
- Fixed Expenses: `3000`
- Variable Expenses: `1500`
- Expected: Runway = 0 days, warning shown

**Test Case 2: Zero Expenses**
- Savings: `50000`
- Fixed: `0`
- Variable: `0`
- Expected: Runway = "Infinite" or very large number

**Test Case 3: Zero Income Months**
- Income: `5000`
- Income Months: `0`
- Expected: Treated as no income

---

### 3.4 Edge Cases - Large Numbers

**Priority:** P2 (Medium)

**Test Case 1: Millionaire**
- Savings: `1000000`
- Fixed: `5000`
- Variable: `2000`
- Expected: Runway ≈ 142 months (11+ years)

**Test Case 2: High Earner**
- Savings: `100000`
- Fixed: `10000`
- Variable: `5000`
- Income: `20000`
- Expected: Runway increases monthly (net positive)

---

### 3.5 Edge Cases - Negative Numbers

**Priority:** P1 (High)

**All negative values should be rejected:**
- Savings: `-1000` → Error: "Must be positive"
- Fixed Expenses: `-500` → Error: "Must be positive"
- Income: `-2000` → Error: "Must be positive"

**Expected Behavior:**
- Form validation before submission
- Red outline on invalid field
- Error message below field
- Save button disabled until valid

---

## Scenario 4: Expenses Management

### 4.1 Add Single Expense - Different Categories

**Priority:** P0 (Critical)

**Steps:**
1. Navigate to Expenses page
2. Click "Add Expense"
3. Fill in:
   - Name: `Grocery Shopping`
   - Amount: `150.50`
   - Category: `Food`
   - Date: `2026-02-15`
4. Click "Save"
5. Verify expense appears in list
6. Check dashboard: available balance decreased by `150.50`

**Expected Results:**
- ✅ Expense added successfully
- ✅ Appears in list with correct details
- ✅ Balance updated immediately
- ✅ Sorted by date (most recent first)

**Categories to Test:**
- Food
- Transportation
- Entertainment
- Healthcare
- Shopping
- Bills
- Other

---

### 4.2 Add Multiple Expenses

**Priority:** P0 (Critical)

**Steps:**
1. Add expense #1: `Coffee - $5 - Food`
2. Add expense #2: `Uber - $20 - Transportation`
3. Add expense #3: `Netflix - $15.99 - Entertainment`
4. Verify all three appear in list
5. Check total deducted from balance = `$40.99`

**Expected Results:**
- ✅ All expenses saved
- ✅ List shows all items
- ✅ Balance calculation correct
- ✅ No duplicates

---

### 4.3 Delete Expense

**Priority:** P0 (Critical)

**Steps:**
1. Add expense: `Test Expense - $100`
2. Verify balance decreased by `$100`
3. Click "Delete" on the expense
4. Confirm deletion (if confirmation dialog shown)
5. Verify expense removed from list
6. Check balance increased by `$100` (expense reversed)

**Expected Results:**
- ✅ Expense deleted
- ✅ Balance restored
- ✅ Calculations updated
- ✅ No orphaned data

---

### 4.4 Verify Calculations Update Correctly

**Priority:** P0 (Critical)

**Test Scenario:**
- Starting balance: `$50,000`
- Add expense: `$500`
- Expected balance: `$49,500`
- Add expense: `$1,200`
- Expected balance: `$48,300`
- Delete first expense: `$500`
- Expected balance: `$48,800`

**Steps:**
1. Note starting balance
2. Perform expense operations
3. Verify balance after each operation
4. Refresh page
5. Verify calculations persist correctly

**Expected Results:**
- ✅ Real-time updates (no page refresh needed)
- ✅ Accurate arithmetic
- ✅ Persistence across page reloads

---

## Scenario 5: Recurring Expenses

### 5.1 Add Recurring Expense

**Priority:** P1 (High)

**Steps:**
1. Navigate to Recurring Expenses
2. Click "Add Recurring Expense"
3. Fill in:
   - Name: `Rent`
   - Amount: `2000`
   - Frequency: `Monthly`
   - Category: `Bills`
   - Start Date: `2026-02-01`
   - End Date: (empty = ongoing)
4. Click "Save"
5. Verify appears in recurring list
6. Check if future months show projected expenses

**Expected Results:**
- ✅ Recurring expense saved
- ✅ Appears in dedicated recurring section
- ✅ Calculations include recurring expenses in runway
- ✅ Future projections visible (if feature exists)

**Frequency Options to Test:**
- Daily
- Weekly
- Bi-weekly
- Monthly
- Quarterly
- Yearly

---

### 5.2 Edit Recurring Expense

**Priority:** P1 (High)

**Steps:**
1. Add recurring: `Netflix - $15.99 - Monthly`
2. Click "Edit"
3. Change amount to `$17.99` (price increase)
4. Save
5. Verify updated in list
6. Check calculations adjust accordingly

**Expected Results:**
- ✅ Edit successful
- ✅ New amount shown
- ✅ Future projections update
- ✅ Historical expenses unchanged (only future affected)

---

### 5.3 Enable/Disable Recurring Expense

**Priority:** P2 (Medium)

**Steps:**
1. Add recurring expense: `Gym - $50 - Monthly`
2. Toggle "Disable" or "Pause"
3. Verify it no longer appears in calculations
4. Toggle "Enable" or "Resume"
5. Verify it reappears in calculations

**Expected Results:**
- ✅ Disabled expenses grayed out or hidden
- ✅ Not included in runway calculation when disabled
- ✅ Re-enabled expenses resume projection
- ✅ No data loss during disable/enable

---

### 5.4 Delete Recurring Expense

**Priority:** P1 (High)

**Steps:**
1. Add recurring: `Subscription - $10 - Monthly`
2. Let it generate 1-2 expense entries (if auto-generated)
3. Delete the recurring expense
4. Verify removed from recurring list
5. Check: Do past auto-generated expenses remain? (Expected: Yes)
6. Check: No future auto-generation (Expected: Correct)

**Expected Results:**
- ✅ Recurring removed from list
- ✅ Historical expenses (if any) remain untouched
- ✅ Future projections stop
- ✅ Runway recalculates without future occurrences

---

### 5.5 Verify Recurring Shows in Calculations

**Priority:** P0 (Critical)

**Test Scenario:**
- Savings: `$50,000`
- Fixed expenses: `$0`
- Recurring: `Rent - $2000/month`
- Recurring: `Internet - $100/month`
- Expected monthly burn: `$2,100`
- Expected runway: ~23 months

**Steps:**
1. Set up above scenario
2. Check dashboard "Monthly Burn Rate"
3. Verify it shows `$2,100`
4. Check runway calculation
5. Verify ~23 months

**Expected Results:**
- ✅ Recurring expenses included in burn rate
- ✅ Runway accounts for recurring costs
- ✅ Daily burn rate = monthly burn / 30

---

## Scenario 6: Dashboard Calculations

### 6.1 Runway Calculation Accuracy

**Priority:** P0 (Critical)

**Test Cases:**

**Case 1: Simple (No Income)**
- Savings: `$30,000`
- Monthly burn: `$2,000`
- Expected runway: `15 months`

**Case 2: With Income (Net Positive)**
- Savings: `$20,000`
- Monthly burn: `$3,000`
- Monthly income: `$5,000`
- Net gain: `+$2,000/month`
- Expected: Runway increases indefinitely

**Case 3: With Income (Net Negative)**
- Savings: `$50,000`
- Monthly burn: `$4,000`
- Monthly income: `$2,000`
- Net loss: `-$2,000/month`
- Expected runway: `25 months`

**Case 4: Limited Income Months**
- Savings: `$30,000`
- Monthly burn: `$3,000`
- Monthly income: `$3,000` for `6 months`
- Expected: 6 months break-even, then 10 months burn → Total 16 months

**Verification Steps:**
1. Set up each scenario
2. Note displayed runway
3. Manually calculate expected runway
4. Compare values (allow ±1 day tolerance for rounding)
5. Refresh page
6. Verify calculation persists

**Expected Results:**
- ✅ Calculations accurate within ±1 day
- ✅ Updates immediately on data change
- ✅ Clearly displays "months" or "days" unit
- ✅ Shows "Infinite" or "Indefinite" for net-positive scenarios

---

### 6.2 Available Balance

**Priority:** P0 (Critical)

**Formula:** 
```
Available Balance = Current Savings + One-Time Lump Sum - Total Expenses
```

**Test Scenario:**
- Current savings: `$50,000`
- Lump sum: `$5,000`
- Expenses: `$1,200`
- Expected balance: `$53,800`

**Steps:**
1. Set up scenario
2. Check dashboard "Available Balance"
3. Verify matches expected value
4. Add expense: `$500`
5. Verify balance updates to `$53,300`
6. Refresh page
7. Verify balance persists

**Expected Results:**
- ✅ Calculation accurate
- ✅ Real-time updates
- ✅ Formatted with commas and currency symbol
- ✅ Changes immediately when expenses added/removed

---

### 6.3 Monthly Burn Rate

**Priority:** P0 (Critical)

**Formula:**
```
Monthly Burn = Monthly Fixed + Monthly Variable + (Recurring Expenses Sum)
```

**Test Scenario:**
- Fixed: `$2,000`
- Variable: `$800`
- Recurring: `$500 + $200`
- Expected burn: `$3,500/month`

**Steps:**
1. Set up scenario
2. Check dashboard "Monthly Burn Rate"
3. Verify shows `$3,500`
4. Add recurring expense: `$100/month`
5. Verify updates to `$3,600`

**Expected Results:**
- ✅ Accurate calculation
- ✅ Includes all recurring expenses
- ✅ Updates when settings change
- ✅ Displayed prominently on dashboard

---

### 6.4 Daily Burn Rate

**Priority:** P1 (High)

**Formula:**
```
Daily Burn = Monthly Burn / 30 (or actual days in month)
```

**Test Scenario:**
- Monthly burn: `$3,000`
- Expected daily: `$100/day` (assuming 30-day month)

**Steps:**
1. Set monthly burn to `$3,000`
2. Check "Daily Burn Rate"
3. Verify shows `$100/day`

**Expected Results:**
- ✅ Correct division
- ✅ Rounded to 2 decimal places
- ✅ Labeled clearly as "per day"

---

### 6.5 Test with Different Scenarios

**Priority:** P0 (Critical)

**Scenario Matrix:**

| Savings  | Fixed | Variable | Income | Income Months | Expected Result          |
|----------|-------|----------|--------|---------------|--------------------------|
| $50,000  | $2k   | $1k      | $0     | -             | Runway ≈ 16 months       |
| $50,000  | $2k   | $1k      | $4k    | ∞             | Runway ≈ 50 months       |
| $50,000  | $2k   | $1k      | $5k    | ∞             | Runway = Infinite        |
| $10,000  | $1k   | $500     | $2k    | 6             | Complex (break-even 6m)  |
| $0       | $2k   | $1k      | $0     | -             | Runway = 0 (warning!)    |

**Steps:**
1. Test each scenario systematically
2. Compare displayed runway with manual calculation
3. Verify edge cases (infinite runway, zero runway)
4. Check UI handles extremes gracefully

**Expected Results:**
- ✅ All scenarios calculate correctly
- ✅ Edge cases handled (infinity, zero)
- ✅ No division by zero errors
- ✅ Clear messaging for each scenario type

---

## Scenario 7: Multi-Device & Session

### 7.1 Login on Different Browsers - Data Sync

**Priority:** P1 (High)

**Steps:**
1. Login on Chrome with test account
2. Enter financial settings: Savings `$50,000`
3. Save
4. Open Firefox (same machine or different)
5. Login with same account
6. Verify savings show `$50,000`
7. Change savings to `$55,000` in Firefox
8. Save
9. Go back to Chrome
10. Refresh page
11. Verify savings updated to `$55,000`

**Expected Results:**
- ✅ Data syncs across browsers
- ✅ Changes in one browser reflect in another after refresh
- ✅ No data conflicts
- ✅ Session independent (can be logged in on both simultaneously)

---

### 7.2 Concurrent Edits

**Priority:** P2 (Medium)

**Steps:**
1. Login on Chrome: Edit savings to `$60,000` but DON'T save yet
2. Login on Firefox: Edit savings to `$65,000` and SAVE
3. Go back to Chrome: Click SAVE
4. Observe behavior

**Expected Results:**
- **Ideal:** Last-write-wins (Chrome overwrites to `$60,000`)
- **Acceptable:** Conflict detection: "Data changed, please refresh"
- **Not Acceptable:** Data corruption or silent failure

**Notes:**
- Test if app has optimistic locking
- Check for "stale data" warnings

---

### 7.3 Session Persistence

**Priority:** P0 (Critical)

**Steps:**
1. Login with test account
2. Close browser tab (not logout)
3. Re-open browser after 5 minutes
4. Navigate to production URL
5. Verify: Still logged in? Or redirected to login?
6. Check: If logged in, verify data loads correctly
7. Wait 24 hours
8. Repeat steps 3-6

**Expected Results:**
- ✅ Session persists for at least 24 hours (typical behavior)
- ✅ After session expiry, redirect to login (not error page)
- ✅ Re-login restores full access
- ✅ Sensitive pages require re-authentication on long idle

**Security Check:**
- Session should expire after reasonable time (7-30 days)
- Logout should invalidate session immediately

---

## Scenario 8: Error Handling

### 8.1 Save with Network Offline

**Priority:** P1 (High)

**Steps:**
1. Login and navigate to Financial Settings
2. Open browser DevTools
3. Go to Network tab → Enable "Offline" mode
4. Edit savings to `$70,000`
5. Click "Save"
6. Observe error message
7. Re-enable network
8. Click "Retry" or "Save" again
9. Verify save succeeds

**Expected Results:**
- ✅ Graceful error: "Unable to save. Check your connection."
- ✅ Data NOT lost (form still populated)
- ✅ "Retry" button appears
- ✅ After network restored, save succeeds
- ✅ No page crash or blank screen

---

### 8.2 Invalid Inputs

**Priority:** P0 (Critical)

**Test Cases:**

**Case 1: Letters in Numeric Fields**
- Input: `abc` in "Current Savings"
- Expected: Validation error, "Must be a number"

**Case 2: Special Characters**
- Input: `$%^&*` in "Monthly Expenses"
- Expected: Rejected or sanitized to empty

**Case 3: Extremely Large Numbers**
- Input: `99999999999999999` (beyond JS safe integer)
- Expected: Error or capped at max value

**Case 4: Empty Required Fields**
- Leave "Current Savings" empty
- Click "Save"
- Expected: "This field is required" error

**Expected Behavior:**
- ✅ Client-side validation before submit
- ✅ Clear error messages
- ✅ Fields highlighted in red
- ✅ Submit button disabled until valid

---

### 8.3 Database Errors

**Priority:** P1 (High)

**Scenario:** Simulate database connection failure (if testable)

**Steps:**
1. (If possible) Disconnect Supabase or introduce DB error
2. Attempt to save financial settings
3. Observe error handling

**Expected Results:**
- ✅ User-friendly error: "Something went wrong. Please try again."
- ✅ Technical details hidden (not exposed to user)
- ✅ Error logged for debugging (if error tracking enabled)
- ✅ Retry option available
- ✅ No data corruption

**If Cannot Simulate:**
- Check error handling code in codebase
- Verify error boundaries exist (React)

---

### 8.4 Authentication Failures

**Priority:** P0 (Critical)

**Test Cases:**

**Case 1: Invalid Login**
- Email: `wrong@example.com`
- Password: `WrongPass123`
- Expected: "Invalid email or password"

**Case 2: Expired Session**
- Login → Wait for session to expire (or manually invalidate)
- Try to access dashboard
- Expected: Redirect to login

**Case 3: OAuth Failure**
- Click "Continue with GitHub"
- Deny authorization
- Expected: Return to login page with message "Authorization cancelled"

**Case 4: Rate Limiting**
- Attempt login 10 times with wrong password
- Expected: "Too many attempts. Try again in X minutes."

**Expected Behavior:**
- ✅ Clear error messages
- ✅ No security info leaked ("User not found" vs "Wrong password")
- ✅ Graceful fallback to login page
- ✅ Rate limiting prevents brute force

---

## 🎯 Test Execution Checklist

### Pre-Test Setup
- [ ] Production URL accessible
- [ ] Test account credentials ready
- [ ] Browser(s) updated to latest version
- [ ] Incognito/Private mode enabled (clean state)
- [ ] DevTools console open (monitor for errors)

### During Testing
- [ ] Follow scenarios in order (authentication → settings → expenses)
- [ ] Take screenshots of failures
- [ ] Copy exact error messages
- [ ] Note unexpected behavior
- [ ] Check console for errors after each action

### Post-Test
- [ ] Summarize: Pass/Fail/Partial
- [ ] List issues by priority (P0 → P1 → P2)
- [ ] Save report to `/qa-reports/YYYY-MM-DD-HH-MM.md`
- [ ] Alert via Telegram if P0 issues found
- [ ] Update test scenarios if new edge cases discovered

---

## 🚨 Issue Reporting Template

```markdown
## [P0/P1/P2] Issue Title

**Scenario:** [Scenario number, e.g., 2.3 Current Savings]

**Steps to Reproduce:**
1. Navigate to Financial Settings
2. Enter `-1000` in Current Savings
3. Click Save
4. Observe: Value accepted (should be rejected)

**Expected:**
Validation error: "Must be a positive number"

**Actual:**
Negative value saved. Dashboard shows negative balance.

**Evidence:**
- Screenshot: `/qa-reports/screenshots/2026-02-15-negative-savings.png`
- Console error: None (silent failure)
- Browser: Chrome 120.0.6099.109

**Impact:**
- Data integrity compromised
- Runway calculation incorrect
- User confusion

**Suggested Fix:**
Add client-side validation: `value >= 0` before submit
Add server-side validation as backup
```

---

## ✅ Success Criteria

**Full Test Suite PASSES if:**
- All P0 scenarios: 100% pass
- All P1 scenarios: ≥95% pass
- All P2 scenarios: ≥90% pass
- No console errors on critical flows
- Page load time <3 seconds
- Mobile responsive (if tested)

**Full Test Suite FAILS if:**
- Any P0 failure
- ≥3 P1 failures
- Production URL unreachable
- Data loss on any scenario
- Security vulnerability found

---

## 📊 Test Coverage Summary

| Category                  | Scenarios | Priority | Estimated Time |
|---------------------------|-----------|----------|----------------|
| Authentication            | 5         | P0       | 8 minutes      |
| Financial Settings        | 9         | P0       | 10 minutes     |
| Data Persistence          | 5         | P0       | 5 minutes      |
| Expenses Management       | 4         | P0       | 5 minutes      |
| Recurring Expenses        | 5         | P1       | 6 minutes      |
| Dashboard Calculations    | 5         | P0       | 8 minutes      |
| Multi-Device & Session    | 3         | P1       | 6 minutes      |
| Error Handling            | 4         | P1       | 5 minutes      |
| **TOTAL**                 | **40**    | Mixed    | **~53 min**    |

**Optimization for 30-Minute Daily Run:**
- Focus on P0 scenarios (25 tests → ~20 minutes)
- Rotate P1/P2 scenarios daily
- Full suite weekly

---

## 📝 Notes

- Test scenarios assume production deployment on Vercel
- Update test account credentials if changed
- Add new scenarios when features added
- Remove deprecated scenarios when features removed
- Keep screenshots in `/qa-reports/screenshots/`
- Archive old reports after 30 days

---

**Last Updated:** 2026-02-15  
**Maintained By:** QA Subagent  
**Review Frequency:** Weekly (or after major deployments)
