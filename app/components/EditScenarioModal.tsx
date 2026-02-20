'use client';

import { useState } from 'react';
import { Scenario } from '../types';
import { X } from 'lucide-react';

interface EditScenarioModalProps {
  scenario: Scenario;
  onSave: (id: string, updates: Partial<Scenario>) => Promise<boolean>;
  onClose: () => void;
}

export default function EditScenarioModal({
  scenario,
  onSave,
  onClose,
}: EditScenarioModalProps) {
  const [name, setName] = useState(scenario.name);
  const [description, setDescription] = useState(scenario.description || '');
  const [totalSavings, setTotalSavings] = useState(scenario.totalSavings.toString());
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    scenario.monthlyExpenses.toString()
  );
  const [monthlyIncome, setMonthlyIncome] = useState(scenario.monthlyIncome.toString());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const success = await onSave(scenario.id, {
        name,
        description: description || undefined,
        totalSavings: parseFloat(totalSavings),
        monthlyExpenses: parseFloat(monthlyExpenses),
        monthlyIncome: parseFloat(monthlyIncome),
      });

      if (success) {
        onClose();
      } else {
        setError('Failed to save scenario');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-card border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Edit Scenario</h2>
            <p className="text-sm text-text-tertiary mt-1">
              Update financial values for{' '}
              <span className="font-medium text-text-primary">{scenario.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Scenario Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Conservative, Optimistic"
              className="w-full px-4 py-3 bg-bg-primary border-2 border-border-subtle rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief note about this scenario..."
              rows={2}
              className="w-full px-4 py-3 bg-bg-primary border-2 border-border-subtle rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Financial Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Savings */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Total Savings *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                  $
                </span>
                <input
                  type="number"
                  value={totalSavings}
                  onChange={(e) => setTotalSavings(e.target.value)}
                  required
                  step="0.01"
                  min="0"
                  placeholder="50000"
                  className="w-full pl-8 pr-4 py-3 bg-bg-primary border-2 border-border-subtle rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                Current total savings available
              </p>
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Monthly Expenses *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                  $
                </span>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  required
                  step="0.01"
                  min="0"
                  placeholder="3500"
                  className="w-full pl-8 pr-4 py-3 bg-bg-primary border-2 border-border-subtle rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <p className="text-xs text-text-tertiary mt-1">Per month</p>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                  $
                </span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-bg-primary border-2 border-border-subtle rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                Per month (optional)
              </p>
            </div>
          </div>

          {/* Calculated Preview */}
          <div className="bg-bg-tertiary rounded-xl p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Preview Calculation
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-text-tertiary">Monthly Burn</div>
                <div className="font-semibold text-text-primary">
                  $
                  {(
                    parseFloat(monthlyExpenses || '0') -
                    parseFloat(monthlyIncome || '0')
                  ).toFixed(0)}
                  /mo
                </div>
              </div>
              <div>
                <div className="text-text-tertiary">Runway</div>
                <div className="font-semibold text-text-primary">
                  {parseFloat(monthlyExpenses) > 0
                    ? Math.floor(
                        parseFloat(totalSavings || '0') /
                          parseFloat(monthlyExpenses || '1')
                      )
                    : '∞'}{' '}
                  months
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-text-disabled text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-surface-card border-2 border-border-subtle hover:border-primary text-text-primary rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
