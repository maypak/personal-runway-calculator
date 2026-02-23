/**
 * runway.ts - 런웨이 계산 로직
 * 
 * Purpose: Personal Runway 계산 및 분석
 * Created: 2026-02-23
 * Author: Developer Agent (Subagent)
 */

/**
 * 기본 런웨이 계산
 * 
 * @param balance - 현재 자산
 * @param monthlyExpenses - 월 평균 지출
 * @param monthlyIncome - 월 평균 수입 (옵션)
 * @returns 런웨이 (개월)
 */
export function calculateRunway(
  balance: number,
  monthlyExpenses: number,
  monthlyIncome: number = 0
): number {
  // Edge cases
  if (balance <= 0) return 0;
  if (monthlyExpenses <= 0 && monthlyIncome <= 0) return Infinity;
  
  const netBurn = monthlyExpenses - monthlyIncome;
  
  // If net income is positive or neutral
  if (netBurn <= 0) return Infinity;
  
  // Standard calculation
  return balance / netBurn;
}

/**
 * 런웨이 종료 날짜 계산
 * 
 * @param runwayMonths - 런웨이 (개월)
 * @param startDate - 시작 날짜 (기본: 오늘)
 * @returns 런웨이 종료 날짜
 */
export function calculateRunwayEndDate(
  runwayMonths: number,
  startDate: Date = new Date()
): Date | null {
  if (runwayMonths === Infinity || runwayMonths <= 0) return null;
  
  const endDate = new Date(startDate);
  const wholemonths = Math.floor(runwayMonths);
  const remainingDays = Math.round((runwayMonths - wholemonths) * 30);
  
  endDate.setMonth(endDate.getMonth() + wholemonths);
  endDate.setDate(endDate.getDate() + remainingDays);
  
  return endDate;
}

/**
 * 런웨이 색상 코딩
 * 
 * @param runwayMonths - 런웨이 (개월)
 * @returns 색상 정보 { color, bgColor, category }
 */
export function getRunwayColor(runwayMonths: number): {
  color: string;
  bgColor: string;
  category: 'critical' | 'warning' | 'good' | 'excellent' | 'infinite';
  emoji: string;
} {
  if (runwayMonths === Infinity) {
    return {
      color: '#3B82F6', // Blue
      bgColor: '#EFF6FF',
      category: 'infinite',
      emoji: '♾️',
    };
  }
  
  if (runwayMonths < 3) {
    return {
      color: '#EF4444', // Red
      bgColor: '#FEF2F2',
      category: 'critical',
      emoji: '🔴',
    };
  }
  
  if (runwayMonths < 6) {
    return {
      color: '#F59E0B', // Yellow/Amber
      bgColor: '#FFFBEB',
      category: 'warning',
      emoji: '🟡',
    };
  }
  
  if (runwayMonths < 12) {
    return {
      color: '#10B981', // Green
      bgColor: '#F0FDF4',
      category: 'good',
      emoji: '🟢',
    };
  }
  
  return {
    color: '#3B82F6', // Blue
    bgColor: '#EFF6FF',
    category: 'excellent',
    emoji: '🔵',
  };
}

/**
 * 런웨이별 격려 메시지
 * 
 * @param runwayMonths - 런웨이 (개월)
 * @param locale - 언어 코드 (기본: 'ko')
 * @returns 격려 메시지
 */
export function getRunwayMessage(
  runwayMonths: number,
  locale: string = 'ko'
): string {
  const messages = {
    ko: {
      critical: '숫자를 보는 것이 두려울 수 있습니다. 하지만 지금이 변화의 시작입니다.',
      warning: '숨 쉴 여유가 있습니다. 지금이 계획을 세울 때입니다.',
      good: '안정적인 런웨이입니다. 다음 단계를 준비할 시간이 충분합니다.',
      excellent: '훌륭한 상태입니다! 장기적인 목표에 집중할 수 있습니다.',
      infinite: '완벽합니다! 수입이 지출을 초과하고 있습니다.',
    },
    en: {
      critical: 'Seeing the numbers can feel scary. But this is the start of change.',
      warning: 'You have breathing room. Now is the time to plan.',
      good: 'Solid runway. You have time to prepare your next steps.',
      excellent: "You're in great shape! Focus on long-term goals.",
      infinite: 'Perfect! Your income exceeds your expenses.',
    },
  };
  
  const langMessages = messages[locale as keyof typeof messages] || messages.en;
  const { category } = getRunwayColor(runwayMonths);
  
  return langMessages[category];
}

/**
 * 날짜 포맷팅 (한국어)
 * 
 * @param date - 날짜
 * @returns "2026년 8월 15일" 형식
 */
export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 런웨이 개월수 포맷팅
 * 
 * @param runwayMonths - 런웨이 (개월)
 * @returns "5.8개월" 형식
 */
export function formatRunwayMonths(runwayMonths: number): string {
  if (runwayMonths === Infinity) return '무한';
  if (runwayMonths <= 0) return '0개월';
  
  return `${runwayMonths.toFixed(1)}개월`;
}

/**
 * 통화 포맷팅 (한국 원화)
 * 
 * @param amount - 금액
 * @returns "₩2,500,000" 형식
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = (amount / 1_000_000).toFixed(1);
    return `₩${millions}M`;
  }
  
  if (amount >= 1_000) {
    const thousands = Math.round(amount / 1_000);
    return `₩${thousands}K`;
  }
  
  return `₩${amount.toLocaleString('ko-KR')}`;
}

/**
 * 변동 소득 평균 계산
 * 
 * @param incomes - 최근 수입 배열
 * @returns 평균 수입
 */
export function calculateAverageIncome(incomes: number[]): number {
  if (incomes.length === 0) return 0;
  
  const sum = incomes.reduce((acc, income) => acc + income, 0);
  return sum / incomes.length;
}
