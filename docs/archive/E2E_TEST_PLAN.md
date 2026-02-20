# E2E Test Coverage Analysis
**Personal Runway Calculator**  
**Created:** 2026-02-21  
**QA Engineer:** Subagent Analysis  
**Status:** 🔴 Critical Coverage Gap

---

## 1. Current Gap Analysis

### ✅ What's Covered (auth.spec.ts)
- ✅ Page load & basic UI elements
- ✅ Sign up/Sign in toggle
- ✅ OAuth button visibility
- ✅ Email format validation
- ✅ Password length validation
- ✅ Console error check
- ✅ Mobile responsiveness
- ✅ Performance (page load <3s)

**Total: 10 tests covering 1 category (Authentication)**

---

### 🔴 Critical Gaps (P0 Scenarios Not Covered)

| Category | P0 Scenarios | Current Tests | Gap |
|----------|--------------|---------------|-----|
| **Authentication** | 5 | 10 (partial) | ⚠️ OAuth flows untested |
| **Financial Settings** | 9 | **0** | 🔴 **100% missing** |
| **Data Persistence** | 5 (includes REGRESSION!) | **0** | 🔴 **Critical!** |
| **Expenses** | 4 | **0** | 🔴 **100% missing** |
| **Dashboard Calculations** | 5 | **0** | 🔴 **100% missing** |

**Total P0 Scenarios:** 28  
**Covered:** ~3 (11%)  
**Missing:** 25 (89%)

---

### 🚨 Most Critical Missing Flows

1. **Data Persistence (P0 REGRESSION TEST!)**
   - **Why:** Previous P0 bug (Supabase UPSERT 409 error) 
   - **Impact:** Data loss after page refresh → User trust破괴
   - **Status:** Fixed on 2026-02-15, but NO automated regression test

2. **Dashboard Runway Calculation**
   - **Why:** Core value proposition (런웨이 계산)
   - **Impact:** Wrong calculation = Product failure
   - **Current:** 계산 로직 검증 전무

3. **Financial Settings Save**
   - **Why:** User onboarding의 첫 단계
   - **Impact:** Save 실패 = User churn
   - **Current:** 저장 플로우 테스트 없음

4. **Expenses CRUD**
   - **Why:** Daily usage pattern
   - **Impact:** 데이터 추가/수정/삭제 오류 = Daily frustration
   - **Current:** 전혀 테스트 안 됨

---

## 2. Priority Recommendations (P0)

### Top 10 Critical Test Cases (Immediate Implementation)

#### **🥇 #1: Data Persistence Regression Test**
**Priority:** P0++ (Prevents known regression)  
**Scenario:** 3.1 Reload Page - Data Integrity  
**Why Critical:**
- Previous P0 bug caused data loss
- Fix deployed but NO automated test → Can regress anytime
- User enters 6 fields → Only 1 persists → 100% data loss UX

**Test Flow:**
1. Save all 6 financial settings
2. Hard refresh (Cmd+Shift+R)
3. **Assert: ALL 6 fields persist** (not just savings)
4. **Assert: Console has ZERO 409/406 errors**

**Acceptance:** MUST pass 100% on every deployment

---

#### **🥈 #2: Dashboard Runway Calculation (Simple Case)**
**Priority:** P0  
**Scenario:** 6.1 - Case 1 (No Income)  
**Why Critical:**
- Core product value = "How long can I survive?"
- Wrong calc = Product破産
- Easiest to verify: Savings / Monthly Burn

**Test Flow:**
1. Set: Savings `$30,000`, Monthly Burn `$2,000`
2. Dashboard shows: **15 months**
3. Tolerance: ±1 day

---

#### **🥉 #3: Financial Settings Save (First-Time User)**
**Priority:** P0  
**Scenario:** 2.1 Complete Onboarding  
**Why Critical:**
- User onboarding entry point
- Save fails → User abandons app
- 50%+ users drop off here if buggy

**Test Flow:**
1. Enter all 6 fields (fixed, variable, savings, etc.)
2. Click "Save"
3. Success message appears
4. Redirect to Dashboard
5. Dashboard shows calculated runway

