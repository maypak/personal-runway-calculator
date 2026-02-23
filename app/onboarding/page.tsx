/**
 * /onboarding - 온보딩 페이지
 * 
 * Purpose: 기본 계산기 온보딩 플로우 진입점
 * Created: 2026-02-23
 */

import OnboardingFlow from '../components/Onboarding/OnboardingFlow';

export const metadata = {
  title: '시작하기 - Personal Runway Calculator',
  description: '30초 안에 당신의 재정 런웨이를 확인하세요',
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
