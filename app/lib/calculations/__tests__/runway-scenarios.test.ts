/**
 * runway-scenarios.test.ts - Unit tests for P0 scenario calculations
 * 
 * Created: 2026-02-26
 * Author: Developer Agent (Subagent)
 */

import { calculateScenario, type Scenario } from '../../../../lib/calculations/runway';

describe('calculateScenario', () => {
  const baseBalance = 25_000_000;
  const baseExpenses = 4_500_000;

  test('should calculate current scenario (0% adjustment)', () => {
    const scenario: Scenario = {
      name: '현재',
      type: 'expense_adjustment',
      value: 0,
      icon: '🟡',
    };

    const result = calculateScenario(baseBalance, baseExpenses, scenario);

    expect(result.months).toBe(5.6); // 25M / 4.5M
    expect(result.balance).toBe(baseBalance);
    expect(result.monthlyExpenses).toBe(baseExpenses);
    expect(result.status).toBe('warning'); // 4-6 months
    expect(result.icon).toBe('🟡');
  });

  test('should calculate expense reduction scenario (-20%)', () => {
    const scenario: Scenario = {
      name: '절약 -20%',
      type: 'expense_adjustment',
      value: -0.2,
      icon: '🎯',
    };

    const result = calculateScenario(baseBalance, baseExpenses, scenario);

    // 25M / (4.5M * 0.8) = 25M / 3.6M = 6.94
    expect(result.months).toBe(6.9);
    expect(result.balance).toBe(baseBalance);
    expect(result.monthlyExpenses).toBe(3_600_000);
    expect(result.status).toBe('safe'); // >= 6 months
  });

  test('should calculate expense increase scenario (+20%)', () => {
    const scenario: Scenario = {
      name: '최악 +20%',
      type: 'expense_adjustment',
      value: 0.2,
      icon: '🔴',
    };

    const result = calculateScenario(baseBalance, baseExpenses, scenario);

    // 25M / (4.5M * 1.2) = 25M / 5.4M = 4.63
    expect(result.months).toBe(4.6);
    expect(result.balance).toBe(baseBalance);
    expect(result.monthlyExpenses).toBe(5_400_000);
    expect(result.status).toBe('warning'); // 4-6 months
  });

  test('should calculate balance increase scenario (+10M)', () => {
    const scenario: Scenario = {
      name: '브릿지 펀딩 +₩10M',
      type: 'balance_increase',
      value: 10_000_000,
      icon: '💎',
    };

    const result = calculateScenario(baseBalance, baseExpenses, scenario);

    // 35M / 4.5M = 7.78
    expect(result.months).toBe(7.8);
    expect(result.balance).toBe(35_000_000);
    expect(result.monthlyExpenses).toBe(baseExpenses);
    expect(result.status).toBe('safe');
  });

  test('should handle edge case: zero balance', () => {
    const scenario: Scenario = {
      name: '테스트',
      type: 'expense_adjustment',
      value: 0,
    };

    const result = calculateScenario(0, baseExpenses, scenario);

    expect(result.months).toBe(0);
    expect(result.status).toBe('danger');
  });

  test('should handle edge case: zero expenses', () => {
    const scenario: Scenario = {
      name: '테스트',
      type: 'expense_adjustment',
      value: 0,
    };

    const result = calculateScenario(baseBalance, 0, scenario);

    expect(result.months).toBe(Infinity);
    expect(result.status).toBe('safe');
  });
});
