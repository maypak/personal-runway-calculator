# UX Test Flow Analysis
**Personal Runway Calculator - E2E Test Coverage Expansion**

**Created:** 2026-02-21  
**Role:** UX Designer  
**Purpose:** User journey-based test design for critical user flows  
**Collaboration:** Works with QA Engineer for technical test implementation

---

## 📋 Executive Summary

This document identifies **critical user journeys** from a UX perspective, complementing the technical QA scenarios in `qa-scenarios.md`. Focus is on:
- **User mental models** (what users expect vs. what happens)
- **Friction points** (where users might get stuck)
- **Data loss risks** (where losing progress hurts most)
- **Mobile-first considerations** (touch targets, keyboard types)

---

## 🎯 Critical User Journeys

### Journey 1: First-Time User - Complete First Calculation

**Persona:** Sarah, 28, freelance designer, wants to know her runway  
**Goal:** From "I just heard about this app" → "I see my runway number"  
**Expected Duration:** 3-5 minutes  
**Drop-off Risk:** ⚠️ **HIGH** (most critical onboarding flow)

#### Flow Steps

```
[Landing Page] 
    ↓
[Sign Up Button] → Click
    ↓
[Auth Modal] 
    ↓ (OAuth preferred)
[GitHub/Google OAuth] → Authorize
    ↓ (or Email signup)
[Email + Password] → Create Account
    ↓
[Dashboard (Empty State)] 
    ↓ (500ms delay)
[Onboarding Wizard Modal] → Auto-popup
    ↓
[Step 1: Welcome] → Click "Get Started"
    ↓
[Step 2: Current Savings] → Enter "$50,000"
    ↓ (Real-time validation)
[Step 3: Monthly Expenses] → Enter "$3,500"
    ↓ (Live runway preview)
[Step 4: Results] → See "14 months runway" 🎉
    ↓
[Complete Onboarding] → Dashboard loads with data
    ↓
[First Calculation Visible] ✅ SUCCESS
```

#### UX Validation Points

| Step | What Could Go Wrong | Expected UX Behavior | Test Priority |
|------|---------------------|----------------------|---------------|
| **Auth Modal** | OAuth popup blocked | "Popup blocked? Click here to try again" | 🔴 P0 |
| **OAuth Redirect** | Takes >5 seconds | Loading spinner + "This may take a moment..." | 🟡 P1 |
| **Onboarding Auto-popup** | Doesn't appear for first-time users | Must appear within 1 second after dashboard render | 🔴 P0 |
| **Savings Input** | Types "50k" instead of "50000" | Accept and parse common formats (50k, 50,000) | 🟡 P1 |
| **Negative Number** | Enters "-1000" in savings | Red border + "Must be a positive number" | 🔴 P0 |
| **Non-numeric** | Types "abc" in expenses | Reject input + helpful message "Enter numbers only" | 🔴 P0 |
| **Onboarding Exit** | Clicks outside modal to close | **⚠️ DATA LOSS!** → Confirm dialog: "Are you sure? Progress will be lost" | 🔴 P0 |
| **Browser Refresh** | Refreshes mid-onboarding | **⚠️ START OVER!** → Consider localStorage backup | 🟡 P1 |
| **Zero Values** | Enters "$0" for savings | Warning: "With $0 savings, you have 0 days runway" | 🟡 P1 |
| **Confetti Animation** | Step 4 results | Celebrate first calculation! (already implemented ✅) | 🟢 P2 |

#### Mobile-Specific UX

| Element | Mobile Consideration | Expected Behavior | Test |
|---------|----------------------|-------------------|------|
| **Number Input** | Keyboard type | `<input type="number" inputmode="decimal">` → Numeric keyboard on iOS/Android | 🔴 P0 |
| **Modal Size** | Viewport fit | Modal should be 90% width on mobile, not cut off | 🔴 P0 |
| **Touch Targets** | Button size | Minimum 44×44px (iOS guideline) for all buttons | 🟡 P1 |
| **Landscape Mode** | Orientation change | Modal should adapt, not break layout | 🟡 P1 |

#### Success Metrics
- ✅ User completes onboarding in <3 minutes
- ✅ No confusion on what to enter
- ✅ Clear feedback at every step
- ✅ Celebratory moment at the end

#### Failure Scenarios (Test These!)

**Scenario A: The "Impatient User"**
- Clicks "Next" rapidly without reading
- Expected: Button disabled until valid input provided
- Test: Spam-click "Next" button → Should not advance with empty fields

**Scenario B: The "Browser Back Button User"**
- Enters data → Clicks browser back button accidentally
- Expected: Modal stays open OR confirmation dialog
- Test: Press browser back → Verify data not lost

**Scenario C: The "Copy-Paste User"**
- Copies "$50,000.50" from Excel
- Pastes into input field
- Expected: Parse and accept (strip "$" and ",")
- Test: Paste formatted currency → Should work seamlessly

---

### Journey 2: Returning User - Daily Check & Expense Entry

**Persona:** Marcus, 35, software engineer, checks runway weekly  
**Goal:** "How's my runway today? Let me add yesterday's expenses"  
**Expected Duration:** 1-2 minutes  
**Drop-off Risk:** 🟢 LOW (familiar flow)

#### Flow Steps

