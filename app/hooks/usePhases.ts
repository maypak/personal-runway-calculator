/**
 * usePhases Hook
 * 
 * React hook for managing phases in Supabase.
 * Provides CRUD operations and real-time updates.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Phase, PhaseOneTimeExpense } from '@/app/types'
import { validatePhases, calculatePhaseTotalBurn } from '@/app/utils/phaseCalculator'

export interface UsePhasesOptions {
  scenarioId?: string | null
  autoLoad?: boolean
}

export interface UsePhasesReturn {
  phases: Phase[]
  loading: boolean
  error: string | null
  createPhase: (phase: Omit<Phase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Phase | null>
  updatePhase: (id: string, updates: Partial<Phase>) => Promise<Phase | null>
  deletePhase: (id: string) => Promise<boolean>
  reorderPhases: (phaseIds: string[]) => Promise<boolean>
  duplicatePhase: (id: string) => Promise<Phase | null>
  reload: () => Promise<void>
  validate: () => { valid: boolean; errors: string[] }
}

/**
 * Hook to manage phases
 */
export function usePhases(options: UsePhasesOptions = {}): UsePhasesReturn {
  const { scenarioId, autoLoad = true } = options
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load phases from database
   */
  const loadPhases = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('phases')
        .select('*')
        .order('phase_order', { ascending: true })

      // Filter by scenario if provided
      if (scenarioId !== undefined) {
        if (scenarioId === null) {
          query = query.is('scenario_id', null)
        } else {
          query = query.eq('scenario_id', scenarioId)
        }
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      // Map database columns to camelCase
      const mappedPhases: Phase[] = (data || []).map(dbPhase => ({
        id: dbPhase.id,
        userId: dbPhase.user_id,
        scenarioId: dbPhase.scenario_id,
        name: dbPhase.name,
        description: dbPhase.description,
        phaseOrder: dbPhase.phase_order,
        startMonth: dbPhase.start_month,
        endMonth: dbPhase.end_month,
        monthlyExpenses: Number(dbPhase.monthly_expenses),
        monthlyIncome: Number(dbPhase.monthly_income),
        oneTimeExpenses: dbPhase.one_time_expenses as PhaseOneTimeExpense[],
        totalBurn: dbPhase.total_burn ? Number(dbPhase.total_burn) : undefined,
        createdAt: dbPhase.created_at,
        updatedAt: dbPhase.updated_at,
      }))

      setPhases(mappedPhases)
    } catch (err) {
      console.error('Failed to load phases:', err)
      setError(err instanceof Error ? err.message : 'Failed to load phases')
    } finally {
      setLoading(false)
    }
  }, [scenarioId])

  /**
   * Create a new phase
   */
  const createPhase = async (
    phase: Omit<Phase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Phase | null> => {
    try {
      setError(null)

      // Calculate total burn
      const totalBurn = calculatePhaseTotalBurn({
        ...phase,
        id: '',
        userId: '',
        createdAt: '',
        updatedAt: '',
      } as Phase)

      const { data, error: insertError } = await supabase
        .from('phases')
        .insert({
          scenario_id: phase.scenarioId,
          name: phase.name,
          description: phase.description,
          phase_order: phase.phaseOrder,
          start_month: phase.startMonth,
          end_month: phase.endMonth,
          monthly_expenses: phase.monthlyExpenses,
          monthly_income: phase.monthlyIncome,
          one_time_expenses: phase.oneTimeExpenses,
          total_burn: totalBurn,
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      const newPhase: Phase = {
        id: data.id,
        userId: data.user_id,
        scenarioId: data.scenario_id,
        name: data.name,
        description: data.description,
        phaseOrder: data.phase_order,
        startMonth: data.start_month,
        endMonth: data.end_month,
        monthlyExpenses: Number(data.monthly_expenses),
        monthlyIncome: Number(data.monthly_income),
        oneTimeExpenses: data.one_time_expenses,
        totalBurn: Number(data.total_burn),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      setPhases(prev => [...prev, newPhase])
      return newPhase
    } catch (err) {
      console.error('Failed to create phase:', err)
      setError(err instanceof Error ? err.message : 'Failed to create phase')
      return null
    }
  }

  /**
   * Update an existing phase
   */
  const updatePhase = async (
    id: string,
    updates: Partial<Phase>
  ): Promise<Phase | null> => {
    try {
      setError(null)

      // Prepare database update (convert camelCase to snake_case)
      const dbUpdates: any = {}
      if (updates.scenarioId !== undefined) dbUpdates.scenario_id = updates.scenarioId
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.description !== undefined) dbUpdates.description = updates.description
      if (updates.phaseOrder !== undefined) dbUpdates.phase_order = updates.phaseOrder
      if (updates.startMonth !== undefined) dbUpdates.start_month = updates.startMonth
      if (updates.endMonth !== undefined) dbUpdates.end_month = updates.endMonth
      if (updates.monthlyExpenses !== undefined) dbUpdates.monthly_expenses = updates.monthlyExpenses
      if (updates.monthlyIncome !== undefined) dbUpdates.monthly_income = updates.monthlyIncome
      if (updates.oneTimeExpenses !== undefined) dbUpdates.one_time_expenses = updates.oneTimeExpenses

      // Recalculate total burn if financial data changed
      const currentPhase = phases.find(p => p.id === id)
      if (currentPhase) {
        const updatedPhase = { ...currentPhase, ...updates }
        dbUpdates.total_burn = calculatePhaseTotalBurn(updatedPhase)
      }

      const { data, error: updateError } = await supabase
        .from('phases')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const updated: Phase = {
        id: data.id,
        userId: data.user_id,
        scenarioId: data.scenario_id,
        name: data.name,
        description: data.description,
        phaseOrder: data.phase_order,
        startMonth: data.start_month,
        endMonth: data.end_month,
        monthlyExpenses: Number(data.monthly_expenses),
        monthlyIncome: Number(data.monthly_income),
        oneTimeExpenses: data.one_time_expenses,
        totalBurn: Number(data.total_burn),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      setPhases(prev => prev.map(p => (p.id === id ? updated : p)))
      return updated
    } catch (err) {
      console.error('Failed to update phase:', err)
      setError(err instanceof Error ? err.message : 'Failed to update phase')
      return null
    }
  }

  /**
   * Delete a phase
   */
  const deletePhase = async (id: string): Promise<boolean> => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('phases')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      setPhases(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      console.error('Failed to delete phase:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete phase')
      return false
    }
  }

  /**
   * Reorder phases (drag and drop)
   */
  const reorderPhases = async (phaseIds: string[]): Promise<boolean> => {
    try {
      setError(null)

      // Update phase_order for all phases
      const updates = phaseIds.map((id, index) =>
        supabase
          .from('phases')
          .update({ phase_order: index })
          .eq('id', id)
      )

      await Promise.all(updates)

      // Reload to get updated order
      await loadPhases()
      return true
    } catch (err) {
      console.error('Failed to reorder phases:', err)
      setError(err instanceof Error ? err.message : 'Failed to reorder phases')
      return false
    }
  }

  /**
   * Duplicate a phase
   */
  const duplicatePhase = async (id: string): Promise<Phase | null> => {
    try {
      setError(null)

      const original = phases.find(p => p.id === id)
      if (!original) {
        throw new Error('Phase not found')
      }

      // Create duplicate with adjusted name and order
      const duplicate = await createPhase({
        ...original,
        name: `${original.name} (Copy)`,
        phaseOrder: phases.length,
        startMonth: original.endMonth, // Start after original
        endMonth: original.endMonth + (original.endMonth - original.startMonth),
      })

      return duplicate
    } catch (err) {
      console.error('Failed to duplicate phase:', err)
      setError(err instanceof Error ? err.message : 'Failed to duplicate phase')
      return null
    }
  }

  /**
   * Validate current phases
   */
  const validate = (): { valid: boolean; errors: string[] } => {
    return validatePhases(phases)
  }

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadPhases()
    }
  }, [autoLoad, loadPhases])

  return {
    phases,
    loading,
    error,
    createPhase,
    updatePhase,
    deletePhase,
    reorderPhases,
    duplicatePhase,
    reload: loadPhases,
    validate,
  }
}
