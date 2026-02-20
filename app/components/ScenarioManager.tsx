'use client';

import { useState } from 'react';
import { useScenarios, Scenario } from '../hooks/useScenarios';
import ScenarioCard from './ScenarioCard';
import ComparisonView from './ComparisonView';
import { Plus, BarChart3 } from 'lucide-react';

export default function ScenarioManager() {
  const {
    scenarios,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
  } = useScenarios();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Handle create new scenario
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const name = formData.get('name') as string;

    const result = await createScenario(name);

    if (result.success) {
      setShowCreateModal(false);
    }
  };

  // Handle create from current settings
  const handleCreateFromCurrent = async () => {
    const name = prompt('Name for this scenario?', 'New Scenario');
    if (!name) return;

    await createScenario(name);
  };

  // Handle duplicate
  const handleDuplicate = async (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    const name = prompt('Name for duplicate?', `${scenario.name} (Copy)`);
    if (!name) return;

    await createScenario(name, id);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    if (!confirm(`Delete scenario "${scenario.name}"?`)) return;

    await deleteScenario(id);
  };

  // Toggle scenario for comparison
  const toggleCompare = (id: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id].slice(-3)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4 text-error">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Your Scenarios</h2>
          <p className="text-text-tertiary mt-1">
            Compare different financial scenarios side-by-side
          </p>
        </div>

        <div className="flex items-center gap-3">
          {scenarios.length > 0 && (
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${compareMode ? 'bg-primary text-white' : 'bg-surface-card text-text-secondary border border-border-subtle'}
              `}
            >
              <BarChart3 className="w-4 h-4" />
              {compareMode ? 'Exit Compare' : 'Compare'}
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Scenario
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      {scenarios.length === 0 ? (
        <div className="text-center py-12 bg-surface-card rounded-xl border border-border-subtle">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No scenarios yet</h3>
          <p className="text-text-tertiary mb-6">
            Create scenarios to compare different financial outcomes
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all"
            >
              Create First Scenario
            </button>
            <button
              onClick={handleCreateFromCurrent}
              className="px-6 py-3 bg-surface-card border border-border-subtle hover:border-primary text-text-primary rounded-lg font-medium transition-all"
            >
              Use Current Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onEdit={() => setEditingScenario(scenario)}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onCompare={compareMode ? toggleCompare : undefined}
              selected={compareMode && selectedForComparison.includes(scenario.id)}
            />
          ))}
        </div>
      )}

      {/* Comparison View */}
      {compareMode && selectedForComparison.length > 0 && (
        <ComparisonView
          scenarios={selectedForComparison
            .map((id) => scenarios.find((s) => s.id === id))
            .filter((s): s is Scenario => s !== undefined)}
          onClose={() => {
            setCompareMode(false);
            setSelectedForComparison([]);
          }}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">Create New Scenario</h3>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Scenario Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g., Conservative, Optimistic"
                    className="w-full px-4 py-2 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="bg-bg-tertiary rounded-lg p-4">
                  <p className="text-sm text-text-secondary">
                    💡 This will create a copy of your current financial settings.
                    You can edit the values after creation.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all"
                  >
                    Create Scenario
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 bg-surface-card border border-border-subtle hover:border-primary text-text-primary rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
