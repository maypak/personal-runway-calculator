/**
 * /dashboard - 메인 대시보드 페이지
 * 
 * Purpose: 기본 계산기 메인 화면
 * Created: 2026-02-23
 */

import RunwayDashboard from '../components/RunwayDashboard';

export const metadata = {
  title: '대시보드 - Personal Runway Calculator',
  description: '당신의 재정 런웨이를 확인하세요',
};

export default function DashboardPage() {
  return <RunwayDashboard />;
}