```
[Open App] 
    ↓
[Login Screen] (if session expired)
    ↓
[Email + Password] → Login
    ↓
[Dashboard Loads] → See updated runway
    ↓ (Scan metrics)
[Available Balance] → Check: "$47,300"
[Monthly Burn] → See: "$3,500/month"
[Runway] → Read: "13.5 months"
    ↓ (Decide to add expense)
[Click "Add Expense" Button] 
    ↓
[Expense Form Opens]
    ↓
[Fill: Amount] → "$52.30" (grocery)
[Fill: Category] → "Food"
[Fill: Memo] → "Costco trip"
    ↓
[Click "Save"]
    ↓ (Optimistic UI update)
[Dashboard Updates] → Balance now "$47,247.70"
    ↓
[Expense Appears in List] ✅ SUCCESS
```

#### UX Validation Points

| Step | What Could Go Wrong | Expected UX Behavior | Test Priority |
|------|---------------------|----------------------|---------------|
| **Session Expired** | User opens app after 3 days | Auto-redirect to login (not blank page or error) | 🔴 P0 |
| **Dashboard Load** | Takes >3 seconds | Skeleton loader shows (not blank screen) | 🔴 P0 |
| **Dashboard Slow** | Data fetch slow | Cached data shown first + update when ready | 🟡 P1 |
| **Add Expense Button** | Not immediately visible | Should be prominent (top right or bottom FAB on mobile) | 🟡 P1 |
| **Expense Form** | Opens as modal | Focus automatically on Amount field (UX shortcut) | 🟡 P1 |
| **Amount Input** | Enter cents: "52.30" | Accept decimals up to 2 places | 🔴 P0 |
| **Category Dropdown** | Many categories | Dropdown should be keyboard-navigable (accessibility) | 🟢 P2 |
| **Save Loading** | Network delay | Button shows spinner + disabled during save | 🔴 P0 |
| **Save Success** | Expense saved | **Optimistic update** → Appear in list immediately | 🟡 P1 |
| **Save Failure** | Network offline | Error toast: "Couldn't save. Retry?" + form data preserved | 🔴 P0 |
| **Duplicate Prevention** | User clicks "Save" twice | Button disabled after first click | 🟡 P1 |

#### Data Integrity Checks

**Critical Test: Form Data Preservation During Errors**

**Scenario:**
1. User fills expense form: Amount "$120", Category "Shopping", Memo "Birthday gift"
2. Network goes offline
3. User clicks "Save"
4. Error occurs

**Expected:**
- ❌ **BAD UX:** Form clears → User must re-enter everything (frustrating!)
- ✅ **GOOD UX:** Form data preserved + error message + "Retry" button

**Test:**
```javascript
// Playwright test pseudocode
await page.fill('[data-testid="expense-amount"]', '120');
await page.selectOption('[data-testid="expense-category"]', 'Shopping');
await page.fill('[data-testid="expense-memo"]', 'Birthday gift');

// Simulate network failure
await page.route('**/api/expenses', route => route.abort());

await page.click('[data-testid="save-expense-btn"]');

// Verify: Form data still present
await expect(page.locator('[data-testid="expense-amount"]')).toHaveValue('120');
await expect(page.locator('[data-testid="expense-memo"]')).toHaveValue('Birthday gift');
```

#### Mobile-Specific UX

| Element | Mobile Consideration | Expected Behavior | Test |
|---------|----------------------|-------------------|------|
| **Expense Form Modal** | Full screen on mobile | Use bottom sheet UI pattern for better thumb reach | 🟡 P1 |
| **Amount Input** | Numeric keyboard | `inputmode="decimal"` → Decimal keyboard with number pad | 🔴 P0 |
| **Category Picker** | Dropdown vs. native picker | iOS: Use native picker wheel; Android: Material dropdown | 🟡 P1 |
| **Memo Field** | Optional | Clearly marked as "(optional)" | 🟢 P2 |
| **Save Button** | Bottom of form | Sticky button that stays visible when keyboard opens | 🟡 P1 |

#### Success Metrics
- ✅ Add expense in <30 seconds
- ✅ Dashboard updates immediately (optimistic UI)
- ✅ No data loss on errors
- ✅ Clear feedback on success/failure

---

### Journey 3: FIRE Seeker - Goal Setting & Progress Tracking

**Persona:** Emma, 42, teacher, planning early retirement at 55  
**Goal:** "When can I retire? What do I need to save?"  
**Expected Duration:** 5-10 minutes (first time)  
**Drop-off Risk:** 🟡 MEDIUM (complex calculation, high engagement)

#### Flow Steps

```
[Dashboard]
    ↓ (Notice "FIRE" tab)
[Click "FIRE" Tab] OR [Navigate to /fire]
    ↓
[FIRE Dashboard Loads]
    ↓ (First-time state)
[Empty State: "Set your FIRE goal"] 
    ↓
[Click "Get Started" Button]
    ↓
[FIRE Settings Modal Opens]
    ↓
[Annual Expenses] → Enter "$48,000" (current)
[Target Annual Expenses] → "$40,000" (retired)
[Safe Withdrawal Rate] → "4%" (default)
[Expected Return] → "7%" (default)
[Target FI Amount] → Auto-calculated: "$1,000,000"
    ↓
[Current Investment Portfolio] → "$250,000"
[Monthly Contribution] → "$2,500"
    ↓
[Click "Calculate"]
    ↓
[Results Display]
    ↓
[FI Progress Bar] → "25% to FI"
[Time to FI] → "12 years 4 months"
[Projection Chart] → Visual growth curve
[Milestones] → "Lean FI", "Flex FI", "Full FI"
    ↓
[User Reviews Results] ✅ SUCCESS
```

#### UX Validation Points

