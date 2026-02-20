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

import { useState, useEffect, lazy, Suspense } from 'react';
import { Target, TrendingUp, Calendar, Settings as SettingsIcon, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useFIRESettings } from '../hooks/useFIRESettings';
import { useSupabaseFinance } from '../hooks/useSupabaseFinance';
import { useI18n } from '../contexts/I18nContext';
import { formatCurrency } from '../utils/currencyFormatter';
import FIProgressBar from './FIProgressBar';
import FIMilestones from './FIMilestones';
import FIScenarioCards from './FIScenarioCards';
import FIRESettings from './FIRESettings';

// Lazy load heavy chart component for better initial page load
const FIProjectionChart = lazy(() => import('./FIProjectionChart'));

export default function FIREDashboard() {
  const { t, locale } = useI18n();
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

    // FIXED: Skip calculation if no expenses data yet (new users)
    if (annualExpenses <= 0) {
      console.log('Skipping FIRE calculation: no expense data yet');
      return;
    }

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

  // CRITICAL: Always show loading on first render to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading FIRE Calculator...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{t('fire:errors.generic', { message: error })}</p>
      </div>
    );
  }

  if (!financeSettings) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">
          {t('fire:errors.noSettings')}
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

  // FIXED: Show empty state if no expense data yet
  if (annualExpenses <= 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            FIRE Calculator
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Financial Independence, Retire Early
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 border border-blue-200 dark:border-blue-800 text-center">
          <div className="max-w-md mx-auto">
            <Target className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Add Your Expenses First
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              To calculate your FIRE number, we need to know your monthly expenses.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Dashboard →
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>What is FIRE?</strong> Financial Independence, Retire Early. 
            The FIRE calculator shows you how much money you need to never work again (4% Rule).
          </p>
        </div>
      </div>
    );
  }
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
            {t('fire:title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('fire:subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowSettings(!showSettings);
            }
          }}
          className={`
            p-2 rounded-lg transition-colors
            ${showSettings 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
          `}
          aria-label={t('fire:buttons.settings')}
          aria-expanded={showSettings}
          aria-controls="fire-settings-panel"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel (Collapsible) */}
      {showSettings && (
        <div id="fire-settings-panel">
        <FIRESettings
          investmentReturnRate={investmentReturnRate}
          safeWithdrawalRate={safeWithdrawalRate}
          monthlySavings={monthlyContribution}
          targetAnnualExpenses={settings?.target_annual_expenses || undefined}
          onSettingsChange={handleSettingsChange}
          onReset={handleReset}
        />
        </div>
      )}

      {/* FI Number Highlight Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                    rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('fire:fiNumber.label')}
          </h3>
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(fiNumber, "USD" as any)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('fire:fiNumber.description')}
        </p>
      </div>

      {/* Enhanced Progress Bar */}
      <FIProgressBar
        currentSavings={currentSavings}
        fiNumber={fiNumber}
      />

      {/* Projection Chart - Lazy Loaded for Performance */}
      <Suspense
        fallback={
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600 animate-pulse" />
              <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded animate-pulse flex items-center justify-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</div>
            </div>
          </div>
        }
      >
        <FIProjectionChart
          currentSavings={currentSavings}
          monthlyContribution={monthlyContribution}
          fiNumber={fiNumber}
          investmentReturnRate={investmentReturnRate}
          maxYears={30}
        />
      </Suspense>

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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowScenarios(!showScenarios);
            }
          }}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 
                   rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 
                   dark:hover:bg-gray-700 transition-colors"
          aria-expanded={showScenarios}
          aria-controls="fire-scenarios-panel"
          aria-label={t('fire:scenarios.toggleLabel')}
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('fire:scenarios.toggleLabel')}
          </span>
          {showScenarios ? (
            <ChevronUp className="h-5 w-5 text-gray-400" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </button>
        
        {showScenarios && (
          <div id="fire-scenarios-panel" className="mt-4">
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
        <p 
          className="text-sm text-gray-600 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: t('fire:fiNumber.infoNote') }}
        />
      </div>
    </div>
  );
}
