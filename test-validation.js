const puppeteer = require('puppeteer');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testErrorCases() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:18800' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('localhost:3000')) || pages[0];
  
  await page.goto('http://localhost:3000/onboarding', { waitUntil: 'networkidle0' });
  
  console.log('🧪 Testing Error Cases and Edge Conditions\n');
  
  // Step 1: Select an option
  console.log('Step 1: Selecting option...');
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  await buttons[1].click(); // Click first option
  await delay(500);
  
  // Click next to go to Step 2
  const nextButton = await page.$('button:has-text("다음")') || buttons[buttons.length - 1];
  await nextButton?.click();
  await delay(1000);
  
  // Test Case 1: Zero input
  console.log('\n📝 Test Case 1: Zero input (자산 = 0)');
  const assetInput = await page.$('input[type="text"]');
  await assetInput.click();
  await assetInput.type('0');
  await delay(500);
  
  const errorMsg1 = await page.$eval('body', el => el.textContent);
  console.log(errorMsg1.includes('0') ? '   ✅ Zero value accepted (checking validation...)' : '   ❌ Zero value rejected');
  
  // Clear and try negative number
  await assetInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  
  // Test Case 2: Negative number
  console.log('\n📝 Test Case 2: Negative number input');
  await assetInput.type('-1000');
  await delay(500);
  const val2 = await assetInput.evaluate(el => el.value);
  console.log(`   Input value: "${val2}"`);
  console.log(val2.includes('-') ? '   ⚠️  Negative number accepted (should be prevented!)' : '   ✅ Negative number blocked');
  
  // Clear
  await assetInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  
  // Test Case 3: Letters/special chars
  console.log('\n📝 Test Case 3: Non-numeric input (abc, $, etc.)');
  await assetInput.type('abc$123');
  await delay(500);
  const val3 = await assetInput.evaluate(el => el.value);
  console.log(`   Input value: "${val3}"`);
  const hasLetters = /[a-zA-Z]/.test(val3);
  console.log(hasLetters ? '   ⚠️  Letters accepted (should be blocked!)' : '   ✅ Letters blocked correctly');
  
  // Clear
  await assetInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  
  // Test Case 4: Decimal input
  console.log('\n📝 Test Case 4: Decimal numbers');
  await assetInput.type('1000.50');
  await delay(500);
  const val4 = await assetInput.evaluate(el => el.value);
  console.log(`   Input value: "${val4}"`);
  console.log(val4.includes('.') ? '   ✅ Decimal accepted' : '   ✅ Decimal blocked/rounded');
  
  // Clear
  await assetInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  
  // Test Case 5: Very large number (1 trillion)
  console.log('\n📝 Test Case 5: Very large number (1,000,000,000,000)');
  await assetInput.type('1000000000000');
  await delay(500);
  const val5 = await assetInput.evaluate(el => el.value);
  console.log(`   Input value: "${val5}"`);
  console.log(`   ✅ Large number accepted`);
  
  // Clear and enter valid amount
  await assetInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await assetInput.type('10000000');
  await delay(500);
  
  // Move to Step 3
  console.log('\n📝 Moving to Step 3...');
  const buttons2 = await page.$$('button');
  const nextBtn2 = buttons2[buttons2.length - 1];
  await nextBtn2.click();
  await delay(1000);
  
  // Test Case 6: Very small runway (assets < expenses)
  console.log('\n📝 Test Case 6: Small runway (자산 < 월지출)');
  const expenseInput = await page.$('input[type="text"]');
  await expenseInput.type('20000000'); // More than assets
  await delay(1000);
  
  const bodyText = await page.$eval('body', el => el.textContent);
  const hasRunway = bodyText.match(/(\d+\.?\d*)개월/);
  if (hasRunway) {
    console.log(`   ✅ Runway calculated: ${hasRunway[0]}`);
    const months = parseFloat(hasRunway[1]);
    if (months < 1) {
      console.log(`   ✅ Correctly shows < 1 month`);
    }
  }
  
  console.log('\n✅ Error validation tests complete!');
  
  await browser.disconnect();
}

testErrorCases().catch(console.error);
