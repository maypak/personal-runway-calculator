# QA Test Scenarios

**Version:** 1.0  
**Last Updated:** 2026-02-14  
**Target:** Personal Runway Calculator (Production)

---

## 🎯 Test Execution Order

1. **Smoke Test** (5 min) - Basic health check
2. **Critical Flows** (15 min) - Core functionality
3. **Browser Compatibility** (10 min) - Cross-browser testing
4. **Performance** (2 min) - Load time & bundle size

**Total Time:** ~32 minutes

---

## 1️⃣ Smoke Test (5 min)

### ST-01: Production URL Reachable
**Steps:**
1. Visit `https://personal-runway-calculator.vercel.app`
2. Check HTTP status code

**Expected:** 200 OK  
**Severity:** P0 (Critical)

---

### ST-02: Page Load Performance
**Steps:**
1. Visit production URL
2. Measure load time (use browser DevTools)

**Expected:** <3 seconds  
**Severity:** P1 (High)

---

### ST-03: Console Errors
**Steps:**
1. Open browser DevTools → Console
2. Visit production URL
3. Check for errors

**Expected:** 0 errors (warnings OK)  
**Severity:** P1 (High)

---

### ST-04: Auth Page Renders
**Steps:**
1. Visit production URL
2. Verify auth page elements:
   - Logo visible
   - "Personal Runway" title
   - Email input field
   - Password input field
   - Sign In / Sign Up buttons

**Expected:** All elements visible  
**Severity:** P0 (Critical)

---

## 2️⃣ Critical Flows (15 min)

### CF-01: Email Signup Flow
**Steps:**
1. Click "Sign Up" tab
2. Enter email: `qa-test-{timestamp}@example.com`
3. Enter password: `TestPass123!`
4. Click "Create Account"
5. Check for success message

**Expected:**
- Success message: "✅ Check your email for confirmation link!"
- No error messages

**Severity:** P0 (Critical)

**Note:** Email confirmation link test requires access to test email inbox (skip in automated QA)

---

### CF-02: Email Login Flow
**Steps:**
1. Use existing test account:
   - Email: `qa-test@example.com`
   - Password: `TestPass123!`
2. Click "Sign In" tab
3. Enter credentials
4. Click "Sign In"

**Expected:**
- Success message: "✅ Signed in successfully!"
- Dashboard loads
- URL changes to main app

**Severity:** P0 (Critical)

---

### CF-03: Financial Settings Save & Persist
**Steps:**
1. Login to test account
2. Navigate to financial settings (if in modal/tab)
3. Update values:
   - Current Savings: 50000
   - Lump Sum: 10000
   - Monthly Income: 3000
   - Income Months: 6
   - Monthly Fixed: 2000
   - Monthly Variable: 1500
4. Wait 2 seconds (auto-save)
5. **Refresh page (F5)**
6. Check values

**Expected:**
- All values persist after refresh
- Runway calculation updates correctly

**Severity:** P0 (Critical)  
**Bug History:** Fixed 2026-02-14 (incorrect upsert usage)

---

### CF-04: Expense Add & Persist
**Steps:**
1. Login to test account
2. Click "Add Expense" (or similar)
3. Enter:
   - Amount: 50
   - Category: Food
   - Memo: "QA Test Expense"
4. Save
5. Verify expense appears in list
6. **Refresh page (F5)**
7. Verify expense still exists

**Expected:**
- Expense appears immediately
- Expense persists after refresh
- Runway calculation updates

**Severity:** P0 (Critical)

---

### CF-05: Expense Delete & Persist
**Steps:**
1. Find "QA Test Expense" from CF-04
2. Click delete button
3. Verify expense removed from list
4. **Refresh page (F5)**
5. Verify expense still deleted

**Expected:**
- Expense removed immediately
- Deletion persists after refresh
- Runway calculation updates

**Severity:** P1 (High)

---

### CF-06: Runway Calculation Accuracy
**Steps:**
1. Login to test account
2. Set known values:
   - Current Savings: 10000
   - Lump Sum: 0
   - Monthly Income: 0
   - Income Months: 0
   - Monthly Fixed: 1000
   - Monthly Variable: 500
3. Check runway display

**Expected:**
- Total funds: $10,000
- Monthly expense: $1,500
- Runway: 6 months (10000 / 1500 = 6.66, floor to 6)
- Display: "6 months" or "0yr 6mo"

