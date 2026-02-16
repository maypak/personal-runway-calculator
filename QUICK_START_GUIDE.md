# Quick Start Guide - 실용성 개선 기능 구현

**목적:** 개발자가 바로 시작할 수 있도록 핵심만 추출

---

## 🎯 우선순위 Top 3 (개발 순서대로)

### 1. Goal Setting (목표 설정) — 6시간
```
Free:  1개 목표 설정 가능
Premium: 3개 동시 목표
```

**왜 1순위?**
- 재방문 동기 강력 ("목표까지 얼마나 남았지?")
- 두 페르소나 모두 필수 (Burnout + Founder)
- 개발 간단 (UI + DB 테이블 1개)

**구현:**
```bash
# 1. 새 컴포넌트 생성
app/components/GoalCard.tsx

# 2. Supabase 테이블
create table goals (
  id uuid primary key,
  user_id uuid references auth.users,
  goal_type text, -- 'runway' or 'savings'
  target_value numeric,
  description text,
  is_active boolean default true
);

# 3. Dashboard에 추가
import GoalCard from './GoalCard';
<GoalCard />  // Runway 카드 바로 아래
```

---

### 2. Alerts (주간 이메일) — 8시간
```
Free:  주간 이메일 요약 (월요일 9AM)
Premium: 실시간 SMS 알림
```

**왜 2순위?**
- 주간 재참여 (+200% 예상)
- Burnout Escapist 핵심 니즈 (불안 해소)

**구현:**
```bash
# 1. Resend 계정 생성
https://resend.com/signup

# 2. Supabase 테이블
create table notification_settings (
  user_id uuid primary key,
  weekly_summary_enabled boolean default true,
  email text
);

# 3. Edge Function
supabase/functions/send-weekly-summary/index.ts

# 4. Cron 설정
매주 월요일 9:00 AM → 모든 활성 유저 이메일 발송
```

---

### 3. Trend Graphs (추세 그래프) — 8시간
```
Free:  최근 3개월 런웨이 추세
Premium: 12개월 + 카테고리별 + CSV
```

**왜 3순위?**
- Aspiring Founder 핵심 니즈 (진행률 확인)
- 시각적 만족감 → 동기부여

**구현:**
```bash
# 1. Chart.js 설치
npm install chart.js react-chartjs-2

# 2. 새 페이지
app/trends/page.tsx

# 3. Supabase 테이블
create table runway_snapshots (
  id uuid primary key,
  user_id uuid,
  snapshot_date date,
  runway_months numeric,
  total_savings numeric
);

# 4. Daily Cron
매일 자정 → 모든 활성 유저 스냅샷 저장
```

---

## 🎨 UI 빠른 참고

### GoalCard 핵심 클래스
```tsx
// 컨테이너
bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 
border-2 border-violet-200

// 진행률 바 (채워진 부분)
bg-gradient-to-r from-violet-500 to-violet-600 h-4 
transition-all duration-500
style={{ width: `${progress}%` }}

// 진행률 숫자
text-right text-sm font-semibold text-violet-700
```

### 차트 (Chart.js) 기본 설정
```tsx
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb'],
  datasets: [{
    label: 'Runway (months)',
    data: [4.2, 5.0, 5.8, 6.1],
    borderColor: 'rgb(139, 92, 246)', // violet-500
    tension: 0.3,
  }],
};
```

---

## 📊 Free vs Premium 구분

| 기능 | Free | Premium |
|------|------|---------|
| Goal Setting | 1개 | 3개 동시 |
| Alerts | 주간 이메일 | 실시간 SMS |
| Trends | 3개월 | 12개월 + CSV |

**가격:** $8/월 or $79/년 (17% 할인)

---

## ✅ 개발 체크리스트

### Week 1: Goal Setting + Email Alerts
- [ ] GoalCard 컴포넌트
- [ ] GoalModal (설정/수정)
- [ ] `goals` 테이블 생성
- [ ] 진행률 계산 로직
- [ ] Resend 통합
- [ ] 주간 이메일 템플릿
- [ ] Edge Function + Cron

### Week 2: Trends + Recommendations
- [ ] TrendsPage 컴포넌트
- [ ] Chart.js 통합
- [ ] `runway_snapshots` 테이블
- [ ] Daily snapshot Cron
- [ ] InsightsCard (규칙 기반 추천)

### Week 3: Premium 기능
- [ ] Twilio SMS 통합
- [ ] 12개월 차트
- [ ] CSV Export
- [ ] 다중 목표 UI

---

## 🚀 배포 순서

1. **Week 1 종료:** Soft Launch (친구 5명)
2. **Week 2 종료:** Reddit Beta (r/personalfinance)
3. **Week 3 종료:** Product Hunt 런칭

---

## 💡 핵심 성공 지표

- **재방문율 (7일):** 5% → 20%
- **Goal 설정률:** 60%
- **주간 활성 사용자:** 40%

---

**상세 명세는 PRACTICALITY_IMPROVEMENTS.md 참고!**