| Step | What Could Go Wrong | Expected UX Behavior | Test Priority |
|------|---------------------|----------------------|---------------|
| **FIRE Tab Discovery** | User doesn't notice tab | Clear visual indicator + tooltip "Plan your FIRE journey" | 🟡 P1 |
| **Empty State** | Blank screen confusing | Hero section: "Financial Independence Calculator" + CTA | 🟡 P1 |
| **Settings Modal** | Too many fields overwhelming | Progressive disclosure: Basic → Advanced toggle | 🟡 P1 |
| **Safe Withdrawal Rate** | User doesn't understand | Tooltip: "4% is the traditional safe rate. Learn more →" | 🟡 P1 |
| **Target FI Amount** | Auto-calculation wrong | Formula: Annual Expenses ÷ SWR (e.g., $40k ÷ 0.04 = $1M) | 🔴 P0 |
| **Invalid Inputs** | SWR > 10% (unrealistic) | Warning: "10%+ is aggressive. Consider 3-5%." | 🟡 P1 |
| **Progress Bar** | Shows >100% | Handle gracefully: "🎉 You've reached FI!" + confetti | 🟢 P2 |
| **Time to FI Negative** | Already FI | "You're already FI! Consider Flex/Fat FI goals" | 🟡 P1 |
| **Chart Rendering** | Large numbers (20+ years) | Y-axis scales properly + readable labels | 🟡 P1 |
| **Mobile Chart** | Too small to read | Pinch-to-zoom OR horizontal scroll for detailed view | 🟡 P1 |

#### Complex Calculation Edge Cases

**Test Scenario 1: "Already FI"**
- Current Portfolio: $1,200,000
- Target FI Amount: $1,000,000
- Expected: "Congratulations! You're FI! 🎉" + Milestones unlocked

**Test Scenario 2: "Negative Cash Flow"**
- Monthly Contribution: -$500 (spending more than earning)
- Expected: Warning: "⚠️ Negative contributions will delay FI indefinitely"

**Test Scenario 3: "Unrealistic Assumptions"**
- Expected Return: 20% (way too high)
- Expected: "⚠️ 20% annual return is unrealistic. Historical average is 7-10%."

**Test Scenario 4: "Zero Contribution"**
- Monthly Contribution: $0
- Expected: Time to FI based on investment growth only (valid scenario)

#### User Education Moments

FIRE concepts are complex. UX must educate without overwhelming:

| Term | User Confusion Point | UX Solution | Test |
|------|----------------------|-------------|------|
| **Safe Withdrawal Rate (SWR)** | "What does 4% mean?" | Tooltip: "Amount you can withdraw annually without running out" + link to docs | 🟡 P1 |
| **Lean/Flex/Fat FI** | "What's the difference?" | Visual comparison table with examples | 🟡 P1 |
| **Sequence of Returns Risk** | Advanced concept | Hide in "Advanced Settings" section (not in main flow) | 🟢 P2 |
| **Real vs. Nominal Returns** | Inflation-adjusted? | Default to real returns (inflation-adjusted) + toggle for nominal | 🟢 P2 |

#### Success Metrics
- ✅ User understands their FI timeline
- ✅ No confusion on what inputs mean
- ✅ Tooltips answer common questions
- ✅ Chart clearly shows progress trajectory

---

### Journey 4: Power User - Scenario Comparison

**Persona:** Alex, 38, considering job change, wants to compare scenarios  
**Goal:** "What if I take a lower salary but better work-life balance?"  
**Expected Duration:** 10-15 minutes  
**Drop-off Risk:** 🟢 LOW (engaged power user)

#### Flow Steps

```
[Dashboard]
    ↓
[Click "Scenarios" Link] OR [Navigate to /scenarios]
    ↓
[Scenarios Page Loads]
    ↓ (Shows current "Base Scenario")
[Click "Create Scenario" Button]
    ↓
[Scenario Form Modal]
    ↓
[Name] → "Job Change: Lower Salary"
[Based On] → "Current Settings" (clone)
    ↓
[Modify Values]
[Monthly Income] → $6,000 → $4,500 (lower)
[Monthly Expenses] → $3,500 → $3,000 (cut back)
[Savings Rate] → Auto-update: 33% → 30%
    ↓
[Click "Save Scenario"]
    ↓
[Scenario Card Appears in List]
    ↓
[Create Second Scenario]
[Name] → "Side Hustle Boost"
[Monthly Income] → $6,000 → $7,500 (+side hustle)
[Monthly Expenses] → $3,500 (same)
[Savings Rate] → 53% 🚀
    ↓
[Click "Compare Scenarios" Button]
    ↓
[Comparison View Opens]
    ↓
[Side-by-Side Table]
- Base: 14 months runway
- Lower Salary: 11 months runway ⚠️
- Side Hustle: 18 months runway ✅
    ↓
[Visual Chart] → Three lines showing projections
    ↓
[User Insights] → "Side hustle adds 4 months runway"
    ↓
[Decision Made] ✅ SUCCESS
```

#### UX Validation Points

| Step | What Could Go Wrong | Expected UX Behavior | Test Priority |
|------|---------------------|----------------------|---------------|
| **Scenarios Discovery** | User doesn't know feature exists | Prompt in dashboard: "💡 Try creating scenarios to compare options" | 🟡 P1 |
| **Create Scenario** | Starts from scratch | Default: Clone current settings (faster workflow) | 🟡 P1 |
| **Scenario Naming** | Generic names "Scenario 1, 2, 3" | Encourage descriptive names + examples shown | 🟢 P2 |
| **Too Many Scenarios** | Creates 20+ scenarios | Performance test: List should handle 50+ scenarios | 🟢 P2 |
| **Delete Scenario** | Accidental deletion | Confirmation dialog: "Delete [name]? This cannot be undone." | 🔴 P0 |
| **Compare Selection** | Selects 10 scenarios | Limit to 3-5 max for comparison (UX clutter) | 🟡 P1 |
| **Comparison Table** | Too many columns | Horizontal scroll OR responsive stacked cards on mobile | 🟡 P1 |
| **Chart Overlap** | 3 lines hard to distinguish | Different colors + legend + line styles (solid/dashed) | 🟡 P1 |
| **Export Comparison** | Wants to save results | "Export as PDF" or "Share Link" feature (nice-to-have) | 🟢 P2 |