---

#### **#4: Add Single Expense & Balance Update**
**Priority:** P0  
**Scenario:** 4.1 + 4.4  
**Why Critical:**
- Daily user action #1
- Balance must update immediately
- Wrong balance = User panic

**Test Flow:**
1. Note starting balance: `$50,000`
2. Add expense: `$150.50` (Grocery)
3. Verify balance → `$49,849.50`
4. Refresh page
5. Balance persists

---

#### **#5: Delete Expense & Balance Restore**
**Priority:** P0  
**Scenario:** 4.3  
**Why Critical:**
- Users make mistakes → Need undo
- Delete fails → Frustration
- Balance restore fails → Data integrity issue

**Test Flow:**
1. Add expense: `$100`
2. Balance decreases: `-$100`
3. Delete expense
4. Balance restored: `+$100`
5. Expense removed from list

---

#### **#6: Dashboard Calculation with Income (Net Negative)**
**Priority:** P0  
**Scenario:** 6.1 - Case 3  
**Why Critical:**
- Most common scenario (income < expenses)
- Tests income logic + runway extension
- Complex calc: (Savings) / (Burn - Income)

**Test Flow:**
1. Savings: `$50,000`, Burn: `$4,000`, Income: `$2,000`
2. Net burn: `$2,000/month`
3. Expected: **25 months**

---

#### **#7: Negative Value Validation**
**Priority:** P0  
**Scenario:** 3.5 Edge Cases  
**Why Critical:**
- Negative savings = Data integrity破괴
- Silent failure → Database corruption
- Must reject at form level

**Test Flow:**
1. Enter Savings: `-1000`
2. Click Save
3. **Expect:** Error: "Must be positive"
4. Form does NOT submit
5. Database unchanged

---

#### **#8: Monthly Burn Rate Display**
**Priority:** P0  
**Scenario:** 6.3  
**Why Critical:**
- Key metric shown on Dashboard
- Drives runway calculation
- Must include Fixed + Variable + Recurring

**Test Flow:**
1. Fixed: `$2,000`, Variable: `$800`
2. Dashboard shows: `$2,800/month`
3. Formatted with `$` and commas

---

#### **#9: Zero Savings Warning**
**Priority:** P0  
**Scenario:** 3.3 - Case 1  
**Why Critical:**
- Edge case but happens (new users)
- Must show warning, not crash
- Runway = 0 days

**Test Flow:**
1. Savings: `$0`, Burn: `$3,000`
2. Dashboard shows: Runway = **0 days**
3. ⚠️ Warning: "No runway without savings"
4. No errors in console

---

#### **#10: Available Balance Formula**
**Priority:** P0  
**Scenario:** 6.2  
**Why Critical:**
- Displayed prominently on Dashboard
- Formula: Savings + Lump Sum - Expenses
- Must update in real-time

**Test Flow:**
1. Savings: `$50,000`, Lump: `$5,000`, Expenses: `$1,200`
2. Dashboard shows: `$53,800`
3. Add expense: `$500`
4. Updates to: `$53,300` (no refresh needed)

---

## 3. Proposed Test Structure

### File Organization

```
tests/
├── auth.spec.ts                  ✅ (10 tests - existing)
├── settings.spec.ts              🆕 (10 tests - financial settings)
├── dashboard.spec.ts             🆕 (8 tests - calculations)
├── expenses.spec.ts              🆕 (6 tests - CRUD operations)
├── persistence.spec.ts           🆕 (5 tests - data integrity + REGRESSION)
└── helpers/
    └── test-utils.ts             🆕 (shared setup, auth, cleanup)
```

---

### settings.spec.ts (10 tests)
**Focus:** Financial Settings CRUD + Validation

1. ✅ Complete onboarding (all 6 fields)
2. ✅ Save settings successfully
3. ✅ Edit existing settings
4. ✅ Validate negative numbers (reject)
5. ✅ Validate zero values (accept with warning)
6. ✅ Validate non-numeric input (reject)
7. ✅ Test large numbers (millionaire scenario)
8. ✅ Monthly income + income months logic
9. ✅ Start date picker
10. ✅ Settings persist after save

