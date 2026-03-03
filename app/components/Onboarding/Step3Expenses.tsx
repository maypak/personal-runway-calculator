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
  const [expensesInput, setExpensesInput] = useState(monthlyExpenses.toString());
  const [incomeInputs, setIncomeInputs] = useState<string[]>(
    recentIncomes.length > 0
      ? recentIncomes.map((i) => i.toString())
      : ['', '', '']
  );
  
  // Update when props change
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
  
  // Calculate final runway
  const avgIncome = hasVariableIncome ? calculateAverageIncome(recentIncomes) : 0;
  const runway = calculateRunway(balance, monthlyExpenses, avgIncome);
  const endDate = calculateRunwayEndDate(runway);
  const { color, bgColor, emoji } = getRunwayColor(runway);
  
  const canComplete = balance > 0 && monthlyExpenses > 0;
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900">
        한 달 평균 지출은 얼마인가요?
      </h2>
      
      {/* Expenses Input */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          월 평균 지출
        </label>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
            ₩
          </span>
          <input
            type="text"
            value={expensesInput}
            onChange={handleExpensesChange}
            placeholder="850000"
            className="
              w-full pl-10 pr-4 py-3 text-xl font-medium text-gray-900
              border-2 border-gray-300 rounded-lg
              focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100
              transition-all
            "
          />
        </div>
        
        <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <span>💡</span>
          <span>월세, 식비, 공과금 등 고정 지출 포함</span>
        </p>
      </div>
      
      {/* Variable Income Toggle */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasVariableIncome}
            onChange={(e) => onVariableIncomeToggle(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-lg font-medium text-gray-700">
            변동 소득이 있어요 (프리랜서/창업가)
          </span>
        </label>
      </div>
      
      {/* Variable Income Inputs (expandable) */}
      {hasVariableIncome && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md border border-blue-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            최근 3개월 수입을 입력해주세요
          </h3>
          
          <div className="space-y-4">
            {['1월', '2월', '3월'].map((month, index) => (
              <div key={month}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {month}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₩
                  </span>
                  <input
                    type="text"
                    value={incomeInputs[index]}
                    onChange={(e) => handleIncomeChange(index, e.target.value)}
                    placeholder="0"
                    className="
                      w-full pl-10 pr-4 py-2 font-medium text-gray-900
                      border-2 border-gray-300 rounded-lg bg-white
                      focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100
                      transition-all
                    "
                  />
                </div>
              </div>
            ))}
          </div>
          
          {avgIncome > 0 && (
            <p className="mt-4 text-sm font-semibold text-gray-800">
              평균 수입: {formatCurrency(avgIncome)}
            </p>
          )}
        </div>
      )}
      
      {/* Final Runway Display */}
      {canComplete && (
        <div
          className="rounded-xl p-8 shadow-lg border-2 mb-6"
          style={{ backgroundColor: bgColor, borderColor: color }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>{emoji}</span>
            <span>당신의 런웨이</span>
          </h3>
          
          <div className="text-center mb-4">
            <p className="text-5xl md:text-6xl font-bold mb-2" style={{ color }}>
              {formatRunwayMonths(runway)}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: runway >= 12 ? '100%' : `${(runway / 12) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            {endDate && (
              <p className="text-lg text-gray-700">
                {formatDateKorean(endDate)}까지
              </p>
            )}
          </div>
          
          <div className="space-y-2 text-gray-700">
            <p>월 평균 지출: {formatCurrency(monthlyExpenses)}</p>
            {hasVariableIncome && avgIncome > 0 && (
              <p>월 평균 수입: {formatCurrency(avgIncome)}</p>
            )}
            <p>현재 자산: {formatCurrency(balance)}</p>
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onPrev}
          className="
            min-h-[44px] px-6 py-3 rounded-lg font-semibold text-gray-700
            bg-gray-200 hover:bg-gray-300
            transition-all
          "
        >
          ← 이전
        </button>
        
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`
            min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all
            ${
              canComplete
                ? 'bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          대시보드로 →
        </button>
      </div>
    </div>
  );
}
