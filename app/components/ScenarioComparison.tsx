/**
 * ScenarioComparison.tsx - P0+P1: 시나리오 비교 컴포넌트
 */

'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { calculateScenario, type Scenario, type ScenarioResult } from '../../lib/calculations/runway';
import { formatDateKorean, formatCurrency } from '../../lib/calculations/runway';
import AddScenarioModal, { type CustomScenario } from './AddScenarioModal';
import { presetCategories } from '@/lib/scenarios/presets';
import { useI18n } from '../contexts/I18nContext';

interface ScenarioComparisonProps {
  balance: number;
  monthlyExpenses: number;
}

const STORAGE_KEY = 'personal_runway_custom_scenarios';
const MAX_CUSTOM_SCENARIOS = 10;

export default function ScenarioComparison({ balance, monthlyExpenses }: ScenarioComparisonProps) {
  const { t } = useI18n();
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const defaultScenarios: Scenario[] = [
    { name: t('dashboard.scenarioComparison.current'), type: 'expense_adjustment', value: 0, icon: '🟡' },
    { name: t('dashboard.scenarioComparison.save10'), type: 'expense_adjustment', value: -0.1, icon: '✅' },
    { name: t('dashboard.scenarioComparison.save20'), type: 'expense_adjustment', value: -0.2, icon: '🎯' },
    { name: t('dashboard.scenarioComparison.worst20'), type: 'expense_adjustment', value: 0.2, icon: '🔴' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCustomScenarios(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse custom scenarios:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && customScenarios.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customScenarios));
    }
  }, [customScenarios]);

  const allScenarios: Scenario[] = [
    ...defaultScenarios,
    ...customScenarios.map((cs) => ({ name: cs.name, type: cs.type, value: cs.value, icon: cs.icon })),
  ];

  const results: ScenarioResult[] = allScenarios.map((scenario) =>
    calculateScenario(balance, monthlyExpenses, scenario)
  );

  const handleAddScenario = (scenario: CustomScenario) => {
    if (customScenarios.length >= MAX_CUSTOM_SCENARIOS) {
      alert(t('dashboard.scenarioComparison.maxScenarios').replace('{{max}}', String(MAX_CUSTOM_SCENARIOS)));
      return;
    }
    setCustomScenarios([...customScenarios, scenario]);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    if (window.confirm(t('dashboard.scenarioComparison.deleteConfirm'))) {
      const updated = customScenarios.filter((s) => s.id !== scenarioId);
      setCustomScenarios(updated);
      if (updated.length === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleAddPreset = (preset: Omit<CustomScenario, 'id'>) => {
    if (customScenarios.length >= MAX_CUSTOM_SCENARIOS) {
      alert(t('dashboard.scenarioComparison.maxScenarios').replace('{{max}}', String(MAX_CUSTOM_SCENARIOS)));
      return;
    }
    setCustomScenarios([...customScenarios, { ...preset, id: `preset-${Date.now()}` }]);
    setShowPresets(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'danger': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span>📊</span>
          <span>{t('dashboard.scenarioComparison.title')}</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg transition-colors"
          >
            📋 {t('dashboard.scenarioComparison.preset')}
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('dashboard.scenarioComparison.presetTitle')}</h3>
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
            {t('dashboard.scenarioComparison.close')}
          </button>
        </div>
      )}

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
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm opacity-80">
                      {formatCurrency(result.monthlyExpenses)} {t('dashboard.scenarioComparison.perMonth')}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold">
                    {t('dashboard.scenarioComparison.months').replace('{{count}}', result.months.toFixed(1))}
                  </div>
                  {result.endDate && (
                    <div className="text-xs opacity-80">
                      {formatDateKorean(result.endDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        disabled={customScenarios.length >= MAX_CUSTOM_SCENARIOS}
        className="mt-4 w-full min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {t('dashboard.scenarioComparison.addCustom')}
        {customScenarios.length > 0 && ` (${customScenarios.length}/${MAX_CUSTOM_SCENARIOS})`}
      </button>

      <AddScenarioModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddScenario}
      />
    </div>
  );
}
