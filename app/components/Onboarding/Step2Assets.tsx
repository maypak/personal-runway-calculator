/**
 * Step2Assets.tsx - 자산 입력
 * 
 * Purpose: 온보딩 Step 2 - 현재 자산 입력
 * Created: 2026-02-23
 */

'use client';

import React, { useState, useEffect } from 'react';
import { calculateRunway, formatRunwayMonths, formatDateKorean, calculateRunwayEndDate } from '../../../lib/calculations/runway';
import { useI18n } from '../../contexts/I18nContext';

interface Step2Props {
  balance: number;
  monthlyExpenses: number;
  onBalanceChange: (balance: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Assets({
  balance,
  monthlyExpenses,
  onBalanceChange,
  onNext,
  onPrev,
}: Step2Props) {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState(balance.toString());
  
  useEffect(() => {
    setInputValue(balance.toString());
  }, [balance]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
    onBalanceChange(parseInt(value) || 0);
  };
  
  const previewRunway = monthlyExpenses > 0 ? calculateRunway(balance, monthlyExpenses) : null;
  const previewEndDate = previewRunway ? calculateRunwayEndDate(previewRunway) : null;
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900">
        {t('onboarding.step2.title')}
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {t('onboarding.step2.label')}
        </label>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
            ₩
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t('onboarding.step2.placeholder')}
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
          <span>{t('onboarding.step2.hint')}</span>
        </p>
      </div>
      
      {previewRunway !== null && balance > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>{t('onboarding.step2.preview.title')}</span>
          </h3>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">{t('onboarding.step2.preview.based')}</p>
            <p className="text-4xl font-bold text-orange-600 mb-2">
              {formatRunwayMonths(previewRunway)}
            </p>
            {previewEndDate && (
              <p className="text-gray-700">
                {formatDateKorean(previewEndDate)}{t('onboarding.step2.preview.until')}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between gap-4">
        <button
          onClick={onPrev}
          className="min-h-[44px] px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
        >
          {t('onboarding.step2.prev')}
        </button>
        
        <button
          onClick={onNext}
          disabled={balance <= 0}
          className={`
            min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all
            ${balance > 0 ? 'bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          {t('onboarding.step2.next')}
        </button>
      </div>
    </div>
  );
}