**Severity:** P0 (Critical)

---

### CF-07: Logout Flow
**Steps:**
1. Login to test account
2. Click logout button (if visible)
3. Verify redirect to auth page

**Expected:**
- Redirect to login page
- No dashboard access without login

**Severity:** P1 (High)

---

## 3️⃣ Browser Compatibility (10 min)

### BC-01: Chrome (Latest)
**Steps:**
1. Open Chrome
2. Execute Smoke Test
3. Execute CF-03 (Financial Settings)
4. Check layout/styling

**Expected:**
- All tests pass
- No layout issues
- No console errors

**Severity:** P0 (Critical)

---

### BC-02: Safari (Latest)
**Steps:**
1. Open Safari
2. Execute Smoke Test
3. Execute CF-03 (Financial Settings)
4. Check layout/styling

**Expected:**
- All tests pass
- No layout issues
- No console errors

**Severity:** P1 (High)

---

### BC-03: Firefox (Latest)
**Steps:**
1. Open Firefox
2. Execute Smoke Test
3. Execute CF-03 (Financial Settings)
4. Check layout/styling

**Expected:**
- All tests pass
- No layout issues
- No console errors

**Severity:** P1 (High)

---

### BC-04: Mobile Safari (iOS)
**Steps:**
1. Open Mobile Safari (or simulator)
2. Visit production URL
3. Test basic interactions:
   - Tap login button
   - Enter credentials
   - Scroll page
   - Check responsive layout

**Expected:**
- Touch targets large enough (44x44px min)
- Text readable without zoom
- No horizontal scroll

**Severity:** P1 (High)

---

### BC-05: Mobile Chrome (Android)
**Steps:**
1. Open Mobile Chrome (or simulator)
2. Visit production URL
3. Test basic interactions
4. Check responsive layout

**Expected:**
- Touch targets large enough
- Text readable without zoom
- No horizontal scroll

**Severity:** P2 (Medium)

---

## 4️⃣ Performance (2 min)

### PF-01: Page Load Time
**Steps:**
1. Open DevTools → Network tab
2. Hard refresh (Cmd+Shift+R)
3. Check "Load" time

**Expected:**
- < 3 seconds (good)
- < 5 seconds (acceptable)
- > 5 seconds (needs optimization)

**Severity:** P2 (Medium)

---

### PF-02: Bundle Size
**Steps:**
1. Open DevTools → Network tab
2. Hard refresh
3. Check total transferred size

**Expected:**
- < 1MB (good)
- < 2MB (acceptable)
- > 2MB (needs optimization)

**Severity:** P3 (Low)

---

## 🚨 Known Issues (Historical)

### Resolved:
1. **Financial settings not persisting** (2026-02-14)
   - Root cause: Incorrect upsert usage
   - Fix: Added onConflict option
   - Test: CF-03

2. **OAuth Site URL misconfigured** (2026-02-14)
   - Root cause: localhost in production
   - Fix: Changed to production URL
   - Status: OAuth not yet enabled (pending GitHub app creation)

---

## 📊 Pass Criteria

### Daily Automated QA:
- **Critical (P0):** 100% pass required
- **High (P1):** 90% pass acceptable
- **Medium (P2):** 80% pass acceptable
- **Low (P3):** Advisory only

### Pre-Deploy Manual QA:
- **All P0/P1 tests:** Must pass
- **P2/P3:** Document but don't block

---

## 🔄 Regression Testing

After any code change, always re-test:
1. CF-03 (Financial Settings) - Most fragile
2. CF-04, CF-05 (Expense CRUD) - Data persistence
3. CF-06 (Runway Calculation) - Core logic

---

## 📝 Test Account

**Email:** `qa-test@example.com`  
**Password:** `TestPass123!`

**Pre-configured data:**
- Savings: 25000
- Monthly expenses: 2500
- Expected runway: 10 months

**Note:** This account should be maintained in production for automated QA

---

## 🎯 Success Metrics

**Week 1 Target:**
- Pass rate: >95%
- Execution time: <35 min
- False positives: <3

**Month 1 Target:**
- Pass rate: >98%
- Execution time: <30 min
- False positives: <1

---

_Last reviewed: 2026-02-14_  
_Next review: After major feature release_
