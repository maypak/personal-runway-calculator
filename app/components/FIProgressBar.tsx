/**
 * FI Progress Bar Component
 * 
 * Purpose: Visual progress towards FI with milestones
 * Features:
 * - Color-coded segments (red → yellow → green)
 * - 5 milestones: 25%, 50%, 75%, Coast FIRE (90%), 100% FI
 * - Tooltip on hover showing exact amounts
 * - Mobile responsive
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';

interface FIProgressBarProps {
  currentSavings: number;
  fiNumber: number;
  className?: string;
}

interface Milestone {
  percentage: number;
  label: string;
  color: string;
}

const MILESTONES: Milestone[] = [
  { percentage: 25, label: '25%', color: 'bg-red-500' },
  { percentage: 50, label: '50%', color: 'bg-yellow-500' },
  { percentage: 75, label: '75%', color: 'bg-blue-500' },
  { percentage: 90, label: 'Coast', color: 'bg-purple-500' },
  { percentage: 100, label: 'FI!', color: 'bg-green-500' },
];

export default function FIProgressBar({
  currentSavings,
  fiNumber,
  className = '',
}: FIProgressBarProps) {
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);

  // Calculate current progress percentage
  const currentProgress = fiNumber > 0 ? (currentSavings / fiNumber) * 100 : 0;
  const cappedProgress = Math.min(currentProgress, 100);

  // Determine color based on progress
  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'from-purple-500 to-green-500';
    if (progress >= 75) return 'from-blue-500 to-purple-500';
    if (progress >= 50) return 'from-yellow-500 to-blue-500';
    if (progress >= 25) return 'from-red-500 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            FI Progress
          </h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentProgress.toFixed(1)}%
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ${currentSavings.toLocaleString()} / ${fiNumber.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background track */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden relative">
          {/* Progress fill */}
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(cappedProgress)} transition-all duration-500 relative`}
            style={{ width: `${cappedProgress}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Milestone markers */}
        <div className="absolute inset-0 flex items-center">
          {MILESTONES.map((milestone, index) => {
            const isAchieved = currentProgress >= milestone.percentage;
            const isHovered = hoveredMilestone === index;
            const milestoneAmount = (fiNumber * milestone.percentage) / 100;

            return (
              <div
                key={milestone.percentage}
                className="absolute flex flex-col items-center"
                style={{ left: `${milestone.percentage}%`, transform: 'translateX(-50%)' }}
                onMouseEnter={() => setHoveredMilestone(index)}
                onMouseLeave={() => setHoveredMilestone(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                    <div className="font-semibold">{milestone.label} FI</div>
                    <div className="text-gray-300">
                      ${milestoneAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    {isAchieved && (
                      <div className="text-green-400 text-xs mt-1">✓ Achieved</div>
                    )}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                  </div>
                )}

                {/* Marker dot */}
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 
                    transition-all duration-300 cursor-pointer z-[1]
                    ${isAchieved ? milestone.color : 'bg-gray-400 dark:bg-gray-600'}
                    ${isHovered ? 'scale-125 shadow-lg' : 'scale-100'}
                  `}
                />

                {/* Label below (hidden on mobile for 25/75) */}
                <span
                  className={`
                    text-xs font-medium mt-1
                    ${isAchieved ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
                    ${(milestone.percentage === 25 || milestone.percentage === 75) ? 'hidden sm:block' : ''}
                  `}
                >
                  {milestone.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend (Mobile-friendly) */}
      <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Early (0-25%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Building (25-50%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Momentum (50-75%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Coast (90%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>FI! (100%)</span>
        </div>
      </div>
    </div>
  );
}
