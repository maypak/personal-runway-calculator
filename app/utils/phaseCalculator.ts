/**
 * Phase-based Runway Calculator
 * 
 * Calculates runway across multiple phases with different financial patterns.
 * Each phase can have unique monthly expenses, income, and one-time expenses.
 * 
 * Algorithm:
 * 1. Sort phases by start month
 * 2. Fill gaps between phases with default expenses
 * 3. Calculate month-by-month for each phase
 * 4. Handle one-time expenses at specific months
 * 5. Stop when savings depleted or all phases complete
 */

import { Phase, PhaseRunwayResult, PhaseBreakdown, MonthData } from '@/app/types'

export interface PhaseCalculatorOptions {
  totalSavings: number
  phases: Phase[]
  defaultMonthlyExpenses?: number // For gaps between phases
  maxMonths?: number // Safety limit (default: 100)
}

/**
 * Calculate runway with phase-based planning
 */
export function calculateRunwayWithPhases(
  options: PhaseCalculatorOptions
): PhaseRunwayResult {
  const {
    totalSavings,
    phases,
    defaultMonthlyExpenses = 0,
    maxMonths = 100,
  } = options

  // Sort phases by start month
  const sortedPhases = [...phases].sort((a, b) => a.startMonth - b.startMonth)

  let savings = totalSavings
  let currentMonth = 0
  const monthlyData: MonthData[] = []
  const phaseBreakdown: PhaseBreakdown[] = []
  let totalBurn = 0

  // Edge case: no phases
  if (sortedPhases.length === 0) {
    return {
      runway: 0,
      monthlyData: [],
      phaseBreakdown: [],
      totalBurn: 0,
      breakevenMonth: null,
    }
  }

  // Process each phase
  for (let phaseIndex = 0; phaseIndex < sortedPhases.length; phaseIndex++) {
    const phase = sortedPhases[phaseIndex]

    // Fill gap before this phase (if any)
    if (currentMonth < phase.startMonth) {
      const gapResult = processGap(
        currentMonth,
        phase.startMonth,
        savings,
        defaultMonthlyExpenses,
        monthlyData,
        maxMonths
      )
      savings = gapResult.savings
      currentMonth = gapResult.currentMonth
      totalBurn += gapResult.burn

      if (savings <= 0) break
    }

    // Process this phase
    const phaseResult = processPhase(
      phase,
      savings,
      monthlyData,
      maxMonths
    )
    savings = phaseResult.savings
    currentMonth = phaseResult.currentMonth
    totalBurn += phaseResult.totalBurn

    phaseBreakdown.push({
      phaseName: phase.name,
      duration: phase.endMonth - phase.startMonth,
      totalBurn: phaseResult.totalBurn,
      avgMonthlyBurn: phaseResult.totalBurn / (phase.endMonth - phase.startMonth),
      startMonth: phase.startMonth,
      endMonth: phase.endMonth,
    })

    if (savings <= 0) break
  }

  // Calculate breakeven month (when income >= expenses)
  const breakevenMonth = findBreakevenMonth(monthlyData)

  return {
    runway: currentMonth,
    monthlyData,
    phaseBreakdown,
    totalBurn,
    breakevenMonth,
  }
}

/**
 * Process gap between phases (use default expenses)
 */
function processGap(
  startMonth: number,
  endMonth: number,
  initialSavings: number,
  defaultExpenses: number,
  monthlyData: MonthData[],
  maxMonths: number
): { savings: number; currentMonth: number; burn: number } {
  let savings = initialSavings
  let burn = 0

  for (let month = startMonth; month < endMonth && month < maxMonths; month++) {
    const expenses = defaultExpenses
    const income = 0
    const netChange = income - expenses

    savings += netChange
    burn += expenses

    monthlyData.push({
      month,
      savings: Math.max(0, savings),
      income,
      expenses,
      netChange,
    })

    if (savings <= 0) {
      return { savings, currentMonth: month + 1, burn }
    }
  }

  return { savings, currentMonth: endMonth, burn }
}

/**
 * Process a single phase
 */
function processPhase(
  phase: Phase,
  initialSavings: number,
  monthlyData: MonthData[],
  maxMonths: number
): { savings: number; currentMonth: number; totalBurn: number } {
  let savings = initialSavings
  let totalBurn = 0

  for (
    let month = phase.startMonth;
    month < phase.endMonth && month < maxMonths;
    month++
  ) {
    const relativeMonth = month - phase.startMonth

    // Calculate one-time expenses for this month
    const oneTimeExpensesThisMonth = phase.oneTimeExpenses
      .filter((e) => e.month === relativeMonth)
      .reduce((sum, e) => sum + e.amount, 0)

    const income = phase.monthlyIncome
    const expenses = phase.monthlyExpenses + oneTimeExpensesThisMonth
    const netChange = income - expenses

    savings += netChange
    totalBurn += expenses

    monthlyData.push({
      month,
      savings: Math.max(0, savings),
      income,
      expenses,
      netChange,
    })

    if (savings <= 0) {
      return { savings, currentMonth: month + 1, totalBurn }
    }
  }

  return { savings, currentMonth: phase.endMonth, totalBurn }
}

/**
 * Find the month where income >= expenses (sustainable)
 */
function findBreakevenMonth(monthlyData: MonthData[]): number | null {
  for (const data of monthlyData) {
    if (data.income >= data.expenses && data.expenses > 0) {
      return data.month
    }
  }
  return null
}

/**
 * Validate phases (no overlaps, valid ranges)
 */
export function validatePhases(phases: Phase[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check individual phase validity
  for (const phase of phases) {
    if (phase.endMonth <= phase.startMonth) {
      errors.push(`Phase "${phase.name}": end month must be after start month`)
    }
    if (phase.startMonth < 0) {
      errors.push(`Phase "${phase.name}": start month cannot be negative`)
    }
    if (phase.monthlyExpenses < 0) {
      errors.push(`Phase "${phase.name}": monthly expenses cannot be negative`)
    }
    if (phase.monthlyIncome < 0) {
      errors.push(`Phase "${phase.name}": monthly income cannot be negative`)
    }
  }

  // Check for overlaps
  const sortedPhases = [...phases].sort((a, b) => a.startMonth - b.startMonth)
  for (let i = 0; i < sortedPhases.length - 1; i++) {
    const current = sortedPhases[i]
    const next = sortedPhases[i + 1]

    if (current.endMonth > next.startMonth) {
      errors.push(
        `Phases "${current.name}" and "${next.name}" overlap (${current.startMonth}-${current.endMonth} and ${next.startMonth}-${next.endMonth})`
      )
    }
  }

  // Check max phases limit
  if (phases.length > 10) {
    errors.push(`Maximum 10 phases allowed (current: ${phases.length})`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate total burn for a single phase (cached value)
 */
export function calculatePhaseTotalBurn(phase: Phase): number {
  const duration = phase.endMonth - phase.startMonth
  const monthlyBurn = duration * phase.monthlyExpenses
  const oneTimeBurn = phase.oneTimeExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  )
  return monthlyBurn + oneTimeBurn
}
