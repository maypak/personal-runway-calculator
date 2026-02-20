import { test, expect } from '@playwright/test';
import { signUpTestUser, generateTestEmail } from './helpers/test-utils';

/**
 * Onboarding & First-Time User Experience Tests
 * 
 * Based on UX Journey 1: First-Time User - Complete First Calculation
 * 
 * Critical UX Goals:
 * - User completes onboarding in <3 minutes
 * - No confusion on what to enter
 * - Clear feedback at every step
 * - Data loss prevention
 * 
 * Priority: P0 (User Activation Flow)
 */

test.describe('Onboarding Flow - First-Time User', () => {

  test('should complete full onboarding wizard successfully', async ({ page }) => {
    /**
     * Happy path: New user → Sign up → Onboarding wizard → First calculation
     * 
     * Expected Flow:
     * 1. Sign up
     * 2. Onboarding modal auto-appears
     * 3. Complete 4-step wizard
     * 4. See first runway calculation + confetti
     */
    
    // Step 1: Sign up as new user
    const email = await signUpTestUser(page);
    
    // Step 2: Onboarding wizard should auto-appear within 1 second
    const onboardingModal = page.locator('[data-testid="onboarding-modal"]');
    await expect(onboardingModal).toBeVisible({ timeout: 2000 });
    
    // Verify welcome screen
    await expect(page.getByText(/welcome/i)).toBeVisible();
    await expect(page.getByText(/get started/i)).toBeVisible();
    
    // Step 3a: Click "Get Started"
    await page.click('button:has-text("Get Started")');
    
    // Step 3b: Step 1 - Enter Current Savings
    await expect(page.getByText(/current savings/i)).toBeVisible();
    await page.fill('[name="onboarding-savings"]', '50000');
    await page.click('button:has-text("Next")');
    
    // Step 3c: Step 2 - Enter Monthly Expenses
    await expect(page.getByText(/monthly expenses/i)).toBeVisible();
    await page.fill('[name="onboarding-expenses"]', '3500');
    
    // Should show live preview: 50,000 / 3,500 ≈ 14 months
    // (Optional: verify live calculation)
    
    await page.click('button:has-text("Next")');
    
    // Step 3d: Step 3 - Breakdown (Fixed + Variable)
    await expect(page.getByText(/fixed expenses/i)).toBeVisible();
    await page.fill('[name="onboarding-fixed"]', '2000');
    await page.fill('[name="onboarding-variable"]', '1500');
    await page.click('button:has-text("Next")');
    
    // Step 4: Results screen
    await expect(page.getByText(/your runway/i)).toBeVisible();
    await expect(page.getByText(/14.*month/i)).toBeVisible(); // ~14 months
    
    // Confetti animation should appear
    await expect(page.locator('[data-testid="confetti-canvas"]')).toBeVisible({ timeout: 2000 });
    
    // Step 5: Complete onboarding
    await page.click('button:has-text("Go to Dashboard")');
    
    // Step 6: Verify redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    
    // Dashboard should show calculated runway
    await expect(page.getByText(/14.*month/i)).toBeVisible();
  });

  test('should prevent data loss when user tries to exit onboarding', async ({ page }) => {
    /**
     * Critical UX: User accidentally clicks outside modal or hits ESC
     * Should show confirmation dialog to prevent losing progress
     * 
     * Priority: P0 (Data Loss Prevention)
     */
    
    await signUpTestUser(page);
    
    // Wait for onboarding modal
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    
    // Start filling form
    await page.click('button:has-text("Get Started")');
    await page.fill('[name="onboarding-savings"]', '50000');
    await page.click('button:has-text("Next")');
    await page.fill('[name="onboarding-expenses"]', '3500');
    
    // User tries to close modal (click outside or ESC key)
    await page.keyboard.press('Escape');
    
    // Confirmation dialog should appear
    const confirmDialog = page.locator('[role="alertdialog"]');
    await expect(confirmDialog).toBeVisible({ timeout: 1000 });
    await expect(confirmDialog.getByText(/are you sure/i)).toBeVisible();
    await expect(confirmDialog.getByText(/progress will be lost/i)).toBeVisible();
    
    // User cancels (stays in onboarding)
    await page.click('button:has-text("Cancel")');
    
    // Modal should still be open with data preserved
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await expect(page.locator('[name="onboarding-expenses"]')).toHaveValue('3500');
  });

  test('should validate numeric inputs and show helpful errors', async ({ page }) => {
    /**
     * UX Validation: User enters invalid data
     * Should show clear, helpful error messages
     */
    
    await signUpTestUser(page);
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    
    // Test 1: Empty field
    await page.click('button:has-text("Next")');
    await expect(page.getByText(/required|please enter/i)).toBeVisible();
    
    // Test 2: Negative number
    await page.fill('[name="onboarding-savings"]', '-1000');
    await page.click('button:has-text("Next")');
    await expect(page.getByText(/must be positive|greater than zero/i)).toBeVisible();
    
    // Test 3: Non-numeric input
    await page.fill('[name="onboarding-savings"]', 'abc');
    await expect(page.getByText(/enter numbers only|invalid/i)).toBeVisible();
    
    // Test 4: Valid input (should advance)
    await page.fill('[name="onboarding-savings"]', '50000');
    await page.click('button:has-text("Next")');
    await expect(page.getByText(/monthly expenses/i)).toBeVisible(); // Advanced!
  });

  test('should show numeric keyboard on mobile devices', async ({ page, browserName }) => {
    /**
     * Mobile UX: Number input fields should trigger numeric keyboard
     * 
     * Checks for:
     * - inputmode="decimal" attribute
     * - type="number" (or equivalent)
     */
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await signUpTestUser(page);
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    
    // Check savings input has correct attributes
    const savingsInput = page.locator('[name="onboarding-savings"]');
    
    // Should have inputmode="decimal" for numeric keyboard
    await expect(savingsInput).toHaveAttribute('inputmode', 'decimal');
    
    // Should accept decimal numbers
    await savingsInput.fill('50000.50');
    await expect(savingsInput).toHaveValue('50000.50');
  });

  test('should parse and accept common currency formats', async ({ page }) => {
    /**
     * UX Convenience: User pastes "$50,000" or types "50k"
     * Should parse and accept (strip $ and commas)
     * 
     * Priority: P1 (Nice-to-have)
     */
    
    await signUpTestUser(page);
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    
    const savingsInput = page.locator('[name="onboarding-savings"]');
    
    // Test 1: Paste formatted currency
    await savingsInput.fill('$50,000.50');
    
    // Should auto-clean to "50000.50" (or accept as-is and parse)
    await page.click('button:has-text("Next")');
    
    // Should advance (not show error)
    await expect(page.getByText(/monthly expenses/i)).toBeVisible({ timeout: 2000 });
  });

  test('should handle browser back button gracefully', async ({ page }) => {
    /**
     * Edge case: User clicks browser back button during onboarding
     * 
     * Options:
     * A) Stay in modal (prevent navigation)
     * B) Show confirmation dialog
     * C) Allow back but preserve data in localStorage
     */
    
    await signUpTestUser(page);
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    
    // Enter data
    await page.fill('[name="onboarding-savings"]', '50000');
    await page.click('button:has-text("Next")');
    await page.fill('[name="onboarding-expenses"]', '3500');
    
    // Press browser back button
    await page.goBack();
    
    // Verify behavior (adjust based on actual implementation):
    // Option A: Modal still visible, data preserved
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    
    // OR Option B: Confirmation dialog appeared
    // await expect(page.locator('[role="alertdialog"]')).toBeVisible();
  });

  test('should show warning for zero savings', async ({ page }) => {
    /**
     * Edge case: User has $0 savings
     * Should complete onboarding but show warning
     */
    
    await signUpTestUser(page);
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    
    // Enter $0 savings
    await page.fill('[name="onboarding-savings"]', '0');
    await page.click('button:has-text("Next")');
    
    await page.fill('[name="onboarding-expenses"]', '3000');
    await page.click('button:has-text("Next")');
    
    await page.fill('[name="onboarding-fixed"]', '2000');
    await page.fill('[name="onboarding-variable"]', '1000');
    await page.click('button:has-text("Next")');
    
    // Results screen should show 0 days runway
    await expect(page.getByText(/0.*days?/i)).toBeVisible();
    
    // Warning message
    await expect(page.getByText(/no runway|build emergency fund/i)).toBeVisible();
  });

  test('should not show onboarding modal for returning users', async ({ page }) => {
    /**
     * Onboarding should ONLY appear for first-time users
     * Returning users should go straight to dashboard
     */
    
    // Create new user and complete onboarding
    await signUpTestUser(page);
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible();
    
    // Complete onboarding quickly
    await page.click('button:has-text("Get Started")');
    await page.fill('[name="onboarding-savings"]', '50000');
    await page.click('button:has-text("Next")');
    await page.fill('[name="onboarding-expenses"]', '3500');
    await page.click('button:has-text("Next")');
    await page.fill('[name="onboarding-fixed"]', '2000');
    await page.fill('[name="onboarding-variable"]', '1500');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Go to Dashboard")');
    
    // Logout and login again
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Login
    await page.getByPlaceholder('your@email.com').fill('qa-test@example.com'); // Use same email
    await page.getByPlaceholder('••••••••').fill('TestPass123!');
    await page.click('button:has-text("Sign In")');
    
    // Onboarding modal should NOT appear
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
  });

  test('should auto-focus on first input field for keyboard navigation', async ({ page }) => {
    /**
     * Accessibility & UX: First input should auto-focus
     * User can immediately start typing without clicking
     */
    
    await signUpTestUser(page);
    await page.click('button:has-text("Get Started")');
    
    // Savings input should auto-focus
    const savingsInput = page.locator('[name="onboarding-savings"]');
    await expect(savingsInput).toBeFocused({ timeout: 1000 });
    
    // User can type immediately
    await page.keyboard.type('50000');
    await expect(savingsInput).toHaveValue('50000');
  });

  test('should disable "Next" button until valid input provided', async ({ page }) => {
    /**
     * Prevents spam-clicking "Next" without entering data
     */
    
    await signUpTestUser(page);
    await page.click('button:has-text("Get Started")');
    
    const nextButton = page.locator('button:has-text("Next")');
    
    // Button should be disabled when field is empty
    await expect(nextButton).toBeDisabled();
    
    // Enable after valid input
    await page.fill('[name="onboarding-savings"]', '50000');
    await expect(nextButton).toBeEnabled();
    
    // Disable again if input is cleared
    await page.fill('[name="onboarding-savings"]', '');
    await expect(nextButton).toBeDisabled();
  });
});

