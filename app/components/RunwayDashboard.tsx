/**
 * RunwayDashboard.tsx - 메인 대시보드
 * 
 * Purpose: 기본 계산기 메인 화면 (Phase 1)
 * Created: 2026-02-23
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRunwayStore } from '../../lib/stores/runwayStore';
import RunwayDisplay from './RunwayDisplay';
import ScenarioComparison from './ScenarioComparison';
import GoalSettingP0 from './GoalSettingP0';
import ShareButton from './ShareButton';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../contexts/I18nContext';

export default function RunwayDashboard() {
  const router = useRouter();
  const { getBasicData, hydrated } = useRunwayStore();
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [basicData, setBasicData] = useState<ReturnType<typeof getBasicData>>(null);
  
  useEffect(() => {
    if (hydrated) {
      const data = getBasicData();
      setBasicData(data);
      
      // Redirect to onboarding if no data
      if (!data) {
        router.push('/onboarding');
      } else {
        setIsLoading(false);
      }
    }
  }, [hydrated, getBasicData, router]);
  
  // Loading state
  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  // No data - should redirect, but just in case
  if (!basicData) {
    return null;
  }
  
  // Calculate runway for share button
  const runway = basicData.balance / basicData.monthlyExpenses;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <span className="text-2xl sm:text-3xl flex-shrink-0">💸</span>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
              Personal Runway Calculator
            </h1>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* P1: Share Button */}
            <div className="hidden sm:block">
              <ShareButton
                runway={runway}
                balance={basicData.balance}
                monthlyExpenses={basicData.monthlyExpenses}
                situation={basicData.situationType}
              />
            </div>
            
            <button
              onClick={() => router.push('/settings')}
              className="min-h-[44px] min-w-[44px] px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all whitespace-nowrap"
              title={t('dashboard.buttons.settings')}
              aria-label={t('dashboard.buttons.settings')}
            >
              <span className="hidden sm:inline">⚙️ {t('dashboard.buttons.settings')}</span>
              <span className="sm:hidden">⚙️</span>
            </button>
            <button
              onClick={() => router.push('/onboarding')}
              className="min-h-[44px] min-w-[44px] px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all whitespace-nowrap"
              title={t('dashboard.buttons.restart')}
              aria-label={t('dashboard.buttons.restart')}
            >
              <span className="hidden xs:inline">{t('dashboard.buttons.restart')}</span>
              <span className="xs:hidden">🔄</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Runway Display */}
          <div className="lg:col-span-2 space-y-8">
            <RunwayDisplay
              balance={basicData.balance}
              monthlyExpenses={basicData.monthlyExpenses}
              monthlyIncome={basicData.monthlyIncome}
            />
            
            {/* P0: Scenario Comparison */}
            <ScenarioComparison
              balance={basicData.balance}
              monthlyExpenses={basicData.monthlyExpenses}
            />
            
            {/* P0: Goal Setting */}
            <GoalSettingP0
              currentRunway={basicData.balance / basicData.monthlyExpenses}
              balance={basicData.balance}
              monthlyExpenses={basicData.monthlyExpenses}
            />
          </div>
          
          {/* Right Column: Info Cards */}
          <div className="space-y-6">
            {/* Situation Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span>
                <span>{t('onboarding.situation.title')}</span>
              </h3>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <span className="font-medium">{t('common.common.type') || 'Type'}:</span>
                  <span className="capitalize">
                    {basicData.situationType === 'freelancer' && `💼 ${t('onboarding.situation.freelancer.title')}`}
                    {basicData.situationType === 'job-seeker' && `🔍 ${t('onboarding.situation.job-seeker.title')}`}
                    {basicData.situationType === 'startup' && `🚀 ${t('onboarding.situation.startup.title')}`}
                    {basicData.situationType === 'quick' && `⚡ ${t('onboarding.situation.quick.title')}`}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">{t('onboarding.step3.variableIncome').split('(')[0].trim()}:</span>
                  <span>{basicData.hasVariableIncome ? '✅' : '❌'}</span>
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  {new Date(basicData.createdAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                </p>
              </div>
            </div>
            
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>{t('dashboard.tips.title')}</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>{t('dashboard.tips.checkMonthly')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>{t('dashboard.tips.cutExpenses')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>{t('dashboard.tips.increaseIncome')}</span>
                </li>
              </ul>
            </div>
            
            {/* Privacy Notice */}
            <div className="bg-green-50 rounded-xl p-6 shadow-md border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔒</span>
                <span>{t('onboarding.situation.privacy')}</span>
              </h3>
              <p className="text-sm text-gray-700">
                {t('onboarding.situation.privacy')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
