// Test mobile responsiveness
const puppeteer = require('puppeteer');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:18800'
  });
  
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('localhost:3000')) || pages[0];
  
  const viewports = [
    { name: 'iPhone SE', width: 320, height: 568 },
    { name: 'iPhone 12', width: 375, height: 812 },
    { name: 'iPhone 14 Pro', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  for (const vp of viewports) {
    console.log(`\nTesting ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await delay(500);
    
    await page.screenshot({ 
      path: `screenshots/mobile-${vp.name.replace(/\s+/g, '-')}.png`,
      fullPage: false
    });
    console.log(`✅ Screenshot saved for ${vp.name}`);
  }
  
  console.log('\n✅ All viewport tests complete!');
  await browser.disconnect();
})();
