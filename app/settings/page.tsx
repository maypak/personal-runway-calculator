/**
 * settings/page.tsx - P0: 설정 페이지
 * 
 * Purpose: Edit financial data after onboarding
 * Features:
 * - Update balance
 * - Update monthly expenses
 * - Update situation type
 * 
 * Created: 2026-02-26 (P0 Features)
 * Author: Developer Agent (Subagent)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRunwayStore } from '../../lib/stores/runwayStore';

export default function SettingsPage() {
  const router = useRouter();
  const { getBasicData, saveBasicData, hydrated } = useRunwayStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const [balance, setBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [situationType, setSituationType] = useState<'freelancer' | 'job-seeker' | 'startup' | 'quick'>('quick');
  const [hasVariableIncome, setHasVariableIncome] = useState(false);

  useEffect(() => {
    if (hydrated) {
      const data = getBasicData();
      if (data) {
        setBalance(data.balance);
        setMonthlyExpenses(data.monthlyExpenses);
        setMonthlyIncome(data.monthlyIncome || 0);
        setSituationType(data.situationType);
        setHasVariableIncome(data.hasVariableIncome);
        setIsLoading(false);
      } else {
        // No data, redirect to onboarding
        router.push('/onboarding');
      }
    }
  }, [hydrated, getBasicData, router]);

  const handleSave = () => {
    saveBasicData({
      balance,
      monthlyExpenses,
      monthlyIncome,
      situationType,
      hasVariableIncome,
      createdAt: getBasicData()?.createdAt || new Date().toISOString(),
    });
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>⚙️</span>
            <span>설정</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 space-y-6">
          {/* Balance */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              💰 자산
            </label>
            <input
              type="number"
              step="100000"
              min="0"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
              className="w-full min-h-[44px] px-4 py-3 text-lg font-mono bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="예: 25000000"
            />
            <p className="text-sm text-gray-500 mt-1">
              현재 보유한 총 자산 (원화)
            </p>
          </div>

          {/* Monthly Expenses */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              💸 월 지출
            </label>
            <input
              type="number"
              step="10000"
              min="0"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
              className="w-full min-h-[44px] px-4 py-3 text-lg font-mono bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="예: 4500000"
            />
            <p className="text-sm text-gray-500 mt-1">
              매월 평균적으로 지출하는 금액
            </p>
          </div>

          {/* Monthly Income (Optional) */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              💵 월 수입 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
            </label>
            <input
              type="number"
              step="10000"
              min="0"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
              className="w-full min-h-[44px] px-4 py-3 text-lg font-mono bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="예: 0"
            />
            <p className="text-sm text-gray-500 mt-1">
              매월 들어오는 평균 수입 (없으면 0)
            </p>
          </div>

          {/* Situation Type */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              🎯 상황
            </label>
            <select
              value={situationType}
              onChange={(e) => setSituationType(e.target.value as typeof situationType)}
              className="w-full min-h-[44px] px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="freelancer">💼 프리랜서</option>
              <option value="job-seeker">🔍 구직자</option>
              <option value="startup">🚀 창업가</option>
              <option value="quick">⚡ 빠른 계산</option>
            </select>
          </div>

          {/* Variable Income */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="hasVariableIncome"
              checked={hasVariableIncome}
              onChange={(e) => setHasVariableIncome(e.target.checked)}
              className="mt-1 w-5 h-5 accent-blue-500"
            />
            <label htmlFor="hasVariableIncome" className="text-base text-gray-700 cursor-pointer">
              변동 소득이 있습니다
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 min-h-[48px] px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all border border-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 min-h-[48px] px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              저장
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>팁:</strong> 데이터는 브라우저에만 저장됩니다. 정기적으로 백업하세요.
          </p>
        </div>
      </main>
    </div>
  );
}
