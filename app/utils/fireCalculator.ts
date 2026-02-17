/**
 * FIRE Calculator - Financial Independence, Retire Early Calculations
 * 
 * Purpose: Calculate FI Number, FI Date, Coast FIRE, and related metrics
 * Principles (CLAUDE.md):
 * - Financial accuracy is critical (verified against Excel)
 * - Simple, testable, well-documented
 * - 4% Rule: FI Number = Annual Expenses × 25
 * - Compound interest with monthly contributions
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import type { FIRECalculationResult, FIProjectionDataPoint, FIMilestone } from '../types';

/**
 * Calculate FI Number using the 4% Rule
 * 
 * Formula: FI Number = Annual Expenses / (Safe Withdrawal Rate / 100)
 * Example: $48,000 annual expenses ÷ 4% = $1,200,000
 * 
 * @param annualExpenses - Total annual expenses
 * @param safeWithdrawalRate - SWR percentage (default: 4.0 for 4% rule)
 * @returns FI Number (target portfolio size)
 */
export function calculateFINumber(
  annualExpenses: number,
  safeWithdrawalRate: number = 4.0
): number {
  if (annualExpenses <= 0) {
    throw new Error('Annual expenses must be greater than 0');
  }
  if (safeWithdrawalRate <= 0 || safeWithdrawalRate > 100) {
    throw new Error('Safe withdrawal rate must be between 0 and 100');
  }
  
  // FI Number = Annual Expenses / (SWR / 100)
  // Example: $48,000 / 0.04 = $1,200,000
  return annualExpenses / (safeWithdrawalRate / 100);
}

/**
 * Calculate Lean FI Number (70% of current expenses)
 * 
 * @param annualExpenses - Current annual expenses
 * @param safeWithdrawalRate - SWR percentage (default: 4.0)
 * @returns Lean FI Number
 */
export function calculateLeanFINumber(
  annualExpenses: number,
  safeWithdrawalRate: number = 4.0
): number {
  return calculateFINumber(annualExpenses * 0.7, safeWithdrawalRate);
}

/**
 * Calculate Fat FI Number (150% of current expenses)
 * 
 * @param annualExpenses - Current annual expenses
 * @param safeWithdrawalRate - SWR percentage (default: 4.0)
 * @returns Fat FI Number
 */
export function calculateFatFINumber(
  annualExpenses: number,
  safeWithdrawalRate: number = 4.0
): number {
  return calculateFINumber(annualExpenses * 1.5, safeWithdrawalRate);
}

/**
 * Calculate FI Date using compound interest with monthly contributions
 * 
 * Formula (iterative):
 * balance(n+1) = balance(n) × (1 + r) + monthlyContribution
 * where r = annualReturnRate / 12
 * 
 * @param currentSavings - Current portfolio/savings balance
 * @param monthlyContribution - Monthly savings amount
 * @param targetFINumber - Target FI Number to reach
 * @param annualReturnRate - Expected annual return rate % (default: 7.0)
 * @returns Object with months until FI and projected date
 */
export function calculateFIDate(
  currentSavings: number,
  monthlyContribution: number,
  targetFINumber: number,
  annualReturnRate: number = 7.0
): { months: number; date: Date | null } {
  // Edge case: Already at FI
  if (currentSavings >= targetFINumber) {
    return { months: 0, date: new Date() };
  }
  
  // Edge case: No growth (0% return, 0 monthly contribution)
  if (annualReturnRate <= 0 && monthlyContribution <= 0) {
    return { months: Infinity, date: null };
  }
  
  // Edge case: Negative monthly contribution (spending more than earning)
  // Allow this calculation but limit to reasonable timeframe
  if (monthlyContribution < 0) {
    const monthlyLoss = Math.abs(monthlyContribution);
    const monthsUntilBroke = currentSavings / monthlyLoss;
    if (monthsUntilBroke < 1200) { // Less than 100 years
      return { months: Infinity, date: null };
    }
  }
  
  const monthlyRate = annualReturnRate / 100 / 12;
  let balance = currentSavings;
  let months = 0;
  
  // Safety limit: Max 100 years (1200 months)
  const MAX_MONTHS = 1200;
  
  // Iterative compound interest calculation
  // More accurate than closed-form formula for monthly contributions
  while (balance < targetFINumber && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months++;
  }
  
  // If exceeds max months, FI is not achievable in reasonable timeframe
  if (months >= MAX_MONTHS) {
    return { months: Infinity, date: null };
  }
  
  // Calculate projected date
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  
  return { months, date };
}

/**
 * Calculate Coast FIRE status
 * 
 * Coast FIRE = current savings will grow to FI Number by retirement age
 * without additional contributions
 * 
 * Formula: FV = PV × (1 + r)^n
 * where:
 * - FV = Future Value (target FI Number)
 * - PV = Present Value (current savings)
 * - r = annual return rate
 * - n = years until retirement
 * 
 * @param currentSavings - Current portfolio balance
 * @param targetFINumber - Target FI Number
 * @param annualReturnRate - Expected annual return rate % (default: 7.0)
 * @param yearsUntilRetirement - Years until traditional retirement age (default: 30)
 * @returns Object with achieved status and years needed
 */