#### Mobile UX Considerations

**Problem:** Comparison tables don't work well on mobile

**Solution Options:**
1. **Stacked Cards** (Recommended)
   - Each scenario = vertical card
   - Swipe between scenarios
   - Key metrics highlighted

2. **Tabbed View**
   - Tabs: "Base | Lower Salary | Side Hustle"
   - Switch between scenarios
   - Consistent metric layout

3. **Horizontal Scroll Table** (Fallback)
   - Table scrolls horizontally
   - First column (metric names) sticky

**Test:** Open comparison view on iPhone SE (smallest screen) → Should be usable

#### Success Metrics
- ✅ Create scenario in <2 minutes
- ✅ Compare 2-3 scenarios easily
- ✅ Clear visual difference between scenarios
- ✅ Insights help decision-making

---

## 🛑 Critical UX Pain Points (Test These First!)

### 1. **Data Loss Risk Zones** 🔴 P0

These are moments where losing user progress is catastrophic:

| Risk Zone | When It Happens | Prevention | Test |
|-----------|-----------------|------------|------|
| **Onboarding Exit** | User closes modal mid-wizard | Confirmation dialog OR localStorage backup | 🔴 P0 |
| **Settings Not Saved** | User edits settings, navigates away | "Unsaved changes" warning OR auto-save | 🔴 P0 |
| **Browser Refresh** | User refreshes during form fill | localStorage backup of form state | 🟡 P1 |
| **Session Timeout** | User idle for 30 min mid-task | Save draft to server OR warn before timeout | 🟡 P1 |
| **Network Failure** | Save fails due to offline | Preserve form data + retry button | 🔴 P0 |

**Test Script:**
```gherkin
Scenario: Onboarding wizard exit protection
  Given user is on Step 2 of 4 in onboarding
  And user has entered "$50,000" in savings field
  When user clicks outside modal to close
  Then show confirmation: "Exit onboarding? Progress will be lost."
  And user chooses "Cancel"
  Then onboarding modal stays open
  And "$50,000" is still in savings field
```

---

### 2. **Confusing Error Messages** 🟡 P1

**BAD:** "Error 400: Invalid request body"  
**GOOD:** "Please enter a valid number for Monthly Expenses"

| Error Scenario | Current Message (to test) | Better Message | Test |
|----------------|---------------------------|----------------|------|
| **Negative number** | "Value must be positive" | "Please enter a positive number (e.g., 1000, not -1000)" | 🔴 P0 |
| **Non-numeric input** | "Invalid input" | "Only numbers allowed (e.g., 5000.50)" | 🔴 P0 |
| **Network timeout** | "Network error" | "Couldn't connect. Check your internet and try again." | 🟡 P1 |
| **Database error** | "500 Internal Server Error" | "Something went wrong on our end. We're looking into it!" | 🟡 P1 |
| **OAuth failed** | "Authentication failed" | "GitHub login didn't work. Try again or use email instead." | 🟡 P1 |

**Test Script:**
```gherkin
Scenario: User-friendly error messages
  Given user is on Financial Settings page
  When user enters "abc" in Monthly Expenses field
  And user tabs out of the field
  Then field shows red border
  And error message displays: "Only numbers allowed (e.g., 5000.50)"
  And field has aria-describedby pointing to error message (accessibility)
```

---

### 3. **"Where Am I?" Navigation Confusion** 🟡 P1

Users should always know:
- What page am I on?
- How do I get back?
- What's the hierarchy?

| Page | Breadcrumb/Back Button | Mobile Navigation | Test |
|------|------------------------|-------------------|------|
| `/fire` | "← Back to Dashboard" link | Bottom nav bar with "FIRE" tab active | 🟡 P1 |
| `/scenarios/[id]/edit` | "Scenarios > Edit [name]" | "← Cancel" button | 🟡 P1 |
| `/scenarios/compare` | "Scenarios > Compare" | Bottom nav OR header | 🟡 P1 |

**Test Script:**
```gherkin
Scenario: Clear navigation context
  Given user is on FIRE page (/fire)
  Then page title reads "FIRE Calculator"
  And back button shows "← Back to Dashboard"
  And clicking back button navigates to "/"
  And bottom navigation (if exists) highlights "FIRE" tab
```

---

### 4. **Mobile Input UX** 📱 🔴 P0

**Problem:** Wrong keyboard type = bad UX

| Field | Expected Keyboard | Test | Screenshot |
|-------|-------------------|------|------------|
| **Savings Amount** | Numeric with decimal (iOS: 0-9 + ".") | `<input type="number" inputmode="decimal">` | 🔴 P0 |
| **Email** | Email keyboard (iOS: includes "@") | `<input type="email">` | 🔴 P0 |
| **Memo/Notes** | Full QWERTY | `<input type="text">` | 🟢 P2 |

**Test Device Matrix:**
- iOS Safari (iPhone 13 Pro, iOS 17)
- Android Chrome (Pixel 6, Android 13)
- iPad Safari (landscape + portrait)

**Test Script:**
```gherkin
Scenario: Mobile numeric keyboard for amount fields
  Given user opens app on iPhone
  When user taps on "Current Savings" input field
  Then iOS numeric keyboard appears
  And keyboard includes decimal point "."
  And keyboard does NOT include letters
```

