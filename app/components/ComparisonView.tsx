/**
 * ComparisonView - Main Scenario Comparison Page
 * 
 * Purpose: Display side-by-side comparison of selected scenarios
 * Features:
 * - Comparison table
 * - Visual chart
 * - Insights panel
 * - Scenario selector
 * - Export functionality (future)
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useScenarioContext } from '../contexts/ScenarioContext';
import { ComparisonTable } from './ComparisonTable';
import { compareScenarios } from '../utils/runwayCalculator';

// Lazy load heavy chart component (Recharts bundle)
const RunwayChart = lazy(() => import('./RunwayChart').then(mod => ({ default: mod.RunwayChart })));

export function ComparisonView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { scenarios, selectedScenarios, selectForComparison, getComparisonResults } = useScenarioContext();
  
  const [localSelection, setLocalSelection] = useState<string[]>([]);

  // Initialize from URL params or context
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    
    if (idsParam) {
      const ids = idsParam.split(',').filter(id => scenarios.some(s => s.id === id));
      setLocalSelection(ids);
      selectForComparison(ids);
    } else if (selectedScenarios.length > 0) {
      setLocalSelection(selectedScenarios);
    } else if (scenarios.length >= 2) {
      // Auto-select first 2 scenarios
      const autoSelect = scenarios.slice(0, 2).map(s => s.id);
      setLocalSelection(autoSelect);
      selectForComparison(autoSelect);
    }
  }, []);

  const handleToggleScenario = (scenarioId: string) => {
    setLocalSelection(prev => {
      let newSelection: string[];
      
      if (prev.includes(scenarioId)) {
        // Deselect (but keep at least 1)
        if (prev.length > 1) {
          newSelection = prev.filter(id => id !== scenarioId);
        } else {
          return prev; // Can't deselect the last one
        }
      } else {
        // Select (max 3)
        if (prev.length < 3) {
          newSelection = [...prev, scenarioId];
        } else {
          alert(t('scenarios:comparison.selector.maxReached'));
          return prev;
        }
      }
      
      selectForComparison(newSelection);
      return newSelection;
    });
  };

  const selectedScenariosList = scenarios.filter(s => localSelection.includes(s.id));

  // Generate insights
  const insights = () => {
    if (selectedScenariosList.length < 2) return [];
    
    const results = getComparisonResults();
    const [scenario1, scenario2] = selectedScenariosList;
    const result1 = results.get(scenario1.id);
    const result2 = results.get(scenario2.id);
    
    if (!result1 || !result2) return [];
    
    const comparison = compareScenarios(
      { name: scenario1.name, result: result1 },
      { name: scenario2.name, result: result2 }
    );
    
    return comparison.insights;
  };

  if (scenarios.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('scenarios:comparison.empty.noScenarios')}
          </p>
          <button
            onClick={() => router.push('/scenarios')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('scenarios:comparison.cta.goToScenarios')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/scenarios')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label={t('scenarios:comparison.cta.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('scenarios:comparison.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t('scenarios:comparison.subtitle')}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => alert(t('scenarios:comparison.cta.exportSoon'))}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          {t('scenarios:comparison.cta.export')}
        </button>
      </div>

      {/* Scenario Selector */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('scenarios:comparison.selector.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map(scenario => (
            <label
              key={scenario.id}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${localSelection.includes(scenario.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <input
                type="checkbox"
                checked={localSelection.includes(scenario.id)}
                onChange={() => handleToggleScenario(scenario.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={localSelection.length === 1 && localSelection.includes(scenario.id)}
                aria-label={`Select ${scenario.name} for comparison`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {scenario.name}
                  </p>
                  {scenario.isBase && (
                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                      {t('scenarios:card.base')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t('scenarios:card.months', { count: scenario.calculatedRunway || 0 })}
                </p>
              </div>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {t('scenarios:comparison.selector.help')}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('scenarios:comparison.sections.metrics')}
        </h2>
        <ComparisonTable scenarios={selectedScenariosList} />
      </div>

      {/* Chart */}
      <div className="mb-8">
        <Suspense fallback={
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6" style={{ height: 500 }}>
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          </div>
        }>
          <RunwayChart scenarios={selectedScenariosList} height={500} />
        </Suspense>
      </div>

      {/* Insights */}
      {insights().length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            {t('scenarios:comparison.sections.insights')}
          </h2>
          <ul className="space-y-2">
            {insights().map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
