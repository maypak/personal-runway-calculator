'use client';

import { useState } from 'react';
// import { useScenarios, Scenario } from '../hooks/useScenarios'; // Removed during Supabase migration
import type { Scenario } from '../types';
import ScenarioCard from './ScenarioCard';
import ComparisonView from './ComparisonView';
import EditScenarioModal from './EditScenarioModal';
import { Plus, BarChart3 } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

export default function ScenarioManager() {
  // STUB: Temporarily disabled during Supabase removal
  const scenarios: Scenario[] = [];
  const loading = false;
  const error = null;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Handle create new scenario
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Scenario creation will be enabled after LocalStorage migration');
  };

  // Handle create from current settings
  const handleCreateFromCurrent = async () => {
    alert('Scenario creation will be enabled after LocalStorage migration');
  };

  // Handle duplicate
  const handleDuplicate = async (id: string) => {
    alert('Scenario duplication will be enabled after LocalStorage migration');
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    alert('Scenario deletion will be enabled after LocalStorage migration');
  };

  // Handle edit save
  const handleEditSave = async (id: string, updates: Partial<Scenario>): Promise<boolean> => {
    alert('Scenario editing will be enabled after LocalStorage migration');
    return false;
  };

  // Toggle comparison selection
  const toggleComparisonSelection = (id: string) => {
    setSelectedForComparison(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            Scenario Comparison
            <InfoTooltip content="Create multiple scenarios to compare different financial situations" />
          </h2>
          <p className="text-text-secondary mt-1">
            Plan different financial scenarios and compare outcomes
          </p>
        </div>

        <div className="flex gap-2">
          {scenarios.length >= 2 && (
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                compareMode
                  ? 'bg-primary text-white'
                  : 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {compareMode ? 'Exit Compare' : 'Compare Scenarios'}
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Scenario
          </button>
        </div>
      </div>

      {/* Migration Notice */}
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Scenario Manager - Migration in Progress
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300">
          Scenario functionality is temporarily disabled during LocalStorage migration (Phase 1).
          <br />
          This feature will be re-enabled in Phase 2.
        </p>
      </div>

      {/* Empty State */}
      {scenarios.length === 0 && !compareMode && (
        <div className="text-center py-12 bg-bg-secondary rounded-lg border-2 border-dashed border-border">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No scenarios yet</h3>
          <p className="text-text-secondary mb-4">
            Create your first scenario to start planning
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Scenario
          </button>
        </div>
      )}

      {/* Comparison View */}
      {compareMode && scenarios.length >= 2 && (
        <ComparisonView
          scenarios={scenarios.filter(s => selectedForComparison.includes(s.id))}
          onClose={() => setCompareMode(false)}
        />
      )}

      {/* Scenario Grid */}
      {!compareMode && scenarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onEdit={() => setEditingScenario(scenario)}
              onDuplicate={() => handleDuplicate(scenario.id)}
              onDelete={() => handleDelete(scenario.id)}
              onCompare={() => toggleComparisonSelection(scenario.id)}
              selected={selectedForComparison.includes(scenario.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-primary rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-text-primary mb-4">Create New Scenario</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Optimistic, Conservative"
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingScenario && (
        <EditScenarioModal
          scenario={editingScenario}
          onSave={async (id: string, updates: Partial<Scenario>) => {
            const success = await handleEditSave(id, updates);
            if (success) {
              setEditingScenario(null);
            }
            return success;
          }}
          onClose={() => setEditingScenario(null)}
        />
      )}
    </div>
  );
}