test.describe('Onboarding - Mobile Specific UX', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  });

  test('should fit modal to mobile viewport without cut-off', async ({ page }) => {
    await signUpTestUser(page);
    
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible();
    
    // Modal should be ≤90% of viewport width (not full screen)
    const modalBox = await modal.boundingBox();
    expect(modalBox).not.toBeNull();
    
    if (modalBox) {
      expect(modalBox.width).toBeLessThanOrEqual(375 * 0.95); // ≤95% width
      expect(modalBox.width).toBeGreaterThan(375 * 0.85); // ≥85% width (reasonable)
    }
  });

  test('should have touch-friendly button sizes (44x44px minimum)', async ({ page }) => {
    /**
     * iOS guideline: Touch targets should be ≥44×44px
     */
    
    await signUpTestUser(page);
    await page.click('button:has-text("Get Started")');
    
    const nextButton = page.locator('button:has-text("Next")');
    const buttonBox = await nextButton.boundingBox();
    
    expect(buttonBox).not.toBeNull();
    
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      // Width can vary, but height is critical for tap accuracy
    }
  });

  test('should keep "Save" button visible when keyboard opens', async ({ page }) => {
    /**
     * Mobile UX: When keyboard appears, button should remain visible
     * (Sticky button or scrollable form)
     */
    
    await signUpTestUser(page);
    await page.click('button:has-text("Get Started")');
    
    // Focus input (simulates keyboard opening)
    await page.focus('[name="onboarding-savings"]');
    
    // Next button should still be visible
    const nextButton = page.locator('button:has-text("Next")');
    await expect(nextButton).toBeInViewport();
  });
});
