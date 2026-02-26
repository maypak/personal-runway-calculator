/**
 * ScenarioComparison.tsx - P0+P1: 시나리오 비교 컴포넌트
 * 
 * Purpose: Display multiple runway scenarios side-by-side
 * Features:
 * - 4 predefined scenarios (현재/절약-10%/절약-20%/최악+20%)
 * - P1: Add custom scenarios
 * - P1: Presets (창업가/프리랜서/취준생)
 * - P1: LocalStorage persistence
 * - Visual status indicators
 * 
 * Created: 2026-02-26 (P0+P1 Features)
 * Author: Developer Agent (Subagent)
 */

'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { calculateScenario, type Scenario, type ScenarioResult } from '../../lib/calculations/runway';
import { formatDateKorean, formatCurrency } from '../../lib/calculations/runway';
import AddScenarioModal, { type CustomScenario } from './AddScenarioModal';
import { presetCategories } from '@/lib/scenarios/presets';

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

const STORAGE_KEY = 'personal_runway_custom_scenarios';
const MAX_CUSTOM_SCENARIOS = 10;

export default function ScenarioComparison({ balance, monthlyExpenses }: ScenarioComparisonProps) {
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Load custom scenarios from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCustomScenarios(parsed);
        } catch (error) {
          console.error('Failed to parse custom scenarios:', error);
        }
      }
    }
  }, []);

  // Save custom scenarios to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && customScenarios.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customScenarios));
    }
  }, [customScenarios]);

  // Combine default and custom scenarios
  const allScenarios: Scenario[] = [
    ...defaultScenarios,
    ...customScenarios.map((cs) => ({
      name: cs.name,
      type: cs.type,
      value: cs.value,
      icon: cs.icon,
    })),
  ];

  // Calculate all scenario results
  const results: ScenarioResult[] = allScenarios.map((scenario) =>
    calculateScenario(balance, monthlyExpenses, scenario)
  );

  const handleAddScenario = (scenario: CustomScenario) => {
    if (customScenarios.length >= MAX_CUSTOM_SCENARIOS) {
      alert(`최대 ${MAX_CUSTOM_SCENARIOS}개까지 추가할 수 있습니다`);
      return;
    }
    setCustomScenarios([...customScenarios, scenario]);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    if (window.confirm('이 시나리오를 삭제하시겠습니까?')) {
      const updated = customScenarios.filter((s) => s.id !== scenarioId);
      setCustomScenarios(updated);
      
      // Update localStorage
      if (updated.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }
  };

  const handleAddPreset = (preset: Omit<CustomScenario, 'id'>) => {
    if (customScenarios.length >= MAX_CUSTOM_SCENARIOS) {
      alert(`최대 ${MAX_CUSTOM_SCENARIOS}개까지 추가할 수 있습니다`);
      return;
    }

    const scenario: CustomScenario = {
      ...preset,
      id: `preset-${Date.now()}`,
    };
    setCustomScenarios([...customScenarios, scenario]);
    setShowPresets(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>📊</span>
          <span>시나리오 비교</span>
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg transition-colors"
          >
            📋 프리셋
          </button>
        </div>
      </div>

      {/* Preset Selection */}
      {showPresets && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">프리셋 선택</h3>
          <div className="space-y-3">
            {presetCategories.map((category) => (
              <div key={category.id}>
                <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {category.name} - {category.description}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {category.scenarios.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddPreset(preset)}
                      className="text-left px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <span className="mr-2">{preset.icon}</span>
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowPresets(false)}
            className="mt-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            닫기
          </button>
        </div>
      )}

      {/* Scenario Results */}
      <div className="space-y-3">
        {results.map((result, index) => {
          const isCustom = index >= defaultScenarios.length;
          const customScenario = isCustom ? customScenarios[index - defaultScenarios.length] : null;

          return (
            <div
              key={isCustom ? customScenario?.id : index}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl flex-shrink-0">{result.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-base flex items-center gap-2">
                      {result.name}
                      {isCustom && (
                        <button
                          onClick={() => handleDeleteScenario(customScenario!.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
          );
        })}
      </div>

      {/* Add Custom Scenario Button */}
      <button
        onClick={() => setShowAddModal(true)}
        disabled={customScenarios.length >= MAX_CUSTOM_SCENARIOS}
        className="mt-4 w-full min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        커스텀 시나리오 추가
        {customScenarios.length > 0 && ` (${customScenarios.length}/${MAX_CUSTOM_SCENARIOS})`}
      </button>

      {/* Add Scenario Modal */}
      <AddScenarioModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddScenario}
      />
    </div>
  );
}
