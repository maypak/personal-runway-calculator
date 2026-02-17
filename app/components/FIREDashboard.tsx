/**
 * FIRE Dashboard Component
 * 
 * Purpose: Display FIRE (Financial Independence, Retire Early) metrics
 * Features:
 * - FI Number display with progress visualization
 * - Interactive projection chart
 * - Milestone tracking
 * - Scenario comparison (Lean/Regular/Fat FIRE)
 * - Settings panel for assumptions
 * - Fully integrated with new components
 * 
 * Created: 2026-02-17
 * Updated: 2026-02-17 (Day 3-4 integration)
 * Author: Senior Frontend Developer
 */

'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Settings as SettingsIcon, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useFIRESettings } from '../hooks/useFIRESettings';
import { useSupabaseFinance } from '../hooks/useSupabaseFinance';
import FIProgressBar from './FIProgressBar';
import FIProjectionChart from './FIProjectionChart';
import FIMilestones from './FIMilestones';
import FIScenarioCards from './FIScenarioCards';
import FIRESettings from './FIRESettings';

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
  const [showScenarios, setShowScenarios] = useState(false);

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

  // Handle settings changes from FIRESettings component
  const handleSettingsChange = async (newSettings: {
    investmentReturnRate: number;
    safeWithdrawalRate: number;
    monthlySavings: number;
    targetAnnualExpenses?: number;
  }) => {
    try {
      await updateSettings({
        investment_return_rate: newSettings.investmentReturnRate,
        safe_withdrawal_rate: newSettings.safeWithdrawalRate,
        target_annual_expenses: newSettings.targetAnnualExpenses || null,
      });
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefaults();
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

  if (!financeSettings) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">
          Please set up your financial settings first to use the FIRE Calculator.
        </p>
      </div>
    );
  }

  // Calculate derived values
  const currentSavings = financeSettings.currentSavings;
  const monthlyContribution = financeSettings.monthlyIncome - 
                             (financeSettings.monthlyFixed + financeSettings.monthlyVariable);
  const annualExpenses = settings?.target_annual_expenses ?? 
                        (financeSettings.monthlyFixed + financeSettings.monthlyVariable) * 12;
  const fiNumber = calculatedMetrics?.fiNumber ?? settings?.fi_number ?? 0;
  const investmentReturnRate = settings?.investment_return_rate ?? 7.0;
  const safeWithdrawalRate = settings?.safe_withdrawal_rate ?? 4.0;

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
          className={`
            p-2 rounded-lg transition-colors
            ${showSettings 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
          `}
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel (Collapsible) */}
      {showSettings && (
        <FIRESettings
          investmentReturnRate={investmentReturnRate}
          safeWithdrawalRate={safeWithdrawalRate}
          monthlySavings={monthlyContribution}
          targetAnnualExpenses={settings?.target_annual_expenses || undefined}
          onSettingsChange={handleSettingsChange}
          onReset={handleReset}
        />
      )}

      {/* FI Number Highlight Card */}
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

      {/* Enhanced Progress Bar */}
      <FIProgressBar
        currentSavings={currentSavings}
        fiNumber={fiNumber}
      />

      {/* Projection Chart */}
      <FIProjectionChart
        currentSavings={currentSavings}
        monthlyContribution={monthlyContribution}
        fiNumber={fiNumber}
        investmentReturnRate={investmentReturnRate}
        maxYears={30}
      />

      {/* Milestones */}
      <FIMilestones
        currentSavings={currentSavings}
        monthlyContribution={monthlyContribution}
        fiNumber={fiNumber}
        investmentReturnRate={investmentReturnRate}
      />

      {/* Scenario Comparison (Collapsible) */}
      <div>
        <button
          onClick={() => setShowScenarios(!showScenarios)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 
                   rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Compare FI Scenarios (Lean/Regular/Fat)
          </span>
          {showScenarios ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {showScenarios && (
          <div className="mt-4">
            <FIScenarioCards
              currentSavings={currentSavings}
              monthlyContribution={monthlyContribution}
              annualExpenses={annualExpenses}
              investmentReturnRate={investmentReturnRate}
              safeWithdrawalRate={safeWithdrawalRate}
            />
          </div>
        )}
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
