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
    if (!user) return { success: false, error: 'Not authenticated' };

    // Optimistically update UI
    setSettings(newSettings);

    // Save to database with proper upsert
    const { error } = await supabase
      .from('finance_settings')
      .upsert(
        {
          user_id: user.id,
          monthly_fixed: newSettings.monthlyFixed,
          monthly_variable: newSettings.monthlyVariable,
          current_savings: newSettings.currentSavings,
          lump_sum: newSettings.lumpSum,
          start_date: newSettings.startDate,
          monthly_income: newSettings.monthlyIncome,
          income_months: newSettings.incomeMonths,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (error) {
      console.error('Failed to save settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Add expense
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        date: expense.date,
        category: expense.category,
        amount: expense.amount,
        memo: expense.memo,
        description: expense.description,
      })
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
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    if (!user) return;

    await supabase.from('expenses').delete().eq('id', id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Add recurring expense
  const addRecurringExpense = async (expense: Omit<RecurringExpense, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('recurring_expenses')
      .insert({
        user_id: user.id,
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        day_of_month: expense.dayOfMonth,
        enabled: expense.enabled,
      })
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
    }
  };

  // Update recurring expense
  const updateRecurringExpense = async (id: string, updates: Partial<RecurringExpense>) => {
    if (!user) return;

    await supabase
      .from('recurring_expenses')
      .update({
        name: updates.name,
        amount: updates.amount,
        category: updates.category,
        day_of_month: updates.dayOfMonth,
        enabled: updates.enabled,
      })
      .eq('id', id);

    setRecurringExpenses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Delete recurring expense
  const deleteRecurringExpense = async (id: string) => {
    if (!user) return;

    await supabase.from('recurring_expenses').delete().eq('id', id);
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