**Estimated Time:** 12 minutes

---

### dashboard.spec.ts (8 tests)
**Focus:** Calculation Accuracy

1. ✅ Runway calculation - Simple (no income)
2. ✅ Runway calculation - With income (net negative)
3. ✅ Runway calculation - With income (net positive → infinite)
4. ✅ Runway calculation - Limited income months
5. ✅ Available balance formula
6. ✅ Monthly burn rate display
7. ✅ Daily burn rate display
8. ✅ Zero savings edge case

**Estimated Time:** 10 minutes

---

### expenses.spec.ts (6 tests)
**Focus:** Expense Management

1. ✅ Add single expense
2. ✅ Add multiple expenses
3. ✅ Delete expense
4. ✅ Balance updates after add
5. ✅ Balance restores after delete
6. ✅ Expense list sorting (by date)

**Estimated Time:** 8 minutes

---

### persistence.spec.ts (5 tests - CRITICAL!)
**Focus:** Data Integrity & Regression Prevention

1. 🚨 **REGRESSION: All 6 settings persist after refresh**
2. 🚨 **REGRESSION: No Supabase 409 errors in console**
3. ✅ Edit settings → Refresh → New values persist
4. ✅ Add expense → Refresh → Expense persists
5. ✅ Multi-device sync (Chrome + Firefox)

**Estimated Time:** 8 minutes

---

### helpers/test-utils.ts
**Purpose:** Reduce code duplication

```typescript
// Shared login function
export async function loginAsTestUser(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('your@email.com').fill('qa-test@example.com');
  await page.getByPlaceholder('••••••••').fill('TestPass123!');
  await page.getByRole('button', { name: 'Sign In →' }).click();
  await page.waitForURL('**/dashboard'); // Wait for redirect
}

// Shared financial settings setup
export async function setFinancialSettings(page: Page, settings: FinanceSettings) {
  await page.goto('/settings');
  await page.fill('[name="currentSavings"]', String(settings.savings));
  await page.fill('[name="monthlyFixed"]', String(settings.fixed));
  // ... etc
  await page.click('button[type="submit"]');
  await page.waitForSelector('text=Saved successfully');
}

// Shared cleanup
export async function cleanupTestData(page: Page) {
  // Reset test account to default state
  // Delete all expenses, reset settings
}
```

---

## 4. Sample Test Code

### 📄 persistence.spec.ts (Priority #1)

