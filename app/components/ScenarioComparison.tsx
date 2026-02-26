/**
 * ScenarioComparison.tsx - P0: 시나리오 비교 컴포넌트
 * 
 * Purpose: Display multiple runway scenarios side-by-side
 * Features:
 * - 4+ predefined scenarios (현재/절약-10%/절약-20%/최악+20%)
 * - Add custom scenarios
 * - Visual status indicators
 * 
 * Created: 2026-02-26 (P0 Features)
 * Author: Developer Agent (Subagent)
 */

'use client';

import { useState } from 'react';
import { calculateScenario, type Scenario, type ScenarioResult } from '../../lib/calculations/runway';
import { formatDateKorean, formatCurrency } from '../../lib/calculations/runway';

interface ScenarioComparisonProps {
  balance: number;
  monthlyExpenses: number;
}

const defaultScenarios: Scenario[] = [
  { name: '현재', type: 'expense_adjustment', value: 0, icon: '🟡' },
  { name: '절약 -10%', type: 'expense_adjustment', value: -0.1, icon: '✅' },
  { name: '절약 -20%', type: 'expense_adjustment', value: -0.2, icon: '🎯' },
  { name: '최악 +20%', type: 'expense_adjustment', value: 0.2, icon: '🔴' },
];

export default function ScenarioComparison({ balance, monthlyExpenses }: ScenarioComparisonProps) {
  const [scenarios] = useState<Scenario[]>(defaultScenarios);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Calculate all scenario results
  const results: ScenarioResult[] = scenarios.map(scenario =>
    calculateScenario(balance, monthlyExpenses, scenario)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📊</span>
        <span>시나리오 비교</span>
      </h2>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-2xl flex-shrink-0">{result.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-base">
                    {result.name}
                  </div>
                  <div className="text-sm opacity-80">
                    {formatCurrency(result.monthlyExpenses)} / 월
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold">
                  {result.months.toFixed(1)}개월
                </div>
                {result.endDate && (
                  <div className="text-xs opacity-80">
                    {formatDateKorean(result.endDate)}까지
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Scenario Button (Optional - P1) */}
      {showCustomForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            커스텀 시나리오 추가 기능은 다음 버전에서 제공됩니다.
          </p>
          <button
            onClick={() => setShowCustomForm(false)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            닫기
          </button>
        </div>
      )}

      {!showCustomForm && (
        <button
          onClick={() => setShowCustomForm(true)}
          className="mt-4 w-full min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all border border-gray-300"
        >
          + 커스텀 시나리오 추가 (곧 출시)
        </button>
      )}
    </div>
  );
}
