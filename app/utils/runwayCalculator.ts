/**
 * Runway Calculator - Core Calculation Logic
 * 
 * Purpose: Calculate financial runway for different scenarios
 * Principles (CLAUDE.md):
 * - Simple, accurate, testable
 * - No premature optimization
 * - Clear variable names, extensive comments
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import type { Scenario, RunwayResult, MonthData, OneTimeExpense, RecurringItem } from '../types';

/**
 * Calculate runway for a given scenario
 * 
 * Algorithm:
 * 1. Start with total savings
 * 2. For each month:
 *    - Add monthly income
 *    - Subtract monthly expenses
 *    - Apply one-time expenses (if any this month)
 *    - Apply recurring items (if active this month)
 *    - Update savings
 * 3. Stop when savings <= 0 OR max months reached
 * 
 * @param scenario - The financial scenario to calculate
 * @returns RunwayResult with runway, burn rate, and monthly breakdown
 */
export function calculateRunway(scenario: Scenario): RunwayResult {
  console.log('🧮 [calculateRunway] Starting calculation for:', scenario.name);
  
  let savings = scenario.totalSavings;
  let month = 0;
  const monthlyData: MonthData[] = [];
  
  // Safety limit: prevent infinite loops (100 months = ~8 years)
  const MAX_MONTHS = 100;
  
  while (savings > 0 && month < MAX_MONTHS) {
    // Base income and expenses
    const baseIncome = scenario.monthlyIncome;
    const baseExpenses = scenario.monthlyExpenses;
    
    // One-time expenses this month
    const oneTimeThisMonth = scenario.oneTimeExpenses
      .filter((e: OneTimeExpense) => e.month === month)
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Recurring items active this month
    const recurringIncomeThisMonth = scenario.recurringItems
      .filter((r: RecurringItem) => 
        r.type === 'income' && 
        r.startMonth <= month && 
        (r.endMonth === null || r.endMonth >= month)
      )
      .reduce((sum, r) => sum + r.amount, 0);
    
    const recurringExpensesThisMonth = scenario.recurringItems
      .filter((r: RecurringItem) => 
        r.type === 'expense' && 
        r.startMonth <= month && 
        (r.endMonth === null || r.endMonth >= month)
      )
      .reduce((sum, r) => sum + r.amount, 0);
    
    // Calculate totals for this month
    const totalIncome = baseIncome + recurringIncomeThisMonth;
    const totalExpenses = baseExpenses + recurringExpensesThisMonth + oneTimeThisMonth;
    const netChange = totalIncome - totalExpenses;
    
    // Update savings
    savings += netChange;
    
    // Record this month's data
    monthlyData.push({
      month,
      savings: Math.max(0, savings), // Don't show negative savings
      income: totalIncome,
      expenses: totalExpenses,
      netChange,
    });
    
    // Log first 3 months for debugging
    if (month < 3) {
      console.log(`  Month ${month}: Income=$${totalIncome}, Expenses=$${totalExpenses}, Net=$${netChange}, Savings=$${savings}`);
    }
    
    month++;
  }
  
  // Calculate summary metrics
  const totalMonths = monthlyData.length;
  const finalSavings = Math.max(0, savings);
  
  // Burn rate = total spent / months (if any spending occurred)
  const totalSpent = scenario.totalSavings - finalSavings;
  const burnRate = totalMonths > 0 ? totalSpent / totalMonths : 0;
  
  // Breakeven month = first month where net change >= 0 (if any)
  const breakevenMonth = monthlyData.findIndex(m => m.netChange >= 0);
  const breakevenResult = breakevenMonth >= 0 ? breakevenMonth : null;
  
  const result: RunwayResult = {
    runway: totalMonths,
    burnRate,
    breakevenMonth: breakevenResult,
    endSavings: finalSavings,
    monthlyData,
  };
  
  console.log('✅ [calculateRunway] Result:', {
    runway: result.runway,
    burnRate: result.burnRate.toFixed(2),
    breakevenMonth: result.breakevenMonth,
    endSavings: result.endSavings,
  });
  
  return result;
}

/**
 * Calculate runway for multiple scenarios (batch calculation)
 * 
 * @param scenarios - Array of scenarios to calculate
 * @returns Map of scenario ID to RunwayResult
 */
