/**
 * FIRE Dashboard Component
 * 
 * Purpose: Display FIRE (Financial Independence, Retire Early) metrics
 * Features:
 * - FI Number display with progress visualization
 * - Interactive projection chart
 * - Milestone tracking
 * - Scenario comparison (Lean/Regular/Fat FIRE)
 * - Settings panel for assumptions
 * - Fully integrated with new components
 * 
 * Created: 2026-02-17
 * Updated: 2026-02-23 (Temporarily disabled during Supabase removal)
 * Author: Senior Frontend Developer
 * 
 * NOTE: This component is temporarily disabled during Supabase migration (Phase 1)
 */

'use client';

export default function FIREDashboard() {
  return (
    <div className="space-y-6">
      {/* Migration Notice */}
      <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-3">
          FIRE Dashboard - Migration in Progress
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 max-w-2xl mx-auto">
          The FIRE (Financial Independence, Retire Early) dashboard is temporarily disabled during 
          LocalStorage migration (Phase 1). This feature will be fully restored with enhanced 
          functionality in Phase 2.
        </p>
        <div className="mt-6 text-sm text-yellow-600 dark:text-yellow-400">
          <p>Phase 1: Supabase removal ✅</p>
          <p>Phase 2: LocalStorage integration (Coming soon)</p>
        </div>
      </div>

      {/* Placeholder Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-bg-secondary rounded-lg border border-border">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-semibold text-text-primary mb-1">FI Number</h4>
          <p className="text-sm text-text-secondary">Target amount for financial independence</p>
        </div>
        
        <div className="p-6 bg-bg-secondary rounded-lg border border-border">
          <div className="text-3xl mb-2">📈</div>
          <h4 className="font-semibold text-text-primary mb-1">Progress Tracking</h4>
          <p className="text-sm text-text-secondary">Monitor your journey to financial freedom</p>
        </div>
        
        <div className="p-6 bg-bg-secondary rounded-lg border border-border">
          <div className="text-3xl mb-2">🏆</div>
          <h4 className="font-semibold text-text-primary mb-1">Milestones</h4>
          <p className="text-sm text-text-secondary">Track key achievements along the way</p>
        </div>
      </div>
    </div>
  );
}
