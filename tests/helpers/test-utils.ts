import { Page, expect } from '@playwright/test';

/**
 * Test Utilities for Personal Runway Calculator E2E Tests
 * Shared functions to reduce code duplication
 */

// ============================================
// Authentication Helpers
// ============================================

/**
 * Login as test user
 * Uses predefined test account credentials
 */
export async function loginAsTestUser(page: Page) {
  await page.goto('/');
  
  // Fill login form
  await page.getByPlaceholder('your@email.com').fill('qa-test@example.com');
  await page.getByPlaceholder('••••••••').fill('TestPass123!');
  
  // Submit
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 5000 });
}

/**
 * Sign up a new test user with unique email
 * Returns the generated email for reference
 */
export async function signUpTestUser(page: Page): Promise<string> {
  const timestamp = Date.now();
  const email = `qa-test-${timestamp}@example.com`;
  const password = 'TestPass123!';
  
  await page.goto('/');
  
  // Switch to sign up mode
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Fill form
  await page.getByPlaceholder('your@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  
  // Submit
  await page.getByRole('button', { name: /create account/i }).click();
  
  // Wait for redirect (to dashboard or email verification)
  await page.waitForTimeout(2000);
  
  return email;
}

/**
 * Logout current user
 */
export async function logout(page: Page) {
  // Look for user menu or logout button
  // Adjust selector based on actual UI
  await page.click('[data-testid="user-menu"]', { timeout: 5000 });
  await page.click('text=Logout');
  await page.waitForURL('**/');
}

// ============================================
// Financial Settings Helpers
// ============================================

export interface FinancialSettings {
  currentSavings?: number;
  lumpSum?: number;
  monthlyIncome?: number;
  incomeMonths?: number;
  monthlyFixed?: number;
  monthlyVariable?: number;
  startDate?: string; // YYYY-MM-DD format
}

/**
 * Set financial settings via UI
 * Navigates to settings page and fills form
 */
export async function setFinancialSettings(
  page: Page,
  settings: FinancialSettings
) {
  await page.goto('/settings');
  
  // Fill provided fields
  if (settings.currentSavings !== undefined) {
    await page.fill('[name="currentSavings"]', String(settings.currentSavings));
  }
  
  if (settings.lumpSum !== undefined) {
    await page.fill('[name="lumpSum"]', String(settings.lumpSum));
  }
  
  if (settings.monthlyIncome !== undefined) {
    await page.fill('[name="monthlyIncome"]', String(settings.monthlyIncome));
  }
  
  if (settings.incomeMonths !== undefined) {
    await page.fill('[name="incomeMonths"]', String(settings.incomeMonths));
  }
  
  if (settings.monthlyFixed !== undefined) {
    await page.fill('[name="monthlyFixed"]', String(settings.monthlyFixed));
  }
  
  if (settings.monthlyVariable !== undefined) {
    await page.fill('[name="monthlyVariable"]', String(settings.monthlyVariable));
  }
  
  if (settings.startDate) {
    await page.fill('[name="startDate"]', settings.startDate);
  }
  
  // Save
  await page.click('button[type="submit"]');
  
  // Wait for success message
  await expect(page.getByText(/saved successfully/i)).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Get current financial settings from UI
 * Returns object with all field values
 */
export async function getFinancialSettings(
  page: Page
): Promise<FinancialSettings> {
  await page.goto('/settings');
  
  return {
    currentSavings: parseFloat(
      (await page.locator('[name="currentSavings"]').inputValue()) || '0'
    ),
    lumpSum: parseFloat(
      (await page.locator('[name="lumpSum"]').inputValue()) || '0'
    ),
    monthlyIncome: parseFloat(
      (await page.locator('[name="monthlyIncome"]').inputValue()) || '0'
    ),
    incomeMonths: parseFloat(
      (await page.locator('[name="incomeMonths"]').inputValue()) || '0'
    ),
    monthlyFixed: parseFloat(
      (await page.locator('[name="monthlyFixed"]').inputValue()) || '0'
    ),
    monthlyVariable: parseFloat(
      (await page.locator('[name="monthlyVariable"]').inputValue()) || '0'
    ),
  };
}

// ============================================
// Expense Helpers
// ============================================

export interface ExpenseData {
  name: string;
  amount: number;
  category: string;
  memo?: string;
  date?: string; // YYYY-MM-DD
}

/**
 * Add a single expense
 */
export async function addExpense(page: Page, expense: ExpenseData) {
  await page.goto('/expenses');
  
  // Click "Add Expense" button
  await page.click('button:has-text("Add Expense")');
  
  // Wait for modal/form to appear
  await page.waitForSelector('[name="expenseName"]', { state: 'visible' });
  
  // Fill form
  await page.fill('[name="expenseName"]', expense.name);
  await page.fill('[name="amount"]', String(expense.amount));
  await page.selectOption('[name="category"]', expense.category);
  
  if (expense.memo) {
    await page.fill('[name="memo"]', expense.memo);
  }
  
  if (expense.date) {
    await page.fill('[name="date"]', expense.date);
  }
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Wait for success (expense appears in list or success toast)
  await expect(page.getByText(expense.name)).toBeVisible({ timeout: 3000 });
}

/**
 * Delete an expense by name
 */
export async function deleteExpense(page: Page, expenseName: string) {
  await page.goto('/expenses');
  
  // Find expense row
  const expenseRow = page.locator(`tr:has-text("${expenseName}")`);
  await expect(expenseRow).toBeVisible();
  
  // Click delete button
  await expenseRow.locator('button[aria-label="Delete"]').click();
  
  // Confirm deletion if modal appears
  const confirmButton = page.locator('button:has-text("Confirm")');
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }
  
  // Wait for expense to disappear
  await expect(expenseRow).not.toBeVisible({ timeout: 3000 });
}

// ============================================
// Dashboard Helpers
// ============================================

/**
 * Get runway value from dashboard (in months)
 * Parses "15 months" → 15
 */
export async function getRunwayMonths(page: Page): Promise<number> {
  await page.goto('/dashboard');
  
  // Find runway display (adjust selector as needed)
  const runwayText = await page
    .locator('[data-testid="runway-value"]')
    .textContent();
  
  if (!runwayText) throw new Error('Runway value not found');
  
  // Parse "15 months" or "1yr 3mo" to number
  const match = runwayText.match(/(\d+)\s*month/i);
  if (match) return parseInt(match[1], 10);
  
  throw new Error(`Could not parse runway: ${runwayText}`);
}

/**
 * Get available balance from dashboard
 * Parses "$50,000.50" → 50000.50
 */
export async function getAvailableBalance(page: Page): Promise<number> {
  await page.goto('/dashboard');
  
  const balanceText = await page
    .locator('[data-testid="available-balance"]')
    .textContent();
  
  if (!balanceText) throw new Error('Balance not found');
  
  // Remove $, commas
  const cleanText = balanceText.replace(/[$,]/g, '');
  return parseFloat(cleanText);
}

// ============================================
// Data Cleanup Helpers
// ============================================

/**
 * Delete all expenses for test cleanup
 */
export async function deleteAllExpenses(page: Page) {
  await page.goto('/expenses');
  
  // Check if expenses exist
  const deleteButtons = page.locator('button[aria-label="Delete"]');
  const count = await deleteButtons.count();
  
  // Delete all
  for (let i = 0; i < count; i++) {
    // Always click first button (since list shrinks after each delete)
    await deleteButtons.first().click();
    
    // Confirm if needed
    const confirmButton = page.locator('button:has-text("Confirm")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    await page.waitForTimeout(500); // Wait for delete to process
  }
}

/**
 * Reset financial settings to defaults
 */
export async function resetFinancialSettings(page: Page) {
  await setFinancialSettings(page, {
    currentSavings: 0,
    lumpSum: 0,
    monthlyIncome: 0,
    incomeMonths: 0,
    monthlyFixed: 0,
    monthlyVariable: 0,
  });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate unique test email
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  return `qa-test-${timestamp}@example.com`;
}

/**
 * Wait for network idle (no pending requests)
 */
export async function waitForNetworkIdle(page: Page, timeout = 3000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Check for console errors
 * Returns array of error messages
 */
export async function captureConsoleErrors(
  page: Page,
  callback: () => Promise<void>
): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await callback();
  
  return errors;
}
