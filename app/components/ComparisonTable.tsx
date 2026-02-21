/**
 * ComparisonTable - Side-by-Side Scenario Metrics
 * 
 * Purpose: Display key metrics for multiple scenarios in table format
 * Features:
 * - Side-by-side comparison
 * - Visual indicators (⬆⬇) for best/worst values
 * - Color coding (green/red) for better/worse
 * - Mobile responsive (horizontal scroll)
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useI18n } from '../contexts/I18nContext';
import type { Scenario } from '../types';
import { formatCurrency } from '../utils/currencyFormatter';

interface ComparisonTableProps {
  scenarios: Scenario[];
}

interface Metric {
  key: string;
  labelKey: string;
  format: (value: number | null | undefined, t: (key: string, params?: Record<string, string | number>) => string) => string;
  higherIsBetter: boolean;
}

export function ComparisonTable({ scenarios }: ComparisonTableProps) {
  const { t, locale } = useI18n();

  if (scenarios.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t('scenarios:comparison.table.noScenarios')}
      </div>
    );
  }

  const metrics: Metric[] = [
    {
      key: 'calculatedRunway',
      labelKey: 'scenarios:comparison.table.metrics.runway',
      format: (v, t) => v !== undefined && v !== null ? t('scenarios:comparison.table.values.months', { count: v }) : t('scenarios:comparison.table.values.na'),
      higherIsBetter: true,
    },
    {
      key: 'calculatedBurnRate',
      labelKey: 'scenarios:comparison.table.metrics.burnRate',
      format: (v, t) => v !== undefined && v !== null ? formatCurrency(v, "USD") : t('scenarios:comparison.table.values.na'),
      higherIsBetter: false,
    },
    {
      key: 'calculatedBreakevenMonth',
      labelKey: 'scenarios:comparison.table.metrics.breakeven',
      format: (v, t) => v !== undefined && v !== null ? t('scenarios:comparison.table.values.month', { count: v }) : t('scenarios:comparison.table.values.never'),
      higherIsBetter: false, // Earlier is better
    },
    {
      key: 'calculatedFirstIncomeMonth',
      labelKey: 'scenarios:comparison.table.metrics.firstIncome',
      format: (v, t) => v !== undefined && v !== null ? t('scenarios:comparison.table.values.month', { count: v }) : t('scenarios:comparison.table.values.never'),
      higherIsBetter: false, // Earlier is better
    },
    {
      key: 'calculatedEndSavings',
      labelKey: 'scenarios:comparison.table.metrics.endSavings',
      format: (v, t) => v !== undefined && v !== null ? formatCurrency(v, "USD") : formatCurrency(0, "USD"),
      higherIsBetter: true,
    },
    {
      key: 'totalSavings',
      labelKey: 'scenarios:comparison.table.metrics.startSavings',
      format: (v, t) => v !== undefined && v !== null ? formatCurrency(v, "USD") : formatCurrency(0, "USD"),
      higherIsBetter: false, // Not really comparable
    },
    {
      key: 'monthlyExpenses',
      labelKey: 'scenarios:comparison.table.metrics.monthlyExpenses',
      format: (v, t) => v !== undefined && v !== null ? formatCurrency(v, "USD") : formatCurrency(0, "USD"),
      higherIsBetter: false,
    },
    {
      key: 'monthlyIncome',
      labelKey: 'scenarios:comparison.table.metrics.monthlyIncome',
      format: (v, t) => v !== undefined && v !== null ? formatCurrency(v, "USD") : formatCurrency(0, "USD"),
      higherIsBetter: true,
    },
  ];

  const getBestValue = (metric: Metric): number | null => {
    const values = scenarios
      .map(s => s[metric.key as keyof Scenario] as number | null | undefined)
      .filter(v => v !== undefined && v !== null) as number[];
    
    if (values.length === 0) return null;
    
    if (metric.higherIsBetter) {
      return Math.max(...values);
    } else {
      // For breakeven, treat null/undefined as worst (never breaks even)
      if (metric.key === 'calculatedBreakevenMonth') {
        const validValues = values.filter(v => v !== null);
        return validValues.length > 0 ? Math.min(...validValues) : null;
      }
      return Math.min(...values);
    }
  };

  const getWorstValue = (metric: Metric): number | null => {
    const values = scenarios
      .map(s => s[metric.key as keyof Scenario] as number | null | undefined)
      .filter(v => v !== undefined && v !== null) as number[];
    
    if (values.length === 0 || scenarios.length === 1) return null;
    
    if (metric.higherIsBetter) {
      return Math.min(...values);
    } else {
      return Math.max(...values);
    }
  };

  const getCellStyle = (metric: Metric, value: number | null | undefined): string => {
    if (value === undefined || value === null) return '';
    if (scenarios.length === 1) return ''; // No comparison needed for single scenario
    
    const best = getBestValue(metric);
    const worst = getWorstValue(metric);
    
    if (best === null || worst === null) return '';
    
    // Special handling for breakeven/firstIncome month (null means never)
    if ((metric.key === 'calculatedBreakevenMonth' || metric.key === 'calculatedFirstIncomeMonth') && value === null) {
      return 'text-gray-500';
    }
    
    if (value === best) {
      return 'text-green-600 dark:text-green-400 font-semibold';
    }
    
    if (value === worst && scenarios.length > 1) {
      return 'text-red-600 dark:text-red-400';
    }
    
    return '';
  };

  const getIndicator = (metric: Metric, value: number | null | undefined): string => {
    if (value === undefined || value === null) return '';
    if (scenarios.length === 1) return '';
    
    const best = getBestValue(metric);
    const worst = getWorstValue(metric);
    
    if (best === null || worst === null) return '';
    
    // Special handling for breakeven/firstIncome month (null means never)
    if ((metric.key === 'calculatedBreakevenMonth' || metric.key === 'calculatedFirstIncomeMonth') && value === null) {
      return '';
    }
    
    if (value === best) return ' ⬆';
    if (value === worst && scenarios.length > 1) return ' ⬇';
    
    return '';
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table 
        className="w-full border-collapse"
        role="table"
        aria-label={t('scenarios:comparison.sections.metrics')}
      >
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
              {t('scenarios:comparison.table.metric')}
            </th>
            {scenarios.map((scenario) => (
              <th
                key={scenario.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  {scenario.name}
                  {scenario.isBase && (
                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                      {t('scenarios:card.base')}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {metrics.map((metric) => (
            <tr key={metric.key} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-800 z-10">
                {t(metric.labelKey)}
              </td>
              {scenarios.map((scenario) => {
                const value = scenario[metric.key as keyof Scenario] as number | null | undefined;
                const cellStyle = getCellStyle(metric, value);
                const indicator = getIndicator(metric, value);
                
                return (
                  <td
                    key={scenario.id}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${cellStyle}`}
                  >
                    {metric.format(value, t)}{indicator}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Legend */}
      {scenarios.length > 1 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">
          <span className="text-green-600 dark:text-green-400 font-semibold">{t('scenarios:comparison.table.legend.best')}</span>
          <span className="mx-2">•</span>
          <span className="text-red-600 dark:text-red-400">{t('scenarios:comparison.table.legend.worst')}</span>
        </div>
      )}
    </div>
  );
}
