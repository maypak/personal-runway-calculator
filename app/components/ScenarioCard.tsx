/**
 * ScenarioCard - Individual Scenario Display
 * 
 * Purpose: Display single scenario with key metrics
 * Features:
 * - Scenario name and description
 * - Runway display (months)
 * - Burn rate display
 * - Edit/Compare/Delete actions
 * - Base scenario badge
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { Edit, BarChart2, Trash2, TrendingDown } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import type { Scenario } from '../types';

interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: () => void;
  onCompare: () => void;
  onDelete?: () => void;
  selected?: boolean;
}

export function ScenarioCard({
  scenario,
  onEdit,
  onCompare,
  onDelete,
  selected = false,
}: ScenarioCardProps) {
  const { t } = useI18n();
  const runway = scenario.calculatedRunway ?? 0;
  const burnRate = scenario.calculatedBurnRate ?? 0;
  const breakevenMonth = scenario.calculatedBreakevenMonth;

  // Color based on runway length
  const getRunwayColor = (months: number) => {
    if (months >= 24) return 'text-green-600 dark:text-green-400';
    if (months >= 12) return 'text-blue-600 dark:text-blue-400';
    if (months >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <article
      aria-label={`Scenario: ${scenario.name}`}
      className={`
        relative border rounded-lg p-6 transition-all duration-200
        hover:shadow-lg cursor-pointer
        ${selected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        }
      `}
      onClick={onCompare}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {scenario.name}
          </h3>
          {scenario.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {scenario.description}
            </p>
          )}
        </div>
        
        {scenario.isBase && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
            {t('scenarios:card.base')}
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {/* Runway */}
        <div>
          <div className={`text-3xl font-bold ${getRunwayColor(runway)}`}>
            {t('scenarios:card.months', { count: runway })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('scenarios:card.runway.label')}
          </div>
        </div>

        {/* Burn Rate */}
        <div className="flex items-center gap-2 text-sm">
          <TrendingDown className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            ${burnRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}{t('scenarios:card.burnRate.perMonth')}
          </span>
        </div>

        {/* Breakeven */}
        {breakevenMonth !== undefined && breakevenMonth !== null && (
          <div className="text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ {t('scenarios:card.breakeven.label', { month: breakevenMonth })}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          {t('scenarios:card.edit')}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompare();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
        >
          <BarChart2 className="w-4 h-4" />
          {t('scenarios:card.compare')}
        </button>
        
        {!scenario.isBase && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t('scenarios:card.deleteConfirm', { name: scenario.name }))) {
                onDelete();
              }
            }}
            className="px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
            title={t('scenarios:card.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </article>
  );
}
