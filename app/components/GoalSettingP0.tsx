/**
 * GoalSettingP0.tsx - P0: 목표 설정 & 역산 컴포넌트
 */

'use client';

import { useState } from 'react';
import { analyzeGoal, getGoalStatusEmoji, type GoalAnalysis } from '../../lib/calculations/goal';
import { useI18n } from '../contexts/I18nContext';

interface GoalSettingP0Props {
  currentRunway: number;
  balance: number;
  monthlyExpenses: number;
}

export default function GoalSettingP0({ currentRunway, balance, monthlyExpenses }: GoalSettingP0Props) {
  const { t } = useI18n();
  const [goalEnabled, setGoalEnabled] = useState(false);
  const [targetMonths, setTargetMonths] = useState<number>(6);
  const [analysis, setAnalysis] = useState<GoalAnalysis | null>(null);

  const handleSetGoal = () => {
    if (!goalEnabled) {
      setGoalEnabled(true);
      setAnalysis(analyzeGoal(balance, monthlyExpenses, targetMonths));
    } else {
      setGoalEnabled(false);
      setAnalysis(null);
    }
  };

  const handleTargetChange = (value: number) => {
    setTargetMonths(value);
    if (goalEnabled) {
      setAnalysis(analyzeGoal(balance, monthlyExpenses, value));
    }
  };

  const getStatusText = (status: string) => {
    const key = `dashboard.goalSetting.status.${status}`;
    const val = t(key);
    return val !== key ? val : t('dashboard.goalSetting.status.unknown');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-50 border-green-200 text-green-800';
      case 'tight': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>🎯</span>
          <span>{t('dashboard.goalSetting.title')}</span>
        </h2>
        <button
          onClick={handleSetGoal}
          className={`min-h-[44px] px-4 py-2 rounded-lg font-semibold transition-all ${
            goalEnabled ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {goalEnabled ? t('dashboard.goalSetting.unset') : t('dashboard.goalSetting.set')}
        </button>
      </div>

      {goalEnabled ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard.goalSetting.targetLabel')}
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={targetMonths}
              onChange={(e) => handleTargetChange(parseFloat(e.target.value) || 0)}
              className="w-full min-h-[44px] px-4 py-2 text-lg font-mono bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {analysis && (
            <div className={`p-4 rounded-lg border-2 ${getStatusColor(analysis.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold">
                  {getGoalStatusEmoji(analysis.status)} {t('dashboard.goalSetting.currentStatus')}: {getStatusText(analysis.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{t('dashboard.goalSetting.currentRunway')}:</span>
                  <span>{analysis.currentMonths}{t('common.months')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('dashboard.goalSetting.target')}:</span>
                  <span>{analysis.targetMonths}{t('common.months')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('dashboard.goalSetting.gap')}:</span>
                  <span className={analysis.gap >= 0 ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                    {analysis.gap > 0 ? '+' : ''}{analysis.gap}{t('common.months')} {analysis.gap >= 0 ? t('dashboard.goalSetting.surplus') : t('dashboard.goalSetting.shortage')}
                  </span>
                </div>
              </div>

              {analysis.suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                  <div className="font-bold text-sm mb-2">{t('dashboard.goalSetting.suggestions')}</div>
                  <ul className="space-y-2 text-sm">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0">{suggestion.icon}</span>
                        <span>{suggestion.description} {t('dashboard.goalSetting.suggestionsAction')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>{t('dashboard.goalSetting.empty')}</p>
        </div>
      )}
    </div>
  );
}
