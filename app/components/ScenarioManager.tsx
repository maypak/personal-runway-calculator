/**
 * ScenarioManager - Main Scenario Management Page
 * 
 * Purpose: List, create, and manage financial scenarios
 * Features:
 * - Grid view of all scenarios
 * - Create new scenario button
 * - Empty state for first-time users
 * - Responsive layout (desktop: 3 columns, mobile: 1 column)
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../contexts/I18nContext';
import { useScenarioContext } from '../contexts/ScenarioContext';
import { ScenarioCard } from './ScenarioCard';
import { CreateScenarioModal } from './CreateScenarioModal';

export function ScenarioManager() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    scenarios,
    loading,
    createScenario,
    deleteScenario,
    selectForComparison,
    setActiveScenario,
  } = useScenarioContext();

  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (name: string, description?: string, cloneFromId?: string) => {
    setIsCreating(true);
    
    try {
      const result = await createScenario(name, cloneFromId);
      
      if (result.success) {
        console.log('✅ [ScenarioManager] Scenario created:', result.data?.name);
        setShowModal(false);
        
        // Navigate to edit page for new scenario
        if (result.data) {
          router.push(`/scenarios/${result.data.id}/edit`);
        }
      } else {
        console.error('❌ [ScenarioManager] Failed to create scenario:', result.error);
        alert(result.error || t('scenarios:create.errors.failed'));
      }
    } catch (error) {
      console.error('❌ [ScenarioManager] Error:', error);
      alert(t('scenarios:create.errors.generic'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteScenario(id);
    
    if (!result.success) {
      alert(result.error || t('scenarios:card.deleteFailed'));
    }
  };

  const handleCompare = (scenarioId: string) => {
    // Select this scenario for comparison
    const currentSelection = scenarios
      .filter(s => s.id !== scenarioId)
      .slice(0, 1)
      .map(s => s.id);
    
    selectForComparison([scenarioId, ...currentSelection]);
    router.push('/scenarios/compare');
  };

  const handleEdit = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    router.push(`/scenarios/${scenarioId}/edit`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Empty state
  if (scenarios.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main" aria-label="Scenario manager">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('scenarios:manager.empty.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {t('scenarios:manager.empty.description')}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('scenarios:manager.empty.cta')}
          </button>
        </div>

        {showModal && (
          <CreateScenarioModal
            scenarios={scenarios}
            onCreate={handleCreate}
            onCancel={() => setShowModal(false)}
            loading={isCreating}
          />
        )}
      </div>
    );
  }

  // Main view with scenarios
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main" aria-label="Scenario manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('scenarios:manager.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('scenarios:manager.subtitle')}
          </p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('scenarios:manager.cta.new')}
        </button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onEdit={() => handleEdit(scenario.id)}
            onCompare={() => handleCompare(scenario.id)}
            onDelete={scenario.isBase ? undefined : () => handleDelete(scenario.id)}
          />
        ))}
      </div>

      {/* Free tier notice */}
      {scenarios.filter(s => !s.isBase).length >= 1 && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t('scenarios:manager.freeTier.title')}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('scenarios:manager.freeTier.description')}
              </p>
              <button
                className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline"
                onClick={() => {
                  // TODO: Navigate to pricing
                  alert('Upgrade to Premium!');
                }}
              >
                {t('scenarios:manager.freeTier.learnMore')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateScenarioModal
          scenarios={scenarios}
          onCreate={handleCreate}
          onCancel={() => setShowModal(false)}
          loading={isCreating}
        />
      )}
    </div>
  );
}
