'use client';

import { Scenario } from '../types';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';

interface ComparisonViewProps {
  scenarios: Scenario[];
  onClose: () => void;
}

export default function ComparisonView({ scenarios, onClose }: ComparisonViewProps) {
  if (scenarios.length === 0) {
    return null;
  }

  // Helper to get color class
  const getValueColor = (value: number, baseline: number) => {
    if (value > baseline) return 'text-success';
    if (value < baseline) return 'text-error';
    return 'text-text-primary';
  };

  // Helper to format difference
  const formatDiff = (value: number, baseline: number) => {
    const diff = value - baseline;
    if (diff === 0) return '—';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${Math.round(diff)}`;
  };

  // Use first scenario as baseline
  const baseline = scenarios[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-card border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Scenario Comparison
            </h2>
            <p className="text-sm text-text-tertiary mt-1">
              Comparing {scenarios.length} scenario{scenarios.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-4 px-4 font-semibold text-text-secondary">
                    Metric
                  </th>
                  {scenarios.map((scenario, idx) => (
                    <th
                      key={scenario.id}
                      className="text-center py-4 px-4 font-semibold text-text-primary"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span>{scenario.name}</span>
                        {idx === 0 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Baseline
                          </span>
                        )}
                        {scenario.isBase && (
                          <span className="text-xs bg-surface-tertiary text-text-tertiary px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Runway */}
                <tr className="border-b border-border-subtle hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    Total Runway
                  </td>
                  {scenarios.map((scenario, idx) => {
                    const runway = scenario.calculatedRunway || 0;
                    const years = Math.floor(runway / 12);
                    const months = Math.floor(runway % 12);
                    const display = years > 0 ? `${years}y ${months}m` : `${months}m`;

                    return (
                      <td
                        key={scenario.id}
                        className={`py-4 px-4 text-center ${
                          idx === 0
                            ? 'font-bold text-text-primary'
                            : getValueColor(runway, baseline.calculatedRunway || 0)
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl">{display}</span>
                          {idx > 0 && (
                            <span className="text-xs text-text-tertiary">
                              {formatDiff(runway, baseline.calculatedRunway || 0)} months
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Savings */}
                <tr className="border-b border-border-subtle hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    Total Savings
                  </td>
                  {scenarios.map((scenario, idx) => (
                    <td
                      key={scenario.id}
                      className={`py-4 px-4 text-center ${
                        idx === 0
                          ? 'text-text-primary'
                          : getValueColor(scenario.totalSavings, baseline.totalSavings)
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{formatCurrency(scenario.totalSavings, 'USD')}</span>
                        {idx > 0 && (
                          <span className="text-xs text-text-tertiary">
                            {formatCurrency(
                              scenario.totalSavings - baseline.totalSavings,
                              'USD'
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Monthly Burn Rate */}
                <tr className="border-b border-border-subtle hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    Monthly Burn Rate
                  </td>
                  {scenarios.map((scenario, idx) => {
                    const burn = scenario.calculatedBurnRate || 0;
                    const isSurplus = burn < 0;

                    return (
                      <td
                        key={scenario.id}
                        className={`py-4 px-4 text-center ${
                          idx === 0
                            ? isSurplus
                              ? 'text-success'
                              : 'text-text-primary'
                            : getValueColor(
                                Math.abs(burn),
                                Math.abs(baseline.calculatedBurnRate || 0)
                              )
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="flex items-center gap-1">
                            {isSurplus ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {formatCurrency(Math.abs(burn), 'USD')}/mo
                          </span>
                          {idx > 0 && (
                            <span className="text-xs text-text-tertiary">
                              {formatCurrency(
                                burn - (baseline.calculatedBurnRate || 0),
                                'USD'
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Monthly Expenses */}
                <tr className="border-b border-border-subtle hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    Monthly Expenses
                  </td>
                  {scenarios.map((scenario, idx) => (
                    <td
                      key={scenario.id}
                      className="py-4 px-4 text-center text-text-primary"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{formatCurrency(scenario.monthlyExpenses, 'USD')}</span>
                        {idx > 0 && (
                          <span className="text-xs text-text-tertiary">
                            {formatCurrency(
                              scenario.monthlyExpenses - baseline.monthlyExpenses,
                              'USD'
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Monthly Income */}
                <tr className="border-b border-border-subtle hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    Monthly Income
                  </td>
                  {scenarios.map((scenario, idx) => (
                    <td
                      key={scenario.id}
                      className={`py-4 px-4 text-center ${
                        scenario.monthlyIncome > 0 ? 'text-success' : 'text-text-tertiary'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>
                          {scenario.monthlyIncome > 0
                            ? `+${formatCurrency(scenario.monthlyIncome, 'USD')}`
                            : '—'}
                        </span>
                        {idx > 0 && scenario.monthlyIncome > 0 && (
                          <span className="text-xs text-text-tertiary">
                            {formatCurrency(
                              scenario.monthlyIncome - baseline.monthlyIncome,
                              'USD'
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* One-time Expenses */}
                <tr className="border-b border-border-subtle hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    One-time Expenses
                  </td>
                  {scenarios.map((scenario) => (
                    <td
                      key={scenario.id}
                      className="py-4 px-4 text-center text-text-tertiary"
                    >
                      {scenario.oneTimeExpenses.length > 0
                        ? `${scenario.oneTimeExpenses.length} item${
                            scenario.oneTimeExpenses.length > 1 ? 's' : ''
                          }`
                        : '—'}
                    </td>
                  ))}
                </tr>

                {/* Recurring Items */}
                <tr className="hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4 font-medium text-text-primary">
                    Recurring Items
                  </td>
                  {scenarios.map((scenario) => (
                    <td
                      key={scenario.id}
                      className="py-4 px-4 text-center text-text-tertiary"
                    >
                      {scenario.recurringItems.length > 0
                        ? `${scenario.recurringItems.length} item${
                            scenario.recurringItems.length > 1 ? 's' : ''
                          }`
                        : '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-8 p-6 bg-bg-tertiary rounded-xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Comparison Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-text-tertiary mb-1">Best Runway</div>
                <div className="font-semibold text-success">
                  {
                    [...scenarios].sort(
                      (a, b) => (b.calculatedRunway || 0) - (a.calculatedRunway || 0)
                    )[0].name
                  }
                </div>
              </div>
              <div>
                <div className="text-text-tertiary mb-1">Lowest Burn Rate</div>
                <div className="font-semibold text-success">
                  {
                    [...scenarios].sort(
                      (a, b) =>
                        Math.abs(a.calculatedBurnRate || 0) -
                        Math.abs(b.calculatedBurnRate || 0)
                    )[0].name
                  }
                </div>
              </div>
              <div>
                <div className="text-text-tertiary mb-1">Highest Income</div>
                <div className="font-semibold text-success">
                  {
                    [...scenarios].sort((a, b) => b.monthlyIncome - a.monthlyIncome)[0]
                      .name
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-card border-t border-border-subtle px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
