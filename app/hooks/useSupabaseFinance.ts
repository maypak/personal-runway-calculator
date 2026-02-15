'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { FinanceSettings, Expense, RecurringExpense } from '../types';

export function useSupabaseFinance() {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<FinanceSettings | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
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

      setLoading(false);
    };

    loadData();
  }, [user, authLoading]);

  // Update settings
  const updateSettings = async (newSettings: FinanceSettings) => {
    console.log('🔍 [updateSettings] Called with:', newSettings);
    console.log('🔍 [updateSettings] Current user:', user?.id);

    if (!user) {
      console.error('❌ [updateSettings] No user authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    // Optimistically update UI
    setSettings(newSettings);
    console.log('✅ [updateSettings] Optimistic UI update complete');

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
    console.log('🔍 [updateSettings] DB payload:', dbData);

    // Check if settings already exist
    console.log('⏳ [updateSettings] Checking existing settings...');
    const { data: existing } = await supabase
      .from('finance_settings')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('🔍 [updateSettings] Existing record:', existing);

    let error;
    if (existing) {
      // Update existing record
      console.log('⏳ [updateSettings] Updating existing record...');
      const result = await supabase
        .from('finance_settings')
        .update(dbData)
        .eq('user_id', user.id);
      error = result.error;
      console.log('🔍 [updateSettings] Update result - error:', error);
    } else {
      // Insert new record
      console.log('⏳ [updateSettings] Inserting new record...');
      const result = await supabase
        .from('finance_settings')
        .insert({ ...dbData, user_id: user.id });
      error = result.error;
      console.log('🔍 [updateSettings] Insert result - error:', error);
    }

    if (error) {
      console.error('❌ [updateSettings] Failed to save settings:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [updateSettings] Successfully saved to database');
    return { success: true };
  };

  // Add expense
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    console.log('🔍 [addExpense] Called with:', expense);
    
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
    console.log('🔍 [addExpense] DB payload:', dbPayload);

    const { data, error } = await supabase
      .from('expenses')
      .insert(dbPayload)
      .select()
      .single();

    console.log('🔍 [addExpense] Result - data:', data);
    console.log('🔍 [addExpense] Result - error:', error);

    if (data && !error) {
      console.log('✅ [addExpense] Successfully added expense');
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
    console.log('🔍 [deleteExpense] Called with id:', id);
    
    if (!user) {
      console.error('❌ [deleteExpense] No user authenticated');
      return;
    }

    console.log('⏳ [deleteExpense] Deleting from database...');
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    
    console.log('🔍 [deleteExpense] Result - error:', error);

    if (error) {
      console.error('❌ [deleteExpense] Failed:', error.message);
      return;
    }

    console.log('✅ [deleteExpense] Successfully deleted expense');
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Add recurring expense
  const addRecurringExpense = async (expense: Omit<RecurringExpense, 'id'>) => {
    console.log('🔍 [addRecurringExpense] Called with:', expense);
    
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
    console.log('🔍 [addRecurringExpense] DB payload:', dbPayload);

    const { data, error } = await supabase
      .from('recurring_expenses')
      .insert(dbPayload)
      .select()
      .single();

    console.log('🔍 [addRecurringExpense] Result - data:', data);
    console.log('🔍 [addRecurringExpense] Result - error:', error);

    if (data && !error) {
      console.log('✅ [addRecurringExpense] Successfully added recurring expense');
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
    console.log('🔍 [updateRecurringExpense] Called with id:', id, 'updates:', updates);
    
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
    console.log('🔍 [updateRecurringExpense] DB payload:', dbPayload);

    const { error } = await supabase
      .from('recurring_expenses')
      .update(dbPayload)
      .eq('id', id);

    console.log('🔍 [updateRecurringExpense] Result - error:', error);

    if (error) {
      console.error('❌ [updateRecurringExpense] Failed:', error.message);
      return;
    }

    console.log('✅ [updateRecurringExpense] Successfully updated');
    setRecurringExpenses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Delete recurring expense
  const deleteRecurringExpense = async (id: string) => {
    console.log('🔍 [deleteRecurringExpense] Called with id:', id);
    
    if (!user) {
      console.error('❌ [deleteRecurringExpense] No user authenticated');
      return;
    }

    console.log('⏳ [deleteRecurringExpense] Deleting from database...');
    const { error } = await supabase.from('recurring_expenses').delete().eq('id', id);
    
    console.log('🔍 [deleteRecurringExpense] Result - error:', error);

    if (error) {
      console.error('❌ [deleteRecurringExpense] Failed:', error.message);
      return;
    }

    console.log('✅ [deleteRecurringExpense] Successfully deleted');
    setRecurringExpenses((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    settings,
    expenses,
    recurringExpenses,
    loading: authLoading || loading,
    updateSettings,
    addExpense,
    deleteExpense,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
  };
}
