/**
 * Phase Calculator Tests
 * 
 * Comprehensive tests for phase-based runway calculation.
 * Tests cover: basic calculations, edge cases, gaps, overlaps, validation.
 */

import {
  calculateRunwayWithPhases,
  validatePhases,
  calculatePhaseTotalBurn,
} from '../phaseCalculator'
import { Phase } from '@/app/types'

describe('Phase Calculator', () => {
  describe('calculateRunwayWithPhases', () => {
    it('should calculate simple single phase', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Travel',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 20000,
        phases,
      })

      expect(result.runway).toBe(6) // $20k / $3k = 6.67 months, but only 6 months in phase
      expect(result.totalBurn).toBe(18000) // 6 * $3k
      expect(result.phaseBreakdown).toHaveLength(1)
      expect(result.phaseBreakdown[0].totalBurn).toBe(18000)
    })

    it('should handle multiple consecutive phases', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Travel',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'user1',
          name: 'Bootcamp',
          startMonth: 6,
          endMonth: 9,
          monthlyExpenses: 2500,
          monthlyIncome: 0,
          oneTimeExpenses: [{ name: 'Tuition', amount: 6000, month: 0 }],
          phaseOrder: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 30000,
        phases,
      })

      // Phase 1: 6 * $3k = $18k
      // Phase 2: 3 * $2.5k + $6k = $13.5k
      // Total: $31.5k (will complete all phases since we have $30k)
      expect(result.totalBurn).toBe(31500)
      expect(result.phaseBreakdown).toHaveLength(2)
    })

    it('should handle one-time expenses correctly', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Travel',
          startMonth: 0,
          endMonth: 3,
          monthlyExpenses: 2000,
          monthlyIncome: 0,
          oneTimeExpenses: [
            { name: 'Flights', amount: 2500, month: 0 },
            { name: 'Visa', amount: 500, month: 1 },
          ],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 10000,
        phases,
      })

      // Month 0: $2000 + $2500 = $4500
      // Month 1: $2000 + $500 = $2500
      // Month 2: $2000
      // Total: $9000
      expect(result.totalBurn).toBe(9000)
      expect(result.monthlyData[0].expenses).toBe(4500)
      expect(result.monthlyData[1].expenses).toBe(2500)
      expect(result.monthlyData[2].expenses).toBe(2000)
    })

    it('should handle income correctly', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Job Hunt',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 3500,
          monthlyIncome: 500, // Freelance
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 20000,
        phases,
      })

      // Net burn: ($3500 - $500) * 6 = $18000
      expect(result.totalBurn).toBe(21000) // Total expenses (not net)
      expect(result.monthlyData[0].income).toBe(500)
      expect(result.monthlyData[0].netChange).toBe(-3000) // $500 - $3500
    })

    it('should handle gaps between phases', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Phase 1',
          startMonth: 0,
          endMonth: 3,
          monthlyExpenses: 2000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'user1',
          name: 'Phase 2',
          startMonth: 6, // Gap: months 3-6
          endMonth: 9,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 30000,
        phases,
        defaultMonthlyExpenses: 2500, // For gap
      })

      // Phase 1: 3 * $2k = $6k
      // Gap: 3 * $2.5k = $7.5k
      // Phase 2: 3 * $3k = $9k
      // Total: $22.5k
      expect(result.totalBurn).toBe(22500)
      expect(result.runway).toBe(9)
    })

    it('should stop when savings depleted', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Expensive Phase',
          startMonth: 0,
          endMonth: 12,
          monthlyExpenses: 5000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 20000, // Only 4 months
        phases,
      })

      expect(result.runway).toBe(4) // $20k / $5k = 4 months
      expect(result.monthlyData).toHaveLength(4)
    })

    it('should find breakeven month correctly', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Low Income',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 3000,
          monthlyIncome: 1000,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'user1',
          name: 'Sustainable',
          startMonth: 6,
          endMonth: 12,
          monthlyExpenses: 3000,
          monthlyIncome: 3500, // Income > Expenses
          oneTimeExpenses: [],
          phaseOrder: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 20000,
        phases,
      })

      expect(result.breakevenMonth).toBe(6) // First month of Phase 2
    })

    it('should handle empty phases', () => {
      const result = calculateRunwayWithPhases({
        totalSavings: 10000,
        phases: [],
      })

      expect(result.runway).toBe(0)
      expect(result.totalBurn).toBe(0)
      expect(result.monthlyData).toHaveLength(0)
      expect(result.phaseBreakdown).toHaveLength(0)
    })

    it('should sort phases by start month', () => {
      const phases: Phase[] = [
        {
          id: '2',
          userId: 'user1',
          name: 'Second',
          startMonth: 6,
          endMonth: 9,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '1',
          userId: 'user1',
          name: 'First',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 2000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 30000,
        phases,
      })

      expect(result.phaseBreakdown[0].phaseName).toBe('First')
      expect(result.phaseBreakdown[1].phaseName).toBe('Second')
    })
  })

  describe('validatePhases', () => {
    it('should validate correct phases', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Phase 1',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = validatePhases(phases)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid duration', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Invalid',
          startMonth: 6,
          endMonth: 3, // End before start
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = validatePhases(phases)
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('end month must be after start month')
    })

    it('should detect overlapping phases', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Phase 1',
          startMonth: 0,
          endMonth: 6,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'user1',
          name: 'Phase 2',
          startMonth: 4, // Overlaps with Phase 1
          endMonth: 8,
          monthlyExpenses: 2000,
          monthlyIncome: 0,
          oneTimeExpenses: [],
          phaseOrder: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = validatePhases(phases)
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('overlap')
    })

    it('should detect negative values', () => {
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'user1',
          name: 'Negative',
          startMonth: -1, // Negative start
          endMonth: 6,
          monthlyExpenses: -100, // Negative expenses
          monthlyIncome: -50, // Negative income
          oneTimeExpenses: [],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = validatePhases(phases)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should enforce max 10 phases', () => {
      const phases: Phase[] = Array.from({ length: 11 }, (_, i) => ({
        id: `${i}`,
        userId: 'user1',
        name: `Phase ${i}`,
        startMonth: i * 3,
        endMonth: (i + 1) * 3,
        monthlyExpenses: 2000,
        monthlyIncome: 0,
        oneTimeExpenses: [],
        phaseOrder: i,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }))

      const result = validatePhases(phases)
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('Maximum 10 phases')
    })
  })

  describe('calculatePhaseTotalBurn', () => {
    it('should calculate total burn correctly', () => {
      const phase: Phase = {
        id: '1',
        userId: 'user1',
        name: 'Travel',
        startMonth: 0,
        endMonth: 6,
        monthlyExpenses: 3000,
        monthlyIncome: 0,
        oneTimeExpenses: [
          { name: 'Flights', amount: 2500, month: 0 },
          { name: 'Visa', amount: 500, month: 1 },
        ],
        phaseOrder: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      const total = calculatePhaseTotalBurn(phase)
      // 6 months * $3000 + $2500 + $500 = $21000
      expect(total).toBe(21000)
    })

    it('should handle phase with no one-time expenses', () => {
      const phase: Phase = {
        id: '1',
        userId: 'user1',
        name: 'Simple',
        startMonth: 0,
        endMonth: 3,
        monthlyExpenses: 2000,
        monthlyIncome: 0,
        oneTimeExpenses: [],
        phaseOrder: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      const total = calculatePhaseTotalBurn(phase)
      expect(total).toBe(6000) // 3 * $2000
    })
  })

  describe('Real-world scenarios', () => {
    it('should handle Emma Rodriguez scenario (Sabbatical Planner)', () => {
      // Emma: 3mo Travel $3K, 3mo Course $2.5K + $6K, 6mo Job Hunt $3.5K
      const phases: Phase[] = [
        {
          id: '1',
          userId: 'emma',
          name: 'Travel Asia',
          startMonth: 0,
          endMonth: 3,
          monthlyExpenses: 3000,
          monthlyIncome: 0,
          oneTimeExpenses: [{ name: 'Flights', amount: 2500, month: 0 }],
          phaseOrder: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          userId: 'emma',
          name: 'Online Course',
          startMonth: 3,
          endMonth: 6,
          monthlyExpenses: 2500,
          monthlyIncome: 0,
          oneTimeExpenses: [{ name: 'Bootcamp', amount: 6000, month: 0 }],
          phaseOrder: 1,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '3',
          userId: 'emma',
          name: 'Job Hunt',
          startMonth: 6,
          endMonth: 12,
          monthlyExpenses: 3500,
          monthlyIncome: 500, // Freelance
          oneTimeExpenses: [],
          phaseOrder: 2,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      const result = calculateRunwayWithPhases({
        totalSavings: 40000,
        phases,
      })

      // Phase 1: 3 * $3k + $2.5k = $11.5k
      // Phase 2: 3 * $2.5k + $6k = $13.5k
      // Phase 3: 6 * ($3.5k - $0.5k) = $18k (net)
      // Total: $11.5k + $13.5k + $18k = $43k, but only $40k available
      // So savings run out around month 11
      expect(result.runway).toBe(11)
      expect(result.phaseBreakdown).toHaveLength(3)
    })
  })
})