export function calculateCoastFIRE(
  currentSavings: number,
  targetFINumber: number,
  annualReturnRate: number = 7.0,
  yearsUntilRetirement: number = 30
): { 
  achieved: boolean; 
  yearsNeeded: number;
  projectedAmount: number;
} {
  // Edge case: Already at FI Number
  if (currentSavings >= targetFINumber) {
    return { 
      achieved: true, 
      yearsNeeded: 0,
      projectedAmount: currentSavings
    };
  }
  
  // Edge case: No return rate
  if (annualReturnRate <= 0) {
    return { 
      achieved: false, 
      yearsNeeded: Infinity,
      projectedAmount: currentSavings
    };
  }
  
  // Calculate future value if savings grow without contributions
  // FV = PV × (1 + r)^n
  const futureValue = currentSavings * Math.pow(
    1 + (annualReturnRate / 100),
    yearsUntilRetirement
  );
  
  if (futureValue >= targetFINumber) {
    // Already Coast FIRE! Current savings will grow to FI Number
    return { 
      achieved: true, 
      yearsNeeded: 0,
      projectedAmount: futureValue
    };
  }
  
  // Calculate years needed to reach Coast FIRE point
  // Solve for n: targetFINumber = currentSavings × (1 + r)^n
  // n = ln(targetFINumber / currentSavings) / ln(1 + r)
  const yearsNeeded = Math.log(targetFINumber / currentSavings) / 
                      Math.log(1 + (annualReturnRate / 100));
  
  return { 
    achieved: false, 
    yearsNeeded: Math.max(0, yearsNeeded),
    projectedAmount: futureValue
  };
}

/**
 * Calculate FI Progress (percentage and milestone)
 * 
 * @param currentSavings - Current portfolio balance
 * @param fiNumber - Target FI Number
 * @returns Progress percentage and current milestone
 */
export function calculateFIProgress(
  currentSavings: number,
  fiNumber: number
): {
  percentage: number;
  milestone: string;
} {
  if (fiNumber <= 0) {
    return { percentage: 0, milestone: '0%' };
  }
  
  const percentage = (currentSavings / fiNumber) * 100;
  
  let milestone = '0%';
  if (percentage >= 100) {
    milestone = 'FI!';
  } else if (percentage >= 90) {
    milestone = 'Coast FIRE';
  } else if (percentage >= 75) {
    milestone = '75%';
  } else if (percentage >= 50) {
    milestone = '50%';
  } else if (percentage >= 25) {
    milestone = '25%';
  }
  
  return { percentage, milestone };
}

/**
 * Calculate all FIRE metrics at once (convenience function)
 * 
 * @param currentSavings - Current portfolio/savings balance
 * @param monthlyContribution - Monthly savings amount
 * @param annualExpenses - Annual expenses
 * @param investmentReturnRate - Expected annual return rate % (default: 7.0)
 * @param safeWithdrawalRate - SWR percentage (default: 4.0)
 * @returns Complete FIRE calculation result
 */
export function calculateFIREMetrics(
  currentSavings: number,
  monthlyContribution: number,
  annualExpenses: number,
  investmentReturnRate: number = 7.0,
  safeWithdrawalRate: number = 4.0
): FIRECalculationResult {
  // Calculate FI Numbers
  const fiNumber = calculateFINumber(annualExpenses, safeWithdrawalRate);
  const leanFiNumber = calculateLeanFINumber(annualExpenses, safeWithdrawalRate);
  const fatFiNumber = calculateFatFINumber(annualExpenses, safeWithdrawalRate);
  
  // Calculate progress
  const { percentage: currentProgress, milestone: currentMilestone } = 
    calculateFIProgress(currentSavings, fiNumber);
  
  // Calculate FI Date
  const { months: fiMonths, date: fiDate } = calculateFIDate(
    currentSavings,
    monthlyContribution,
    fiNumber,
    investmentReturnRate
  );
  
  // Calculate Coast FIRE
  const coastFire = calculateCoastFIRE(
    currentSavings,
    fiNumber,
    investmentReturnRate,
    30 // Assume 30 years until traditional retirement
  );
  
  const coastFireMonths = coastFire.achieved ? 0 : Math.ceil(coastFire.yearsNeeded * 12);
  const coastFireDate = coastFire.achieved 
    ? new Date() 
    : (coastFireMonths < 1200 
        ? (() => {
            const date = new Date();
            date.setMonth(date.getMonth() + coastFireMonths);
            return date;
          })()
        : null);
  
  // Calculate monthly contribution needed to maintain current trajectory
  // (This is just the current contribution for now - could be enhanced)
  const monthlyContributionNeeded = monthlyContribution;
  
  return {
    fiNumber,
    leanFiNumber,
    fatFiNumber,
    currentProgress,
    currentMilestone,
    fiDate,
    fiMonths,
    coastFireDate,
    coastFireMonths,
    isCoastFire: coastFire.achieved,
    monthlyContributionNeeded,
  };
}

