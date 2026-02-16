'use client';

import { useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';
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
        className="bg-surface-card rounded-xl p-6 max-w-md w-full shadow-xl border border-border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {existingGoal ? 'Edit Goal' : 'Set Your Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-secondary p-1 rounded-lg
              hover:bg-surface-hover transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Type */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-3">
              Goal Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer
                hover:bg-surface-hover transition-all duration-200
                border-border-default hover:border-primary/50">
                <input
                  type="radio"
                  name="goalType"
                  value="runway"
                  checked={goalType === 'runway'}
                  onChange={(e) => setGoalType(e.target.value as 'runway' | 'savings')}
                  className="w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">
                    Runway (months)
                  </div>
                  <div className="text-xs text-text-tertiary">
                    How many months you want to survive
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer
                hover:bg-surface-hover transition-all duration-200
                border-border-default hover:border-primary/50">
                <input
                  type="radio"
                  name="goalType"
                  value="savings"
                  checked={goalType === 'savings'}
                  onChange={(e) => setGoalType(e.target.value as 'runway' | 'savings')}
                  className="w-4 h-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">
                    Savings Amount ($)
                  </div>
                  <div className="text-xs text-text-tertiary">
                    Target amount of money to save
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label htmlFor="targetValue" className="block text-sm font-semibold text-text-secondary mb-2">
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
              className="w-full px-4 py-3 text-lg font-mono
                bg-surface-card border-2 border-border-default rounded-lg
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200"
              required
            />
            <p className="text-xs text-text-tertiary mt-1">
              {goalType === 'runway' 
                ? 'Recommended: 3-12 months' 
                : 'Enter your target savings amount'}
            </p>
          </div>

          {/* Description (Optional) */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-text-secondary mb-2">
              Why this goal? <span className="text-text-tertiary font-normal">(optional)</span>
            </label>
            <input
              id="description"
              type="text"
              maxLength={50}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Safe quit my job"
              className="w-full px-4 py-2
                bg-surface-card border-2 border-border-default rounded-lg
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200"
            />
            <p className="text-xs text-text-tertiary mt-1">
              {description.length}/50 characters
            </p>
          </div>

          {/* Free Tier Notice */}
          {!existingGoal && (
            <div className="p-3 bg-info/10 rounded-lg border border-info/20">
              <p className="text-xs text-info">
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
              className="flex-1 px-4 py-3
                bg-surface-hover hover:bg-surface-active
                text-text-primary rounded-lg font-semibold
                transition-all duration-200 active:scale-98"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3
                bg-primary hover:bg-primary-hover active:bg-primary-active
                text-white rounded-lg font-semibold
                shadow-md hover:shadow-lg
                transition-all duration-200 active:scale-98"
            >
              {existingGoal ? 'Update Goal' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
