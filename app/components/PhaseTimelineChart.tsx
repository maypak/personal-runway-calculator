/**
 * PhaseTimelineChart Component
 * 
 * Visual timeline showing phases as colored bars on a timeline.
 * Desktop: horizontal timeline with month markers
 * Mobile: responsive with legend below
 */

'use client'

import { Phase } from '@/app/types'
import { useMemo } from 'react'

export interface PhaseTimelineChartProps {
  phases: Phase[]
  maxMonths?: number
}

const PHASE_COLORS = [
  { bg: '#3B82F6', text: '#ffffff' }, // Blue
  { bg: '#10B981', text: '#ffffff' }, // Green
  { bg: '#F59E0B', text: '#ffffff' }, // Amber
  { bg: '#EF4444', text: '#ffffff' }, // Red
  { bg: '#8B5CF6', text: '#ffffff' }, // Purple
  { bg: '#EC4899', text: '#ffffff' }, // Pink
  { bg: '#06B6D4', text: '#ffffff' }, // Cyan
  { bg: '#84CC16', text: '#ffffff' }, // Lime
  { bg: '#F97316', text: '#ffffff' }, // Orange
  { bg: '#6366F1', text: '#ffffff' }, // Indigo
]

export function PhaseTimelineChart({
  phases,
  maxMonths,
}: PhaseTimelineChartProps) {
  const sortedPhases = useMemo(
    () => [...phases].sort((a, b) => a.startMonth - b.startMonth),
    [phases]
  )

  const timelineMaxMonths = useMemo(() => {
    if (maxMonths) return maxMonths
    if (sortedPhases.length === 0) return 24
    return Math.max(
      Math.ceil(Math.max(...sortedPhases.map((p) => p.endMonth)) / 6) * 6,
      24
    )
  }, [sortedPhases, maxMonths])

  const monthMarkers = useMemo(() => {
    const markers: number[] = []
    for (let i = 0; i <= timelineMaxMonths; i += 6) {
      markers.push(i)
    }
    return markers
  }, [timelineMaxMonths])

  if (sortedPhases.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No phases to display. Add your first phase to get started!
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Timeline Visualization
      </h2>

      {/* Month Markers */}
      <div className="relative mb-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {monthMarkers.map((month) => (
            <span key={month} className="text-center">
              {month === 0 ? 'Start' : `${month}mo`}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        {sortedPhases.map((phase, idx) => {
          const left = (phase.startMonth / timelineMaxMonths) * 100
          const width =
            ((phase.endMonth - phase.startMonth) / timelineMaxMonths) * 100
          const color = PHASE_COLORS[idx % PHASE_COLORS.length]

          return (
            <div
              key={phase.id}
              className="absolute h-16 top-2 rounded flex items-center justify-center text-sm font-medium shadow-sm transition-transform hover:scale-105 hover:z-10"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: color.bg,
                color: color.text,
              }}
              title={`${phase.name}: Month ${phase.startMonth}-${phase.endMonth} (${phase.endMonth - phase.startMonth} months)`}
            >
              {/* Only show name if width is wide enough */}
              {width > 10 && (
                <span className="truncate px-2">{phase.name}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {sortedPhases.map((phase, idx) => {
          const color = PHASE_COLORS[idx % PHASE_COLORS.length]
          const duration = phase.endMonth - phase.startMonth

          return (
            <div key={phase.id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color.bg }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {phase.name}
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  ({duration}mo)
                </span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Phases
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {sortedPhases.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Duration
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {sortedPhases.length > 0
              ? Math.max(...sortedPhases.map((p) => p.endMonth))
              : 0}{' '}
            months
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Avg Monthly Burn
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            $
            {sortedPhases.length > 0
              ? Math.round(
                  sortedPhases.reduce((sum, p) => sum + p.monthlyExpenses, 0) /
                    sortedPhases.length
                ).toLocaleString()
              : 0}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Income
          </div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            $
            {sortedPhases.length > 0
              ? sortedPhases
                  .reduce(
                    (sum, p) =>
                      sum + p.monthlyIncome * (p.endMonth - p.startMonth),
                    0
                  )
                  .toLocaleString()
              : 0}
          </div>
        </div>
      </div>
    </div>
  )
}
