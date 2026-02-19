'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { FinanceSettings, Expense, RecurringExpense, UserGoal } from '../types';

export function useSupabaseFinance() {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<FinanceSettings | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when user is authenticated
  useEffect(() => {
    if (!user || authLoading) return;

    const loadData = async () => {
      setLoading(true);

      // Load finance settings
      const { data: settingsData } = await supabase
        .from('finance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsData) {
        setSettings({
          monthlyFixed: Number(settingsData.monthly_fixed),
          monthlyVariable: Number(settingsData.monthly_variable),
          currentSavings: Number(settingsData.current_savings),
          lumpSum: Number(settingsData.lump_sum),
          startDate: settingsData.start_date,
          monthlyIncome: Number(settingsData.monthly_income),
          incomeMonths: settingsData.income_months,
        });
      } else {
        // Initialize default settings
        const defaultSettings: FinanceSettings = {
          monthlyFixed: 0,
          monthlyVariable: 0,
          currentSavings: 0,
          lumpSum: 0,
          startDate: new Date().toISOString().split('T')[0],
          monthlyIncome: 0,
          incomeMonths: 0,
        };
        setSettings(defaultSettings);

        // Save to database
        await supabase.from('finance_settings').insert({
          user_id: user.id,
          ...defaultSettings,
        });
      }

      // Load expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (expensesData) {
        setExpenses(
          expensesData.map((e) => ({
            id: e.id,
            date: e.date,
            category: e.category,
            amount: Number(e.amount),
            memo: e.memo || undefined,
            description: e.description || undefined,
            createdAt: e.created_at,
          }))
        );
      }

      // Load recurring expenses
      const { data: recurringData } = await supabase
        .from('recurring_expenses')
        .select('*')
        .eq('user_id', user.id);

      if (recurringData) {
        setRecurringExpenses(
          recurringData.map((r) => ({
            id: r.id,
            name: r.name,
            amount: Number(r.amount),
            category: r.category,
            dayOfMonth: r.day_of_month,
            enabled: r.enabled,
          }))
        );
      }

      // Load user goals
      const { data: goalsData } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsData) {
        setGoals(
          goalsData.map((g) => ({
            id: g.id,
            goalType: g.goal_type as 'runway' | 'savings',
            targetValue: Number(g.target_value),
            description: g.description || undefined,
            isActive: g.is_active,
            achievedAt: g.achieved_at || undefined,
            createdAt: g.created_at,
            updatedAt: g.updated_at,
          }))
        );
      }

      setLoading(false);
    };

    loadData();
  }, [user, authLoading]);

  // Update settings
  const updateSettings = async (newSettings: FinanceSettings) => {

    if (!user) {
      console.error('❌ [updateSettings] No user authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    // Optimistically update UI
    setSettings(newSettings);

    // Prepare data for database
    const dbData = {
      monthly_fixed: newSettings.monthlyFixed,
      monthly_variable: newSettings.monthlyVariable,
      current_savings: newSettings.currentSavings,
      lump_sum: newSettings.lumpSum,
      start_date: newSettings.startDate,
      monthly_income: newSettings.monthlyIncome,
      income_months: newSettings.incomeMonths,
    };

    // IMPORTANT: We use conditional INSERT/UPDATE instead of UPSERT
    // because Supabase RLS policies conflict with UPSERT operations.
    //
    // Issue: UPSERT tries INSERT first, then UPDATE on conflict.
    // Supabase RLS requires both INSERT and UPDATE policies to pass,
    // which causes 409 Conflict errors.
    //
    // Solution: Check for existing record first, then explicitly
    // INSERT (if new) or UPDATE (if exists). This satisfies only
    // the relevant RLS policy and avoids the conflict.
    //
    // See: qa-reports/2026-02-15-10-30-P0-FIX.md for full analysis
    // Date fixed: 2026-02-15

    // Check if settings already exist
    const { data: existing } = await supabase
      .from('finance_settings')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();


    let error;
    if (existing) {
      // Update existing record
      const result = await supabase
        .from('finance_settings')
        .update(dbData)
        .eq('user_id', user.id);
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from('finance_settings')
        .insert({ ...dbData, user_id: user.id });
      error = result.error;
    }

    if (error) {
      console.error('❌ [updateSettings] Failed to save settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Add expense
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    
    if (!user) {
      console.error('❌ [addExpense] No user authenticated');
      return;
    }

    const dbPayload = {
      user_id: user.id,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      memo: expense.memo,
      description: expense.description,
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert(dbPayload)
      .select()
      .single();


    if (data && !error) {
      setExpenses((prev) => [
        {
          id: data.id,
          date: data.date,
          category: data.category,
          amount: Number(data.amount),
          memo: data.memo || undefined,
          description: data.description || undefined,
          createdAt: data.created_at,
        },
        ...prev,
      ]);
    } else if (error) {
      console.error('❌ [addExpense] Failed:', error.message);
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    
    if (!user) {
      console.error('❌ [deleteExpense] No user authenticated');
      return;
    }

    const { error } = await supabase.from('expenses').delete().eq('id', id);
    

    if (error) {
      console.error('❌ [deleteExpense] Failed:', error.message);
      return;
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Add recurring expense
  const addRecurringExpense = async (expense: Omit<RecurringExpense, 'id'>) => {
    
    if (!user) {
      console.error('❌ [addRecurringExpense] No user authenticated');
      return;
    }

    const dbPayload = {
      user_id: user.id,
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      day_of_month: expense.dayOfMonth,
      enabled: expense.enabled,
    };

    const { data, error } = await supabase
      .from('recurring_expenses')
      .insert(dbPayload)
      .select()
      .single();


    if (data && !error) {
      setRecurringExpenses((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          amount: Number(data.amount),
          category: data.category,
          dayOfMonth: data.day_of_month,
          enabled: data.enabled,
        },
      ]);
    } else if (error) {
      console.error('❌ [addRecurringExpense] Failed:', error.message);
    }
  };

  // Update recurring expense
  const updateRecurringExpense = async (id: string, updates: Partial<RecurringExpense>) => {
    
    if (!user) {
      console.error('❌ [updateRecurringExpense] No user authenticated');
      return;
    }

    const dbPayload = {
      name: updates.name,
      amount: updates.amount,
      category: updates.category,
      day_of_month: updates.dayOfMonth,
      enabled: updates.enabled,
    };

    const { error } = await supabase
      .from('recurring_expenses')
      .update(dbPayload)
      .eq('id', id);


    if (error) {
      console.error('❌ [updateRecurringExpense] Failed:', error.message);
      return;
    }

    setRecurringExpenses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Delete recurring expense
  const deleteRecurringExpense = async (id: string) => {
    
    if (!user) {
      console.error('❌ [deleteRecurringExpense] No user authenticated');
      return;
    }

    const { error } = await supabase.from('recurring_expenses').delete().eq('id', id);
    

    if (error) {
      console.error('❌ [deleteRecurringExpense] Failed:', error.message);
      return;
    }

    setRecurringExpenses((prev) => prev.filter((r) => r.id !== id));
  };

  // Add goal
  const addGoal = async (goal: Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    
    if (!user) {
      console.error('❌ [addGoal] No user authenticated');
      return;
    }

    // Free tier: Only 1 active goal allowed
    const activeGoals = goals.filter(g => g.isActive);
    if (goal.isActive && activeGoals.length >= 1) {
      console.warn('⚠️ [addGoal] Free tier limit: Only 1 active goal allowed');
      // Deactivate other goals first
      for (const g of activeGoals) {
        await supabase
          .from('user_goals')
          .update({ is_active: false })
          .eq('id', g.id);
      }
    }

    const dbPayload = {
      user_id: user.id,
      goal_type: goal.goalType,
      target_value: goal.targetValue,
      description: goal.description,
      is_active: goal.isActive,
      achieved_at: goal.achievedAt,
    };

    const { data, error } = await supabase
      .from('user_goals')
      .insert(dbPayload)
      .select()
      .single();


    if (data && !error) {
      const newGoal: UserGoal = {
        id: data.id,
        goalType: data.goal_type as 'runway' | 'savings',
        targetValue: Number(data.target_value),
        description: data.description || undefined,
        isActive: data.is_active,
        achievedAt: data.achieved_at || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setGoals((prev) => [newGoal, ...prev]);
      return { success: true, data: newGoal };
    } else if (error) {
      console.error('❌ [addGoal] Failed:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Update goal
  const updateGoal = async (id: string, updates: Partial<Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'>>) => {
    
    if (!user) {
      console.error('❌ [updateGoal] No user authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    const dbPayload: Record<string, unknown> = {};
    if (updates.goalType !== undefined) dbPayload.goal_type = updates.goalType;
    if (updates.targetValue !== undefined) dbPayload.target_value = updates.targetValue;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.isActive !== undefined) dbPayload.is_active = updates.isActive;
    if (updates.achievedAt !== undefined) dbPayload.achieved_at = updates.achievedAt;


    const { error } = await supabase
      .from('user_goals')
      .update(dbPayload)
      .eq('id', id);


    if (error) {
      console.error('❌ [updateGoal] Failed:', error.message);
      return { success: false, error: error.message };
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
    return { success: true };
  };

  // Delete goal
  const deleteGoal = async (id: string) => {
    
    if (!user) {
      console.error('❌ [deleteGoal] No user authenticated');
      return;
    }

    const { error } = await supabase.from('user_goals').delete().eq('id', id);
    

    if (error) {
      console.error('❌ [deleteGoal] Failed:', error.message);
      return;
    }

    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return {
    settings,
    expenses,
    recurringExpenses,
    goals,
    loading: authLoading || loading,
    updateSettings,
    addExpense,
    deleteExpense,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
