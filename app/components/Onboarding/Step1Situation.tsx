/**
 * Step1Situation.tsx - 상황 선택
 * 
 * Purpose: 온보딩 Step 1 - 사용자 상황 선택
 * Created: 2026-02-23
 */

'use client';

import React from 'react';

interface Step1Props {
  selected: string | null;
  onSelect: (type: 'freelancer' | 'job-seeker' | 'startup' | 'quick') => void;
  onNext: () => void;
}

const situations = [
  {
    id: 'freelancer' as const,
    emoji: '💼',
    title: '프리랜서',
    description: '불규칙한 수입을 관리하고 런웨이를 예측하고 싶어요',
  },
  {
    id: 'job-seeker' as const,
    emoji: '🔍',
    title: '구직자',
    description: '제한된 예산으로 얼마나 버틸 수 있을지 궁금해요',
  },
  {
    id: 'startup' as const,
    emoji: '🚀',
    title: '창업가',
    description: '번아웃 전에 런웨이를 체크하고 싶어요',
  },
  {
    id: 'quick' as const,
    emoji: '⚡',
    title: '빠른 계산',
    description: '간단하게 런웨이만 확인하고 싶어요',
  },
];

export default function Step1Situation({ selected, onSelect, onNext }: Step1Props) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900">
        당신의 상황을 선택해주세요
      </h2>
      
      {/* Cards */}
      <div className="space-y-4 mb-8">
        {situations.map((situation) => (
          <button
            key={situation.id}
            onClick={() => onSelect(situation.id)}
            className={`
              min-h-[44px] w-full p-6 rounded-xl text-left transition-all duration-200
              ${
                selected === situation.id
                  ? 'border-2 border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-2 border-gray-200 bg-white hover:border-orange-500 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{situation.emoji}</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {situation.title}
                </h3>
                <p className="text-gray-600">{situation.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Privacy Notice */}
      <p className="text-sm text-gray-500 text-center mb-6">
        🔒 데이터는 기기에만 저장됩니다
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
          다음 →
        </button>
      </div>
    </div>
  );
}
