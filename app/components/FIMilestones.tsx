/**
 * FI Milestones Component
 * 
 * Purpose: Display progress through FI milestones with dates
 * Features:
 * - 5 milestones: 25%, 50%, 75%, Coast FIRE (90%), 100% FI
 * - Status icons: ✅ (completed), 🔄 (in progress), ⏳ (future)
 * - Estimated achievement dates for future milestones
 * - Mobile responsive list view
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useMemo } from 'react';
import { Calendar, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { calculateFIMilestones } from '../utils/fireCalculator';
import { useI18n } from '../contexts/I18nContext';

interface FIMilestonesProps {
  currentSavings: number;
  monthlyContribution: number;
  fiNumber: number;
  investmentReturnRate?: number;
  className?: string;
}

export default function FIMilestones({
  currentSavings,
  monthlyContribution,
  fiNumber,
  investmentReturnRate = 7.0,
  className = '',
}: FIMilestonesProps) {
  const { t } = useI18n();
  
  // Calculate milestones using utility function
  const milestones = useMemo(() => {
    return calculateFIMilestones(
      currentSavings,
      monthlyContribution,
      fiNumber,
      investmentReturnRate
    );
  }, [currentSavings, monthlyContribution, fiNumber, investmentReturnRate]);

  // Determine current milestone (first incomplete one)
  const currentMilestoneIndex = milestones.findIndex(m => !m.achieved);
  const currentMilestone = currentMilestoneIndex !== -1 ? currentMilestoneIndex : milestones.length;

  // Format date nicely
  const formatDate = (dateString?: string): string => {
    if (!dateString) return t('fire:milestones.timeframe.notReachable');
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMonths = (date.getFullYear() - now.getFullYear()) * 12 + 
                       (date.getMonth() - now.getMonth());
    
    if (diffMonths < 0) return t('fire:milestones.status.achieved');
    if (diffMonths === 0) return t('fire:milestones.timeframe.thisMonth');
    if (diffMonths === 1) return t('fire:milestones.timeframe.nextMonth');
    if (diffMonths < 12) return t('fire:milestones.timeframe.months', { months: diffMonths });
    
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    if (months === 0) {
      return years === 1 
        ? t('fire:milestones.timeframe.year', { years })
        : t('fire:milestones.timeframe.years', { years });
    }
    return t('fire:milestones.timeframe.yearsMonths', { years, months });
  };

  // Get milestone icon and styling
  const getMilestoneDisplay = (index: number, achieved: boolean) => {
    if (achieved) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-400',
        statusText: t('fire:milestones.status.completed'),
        statusIcon: '✅',
      };
    }
    
    if (index === currentMilestoneIndex) {
      return {
        icon: <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-400',
        statusText: t('fire:milestones.status.inProgress'),
        statusIcon: '🔄',
      };
    }
    
    return {
      icon: <Clock className="h-5 w-5 text-gray-400" />,
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
      textColor: 'text-gray-500 dark:text-gray-400',
      statusText: t('fire:milestones.status.future'),
      statusIcon: '⏳',
    };
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('fire:milestones.title')}
        </h3>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {t('fire:milestones.completeSummary', {
            completed: milestones.filter(m => m.achieved).length,
            total: milestones.length
          })}
        </span>
      </div>

      {/* Milestones list */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const display = getMilestoneDisplay(index, milestone.achieved);
          const displayDate = milestone.achieved 
            ? formatDate(milestone.achievedDate)
            : formatDate(milestone.estimatedDate);

          return (
            <div
              key={milestone.name}
              className={`
                flex items-center justify-between p-4 rounded-lg border transition-all
                ${display.bgColor} ${display.borderColor}
                ${index === currentMilestoneIndex ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
              `}
            >
              {/* Left side: Icon + Info */}
              <div className="flex items-center gap-3 flex-1">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {display.icon}
                </div>

                {/* Milestone info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {milestone.name}
                    </h4>
                    <span className="text-xs">{display.statusIcon}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ${milestone.targetAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* Right side: Date/Status */}
              <div className="text-right flex-shrink-0 ml-4">
                <div className={`text-sm font-medium ${display.textColor}`}>
                  {displayDate}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {display.statusText}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {t('fire:milestones.next')}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {currentMilestone < milestones.length 
              ? milestones[currentMilestone].name 
              : t('fire:milestones.allComplete')}
          </span>
        </div>
        {currentMilestone < milestones.length && milestones[currentMilestone].estimatedDate && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{t('fire:scenarios.estimatedDate')}:</span>
            <span>{formatDate(milestones[currentMilestone].estimatedDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
