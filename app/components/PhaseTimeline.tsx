/**
 * PhaseTimeline Component
 * 
 * Main component for phase-based planning.
 * Features:
 * - Visual timeline chart
 * - Drag-and-drop phase reordering
 * - Create/edit/delete/duplicate phases
 * - Phase templates
 * - Total runway calculation with phases
 */

'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Phase } from '@/app/types'
import { usePhases } from '@/app/hooks/usePhases'
import { calculateRunwayWithPhases } from '@/app/utils/phaseCalculator'
import { PhaseCard } from './PhaseCard'
import { PhaseEditor } from './PhaseEditor'
import { PhaseTimelineChart } from './PhaseTimelineChart'
import { PHASE_TEMPLATES } from '@/app/data/phaseTemplates'
import { Plus, AlertCircle, Loader2, Sparkles } from 'lucide-react'

export interface PhaseTimelineProps {
  scenarioId?: string | null
  totalSavings: number
}

export function PhaseTimeline({ scenarioId, totalSavings }: PhaseTimelineProps) {
  const {
    phases,
    loading,
    error,
    createPhase,
    updatePhase,
    deletePhase,
    reorderPhases,
    duplicatePhase,
    validate,
  } = usePhases({ scenarioId })

  const [editingPhase, setEditingPhase] = useState<Phase | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // Calculate runway with phases
  const runwayResult = phases.length > 0
    ? calculateRunwayWithPhases({ totalSavings, phases })
    : null

  const validation = validate()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(phases)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)

    // Reorder phases
    reorderPhases(items.map((p) => p.id))
  }

  const handleSavePhase = async (
    phaseData: Omit<Phase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingPhase) {
      await updatePhase(editingPhase.id, phaseData)
      setEditingPhase(null)
    } else {
      await createPhase(phaseData)
      setIsCreating(false)
    }
  }

  const handleDeletePhase = async (id: string) => {
    if (confirm('Are you sure you want to delete this phase?')) {
      await deletePhase(id)
    }
  }

  const handleDuplicatePhase = async (id: string) => {
    await duplicatePhase(id)
  }

  const handleApplyTemplate = async (templateName: string) => {
    const template = PHASE_TEMPLATES.find((t) => t.name === templateName)
    if (!template) return

    // Create all phases from template
    for (const phaseData of template.phases) {
      await createPhase({
        ...phaseData,
        scenarioId,
      })
    }

    setShowTemplates(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Phase Timeline
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Divide your journey into phases with different financial patterns
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => setIsCreating(true)}
            disabled={phases.length >= 10}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Phase
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-800 dark:text-red-400">
              Error
            </div>
            <div className="text-sm text-red-700 dark:text-red-400 mt-1">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {!validation.valid && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-amber-800 dark:text-amber-400">
              Validation Issues
            </div>
            <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-400 mt-1 space-y-1">
              {validation.errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Timeline Chart */}
      {phases.length > 0 && <PhaseTimelineChart phases={phases} />}

      {/* Empty State */}
      {phases.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No phases yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first phase or use a template to get started with
              phase-based planning
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                Browse Templates
              </button>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
              >
                Create Phase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase List (Draggable) */}
      {phases.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Phases ({phases.length}/10)
          </h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="phases">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {phases.map((phase, index) => (
                    <Draggable
                      key={phase.id}
                      draggableId={phase.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? 'opacity-50' : ''}
                        >
                          <PhaseCard
                            phase={phase}
                            onEdit={() => setEditingPhase(phase)}
                            onDelete={() => handleDeletePhase(phase.id)}
                            onDuplicate={() => handleDuplicatePhase(phase.id)}
                            draggable
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Runway Summary */}
      {runwayResult && validation.valid && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phase-based Runway Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Runway
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {runwayResult.runway} mo
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Burn
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${runwayResult.totalBurn.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Breakeven Month
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {runwayResult.breakevenMonth !== null
                  ? `${runwayResult.breakevenMonth} mo`
                  : 'Never'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Phases
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {runwayResult.phaseBreakdown.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase Editor Modal */}
      {(isCreating || editingPhase) && (
        <PhaseEditor
          phase={editingPhase}
          existingPhases={phases}
          onSave={handleSavePhase}
          onCancel={() => {
            setIsCreating(false)
            setEditingPhase(null)
          }}
          scenarioId={scenarioId}
        />
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Phase Templates
              </h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {PHASE_TEMPLATES.map((template) => (
                <div
                  key={template.name}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer"
                  onClick={() => handleApplyTemplate(template.name)}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {template.phases.length} phases •{' '}
                    {template.phases.reduce(
                      (sum, p) => sum + (p.endMonth - p.startMonth),
                      0
                    )}{' '}
                    months
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
