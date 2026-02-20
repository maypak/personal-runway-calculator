import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { calculateRunway } from '../utils/runwayCalculator';

// Matches Supabase scenarios table structure
export interface Scenario {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_base: boolean;
  
  // Financial data
  total_savings: number;
  monthly_expenses: number;
  monthly_income: number;
  
  // JSONB arrays
  one_time_expenses: OneTimeExpense[];
  recurring_items: RecurringItem[];
  
  // Calculated (cached)
  calculated_runway: number | null;
  calculated_burn_rate: number | null;
  calculated_breakeven_month: number | null;
  calculated_end_savings: number | null;
  
  created_at: string;
  updated_at: string;
}

export interface OneTimeExpense {
  name: string;
  amount: number;
  month: number; // Which month it occurs (0-indexed from start)
}

export interface RecurringItem {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  startMonth: number;
  endMonth: number | null; // null = continues indefinitely
}

export interface CreateScenarioInput {
  name: string;
  description?: string;
  is_base?: boolean;
  total_savings: number;
  monthly_expenses?: number;
  monthly_income?: number;
  one_time_expenses?: OneTimeExpense[];
  recurring_items?: RecurringItem[];
}

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all scenarios for current user
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
        .order('is_base', { ascending: false }) // Base first
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setScenarios(data || []);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new scenario
  const createScenario = useCallback(async (input: CreateScenarioInput): Promise<Scenario | null> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculate runway before saving
      const runway = calculateRunway(
        input.total_savings,
        input.monthly_expenses || 0,
        input.monthly_income || 0
      );

      const burnRate = (input.monthly_expenses || 0) - (input.monthly_income || 0);

      const scenarioData = {
        user_id: user.id,
        name: input.name,
        description: input.description,
        is_base: input.is_base || false,
        total_savings: input.total_savings,
        monthly_expenses: input.monthly_expenses || 0,
        monthly_income: input.monthly_income || 0,
        one_time_expenses: input.one_time_expenses || [],
        recurring_items: input.recurring_items || [],
        calculated_runway: runway,
        calculated_burn_rate: burnRate,
        calculated_breakeven_month: null, // TODO: Calculate with income
        calculated_end_savings: 0, // TODO: Calculate final balance
      };

      const { data, error: insertError } = await supabase
        .from('scenarios')
        .insert(scenarioData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Refresh scenarios list
      await loadScenarios();

      return data;
    } catch (err) {
      console.error('Error creating scenario:', err);
      setError(err instanceof Error ? err.message : 'Failed to create scenario');
      return null;
    }
  }, [loadScenarios]);

  // Update existing scenario
  const updateScenario = useCallback(async (
    id: string,
    updates: Partial<CreateScenarioInput>
  ): Promise<boolean> => {
    try {
      setError(null);

      // Recalculate if financial data changed
      const scenario = scenarios.find(s => s.id === id);
      if (!scenario) throw new Error('Scenario not found');

      const newData: any = { ...updates };

      // If any financial data changed, recalculate
      if (
        updates.total_savings !== undefined ||
        updates.monthly_expenses !== undefined ||
        updates.monthly_income !== undefined
      ) {
        const savings = updates.total_savings ?? scenario.total_savings;
        const expenses = updates.monthly_expenses ?? scenario.monthly_expenses;
        const income = updates.monthly_income ?? scenario.monthly_income;

        const runway = calculateRunway(savings, expenses, income);

        newData.calculated_runway = runway;
        newData.calculated_burn_rate = expenses - income;
      }

      const { error: updateError } = await supabase
        .from('scenarios')
        .update(newData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Refresh scenarios list
      await loadScenarios();

      return true;
    } catch (err) {
      console.error('Error updating scenario:', err);
      setError(err instanceof Error ? err.message : 'Failed to update scenario');
      return false;
    }
  }, [scenarios, loadScenarios]);

  // Delete scenario
  const deleteScenario = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const scenario = scenarios.find(s => s.id === id);
      if (scenario?.is_base) {
        throw new Error('Cannot delete base scenario');
      }

      const { error: deleteError } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Refresh scenarios list
      await loadScenarios();

      return true;
    } catch (err) {
      console.error('Error deleting scenario:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete scenario');
      return false;
    }
  }, [scenarios, loadScenarios]);

  // Create scenario from current financial settings
  const createFromCurrentSettings = useCallback(async (
    name: string,
    description?: string
  ): Promise<Scenario | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch current financial settings
      const { data: settings } = await supabase
        .from('financial_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!settings) throw new Error('No financial settings found');

      // Convert financial_settings to scenario format
      const totalSavings = (settings.current_savings || 0) + (settings.lump_sum || 0);
      const monthlyExpenses = (settings.monthly_fixed || 0) + (settings.monthly_variable || 0);
      const monthlyIncome = settings.monthly_income || 0;

      return await createScenario({
        name,
        description,
        is_base: false,
        total_savings: totalSavings,
        monthly_expenses: monthlyExpenses,
        monthly_income: monthlyIncome,
      });
    } catch (err) {
      console.error('Error creating from settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to create scenario');
      return null;
    }
  }, [createScenario]);

  // Duplicate an existing scenario
  const duplicateScenario = useCallback(async (
    id: string,
    newName: string
  ): Promise<Scenario | null> => {
    try {
      const scenario = scenarios.find(s => s.id === id);
      if (!scenario) throw new Error('Scenario not found');

      return await createScenario({
        name: newName,
        description: scenario.description,
        is_base: false,
        total_savings: scenario.total_savings,
        monthly_expenses: scenario.monthly_expenses,
        monthly_income: scenario.monthly_income,
        one_time_expenses: [...scenario.one_time_expenses],
        recurring_items: [...scenario.recurring_items],
      });
    } catch (err) {
      console.error('Error duplicating scenario:', err);
      setError(err instanceof Error ? err.message : 'Failed to duplicate scenario');
      return null;
    }
  }, [scenarios, createScenario]);

  // Load scenarios on mount
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
    createFromCurrentSettings,
    duplicateScenario,
  };
}
