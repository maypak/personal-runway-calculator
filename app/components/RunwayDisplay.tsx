/**
 * RunwayDisplay.tsx - 런웨이 큰 숫자 표시
 * 
 * Purpose: 메인 대시보드 런웨이 카드 (큰 숫자 + 색상 코딩)
 * Created: 2026-02-23
 */

'use client';

import React from 'react';
import {
  calculateRunway,
  formatRunwayMonths,
  formatDateKorean,
  calculateRunwayEndDate,
  getRunwayColor,
  getRunwayMessage,
  formatCurrency,
} from '../../lib/calculations/runway';

interface RunwayDisplayProps {
  balance: number;
  monthlyExpenses: number;
  monthlyIncome?: number;
  locale?: string;
}

export default function RunwayDisplay({
  balance,
  monthlyExpenses,
  monthlyIncome = 0,
  locale = 'ko',
}: RunwayDisplayProps) {
  // Calculate runway
  const runway = calculateRunway(balance, monthlyExpenses, monthlyIncome);
  const endDate = calculateRunwayEndDate(runway);
  const { color, bgColor, emoji } = getRunwayColor(runway);
  const message = getRunwayMessage(runway, locale);
  
  return (
    <div
      className="rounded-2xl p-8 shadow-xl border-2 transition-all hover:shadow-2xl"
      style={{ backgroundColor: bgColor, borderColor: color }}
    >
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span className="text-4xl">{emoji}</span>
        <span>당신의 재정 런웨이</span>
      </h2>
      
      {/* Big Number */}
      <div className="text-center mb-6">
        <p
          className="text-6xl md:text-7xl font-extrabold mb-4"
          style={{ color }}
        >
          {formatRunwayMonths(runway)}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: runway >= 12 ? '100%' : `${Math.min((runway / 12) * 100, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
        
        {/* End Date */}
        {endDate && (
          <p className="text-xl font-semibold text-gray-700">
            {formatDateKorean(endDate)}까지
          </p>
        )}
      </div>
      
      {/* Financial Summary */}
      <div className="space-y-3 mb-6 text-gray-700">
        <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
          <span className="font-medium">월 평균 지출:</span>
          <span className="font-bold text-lg">{formatCurrency(monthlyExpenses)}</span>
        </div>
        
        {monthlyIncome > 0 && (
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
            <span className="font-medium">월 평균 수입:</span>
            <span className="font-bold text-lg text-green-600">
              {formatCurrency(monthlyIncome)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
          <span className="font-medium">현재 자산:</span>
          <span className="font-bold text-lg">{formatCurrency(balance)}</span>
        </div>
      </div>
      
      {/* Encouragement Message */}
      <div className="bg-white bg-opacity-80 rounded-lg p-4 border border-gray-200">
        <p className="text-sm md:text-base text-gray-700 italic">
          "{message}"
        </p>
      </div>
    </div>
  );
}
