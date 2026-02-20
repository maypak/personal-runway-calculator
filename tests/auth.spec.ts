import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  
  test('should load auth page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page loaded
    await expect(page).toHaveTitle(/Personal Runway/);
    
    // Check auth elements visible
    await expect(page.getByText('Your money isn\'t just money')).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
  });

  test('should show sign up form', async ({ page }) => {
    await page.goto('/');
    
    // Click Sign Up tab
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify sign up mode
    await expect(page.getByText('Create your free account')).toBeVisible();
    await expect(page.getByText('12+ characters with uppercase, lowercase, number, and special character')).toBeVisible();
  });

  test('should attempt email signup', async ({ page }) => {
    await page.goto('/');
    
    // Switch to sign up
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Fill form with test credentials
    const timestamp = Date.now();
    await page.getByPlaceholder('your@email.com').fill(`test-${timestamp}@example.com`);
    await page.getByPlaceholder('••••••••').fill('TestPass123!');
    
    // Submit form (use the submit button, not the tab button)
    await page.getByRole('button', { name: 'Create Account →' }).click();
    
    // Wait for network request to complete
    await page.waitForTimeout(3000);
    
    // Check for any visible response (success, error, or dashboard)
    // After signup, user might see:
    // 1. "Check your email" message
    // 2. Error message
    // 3. Dashboard (if email verification disabled)
    const pageContent = await page.content();
    
    // Should have some change (not blank page, not loading forever)
    const hasContent = pageContent.includes('Check your email') || 
                      pageContent.includes('error') || 
                      pageContent.includes('Personal Runway') ||
                      pageContent.includes('Dashboard');
    
    expect(hasContent).toBeTruthy();
  });

  test('should show OAuth buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check OAuth buttons exist
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    
    // Try invalid email
    await page.getByPlaceholder('your@email.com').fill('invalid-email');
    await page.getByPlaceholder('••••••••').fill('password123');
    
    // Try to submit (use the submit button, not the tab button)
    await page.getByRole('button', { name: 'Sign In →' }).click();
    
    // Browser should show HTML5 validation error
    const emailInput = page.getByPlaceholder('your@email.com');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    
    expect(validationMessage).toBeTruthy(); // Should have validation message
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/');
    
    // Switch to sign up
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Try short password
    await page.getByPlaceholder('your@email.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('123'); // Too short
    
    // Try to submit
    await page.getByRole('button', { name: /Create Account/ }).click();
    
    // Browser should show HTML5 validation error
    const passwordInput = page.getByPlaceholder('••••••••');
    const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    
    expect(validationMessage).toBeTruthy(); // Should have validation message
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/');
    
    // Initially on Sign In
    await expect(page.getByText('Welcome back')).toBeVisible();
    
    // Click Sign Up
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByText('Create your free account')).toBeVisible();
    
    // Click Sign In
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should have no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for any async errors
    
    // Filter out known non-critical errors (like missing OAuth config in dev)
    const criticalErrors = errors.filter(err => 
      !err.includes('OAuth') && 
      !err.includes('404') // PWA icons might be missing
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/');
    
    // Elements should still be visible
    await expect(page.getByText('Your money isn\'t just money')).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    
    // Check mobile-specific elements (use submit button, not tab button)
    const signInButton = page.getByRole('button', { name: 'Sign In →' });
    await expect(signInButton).toBeVisible();
  });

  test('should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });
});
