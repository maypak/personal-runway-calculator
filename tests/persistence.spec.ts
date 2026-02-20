import { test, expect } from '@playwright/test';
import { loginAsTestUser, setFinancialSettings, addExpense } from './helpers/test-utils';

/**
 * Data Persistence & Regression Tests
 * 
 * CRITICAL: These tests prevent recurrence of the 2026-02-15 Supabase UPSERT bug
 * where financial settings were not persisting correctly after page refresh.
 * 
 * Priority: P0++ (Regression Prevention)
 */

test.describe('Data Persistence & Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('🚨 REGRESSION P0: All 6 financial settings persist after hard refresh', async ({ page }) => {
    /**
     * This test prevents recurrence of the 2026-02-15 Supabase UPSERT bug
     * 
     * Original Bug: When user saved financial settings, only currentSavings persisted.
     * Other 5 fields (lumpSum, monthlyIncome, incomeMonths, monthlyFixed, monthlyVariable)
     * were lost on page refresh due to Supabase 409 conflict errors.
     * 
     * Fix: Settings now use proper UPSERT with unique constraints
     * 
     * This Test: Ensures ALL 6 fields persist after hard refresh
     */
    
    // Step 1: Navigate to settings
    await page.goto('/settings');
    
    // Step 2: Fill ALL 6 fields with test data
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
    await expect(page.getByText(/saved successfully/i)).toBeVisible({ timeout: 5000 });
    
    // Step 4: HARD REFRESH (simulate user closing tab and returning)
    await page.reload({ waitUntil: 'networkidle' });
    
    // Step 5: CRITICAL ASSERTION - ALL 6 fields must persist (not just currentSavings!)
    await expect(page.locator('[name="currentSavings"]')).toHaveValue(testData.currentSavings);
    await expect(page.locator('[name="lumpSum"]')).toHaveValue(testData.lumpSum);
    await expect(page.locator('[name="monthlyIncome"]')).toHaveValue(testData.monthlyIncome);
    await expect(page.locator('[name="incomeMonths"]')).toHaveValue(testData.incomeMonths);
    await expect(page.locator('[name="monthlyFixed"]')).toHaveValue(testData.monthlyFixed);
    await expect(page.locator('[name="monthlyVariable"]')).toHaveValue(testData.monthlyVariable);
    
    // Step 6: Verify Dashboard calculations are correct (proves data actually persisted)
    await page.goto('/dashboard');
    
    // Expected Available Balance = 50k (savings) + 10k (lump) + (3k × 6 months income) = $78,000
    // Note: This also validates that the calculation uses persisted data, not just defaults
    await expect(page.getByText(/\$78,000|\$78k/)).toBeVisible({ timeout: 3000 });
    
    // Expected Monthly Burn = 2k (fixed) + 1.5k (variable) = $3,500
    await expect(page.getByText(/\$3,500|\$3.5k/)).toBeVisible({ timeout: 3000 });
  });

  test('🚨 REGRESSION P0: No Supabase 409 conflict errors in console', async ({ page }) => {
    /**
     * This test monitors for Supabase 409 (Conflict) errors that caused the original bug
     * 
     * Original Issue: Settings UPSERT was failing with:
     * - Error 409: Conflict (PGRST09)
     * - Or Error 406: Not Acceptable
     * 
     * Expected: NO console errors mentioning 409, Conflict, or PGRST
     */
    
    const consoleErrors: string[] = [];
    
    // Capture ALL console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Perform save operation (the action that previously triggered 409s)
    await page.goto('/settings');
    
    await page.fill('[name="currentSavings"]', '60000');
    await page.fill('[name="monthlyFixed"]', '2500');
    
    await page.click('button[type="submit"]');
    
    // Wait for async errors to appear
    await page.waitForTimeout(2000);
    
    // CRITICAL ASSERTION: No Supabase conflict errors
    const hasSupabaseConflictError = consoleErrors.some(err => 
      err.includes('409') || 
      err.includes('Conflict') || 
      err.includes('PGRST09') ||
      err.includes('406') ||
      err.includes('Not Acceptable')
    );
    
    if (hasSupabaseConflictError) {
      console.error('🚨 REGRESSION DETECTED: Supabase conflict errors present!');
      console.error('Console Errors:', consoleErrors);
    }
    
    expect(hasSupabaseConflictError).toBe(false);
  });

  test('should persist edited settings after page refresh', async ({ page }) => {
    // Set initial values
    await setFinancialSettings(page, {
      currentSavings: 40000,
      monthlyFixed: 1800,
      monthlyVariable: 1200,
    });
    
    // Edit values
    await page.goto('/settings');
    await page.fill('[name="currentSavings"]', '45000'); // Changed
    await page.fill('[name="monthlyFixed"]', '2000'); // Changed
    // monthlyVariable stays 1200
    
    await page.click('button[type="submit"]');
    await expect(page.getByText(/saved successfully/i)).toBeVisible();
    
    // Hard refresh
    await page.reload({ waitUntil: 'networkidle' });
    
    // Verify NEW values persist (not old ones!)
    await expect(page.locator('[name="currentSavings"]')).toHaveValue('45000');
    await expect(page.locator('[name="monthlyFixed"]')).toHaveValue('2000');
    await expect(page.locator('[name="monthlyVariable"]')).toHaveValue('1200');
  });

  test('should persist expense after page refresh', async ({ page }) => {
    // Add expense via helper
    await page.goto('/expenses');
    
    // Click "Add Expense" button
    await page.click('button:has-text("Add Expense")');
    
    // Wait for form
    await page.waitForSelector('[name="expenseName"]', { state: 'visible' });
    
    // Fill form
    await page.fill('[name="expenseName"]', 'Regression Test Expense');
    await page.fill('[name="amount"]', '123.45');
    await page.selectOption('[name="category"]', 'Food');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify added (should appear in expense list)
    await expect(page.getByText('Regression Test Expense')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/\$123\.45/)).toBeVisible();
    
    // Hard refresh
    await page.reload({ waitUntil: 'networkidle' });
    
    // CRITICAL: Expense should still exist after refresh
    await expect(page.getByText('Regression Test Expense')).toBeVisible();
    await expect(page.getByText(/\$123\.45/)).toBeVisible();
  });

  test('should persist deleted expense state after page refresh', async ({ page }) => {
    /**
     * Test that deletions persist (not just additions)
     * Ensures delete operations commit to database
     */
    
    // Add an expense
    await page.goto('/expenses');
    await page.click('button:has-text("Add Expense")');
    await page.fill('[name="expenseName"]', 'To Be Deleted');
    await page.fill('[name="amount"]', '99.99');
    await page.selectOption('[name="category"]', 'Shopping');
    await page.click('button[type="submit"]');
    
    // Verify it exists
    await expect(page.getByText('To Be Deleted')).toBeVisible();
    
    // Delete it
    const expenseRow = page.locator('tr:has-text("To Be Deleted")');
    await expenseRow.locator('button[aria-label="Delete"]').click();
    
    // Confirm deletion if modal appears
    const confirmButton = page.locator('button:has-text("Confirm")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Verify it's gone
    await expect(page.getByText('To Be Deleted')).not.toBeVisible({ timeout: 3000 });
    
    // Refresh page
    await page.reload();
    
    // CRITICAL: Expense should STILL be gone (deletion persisted)
    await expect(page.getByText('To Be Deleted')).not.toBeVisible();
  });

  test('should handle multiple rapid saves without data loss', async ({ page }) => {
    /**
     * Edge case: User clicks "Save" multiple times rapidly
     * Should not cause race conditions or data loss
     */
    
    await page.goto('/settings');
    
    // Fill form
    await page.fill('[name="currentSavings"]', '55000');
    await page.fill('[name="monthlyFixed"]', '2200');
    
    // Click Save 3 times rapidly (simulating impatient user or double-click)
    const saveButton = page.locator('button[type="submit"]');
    await saveButton.click();
    await saveButton.click();
    await saveButton.click();
    
    // Wait for saves to process
    await page.waitForTimeout(2000);
    
    // Refresh to verify final state
    await page.reload();
    
    // Values should be correct (not overwritten with stale data)
    await expect(page.locator('[name="currentSavings"]')).toHaveValue('55000');
    await expect(page.locator('[name="monthlyFixed"]')).toHaveValue('2200');
  });

  test('should persist settings across different browser tabs', async ({ browser }) => {
    /**
     * Multi-tab scenario: User edits settings in Tab A, switches to Tab B
     * Tab B should reflect latest changes after refresh
     */
    
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Login in both tabs
    await loginAsTestUser(page1);
    await loginAsTestUser(page2);
    
    // Tab 1: Set values
    await setFinancialSettings(page1, {
      currentSavings: 70000,
      monthlyFixed: 2800,
    });
    
    // Tab 2: Navigate to settings and refresh
    await page2.goto('/settings');
    await page2.reload();
    
    // Tab 2 should show values from Tab 1
    await expect(page2.locator('[name="currentSavings"]')).toHaveValue('70000');
    await expect(page2.locator('[name="monthlyFixed"]')).toHaveValue('2800');
    
    // Cleanup
    await context.close();
  });
});
