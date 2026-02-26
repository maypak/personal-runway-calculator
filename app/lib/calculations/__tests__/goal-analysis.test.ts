/**
 * goal-analysis.test.ts - Unit tests for P0 goal analysis
 * 
 * Created: 2026-02-26
 * Author: Developer Agent (Subagent)
 */

import { analyzeGoal } from '../../../../lib/calculations/goal';

describe('analyzeGoal', () => {
  const baseBalance = 25_000_000;
  const baseExpenses = 4_500_000;

  test('should analyze goal with safe margin (target 4 months, current 5.6)', () => {
    const analysis = analyzeGoal(baseBalance, baseExpenses, 4);

    expect(analysis.currentMonths).toBe(5.6);
    expect(analysis.targetMonths).toBe(4);
    expect(analysis.gap).toBe(1.6); // 5.6 - 4
    expect(analysis.status).toBe('safe');
    expect(analysis.suggestions.length).toBe(0); // No suggestions when safe
  });

  test('should analyze goal with tight margin (target 6 months, current 5.6)', () => {
    const analysis = analyzeGoal(baseBalance, baseExpenses, 6);

    expect(analysis.currentMonths).toBe(5.6);
    expect(analysis.targetMonths).toBe(6);
    expect(analysis.gap).toBe(-0.4); // 5.6 - 6
    expect(analysis.status).toBe('tight');
    expect(analysis.suggestions.length).toBe(2); // Should have 2 suggestions
  });

  test('should provide correct suggestions when goal is not met', () => {
    const analysis = analyzeGoal(baseBalance, baseExpenses, 6);

    // Should suggest expense reduction
    const expenseReduction = analysis.suggestions.find(s => s.type === 'reduce_expense');
    expect(expenseReduction).toBeDefined();
    expect(expenseReduction?.description).toContain('지출');
    expect(expenseReduction?.description).toContain('절감');

    // Should suggest funding
    const funding = analysis.suggestions.find(s => s.type === 'increase_balance');
    expect(funding).toBeDefined();
    expect(funding?.description).toContain('브릿지 펀딩');
  });

  test('should calculate danger status (target 8 months, current 5.6)', () => {
    const analysis = analyzeGoal(baseBalance, baseExpenses, 8);

    expect(analysis.currentMonths).toBe(5.6);
    expect(analysis.targetMonths).toBe(8);
    expect(analysis.gap).toBe(-2.4); // 5.6 - 8
    expect(analysis.status).toBe('danger');
    expect(analysis.suggestions.length).toBe(2);
  });

  test('should calculate correct funding amount needed', () => {
    const targetMonths = 7;
    const analysis = analyzeGoal(baseBalance, baseExpenses, targetMonths);

    // Current: 5.555... months, Target: 7 months, Gap: ~-1.44 months
    // Needed funding: ~1.44 * 4.5M = ~6.5M (floating point precision)
    const funding = analysis.suggestions.find(s => s.type === 'increase_balance');
    expect(funding?.value).toBeGreaterThan(6_000_000);
    expect(funding?.value).toBeLessThan(7_000_000);
  });

  test('should calculate correct expense reduction percentage', () => {
    const targetMonths = 7;
    const analysis = analyzeGoal(baseBalance, baseExpenses, targetMonths);

    // Current: 5.555... months, Target: 7 months, Gap: ~-1.44 months
    // Needed reduction: ~1.44 / 7 = ~20-21%
    const reduction = analysis.suggestions.find(s => s.type === 'reduce_expense');
    expect(reduction?.description).toMatch(/지출 (20|21)% 절감/);
  });

  test('should handle edge case: target equals current', () => {
    const currentMonths = baseBalance / baseExpenses; // 5.555...
    const analysis = analyzeGoal(baseBalance, baseExpenses, 5.6);

    expect(analysis.gap).toBeCloseTo(0, 1);
    expect(analysis.status).toBe('tight'); // Very close
  });
});
