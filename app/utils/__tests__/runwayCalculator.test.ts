/**
 * Runway Calculator Tests
 * 
 * Purpose: Verify calculation accuracy against expected results
 * 
 * Test Cases:
 * 1. Simple burn-down (no income)
 * 2. Break-even scenario (income = expenses)
 * 3. Profitable scenario (income > expenses)
 * 4. One-time expenses
 * 5. Recurring items
 * 6. Complex scenario (all features)
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import { calculateRunway, validateScenario, compareScenarios } from '../runwayCalculator';
import type { Scenario } from '../../types';

// Helper to create test scenario
function createTestScenario(overrides: Partial<Scenario> = {}): Scenario {
  return {
    id: 'test-1',
    userId: 'user-1',
    name: 'Test Scenario',
    isBase: false,
    totalSavings: 10000,
    monthlyExpenses: 1000,
    monthlyIncome: 0,
    oneTimeExpenses: [],
    recurringItems: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('calculateRunway', () => {
  test('Simple burn-down: $10,000 savings, $1,000/month expenses', () => {
    const scenario = createTestScenario({
      totalSavings: 10000,
      monthlyExpenses: 1000,
      monthlyIncome: 0,
    });
    
    const result = calculateRunway(scenario);
    
    expect(result.runway).toBe(10); // 10 months
    expect(result.burnRate).toBe(1000); // $1,000/month
    expect(result.breakevenMonth).toBeNull(); // Never breaks even
    expect(result.endSavings).toBe(0); // Depleted
    expect(result.monthlyData.length).toBe(10);
  });
  
  test('Break-even: Income = Expenses', () => {
    const scenario = createTestScenario({
      totalSavings: 10000,
      monthlyExpenses: 1000,
      monthlyIncome: 1000, // Break-even from start
    });
    
    const result = calculateRunway(scenario);
    
    // Should run until MAX_MONTHS (100) because never depletes
    expect(result.runway).toBe(100);
    expect(result.burnRate).toBe(0); // No net burn
    expect(result.breakevenMonth).toBe(0); // Breaks even immediately
    expect(result.endSavings).toBe(10000); // Savings unchanged
  });
  
  test('Profitable: Income > Expenses', () => {
    const scenario = createTestScenario({
      totalSavings: 10000,
      monthlyExpenses: 1000,
      monthlyIncome: 1500, // $500/month profit
    });
    
    const result = calculateRunway(scenario);
    
    expect(result.runway).toBe(100); // Runs to MAX_MONTHS
    expect(result.breakevenMonth).toBe(0); // Breaks even from start
    expect(result.endSavings).toBeGreaterThan(10000); // Savings grow
  });
  
  test('One-time expense at month 3', () => {
    const scenario = createTestScenario({
      totalSavings: 10000,
      monthlyExpenses: 500,
      monthlyIncome: 0,
      oneTimeExpenses: [
        { name: 'Bootcamp', amount: 5000, month: 3 },
      ],
    });
    
    const result = calculateRunway(scenario);
    
    // Month 0: 10000 - 500 = 9500
    // Month 1: 9500 - 500 = 9000
    // Month 2: 9000 - 500 = 8500
    // Month 3: 8500 - 500 - 5000 = 3000 (one-time expense)
    // Month 4: 3000 - 500 = 2500
    // Month 5: 2500 - 500 = 2000
    // Month 6: 2000 - 500 = 1500
    // Month 7: 1500 - 500 = 1000
    // Month 8: 1000 - 500 = 500
    // Month 9: 500 - 500 = 0
    
    expect(result.runway).toBe(10);
    expect(result.monthlyData[3].expenses).toBe(5500); // $500 + $5000
  });
  
  test('Recurring income starting at month 6', () => {
    const scenario = createTestScenario({
      totalSavings: 10000,
      monthlyExpenses: 2000,
      monthlyIncome: 0,
      recurringItems: [
        { name: 'Freelance', amount: 1000, type: 'income', startMonth: 6, endMonth: null },
      ],
    });
    
    const result = calculateRunway(scenario);
    
    // Month 0-5: Burn $2000/month = 10000 - 12000 (would deplete at month 5)
    // Actually: 10000 - 2000*5 = 0 at month 5
    // Month 5: 2000 - 2000 = 0, depleted before freelance starts
    
    expect(result.runway).toBe(5);
    expect(result.breakevenMonth).toBeNull(); // Never reaches breakeven
  });
  
  test('Recurring income starting early enough', () => {
    const scenario = createTestScenario({
      totalSavings: 6000,
      monthlyExpenses: 2000,
      monthlyIncome: 0,
      recurringItems: [
        { name: 'Freelance', amount: 1500, type: 'income', startMonth: 2, endMonth: null },
      ],
    });
    
    const result = calculateRunway(scenario);
    
    // Month 0: 6000 - 2000 = 4000
    // Month 1: 4000 - 2000 = 2000
    // Month 2: 2000 + 1500 - 2000 = 1500 (freelance starts)
    // Month 3: 1500 + 1500 - 2000 = 1000
    // Month 4: 1000 + 1500 - 2000 = 500
    // Month 5: 500 + 1500 - 2000 = 0
    
    expect(result.runway).toBe(6);
    expect(result.breakevenMonth).toBeNull(); // Income < expenses still
  });
  
  test('Complex scenario: Multiple one-time expenses and recurring items', () => {
    const scenario = createTestScenario({
      totalSavings: 20000,
      monthlyExpenses: 2000,
      monthlyIncome: 500,
      oneTimeExpenses: [
        { name: 'Equipment', amount: 3000, month: 0 },
        { name: 'Training', amount: 2000, month: 3 },
      ],
      recurringItems: [
        { name: 'Freelance', amount: 1000, type: 'income', startMonth: 2, endMonth: 6 },
        { name: 'Rent increase', amount: 200, type: 'expense', startMonth: 4, endMonth: null },
      ],
    });
    
    const result = calculateRunway(scenario);
    
    // Complex calculation, just verify it doesn't crash and returns reasonable values
    expect(result.runway).toBeGreaterThan(0);
    expect(result.burnRate).toBeGreaterThan(0);
    expect(result.monthlyData.length).toBe(result.runway);
    
    // Verify month 0 has equipment expense
    expect(result.monthlyData[0].expenses).toBe(2000 + 3000);
    
    // Verify month 3 has training expense
    expect(result.monthlyData[3].expenses).toBe(2000 + 2000);
    
    // Verify month 2 has freelance income
    expect(result.monthlyData[2].income).toBe(500 + 1000);
  });
});

describe('validateScenario', () => {
  test('Valid scenario passes validation', () => {
    const scenario = createTestScenario();
    const result = validateScenario(scenario);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
  
  test('Negative savings fails validation', () => {
    const scenario = createTestScenario({ totalSavings: -1000 });
    const result = validateScenario(scenario);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('savings');
  });
  
  test('Negative expenses fails validation', () => {
    const scenario = createTestScenario({ monthlyExpenses: -500 });
    const result = validateScenario(scenario);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('expenses');
  });
  
  test('Invalid one-time expense fails validation', () => {
    const scenario = createTestScenario({
      oneTimeExpenses: [
        { name: 'Invalid', amount: -100, month: 0 },
      ],
    });
    const result = validateScenario(scenario);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid');
  });
  
  test('Invalid recurring item fails validation', () => {
    const scenario = createTestScenario({
      recurringItems: [
        { name: 'Invalid', amount: 1000, type: 'income', startMonth: 5, endMonth: 2 }, // End before start
      ],
    });
    const result = validateScenario(scenario);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid');
  });
});

describe('compareScenarios', () => {
  test('Compare two scenarios with different runways', () => {
    const scenario1 = createTestScenario({
      name: 'Conservative',
      totalSavings: 10000,
      monthlyExpenses: 1000,
    });
    
    const scenario2 = createTestScenario({
      name: 'Optimistic',
      totalSavings: 15000,
      monthlyExpenses: 1000,
    });
    
    const result1 = calculateRunway(scenario1);
    const result2 = calculateRunway(scenario2);
    
    const comparison = compareScenarios(
      { name: scenario1.name, result: result1 },
      { name: scenario2.name, result: result2 }
    );
    
    expect(comparison.runwayDiff).toBe(-5); // Conservative is 5 months shorter
    expect(comparison.betterScenario).toBe('Optimistic');
    expect(comparison.insights.length).toBeGreaterThan(0);
  });
  
  test('Compare breakeven scenarios', () => {
    const scenario1 = createTestScenario({
      name: 'Base',
      totalSavings: 10000,
      monthlyExpenses: 1000,
      monthlyIncome: 0,
    });
    
    const scenario2 = createTestScenario({
      name: 'With Income',
      totalSavings: 10000,
      monthlyExpenses: 1000,
      monthlyIncome: 1000, // Break-even
    });
    
    const result1 = calculateRunway(scenario1);
    const result2 = calculateRunway(scenario2);
    
    const comparison = compareScenarios(
      { name: scenario1.name, result: result1 },
      { name: scenario2.name, result: result2 }
    );
    
    expect(comparison.insights.some(i => i.includes('breakeven'))).toBe(true);
  });
});

// Manual test output (for development verification)
if (require.main === module) {
  console.log('🧪 Running manual tests...\n');
  
  const testScenario = createTestScenario({
    name: 'Manual Test',
    totalSavings: 50000,
    monthlyExpenses: 4000,
    monthlyIncome: 0,
    oneTimeExpenses: [
      { name: 'Bootcamp', amount: 10000, month: 3 },
    ],
    recurringItems: [
      { name: 'Freelance', amount: 2000, type: 'income', startMonth: 6, endMonth: null },
    ],
  });
  
  const result = calculateRunway(testScenario);
  
  console.log('Scenario:', testScenario.name);
  console.log('Total Savings:', testScenario.totalSavings);
  console.log('Monthly Expenses:', testScenario.monthlyExpenses);
  console.log('\nResults:');
  console.log('Runway:', result.runway, 'months');
  console.log('Burn Rate:', result.burnRate.toFixed(2), '/month');
  console.log('Breakeven Month:', result.breakevenMonth ?? 'Never');
  console.log('End Savings:', result.endSavings);
  console.log('\nFirst 10 months:');
  result.monthlyData.slice(0, 10).forEach(m => {
    console.log(`Month ${m.month}: $${m.savings.toFixed(0)} (income: $${m.income}, expenses: $${m.expenses}, net: $${m.netChange})`);
  });
}
