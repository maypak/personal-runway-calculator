/**
 * FI Scenario Cards Component
 * 
 * Purpose: Display Lean/Regular/Fat FIRE scenarios
 * Features:
 * - 3 cards: Lean (70%), Regular (100%), Fat (150%)
 * - Each shows: FI Number, Estimated Date, Progress
 * - Toggle active scenario
 * - Visual distinction for selected scenario
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState } from 'react';
import { TrendingDown, Target, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { calculateFIDate, calculateFIProgress } from '../utils/fireCalculator';
import { useI18n } from '../contexts/I18nContext';
import { formatCurrency } from '../utils/currencyFormatter';

interface FIScenarioCardsProps {
  currentSavings: number;
  monthlyContribution: number;
  annualExpenses: number;
  investmentReturnRate?: number;
  safeWithdrawalRate?: number;
  onScenarioSelect?: (scenario: 'lean' | 'regular' | 'fat') => void;
  className?: string;
}

interface Scenario {
  id: 'lean' | 'regular' | 'fat';
  multiplier: number;
  icon: React.ReactNode;
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'lean',
    multiplier: 0.7,
    icon: <TrendingDown className="h-6 w-6" />,
    color: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-400',
      accent: 'bg-blue-600',
    },
  },
  {
    id: 'regular',
    multiplier: 1.0,
    icon: <Target className="h-6 w-6" />,
    color: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-400',
      accent: 'bg-green-600',
    },
  },
  {
    id: 'fat',
    multiplier: 1.5,
    icon: <TrendingUp className="h-6 w-6" />,
    color: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-400',
      accent: 'bg-purple-600',
    },
  },
];

export default function FIScenarioCards({
  currentSavings,
  monthlyContribution,
  annualExpenses,
  investmentReturnRate = 7.0,
  safeWithdrawalRate = 4.0,
  onScenarioSelect,
  className = '',
}: FIScenarioCardsProps) {
  const { t, locale } = useI18n();
  const [selectedScenario, setSelectedScenario] = useState<'lean' | 'regular' | 'fat'>('regular');

  const handleScenarioClick = (scenarioId: 'lean' | 'regular' | 'fat') => {
    setSelectedScenario(scenarioId);
    onScenarioSelect?.(scenarioId);
  };

  // Calculate metrics for each scenario
  const getScenarioMetrics = (multiplier: number) => {
    const targetExpenses = annualExpenses * multiplier;
    const fiNumber = targetExpenses / (safeWithdrawalRate / 100);
    
    const { percentage: progress } = calculateFIProgress(currentSavings, fiNumber);
    const { date: fiDate, months: fiMonths } = calculateFIDate(
      currentSavings,
      monthlyContribution,
      fiNumber,
      investmentReturnRate
    );

    return { fiNumber, progress, fiDate, fiMonths, targetExpenses };
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('fire:scenarios.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('fire:scenarios.subtitle')}
        </p>
      </div>

      {/* Scenario cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => {
          const metrics = getScenarioMetrics(scenario.multiplier);
          const isSelected = selectedScenario === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario.id)}
              className={`
                relative p-5 rounded-lg border-2 transition-all text-left
                ${scenario.color.bg} ${scenario.color.border}
                ${isSelected 
                  ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-lg scale-105 ring-blue-500' 
                  : 'hover:shadow-md hover:scale-102'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                  <div className={`w-6 h-6 rounded-full ${scenario.color.accent} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}

              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className={scenario.color.text}>
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {t(`fire:scenarios.types.${scenario.id}.name`)}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t(`fire:scenarios.types.${scenario.id}.description`)}
                  </p>
                </div>
              </div>

              {/* FI Number */}
              <div className="mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{t('fire:scenarios.fiNumberLabel')}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.fiNumber, locale).replace(/,000$/, 'K').replace(/000$/, 'K')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('fire:scenarios.annualExpenses', { amount: formatCurrency(metrics.targetExpenses, locale) })}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>{t('fire:scenarios.progress')}</span>
                  <span className="font-semibold">{metrics.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${scenario.color.accent} transition-all duration-500`}
                    style={{ width: `${Math.min(metrics.progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Estimated date */}
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {metrics.fiDate 
                    ? metrics.fiDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : metrics.fiMonths === 0 
                      ? t('fire:scenarios.achieved')
                      : t('fire:scenarios.notReachable')}
                </span>
              </div>

              {/* Time remaining */}
              {metrics.fiDate && metrics.fiMonths > 0 && (
                <div className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {metrics.fiMonths < 12 
                    ? t('fire:scenarios.timeRemaining.months', { months: metrics.fiMonths })
                    : t('fire:scenarios.timeRemaining.years', { years: (metrics.fiMonths / 12).toFixed(1) })}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info note */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p 
          className="text-xs text-gray-600 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: t('fire:scenarios.infoNote') }}
        />
      </div>
    </div>
  );
}
