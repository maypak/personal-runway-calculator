/**
 * goal.ts - 목표 설정 및 역산 계산 로직
 * 
 * Purpose: Goal analysis and recommendations
 * Created: 2026-02-26 (P0 Features)
 * Author: Developer Agent (Subagent)
 */

import { formatCurrency } from './runway';

/**
 * Goal analysis result
 */
export interface GoalAnalysis {
  targetMonths: number;
  currentMonths: number;
  gap: number; // negative = 부족
  status: 'safe' | 'tight' | 'danger';
  suggestions: Suggestion[];
}

/**
 * Action suggestion for goal achievement
 */
export interface Suggestion {
  type: 'reduce_expense' | 'increase_balance';
  description: string;
  value: number;
  icon: string;
}

/**
 * P0: Analyze goal vs current runway
 * 
 * @param balance - 현재 자산
 * @param monthlyExpenses - 월 평균 지출
 * @param targetMonths - 목표 개월 수
 * @returns 목표 분석 결과
 */
export function analyzeGoal(
  balance: number,
  monthlyExpenses: number,
  targetMonths: number
): GoalAnalysis {
  const currentMonths = balance / monthlyExpenses;
  const gap = currentMonths - targetMonths;

  const suggestions: Suggestion[] = [];

  if (gap < 0) {
    // 부족한 경우
    const absGap = Math.abs(gap);
    
    // Calculate needed expense reduction percentage
    const neededExpenseReduction = absGap / targetMonths;
    const reductionAmount = monthlyExpenses * neededExpenseReduction;
    
    // Calculate needed funding amount
    const neededFunding = absGap * monthlyExpenses;

    suggestions.push({
      type: 'reduce_expense',
      description: `지출 ${(neededExpenseReduction * 100).toFixed(0)}% 절감 (${formatCurrency(reductionAmount)})`,
      value: reductionAmount,
      icon: '✅',
    });

    suggestions.push({
      type: 'increase_balance',
      description: `브릿지 펀딩 ${formatCurrency(neededFunding)}`,
      value: neededFunding,
      icon: '✅',
    });
  }

  return {
    targetMonths,
    currentMonths: parseFloat(currentMonths.toFixed(1)),
    gap: parseFloat(gap.toFixed(1)),
    status: gap >= 1 ? 'safe' : gap >= -0.5 ? 'tight' : 'danger',
    suggestions,
  };
}

/**
 * Format goal status message
 * 
 * @param status - Goal status
 * @param locale - Language code
 * @returns Status message
 */
export function getGoalStatusMessage(
  status: 'safe' | 'tight' | 'danger',
  locale: string = 'ko'
): string {
  const messages = {
    ko: {
      safe: '안전권 진입',
      tight: '타이트',
      danger: '위험',
    },
    en: {
      safe: 'Safe',
      tight: 'Tight',
      danger: 'Danger',
    },
  };

  const lang = messages[locale as keyof typeof messages] || messages.en;
  return lang[status];
}

/**
 * Get goal status emoji
 * 
 * @param status - Goal status
 * @returns Emoji
 */
export function getGoalStatusEmoji(status: 'safe' | 'tight' | 'danger'): string {
  const emojis = {
    safe: '🎯',
    tight: '⚠️',
    danger: '🔴',
  };
  
  return emojis[status];
}
