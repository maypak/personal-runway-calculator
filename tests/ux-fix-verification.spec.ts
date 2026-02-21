import { test, expect } from '@playwright/test';

test.describe('TC-019: UX Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production site
    await page.goto('https://personal-runway-calculator.vercel.app');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('1개 선택 시 모달 안 열림 (UX Fix)', async ({ page }) => {
    // Login first (if needed)
    const loginButton = page.getByRole('button', { name: /sign in/i });
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForLoadState('networkidle');
    }

    // Navigate to scenarios page
    await page.goto('https://personal-runway-calculator.vercel.app/scenarios');
    await page.waitForLoadState('networkidle');

    // Check if we have scenarios, create if needed
    const scenarioCards = page.locator('[class*="scenario"]');
    const count = await scenarioCards.count();
    
    console.log(`Found ${count} scenarios`);

    // Activate Compare mode
    const compareButton = page.getByRole('button', { name: /compare/i });
    await compareButton.click();
    await page.waitForTimeout(500);

    // Select 1 scenario
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.click();
    await page.waitForTimeout(1000);

    // ✅ VERIFY: Modal should NOT be visible
    const modal = page.locator('[role="dialog"], [class*="ComparisonView"]');
    const isModalVisible = await modal.isVisible().catch(() => false);

    expect(isModalVisible).toBe(false);
    console.log('✅ PASS: 1개 선택 시 모달 안 열림');
  });

  test('2개 선택 시 모달 자동 열림 (UX Fix)', async ({ page }) => {
    // Navigate to scenarios
    await page.goto('https://personal-runway-calculator.vercel.app/scenarios');
    await page.waitForLoadState('networkidle');

    // Activate Compare mode
    const compareButton = page.getByRole('button', { name: /compare/i });
    await compareButton.click();
    await page.waitForTimeout(500);

    // Select 2 scenarios
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await page.waitForTimeout(500);
    await checkboxes.nth(1).click();
    await page.waitForTimeout(1000);

    // ✅ VERIFY: Modal SHOULD be visible
    const modal = page.locator('[role="dialog"], [class*="ComparisonView"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // ✅ VERIFY: Chart visible
    const chart = page.locator('[class*="recharts"]');
    await expect(chart).toBeVisible();

    // ✅ VERIFY: Insights visible
    const insights = page.getByText(/comparison insights/i);
    await expect(insights).toBeVisible();

    console.log('✅ PASS: 2개 선택 시 모달 자동 열림');
  });

  test('3개 선택 가능 및 모달 정상 작동', async ({ page }) => {
    await page.goto('https://personal-runway-calculator.vercel.app/scenarios');
    await page.waitForLoadState('networkidle');

    // Activate Compare mode
    const compareButton = page.getByRole('button', { name: /compare/i });
    await compareButton.click();
    await page.waitForTimeout(500);

    // Select 3 scenarios
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count >= 3) {
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();
      await checkboxes.nth(2).click();
      await page.waitForTimeout(1000);

      // ✅ VERIFY: Modal visible with 3 scenarios
      const comparingText = page.getByText(/comparing 3 scenario/i);
      await expect(comparingText).toBeVisible();

      console.log('✅ PASS: 3개 선택 가능');
    } else {
      console.log(`⚠️ SKIP: Only ${count} scenarios available`);
    }
  });

  test('Chart 및 Insights 표시 확인 (TC-020)', async ({ page }) => {
    await page.goto('https://personal-runway-calculator.vercel.app/scenarios');
    await page.waitForLoadState('networkidle');

    const compareButton = page.getByRole('button', { name: /compare/i });
    await compareButton.click();

    // Select 2 scenarios
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    await page.waitForTimeout(1000);

    // ✅ VERIFY: Chart shows 2 lines
    const chartLines = page.locator('[class*="recharts"] path[class*="recharts-line"]');
    const lineCount = await chartLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(2);

    // ✅ VERIFY: Insights show "Best Runway"
    const bestRunway = page.getByText(/best runway/i);
    await expect(bestRunway).toBeVisible();

    // ✅ VERIFY: Analysis bullets exist
    const analysisBullets = page.locator('text=/•/');
    const bulletCount = await analysisBullets.count();
    expect(bulletCount).toBeGreaterThan(0);

    console.log('✅ PASS: Chart 2개 라인, Insights 정상');
  });
});
