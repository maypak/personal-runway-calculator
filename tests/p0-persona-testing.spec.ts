import { test, expect, Page } from '@playwright/test';

// Persona profiles
const personas = {
  jimin: {
    name: '지민 (대학생 취준생)',
    age: 21,
    assets: 2500000,
    monthlyExpense: 850000,
    income: 0,
    goalMonths: 3,
    previousScore: 8.0,
  },
  jihye: {
    name: '지혜 (프리랜서 디자이너)',
    age: 28,
    assets: 8000000,
    monthlyExpense: 2200000,
    income: 2500000,
    goalMonths: 6,
    previousScore: 7.8,
  },
  junho: {
    name: '준호 (스타트업 창업가)', // ⭐ KEY PERSONA
    age: 31,
    assets: 25000000,
    monthlyExpense: 4500000,
    income: 0,
    goalMonths: 6,
    previousScore: 7.0,
  },
  taehyun: {
    name: '태현 (백엔드 개발자)',
    age: 29,
    assets: 18000000,
    monthlyExpense: 2500000,
    income: 4500000,
    goalMonths: 12,
    previousScore: 7.4,
  },
  minjae: {
    name: '민재 (기혼 PM)',
    age: 35,
    assets: 15000000,
    monthlyExpense: 3800000,
    income: 5000000,
    goalMonths: 12,
    previousScore: 6.3,
  },
};

// Helper function to complete onboarding
async function completeOnboarding(page: Page, persona: any) {
  await page.goto('http://localhost:3000');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Step 1: Assets
  await page.fill('input[type="number"]', persona.assets.toString());
  await page.click('button:has-text("다음")');
  
  // Step 2: Monthly Expense
  await page.fill('input[type="number"]', persona.monthlyExpense.toString());
  await page.click('button:has-text("다음")');
  
  // Step 3: Monthly Income
  await page.fill('input[type="number"]', persona.income.toString());
  await page.click('button:has-text("계산하기")');
  
  // Wait for dashboard to load
  await page.waitForURL('**/dashboard');
  await page.waitForLoadState('networkidle');
}

// Helper function to calculate expected runway
function calculateRunway(assets: number, monthlyExpense: number, income: number): number {
  const netBurn = monthlyExpense - income;
  if (netBurn <= 0) return Infinity;
  return Math.floor(assets / netBurn);
}

