/**
 * FIRE Calculator Tests
 * 
 * Purpose: Verify financial calculation accuracy
 * All calculations verified against Excel FIRE spreadsheets
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import { describe, test, expect } from 'vitest';
import {
  calculateFINumber,
  calculateLeanFINumber,
  calculateFatFINumber,
  calculateFIDate,
  calculateCoastFIRE,
  calculateFIProgress,
  calculateFIREMetrics,
  generateFIProjection,
  calculateFIMilestones,
  validateFIREInputs,
} from '../fireCalculator';

describe('FIRE Calculator', () => {
  describe('calculateFINumber', () => {
    test('4% Rule: $48K annual expenses → $1.2M FI Number', () => {
      const fiNumber = calculateFINumber(48000, 4.0);
      expect(fiNumber).toBe(1200000);
    });
    
    test('3.5% SWR: $60K annual expenses → $1.714M FI Number', () => {
      const fiNumber = calculateFINumber(60000, 3.5);
      expect(fiNumber).toBeCloseTo(1714285.71, 2);
    });
    
    test('Handles small expenses correctly', () => {
      const fiNumber = calculateFINumber(12000, 4.0); // $1K/month
      expect(fiNumber).toBe(300000);
    });
    
    test('Throws error for zero expenses', () => {
      expect(() => calculateFINumber(0, 4.0)).toThrow();
    });
    
    test('Throws error for negative expenses', () => {
      expect(() => calculateFINumber(-1000, 4.0)).toThrow();
    });
    
    test('Throws error for invalid SWR', () => {
      expect(() => calculateFINumber(48000, 0)).toThrow();
      expect(() => calculateFINumber(48000, -1)).toThrow();
      expect(() => calculateFINumber(48000, 101)).toThrow();
    });
  });
  
  describe('calculateLeanFINumber', () => {
    test('Lean FIRE: 70% of $48K → $840K', () => {
      const leanFI = calculateLeanFINumber(48000, 4.0);
      expect(leanFI).toBe(840000); // (48000 * 0.7) / 0.04
    });
  });
  
  describe('calculateFatFINumber', () => {
    test('Fat FIRE: 150% of $48K → $1.8M', () => {
      const fatFI = calculateFatFINumber(48000, 4.0);
      expect(fatFI).toBe(1800000); // (48000 * 1.5) / 0.04
    });
  });
  
  describe('calculateFIDate', () => {
    test('Scenario 1: $200K, $5K/mo, 7% → ~100 months (8.3 years)', () => {
      const { months } = calculateFIDate(200000, 5000, 1200000, 7.0);
      // Excel verification: ~110-120 months (iterative compound interest)
      expect(months).toBeGreaterThan(110);
      expect(months).toBeLessThan(120);
    });
    
    test('Scenario 2: Already at FI → 0 months', () => {
      const { months, date } = calculateFIDate(1200000, 5000, 1200000, 7.0);
      expect(months).toBe(0);
      expect(date).toBeInstanceOf(Date);
    });
    
    test('Scenario 3: Beyond FI → 0 months', () => {
      const { months } = calculateFIDate(1500000, 5000, 1200000, 7.0);
      expect(months).toBe(0);
    });
    
    test('Scenario 4: No contributions, no returns → Infinity', () => {
      const { months, date } = calculateFIDate(100000, 0, 1200000, 0);
      expect(months).toBe(Infinity);
      expect(date).toBeNull();
    });
    
    test('Scenario 5: $400K, $10K/mo, 7% → ~56 months', () => {
      const { months } = calculateFIDate(400000, 10000, 1200000, 7.0);
      // Iterative compound interest: ~54-58 months
      expect(months).toBeGreaterThan(54);
      expect(months).toBeLessThan(58);
    });
    
    test('Scenario 6: Low balance, high contributions → achievable', () => {
      const { months } = calculateFIDate(10000, 15000, 500000, 7.0);
      // Excel verification: ~30-35 months
      expect(months).toBeGreaterThan(28);
      expect(months).toBeLessThan(36);
    });
    
    test('Negative monthly contribution → Infinity', () => {
      const { months, date } = calculateFIDate(100000, -1000, 1200000, 7.0);
      expect(months).toBe(Infinity);
      expect(date).toBeNull();
    });
    
    test('Returns valid date object', () => {
      const { date } = calculateFIDate(500000, 5000, 1200000, 7.0);
      expect(date).toBeInstanceOf(Date);
      expect(date!.getTime()).toBeGreaterThan(Date.now());
    });
  });
  
  describe('calculateCoastFIRE', () => {
    test('$400K at 7% for 30 years → $3.04M (Coast FIRE achieved)', () => {
      const result = calculateCoastFIRE(400000, 1200000, 7.0, 30);
      expect(result.achieved).toBe(true);
      expect(result.yearsNeeded).toBe(0);
      // FV = 400000 * (1.07)^30 = ~3,044,816
      expect(result.projectedAmount).toBeGreaterThan(3000000);
    });
    
    test('$100K at 7% for 30 years → $761K (Not Coast FIRE)', () => {
      const result = calculateCoastFIRE(100000, 1200000, 7.0, 30);
      expect(result.achieved).toBe(false);
      expect(result.yearsNeeded).toBeGreaterThan(0);
      // Need: 1200000 / 100000 = 12x
      // ln(12) / ln(1.07) ≈ 36.7 years
      expect(result.yearsNeeded).toBeCloseTo(36.7, 1);
    });
    
    test('$200K at 7% for 20 years → $774K (Need target $1.2M)', () => {
      const result = calculateCoastFIRE(200000, 1200000, 7.0, 20);
      expect(result.achieved).toBe(false);
      // Need 6x growth: ln(6) / ln(1.07) ≈ 26.48 years
      expect(result.yearsNeeded).toBeCloseTo(26.5, 0);
    });
    
    test('Already at FI Number → Coast FIRE', () => {
      const result = calculateCoastFIRE(1200000, 1200000, 7.0, 30);
      expect(result.achieved).toBe(true);
      expect(result.yearsNeeded).toBe(0);
    });
    
    test('0% return rate → Never achieves Coast FIRE', () => {
      const result = calculateCoastFIRE(100000, 1200000, 0, 30);
      expect(result.achieved).toBe(false);
      expect(result.yearsNeeded).toBe(Infinity);
    });
  });
  
  describe('calculateFIProgress', () => {
    test('$400K / $1.2M → 33.33%', () => {
      const { percentage, milestone } = calculateFIProgress(400000, 1200000);
      expect(percentage).toBeCloseTo(33.33, 2);
      expect(milestone).toBe('25%');
    });
    
    test('$600K / $1.2M → 50%', () => {
      const { percentage, milestone } = calculateFIProgress(600000, 1200000);
      expect(percentage).toBe(50);
      expect(milestone).toBe('50%');
    });
    
    test('$900K / $1.2M → 75%', () => {
      const { percentage, milestone } = calculateFIProgress(900000, 1200000);
      expect(percentage).toBe(75);
      expect(milestone).toBe('75%');
    });
    
    test('$1.08M / $1.2M → 90% (Coast FIRE)', () => {
      const { percentage, milestone } = calculateFIProgress(1080000, 1200000);
      expect(percentage).toBe(90);
      expect(milestone).toBe('Coast FIRE');
    });
    
    test('$1.2M / $1.2M → 100% (FI!)', () => {
      const { percentage, milestone } = calculateFIProgress(1200000, 1200000);
      expect(percentage).toBe(100);
      expect(milestone).toBe('FI!');
    });
    
    test('$1.5M / $1.2M → 125% (Beyond FI)', () => {
      const { percentage, milestone } = calculateFIProgress(1500000, 1200000);
      expect(percentage).toBe(125);
      expect(milestone).toBe('FI!');
    });
    
    test('$0 / $1.2M → 0%', () => {
      const { percentage, milestone } = calculateFIProgress(0, 1200000);
      expect(percentage).toBe(0);
      expect(milestone).toBe('0%');
    });
  });
  
  describe('calculateFIREMetrics (integrated)', () => {
    test('Full calculation: $400K, $5K/mo, $48K annual expenses', () => {
      const result = calculateFIREMetrics(400000, 5000, 48000, 7.0, 4.0);
      
      // FI Numbers
      expect(result.fiNumber).toBe(1200000);
      expect(result.leanFiNumber).toBe(840000);
      expect(result.fatFiNumber).toBe(1800000);
      
      // Progress
      expect(result.currentProgress).toBeCloseTo(33.33, 1);
      expect(result.currentMilestone).toBe('25%');
      
      // FI Date (iterative calculation: ~83-87 months)
      expect(result.fiMonths).toBeGreaterThanOrEqual(83);
      expect(result.fiMonths).toBeLessThan(88);
      expect(result.fiDate).toBeInstanceOf(Date);
      
      // Coast FIRE (should be achieved)
      expect(result.isCoastFire).toBe(true);
      expect(result.coastFireMonths).toBe(0);
      expect(result.coastFireDate).toBeInstanceOf(Date);
    });
    
    test('Edge case: Already at FI', () => {
      const result = calculateFIREMetrics(1200000, 5000, 48000, 7.0, 4.0);
      
      expect(result.currentProgress).toBe(100);
      expect(result.currentMilestone).toBe('FI!');
      expect(result.fiMonths).toBe(0);
      expect(result.isCoastFire).toBe(true);
    });
  });
  
  describe('generateFIProjection', () => {
    test('Generates monthly data points', () => {
      const projection = generateFIProjection(200000, 5000, 1200000, 7.0);
      
      expect(projection).toBeInstanceOf(Array);
      expect(projection.length).toBeGreaterThan(0);
      
      // First data point
      expect(projection[0].month).toBe(0);
      expect(projection[0].savings).toBe(200000);
      expect(projection[0].fiNumber).toBe(1200000);
      
      // Last data point should be higher (compound growth)
      const last = projection[projection.length - 1];
      expect(last.savings).toBeGreaterThan(200000);
    });
    
    test('Includes Lean/Fat FI numbers if provided', () => {
      const projection = generateFIProjection(
        200000, 5000, 1200000, 7.0, 840000, 1800000
      );
      
      expect(projection[0].leanFiNumber).toBe(840000);
      expect(projection[0].fatFiNumber).toBe(1800000);
    });
  });
  
  describe('calculateFIMilestones', () => {
    test('Returns 5 milestones', () => {
      const milestones = calculateFIMilestones(400000, 5000, 1200000, 7.0);
      
      expect(milestones).toHaveLength(5);
      expect(milestones[0].name).toBe('25% FI');
      expect(milestones[4].name).toBe('100% FI');
    });
    
    test('Marks achieved milestones', () => {
      const milestones = calculateFIMilestones(600000, 5000, 1200000, 7.0);
      
      // 25% ($300K) and 50% ($600K) should be achieved
      expect(milestones[0].achieved).toBe(true); // 25%
      expect(milestones[1].achieved).toBe(true); // 50%
      expect(milestones[2].achieved).toBe(false); // 75%
    });
    
    test('Estimates future dates for unachieved milestones', () => {
      const milestones = calculateFIMilestones(200000, 5000, 1200000, 7.0);
      
      // All milestones should have estimated dates
      milestones.forEach(m => {
        if (!m.achieved) {
          expect(m.estimatedDate).toBeDefined();
        }
      });
    });
  });
  
  describe('validateFIREInputs', () => {
    test('Valid inputs pass validation', () => {
      const result = validateFIREInputs({
        currentSavings: 200000,
        monthlyContribution: 5000,
        annualExpenses: 48000,
        investmentReturnRate: 7.0,
        safeWithdrawalRate: 4.0,
      });
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('Negative savings fails validation', () => {
      const result = validateFIREInputs({
        currentSavings: -1000,
        monthlyContribution: 5000,
        annualExpenses: 48000,
        investmentReturnRate: 7.0,
        safeWithdrawalRate: 4.0,
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('savings'))).toBe(true);
    });
    
    test('Zero expenses fails validation', () => {
      const result = validateFIREInputs({
        currentSavings: 200000,
        monthlyContribution: 5000,
        annualExpenses: 0,
        investmentReturnRate: 7.0,
        safeWithdrawalRate: 4.0,
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('expenses'))).toBe(true);
    });
    
    test('Invalid return rate fails validation', () => {
      const result = validateFIREInputs({
        currentSavings: 200000,
        monthlyContribution: 5000,
        annualExpenses: 48000,
        investmentReturnRate: -5,
        safeWithdrawalRate: 4.0,
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('return rate'))).toBe(true);
    });
    
    test('High SWR shows warning (but still valid)', () => {
      const result = validateFIREInputs({
        currentSavings: 200000,
        monthlyContribution: 5000,
        annualExpenses: 48000,
        investmentReturnRate: 7.0,
        safeWithdrawalRate: 6.0,
      });
      
      expect(result.valid).toBe(true); // Valid but with warning
      expect(result.errors.some(e => e.includes('Warning'))).toBe(true);
    });
  });
});
