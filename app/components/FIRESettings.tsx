/**
 * FIRE Settings Panel Component
 * 
 * Purpose: Polished settings panel with sliders and real-time updates
 * Features:
 * - Investment return rate slider (0-15%, default 7%)
 * - Safe withdrawal rate slider (2-6%, default 4%)
 * - Monthly savings input with validation
 * - Tooltips explaining each setting
 * - Real-time recalculation
 * - Responsive mobile layout
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState, useEffect } from 'react';
import { Settings, Info, DollarSign, TrendingUp, Percent, RotateCcw } from 'lucide-react';

interface FIRESettingsProps {
  // Current values
  investmentReturnRate: number;
  safeWithdrawalRate: number;
  monthlySavings: number;
  targetAnnualExpenses?: number;
  
  // Callbacks
  onSettingsChange?: (settings: {
    investmentReturnRate: number;
    safeWithdrawalRate: number;
    monthlySavings: number;
    targetAnnualExpenses?: number;
  }) => void;
  onReset?: () => void;
  
  className?: string;
}

// Default values
const DEFAULTS = {
  investmentReturnRate: 7.0,
  safeWithdrawalRate: 4.0,
  monthlySavings: 0,
};

// Slider configurations
const SLIDERS = {
  investmentReturn: {
    min: 0,
    max: 15,
    step: 0.5,
    label: 'Investment Return Rate',
    tooltip: 'Expected annual return on investments. Historical average is 7-10% for stock market.',
    icon: <TrendingUp className="h-4 w-4" />,
    unit: '%',
  },
  safeWithdrawal: {
    min: 2,
    max: 6,
    step: 0.25,
    label: 'Safe Withdrawal Rate',
    tooltip: 'The 4% Rule: Withdraw 4% of portfolio annually to sustain for 30+ years.',
    icon: <Percent className="h-4 w-4" />,
    unit: '%',
  },
};

export default function FIRESettings({
  investmentReturnRate,
  safeWithdrawalRate,
  monthlySavings,
  targetAnnualExpenses,
  onSettingsChange,
  onReset,
  className = '',
}: FIRESettingsProps) {
  // Local state for real-time updates
  const [localInvestmentRate, setLocalInvestmentRate] = useState(investmentReturnRate);
  const [localSWR, setLocalSWR] = useState(safeWithdrawalRate);
  const [localMonthlySavings, setLocalMonthlySavings] = useState(monthlySavings);
  const [localTargetExpenses, setLocalTargetExpenses] = useState(targetAnnualExpenses?.toString() ?? '');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Sync with props
  useEffect(() => {
    setLocalInvestmentRate(investmentReturnRate);
    setLocalSWR(safeWithdrawalRate);
    setLocalMonthlySavings(monthlySavings);
    setLocalTargetExpenses(targetAnnualExpenses?.toString() ?? '');
  }, [investmentReturnRate, safeWithdrawalRate, monthlySavings, targetAnnualExpenses]);

  // Handle real-time changes (debounced)
  const handleChange = () => {
    onSettingsChange?.({
      investmentReturnRate: localInvestmentRate,
      safeWithdrawalRate: localSWR,
      monthlySavings: localMonthlySavings,
      targetAnnualExpenses: localTargetExpenses ? parseFloat(localTargetExpenses) : undefined,
    });
  };

  // Trigger change on any value update
  useEffect(() => {
    const timeoutId = setTimeout(handleChange, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [localInvestmentRate, localSWR, localMonthlySavings, localTargetExpenses]);

  const handleReset = () => {
    setLocalInvestmentRate(DEFAULTS.investmentReturnRate);
    setLocalSWR(DEFAULTS.safeWithdrawalRate);
    setLocalMonthlySavings(DEFAULTS.monthlySavings);
    setLocalTargetExpenses('');
    onReset?.();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            FIRE Settings
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 
                   hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 
                   rounded-lg transition-colors"
          title="Reset to defaults"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Investment Return Rate Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {SLIDERS.investmentReturn.icon}
              <span>{SLIDERS.investmentReturn.label}</span>
              <button
                onMouseEnter={() => setShowTooltip('investmentReturn')}
                onMouseLeave={() => setShowTooltip(null)}
                className="relative text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Info className="h-4 w-4" />
                {showTooltip === 'investmentReturn' && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 dark:bg-gray-700 
                                text-white text-xs rounded-lg shadow-lg z-10">
                    {SLIDERS.investmentReturn.tooltip}
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                  </div>
                )}
              </button>
            </label>
            <span className="text-lg font-bold text-blue-600">
              {localInvestmentRate.toFixed(1)}{SLIDERS.investmentReturn.unit}
            </span>
          </div>
          <input
            type="range"
            min={SLIDERS.investmentReturn.min}
            max={SLIDERS.investmentReturn.max}
            step={SLIDERS.investmentReturn.step}
            value={localInvestmentRate}
            onChange={(e) => setLocalInvestmentRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Conservative (0%)</span>
            <span>Aggressive (15%)</span>
          </div>
        </div>

        {/* Safe Withdrawal Rate Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {SLIDERS.safeWithdrawal.icon}
              <span>{SLIDERS.safeWithdrawal.label}</span>
              <button
                onMouseEnter={() => setShowTooltip('safeWithdrawal')}
                onMouseLeave={() => setShowTooltip(null)}
                className="relative text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Info className="h-4 w-4" />
                {showTooltip === 'safeWithdrawal' && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 dark:bg-gray-700 
                                text-white text-xs rounded-lg shadow-lg z-10">
                    {SLIDERS.safeWithdrawal.tooltip}
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                  </div>
                )}
              </button>
            </label>
            <span className="text-lg font-bold text-green-600">
              {localSWR.toFixed(2)}{SLIDERS.safeWithdrawal.unit}
            </span>
          </div>
          <input
            type="range"
            min={SLIDERS.safeWithdrawal.min}
            max={SLIDERS.safeWithdrawal.max}
            step={SLIDERS.safeWithdrawal.step}
            value={localSWR}
            onChange={(e) => setLocalSWR(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Conservative (2%)</span>
            <span>Aggressive (6%)</span>
          </div>
        </div>

        {/* Monthly Savings Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>Monthly Savings</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              step="100"
              value={localMonthlySavings}
              onChange={(e) => setLocalMonthlySavings(parseFloat(e.target.value) || 0)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Amount you can save and invest each month
          </p>
        </div>

        {/* Target Annual Expenses (Optional) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>Target Annual Expenses (Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              step="1000"
              value={localTargetExpenses}
              onChange={(e) => setLocalTargetExpenses(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Leave empty to use current expenses"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Override current expenses if planning lifestyle change
          </p>
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Changes auto-save and update calculations in real-time. 
          These assumptions significantly impact your FI date—adjust conservatively.
        </p>
      </div>
    </div>
  );
}