export function calculateMultipleRunways(scenarios: Scenario[]): Map<string, RunwayResult> {
  console.log('🧮 [calculateMultipleRunways] Calculating', scenarios.length, 'scenarios');
  
  const results = new Map<string, RunwayResult>();
  
  scenarios.forEach(scenario => {
    const result = calculateRunway(scenario);
    results.set(scenario.id, result);
  });
  
  console.log('✅ [calculateMultipleRunways] Complete');
  return results;
}

/**
 * Validate scenario data before calculation
 * 
 * @param scenario - Scenario to validate
 * @returns Object with valid flag and error message if invalid
 */
export function validateScenario(scenario: Scenario): { valid: boolean; error?: string } {
  if (scenario.totalSavings < 0) {
    return { valid: false, error: 'Total savings cannot be negative' };
  }
  
  if (scenario.monthlyExpenses < 0) {
    return { valid: false, error: 'Monthly expenses cannot be negative' };
  }
  
  if (scenario.monthlyIncome < 0) {
    return { valid: false, error: 'Monthly income cannot be negative' };
  }
  
  // Validate one-time expenses
  for (const expense of scenario.oneTimeExpenses) {
    if (expense.amount < 0) {
      return { valid: false, error: `One-time expense "${expense.name}" has negative amount` };
    }
    if (expense.month < 0) {
      return { valid: false, error: `One-time expense "${expense.name}" has invalid month` };
    }
  }
  
  // Validate recurring items
  for (const item of scenario.recurringItems) {
    if (item.amount < 0) {
      return { valid: false, error: `Recurring item "${item.name}" has negative amount` };
    }
    if (item.startMonth < 0) {
      return { valid: false, error: `Recurring item "${item.name}" has invalid start month` };
    }
    if (item.endMonth !== null && item.endMonth < item.startMonth) {
      return { valid: false, error: `Recurring item "${item.name}" end month before start month` };
    }
  }
  
  return { valid: true };
}

/**
 * Format currency for display
 * 
 * @param amount - Amount to format
 * @param showCents - Whether to show cents (default: false)
 * @returns Formatted string like "$1,234" or "$1,234.56"
 */
export function formatCurrency(amount: number, showCents: boolean = false): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  
  return formatter.format(amount);
}

/**
 * Compare two scenarios and return insights
 * 
 * @param scenario1 - First scenario
 * @param scenario2 - Second scenario
 * @returns Comparison insights
 */
export function compareScenarios(
  scenario1: { name: string; result: RunwayResult },
  scenario2: { name: string; result: RunwayResult }
): {
  runwayDiff: number;
  burnRateDiff: number;
  betterScenario: string;
  insights: string[];
} {
  const runwayDiff = scenario1.result.runway - scenario2.result.runway;
  const burnRateDiff = scenario1.result.burnRate - scenario2.result.burnRate;
  
  const insights: string[] = [];
  
  // Runway comparison
  if (Math.abs(runwayDiff) > 0) {
    const better = runwayDiff > 0 ? scenario1.name : scenario2.name;
    const worse = runwayDiff > 0 ? scenario2.name : scenario1.name;
    const diff = Math.abs(runwayDiff);
    insights.push(`${better} gives you ${diff} more months than ${worse}`);
  }
  
  // Burn rate comparison
  if (Math.abs(burnRateDiff) > 0) {
    const lower = burnRateDiff < 0 ? scenario1.name : scenario2.name;
    const diff = formatCurrency(Math.abs(burnRateDiff));
    insights.push(`${lower} has ${diff}/month lower burn rate`);
  }
  
  // Breakeven comparison
  const s1Breakeven = scenario1.result.breakevenMonth;
  const s2Breakeven = scenario2.result.breakevenMonth;
  
  if (s1Breakeven !== null && s2Breakeven === null) {
    insights.push(`${scenario1.name} reaches breakeven at month ${s1Breakeven}, ${scenario2.name} never does`);
  } else if (s1Breakeven === null && s2Breakeven !== null) {
    insights.push(`${scenario2.name} reaches breakeven at month ${s2Breakeven}, ${scenario1.name} never does`);
  } else if (s1Breakeven !== null && s2Breakeven !== null && s1Breakeven !== s2Breakeven) {
    const earlier = s1Breakeven < s2Breakeven ? scenario1.name : scenario2.name;
    const diff = Math.abs(s1Breakeven - s2Breakeven);
    insights.push(`${earlier} reaches breakeven ${diff} months earlier`);
  }
  
  const betterScenario = runwayDiff > 0 ? scenario1.name : scenario2.name;
  
  return {
    runwayDiff,
    burnRateDiff,
    betterScenario,
    insights,
  };
}
