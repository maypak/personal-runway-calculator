/**
 * Step3Expenses.tsx - 월 지출 입력
 * 
 * Purpose: 온보딩 Step 3 - 월 평균 지출 + 변동 소득 (옵션)
 * Created: 2026-02-23
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  calculateRunway,
  formatRunwayMonths,
  formatDateKorean,
  calculateRunwayEndDate,
  getRunwayColor,
  formatCurrency,
  calculateAverageIncome,
} from '../../../lib/calculations/runway';
import { useI18n } from '../../contexts/I18nContext';

interface Step3Props {
  balance: number;
  monthlyExpenses: number;
  hasVariableIncome: boolean;
  recentIncomes: number[];
  onExpensesChange: (expenses: number) => void;
  onVariableIncomeToggle: (enabled: boolean) => void;
  onRecentIncomesChange: (incomes: number[]) => void;
  onComplete: () => void;
  onPrev: () => void;
}

export default function Step3Expenses({
  balance,
  monthlyExpenses,
  hasVariableIncome,
  recentIncomes,
  onExpensesChange,
  onVariableIncomeToggle,
  onRecentIncomesChange,
  onComplete,
  onPrev,
}: Step3Props) {
  const { t, locale } = useI18n();
  const [expensesInput, setExpensesInput] = useState(monthlyExpenses.toString());
  const [incomeInputs, setIncomeInputs] = useState<string[]>(
    recentIncomes.length > 0 ? recentIncomes.map((i) => i.toString()) : ['', '', '']
  );
  
  useEffect(() => {
    setExpensesInput(monthlyExpenses.toString());
  }, [monthlyExpenses]);
  
  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setExpensesInput(value);
    onExpensesChange(parseInt(value) || 0);
  };
  
  const handleIncomeChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newInputs = [...incomeInputs];
    newInputs[index] = cleanValue;
    setIncomeInputs(newInputs);
    const incomes = newInputs.map((input) => parseInt(input) || 0);
    onRecentIncomesChange(incomes);
  };
  
  const avgIncome = hasVariableIncome ? calculateAverageIncome(recentIncomes) : 0;
  const runway = calculateRunway(balance, monthlyExpenses, avgIncome);
  const endDate = calculateRunwayEndDate(runway);
  const { color, bgColor, emoji } = getRunwayColor(runway);
  const canComplete = balance > 0 && monthlyExpenses > 0;

  // Get month labels from i18n
  const monthLabels = t('onboarding.step3.months');
  const months = Array.isArray(monthLabels) ? monthLabels : ['Month 1', 'Month 2', 'Month 3'];
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900">
        {t('onboarding.step3.title')}
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t('onboarding.step3.label')}
        </label>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">₩</span>
          <input
            type="text"
            value={expensesInput}
            onChange={handleExpensesChange}
            placeholder={t('onboarding.step3.placeholder')}
            className="w-full pl-10 pr-4 py-3 text-xl font-medium text-gray-900 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
          />
        </div>
        
        <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <span>💡</span>
          <span>{t('onboarding.step3.hint')}</span>
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasVariableIncome}
            onChange={(e) => onVariableIncomeToggle(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-lg font-medium text-gray-700">
            {t('onboarding.step3.variableIncome')}
          </span>
        </label>
      </div>
      
      {hasVariableIncome && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md border border-blue-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('onboarding.step3.recentIncome')}
          </h3>
          
          <div className="space-y-4">
            {months.map((month: string, index: number) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{month}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₩</span>
                  <input
                    type="text"
                    value={incomeInputs[index]}
                    onChange={(e) => handleIncomeChange(index, e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 font-medium text-gray-900 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {avgIncome > 0 && (
            <p className="mt-4 text-sm font-semibold text-gray-800">
              {t('onboarding.step3.avgIncome').replace('{{amount}}', formatCurrency(avgIncome))}
            </p>
          )}
        </div>
      )}
      
      {canComplete && (
        <div className="rounded-xl p-8 shadow-lg border-2 mb-6" style={{ backgroundColor: bgColor, borderColor: color }}>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>{emoji}</span>
            <span>{t('onboarding.step3.runway.title')}</span>
          </h3>
          
          <div className="text-center mb-4">
            <p className="text-5xl md:text-6xl font-bold mb-2" style={{ color }}>
              {formatRunwayMonths(runway, locale)}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full transition-all duration-500"
                style={{ width: runway >= 12 ? '100%' : `${(runway / 12) * 100}%`, backgroundColor: color }}
              />
            </div>
            {endDate && (
              <p className="text-lg text-gray-700">{formatDateKorean(endDate, locale)}</p>
            )}
          </div>
          
          <div className="space-y-2 text-gray-700">
            <p>{t('onboarding.step3.runway.expenses').replace('{{amount}}', formatCurrency(monthlyExpenses))}</p>
            {hasVariableIncome && avgIncome > 0 && (
              <p>{t('onboarding.step3.runway.income').replace('{{amount}}', formatCurrency(avgIncome))}</p>
            )}
            <p>{t('onboarding.step3.runway.assets').replace('{{amount}}', formatCurrency(balance))}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between gap-4">
        <button
          onClick={onPrev}
          className="min-h-[44px] px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
        >
          {t('onboarding.step3.prev')}
        </button>
        
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all ${canComplete ? 'bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {t('onboarding.step3.complete')}
        </button>
      </div>
    </div>
  );
}
