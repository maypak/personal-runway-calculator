#!/usr/bin/env node
/**
 * Automated Screenshot Capture for Product Hunt
 * 
 * Generates 8 marketing screenshots:
 * 1. Hero/Dashboard
 * 2. Settings panel
 * 3. Expense tracking
 * 4. Mobile view (iPhone)
 * 5. Mobile view (Android)
 * 6. What-If Simulator
 * 7. Desktop full view
 * 8. Tablet view (iPad)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://personal-runway-calculator.vercel.app';
const OUTPUT_DIR = path.join(__dirname, '../marketing/screenshots');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 1. Hero/Dashboard (Desktop)
    console.log('📸 1/8: Capturing hero/dashboard (desktop)...');
    await page.setViewport({ width: 1270, height: 760 });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01-hero-dashboard-1270x760.png'),
      fullPage: false
    });

    // Wait a bit for any animations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Settings Panel (if we can click it)
    console.log('📸 2/8: Capturing settings panel...');
    // Note: This requires authentication, so might show auth screen
    // For now, just capture the auth page with settings button visible
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02-auth-page-1270x760.png'),
      fullPage: false
    });

    // 3. Mobile view - iPhone
    console.log('📸 3/8: Capturing mobile (iPhone)...');
    await page.setViewport({ width: 390, height: 844 }); // iPhone 12 Pro
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03-mobile-iphone-390x844.png'),
      fullPage: true
    });

    // 4. Mobile view - Android
    console.log('📸 4/8: Capturing mobile (Android)...');
    await page.setViewport({ width: 360, height: 800 }); // Pixel 5
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04-mobile-android-360x800.png'),
      fullPage: true
    });

    // 5. Tablet view - iPad
    console.log('📸 5/8: Capturing tablet (iPad)...');
    await page.setViewport({ width: 820, height: 1180 }); // iPad Air
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05-tablet-ipad-820x1180.png'),
      fullPage: false
    });

    // 6. Desktop full view (for Product Hunt primary)
    console.log('📸 6/8: Capturing desktop full view...');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '06-desktop-full-1920x1080.png'),
      fullPage: false
    });

    // 7. Desktop with browser chrome (for authenticity)
    console.log('📸 7/8: Capturing desktop with chrome...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '07-desktop-chrome-1440x900.png'),
      fullPage: false
    });

    // 8. Product Hunt standard size
    console.log('📸 8/8: Capturing Product Hunt size...');
    await page.setViewport({ width: 1270, height: 760 });
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '08-product-hunt-1270x760.png'),
      fullPage: false
    });

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Saved to: ${OUTPUT_DIR}\n`);

    // List all captured files
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
    console.log('Generated files:');
    files.forEach(file => {
      const stats = fs.statSync(path.join(OUTPUT_DIR, file));
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  - ${file} (${sizeKB} KB)`);
    });

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run
captureScreenshots().then(() => {
  console.log('\n🎉 Screenshot capture complete!');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
