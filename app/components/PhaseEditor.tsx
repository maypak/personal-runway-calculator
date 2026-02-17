/**
 * PhaseEditor Component
 * 
 * Modal form for creating/editing phases.
 * Features:
 * - Phase name and description
 * - Start/end month selection
 * - Monthly expenses and income
 * - One-time expenses (add/remove)
 * - Real-time total burn calculation
 * - Validation
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Phase, PhaseOneTimeExpense } from '@/app/types'
import { calculatePhaseTotalBurn } from '@/app/utils/phaseCalculator'
import { X, Plus, Trash2 } from 'lucide-react'

export interface PhaseEditorProps {
  phase?: Phase | null // null = create new, Phase = edit existing
  existingPhases?: Phase[] // For validation
  onSave: (phase: Omit<Phase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  scenarioId?: string | null
}

export function PhaseEditor({
  phase,
  existingPhases = [],
  onSave,
  onCancel,
  scenarioId,
}: PhaseEditorProps) {
  const [formData, setFormData] = useState<
    Omit<Phase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  >({
    scenarioId: scenarioId,
    name: '',
    description: '',
    phaseOrder: existingPhases.length,
    startMonth: 0,
    endMonth: 6,
    monthlyExpenses: 0,
    monthlyIncome: 0,
    oneTimeExpenses: [],
  })

  const [errors, setErrors] = useState<string[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize form with existing phase data
  useEffect(() => {
    if (phase) {
      setFormData({
        scenarioId: phase.scenarioId,
        name: phase.name,
        description: phase.description,
        phaseOrder: phase.phaseOrder,
        startMonth: phase.startMonth,
        endMonth: phase.endMonth,
        monthlyExpenses: phase.monthlyExpenses,
        monthlyIncome: phase.monthlyIncome,
        oneTimeExpenses: [...phase.oneTimeExpenses],
      })
    }
  }, [phase])

  // Keyboard: Escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  // Focus trap: focus modal on mount
  useEffect(() => {
    modalRef.current?.focus()
  }, [])

  // Calculate total burn in real-time
  const totalBurn = calculatePhaseTotalBurn({
    ...formData,
    id: '',
    userId: '',
    createdAt: '',
    updatedAt: '',
  } as Phase)

  const duration = formData.endMonth - formData.startMonth

  // Validate form
  const validate = (): boolean => {
    const newErrors: string[] = []

    if (!formData.name.trim()) {
      newErrors.push('Phase name is required')
    }

    if (formData.endMonth <= formData.startMonth) {
      newErrors.push('End month must be after start month')
    }

    if (formData.startMonth < 0) {
      newErrors.push('Start month cannot be negative')
    }

    if (formData.monthlyExpenses < 0) {
      newErrors.push('Monthly expenses cannot be negative')
    }

    if (formData.monthlyIncome < 0) {
      newErrors.push('Monthly income cannot be negative')
    }

    // Check for overlaps with existing phases (exclude current phase if editing)
    const otherPhases = existingPhases.filter((p) => p.id !== phase?.id)
    for (const other of otherPhases) {
      if (
        (formData.startMonth >= other.startMonth &&
          formData.startMonth < other.endMonth) ||
        (formData.endMonth > other.startMonth &&
          formData.endMonth <= other.endMonth) ||
        (formData.startMonth <= other.startMonth &&
          formData.endMonth >= other.endMonth)
      ) {
        newErrors.push(
          `Phase overlaps with "${other.name}" (Month ${other.startMonth}-${other.endMonth})`
        )
        break
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave(formData)
    }
  }

  const addOneTimeExpense = () => {
    setFormData({
      ...formData,
      oneTimeExpenses: [
        ...formData.oneTimeExpenses,
        { name: '', amount: 0, month: 0 },
      ],
    })
  }

  const removeOneTimeExpense = (index: number) => {
    setFormData({
      ...formData,
      oneTimeExpenses: formData.oneTimeExpenses.filter((_, i) => i !== index),
    })
  }

  const updateOneTimeExpense = (
    index: number,
    updates: Partial<PhaseOneTimeExpense>
  ) => {
    const updated = [...formData.oneTimeExpenses]
    updated[index] = { ...updated[index], ...updates }
    setFormData({
      ...formData,
      oneTimeExpenses: updated,
    })
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phase-editor-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 id="phase-editor-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            {phase ? 'Edit Phase' : 'Create Phase'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                Please fix the following errors:
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Phase Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phase Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Travel Asia"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Explore Southeast Asia, clear my mind"
              rows={2}
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Month *
              </label>
              <input
                type="number"
                value={formData.startMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startMonth: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Month *
              </label>
              <input
                type="number"
                value={formData.endMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endMonth: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={formData.startMonth + 1}
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Duration: {duration} month{duration !== 1 ? 's' : ''}
          </div>

          {/* Monthly Expenses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Expenses *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.monthlyExpenses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyExpenses: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3000"
                min="0"
              />
            </div>
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Income (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyIncome: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500"
                min="0"
              />
            </div>
          </div>

          {/* One-time Expenses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                One-time Expenses
              </label>
              <button
                onClick={addOneTimeExpense}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {formData.oneTimeExpenses.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No one-time expenses yet
              </div>
            ) : (
              <div className="space-y-2">
                {formData.oneTimeExpenses.map((expense, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <input
                      type="text"
                      value={expense.name}
                      onChange={(e) =>
                        updateOneTimeExpense(idx, { name: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Flight tickets"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-2 top-1 text-sm text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) =>
                          updateOneTimeExpense(idx, {
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="2500"
                        min="0"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={expense.month}
                        onChange={(e) =>
                          updateOneTimeExpense(idx, {
                            month: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="0"
                        min="0"
                        max={duration - 1}
                      />
                      <div className="text-xs text-gray-500 mt-0.5">
                        Month
                      </div>
                    </div>
                    <button
                      onClick={() => removeOneTimeExpense(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Burn Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Phase Summary
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-blue-700 dark:text-blue-400">
                  Total Burn
                </div>
                <div className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                  ${totalBurn.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-blue-700 dark:text-blue-400">
                  Avg Monthly Burn
                </div>
                <div className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                  ${duration > 0 ? Math.round(totalBurn / duration).toLocaleString() : 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
          >
            {phase ? 'Save Changes' : 'Create Phase'}
          </button>
        </div>
      </div>
    </div>
  )
}
