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

export default function RunwayDashboard() {
  const router = useRouter();
  const { getBasicData, hydrated } = useRunwayStore();
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💸</span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Personal Runway Calculator
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/export')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
            >
              Export
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
            >
              Settings
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Runway Display */}
          <div className="lg:col-span-2">
            <RunwayDisplay
              balance={basicData.balance}
              monthlyExpenses={basicData.monthlyExpenses}
              monthlyIncome={basicData.monthlyIncome}
            />
            
            {/* CTA Section */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                다음 단계
              </h3>
              <p className="text-gray-600 mb-4">
                시나리오 분석을 통해 다양한 상황을 시뮬레이션해보세요.
              </p>
              <button
                onClick={() => router.push('/scenarios')}
                className="
                  w-full px-6 py-3 bg-orange-500 hover:bg-orange-600
                  text-white font-semibold rounded-lg
                  shadow-md hover:shadow-lg transition-all
                "
              >
                시나리오 분석하기 →
              </button>
            </div>
          </div>
          
          {/* Right Column: Info Cards */}
          <div className="space-y-6">
            {/* Situation Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span>
                <span>당신의 상황</span>
              </h3>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <span className="font-medium">타입:</span>
                  <span className="capitalize">
                    {basicData.situationType === 'freelancer' && '💼 프리랜서'}
                    {basicData.situationType === 'job-seeker' && '🔍 구직자'}
                    {basicData.situationType === 'startup' && '🚀 창업가'}
                    {basicData.situationType === 'quick' && '⚡ 빠른 계산'}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">변동 소득:</span>
                  <span>{basicData.hasVariableIncome ? '✅ 있음' : '❌ 없음'}</span>
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  생성일: {new Date(basicData.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>런웨이 관리 팁</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>정기적으로 런웨이를 확인하세요 (월 1회 권장)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>3개월 미만일 경우 즉시 행동 계획을 세우세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>시나리오 분석으로 "what-if" 상황을 미리 준비하세요</span>
                </li>
              </ul>
            </div>
            
            {/* Privacy Notice */}
            <div className="bg-green-50 rounded-xl p-6 shadow-md border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔒</span>
                <span>100% 로컬 저장</span>
              </h3>
              <p className="text-sm text-gray-700">
                모든 데이터는 브라우저에만 저장됩니다. 서버 업로드 없음.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