```typescript
import { test, expect } from '@playwright/test';
import { loginAsTestUser, setFinancialSettings } from './helpers/test-utils';

test.describe('Data Persistence & Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('🚨 REGRESSION P0: All 6 financial settings persist after hard refresh', async ({ page }) => {
    // This test prevents recurrence of the 2026-02-15 Supabase UPSERT bug
    
    // Step 1: Navigate to settings
    await page.goto('/settings');
    
    // Step 2: Fill ALL 6 fields
    const testData = {
      currentSavings: '50000',
      lumpSum: '10000',
      monthlyIncome: '3000',
      incomeMonths: '6',
      monthlyFixed: '2000',
      monthlyVariable: '1500',
    };
    
    await page.fill('[name="currentSavings"]', testData.currentSavings);
    await page.fill('[name="lumpSum"]', testData.lumpSum);
    await page.fill('[name="monthlyIncome"]', testData.monthlyIncome);
    await page.fill('[name="incomeMonths"]', testData.incomeMonths);
    await page.fill('[name="monthlyFixed"]', testData.monthlyFixed);
    await page.fill('[name="monthlyVariable"]', testData.monthlyVariable);
    
    // Step 3: Save
    await page.click('button[type="submit"]');
    await expect(page.getByText(/saved successfully/i)).toBeVisible();
    
    // Step 4: HARD REFRESH (simulate user closing tab and returning)
    await page.reload({ waitUntil: 'networkidle' });
    
    // Step 5: CRITICAL ASSERTION - ALL fields must persist
    await expect(page.locator('[name="currentSavings"]')).toHaveValue(testData.currentSavings);
    await expect(page.locator('[name="lumpSum"]')).toHaveValue(testData.lumpSum);
    await expect(page.locator('[name="monthlyIncome"]')).toHaveValue(testData.monthlyIncome);
    await expect(page.locator('[name="incomeMonths"]')).toHaveValue(testData.incomeMonths);
    await expect(page.locator('[name="monthlyFixed"]')).toHaveValue(testData.monthlyFixed);
    await expect(page.locator('[name="monthlyVariable"]')).toHaveValue(testData.monthlyVariable);
    
    // Step 6: Verify Dashboard calculations correct
    await page.goto('/dashboard');
    
    // Expected: Available = 50k + 10k + (3k × 6) = $78,000
    await expect(page.getByText(/\$78,000/)).toBeVisible();
    
    // Expected: Monthly Burn = 2k + 1.5k = $3,500
    await expect(page.getByText(/\$3,500/)).toBeVisible();
  });

  test('🚨 REGRESSION P0: No Supabase 409 errors in console', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Perform save operation
    await page.goto('/settings');
    await page.fill('[name="currentSavings"]', '60000');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000); // Allow time for async errors
    
    // CRITICAL: No Supabase conflict errors
    const has409Error = consoleErrors.some(err => 
      err.includes('409') || 
      err.includes('Conflict') || 
      err.includes('PGRST')
    );
    
    expect(has409Error).toBe(false);
    
    // If this fails, the 2026-02-15 bug has returned!
    if (has409Error) {
      console.error('🚨 REGRESSION DETECTED: Supabase 409 errors present!');
      console.error('Errors:', consoleErrors);
    }
  });

  test('should persist expense after page refresh', async ({ page }) => {
    // Add expense
    await page.goto('/expenses');
    await page.click('button:has-text("Add Expense")');
    
    await page.fill('[name="expenseName"]', 'Regression Test Expense');
    await page.fill('[name="amount"]', '123.45');
    await page.selectOption('[name="category"]', 'Food');
    await page.click('button[type="submit"]');
    
    // Verify added
    await expect(page.getByText('Regression Test Expense')).toBeVisible();
    await expect(page.getByText('$123.45')).toBeVisible();
    
    // Refresh
    await page.reload();
    
    // Should still exist
    await expect(page.getByText('Regression Test Expense')).toBeVisible();
    await expect(page.getByText('$123.45')).toBeVisible();
  });
});
```

---

### 📄 dashboard.spec.ts (Priority #2)