/**
 * Generate projection data for charting
 * 
 * @param currentSavings - Current balance
 * @param monthlyContribution - Monthly savings
 * @param fiNumber - Target FI Number
 * @param investmentReturnRate - Annual return rate %
 * @param leanFiNumber - Lean FI target (optional)
 * @param fatFiNumber - Fat FI target (optional)
 * @param maxMonths - Number of months to project (default: 120 = 10 years)
 * @returns Array of monthly projection data points
 */
export function generateFIProjection(
  currentSavings: number,
  monthlyContribution: number,
  fiNumber: number,
  investmentReturnRate: number = 7.0,
  leanFiNumber?: number,
  fatFiNumber?: number,
  maxMonths: number = 120
): FIProjectionDataPoint[] {
  const data: FIProjectionDataPoint[] = [];
  const monthlyRate = investmentReturnRate / 100 / 12;
  let balance = currentSavings;
  
  // Generate data points (sample every 3 months for performance)
  for (let month = 0; month <= maxMonths; month += 3) {
    data.push({
      month,
      savings: balance,
      fiNumber,
      leanFiNumber,
      fatFiNumber,
    });
    
    // Calculate next 3 months
    for (let i = 0; i < 3; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      
      // Stop if we've far exceeded FI Number (150% for Fat FIRE)
      if (fatFiNumber && balance > fatFiNumber * 1.5) {
        return data;
      }
    }
  }
  
  return data;
}

/**
 * Calculate FI milestones (25%, 50%, 75%, Coast, FI)
 * 
 * @param currentSavings - Current balance
 * @param monthlyContribution - Monthly savings
 * @param fiNumber - Target FI Number
 * @param investmentReturnRate - Annual return rate %
 * @returns Array of milestones with achievement status
 */
export function calculateFIMilestones(
  currentSavings: number,
  monthlyContribution: number,
  fiNumber: number,
  investmentReturnRate: number = 7.0
): FIMilestone[] {
  const milestones: FIMilestone[] = [
    { name: '25% FI', targetAmount: fiNumber * 0.25, achieved: false },
    { name: '50% FI', targetAmount: fiNumber * 0.50, achieved: false },
    { name: '75% FI', targetAmount: fiNumber * 0.75, achieved: false },
    { name: '90% (Coast FIRE)', targetAmount: fiNumber * 0.90, achieved: false },
    { name: '100% FI', targetAmount: fiNumber, achieved: false },
  ];
  
  milestones.forEach(milestone => {
    if (currentSavings >= milestone.targetAmount) {
      // Already achieved
      milestone.achieved = true;
      milestone.achievedDate = new Date().toISOString().split('T')[0]; // Today (estimate)
    } else {
      // Calculate estimated date
      const { months, date } = calculateFIDate(
        currentSavings,
        monthlyContribution,
        milestone.targetAmount,
        investmentReturnRate
      );
      
      if (date && months < 1200) {
        milestone.estimatedDate = date.toISOString().split('T')[0];
      }
    }
  });
  
  return milestones;
}

/**
 * Validate FIRE calculation inputs
 * 
 * @param inputs - Object with calculation inputs
 * @returns Validation result with error messages if any
 */
export function validateFIREInputs(inputs: {
  currentSavings: number;
  monthlyContribution: number;
  annualExpenses: number;
  investmentReturnRate: number;
  safeWithdrawalRate: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (inputs.currentSavings < 0) {
    errors.push('Current savings cannot be negative');
  }
  
  if (inputs.annualExpenses <= 0) {
    errors.push('Annual expenses must be greater than 0');
  }
  
  if (inputs.investmentReturnRate < 0 || inputs.investmentReturnRate > 50) {
    errors.push('Investment return rate must be between 0% and 50%');
  }
  
  if (inputs.safeWithdrawalRate <= 0 || inputs.safeWithdrawalRate > 100) {
    errors.push('Safe withdrawal rate must be between 0% and 100%');
  }
  
  // Warning (not error): Very low return rate
  if (inputs.investmentReturnRate < 1 && inputs.investmentReturnRate > 0) {
    errors.push('Warning: Investment return rate below 1% may not be realistic');
  }
  
  // Warning: Very high SWR
  if (inputs.safeWithdrawalRate > 5) {
    errors.push('Warning: Safe withdrawal rate above 5% may be risky');
  }
  
  return {
    valid: errors.filter(e => !e.startsWith('Warning:')).length === 0,
    errors,
  };
}
