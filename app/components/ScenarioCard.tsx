'use client';

import type { Scenario } from '../types';
import { TrendingUp, TrendingDown, Edit, Trash2, Copy, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';

interface ScenarioCardProps {
  scenario: Scenario;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onCompare?: (id: string) => void;
  selected?: boolean;
  compact?: boolean;
}

export default function ScenarioCard({
  scenario,
  onEdit,
  onDelete,
  onDuplicate,
  onCompare,
  selected = false,
  compact = false,
}: ScenarioCardProps) {
  const runway = scenario.calculatedRunway || 0;
  const burnRate = scenario.calculatedBurnRate || 0;
  const isSurplus = burnRate < 0;

  // Format runway display
  const runwayYears = Math.floor(runway / 12);
  const runwayMonths = Math.floor(runway % 12);
  const runwayDisplay =
    runwayYears > 0 ? `${runwayYears}y ${runwayMonths}m` : `${runwayMonths}m`;

  // Color based on runway
  const runwayColor =
    runway > 24
      ? 'text-success'
      : runway > 12
      ? 'text-info'
      : runway > 6
      ? 'text-warning'
      : 'text-error';

  return (
    <div
      className={`
        bg-surface-card rounded-xl border-2 transition-all duration-200
        ${selected ? 'border-primary shadow-lg scale-105' : 'border-border-subtle hover:border-primary/50'}
        ${compact ? 'p-4' : 'p-6'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            {scenario.name}
            {scenario.isBase && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Base
              </span>
            )}
          </h3>
          {scenario.description && (
            <p className="text-sm text-text-tertiary mt-1">{scenario.description}</p>
          )}
        </div>

        {/* Actions */}
        {!compact && (
          <div className="flex items-center gap-2">
            {onCompare && (
              <button
                onClick={() => onCompare(scenario.id)}
                className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                title="Compare"
              >
                <BarChart3 className="w-4 h-4 text-text-secondary" />
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(scenario.id)}
                className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                title="Duplicate"
              >
                <Copy className="w-4 h-4 text-text-secondary" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(scenario.id)}
                className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-text-secondary" />
              </button>
            )}
            {onDelete && !scenario.isBase && (
              <button
                onClick={() => onDelete(scenario.id)}
                className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-error" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Runway Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${runwayColor}`}>{runwayDisplay}</span>
          <span className="text-sm text-text-tertiary">runway</span>
        </div>
        {runway > 999 && (
          <div className="text-sm text-success mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Infinite runway!</span>
          </div>
        )}
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-text-tertiary">Savings</div>
          <div className="font-semibold text-text-primary">
            {formatCurrency(scenario.totalSavings, 'USD')}
          </div>
        </div>

        <div>
          <div className="text-text-tertiary">Monthly Burn</div>
          <div className={`font-semibold flex items-center gap-1 ${isSurplus ? 'text-success' : 'text-text-primary'}`}>
            {isSurplus ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {formatCurrency(Math.abs(burnRate), 'USD')}
          </div>
        </div>

        {scenario.monthlyIncome > 0 && (
          <div>
            <div className="text-text-tertiary">Income</div>
            <div className="font-semibold text-success">
              +{formatCurrency(scenario.monthlyIncome, 'USD')}
            </div>
          </div>
        )}

        {scenario.monthlyExpenses > 0 && (
          <div>
            <div className="text-text-tertiary">Expenses</div>
            <div className="font-semibold text-error">
              -{formatCurrency(scenario.monthlyExpenses, 'USD')}
            </div>
          </div>
        )}
      </div>

      {/* Special Items */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            {scenario.oneTimeExpenses.length > 0 && (
              <div>
                {scenario.oneTimeExpenses.length} one-time expense
                {scenario.oneTimeExpenses.length > 1 ? 's' : ''}
              </div>
            )}
            {scenario.recurringItems.length > 0 && (
              <div>
                {scenario.recurringItems.length} recurring item
                {scenario.recurringItems.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
