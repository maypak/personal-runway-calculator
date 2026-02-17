/**
 * useScenarios Hook - Scenario CRUD Operations
 * 
 * Purpose: Manage financial scenarios (Create, Read, Update, Delete)
 * Pattern: Mirrors useSupabaseFinance.ts structure
 * 
 * Features:
 * - Load user's scenarios
 * - Create scenario (clone from existing or base financial settings)
 * - Update scenario (with automatic recalculation)
 * - Delete scenario (except base)
 * - Free tier limit enforcement (max 1 non-base scenario)
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Scenario, OneTimeExpense, RecurringItem } from '../types';
import { calculateRunway, validateScenario } from '../utils/runwayCalculator';

export function useScenarios() {
  const { user, loading: authLoading } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load scenarios from database
   */
  const loadScenarios = async () => {
    console.log('🔍 [useScenarios] Loading scenarios...');
    
    if (!user) {
      console.warn('⚠️ [useScenarios] No user authenticated');
      setScenarios([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('scenarios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      console.log('🔍 [useScenarios] Loaded', data?.length || 0, 'scenarios');

      if (data) {
        const parsedScenarios: Scenario[] = data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          description: row.description || undefined,
          isBase: row.is_base,
          totalSavings: Number(row.total_savings),
          monthlyExpenses: Number(row.monthly_expenses),
          monthlyIncome: Number(row.monthly_income),
          oneTimeExpenses: (row.one_time_expenses as OneTimeExpense[]) || [],
          recurringItems: (row.recurring_items as RecurringItem[]) || [],
          calculatedRunway: row.calculated_runway ? Number(row.calculated_runway) : undefined,
          calculatedBurnRate: row.calculated_burn_rate ? Number(row.calculated_burn_rate) : undefined,
          calculatedBreakevenMonth: row.calculated_breakeven_month ?? undefined,
          calculatedEndSavings: row.calculated_end_savings ? Number(row.calculated_end_savings) : undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        setScenarios(parsedScenarios);
      } else {
        setScenarios([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useScenarios] Failed to load scenarios:', errorMessage);
      setError(errorMessage);
      setScenarios([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new scenario
   * 
   * @param name - Scenario name
   * @param basedOnId - Optional: Clone data from existing scenario or base financial settings
   * @returns Created scenario or null if failed
   */
  const createScenario = async (
    name: string,
    basedOnId?: string
  ): Promise<{ success: boolean; data?: Scenario; error?: string }> => {
    console.log('🔍 [createScenario] Creating scenario:', name, 'basedOn:', basedOnId);

    if (!user) {
      console.error('❌ [createScenario] No user authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    // Free tier limit: Only 1 non-base scenario
    const nonBaseScenarios = scenarios.filter(s => !s.isBase);
    if (nonBaseScenarios.length >= 1) {
      console.warn('⚠️ [createScenario] Free tier limit: Only 1 non-base scenario allowed');
      return { success: false, error: 'Free tier limit: Only 1 scenario allowed. Upgrade to create more.' };
    }

    try {
      // Get base data (from existing scenario or financial settings)
      let baseData: Partial<Scenario>;
      
      if (basedOnId) {
        const baseScenario = scenarios.find(s => s.id === basedOnId);
        if (baseScenario) {
          baseData = {
            totalSavings: baseScenario.totalSavings,
            monthlyExpenses: baseScenario.monthlyExpenses,
            monthlyIncome: baseScenario.monthlyIncome,
            oneTimeExpenses: [...baseScenario.oneTimeExpenses],
            recurringItems: [...baseScenario.recurringItems],
          };
          console.log('🔍 [createScenario] Cloning from scenario:', baseScenario.name);
        } else {
          console.warn('⚠️ [createScenario] Base scenario not found, using defaults');
          baseData = {
            totalSavings: 0,
            monthlyExpenses: 0,
            monthlyIncome: 0,
            oneTimeExpenses: [],
            recurringItems: [],
          };
        }
      } else {
        // Load from finance_settings
        console.log('🔍 [createScenario] Loading from finance_settings');
        const { data: settingsData } = await supabase
          .from('finance_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsData) {
          baseData = {
            totalSavings: Number(settingsData.current_savings) + Number(settingsData.lump_sum),
            monthlyExpenses: Number(settingsData.monthly_fixed) + Number(settingsData.monthly_variable),
            monthlyIncome: Number(settingsData.monthly_income),
            oneTimeExpenses: [],
            recurringItems: [],
          };
          console.log('🔍 [createScenario] Using finance_settings as base');
        } else {
          baseData = {
            totalSavings: 0,
            monthlyExpenses: 0,
            monthlyIncome: 0,
            oneTimeExpenses: [],
            recurringItems: [],
          };
        }
      }

      // Create scenario object for calculation
      const newScenario: Scenario = {
        id: 'temp', // Will be replaced by DB
        userId: user.id,
        name,
        isBase: false,
        totalSavings: baseData.totalSavings || 0,
        monthlyExpenses: baseData.monthlyExpenses || 0,
        monthlyIncome: baseData.monthlyIncome || 0,
        oneTimeExpenses: baseData.oneTimeExpenses || [],
        recurringItems: baseData.recurringItems || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Validate before calculation
      const validation = validateScenario(newScenario);
      if (!validation.valid) {
        console.error('❌ [createScenario] Validation failed:', validation.error);
        return { success: false, error: validation.error };
      }

      // Calculate runway
      const result = calculateRunway(newScenario);

      // Insert into database
      const { data, error: insertError } = await supabase
        .from('scenarios')
        .insert({
          user_id: user.id,
          name,
          is_base: false,
          total_savings: baseData.totalSavings,
          monthly_expenses: baseData.monthlyExpenses,
          monthly_income: baseData.monthlyIncome,
          one_time_expenses: baseData.oneTimeExpenses,
          recurring_items: baseData.recurringItems,
          calculated_runway: result.runway,
          calculated_burn_rate: result.burnRate,
          calculated_breakeven_month: result.breakevenMonth,
          calculated_end_savings: result.endSavings,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('✅ [createScenario] Successfully created scenario:', data.id);

      // Parse and add to state
      const createdScenario: Scenario = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description || undefined,
        isBase: data.is_base,
        totalSavings: Number(data.total_savings),
        monthlyExpenses: Number(data.monthly_expenses),
        monthlyIncome: Number(data.monthly_income),
        oneTimeExpenses: (data.one_time_expenses as OneTimeExpense[]) || [],
        recurringItems: (data.recurring_items as RecurringItem[]) || [],
        calculatedRunway: Number(data.calculated_runway),
        calculatedBurnRate: Number(data.calculated_burn_rate),
        calculatedBreakevenMonth: data.calculated_breakeven_month ?? undefined,
        calculatedEndSavings: Number(data.calculated_end_savings),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setScenarios(prev => [...prev, createdScenario]);

      return { success: true, data: createdScenario };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [createScenario] Failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update an existing scenario
   * 
   * @param id - Scenario ID
   * @param updates - Partial scenario data to update
   * @returns Success status
   */
  const updateScenario = async (
    id: string,
    updates: Partial<Omit<Scenario, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ success: boolean; error?: string }> => {
    console.log('🔍 [updateScenario] Updating scenario:', id, updates);

    if (!user) {
      console.error('❌ [updateScenario] No user authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Get current scenario for recalculation
      const currentScenario = scenarios.find(s => s.id === id);
      if (!currentScenario) {
        console.error('❌ [updateScenario] Scenario not found:', id);
        return { success: false, error: 'Scenario not found' };
      }

      // Merge updates
      const updatedScenario: Scenario = {
        ...currentScenario,
        ...updates,
      };

      // Validate
      const validation = validateScenario(updatedScenario);
      if (!validation.valid) {
        console.error('❌ [updateScenario] Validation failed:', validation.error);
        return { success: false, error: validation.error };
      }

      // Recalculate runway
      const result = calculateRunway(updatedScenario);

      // Prepare database payload
      const dbPayload: Record<string, unknown> = {};
      if (updates.name !== undefined) dbPayload.name = updates.name;
      if (updates.description !== undefined) dbPayload.description = updates.description;
      if (updates.totalSavings !== undefined) dbPayload.total_savings = updates.totalSavings;
      if (updates.monthlyExpenses !== undefined) dbPayload.monthly_expenses = updates.monthlyExpenses;
      if (updates.monthlyIncome !== undefined) dbPayload.monthly_income = updates.monthlyIncome;
      if (updates.oneTimeExpenses !== undefined) dbPayload.one_time_expenses = updates.oneTimeExpenses;
      if (updates.recurringItems !== undefined) dbPayload.recurring_items = updates.recurringItems;

      // Always update calculated values
      dbPayload.calculated_runway = result.runway;
      dbPayload.calculated_burn_rate = result.burnRate;
      dbPayload.calculated_breakeven_month = result.breakevenMonth;
      dbPayload.calculated_end_savings = result.endSavings;

      console.log('🔍 [updateScenario] DB payload:', dbPayload);

      const { error: updateError } = await supabase
        .from('scenarios')
        .update(dbPayload)
        .eq('id', id);

      if (updateError) throw updateError;

      console.log('✅ [updateScenario] Successfully updated scenario');

      // Update state
      setScenarios(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                ...updates,
                calculatedRunway: result.runway,
                calculatedBurnRate: result.burnRate,
                calculatedBreakevenMonth: result.breakevenMonth ?? undefined,
                calculatedEndSavings: result.endSavings,
              }
            : s
        )
      );

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [updateScenario] Failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete a scenario
   * 
   * @param id - Scenario ID
   * @returns Success status
   */
  const deleteScenario = async (id: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔍 [deleteScenario] Deleting scenario:', id);

    if (!user) {
      console.error('❌ [deleteScenario] No user authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    // Don't allow deleting base scenario
    const scenario = scenarios.find(s => s.id === id);
    if (scenario?.isBase) {
      console.error('❌ [deleteScenario] Cannot delete base scenario');
      return { success: false, error: 'Cannot delete base scenario' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      console.log('✅ [deleteScenario] Successfully deleted scenario');

      setScenarios(prev => prev.filter(s => s.id !== id));

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [deleteScenario] Failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Auto-load scenarios when user changes
  useEffect(() => {
    if (user && !authLoading) {
      loadScenarios();
    } else {
      setScenarios([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  return {
    scenarios,
    loading: authLoading || loading,
    error,
    loadScenarios,
    createScenario,
    updateScenario,
    deleteScenario,
  };
}