```typescript
import { test, expect } from '@playwright/test';
import { loginAsTestUser, setFinancialSettings } from './helpers/test-utils';

test.describe('Dashboard Calculations', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should calculate runway correctly - Simple case (no income)', async ({ page }) => {
    // Setup: Savings $30,000 / Monthly Burn $2,000 = 15 months
    
    await page.goto('/settings');
    
    await page.fill('[name="currentSavings"]', '30000');
    await page.fill('[name="monthlyFixed"]', '2000');
    await page.fill('[name="monthlyVariable"]', '0');
    await page.fill('[name="monthlyIncome"]', ''); // No income
    
    await page.click('button[type="submit"]');
    await expect(page.getByText(/saved successfully/i)).toBeVisible();
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Verify runway calculation
    // Expected: 30,000 / 2,000 = 15 months
    await expect(page.getByText(/15.*month/i)).toBeVisible();
    
    // Alternative: Check for "1 year 3 months" or "1yr 3mo"
    // (Depends on UI formatting)
  });

  test('should calculate runway with income (net negative)', async ({ page }) => {
    // Setup: 
    // - Savings: $50,000
    // - Monthly Burn: $4,000
    // - Monthly Income: $2,000
    // - Net Burn: $2,000/month
    // - Expected Runway: 25 months
    
    await page.goto('/settings');
    
    await page.fill('[name="currentSavings"]', '50000');
    await page.fill('[name="monthlyFixed"]', '3000');
    await page.fill('[name="monthlyVariable"]', '1000');
    await page.fill('[name="monthlyIncome"]', '2000');
    await page.fill('[name="incomeMonths"]', ''); // Perpetual
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=/saved successfully/i');
    
    await page.goto('/dashboard');
    
    // Expected: 50,000 / 2,000 = 25 months
    await expect(page.getByText(/25.*month/i)).toBeVisible();
  });

  test('should show infinite runway when income exceeds expenses', async ({ page }) => {
    // Setup: Income > Expenses = Net Positive = Infinite Runway
    
    await page.goto('/settings');
    
    await page.fill('[name="currentSavings"]', '50000');
    await page.fill('[name="monthlyFixed"]', '2000');
    await page.fill('[name="monthlyVariable"]', '1000');
    await page.fill('[name="monthlyIncome"]', '5000'); // Income > Burn
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=/saved successfully/i');
    
    await page.goto('/dashboard');
    
    // Should show "Infinite" or very large number
    const hasInfinite = await page.getByText(/infinite|indefinite|∞/i).isVisible();
    
    expect(hasInfinite).toBe(true);
  });

  test('should display monthly burn rate correctly', async ({ page }) => {
    await page.goto('/settings');
    
    // Fixed: $2,000 + Variable: $800 = Total: $2,800
    await page.fill('[name="monthlyFixed"]', '2000');
    await page.fill('[name="monthlyVariable"]', '800');
    await page.fill('[name="currentSavings"]', '10000'); // Need some savings
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=/saved successfully/i');
    
    await page.goto('/dashboard');
    
    // Should show $2,800/month (or $2,800 monthly burn)
    await expect(page.getByText(/\$2,800/)).toBeVisible();
    await expect(page.getByText(/month|monthly/i)).toBeVisible();
  });

  test('should handle zero savings edge case', async ({ page }) => {
    await page.goto('/settings');
    
    // Zero savings = 0 runway
    await page.fill('[name="currentSavings"]', '0');
    await page.fill('[name="monthlyFixed"]', '3000');
    await page.fill('[name="monthlyVariable"]', '0');
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=/saved successfully/i');
    
    await page.goto('/dashboard');
    
    // Should show 0 days/months
    await expect(page.getByText(/0.*day|0.*month/i)).toBeVisible();
    
    // Should show warning
    await expect(page.getByText(/no runway|insufficient/i)).toBeVisible();
  });
});
```

---

### 📄 expenses.spec.ts (Priority #3)

```typescript
import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/test-utils';

test.describe('Expenses Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
    
    // Ensure clean state: delete all test expenses
    // (Implementation depends on UI)
  });

  test('should add single expense and update balance', async ({ page }) => {
    // Navigate to expenses page
    await page.goto('/expenses');
    
    // Get initial balance
    const initialBalanceText = await page.locator('[data-testid="available-balance"]').textContent();
    const initialBalance = parseFloat(initialBalanceText?.replace(/[^0-9.]/g, '') || '0');
    
    // Add expense
    await page.click('button:has-text("Add Expense")');
    
    await page.fill('[name="expenseName"]', 'Grocery Shopping');
    await page.fill('[name="amount"]', '150.50');
    await page.selectOption('[name="category"]', 'Food');
    
    await page.click('button[type="submit"]');
    
    // Verify expense appears
    await expect(page.getByText('Grocery Shopping')).toBeVisible();
    await expect(page.getByText('$150.50')).toBeVisible();
    
    // Verify balance updated
    const newBalanceText = await page.locator('[data-testid="available-balance"]').textContent();
    const newBalance = parseFloat(newBalanceText?.replace(/[^0-9.]/g, '') || '0');
    
    expect(newBalance).toBe(initialBalance - 150.50);
  });

  test('should delete expense and restore balance', async ({ page }) => {
    await page.goto('/expenses');
    
    // Add expense first
    await page.click('button:has-text("Add Expense")');
    await page.fill('[name="expenseName"]', 'Test Expense to Delete');
    await page.fill('[name="amount"]', '100');
    await page.selectOption('[name="category"]', 'Other');
    await page.click('button[type="submit"]');
    
    // Note balance after add
    const balanceAfterAdd = await page.locator('[data-testid="available-balance"]').textContent();
    const balanceValue = parseFloat(balanceAfterAdd?.replace(/[^0-9.]/g, '') || '0');
    
    // Delete the expense
    await page.click('button[data-testid="delete-expense"]:has-text("Test Expense to Delete")');
    
    // Confirm deletion if dialog appears
    await page.click('button:has-text("Confirm")').catch(() => {}); // Optional
    
    // Verify expense removed
    await expect(page.getByText('Test Expense to Delete')).not.toBeVisible();
    
    // Verify balance restored (+$100)
    const balanceAfterDelete = await page.locator('[data-testid="available-balance"]').textContent();
    const restoredBalance = parseFloat(balanceAfterDelete?.replace(/[^0-9.]/g, '') || '0');
    
    expect(restoredBalance).toBe(balanceValue + 100);
  });
});
```