---

### 5. **Accessibility Gaps** ♿️ 🟡 P1

| Issue | Impact | Fix | Test |
|-------|--------|-----|------|
| **Missing labels** | Screen reader can't describe fields | Add `<label for="savings">` or `aria-label` | 🟡 P1 |
| **Focus order** | Tab order illogical | Check tab index flows top-to-bottom | 🟡 P1 |
| **Color contrast** | Low vision users can't read text | WCAG AA: 4.5:1 for body text | 🟡 P1 |
| **Keyboard navigation** | Can't use app without mouse | All interactive elements keyboard-accessible | 🟡 P1 |
| **Error announcements** | Screen reader doesn't announce errors | Use `role="alert"` or `aria-live="polite"` | 🟡 P1 |

**Test with:**
- macOS VoiceOver
- Chrome DevTools Lighthouse (Accessibility audit)
- Keyboard only (unplug mouse!)

---

## 📱 Mobile UX Checklist

Personal Runway Calculator mobile users (estimated 40%+) need special attention:

### Touch Targets

**iOS Human Interface Guidelines:** Minimum 44×44pt  
**Android Material Design:** Minimum 48×48dp

| Element | Current Size (to verify) | Expected | Test |
|---------|--------------------------|----------|------|
| **Buttons** | ? | ≥44×44px (mobile) | 🔴 P0 |
| **Icon buttons** | ? | ≥44×44px with padding | 🔴 P0 |
| **Dropdown arrows** | ? | ≥32×32px touch area | 🟡 P1 |
| **Checkbox/Radio** | ? | ≥24×24px with 10px padding = 44×44px | 🟡 P1 |

**Test Script:**
```javascript
// Playwright mobile test
test('Button touch targets are ≥44px on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  const button = page.locator('[data-testid="save-button"]');
  const box = await button.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
});
```

---

### Viewport & Orientation

| Test Case | Expected Behavior | Test |
|-----------|-------------------|------|
| **Portrait 320px** (iPhone SE) | No horizontal scroll + readable text | 🔴 P0 |
| **Portrait 390px** (iPhone 13) | Optimal layout | 🔴 P0 |
| **Landscape** | Adapt layout OR prompt to rotate | 🟡 P1 |
| **Tablet 768px** | Desktop-like layout OR optimized tablet view | 🟡 P1 |
| **Zoom 200%** (accessibility) | Layout doesn't break | 🟡 P1 |

**Test on real devices:**
- iPhone SE (smallest modern iPhone)
- iPhone 13 Pro (mid-size)
- iPad (tablet)
- Android: Pixel 6 or Samsung Galaxy

---

### Keyboard Types (Critical!)

| Field | `inputmode` | `type` | Keyboard | Test |
|-------|-------------|--------|----------|------|
| Savings | `decimal` | `number` | Numeric + decimal | 🔴 P0 |
| Expenses | `decimal` | `number` | Numeric + decimal | 🔴 P0 |
| Email | - | `email` | Email keyboard (@, .) | 🔴 P0 |
| Password | - | `password` | Full keyboard + show/hide | 🔴 P0 |
| Memo | - | `text` | Full QWERTY | 🟢 P2 |

**Implementation:**
```html
<!-- Good ✅ -->
<input 
  type="number" 
  inputmode="decimal" 
  aria-label="Current Savings"
  placeholder="50000"
/>

<!-- Bad ❌ -->
<input type="text" placeholder="Enter amount" />
```

---

### Form UX on Mobile

**Best Practices:**

1. **One column layout** (not side-by-side fields)
2. **Large input fields** (min 44px height)
3. **Floating labels** (saves space)
4. **Inline validation** (real-time feedback)
5. **Sticky save button** (always visible even when keyboard open)

**Test Script:**
```gherkin
Scenario: Mobile form usability
  Given user opens Financial Settings on mobile
  Then all input fields are single column (not two columns)
  And each field height is ≥44px
  When user taps on Savings field
  Then field label animates to floating position (if using floating labels)
  And numeric keyboard appears
  When user scrolls down while keyboard is open
  Then "Save" button remains visible (sticky bottom)
```

---

### Performance on Mobile

| Metric | Target | Current (to verify) | Test |
|--------|--------|---------------------|------|
| **First Contentful Paint** | <2s on 3G | ? | Lighthouse mobile audit |
| **Time to Interactive** | <5s on 3G | ? | Lighthouse mobile audit |
| **Cumulative Layout Shift** | <0.1 | ? | Core Web Vitals |
| **Offline support** | Basic (view data) | ❓ | Test in airplane mode |

**Test:**
```bash
# Lighthouse CI mobile audit
npx lighthouse https://personal-runway-calculator.vercel.app \
  --preset=perf \
  --form-factor=mobile \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4 \
  --output=html \
  --output-path=./lighthouse-mobile.html
```

---

## 🔍 QA Recommendations

### High-Priority Test Cases for QA Engineer

Based on UX analysis, these scenarios should be implemented in E2E tests **first**:

#### 1. **Onboarding Flow** (auth.spec.ts + new onboarding.spec.ts)

