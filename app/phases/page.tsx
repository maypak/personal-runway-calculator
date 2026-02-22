/**
 * Phase-based Planning Page
 * 
 * Main page for phase-based financial planning.
 * Allows users to create phases with different financial patterns.
 */

'use client'

import { useState, useEffect } from 'react'
import { PhaseTimeline } from '@/app/components/PhaseTimeline'
import { supabase } from '@/app/lib/supabase'
import { useI18n } from '@/app/contexts/I18nContext'
import Link from 'next/link'
import { ArrowLeft, Wallet } from 'lucide-react'

export default function PhasesPage() {
  const { t } = useI18n()
  const [totalSavings, setTotalSavings] = useState(50000)
  const [loading, setLoading] = useState(true)

  // Load user's financial settings to get totalSavings
  useEffect(() => {
    loadFinancialSettings()
  }, [])

  async function loadFinancialSettings() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('finance_settings')
        .select('current_savings, lump_sum')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setTotalSavings(
          Number(data.current_savings || 0) + Number(data.lump_sum || 0)
        )
      }
    } catch (err) {
      console.error('Failed to load financial settings:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t('common:loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* Back to Dashboard */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('phases:page.backToDashboard')}</span>
        </Link>
      </div>

      {/* Settings */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('phases:page.totalSavingsLabel')}
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                value={totalSavings}
                onChange={(e) => setTotalSavings(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('phases:page.totalSavingsHint')}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <PhaseTimeline scenarioId={null} totalSavings={totalSavings} />
    </div>
  )
}
