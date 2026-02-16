'use client';

import { useState, useEffect } from 'react';
import type { UserGoal } from '../types';

interface GoalSettingProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingGoal?: UserGoal | null;
}

export default function GoalSetting({
  isOpen,
  onClose,
  onSave,
  existingGoal,
}: GoalSettingProps) {
  const [goalType, setGoalType] = useState<'runway' | 'savings'>('runway');
  const [targetValue, setTargetValue] = useState('');
  const [description, setDescription] = useState('');

  // Initialize form with existing goal data
  useEffect(() => {
    if (existingGoal) {
      setGoalType(existingGoal.goalType);
      setTargetValue(existingGoal.targetValue.toString());
      setDescription(existingGoal.description || '');
    } else {
      setGoalType('runway');
      setTargetValue('');
      setDescription('');
    }
  }, [existingGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = parseFloat(targetValue);
    if (isNaN(value) || value <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    onSave({
      goalType,
      targetValue: value,
      description: description.trim() || undefined,
      isActive: true,
      achievedAt: undefined,
    });

    // Reset form
    setGoalType('runway');
    setTargetValue('');
    setDescription('');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎯</span>
            {existingGoal ? 'Edit Goal' : 'Set Your Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Goal Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="goalType"
                  value="runway"
                  checked={goalType === 'runway'}
                  onChange={(e) => setGoalType(e.target.value as 'runway' | 'savings')}
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Runway (months)
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    How many months you want to survive
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="goalType"
                  value="savings"
                  checked={goalType === 'savings'}
                  onChange={(e) => setGoalType(e.target.value as 'runway' | 'savings')}
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Savings Amount ($)
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Target amount of money to save
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label htmlFor="targetValue" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Target {goalType === 'runway' ? 'Months' : 'Amount ($)'}
            </label>
            <input
              id="targetValue"
              type="number"
              step={goalType === 'runway' ? '0.5' : '100'}
              min="0"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder={goalType === 'runway' ? 'e.g., 6' : 'e.g., 30000'}
              className="w-full px-4 py-3 text-lg font-mono border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              required
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {goalType === 'runway' 
                ? 'Recommended: 3-12 months' 
                : 'Enter your target savings amount'}
            </p>
          </div>

          {/* Description (Optional) */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Why this goal? <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id="description"
              type="text"
              maxLength={50}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Safe quit my job"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description.length}/50 characters
            </p>
          </div>

          {/* Free Tier Notice */}
          {!existingGoal && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Free tier:</strong> You can set 1 active goal. 
                Setting a new goal will replace your current one.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              {existingGoal ? 'Update Goal' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
