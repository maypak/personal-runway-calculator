/**
 * presets.ts - P1: 시나리오 프리셋 템플릿
 * 
 * Purpose: Pre-defined scenario templates for different situations
 * Categories: Startup, Freelancer, Job Seeker
 * 
 * Created: 2026-02-26 (P1 Features)
 */

import type { CustomScenario } from '@/app/components/AddScenarioModal';

export interface PresetCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  scenarios: Omit<CustomScenario, 'id'>[];
}

export const presetCategories: PresetCategory[] = [
  {
    id: 'startup',
    name: '🚀 창업가',
    description: '투자 유치 시나리오',
    icon: '🚀',
    scenarios: [
      {
        name: '브릿지 펀딩 ₩10M',
        type: 'balance_increase',
        value: 10000000,
        icon: '💎',
      },
      {
        name: '브릿지 펀딩 ₩20M',
        type: 'balance_increase',
        value: 20000000,
        icon: '💰',
      },
      {
        name: '엔젤 투자 ₩50M',
        type: 'balance_increase',
        value: 50000000,
        icon: '🦄',
      },
      {
        name: '절약 모드 -30%',
        type: 'expense_adjustment',
        value: -0.3,
        icon: '🎯',
      },
    ],
  },
  {
    id: 'freelancer',
    name: '💼 프리랜서',
    description: '계약 및 수입 변동 시나리오',
    icon: '💼',
    scenarios: [
      {
        name: '계약금 ₩5M',
        type: 'balance_increase',
        value: 5000000,
        icon: '📝',
      },
      {
        name: '계약금 ₩10M',
        type: 'balance_increase',
        value: 10000000,
        icon: '💼',
      },
      {
        name: '성수기 지출 +30%',
        type: 'expense_adjustment',
        value: 0.3,
        icon: '🔥',
      },
      {
        name: '비수기 절약 -30%',
        type: 'expense_adjustment',
        value: -0.3,
        icon: '❄️',
      },
    ],
  },
  {
    id: 'jobseeker',
    name: '🔍 취준생',
    description: '지원금 및 절약 시나리오',
    icon: '🔍',
    scenarios: [
      {
        name: '실업급여 ₩3M',
        type: 'balance_increase',
        value: 3000000,
        icon: '🎁',
      },
      {
        name: '부모님 지원 ₩2M',
        type: 'balance_increase',
        value: 2000000,
        icon: '👪',
      },
      {
        name: '절약 모드 -40%',
        type: 'expense_adjustment',
        value: -0.4,
        icon: '🎯',
      },
      {
        name: '최소 생활비 -50%',
        type: 'expense_adjustment',
        value: -0.5,
        icon: '⚡',
      },
    ],
  },
];

export function getPresetsByCategory(categoryId: string): Omit<CustomScenario, 'id'>[] {
  const category = presetCategories.find((c) => c.id === categoryId);
  return category?.scenarios || [];
}

export function getAllPresets(): Omit<CustomScenario, 'id'>[] {
  return presetCategories.flatMap((category) => category.scenarios);
}
