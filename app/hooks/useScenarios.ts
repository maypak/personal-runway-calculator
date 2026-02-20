import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Scenario, OneTimeExpense, RecurringItem } from '../types';

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScenarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setScenarios([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('scenarios')
        .select('*')
        .order('is_base', { ascending: false })
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Convert snake_case to camelCase
      const scenariosData: Scenario[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        description: row.description,
        isBase: row.is_base,
        totalSavings: row.total_savings,
        monthlyExpenses: row.monthly_expenses,
        monthlyIncome: row.monthly_income,
        oneTimeExpenses: row.one_time_expenses || [],
        recurringItems: row.recurring_items || [],
        calculatedRunway: row.calculated_runway,
        calculatedBurnRate: row.calculated_burn_rate,
        calculatedBreakevenMonth: row.calculated_breakeven_month,
        calculatedEndSavings: row.calculated_end_savings,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      setScenarios(scenariosData);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Context-compatible createScenario (name, basedOnId?)
  const createScenario = useCallback(async (
    name: string,
    basedOnId?: string
  ): Promise<{ success: boolean; data?: Scenario; error?: string }> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      let totalSavings = 0;
      let monthlyExpenses = 0;
      let monthlyIncome = 0;
      let oneTimeExpenses: OneTimeExpense[] = [];
      let recurringItems: RecurringItem[] = [];

      // If basedOnId provided, duplicate that scenario
      if (basedOnId) {
        const baseScenario = scenarios.find(s => s.id === basedOnId);
        if (baseScenario) {
          totalSavings = baseScenario.totalSavings;
          monthlyExpenses = baseScenario.monthlyExpenses;
          monthlyIncome = baseScenario.monthlyIncome;
          oneTimeExpenses = [...baseScenario.oneTimeExpenses];
          recurringItems = [...baseScenario.recurringItems];
        }
      } else {
        // Otherwise, use current financial settings
        const { data: settings } = await supabase
          .from('financial_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settings) {
          totalSavings = (settings.current_savings || 0) + (settings.lump_sum || 0);
          monthlyExpenses = (settings.monthly_fixed || 0) + (settings.monthly_variable || 0);
          monthlyIncome = settings.monthly_income || 0;
        }
      }

      // Calculate runway
      const runway = monthlyExpenses > 0
        ? totalSavings / monthlyExpenses
        : 999;
      const burnRate = monthlyExpenses - monthlyIncome;

      const { data, error: insertError } = await supabase
        .from('scenarios')
        .insert({
          user_id: user.id,
          name,
          is_base: false,
          total_savings: totalSavings,
          monthly_expenses: monthlyExpenses,
          monthly_income: monthlyIncome,
          one_time_expenses: oneTimeExpenses,
          recurring_items: recurringItems,
          calculated_runway: runway,
          calculated_burn_rate: burnRate,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await loadScenarios();

      const scenarioData: Scenario = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description,
        isBase: data.is_base,
        totalSavings: data.total_savings,
        monthlyExpenses: data.monthly_expenses,
        monthlyIncome: data.monthly_income,
        oneTimeExpenses: data.one_time_expenses || [],
        recurringItems: data.recurring_items || [],
        calculatedRunway: data.calculated_runway,
        calculatedBurnRate: data.calculated_burn_rate,
        calculatedBreakevenMonth: data.calculated_breakeven_month,
        calculatedEndSavings: data.calculated_end_savings,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return { success: true, data: scenarioData };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create scenario';
      console.error('Error creating scenario:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [scenarios, loadScenarios]);

  // Context-compatible updateScenario
  const updateScenario = useCallback(async (
    id: string,
    updates: Partial<Scenario>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      // Convert camelCase to snake_case for Supabase
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.totalSavings !== undefined) dbUpdates.total_savings = updates.totalSavings;
      if (updates.monthlyExpenses !== undefined) dbUpdates.monthly_expenses = updates.monthlyExpenses;
      if (updates.monthlyIncome !== undefined) dbUpdates.monthly_income = updates.monthlyIncome;
      if (updates.oneTimeExpenses) dbUpdates.one_time_expenses = updates.oneTimeExpenses;
      if (updates.recurringItems) dbUpdates.recurring_items = updates.recurringItems;

      // Recalculate if financial data changed
      if (
        updates.totalSavings !== undefined ||
        updates.monthlyExpenses !== undefined ||
        updates.monthlyIncome !== undefined
      ) {
        const scenario = scenarios.find(s => s.id === id);
        if (scenario) {
          const savings = updates.totalSavings ?? scenario.totalSavings;
          const expenses = updates.monthlyExpenses ?? scenario.monthlyExpenses;
          const income = updates.monthlyIncome ?? scenario.monthlyIncome;

          dbUpdates.calculated_runway = expenses > 0 ? savings / expenses : 999;
          dbUpdates.calculated_burn_rate = expenses - income;
        }
      }

      const { error: updateError } = await supabase
        .from('scenarios')
        .update(dbUpdates)
        .eq('id', id);

      if (updateError) throw updateError;

      await loadScenarios();
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update scenario';
      console.error('Error updating scenario:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [scenarios, loadScenarios]);

  // Context-compatible deleteScenario
  const deleteScenario = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const scenario = scenarios.find(s => s.id === id);
      if (scenario?.isBase) {
        const errorMsg = 'Cannot delete base scenario';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const { error: deleteError } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadScenarios();
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete scenario';
      console.error('Error deleting scenario:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [scenarios, loadScenarios]);

  useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  return {
    scenarios,
    loading,
    error,
    loadScenarios,
    createScenario,
    updateScenario,
    deleteScenario,
  };
}

// Re-export types
export type { Scenario, OneTimeExpense, RecurringItem };
