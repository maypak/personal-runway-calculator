'use client';

import { useState } from 'react';
import type { UserGoal } from '../types';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate progress based on goal type
  let progress = 0;
  let currentValue = 0;
  let targetValue = goal.targetValue;
  let deficit = 0;
  let unit = '';

  if (goal.goalType === 'runway') {
    currentValue = currentRunway;
    targetValue = goal.targetValue;
    progress = currentRunway > 0 ? Math.min((currentRunway / targetValue) * 100, 100) : 0;
    deficit = Math.max(targetValue - currentRunway, 0);
    unit = 'months';
  } else {
    // savings
    currentValue = remainingFunds;
    targetValue = goal.targetValue;
    progress = remainingFunds > 0 ? Math.min((remainingFunds / targetValue) * 100, 100) : 0;
    deficit = Math.max(targetValue - remainingFunds, 0);
    unit = '$';
  }

  const isAchieved = progress >= 100;

  // Format numbers
  const formatValue = (value: number) => {
    if (goal.goalType === 'runway') {
      return `${value.toFixed(1)} ${value === 1 ? 'month' : 'months'}`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-violet-200 dark:border-violet-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">
            {isAchieved ? '🎉' : '🎯'}
          </span>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
              {isAchieved ? 'Goal Achieved!' : 'Your Goal'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {goal.goalType === 'runway' 
                ? `${goal.targetValue}-Month Runway` 
                : `$${goal.targetValue.toLocaleString()} Savings`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
            aria-label="Edit goal"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
            aria-label="Delete goal"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
          "{goal.description}"
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-500 to-violet-600 h-3 sm:h-4 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="text-right text-xs sm:text-sm font-semibold text-violet-700 dark:text-violet-400 mt-1">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Values */}
      <div className="text-base sm:text-lg font-mono text-gray-700 dark:text-gray-300 mb-3">
        {formatValue(currentValue)} / {formatValue(targetValue)}
      </div>

      {/* Status Info */}
      {!isAchieved ? (
        <div className="space-y-2 p-3 sm:p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
          <div className="flex items-start gap-2 text-xs sm:text-sm">
            <span className="text-base sm:text-lg flex-shrink-0">📊</span>
            <span className="text-gray-700 dark:text-gray-300">
              Current: <span className="font-semibold text-violet-700 dark:text-violet-400">
                {formatValue(currentValue)}
              </span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm">
            <span className="text-base sm:text-lg flex-shrink-0">💰</span>
            <span className="text-gray-700 dark:text-gray-300">
              Need: <span className="font-semibold text-violet-700 dark:text-violet-400">
                {formatValue(deficit)} more
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700 dark:text-green-400">
            <span className="text-base sm:text-lg">✨</span>
            <span className="font-semibold">
              Congratulations! You've reached your goal.
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
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Goal?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this goal? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
