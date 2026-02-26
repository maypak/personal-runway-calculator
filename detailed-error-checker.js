const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
      url: page.url()
    });
  });
  
  console.log('📊 Detailed error tracking...\n');
  
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
  
  console.log('\n📋 DETAILED ERROR REPORT:');
  console.log('=====================================');
  console.log(`Total errors: ${errors.length}\n`);
  
  if (errors.length > 0) {
    errors.forEach((err, i) => {
      console.log(`\n❌ Error ${i+1}:`);
      console.log(`URL: ${err.url}`);
      console.log(`Message: ${err.message}`);
      console.log(`Stack trace:`);
      console.log(err.stack);
      console.log('---');
    });
  } else {
    console.log('✅ No errors found!');
  }
  
  process.exit(errors.length > 0 ? 1 : 0);
})();
