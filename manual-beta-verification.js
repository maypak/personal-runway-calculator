/**
 * Manual Beta Test Verification - Kim Taehyun Persona
 * Backend Developer focused on calculation accuracy
 */

const SAVINGS = 18_000_000;
const MONTHLY_BURN = 2_500_000;

// Manual calculation verification
function verifyCalculations() {
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 MANUAL CALCULATION VERIFICATION');
  console.log('═══════════════════════════════════════════\n');

  console.log('Test Persona: 김태현 (Backend Developer, 29)');
  console.log(`현재 자산: ₩${SAVINGS.toLocaleString()}`);
  console.log(`월 지출: ₩${MONTHLY_BURN.toLocaleString()}\n`);

  // Basic calculation
  const runwayMonths = SAVINGS / MONTHLY_BURN;
  const runwayDays = runwayMonths * 30;
  
  console.log('🧮 Expected Calculations:');
  console.log(`   ${SAVINGS.toLocaleString()} / ${MONTHLY_BURN.toLocaleString()} = ${runwayMonths} 개월`);
  console.log(`   ${runwayMonths} x 30 = ${runwayDays} 일`);
  
  // Calculate end date
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + runwayDays);
  
  console.log(`   종료일: ${endDate.toLocaleDateString('ko-KR')}`);
  
  // Categorization
  let category;
  if (runwayMonths >= 12) category = 'Excellent (>=12개월)';
  else if (runwayMonths >= 6) category = 'Good (6-12개월)';
  else if (runwayMonths >= 3) category = 'Warning (3-6개월)';
  else category = 'Critical (<3개월)';
  
  console.log(`   카테고리: ${category}\n`);

  // Edge cases
  console.log('🔬 Edge Case Tests:');
  const edgeCases = [
    { name: '매우 큰 숫자', savings: 100_000_000, burn: 2_500_000 },
    { name: '매우 작은 숫자', savings: 100_000, burn: 50_000 },
    { name: '소수점 포함', savings: 18_000_000, burn: 2_500.50 },
  ];

  edgeCases.forEach(tc => {
    const months = tc.savings / tc.burn;
    console.log(`   ${tc.name}:`);
    console.log(`      ${tc.savings.toLocaleString()} / ${tc.burn.toLocaleString()} = ${months.toFixed(2)} 개월`);
  });

  console.log('\n═══════════════════════════════════════════\n');
}

verifyCalculations();

// Number formatting tests
console.log('💰 Number Formatting Tests:');
console.log(`   Preferred: ₩18,000,000 (full precision)`);
console.log(`   Acceptable: ₩18M (abbreviated)`);
console.log(`   Required: Thousand separators (,)`);
console.log(`   Required: Won symbol (₩)\n`);

// Decimal handling
console.log('🔢 Decimal Handling:');
console.log(`   7.2 개월 ✅ (show decimals for accuracy)`);
console.log(`   7 개월 ❌ (hiding decimals loses information)`);
console.log(`   216일 = 7.2 x 30 (conversion accuracy)\n`);
