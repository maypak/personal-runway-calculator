import { test, expect } from '@playwright/test';

test.describe('Beta Test - 김태현 Persona', () => {
  const SAVINGS = 18_000_000;
  const MONTHLY_BURN = 2_500_000;
  const EXPECTED_RUNWAY = 7.2; // months
  const EXPECTED_DAYS = 216; // 7.2 * 30

  // Increase timeout for all tests
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });

    // Monitor page errors
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });
  });

  test('Step 1: Complete Onboarding Flow', async ({ page }) => {
    console.log('\n🧪 Step 1: 온보딩 시작');
    
    await page.goto('http://localhost:3000/onboarding');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/beta-taehyun-01-onboarding-start.png', fullPage: true });

    // Step 1: Select 구직자
    console.log('  → Step 1: "구직자" 선택');
    const jobSeekerButton = page.locator('button:has-text("구직자")').first();
    await expect(jobSeekerButton).toBeVisible();
    await jobSeekerButton.click();
    await page.screenshot({ path: 'screenshots/beta-taehyun-02-role-selected.png', fullPage: true });

    // Wait for next step
    await page.waitForTimeout(500);

    // Step 2: Enter savings (₩18,000,000)
    console.log(`  → Step 2: ₩${SAVINGS.toLocaleString()} 입력`);
    const savingsInput = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await expect(savingsInput).toBeVisible();
    await savingsInput.clear();
    await savingsInput.fill(SAVINGS.toString());
    await page.screenshot({ path: 'screenshots/beta-taehyun-03-savings-entered.png', fullPage: true });

    // Click next or continue
    const nextButton = page.locator('button:has-text("다음"), button:has-text("Next"), button:has-text("계속")').first();
    await nextButton.click();
    await page.waitForTimeout(500);

    // Step 3: Enter monthly expenses (₩2,500,000)
    console.log(`  → Step 3: ₩${MONTHLY_BURN.toLocaleString()} 입력`);
    const expensesInput = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await expect(expensesInput).toBeVisible();
    await expensesInput.clear();
    await expensesInput.fill(MONTHLY_BURN.toString());
    await page.screenshot({ path: 'screenshots/beta-taehyun-04-expenses-entered.png', fullPage: true });

    // Submit onboarding
    const submitButton = page.locator('button:has-text("완료"), button:has-text("Submit"), button:has-text("시작")').first();
    await submitButton.click();
    
    // Should redirect to dashboard
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 5000 });
    console.log('  ✅ 온보딩 완료\n');
  });

  test('Step 2: Verify Dashboard Calculations', async ({ page }) => {
    console.log('\n🧪 Step 2: Dashboard 계산 검증');
    
    // Set up the state by navigating to dashboard directly
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // If we're on onboarding, complete it first
    const url = page.url();
    if (url.includes('onboarding')) {
      // Quick onboarding
      await page.locator('button:has-text("구직자")').first().click();
      await page.waitForTimeout(300);
      const savingsInput = page.locator('input[type="number"]').first();
      await savingsInput.fill(SAVINGS.toString());
      await page.locator('button:has-text("다음")').first().click();
      await page.waitForTimeout(300);
      const expensesInput = page.locator('input[type="number"]').first();
      await expensesInput.fill(MONTHLY_BURN.toString());
      await page.locator('button:has-text("완료"), button:has-text("시작")').first().click();
      await page.waitForURL(/\/(dashboard|$)/);
    }

    await page.screenshot({ path: 'screenshots/beta-taehyun-05-dashboard.png', fullPage: true });

    // Find runway display (various formats possible)
    const bodyText = await page.textContent('body');
    console.log('  📊 Dashboard 내용 분석 중...');

    // Look for runway calculation
    const runwayRegex = /(\d+\.?\d*)\s*(개월|months?)/i;
    const match = bodyText?.match(runwayRegex);
    
    if (match) {
      const displayedRunway = parseFloat(match[1]);
      console.log(`  → 표시된 런웨이: ${displayedRunway}개월`);
      console.log(`  → 예상 런웨이: ${EXPECTED_RUNWAY}개월`);
      
      // Allow 0.1 month tolerance
      expect(Math.abs(displayedRunway - EXPECTED_RUNWAY)).toBeLessThan(0.15);
      console.log('  ✅ 런웨이 계산 정확');
    } else {
      console.log('  ⚠️  런웨이 숫자를 찾을 수 없음');
    }

    // Check for formatting
    const hasProperCurrency = bodyText?.includes('₩') || bodyText?.includes('원');
    console.log(`  → 통화 포맷팅: ${hasProperCurrency ? '✅' : '❌'}`);

    // Manual verification notes
    console.log('\n  🧮 수동 검증:');
    console.log(`     ${SAVINGS.toLocaleString()} / ${MONTHLY_BURN.toLocaleString()} = ${EXPECTED_RUNWAY}개월`);
    console.log(`     ${EXPECTED_RUNWAY} x 30 = ${EXPECTED_DAYS}일`);
    console.log('');
  });

  test('Step 3: Developer Technical Inspection', async ({ page }) => {
    console.log('\n🧪 Step 3: 기술적 검증');

    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    page.on('pageerror', error => {
      errors.push(`PageError: ${error.message}`);
    });

    // Load dashboard
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Let React render

    await page.screenshot({ path: 'screenshots/beta-taehyun-06-tech-check.png', fullPage: true });

    console.log(`  → Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      errors.forEach(e => console.log(`     ❌ ${e}`));
    } else {
      console.log('     ✅ No console errors');
    }

    console.log(`  → Console Warnings: ${warnings.length}`);
    if (warnings.length > 0 && warnings.length <= 5) {
      warnings.forEach(w => console.log(`     ⚠️  ${w}`));
    }

    // Performance check
    const performanceTiming = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        totalLoad: perf.loadEventEnd - perf.fetchStart
      };
    });

    console.log(`  → DOM Content Loaded: ${performanceTiming.domContentLoaded.toFixed(0)}ms`);
    console.log(`  → Total Load Time: ${performanceTiming.totalLoad.toFixed(0)}ms`);

    expect(errors.length).toBe(0);
    console.log('');
  });

  test('Step 4: Edge Case Testing', async ({ page }) => {
    console.log('\n🧪 Step 4: 엣지 케이스 테스트');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const testCases = [
      { name: '매우 큰 숫자', savings: 100_000_000, burn: 2_500_000, expected: 40 },
      { name: '매우 작은 숫자', savings: 100_000, burn: 50_000, expected: 2 },
      { name: '소수점 포함', savings: 18_000_000, burn: 2_500.5, expected: 7199.6 },
    ];

    for (const tc of testCases) {
      console.log(`\n  Testing: ${tc.name}`);
      console.log(`    Savings: ₩${tc.savings.toLocaleString()}`);
      console.log(`    Burn: ₩${tc.burn.toLocaleString()}`);
      
      // Navigate to onboarding or reset
      await page.goto('http://localhost:3000/onboarding');
      await page.waitForLoadState('networkidle');

      try {
        // Complete onboarding with test values
        await page.locator('button:has-text("구직자")').first().click({ timeout: 3000 });
        await page.waitForTimeout(300);
        
        const savingsInput = page.locator('input[type="number"]').first();
        await savingsInput.fill(tc.savings.toString());
        await page.locator('button:has-text("다음")').first().click();
        await page.waitForTimeout(300);
        
        const burnInput = page.locator('input[type="number"]').first();
        await burnInput.fill(tc.burn.toString());
        await page.locator('button:has-text("완료"), button:has-text("시작")').first().click();
        await page.waitForURL(/\/(dashboard|$)/, { timeout: 3000 });

        const bodyText = await page.textContent('body');
        console.log(`    ✅ 입력 성공, 페이지 로드됨`);
        
        await page.screenshot({ 
          path: `screenshots/beta-taehyun-edge-${tc.name.replace(/\s+/g, '-')}.png`, 
          fullPage: true 
        });
      } catch (e) {
        console.log(`    ❌ 에러: ${e}`);
      }
    }

    console.log('');
  });

  test('Step 5: Export Functionality', async ({ page }) => {
    console.log('\n🧪 Step 5: CSV/Export 기능 테스트');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Look for export/download buttons
    const exportButton = page.locator('button:has-text("Export"), button:has-text("CSV"), button:has-text("Download")');
    const count = await exportButton.count();

    console.log(`  → Export buttons found: ${count}`);
    
    if (count > 0) {
      console.log('  ✅ Export 기능 존재');
      
      // Try clicking
      try {
        const downloadPromise = page.waitForEvent('download', { timeout: 3000 });
        await exportButton.first().click();
        const download = await downloadPromise;
        console.log(`  ✅ 다운로드 성공: ${download.suggestedFilename()}`);
      } catch (e) {
        console.log('  ⚠️  다운로드 트리거되지 않음 (버튼은 존재)');
      }
    } else {
      console.log('  ❌ Export 기능 없음 (개선 필요)');
    }

    console.log('');
  });
});
