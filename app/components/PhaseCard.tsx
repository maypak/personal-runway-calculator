/**
 * PhaseCard Component
 * 
 * Displays individual phase with:
 * - Phase name and description
 * - Duration (start-end months)
 * - Financial summary (monthly burn, total burn)
 * - Edit/Delete actions
 * - Drag handle for reordering
 */

'use client'

import { Phase } from '@/app/types'
import { calculatePhaseTotalBurn } from '@/app/utils/phaseCalculator'
import { formatCurrency } from '@/app/utils/currencyFormatter'
import { useI18n } from '@/app/contexts/I18nContext'
import { GripVertical, Edit2, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react'

export interface PhaseCardProps {
  phase: Phase
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
  draggable?: boolean
}

export function PhaseCard({
  phase,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  draggable = true,
}: PhaseCardProps) {
  const { locale } = useI18n()
  const duration = phase.endMonth - phase.startMonth
  const totalBurn = calculatePhaseTotalBurn(phase)
  const avgMonthlyBurn = totalBurn / duration
  const netMonthly = phase.monthlyIncome - phase.monthlyExpenses
  const oneTimeCount = phase.oneTimeExpenses.length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.01]">
      <div className="flex items-start gap-3">
        {/* Drag Handle (Desktop) */}
        {draggable && (
          <button
            className="hidden md:block mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Reorder Buttons */}
        {draggable && (onMoveUp || onMoveDown) && (
          <div className="flex flex-col md:hidden gap-1 mt-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded transition"
              aria-label="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded transition"
              aria-label="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {phase.name}
              </h3>
              {phase.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {phase.description}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Month {phase.startMonth} - {phase.endMonth}{' '}
                <span className="text-gray-400">({duration} months)</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-1 ml-2">
              {onDuplicate && (
                <button
                  onClick={onDuplicate}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-150 active:scale-95"
                  aria-label="Duplicate phase"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-150 active:scale-95"
                  aria-label="Edit phase"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-150 active:scale-95"
                  aria-label="Delete phase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Financial Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {/* Monthly Expenses */}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Monthly Expenses
              </div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {formatCurrency(phase.monthlyExpenses, "USD" as any)}
              </div>
            </div>

            {/* Monthly Income */}
            {phase.monthlyIncome > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Monthly Income
                </div>
                <div className="text-base font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(phase.monthlyIncome, "USD" as any)}
                </div>
              </div>
            )}

            {/* Net Monthly */}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Net Monthly
              </div>
              <div
                className={`text-base font-semibold ${
                  netMonthly >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {netMonthly >= 0 ? '+' : ''}{formatCurrency(Math.abs(netMonthly), locale)}
              </div>
            </div>

            {/* Total Burn */}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Burn
              </div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalBurn, "USD" as any)}
              </div>
            </div>
          </div>

          {/* One-time Expenses */}
          {oneTimeCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                One-time Expenses ({oneTimeCount})
              </div>
              <div className="flex flex-wrap gap-2">
                {phase.oneTimeExpenses.map((expense, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                  >
                    <span className="font-medium">{expense.name}</span>
                    <span className="text-gray-500">
                      {formatCurrency(expense.amount, "USD" as any)}
                    </span>
                    <span className="text-gray-400">
                      (Mo {expense.month})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
