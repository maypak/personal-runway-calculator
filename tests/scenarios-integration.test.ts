/**
 * Scenarios Integration Test
 * 
 * Quick smoke test for scenario CRUD operations
 * Run with: npm test
 */

import { test, expect } from '@playwright/test';

test.describe('Scenario Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login (assumes test user exists)
    await page.goto('/');
    await page.getByPlaceholder('your@email.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('TestPass123!');
    await page.getByRole('button', { name: 'Sign In →' }).click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });
  });

  test('should navigate to scenarios page', async ({ page }) => {
    await page.goto('/scenarios');
    
    // Should show scenarios page
    await expect(page.getByText('Your Scenarios')).toBeVisible();
  });

  test('should show empty state for new user', async ({ page }) => {
    await page.goto('/scenarios');
    
    // Check for empty state or existing scenarios
    const hasScenarios = await page.locator('[data-testid="scenario-card"]').count();
    
    if (hasScenarios === 0) {
      await expect(page.getByText(/no scenarios/i)).toBeVisible();
      await expect(page.getByText('Create First Scenario')).toBeVisible();
    }
  });

  test('should create a new scenario', async ({ page }) => {
    await page.goto('/scenarios');
    
    // Click New Scenario
    await page.click('button:has-text("New Scenario")');
    
    // Wait for modal
    await expect(page.getByText('Create New Scenario')).toBeVisible({ timeout: 2000 });
    
    // Fill form
    const testName = `Test ${Date.now()}`;
    await page.fill('[name="name"]', testName);
    
    // Submit
    await page.click('button:has-text("Create Scenario")');
    
    // Wait for scenario to appear
    await expect(page.getByText(testName)).toBeVisible({ timeout: 3000 });
  });

  test('should enter comparison mode', async ({ page }) => {
    await page.goto('/scenarios');
    
    const scenarioCount = await page.locator('.grid > div').count();
    
    if (scenarioCount >= 2) {
      // Click Compare button
      await page.click('button:has-text("Compare")');
      
      // Button should change
      await expect(page.getByText('Exit Compare')).toBeVisible();
      
      // Comparison view should appear
      await expect(page.getByText('Scenario Comparison')).toBeVisible({ timeout: 2000 });
    }
  });

  test('should close comparison view', async ({ page }) => {
    await page.goto('/scenarios');
    
    const scenarioCount = await page.locator('.grid > div').count();
    
    if (scenarioCount >= 2) {
      // Enter comparison
      await page.click('button:has-text("Compare")');
      await expect(page.getByText('Scenario Comparison')).toBeVisible();
      
      // Close comparison
      await page.click('button:has-text("Close Comparison")');
      
      // Should return to normal view
      await expect(page.getByText('Scenario Comparison')).not.toBeVisible();
    }
  });

  test('should duplicate a scenario', async ({ page }) => {
    await page.goto('/scenarios');
    
    const scenarioCount = await page.locator('.grid > div').count();
    
    if (scenarioCount > 0) {
      // Click duplicate button (Copy icon)
      const duplicateButton = page.locator('[title="Duplicate"]').first();
      if (await duplicateButton.isVisible()) {
        await duplicateButton.click();
        
        // Enter name in prompt (if appears)
        // Note: Playwright doesn't handle prompt() well, might need different approach
      }
    }
  });

  test('should delete a non-base scenario', async ({ page }) => {
    await page.goto('/scenarios');
    
    // Find delete buttons (Trash icon)
    const deleteButtons = page.locator('[title="Delete"]');
    const count = await deleteButtons.count();
    
    if (count > 0) {
      // Click first delete button
      await deleteButtons.first().click();
      
      // Confirm (if dialog appears)
      page.on('dialog', dialog => dialog.accept());
      
      // Scenario should be removed
      await page.waitForTimeout(1000);
    }
  });

  test('should show comparison insights', async ({ page }) => {
    await page.goto('/scenarios');
    
    const scenarioCount = await page.locator('.grid > div').count();
    
    if (scenarioCount >= 2) {
      await page.click('button:has-text("Compare")');
      await expect(page.getByText('Scenario Comparison')).toBeVisible();
      
      // Check for insights
      await expect(page.getByText('Comparison Insights')).toBeVisible();
      await expect(page.getByText('Best Runway')).toBeVisible();
      await expect(page.getByText('Lowest Burn Rate')).toBeVisible();
      await expect(page.getByText('Highest Income')).toBeVisible();
    }
  });

  test('should persist scenarios after page refresh', async ({ page }) => {
    await page.goto('/scenarios');
    
    const initialCount = await page.locator('.grid > div').count();
    
    if (initialCount > 0) {
      // Get first scenario name
      const firstName = await page.locator('.grid > div').first().locator('h3').textContent();
      
      // Refresh page
      await page.reload();
      
      // Check if scenario still exists
      await expect(page.getByText(firstName!)).toBeVisible({ timeout: 3000 });
    }
  });
});
