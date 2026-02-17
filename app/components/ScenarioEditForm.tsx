/**
 * ScenarioEditForm - Edit Scenario Financial Data
 * 
 * Purpose: Form for editing existing scenario
 * Features:
 * - Edit name and description
 * - Update savings, expenses, income
 * - Add/edit/delete one-time expenses
 * - Add/edit/delete recurring items
 * - Auto-save with recalculation
 * - Loading and error states
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer (subagent)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, Trash2, DollarSign } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useScenarioContext } from '../contexts/ScenarioContext';
import type { Scenario, OneTimeExpense, RecurringItem } from '../types';

interface ScenarioEditFormProps {
  scenarioId: string;
}

export function ScenarioEditForm({ scenarioId }: ScenarioEditFormProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { scenarios, updateScenario, loading: contextLoading } = useScenarioContext();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalSavings, setTotalSavings] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [oneTimeExpenses, setOneTimeExpenses] = useState<OneTimeExpense[]>([]);
  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>([]);

  // Load scenario data
  useEffect(() => {
    const found = scenarios.find(s => s.id === scenarioId);
    
    if (!found) {
      setError(t('scenarios:edit.errors.notFound'));
      return;
    }

    setScenario(found);
    setName(found.name);
    setDescription(found.description || '');
    setTotalSavings(found.totalSavings.toString());
    setMonthlyExpenses(found.monthlyExpenses.toString());
    setMonthlyIncome(found.monthlyIncome.toString());
    setOneTimeExpenses(found.oneTimeExpenses);
    setRecurringItems(found.recurringItems);
  }, [scenarioId, scenarios]);

  const handleSave = async () => {
    if (!scenario) return;

    setSaving(true);
    setError(null);

    const result = await updateScenario(scenario.id, {
      name,
      description: description || undefined,
      totalSavings: Number(totalSavings) || 0,
      monthlyExpenses: Number(monthlyExpenses) || 0,
      monthlyIncome: Number(monthlyIncome) || 0,
      oneTimeExpenses,
      recurringItems,
    });

    setSaving(false);

    if (result.success) {
      router.push('/scenarios');
    } else {
      setError(result.error || t('scenarios:edit.errors.saveFailed'));
    }
  };

  const handleCancel = () => {
    router.push('/scenarios');
  };

  // One-time expense handlers
  const addOneTimeExpense = () => {
    setOneTimeExpenses([
      ...oneTimeExpenses,
      { name: '', amount: 0, month: 0 },
    ]);
  };

  const updateOneTimeExpense = (index: number, field: keyof OneTimeExpense, value: string | number) => {
    const updated = [...oneTimeExpenses];
    updated[index] = { ...updated[index], [field]: value };
    setOneTimeExpenses(updated);
  };

  const deleteOneTimeExpense = (index: number) => {
    setOneTimeExpenses(oneTimeExpenses.filter((_, i) => i !== index));
  };

  // Recurring item handlers
  const addRecurringItem = (type: 'income' | 'expense') => {
    setRecurringItems([
      ...recurringItems,
      { name: '', amount: 0, type, startMonth: 0, endMonth: null },
    ]);
  };

  const updateRecurringItem = (index: number, field: keyof RecurringItem, value: string | number | null) => {
    const updated = [...recurringItems];
    updated[index] = { ...updated[index], [field]: value };
    setRecurringItems(updated);
  };

  const deleteRecurringItem = (index: number) => {
    setRecurringItems(recurringItems.filter((_, i) => i !== index));
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error && !scenario) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/scenarios')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('scenarios:edit.cta.back')}
          </button>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label={t('scenarios:edit.cta.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('scenarios:edit.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t('scenarios:edit.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={saving}
          >
            {t('scenarios:edit.cta.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('scenarios:edit.cta.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('scenarios:edit.cta.save')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('scenarios:edit.sections.basic.title')}
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('scenarios:edit.sections.basic.name.label')} *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('scenarios:edit.sections.basic.description.label')} ({t('scenarios:create.fields.description.optional')})
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Financial Inputs */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('scenarios:edit.sections.financial.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="savings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('scenarios:edit.sections.financial.savings')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="savings"
                  type="number"
                  value={totalSavings}
                  onChange={(e) => setTotalSavings(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expenses" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('scenarios:edit.sections.financial.expenses')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="expenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('scenarios:edit.sections.financial.income')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* One-Time Expenses */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('scenarios:edit.sections.oneTime.title')}
            </h2>
            <button
              onClick={addOneTimeExpense}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('scenarios:edit.sections.oneTime.add')}
            </button>
          </div>

          {oneTimeExpenses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('scenarios:edit.sections.oneTime.empty')}
            </p>
          ) : (
            <div className="space-y-3">
              {oneTimeExpenses.map((expense, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateOneTimeExpense(idx, 'name', e.target.value)}
                    placeholder={t('scenarios:edit.sections.oneTime.fields.name')}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateOneTimeExpense(idx, 'amount', Number(e.target.value))}
                    placeholder={t('scenarios:edit.sections.oneTime.fields.amount')}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    min="0"
                  />
                  <input
                    type="number"
                    value={expense.month}
                    onChange={(e) => updateOneTimeExpense(idx, 'month', Number(e.target.value))}
                    placeholder={t('scenarios:edit.sections.oneTime.fields.month')}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    min="0"
                  />
                  <button
                    onClick={() => deleteOneTimeExpense(idx)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                    aria-label={t('scenarios:card.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recurring Items */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t('scenarios:edit.sections.recurring.title')}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => addRecurringItem('income')}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('scenarios:edit.sections.recurring.addIncome')}
              </button>
              <button
                onClick={() => addRecurringItem('expense')}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('scenarios:edit.sections.recurring.addExpense')}
              </button>
            </div>
          </div>

          {recurringItems.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('scenarios:edit.sections.recurring.empty')}
            </p>
          ) : (
            <div className="space-y-3">
              {recurringItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    item.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {t(`scenarios:edit.sections.recurring.types.${item.type}`)}
                  </span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateRecurringItem(idx, 'name', e.target.value)}
                    placeholder={t('scenarios:edit.sections.recurring.fields.name')}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateRecurringItem(idx, 'amount', Number(e.target.value))}
                    placeholder={t('scenarios:edit.sections.recurring.fields.amount')}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    min="0"
                  />
                  <input
                    type="number"
                    value={item.startMonth}
                    onChange={(e) => updateRecurringItem(idx, 'startMonth', Number(e.target.value))}
                    placeholder={t('scenarios:edit.sections.recurring.fields.start')}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    min="0"
                  />
                  <input
                    type="number"
                    value={item.endMonth ?? ''}
                    onChange={(e) => updateRecurringItem(idx, 'endMonth', e.target.value ? Number(e.target.value) : null)}
                    placeholder={t('scenarios:edit.sections.recurring.fields.end')}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    min="0"
                  />
                  <button
                    onClick={() => deleteRecurringItem(idx)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                    aria-label={t('scenarios:card.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom save button (mobile) */}
      <div className="mt-8 flex justify-end gap-3 md:hidden">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          disabled={saving}
        >
          {t('scenarios:edit.cta.cancel')}
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('scenarios:edit.cta.saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('scenarios:edit.cta.save')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