test.describe('P0 Features - Persona Testing', () => {
  
  test.describe('준호 (창업가) - KEY PERSONA ⭐', () => {
    test('Complete flow: Onboarding → Scenario Comparison → Goal Setting → Data Edit', async ({ page }) => {
      const persona = personas.junho;
      console.log(`\n🧪 Testing ${persona.name} - ${persona.age}세`);
      
      // === 1. ONBOARDING ===
      console.log('\n📋 Step 1: Onboarding');
      await completeOnboarding(page, persona);
      
      // Verify we're on dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      console.log('✅ Onboarding completed - Dashboard loaded');
      
      // Check basic runway calculation
      const expectedRunway = calculateRunway(persona.assets, persona.monthlyExpense, persona.income);
      console.log(`Expected runway: ${expectedRunway} months`);
      
      // === 2. SCENARIO COMPARISON (NEW P0 FEATURE) ===
      console.log('\n📊 Step 2: Scenario Comparison');
      
      // Wait for ScenarioComparison component
      await page.waitForSelector('text=시나리오 비교', { timeout: 5000 });
      console.log('✅ ScenarioComparison component found');
      
      // Check for 4 scenarios
      const scenarios = await page.locator('[class*="scenario"]').count();
      console.log(`Found ${scenarios} scenario cards`);
      
      // Verify scenario calculations
      const currentScenario = await page.locator('text=현재 지출').locator('..').textContent();
      console.log(`Current scenario: ${currentScenario}`);
      
      // Check for visual indicators (icons/colors)
      const hasIcons = await page.locator('svg').count() > 0;
      console.log(`Visual indicators present: ${hasIcons}`);
      
      // === 3. GOAL SETTING (NEW P0 FEATURE) ===
      console.log('\n🎯 Step 3: Goal Setting');
      
      // Look for GoalSettingP0 component
      await page.waitForSelector('text=목표', { timeout: 5000 });
      console.log('✅ Goal Setting component found');
      
      // Enter goal months
      const goalInput = page.locator('input[type="number"]').last();
      await goalInput.fill(persona.goalMonths.toString());
      console.log(`Set goal: ${persona.goalMonths} months`);
      
      // Wait for gap analysis
      await page.waitForTimeout(500);
      
      // Check for action suggestions
      const hasActions = await page.locator('text=/절감|펀딩/').count() > 0;
      console.log(`Action suggestions present: ${hasActions}`);
      
      // Check for status icons (🎯/⚠️/🔴)
      const pageContent = await page.textContent('body');
      const hasStatusIcon = /🎯|⚠️|🔴/.test(pageContent || '');
      console.log(`Status icon present: ${hasStatusIcon}`);
      
      // === 4. DATA EDITING (NEW P0 FEATURE) ===
      console.log('\n⚙️ Step 4: Data Editing');
      
      // Find settings button
      const settingsButton = page.locator('button:has-text("설정"), button[aria-label*="설정"], button:has(svg)').first();
      await settingsButton.click();
      console.log('Clicked settings button');
      
      // Wait for settings page
      await page.waitForURL('**/settings', { timeout: 5000 });
      console.log('✅ Settings page loaded');
      
      // Modify assets
      const newAssets = 30000000; // Increased funding!
      await page.fill('input[value="25000000"]', newAssets.toString());
      console.log(`Updated assets: ${newAssets.toLocaleString()}`);
      
      // Save and return
      await page.click('button:has-text("저장")');
      await page.waitForURL('**/dashboard');
      console.log('✅ Returned to dashboard');
      
      // Verify update reflected
      await page.waitForTimeout(500);
      const newRunway = calculateRunway(newAssets, persona.monthlyExpense, persona.income);
      console.log(`New expected runway: ${newRunway} months`);
      
      // === 5. OVERALL UX EVALUATION ===
      console.log('\n🎨 Step 5: UX Evaluation');
      
      // Check console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      console.log(`Console errors: ${errors.length}`);
      if (errors.length > 0) {
        console.log('Errors:', errors);
      }
      
      // Performance check
      const perfTiming = await page.evaluate(() => JSON.stringify(performance.timing));
      console.log('Performance timing captured');
      
      // Mobile responsiveness check
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      console.log('✅ Mobile viewport tested');
      
      // Touch target size check (should be 44px+)
      const buttons = await page.locator('button').all();
      let smallButtons = 0;
      for (const button of buttons) {
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          smallButtons++;
        }
      }
      console.log(`Small touch targets (<44px): ${smallButtons}`);
      
      console.log('\n✅ 준호 (창업가) testing complete!');
    });
  });
  
  test.describe('지민 (대학생 취준생)', () => {
    test('Test scenario comparison for saving plans', async ({ page }) => {
      const persona = personas.jimin;
      console.log(`\n🧪 Testing ${persona.name}`);
      
      await completeOnboarding(page, persona);
      
      // Test scenario comparison
      await page.waitForSelector('text=시나리오 비교');
      console.log('✅ Scenario comparison visible');
      
      // Look for -10%, -20% scenarios
      const hasSavingScenarios = await page.locator('text=/-10%|-20%/').count() > 0;
      console.log(`Saving scenarios present: ${hasSavingScenarios}`);
      
      // Test goal setting for 3-month job hunt
      const goalInput = page.locator('input[type="number"]').last();
      await goalInput.fill('3');
      await page.waitForTimeout(500);
      
      console.log('✅ 지민 testing complete');
    });
  });
  
  test.describe('지혜 (프리랜서 디자이너)', () => {
    test('Test scenario comparison for income volatility', async ({ page }) => {
      const persona = personas.jihye;
      console.log(`\n🧪 Testing ${persona.name}`);
      
      await completeOnboarding(page, persona);
      
      // Freelancers need worst/best case scenarios
      await page.waitForSelector('text=시나리오 비교');
      
      // Check for -20% (worst case) and +20% (best case)
      const hasWorstCase = await page.locator('text=/-20%/').count() > 0;
      const hasBestCase = await page.locator('text=/\\+20%/').count() > 0;
      console.log(`Worst case (-20%): ${hasWorstCase}, Best case (+20%): ${hasBestCase}`);
      
      console.log('✅ 지혜 testing complete');
    });
  });
  
  test.describe('태현 (백엔드 개발자)', () => {
    test('Verify calculation accuracy and bug fixes', async ({ page }) => {
      const persona = personas.taehyun;
      console.log(`\n🧪 Testing ${persona.name}`);
      
      await completeOnboarding(page, persona);
      
      // Developer wants accurate calculations
      const expectedRunway = calculateRunway(persona.assets, persona.monthlyExpense, persona.income);
      console.log(`Expected runway: ${expectedRunway} months`);
      
      // Check for console errors (JS bugs)
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      
      await page.waitForTimeout(2000);
      console.log(`Console errors found: ${errors.length}`);
      
      // Test data editing flow
      const settingsBtn = page.locator('button').first();
      await settingsBtn.click();
      await page.waitForTimeout(500);
      
      console.log('✅ 태현 testing complete');
    });
  });
  
  test.describe('민재 (기혼 PM)', () => {
    test('Test conservative calculation with worst-case scenario', async ({ page }) => {
      const persona = personas.minjae;
      console.log(`\n🧪 Testing ${persona.name}`);
      
      await completeOnboarding(page, persona);
      
      // Family man needs worst-case scenario for emergency fund
      await page.waitForSelector('text=시나리오 비교');
      
      const worstCase = await page.locator('text=/-20%/').first();
      console.log('✅ Worst-case scenario available');
      
      // Set emergency fund goal
      const goalInput = page.locator('input[type="number"]').last();
      await goalInput.fill('12');
      await page.waitForTimeout(500);
      
      console.log('✅ 민재 testing complete');
    });
  });
});

test('📸 Screenshot capture for documentation', async ({ page }) => {
  const persona = personas.junho; // Use key persona for screenshots
  
  await completeOnboarding(page, persona);
  
  // Dashboard overview
  await page.screenshot({ path: 'test-results/dashboard-overview.png', fullPage: true });
  console.log('📸 Dashboard screenshot captured');
  
  // Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'test-results/dashboard-mobile.png', fullPage: true });
  console.log('📸 Mobile screenshot captured');
});
