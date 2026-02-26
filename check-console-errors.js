const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleErrors = [];
  const pageErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  console.log('📊 Checking console errors on pages...\n');
  
  // Test homepage
  console.log('1️⃣ Testing http://localhost:3000/');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Test onboarding
  console.log('2️⃣ Testing http://localhost:3000/onboarding');
  await page.goto('http://localhost:3000/onboarding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Test dashboard
  console.log('3️⃣ Testing http://localhost:3000/dashboard');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  await browser.close();
  
  console.log('\n📋 RESULTS:');
  console.log('=====================================');
  console.log(`Console errors: ${consoleErrors.length}`);
  console.log(`Page errors: ${pageErrors.length}`);
  
  if (consoleErrors.length > 0) {
    console.log('\n❌ Console Errors:');
    consoleErrors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
  }
  
  if (pageErrors.length > 0) {
    console.log('\n❌ Page Errors:');
    pageErrors.forEach((err, i) => console.log(`  ${i+1}. ${err}`));
  }
  
  if (consoleErrors.length === 0 && pageErrors.length === 0) {
    console.log('✅ No errors found!');
  }
  
  process.exit(pageErrors.length > 0 ? 1 : 0);
})();