```typescript
// onboarding.spec.ts
describe('First-Time User Onboarding', () => {
  test('should complete onboarding wizard successfully', async ({ page }) => {
    // Sign up new user
    await signUp(page, generateTestEmail(), 'TestPass123!');
    
    // Onboarding should auto-appear
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 2000 });
    
    // Step 1: Welcome
    await page.click('[data-testid="onboarding-start-btn"]');
    
    // Step 2: Savings
    await page.fill('[data-testid="onboarding-savings"]', '50000');
    await page.click('[data-testid="onboarding-next"]');
    
    // Step 3: Expenses
    await page.fill('[data-testid="onboarding-expenses"]', '3500');
    await page.click('[data-testid="onboarding-next"]');
    
    // Step 4: Results
    await expect(page.locator('text=14 months')).toBeVisible(); // Runway calculation
    await expect(page.locator('[data-testid="confetti-canvas"]')).toBeVisible(); // Celebration
    
    await page.click('[data-testid="onboarding-complete"]');
    
    // Dashboard should show data
    await expect(page.locator('text=$50,000')).toBeVisible();
  });

  test('should warn user before exiting onboarding', async ({ page }) => {
    await signUp(page, generateTestEmail(), 'TestPass123!');
    await page.fill('[data-testid="onboarding-savings"]', '50000');
    
    // Try to close modal
    await page.keyboard.press('Escape');
    
    // Confirmation dialog should appear
    await expect(page.locator('text=Exit onboarding?')).toBeVisible();
  });

  test('should handle invalid inputs gracefully', async ({ page }) => {
    await signUp(page, generateTestEmail(), 'TestPass123!');
    
    // Try negative number
    await page.fill('[data-testid="onboarding-savings"]', '-1000');
    await page.click('[data-testid="onboarding-next"]');
    
    // Should show error
    await expect(page.locator('text=positive number')).toBeVisible();
    
    // Button should be disabled
    await expect(page.locator('[data-testid="onboarding-next"]')).toBeDisabled();
  });

  test('should use numeric keyboard on mobile', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await signUp(page, generateTestEmail(), 'TestPass123!');
    
    const savingsInput = page.locator('[data-testid="onboarding-savings"]');
    
    // Check inputmode attribute
    await expect(savingsInput).toHaveAttribute('inputmode', 'decimal');
    await expect(savingsInput).toHaveAttribute('type', 'number');
  });
});
```

---

#### 2. **Dashboard Interactions** (new dashboard.spec.ts)

```typescript
// dashboard.spec.ts
describe('Dashboard Core Flows', () => {
  test('should add expense and update calculations', async ({ page }) => {
    await loginAsTestUser(page);
    
    // Initial balance
    const initialBalance = await getBalance(page);
    
    // Add expense
    await page.click('[data-testid="add-expense-btn"]');
    await page.fill('[data-testid="expense-amount"]', '52.30');
    await page.selectOption('[data-testid="expense-category"]', 'Food');
    await page.click('[data-testid="save-expense-btn"]');
    
    // Optimistic update (should appear immediately)
    await expect(page.locator('text=$52.30')).toBeVisible({ timeout: 1000 });
    
    // Balance should decrease
    const newBalance = await getBalance(page);
    expect(newBalance).toBe(initialBalance - 52.30);
  });

  test('should preserve form data on network error', async ({ page }) => {
    await loginAsTestUser(page);
    
    await page.click('[data-testid="add-expense-btn"]');
    await page.fill('[data-testid="expense-amount"]', '120');
    await page.fill('[data-testid="expense-memo"]', 'Birthday gift');
    
    // Simulate network failure
    await page.route('**/api/expenses', route => route.abort());
    
    await page.click('[data-testid="save-expense-btn"]');
    
    // Error should show
    await expect(page.locator('text=Couldn\'t save')).toBeVisible();
    
    // Form data should still be there
    await expect(page.locator('[data-testid="expense-amount"]')).toHaveValue('120');
    await expect(page.locator('[data-testid="expense-memo"]')).toHaveValue('Birthday gift');
  });

  test('should show skeleton loader while loading', async ({ page }) => {
    await loginAsTestUser(page);
    
    // Slow down network to see loader
    await page.route('**/api/finance', route => 
      setTimeout(() => route.continue(), 3000)
    );
    
    await page.reload();
    
    // Skeleton should appear
    await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible();
    
    // Then real content
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 5000 });
  });
});
```

---

#### 3. **FIRE Dashboard** (new fire.spec.ts)

```typescript
// fire.spec.ts
describe('FIRE Calculator', () => {
  test('should calculate FI timeline correctly', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/fire');
    
    // Fill FIRE settings
    await page.click('[data-testid="fire-get-started-btn"]');
    await page.fill('[data-testid="annual-expenses"]', '48000');
    await page.fill('[data-testid="target-expenses"]', '40000');
    await page.fill('[data-testid="current-portfolio"]', '250000');
    await page.fill('[data-testid="monthly-contribution"]', '2500');
    
    await page.click('[data-testid="calculate-fi-btn"]');
    
    // Verify calculations
    await expect(page.locator('text=25%')).toBeVisible(); // Progress
    await expect(page.locator('text=12 years')).toBeVisible(); // Timeline
    
    // Chart should render
    await expect(page.locator('[data-testid="fi-projection-chart"]')).toBeVisible();
  });

  test('should handle "Already FI" scenario', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/fire');
    
    await page.fill('[data-testid="current-portfolio"]', '1200000');
    await page.fill('[data-testid="target-fi-amount"]', '1000000');
    
    await page.click('[data-testid="calculate-fi-btn"]');
    
    // Should celebrate!
    await expect(page.locator('text=You\'re already FI')).toBeVisible();
    await expect(page.locator('[data-testid="confetti-canvas"]')).toBeVisible();
  });

  test('should warn about unrealistic assumptions', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/fire');
    
    await page.fill('[data-testid="expected-return"]', '20');
    await page.blur('[data-testid="expected-return"]');
    
    // Warning should appear
    await expect(page.locator('text=unrealistic')).toBeVisible();
  });
});
```

