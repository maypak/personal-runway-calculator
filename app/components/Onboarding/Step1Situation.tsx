/**
 * Step1Situation.tsx - 상황 선택
 * 
 * Purpose: 온보딩 Step 1 - 사용자 상황 선택
 * Created: 2026-02-23
 */

'use client';

import React from 'react';
import { useI18n } from '../../contexts/I18nContext';

interface Step1Props {
  selected: string | null;
  onSelect: (type: 'freelancer' | 'job-seeker' | 'startup' | 'quick') => void;
  onNext: () => void;
}

const situationIds = ['freelancer', 'job-seeker', 'startup', 'quick'] as const;
const situationEmojis = {
  'freelancer': '💼',
  'job-seeker': '🔍',
  'startup': '🚀',
  'quick': '⚡',
};

export default function Step1Situation({ selected, onSelect, onNext }: Step1Props) {
  const { t } = useI18n();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900">
        {t('onboarding.situation.title')}
      </h2>
      
      {/* Cards */}
      <div className="space-y-4 mb-8">
        {situationIds.map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`
              min-h-[44px] w-full p-6 rounded-xl text-left transition-all duration-200
              ${
                selected === id
                  ? 'border-2 border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-2 border-gray-200 bg-white hover:border-orange-500 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{situationEmojis[id]}</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {t(`onboarding.situation.${id}.title`)}
                </h3>
                <p className="text-gray-600">{t(`onboarding.situation.${id}.description`)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Privacy Notice */}
      <p className="text-sm text-gray-500 text-center mb-6">
        {t('onboarding.situation.privacy')}
      </p>
      
      {/* Next Button */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!selected}
          className={`
            min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all
            ${
              selected
                ? 'bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {t('onboarding.situation.next')}
        </button>
      </div>
    </div>
  );
}
