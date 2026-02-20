'use client';

import { useState } from 'react';
import { Target, PartyPopper, BarChart3, DollarSign, Sparkles, Edit2, Trash2, X } from 'lucide-react';
import type { UserGoal } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { formatCurrency } from '../utils/currencyFormatter';

interface GoalProgressProps {
  goal: UserGoal;
  currentRunway: number; // in months
  remainingFunds: number; // in dollars
  onEdit: () => void;
  onDelete: () => void;
}

export default function GoalProgress({
  goal,
  currentRunway,
  remainingFunds,
  onEdit,
  onDelete,
}: GoalProgressProps) {
  const { t, locale } = useI18n();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate progress based on goal type
  let progress = 0;
  let currentValue = 0;
  let targetValue = goal.targetValue;
  let deficit = 0;

  if (goal.goalType === 'runway') {
    currentValue = currentRunway;
    targetValue = goal.targetValue;
    progress = currentRunway > 0 ? Math.min((currentRunway / targetValue) * 100, 100) : 0;
    deficit = Math.max(targetValue - currentRunway, 0);
  } else {
    // savings
    currentValue = remainingFunds;
    targetValue = goal.targetValue;
    progress = remainingFunds > 0 ? Math.min((remainingFunds / targetValue) * 100, 100) : 0;
    deficit = Math.max(targetValue - remainingFunds, 0);
  }

  const isAchieved = progress >= 100;

  // Format numbers
  const formatValue = (value: number) => {
    if (goal.goalType === 'runway') {
      return `${value.toFixed(1)} ${value === 1 ? t('goals:progress.month') : t('goals:progress.months')}`;
    } else {
      return formatCurrency(value, "USD" as any);
    }
  };

  return (
    <div className="bg-surface-card rounded-xl shadow-md p-4 sm:p-6 border-2 border-primary/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isAchieved ? (
            <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 text-success" />
          ) : (
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          )}
          <div>
            <h3 className="text-base sm:text-xl font-bold text-text-primary">
              {isAchieved ? t('goals:progress.achieved') : t('goals:progress.yourGoal')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {goal.goalType === 'runway' 
                ? t('goals:progress.runwayGoal', { months: goal.targetValue.toString() })
                : t('goals:progress.savingsGoal', { amount: formatCurrency(goal.targetValue, "USD" as any) })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-primary hover:bg-surface-hover rounded-lg
              transition-all duration-200 active:scale-95"
            aria-label="Edit goal"
            title="Edit goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-error hover:bg-surface-hover rounded-lg
              transition-all duration-200 active:scale-95"
            aria-label="Delete goal"
            title="Delete goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-sm text-text-secondary mb-3 italic">
          "{goal.description}"
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="w-full bg-bg-tertiary rounded-full h-3 sm:h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary-hover h-3 sm:h-4 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="text-right text-xs sm:text-sm font-semibold text-primary mt-1">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Values */}
      <div className="text-base sm:text-lg font-mono text-text-primary mb-3">
        {formatValue(currentValue)} / {formatValue(targetValue)}
      </div>

      {/* Status Info */}
      {!isAchieved ? (
        <div className="space-y-2 p-3 sm:p-4 bg-primary-light rounded-xl border border-primary/20">
          <div className="flex items-start gap-3 text-xs sm:text-sm">
            <BarChart3 className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-text-secondary">
              {t('goals:progress.current')}: <span className="font-semibold text-primary">
                {formatValue(currentValue)}
              </span>
            </span>
          </div>
          <div className="flex items-start gap-3 text-xs sm:text-sm">
            <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-text-secondary">
              {t('goals:progress.need')}: <span className="font-semibold text-primary">
                {formatValue(deficit)} {t('goals:progress.more')}
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 bg-success/10 rounded-xl border border-success/20">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-success">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">
              {t('goals:progress.congratulations')}
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-surface-card rounded-xl p-6 max-w-sm w-full shadow-xl border border-border-subtle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-primary">
                {t('goals:progress.deleteConfirm.title')}
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-text-tertiary hover:text-text-secondary p-1 rounded-lg
                  hover:bg-surface-hover transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-text-secondary mb-6">
              {t('goals:progress.deleteConfirm.message')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2
                  bg-surface-hover hover:bg-surface-active
                  text-text-primary rounded-lg font-medium
                  transition-all duration-200 active:scale-98"
              >
                {t('goals:progress.deleteConfirm.cancel')}
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2
                  bg-error hover:bg-error/90
                  text-white rounded-lg font-medium
                  transition-all duration-200 active:scale-98"
              >
                {t('goals:progress.deleteConfirm.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