---

#### 4. **Scenario Comparison** (new scenarios.spec.ts)

```typescript
// scenarios.spec.ts
describe('Scenario Management', () => {
  test('should create and compare scenarios', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/scenarios');
    
    // Create first scenario
    await page.click('[data-testid="create-scenario-btn"]');
    await page.fill('[data-testid="scenario-name"]', 'Lower Salary');
    await page.fill('[data-testid="monthly-income"]', '4500');
    await page.click('[data-testid="save-scenario-btn"]');
    
    await expect(page.locator('text=Lower Salary')).toBeVisible();
    
    // Create second scenario
    await page.click('[data-testid="create-scenario-btn"]');
    await page.fill('[data-testid="scenario-name"]', 'Side Hustle');
    await page.fill('[data-testid="monthly-income"]', '7500');
    await page.click('[data-testid="save-scenario-btn"]');
    
    // Compare scenarios
    await page.click('[data-testid="compare-scenarios-btn"]');
    
    // Comparison view should show both
    await expect(page.locator('text=Lower Salary')).toBeVisible();
    await expect(page.locator('text=Side Hustle')).toBeVisible();
    
    // Chart should show multiple lines
    const chart = page.locator('[data-testid="comparison-chart"]');
    await expect(chart).toBeVisible();
  });

  test('should confirm before deleting scenario', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/scenarios');
    
    await page.click('[data-testid="delete-scenario-btn"]');
    
    // Confirmation dialog
    await expect(page.locator('text=Delete')).toBeVisible();
    await expect(page.locator('text=cannot be undone')).toBeVisible();
  });
});
```

---

#### 5. **Mobile-Specific Tests** (new mobile.spec.ts)

```typescript
// mobile.spec.ts - Run with mobile viewport
describe('Mobile UX', () => {
  beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  });

  test('should use numeric keyboard for amount fields', async ({ page }) => {
    await loginAsTestUser(page);
    
    const input = page.locator('[data-testid="savings-input"]');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    await loginAsTestUser(page);
    
    const button = page.locator('[data-testid="add-expense-btn"]');
    const box = await button.boundingBox();
    
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('should adapt layout for small screens', async ({ page }) => {
    await loginAsTestUser(page);
    
    // No horizontal scroll should occur
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should keep save button visible when keyboard opens', async ({ page }) => {
    await loginAsTestUser(page);
    await page.click('[data-testid="add-expense-btn"]');
    
    // Focus on input (simulates keyboard opening)
    await page.focus('[data-testid="expense-amount"]');
    
    // Save button should still be visible (sticky positioning)
    await expect(page.locator('[data-testid="save-expense-btn"]')).toBeVisible();
  });
});
```

---

### Visual Regression Testing

Recommend adding visual regression tests with Playwright:

```typescript
// visual.spec.ts
import { test, expect } from '@playwright/test';

test('Dashboard visual snapshot', async ({ page }) => {
  await loginAsTestUser(page);
  
  // Take screenshot
  await expect(page).toHaveScreenshot('dashboard.png');
});

test('FIRE page visual snapshot', async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto('/fire');
  
  await expect(page).toHaveScreenshot('fire-dashboard.png');
});

// Run: npx playwright test --update-snapshots (first time)
// Then: npx playwright test (detects visual changes)
```

---

### Accessibility Testing

```typescript
// a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Dashboard should pass accessibility audit', async ({ page }) => {
  await loginAsTestUser(page);
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('Forms should be keyboard navigable', async ({ page }) => {
  await loginAsTestUser(page);
  await page.click('[data-testid="add-expense-btn"]');
  
  // Tab through form
  await page.keyboard.press('Tab'); // Amount field
  await page.keyboard.type('100');
  
  await page.keyboard.press('Tab'); // Category dropdown
  await page.keyboard.press('ArrowDown'); // Select category
  
  await page.keyboard.press('Tab'); // Memo field
  await page.keyboard.type('Test expense');
  
  await page.keyboard.press('Tab'); // Save button
  await page.keyboard.press('Enter'); // Submit
  
  // Should save successfully
  await expect(page.locator('text=$100')).toBeVisible();
});
```

---

## 📊 Success Metrics

### UX Quality Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Onboarding Completion Rate** | >80% | (Users who finish onboarding) ÷ (Users who start) |
| **Time to First Calculation** | <3 min | From sign-up to seeing runway result |
| **Error Recovery Success** | >90% | Users who retry after error and succeed |
| **Mobile Task Completion** | >85% | Same tasks as desktop, measured on mobile |
| **Scenario Creation Rate** | >40% | Users who create ≥1 scenario in first week |

### E2E Test Coverage Goals

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| **Authentication** | ✅ 10 tests | Maintain | P0 |
| **Onboarding** | ❌ 0 tests | 8 tests | 🔴 P0 |
| **Dashboard** | ❌ 0 tests | 12 tests | 🔴 P0 |
| **FIRE Calculator** | ❌ 0 tests | 10 tests | 🟡 P1 |
| **Scenarios** | ❌ 0 tests | 8 tests | 🟡 P1 |
| **Mobile UX** | ❌ 0 tests | 6 tests | 🔴 P0 |
| **Accessibility** | ❌ 0 tests | 4 tests | 🟡 P1 |
| **Visual Regression** | ❌ 0 tests | 5 snapshots | 🟢 P2 |

**Total:** 10 → 63 tests (6.3× increase)

---

## 🎨 UX Test Patterns (For QA Team)

### Pattern 1: "Optimistic UI Update"

**When:** User performs action (add expense, save settings)  
**Expected:** UI updates immediately, not after server confirms  
**Why:** Feels faster, better UX  

