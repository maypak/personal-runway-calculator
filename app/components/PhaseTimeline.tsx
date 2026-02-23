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
 * 
 * NOTE: Temporarily disabled during Supabase removal (Phase 1)
 */

'use client'

export interface PhaseTimelineProps {
  scenarioId?: string | null
  totalSavings: number
}

export function PhaseTimeline({ scenarioId, totalSavings }: PhaseTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Migration Notice */}
      <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
        <div className="text-5xl mb-4">⏱️</div>
        <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-3">
          Phase Timeline - Migration in Progress
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 max-w-2xl mx-auto">
          Phase-based planning is temporarily disabled during LocalStorage migration (Phase 1).
          This feature will be fully restored in Phase 2.
        </p>
        <div className="mt-6 text-sm text-yellow-600 dark:text-yellow-400">
          <p>Phase 1: Supabase removal ✅</p>
          <p>Phase 2: LocalStorage integration (Coming soon)</p>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-bg-secondary rounded-lg border border-border">
          <div className="text-3xl mb-2">📅</div>
          <h4 className="font-semibold text-text-primary mb-1">Timeline Planning</h4>
          <p className="text-sm text-text-secondary">
            Break down your runway into distinct phases with different spending patterns
          </p>
        </div>
        
        <div className="p-6 bg-bg-secondary rounded-lg border border-border">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-semibold text-text-primary mb-1">Phase Templates</h4>
          <p className="text-sm text-text-secondary">
            Use pre-built templates for common scenarios like job search or sabbatical
          </p>
        </div>
      </div>
    </div>
  )
}
