/**
 * FIRE Dashboard Component
 * 
 * Purpose: Display FIRE (Financial Independence, Retire Early) metrics
 * Features:
 * - FI Number display
 * - Progress bar with milestones
 * - Settings panel for assumptions
 * - Simple, clean layout
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Settings, DollarSign } from 'lucide-react';
import { useFIRESettings } from '../hooks/useFIRESettings';
import { useSupabaseFinance } from '../hooks/useSupabaseFinance';

export default function FIREDashboard() {
  const {
    settings,
    calculatedMetrics,
    isLoading,
    error,
    updateSettings,
    calculateAndCache,
    resetToDefaults,
  } = useFIRESettings();

  const { settings: financeSettings } = useSupabaseFinance();

  const [showSettings, setShowSettings] = useState(false);
  const [localInvestmentRate, setLocalInvestmentRate] = useState('7.0');
  const [localSWR, setLocalSWR] = useState('4.0');
  const [localTargetExpenses, setLocalTargetExpenses] = useState('');

  // Sync local state with settings
  useEffect(() => {
    if (settings) {
      setLocalInvestmentRate(settings.investment_return_rate.toString());
      setLocalSWR(settings.safe_withdrawal_rate.toString());
      setLocalTargetExpenses(settings.target_annual_expenses?.toString() ?? '');
    }
  }, [settings]);

  // Calculate FIRE metrics when finance settings are loaded
  useEffect(() => {
    if (!financeSettings || !settings) return;

    const annualExpenses = settings.target_annual_expenses ?? 
                          (financeSettings.monthlyFixed + financeSettings.monthlyVariable) * 12;

    calculateAndCache({
      currentSavings: financeSettings.currentSavings,
      monthlyContribution: financeSettings.monthlyIncome - 
                          (financeSettings.monthlyFixed + financeSettings.monthlyVariable),
      annualExpenses,
    }).catch(err => console.error('Failed to calculate FIRE metrics:', err));
  }, [financeSettings, settings, calculateAndCache]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        investment_return_rate: parseFloat(localInvestmentRate),
        safe_withdrawal_rate: parseFloat(localSWR),
        target_annual_expenses: localTargetExpenses ? parseFloat(localTargetExpenses) : null,
      });
      setShowSettings(false);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefaults();
      setShowSettings(false);
    } catch (err) {
      console.error('Failed to reset settings:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading FIRE data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  const fiNumber = calculatedMetrics?.fiNumber ?? settings?.fi_number ?? 0;
  const currentProgress = calculatedMetrics?.currentProgress ?? 0;
  const fiDate = calculatedMetrics?.fiDate ?? (settings?.fi_date ? new Date(settings.fi_date) : null);
  const coastFireDate = calculatedMetrics?.coastFireDate ?? 
                        (settings?.coast_fire_date ? new Date(settings.coast_fire_date) : null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            FIRE Calculator
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Financial Independence, Retire Early
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            FIRE Assumptions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investment Return Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Investment Return Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={localInvestmentRate}
                onChange={(e) => setLocalInvestmentRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Expected annual return (default: 7%)
              </p>
            </div>

            {/* Safe Withdrawal Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Safe Withdrawal Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={localSWR}
                onChange={(e) => setLocalSWR(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                4% Rule (default: 4%)
              </p>
            </div>

            {/* Target Annual Expenses */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Annual Expenses (Optional)
              </label>
              <input
                type="number"
                step="1000"
                value={localTargetExpenses}
                onChange={(e) => setLocalTargetExpenses(e.target.value)}
                placeholder="Leave empty to use current expenses"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Override current monthly expenses × 12
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FI Number Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                    rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Your FI Number
          </h3>
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          ${fiNumber.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Portfolio target for financial independence
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            FI Progress
          </h3>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {currentProgress.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(currentProgress, 100)}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100% FI</span>
        </div>
      </div>

      {/* Dates Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FI Date */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Projected FI Date
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {fiDate ? fiDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not calculated'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            When you reach FI Number
          </p>
        </div>

        {/* Coast FIRE Date */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Coast FIRE Date
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {coastFireDate ? coastFireDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Already achieved!'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Stop contributing, let it grow
          </p>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>About FIRE:</strong> Financial Independence means having enough invested 
          assets to cover annual expenses using the 4% safe withdrawal rate. 
          Coast FIRE means your current savings will grow to FI Number by retirement age 
          without additional contributions.
        </p>
      </div>
    </div>
  );
}