**Test:**
```typescript
test('Optimistic UI update', async ({ page }) => {
  await page.click('[data-testid="add-expense-btn"]');
  await page.fill('[data-testid="expense-amount"]', '50');
  
  // Measure time to UI update
  const startTime = Date.now();
  await page.click('[data-testid="save-expense-btn"]');
  
  await expect(page.locator('text=$50')).toBeVisible();
  const updateTime = Date.now() - startTime;
  
  // Should appear in <500ms (feels instant)
  expect(updateTime).toBeLessThan(500);
});
```

---

### Pattern 2: "Progressive Disclosure"

**When:** Complex forms (FIRE settings)  
**Expected:** Basic fields shown first, "Advanced" toggle for more  
**Why:** Reduces cognitive load  

**Test:**
```typescript
test('Progressive disclosure', async ({ page }) => {
  await page.goto('/fire');
  await page.click('[data-testid="fire-settings-btn"]');
  
  // Basic fields visible
  await expect(page.locator('[data-testid="annual-expenses"]')).toBeVisible();
  
  // Advanced fields hidden
  await expect(page.locator('[data-testid="sequence-risk-toggle"]')).not.toBeVisible();
  
  // Click "Advanced Options"
  await page.click('[data-testid="advanced-toggle"]');
  
  // Now visible
  await expect(page.locator('[data-testid="sequence-risk-toggle"]')).toBeVisible();
});
```

---

### Pattern 3: "Inline Validation"

**When:** User types in form field  
**Expected:** Real-time feedback (not just on submit)  
**Why:** Prevents frustration of filling entire form then seeing errors  

**Test:**
```typescript
test('Inline validation', async ({ page }) => {
  await page.fill('[data-testid="savings-input"]', '-100');
  
  // Blur to trigger validation
  await page.blur('[data-testid="savings-input"]');
  
  // Error should appear immediately
  await expect(page.locator('text=positive number')).toBeVisible({ timeout: 500 });
  
  // Field should have error styling
  await expect(page.locator('[data-testid="savings-input"]')).toHaveClass(/error|invalid/);
});
```

---

### Pattern 4: "Skeleton Loading State"

**When:** Data is loading  
**Expected:** Skeleton placeholder (not blank screen)  
**Why:** Perceived performance improvement  

**Test:**
```typescript
test('Skeleton loader appears', async ({ page }) => {
  // Slow down API
  await page.route('**/api/finance', route => 
    setTimeout(() => route.continue(), 2000)
  );
  
  await page.goto('/');
  
  // Skeleton should appear first
  await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible();
  
  // Then real content
  await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
  
  // Skeleton should disappear
  await expect(page.locator('[data-testid="skeleton-loader"]')).not.toBeVisible();
});
```

---

## 🚀 Next Steps

### For QA Engineer

1. **Implement high-priority tests first:**
   - ✅ `onboarding.spec.ts` (8 tests) - Week 1
   - ✅ `dashboard.spec.ts` (12 tests) - Week 1-2
   - ✅ `mobile.spec.ts` (6 tests) - Week 2

2. **Set up test infrastructure:**
   - Configure mobile viewports in `playwright.config.ts`
   - Add visual regression baseline screenshots
   - Set up accessibility testing with `@axe-core/playwright`

3. **Create test helpers:**
   ```typescript
   // helpers/test-utils.ts
   export async function loginAsTestUser(page: Page) {
     await page.goto('/');
     await page.fill('[data-testid="email"]', 'test@example.com');
     await page.fill('[data-testid="password"]', 'TestPass123!');
     await page.click('[data-testid="login-btn"]');
     await page.waitForURL('/');
   }
   
   export async function getBalance(page: Page): Promise<number> {
     const text = await page.locator('[data-testid="balance"]').textContent();
     return parseFloat(text.replace(/[$,]/g, ''));
   }
   ```

4. **Document test data needs:**
   - Create test accounts with various states (new user, power user, FIRE user)
   - Seed database with realistic scenarios
   - Document test data in `tests/README.md`

### For UX Designer (Me)

1. **Collaborate on edge cases:**
   - Review QA's test scenarios
   - Add UX perspective on error states
   - Design better error messages

2. **Create UX test checklist:**
   - Manual checklist for features without E2E coverage yet
   - Focus on subjective UX (confusing labels, unclear flows)

3. **User testing insights:**
   - Watch real users (if possible)
   - Identify pain points not caught by E2E tests
   - Update this document with findings

### For Product Team

1. **Prioritize UX improvements based on test findings:**
   - Fix P0 issues before adding new features
   - Allocate time for "UX debt" reduction

2. **Set quality bar:**
   - No deploys with failing P0 tests
   - UX review required for all new features

---

## 📝 Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-21 | Initial UX Test Flow Analysis created | UX Designer Subagent |

---

## 🤝 Collaboration Notes

**To QA Engineer:**
- This document provides **user journey context** for your technical tests
- Focus on implementing tests for "Critical User Journeys" first
- Use "UX Validation Points" tables to understand what users expect
- Mobile UX tests are critical (40%+ mobile users estimated)

**Key Takeaway:** E2E tests should validate not just "does it work?" but "does it feel right to users?"

**Questions for QA:**
1. Do existing tests cover the onboarding wizard? (I don't see them in auth.spec.ts)
2. How do we test mobile keyboards in Playwright? (inputmode attributes)
3. Should we add visual regression tests? (Playwright supports screenshots)

**Let's sync:**
- Review this document together
- Prioritize which tests to implement first
- Define test data needs
- Set up mobile testing environment

---

**END OF DOCUMENT**