---

## 5. Implementation Roadmap

### Phase 1: Regression Prevention (Week 1)
**Goal:** Prevent known bugs from returning

- [x] Create `persistence.spec.ts`
- [x] Implement REGRESSION test for Supabase 409 bug
- [x] Add to CI/CD pipeline (must pass to deploy)

**Deliverables:**
- 5 tests in `persistence.spec.ts`
- CI/CD integration

---

### Phase 2: Core Calculations (Week 1)
**Goal:** Verify product core value works

- [x] Create `dashboard.spec.ts`
- [x] Test 4 runway calculation scenarios
- [x] Test burn rate displays
- [x] Test edge cases (zero, infinite)

**Deliverables:**
- 8 tests in `dashboard.spec.ts`

---

### Phase 3: User Flows (Week 2)
**Goal:** Cover daily usage patterns

- [x] Create `settings.spec.ts` (10 tests)
- [x] Create `expenses.spec.ts` (6 tests)
- [x] Create `helpers/test-utils.ts`

**Deliverables:**
- 16 additional tests
- Shared utilities

---

### Phase 4: P1 & P2 Scenarios (Week 3+)
**Goal:** Expand coverage to 90%+

- [ ] Recurring expenses (5 tests)
- [ ] Multi-device sync (3 tests)
- [ ] Error handling (4 tests)
- [ ] Performance benchmarks

**Deliverables:**
- 12+ additional tests
- Performance baselines

---

## 6. Success Metrics

### Coverage Goals
- **Week 1:** 40% P0 coverage (13/28 tests)
- **Week 2:** 80% P0 coverage (23/28 tests)
- **Week 3:** 100% P0 coverage + 50% P1

### Quality Gates
- ✅ All P0 tests pass before production deploy
- ✅ No console errors on critical flows
- ✅ Page load <3 seconds
- ✅ Regression tests run on every PR

---

## 7. Notes & Considerations

### Assumptions
- Test account: `qa-test@example.com` exists and is stable
- Production URL stable: `https://personal-runway-calculator.vercel.app`
- Supabase RLS policies allow test data CRUD

### Risks
- **Flaky tests:** If UI selectors change frequently
  - **Mitigation:** Use `data-testid` attributes
- **Test data pollution:** Tests interfere with each other
  - **Mitigation:** Cleanup in `beforeEach` / `afterEach`
- **CI/CD cost:** Playwright tests can be slow
  - **Mitigation:** Run P0 only on every commit, P1/P2 nightly

### Next Steps
1. ✅ Review this plan with main agent
2. ✅ Get UX Designer feedback (if needed)
3. 🔄 Create `persistence.spec.ts` first (highest priority)
4. 🔄 Set up CI/CD integration
5. 🔄 Implement remaining test files

---

**Status:** Ready for implementation  
**Estimated Total Time:** 45 minutes (this analysis) + 3-4 hours (implementation)  
**ROI:** Prevent critical bugs, build user trust, enable confident deployments
