/**
 * Manual Calculator Test Script
 * Run: node test-calculator.js
 */

// Simple test scenario
const testScenario = {
  id: 'test-1',
  userId: 'user-1',
  name: 'Manual Test',
  isBase: false,
  totalSavings: 50000,
  monthlyExpenses: 4000,
  monthlyIncome: 0,
  oneTimeExpenses: [
    { name: 'Bootcamp', amount: 10000, month: 3 },
  ],
  recurringItems: [
    { name: 'Freelance', amount: 2000, type: 'income', startMonth: 6, endMonth: null },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Manual calculation logic
function calculateRunway(scenario) {
  let savings = scenario.totalSavings;
  let month = 0;
  const monthlyData = [];
  const MAX_MONTHS = 100;
  
  while (savings > 0 && month < MAX_MONTHS) {
    const baseIncome = scenario.monthlyIncome;
    const baseExpenses = scenario.monthlyExpenses;
    
    // One-time expenses this month
    const oneTimeThisMonth = scenario.oneTimeExpenses
      .filter(e => e.month === month)
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Recurring income this month
    const recurringIncomeThisMonth = scenario.recurringItems
      .filter(r => 
        r.type === 'income' && 
        r.startMonth <= month && 
        (r.endMonth === null || r.endMonth >= month)
      )
      .reduce((sum, r) => sum + r.amount, 0);
    
    // Recurring expenses this month
    const recurringExpensesThisMonth = scenario.recurringItems
      .filter(r => 
        r.type === 'expense' && 
        r.startMonth <= month && 
        (r.endMonth === null || r.endMonth >= month)
      )
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalIncome = baseIncome + recurringIncomeThisMonth;
    const totalExpenses = baseExpenses + recurringExpensesThisMonth + oneTimeThisMonth;
    const netChange = totalIncome - totalExpenses;
    
    savings += netChange;
    
    monthlyData.push({
      month,
      savings: Math.max(0, savings),
      income: totalIncome,
      expenses: totalExpenses,
      netChange,
    });
    
    month++;
  }
  
  const totalMonths = monthlyData.length;
  const finalSavings = Math.max(0, savings);
  const totalSpent = scenario.totalSavings - finalSavings;
  const burnRate = totalMonths > 0 ? totalSpent / totalMonths : 0;
  const breakevenMonth = monthlyData.findIndex(m => m.netChange >= 0);
  
  return {
    runway: totalMonths,
    burnRate,
    breakevenMonth: breakevenMonth >= 0 ? breakevenMonth : null,
    endSavings: finalSavings,
    monthlyData,
  };
}

// Run test
console.log('🧪 Testing Runway Calculator\n');
console.log('Scenario:', testScenario.name);
console.log('Total Savings: $' + testScenario.totalSavings.toLocaleString());
console.log('Monthly Expenses: $' + testScenario.monthlyExpenses.toLocaleString());
console.log('One-time Expenses:', testScenario.oneTimeExpenses.map(e => e.name + ' ($' + e.amount.toLocaleString() + ') at month ' + e.month).join(', '));
console.log('Recurring Items:', testScenario.recurringItems.map(r => r.name + ' ($' + r.amount.toLocaleString() + '/mo, ' + r.type + ', starts month ' + r.startMonth + ')').join(', '));
console.log('\n' + '='.repeat(60) + '\n');

const result = calculateRunway(testScenario);

console.log('📊 Results:');
console.log('Total Runway: ' + result.runway + ' months');
console.log('Average Burn Rate: $' + result.burnRate.toFixed(2) + '/month');
console.log('Breakeven Month:', result.breakevenMonth !== null ? result.breakevenMonth : 'Never');
console.log('End Savings: $' + result.endSavings.toLocaleString());
console.log('\n' + '='.repeat(60) + '\n');

console.log('📈 Month-by-Month Breakdown (first 12 months):\n');
result.monthlyData.slice(0, 12).forEach(m => {
  console.log(
    'Month ' + String(m.month).padStart(2, '0') + ': ' +
    'Savings: $' + String(m.savings.toFixed(0)).padStart(7) + ' | ' +
    'Income: $' + String(m.income.toFixed(0)).padStart(5) + ' | ' +
    'Expenses: $' + String(m.expenses.toFixed(0)).padStart(6) + ' | ' +
    'Net: ' + (m.netChange >= 0 ? '+' : '') + '$' + String(m.netChange.toFixed(0)).padStart(6)
  );
});

console.log('\n✅ Test complete!');

// Verification against expected values
console.log('\n🔍 Verification:');
console.log('Month 3 should have $10,000 one-time expense:');
console.log('  Expected: $14,000 total expenses');
console.log('  Actual: $' + result.monthlyData[3].expenses.toLocaleString());
console.log('  ' + (result.monthlyData[3].expenses === 14000 ? '✅ PASS' : '❌ FAIL'));

console.log('\nMonth 6 should start freelance income:');
console.log('  Expected: $2,000 income');
console.log('  Actual: $' + result.monthlyData[6].income.toLocaleString());
console.log('  ' + (result.monthlyData[6].income === 2000 ? '✅ PASS' : '❌ FAIL'));

console.log('\nBreakeven should occur at month 6 (when freelance income > expenses):');
console.log('  Expected: Month 6 or later');
console.log('  Actual: Month ' + result.breakevenMonth);
console.log('  ' + (result.breakevenMonth !== null && result.breakevenMonth >= 6 ? '✅ PASS' : '❌ FAIL'));
