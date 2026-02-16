# Personal Runway Calculator - 실용성 개선 기능 명세서

**작성일:** 2026-02-16  
**작성자:** Designer Subagent  
**목적:** "계산기"에서 "매일 확인하고 싶은 재무 관리 도구"로 진화

---

## 📊 Executive Summary

### 현재 문제
> "그냥 계산기같고 실용성이 모자라" — 친구 피드백

**현재 상태:**
- 입력 → 계산 → 결과 (1회성)
- 저장된 데이터 활용 부족
- 재방문 동기 약함
- 감정적 연결 없음

### 목표
> "계산기" → "재무 관리 도구" 진화

**성공 기준:**
- 재방문율 20% (현재 5% 추정)
- 주간 활성 사용자 비율 40%
- "매일 확인하고 싶다" 피드백

---

## 🎯 페르소나별 핵심 니즈 (리서치 기반)

### 1. The Burnout Escapist 🔥 (최우선 타겟)
**상황:** "내일 당장 퇴사하고 싶음", 극심한 번아웃  
**핵심 니즈:**
- ✅ **Alerts** — "런웨이 3개월 이하!" 긴급 알림 (불안 해소)
- ✅ **Goal Setting** — "6개월 런웨이 달성" 목표 (희망 시각화)
- ⚠️ Trend Graphs — 부차적 (당장 급한 건 아님)
- ❌ Smart Recommendations — 관심 없음 (피곤해서 생각도 싫음)

**인용:**
> "I'm curious. Because I kinda just want to quit my job and never show up again. Is 50K enough?"  
> — Reddit r/hatemyjob

### 2. The Aspiring Founder 🚀 (고가치 타겟)
**상황:** 창업 준비 중, 3년 런웨이 목표로 저축 중  
**핵심 니즈:**
- ✅ **Goal Setting** — "3년 런웨이까지 D-365" 시각화 (동기부여)
- ✅ **Trend Graphs** — 월별 진행률 확인 (데이터 중독자)
- ✅ **Smart Recommendations** — "월 $500 더 저축하면 6개월 단축" (최적화)
- ⚠️ Alerts — 덜 중요 (이미 계획적)

**인용:**
> "I'm at 3 comfortable years of runway, but I want 4 so I can get 3 years to bootstrap my SaaS..."  
> — Reddit r/QuitCorporate

---

## 🚀 기능 우선순위 & Free vs Premium 분류

### Priority 1: Goal Setting (목표 설정) ⭐⭐⭐⭐⭐
**왜 1순위?**
- 두 페르소나 모두 필수
- 재방문 동기 강력 ("목표까지 얼마나 남았지?")
- 개발 복잡도 낮음 (4-6시간)

**Free vs Premium:**
```
Free:  1개 목표 설정 가능
       - "6개월 런웨이 달성"
       - 진행률 바 표시 (70%)
       - 목표까지 부족한 금액 표시

Premium: 3개 동시 목표
         - "6개월 런웨이" + "비상금 $10K" + "창업 자금 $50K"
         - 우선순위 설정
         - 목표 달성 히스토리
```

**가치 제안:**
- Free: "목표를 세우면 40% 더 빨리 달성합니다" (심리학 연구)
- Premium: "여러 목표를 동시에 추적하세요"

---

### Priority 2: Alerts (알림) ⭐⭐⭐⭐⭐
**왜 1순위?**
- Burnout Escapist의 핵심 니즈 (불안 해소)
- 재방문 유도 강력 (푸시 알림)
- 개발 복잡도 중간 (6-8시간, 이메일/SMS 통합)

**Free vs Premium:**
```
Free:  주간 이메일 요약
       - "이번 주 런웨이: 5.2개월 (△ +0.3)"
       - 예산 사용률: "이번 달 67% 사용 중"

Premium: 실시간 알림 (이메일 + SMS)
         - "🚨 런웨이 3개월 이하! 지출 줄이거나 수입 늘리세요"
         - "🎉 목표 달성! 6개월 런웨이 돌파"
         - "⚠️ 이번 달 예산 90% 사용 (3일 남음)"
         - 커스텀 알림 설정 (예: "런웨이 4개월 이하 시 알림")
```

**가치 제안:**
- Free: "매주 자동으로 체크인"
- Premium: "중요한 순간 놓치지 마세요 (SMS)"

---

### Priority 3: Trend Graphs (추세 그래프) ⭐⭐⭐⭐
**왜 3순위?**
- Aspiring Founder 핵심 니즈 (진행률 확인)
- 시각적 만족감 (동기부여)
- 개발 복잡도 중간 (6-8시간, Chart.js 통합)

**Free vs Premium:**
```
Free:  최근 3개월 런웨이 추세
       - 라인 차트 (간단)
       - "5.2 → 5.8 → 6.1개월 (↗️ 상승세!)"

Premium: 12개월 추세 + 다중 지표
         - 런웨이, 저축액, 지출, 수입 동시 표시
         - 카테고리별 지출 추세 (Food, Transport 등)
         - CSV 다운로드
         - 연간 비교 ("작년 2월 대비 +15%")
```

**가치 제안:**
- Free: "당신의 진행 상황을 한눈에"
- Premium: "모든 지표를 깊이 분석하세요"

---

### Priority 4: Smart Recommendations (스마트 제안) ⭐⭐⭐
**왜 4순위?**
- Aspiring Founder에게만 유용 (Burnout은 무시)
- 개발 복잡도 높음 (8-12시간, 로직 복잡)
- AI 통합 시 비용 증가 (OpenAI API)

**Free vs Premium:**
```
Free:  기본 제안 (규칙 기반)
       - "월 지출 $500 줄이면 런웨이 +1.2개월"
       - "부수입 $300 생기면 런웨이 +0.8개월"

Premium: AI 기반 맞춤 제안 (미래 기능)
         - "커피 지출 $120/월 → Brewing 장비 $200 투자 = 6개월 후 $520 절약"
         - "통신비 $80 → 요금제 변경으로 $30 절약 가능"
         - "저축 이자율 0.1% → 고금리 예금 3.5% 이동 권장"
```

**가치 제안:**
- Free: "간단한 시뮬레이션"
- Premium: "AI가 찾아낸 절약 기회 (미래 출시)"

---

## 🎨 UI/UX 디자인 명세서 (모바일 우선)

### 설계 원칙
1. **Mobile-first:** 375px (iPhone SE) 기준 → 768px 확장
2. **Accessibility:** WCAG AA (4.5:1 contrast)
3. **Simplicity:** 기존 FinanceDashboard에 "추가", "대체" 아님
4. **Tailwind:** 기존 디자인 시스템 준수

---

### 기능 1: Goal Setting (목표 설정)

#### 배치 위치
**기존 구조:**
```
FinanceDashboard
  ├─ Runway 카드 (상단)
  ├─ Expense Tracker
  └─ Simulator
```

**새 구조:**
```
FinanceDashboard
  ├─ Runway 카드 (상단)
  ├─ 🆕 Goal Progress 카드 (Runway 바로 아래)
  ├─ Expense Tracker
  └─ Simulator
```

**이유:** 런웨이 숫자 확인 → 즉시 목표 진행률 확인 (자연스러운 흐름)

---

#### UI 컴포넌트: GoalCard

**Desktop (lg:):**
```
┌──────────────────────────────────────────────────────┐
│  🎯 Your Goal: 6-Month Runway                        │
│                                                       │
│  ████████████████░░░░░░░░  70%                       │
│  $21,000 / $30,000                                   │
│                                                       │
│  📊 Current Runway: 4.2 months                       │
│  💰 Need: $9,000 more                                │
│  📅 At current rate: ~3.5 months to goal             │
│                                                       │
│  [Edit Goal]  [Set New Goal] 🔒Premium               │
└──────────────────────────────────────────────────────┘
```

**Mobile (375px):**
```
┌─────────────────────────────┐
│  🎯 Your Goal               │
│  6-Month Runway             │
│                             │
│  ███████░░░ 70%             │
│  $21K / $30K                │
│                             │
│  Current: 4.2mo             │
│  Need: $9K more             │
│  ETA: ~3.5 months           │
│                             │
│  [Edit Goal]                │
│  [+New] 🔒Premium           │
└─────────────────────────────┘
```

---

#### Tailwind 클래스 (GoalCard.tsx)

```tsx
// 컨테이너
className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 
           border-2 border-violet-200 dark:border-violet-800"

// 제목 (Emoji + 텍스트)
className="text-xl font-bold text-gray-900 dark:text-white mb-4 
           flex items-center gap-2"

// 진행률 바 컨테이너
className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 
           overflow-hidden"

// 진행률 바 (채워진 부분)
className="bg-gradient-to-r from-violet-500 to-violet-600 h-4 
           transition-all duration-500 ease-out rounded-full"
style={{ width: `${progress}%` }}

// 진행률 숫자 (70%)
className="text-right text-sm font-semibold text-violet-700 
           dark:text-violet-400"

// 금액 표시 ($21,000 / $30,000)
className="text-lg font-mono text-gray-700 dark:text-gray-300"

// 상태 정보 (📊 Current, 💰 Need, 📅 ETA)
className="space-y-2 mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 
           rounded-xl"

// 각 정보 행
className="flex items-start gap-2 text-sm"

// Emoji
className="text-lg flex-shrink-0"

// 텍스트
className="text-gray-700 dark:text-gray-300"

// 강조 숫자/텍스트
className="font-semibold text-violet-700 dark:text-violet-400"

// 버튼 (Edit Goal)
className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white 
           rounded-lg transition-colors font-medium text-sm"

// Premium 버튼 (비활성)
className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 
           dark:text-gray-400 rounded-lg cursor-not-allowed 
           text-sm flex items-center gap-2"

// 🔒 아이콘
className="text-xs"
```

---

#### 사용자 플로우: Goal Setting

```
1. 처음 방문 (목표 없음)
   └─ GoalCard 대신 "Set Your First Goal" CTA 카드 표시
      └─ [Set Goal] 클릭
         └─ Modal 열림

2. Modal: Goal Setting Form
   ┌─────────────────────────────────┐
   │  🎯 Set Your Goal               │
   │                                 │
   │  Goal Type:                     │
   │  ○ Runway (months)              │
   │  ○ Savings Amount ($)           │
   │                                 │
   │  [ 6 ] months                   │
   │    (or $30,000 savings)         │
   │                                 │
   │  Why this goal?                 │
   │  [Safe quit my job]             │
   │  (optional, 30 chars)           │
   │                                 │
   │  [Cancel]  [Save Goal]          │
   └─────────────────────────────────┘

3. 목표 저장 → Modal 닫힘
   └─ GoalCard 나타남 (애니메이션: fade-in + slide-up)
   └─ 진행률 바 0 → 70% 애니메이션 (1초)

4. 매일 방문 시
   └─ 진행률 업데이트 자동 (런웨이 변경 시)
   └─ "Need $9K more" → "$8.5K more" (변화 강조)

5. 목표 달성 시
   └─ 🎉 축하 모달
      ┌─────────────────────────────┐
      │  🎉 Goal Achieved!          │
      │                             │
      │  You've reached 6-month     │
      │  runway! Amazing work.      │
      │                             │
      │  Set next goal?             │
      │  [Yes]  [Not Now]           │
      └─────────────────────────────┘
```

---

#### 데이터 모델 (Supabase)

```typescript
// 새 테이블: goals
interface Goal {
  id: string;                    // UUID
  user_id: string;               // FK to auth.users
  goal_type: 'runway' | 'savings'; 
  target_value: number;          // 6 (months) or 30000 ($)
  description?: string;          // "Safe quit my job"
  created_at: timestamp;
  achieved_at?: timestamp;       // NULL until achieved
  is_active: boolean;            // Only 1 active per user (Free tier)
}

// 계산 로직
currentProgress = (currentRunway / targetRunway) * 100
// or
currentProgress = (currentSavings / targetSavings) * 100

// "Need X more" 계산
deficit = targetValue - currentValue

// ETA 계산 (최근 3개월 평균 증가율 기반)
avgMonthlyGrowth = (last3MonthsData.reduce(...) / 3)
monthsToGoal = deficit / avgMonthlyGrowth
```

---

### 기능 2: Alerts (알림)

#### 배치 위치
**Settings 페이지에 새 섹션 추가**

```
Settings
  ├─ Theme
  ├─ Data Import/Export
  └─ 🆕 Notifications
```

---

#### UI 컴포넌트: NotificationSettings

**Desktop:**
```
┌──────────────────────────────────────────────────────┐
│  🔔 Notifications                                    │
│                                                       │
│  ✅ Weekly Summary Email                             │
│     Every Monday 9:00 AM                             │
│     [✓] Enabled                                      │
│                                                       │
│  🔒 Premium: Instant Alerts                          │
│     ⚠️ Runway drops below X months                   │
│     🎉 Goal achieved                                 │
│     💰 Monthly budget exceeded                       │
│     [Upgrade to Premium]                             │
│                                                       │
│  Email: user@example.com  [Change]                   │
│  Phone: +1 (***) ***-1234  [Add] 🔒Premium           │
└──────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────────┐
│  🔔 Notifications           │
│                             │
│  Weekly Summary             │
│  [✓] Mon 9AM                │
│                             │
│  🔒 Instant Alerts          │
│  Upgrade for:               │
│  • Runway warnings          │
│  • Goal celebrations        │
│  • Budget alerts            │
│  [Upgrade]                  │
│                             │
│  📧 user@example.com        │
│  📱 Add Phone 🔒            │
└─────────────────────────────┘
```

---

#### 알림 종류 & 트리거

**Free Tier: 주간 이메일 요약**
```
제목: 📊 Your Weekly Runway Update
발송: 매주 월요일 9:00 AM (사용자 타임존)

내용:
━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Personal Runway Update
━━━━━━━━━━━━━━━━━━━━━━━━━

This Week:
• Runway: 5.8 months (↗️ +0.3 from last week)
• Savings: $23,200 (↗️ +$500)
• Expenses: $1,240 (↘️ -$120 vs avg)

🎯 Goal Progress:
6-Month Runway — 97% complete!
Just $600 more to go.

💡 Insight:
Great job! Your runway increased for 
3 weeks straight. Keep it up!

[View Full Dashboard →]

━━━━━━━━━━━━━━━━━━━━━━━━━
Unsubscribe | Settings
```

**Premium Tier: 실시간 알림 (이메일 + SMS)**

1. **Runway Warning (긴급)**
   ```
   트리거: runway < user_threshold (default: 3 months)
   
   SMS:
   🚨 Runway Alert!
   Your runway dropped to 2.8 months.
   Time to reduce expenses or increase income.
   [View Details] personalrunway.app
   
   Email:
   제목: 🚨 Action Required: Runway Below 3 Months
   (상세 분석 + 추천 액션)
   ```

2. **Goal Achieved (축하)**
   ```
   트리거: currentValue >= targetValue
   
   SMS:
   🎉 Congrats! You achieved your 
   6-month runway goal! 🚀
   Set your next goal →
   
   Email:
   제목: 🎉 Goal Achieved: 6-Month Runway!
   (축하 메시지 + 다음 목표 제안)
   ```

3. **Budget Alert (경고)**
   ```
   트리거: thisMonthExpenses >= monthlyBudget * 0.9
   
   SMS:
   ⚠️ Budget Alert: 90% Used
   You've spent $3,600 of $4,000
   this month. 3 days left.
   
   Email:
   제목: ⚠️ Monthly Budget 90% Used
   (카테고리별 분석 + 절약 팁)
   ```

---

#### Tailwind 클래스 (NotificationSettings.tsx)

```tsx
// 컨테이너
className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"

// 섹션 제목
className="text-2xl font-bold text-gray-900 dark:text-white mb-6 
           flex items-center gap-2"

// 알림 옵션 (각각)
className="border-b border-gray-200 dark:border-gray-700 py-4 
           last:border-b-0"

// 옵션 제목
className="text-lg font-semibold text-gray-800 dark:text-gray-200 
           mb-1"

// 옵션 설명
className="text-sm text-gray-600 dark:text-gray-400 mb-3"

// Toggle Switch (Enabled/Disabled)
className="relative inline-flex h-6 w-11 items-center rounded-full 
           transition-colors
           bg-violet-600 (enabled) 
           bg-gray-300 (disabled)"

// Toggle Circle
className="inline-block h-4 w-4 transform rounded-full bg-white 
           transition-transform
           translate-x-6 (enabled)
           translate-x-1 (disabled)"

// Premium Badge
className="inline-flex items-center gap-1 px-2 py-1 
           bg-gradient-to-r from-violet-500 to-purple-600 
           text-white text-xs font-bold rounded-full"

// Premium Feature List
className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400"

// List Item
className="flex items-start gap-2"
// • bullet
className="text-violet-600 mt-1"

// Upgrade Button
className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-violet-600 
           to-purple-600 hover:from-violet-700 hover:to-purple-700 
           text-white rounded-xl font-semibold transition-all
           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
```

---

#### 사용자 플로우: Alerts

```
1. Settings 페이지 방문
   └─ Notifications 섹션 스크롤

2. Weekly Summary 토글
   [OFF] 클릭 → [ON]
   └─ Toast: "✓ Weekly summary enabled! Next email: Mon 9AM"

3. Premium Alerts 확인
   └─ 회색 박스 (비활성)
   └─ [Upgrade to Premium] 클릭
      └─ 가격 페이지로 이동

4. Premium 구독 후
   └─ Instant Alerts 활성화
   └─ 커스텀 설정 가능
      ┌─────────────────────────────┐
      │  Runway Warning             │
      │  Alert when below:          │
      │  [3] months  [Save]         │
      │                             │
      │  Delivery:                  │
      │  [✓] Email                  │
      │  [✓] SMS                    │
      └─────────────────────────────┘

5. 첫 알림 수신 (예: SMS)
   └─ 문자 받음 → 링크 클릭 → 대시보드
   └─ 즉시 현황 확인 + 액션 취함
```

---

#### 데이터 모델 (Supabase)

```typescript
// 새 테이블: notification_settings
interface NotificationSettings {
  user_id: string;               // FK, Primary Key
  weekly_summary_enabled: boolean; // Free
  weekly_summary_day: number;    // 1=Mon, 7=Sun
  weekly_summary_hour: number;   // 9 = 9:00 AM
  
  // Premium features
  runway_alert_enabled: boolean;
  runway_alert_threshold: number; // 3 (months)
  goal_alert_enabled: boolean;
  budget_alert_enabled: boolean;
  budget_alert_percent: number;  // 90 (%)
  
  // Delivery preferences
  email: string;
  sms_phone?: string;            // NULL if not premium
  sms_enabled: boolean;
  
  updated_at: timestamp;
}

// 새 테이블: notification_log (디버깅/분석용)
interface NotificationLog {
  id: string;
  user_id: string;
  type: 'weekly_summary' | 'runway_alert' | 'goal_achieved' | 'budget_alert';
  channel: 'email' | 'sms';
  sent_at: timestamp;
  delivered: boolean;
  opened?: boolean;              // Email tracking
  clicked?: boolean;
}
```

---

#### 구현 기술 스택

**이메일 발송:**
- **Resend** (추천) — $20/월 (50K emails)
- 대안: SendGrid Free (100 emails/day)

**SMS 발송:**
- **Twilio** — $0.0079/SMS (미국)
- 예산: 100명 Premium × 월 4 SMS = 400 SMS = $3.16/월

**스케줄러:**
- **Supabase Edge Functions + pg_cron**
- 매주 월요일 9AM → Cron job → 모든 활성 유저 이메일 발송

**코드 예시 (Edge Function):**
```typescript
// supabase/functions/send-weekly-summary/index.ts
Deno.serve(async (req) => {
  // 1. Get all users with weekly_summary_enabled = true
  const users = await supabase
    .from('notification_settings')
    .select('user_id, email')
    .eq('weekly_summary_enabled', true);

  // 2. For each user, calculate stats
  for (const user of users) {
    const stats = await calculateWeeklyStats(user.user_id);
    
    // 3. Send email via Resend
    await resend.emails.send({
      to: user.email,
      subject: '📊 Your Weekly Runway Update',
      html: weeklyEmailTemplate(stats),
    });
  }

  return new Response('OK');
});
```

---

### 기능 3: Trend Graphs (추세 그래프)

#### 배치 위치
**새 탭 추가: Dashboard / 🆕 Trends / Settings**

```
탭 구조:
[Dashboard] [Trends] [Settings]
     ↑         ↑
   현재 상태   시간별 변화
```

**Mobile Navigation:**
```
┌─────────────────────────────┐
│  [≡] Personal Runway        │
└─────────────────────────────┘
    ├─ Dashboard (home)
    ├─ 🆕 Trends
    └─ Settings
```

---

#### UI 컴포넌트: TrendsPage

**Desktop:**
```
┌──────────────────────────────────────────────────────┐
│  📈 Trends                                           │
│                                                       │
│  [Last 3 Months ▼]                     [Export CSV]  │
│                                                       │
│  Runway Over Time                                    │
│  ┌────────────────────────────────────────────────┐  │
│  │ 7mo │                              ╱            │  │
│  │ 6mo │                     ╱───────╱             │  │
│  │ 5mo │           ╱────────╱                      │  │
│  │ 4mo │  ╱───────╱                                │  │
│  │     └────────────────────────────────────────   │  │
│  │      Nov    Dec    Jan    Feb                   │  │
│  └────────────────────────────────────────────────┘  │
│  ↗️ Up 1.8 months from 3 months ago                 │
│                                                       │
│  💰 Savings & Expenses                               │
│  ┌────────────────────────────────────────────────┐  │
│  │      │  ▓▓ Savings  ░░ Expenses                │  │
│  │ $30K │  ▓▓  ░░                                  │  │
│  │ $20K │  ▓▓  ░░  ▓▓  ░░  ▓▓                      │  │
│  │ $10K │  ▓▓  ░░  ▓▓  ░░  ▓▓  ░░                  │  │
│  │      └────────────────────────────────────────   │  │
│  │       Nov   Dec   Jan   Feb                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  🔒 Premium: Category Breakdown (Upgrade)            │
│     - Food, Transport, Bills trends                  │
│     - 12-month view                                  │
│     - Year-over-year comparison                      │
└──────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────────┐
│  📈 Trends                  │
│                             │
│  [Last 3mo ▼]               │
│                             │
│  Runway                     │
│  ┌───────────────────────┐  │
│  │ 7 │          ╱         │  │
│  │ 6 │     ╱───╱          │  │
│  │ 5 │ ╱──╱               │  │
│  │   └───────────────────  │  │
│  │   Nov Dec Jan Feb      │  │
│  └───────────────────────┘  │
│  ↗️ +1.8mo (3mo ago)        │
│                             │
│  Savings & Expenses         │
│  ┌───────────────────────┐  │
│  │ $30K                   │  │
│  │ $20K ▓ ░ ▓ ░ ▓         │  │
│  │ $10K ▓ ░ ▓ ░ ▓ ░       │  │
│  │      Nov Dec Jan Feb   │  │
│  └───────────────────────┘  │
│                             │
│  🔒 More Charts             │
│  [Upgrade] →                │
└─────────────────────────────┘
```

---

#### Tailwind 클래스 (TrendsPage.tsx)

```tsx
// 페이지 컨테이너
className="max-w-6xl mx-auto px-4 py-6 space-y-6"

// 헤더
className="flex items-center justify-between mb-6"

// 제목
className="text-3xl font-bold text-gray-900 dark:text-white 
           flex items-center gap-2"

// 필터 & 액션 버튼 영역
className="flex items-center gap-3"

// Time Range Selector (dropdown)
className="px-4 py-2 bg-white dark:bg-gray-800 border 
           border-gray-300 dark:border-gray-700 rounded-lg 
           font-medium text-gray-700 dark:text-gray-300 
           hover:border-violet-500 transition-colors"

// Export CSV 버튼 (Premium)
className="px-4 py-2 bg-violet-600 hover:bg-violet-700 
           text-white rounded-lg font-medium flex items-center gap-2
           disabled:bg-gray-300 disabled:cursor-not-allowed"

// 차트 카드
className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
           p-6 border border-gray-100 dark:border-gray-700"

// 차트 제목
className="text-xl font-bold text-gray-900 dark:text-white mb-4"

// 차트 컨테이너 (Chart.js canvas)
className="w-full h-64 sm:h-80"

// 인사이트 텍스트 (차트 아래)
className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 
           rounded-lg flex items-center gap-2"

// 인사이트 아이콘 (↗️)
className="text-2xl"

// 인사이트 텍스트
className="text-sm font-medium text-green-700 dark:text-green-400"

// Premium Teaser 카드
className="bg-gradient-to-br from-violet-50 to-purple-50 
           dark:from-violet-900/20 dark:to-purple-900/20 
           rounded-2xl p-6 border-2 border-dashed 
           border-violet-300 dark:border-violet-700"

// Premium 아이콘 & 제목
className="flex items-center gap-2 mb-3"

// 🔒 Emoji
className="text-2xl"

// Premium 텍스트
className="text-lg font-bold text-violet-700 dark:text-violet-400"

// Premium 기능 목록
className="space-y-2 mb-4"

// 각 항목
className="flex items-center gap-2 text-sm text-gray-700 
           dark:text-gray-300"

// Upgrade 버튼
className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 
           to-purple-600 hover:from-violet-700 hover:to-purple-700 
           text-white rounded-xl font-bold text-lg 
           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
           transition-all"
```

---

#### 차트 라이브러리: Chart.js 통합

**설치:**
```bash
npm install chart.js react-chartjs-2
```

**코드 예시:**
```tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb'],
  datasets: [
    {
      label: 'Runway (months)',
      data: [4.2, 5.0, 5.8, 6.1],
      borderColor: 'rgb(139, 92, 246)', // violet-500
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.3, // Smooth curves
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y.toFixed(1)} months`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => `${value}mo`,
      },
    },
  },
};

<Line data={data} options={options} />
```

---

#### 데이터 모델 (Supabase)

```typescript
// 새 테이블: runway_snapshots
interface RunwaySnapshot {
  id: string;
  user_id: string;
  snapshot_date: date;           // Daily snapshot
  runway_months: number;         // 5.8
  total_savings: number;         // $23,200
  monthly_expenses: number;      // $4,000
  monthly_income: number;        // $2,000
  created_at: timestamp;
}

// 스냅샷 생성 로직 (Daily Cron Job)
// 매일 자정 실행 → 모든 활성 유저의 현재 상태 저장
```

**왜 스냅샷 테이블이 필요한가?**
- 현재 데이터만 있으면 과거 추세 모름
- 매일 스냅샷 저장 → 3개월 = 90개 데이터 포인트
- 사용자가 데이터 수정해도 히스토리 보존

---

#### 사용자 플로우: Trends

```
1. Trends 탭 클릭
   └─ 로딩 (스켈레톤 UI)
   └─ 차트 렌더링 (애니메이션: 선이 그려짐)

2. Time Range 변경
   [Last 3 Months ▼] 클릭
   └─ Dropdown:
      • Last 1 Month
      • Last 3 Months ✓
      • Last 6 Months 🔒Premium
      • Last 12 Months 🔒Premium
   └─ "Last 1 Month" 선택
      └─ 차트 업데이트 (transition 애니메이션)

3. Premium Teaser 확인
   └─ "Category Breakdown" 설명 읽음
   └─ [Upgrade to Premium] 클릭
      └─ 가격 페이지

4. Premium 구독 후
   └─ Trends 페이지 재방문
   └─ 모든 차트 활성화
   └─ [Export CSV] 버튼 활성화
      └─ 클릭 → CSV 다운로드
```

---

### 기능 4: Smart Recommendations (스마트 제안)

#### 배치 위치
**Trends 페이지 하단에 추가 (선택적)**

```
Trends Page
  ├─ Runway Chart
  ├─ Savings & Expenses Chart
  └─ 🆕 Insights & Recommendations
```

**또는 Dashboard에 별도 카드:**
```
Dashboard
  ├─ Runway Card
  ├─ Goal Progress
  ├─ 🆕 AI Insights (Premium)
  └─ Expense Tracker
```

---

#### UI 컴포넌트: InsightsCard

**Desktop:**
```
┌──────────────────────────────────────────────────────┐
│  💡 Insights & Recommendations                       │
│                                                       │
│  Based on your data:                                 │
│                                                       │
│  1. 💰 Savings Opportunity                           │
│     Reduce monthly expenses by $500                  │
│     → Runway increases to 7.2 months (+1.2mo)        │
│     [See How →]                                      │
│                                                       │
│  2. 📈 Income Boost                                  │
│     Add $300/month side income                       │
│     → Runway increases to 6.9 months (+0.9mo)        │
│     [Ideas →]                                        │
│                                                       │
│  🔒 Premium: AI-Powered Suggestions                  │
│     - Category-specific savings tips                 │
│     - Personalized action plans                      │
│     - Spending pattern analysis                      │
│     [Upgrade to Unlock]                              │
└──────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────────┐
│  💡 Insights                │
│                             │
│  1. Save $500/mo            │
│     → +1.2mo runway         │
│     [How?]                  │
│                             │
│  2. Earn $300/mo            │
│     → +0.9mo runway         │
│     [Ideas]                 │
│                             │
│  🔒 AI Suggestions          │
│  [Upgrade] →                │
└─────────────────────────────┘
```

---

#### 추천 로직 (규칙 기반 - Free Tier)

```typescript
// Simple rule-based recommendations
function generateRecommendations(userData: FinancialData) {
  const recs: Recommendation[] = [];

  // 1. Expense Reduction Scenario
  const expenseReduction = [100, 200, 500, 1000];
  expenseReduction.forEach(amount => {
    const newRunway = (userData.savings / (userData.monthlyExpenses - amount));
    const increase = newRunway - userData.currentRunway;
    
    if (increase > 0.5) { // Only show if meaningful impact
      recs.push({
        type: 'expense_reduction',
        title: `Reduce monthly expenses by $${amount}`,
        impact: `+${increase.toFixed(1)} months runway`,
        actionable: true,
      });
    }
  });

  // 2. Income Addition Scenario
  const incomeAdditions = [200, 300, 500];
  incomeAdditions.forEach(amount => {
    const newExpenses = userData.monthlyExpenses - amount;
    const newRunway = userData.savings / newExpenses;
    const increase = newRunway - userData.currentRunway;
    
    recs.push({
      type: 'income_addition',
      title: `Add $${amount}/month side income`,
      impact: `+${increase.toFixed(1)} months runway`,
      actionable: true,
    });
  });

  // Sort by impact (highest first)
  return recs.sort((a, b) => parseFloat(b.impact) - parseFloat(a.impact)).slice(0, 3);
}
```

---

#### Premium: AI-Powered (미래 기능)

**OpenAI GPT-4 Turbo 통합:**
```typescript
const prompt = `
Analyze this user's financial data:
- Monthly expenses: $${monthlyExpenses}
- Category breakdown: ${JSON.stringify(categoryBreakdown)}
- Income: $${monthlyIncome}
- Runway: ${runway} months

Provide 3 specific, actionable recommendations to increase runway.
Focus on realistic savings opportunities.
`;

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 500,
});

// Parse and display recommendations
```

**예상 비용:**
- GPT-4 Turbo: $0.01 / 1K tokens
- 추천 1회 = ~1K tokens = $0.01
- 100명 Premium × 주 1회 = $0.04/week = $2/year (무시 가능)

---

#### 사용자 플로우: Recommendations

```
1. Dashboard 또는 Trends 페이지
   └─ InsightsCard 표시

2. Free Tier 추천 확인
   "Reduce $500/mo → +1.2mo"
   └─ [See How →] 클릭
      └─ Modal:
         ┌─────────────────────────────┐
         │  How to Save $500/Month     │
         │                             │
         │  Current Expenses: $4,000   │
         │  Target: $3,500             │
         │                             │
         │  Tips:                      │
         │  • Review subscriptions     │
         │  • Cook at home more        │
         │  • Negotiate bills          │
         │                             │
         │  [Close]                    │
         └─────────────────────────────┘

3. Premium Tier (AI)
   └─ 카테고리별 상세 분석
   └─ "You spent $450 on dining out.
       Reduce to $250 → save $200/mo"
```

---

## 📊 Free vs Premium 기능 요약표

| 기능 | Free | Premium |
|------|------|---------|
| **Goal Setting** | 1개 목표 | 3개 동시 목표 + 히스토리 |
| **Alerts** | 주간 이메일 요약 | 실시간 이메일 + SMS 알림 |
| **Trend Graphs** | 3개월 런웨이 추세 | 12개월 + 카테고리별 + CSV |
| **Recommendations** | 규칙 기반 (2-3개) | AI 맞춤 제안 (미래) |
| **기타** | - | 우선 지원, Early Access |

---

## 🛠️ 개발 우선순위 & 시간 추정

### Phase 1: MVP (2주, 40-50시간)

**Week 1:**
1. ✅ **Goal Setting** (6시간)
   - GoalCard 컴포넌트
   - Goal Modal (설정/수정)
   - Supabase `goals` 테이블
   - 진행률 계산 로직

2. ✅ **Alerts - 주간 이메일** (8시간)
   - NotificationSettings UI
   - Supabase `notification_settings` 테이블
   - Resend 통합
   - Weekly summary 이메일 템플릿
   - Supabase Edge Function + Cron

**Week 2:**
3. ✅ **Trend Graphs - Basic** (8시간)
   - TrendsPage 컴포넌트
   - Chart.js 통합
   - Runway 라인 차트
   - Savings/Expenses 바 차트
   - Supabase `runway_snapshots` 테이블
   - Daily snapshot Cron

4. ✅ **Recommendations - 규칙 기반** (4시간)
   - InsightsCard 컴포넌트
   - 시뮬레이션 로직
   - Modal (상세 설명)

**총 Week 1-2: 26시간 (현실적으로 35-40시간)**

---

### Phase 2: Premium 기능 (1주, 20-25시간)

**Week 3:**
5. ✅ **Alerts - 실시간 (Premium)** (8시간)
   - Twilio SMS 통합
   - 실시간 트리거 로직
   - 커스텀 threshold 설정

6. ✅ **Trend Graphs - 확장** (6시간)
   - 12개월 view
   - 카테고리별 차트
   - CSV Export

7. ✅ **Goal Setting - 다중 목표** (4시간)
   - 3개 동시 목표 UI
   - 우선순위 드래그앤드롭

**총 Week 3: 18시간 (현실적으로 25시간)**

---

### Phase 3: AI Recommendations (미래)

8. ⏸️ **AI-Powered Insights** (12-16시간)
   - OpenAI API 통합
   - Prompt engineering
   - Cost tracking
   - 결과 캐싱 (비용 절약)

**총: 12-16시간 (ROI 불확실, Phase 4로 연기 추천)**

---

## 🎨 Figma 프로토타입 대체: 상세 명세서

### 와이어프레임 (ASCII Art)

#### 1. Dashboard - Before vs After

**Before (현재):**
```
┌─────────────────────────────────────┐
│ 💰 Personal Runway Calculator      │
├─────────────────────────────────────┤
│                                     │
│  Runway: 5.2 months                 │
│  Savings: $23,000                   │
│  Monthly Expense: $4,000            │
│                                     │
├─────────────────────────────────────┤
│ Recent Expenses                     │
│ ...                                 │
├─────────────────────────────────────┤
│ Simulator                           │
│ ...                                 │
└─────────────────────────────────────┘
```

**After (개선):**
```
┌─────────────────────────────────────┐
│ 💰 Personal Runway Calculator      │
│ [Dashboard] [Trends] [Settings]     │
├─────────────────────────────────────┤
│                                     │
│  Runway: 5.2 months                 │
│  Savings: $23,000                   │
│  Monthly Expense: $4,000            │
│                                     │
├─────────────────────────────────────┤
│ 🆕 🎯 Your Goal: 6-Month Runway     │
│  ████████████░░░░░ 87%              │
│  $26,100 / $30,000                  │
│  Need: $3,900 more                  │
│  [Edit Goal]                        │
├─────────────────────────────────────┤
│ 🆕 💡 Insights                      │
│  Reduce $500/mo → +1.2mo runway     │
│  [See How]                          │
├─────────────────────────────────────┤
│ Recent Expenses                     │
│ ...                                 │
└─────────────────────────────────────┘
```

**변화:**
- ✅ Goal Progress 카드 추가 (재방문 동기)
- ✅ Insights 카드 추가 (가치 제공)
- ✅ Trends 탭 추가 (깊이 있는 분석)

---

#### 2. Trends Page (신규)

**Mobile (375px):**
```
┌───────────────────────────────────┐
│ ≡  Personal Runway                │
└───────────────────────────────────┘
┌───────────────────────────────────┐
│ 📈 Trends                         │
│                                   │
│ [Last 3 Months ▼]                 │
│                                   │
│ Runway Over Time                  │
│ ┌─────────────────────────────┐   │
│ │ 7mo │              ╱         │   │
│ │ 6mo │        ╱────╱          │   │
│ │ 5mo │   ╱───╱                │   │
│ │ 4mo │╱──╱                    │   │
│ │     └───────────────────────│   │
│ │     Nov  Dec  Jan  Feb      │   │
│ └─────────────────────────────┘   │
│ ↗️ Up 1.8 months (vs 3mo ago)     │
│                                   │
├───────────────────────────────────┤
│ Savings & Expenses                │
│ ┌─────────────────────────────┐   │
│ │ $30K                        │   │
│ │ $20K  ▓ ░ ▓ ░ ▓             │   │
│ │ $10K  ▓ ░ ▓ ░ ▓ ░           │   │
│ │       Nov Dec Jan Feb       │   │
│ └─────────────────────────────┘   │
│                                   │
├───────────────────────────────────┤
│ 🔒 Premium Features               │
│ • 12-month view                   │
│ • Category breakdown              │
│ • CSV export                      │
│ [Upgrade to Premium]              │
└───────────────────────────────────┘
```

---

#### 3. Settings - Notifications (신규 섹션)

```
┌───────────────────────────────────┐
│ Settings                          │
├───────────────────────────────────┤
│ Theme: [Light] [Dark] [Auto]      │
├───────────────────────────────────┤
│ 🆕 🔔 Notifications                │
│                                   │
│ Weekly Summary                    │
│ [✓] Enabled                       │
│ Every Monday 9:00 AM              │
│                                   │
│ 📧 Email: user@example.com        │
│ [Change Email]                    │
│                                   │
├───────────────────────────────────┤
│ 🔒 Premium Alerts                 │
│ Upgrade to get:                   │
│ • Runway warnings (SMS)           │
│ • Goal celebrations               │
│ • Budget alerts                   │
│ [Upgrade to Premium]              │
└───────────────────────────────────┘
```

---

### 컴포넌트 계층 구조

```
App
├─ Layout
│  ├─ Header
│  │  ├─ Logo
│  │  ├─ Navigation (Dashboard / Trends / Settings)
│  │  └─ ThemeToggle
│  └─ Main
│     ├─ DashboardPage
│     │  ├─ RunwayCard
│     │  ├─ 🆕 GoalCard
│     │  │  ├─ ProgressBar
│     │  │  ├─ GoalStats
│     │  │  └─ GoalModal (conditional)
│     │  ├─ 🆕 InsightsCard
│     │  ├─ ExpenseTracker
│     │  └─ Simulator
│     ├─ 🆕 TrendsPage
│     │  ├─ TimeRangeSelector
│     │  ├─ RunwayChart (Chart.js)
│     │  ├─ SavingsExpensesChart
│     │  └─ PremiumTeaser
│     └─ SettingsPage
│        ├─ ThemeSettings
│        ├─ DataSettings
│        └─ 🆕 NotificationSettings
│           ├─ WeeklySummaryToggle
│           ├─ EmailInput
│           └─ PremiumAlertsTeaser
└─ Footer
```

---

### 상호작용 애니메이션

**1. Goal Progress Bar (진행률 바)**
```tsx
// Tailwind + Framer Motion
<motion.div
  className="bg-gradient-to-r from-violet-500 to-violet-600 h-4 rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 1, ease: "easeOut" }}
/>
```

**2. Chart Rendering (선 그리기 애니메이션)**
```tsx
// Chart.js animation config
animation: {
  duration: 1500,
  easing: 'easeInOutQuart'
}
```

**3. Goal Achieved Celebration**
```tsx
// Confetti animation (react-confetti)
{goalAchieved && (
  <Confetti
    width={width}
    height={height}
    recycle={false}
    numberOfPieces={200}
  />
)}
```

**4. Notification Badge (알림 아이콘)**
```tsx
// Pulse animation
<motion.div
  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ repeat: Infinity, duration: 2 }}
/>
```

---

## 🚀 배포 & 런칭 전략

### Phase 1: Soft Launch (내부 테스트)
**기간:** Week 4  
**대상:** 친구 5명 + 메이님

**목표:**
- 버그 발견
- UX 피드백
- "매일 확인하고 싶은가?" 검증

**체크리스트:**
- [ ] Goal Setting 동작 확인
- [ ] 주간 이메일 수신 확인
- [ ] Trends 차트 렌더링 확인
- [ ] 모바일 반응형 테스트
- [ ] WCAG AA 접근성 검증

---

### Phase 2: Public Beta (Reddit/HN)
**기간:** Week 5-6  
**대상:** r/personalfinance, Hacker News

**포스트 예시:**
> **[Show HN] Personal Runway Calculator — Know How Long You Can Survive**
>
> Hi HN! I built this tool after my friend asked "Is $50K enough to quit my job?"
>
> Key features:
> - 🎯 Set financial goals (e.g., "6-month runway")
> - 📊 Track your progress over time
> - 💡 Get personalized recommendations
> - 🔔 Weekly email summaries (Premium: real-time alerts)
>
> Free tier includes basic features. Premium ($8/mo) adds alerts, 12-month trends, and AI suggestions.
>
> Would love your feedback!
>
> [Try it now →]

**목표:**
- 100 sign-ups
- 10+ 유료 전환 (Trial)
- 피드백 수집

---

### Phase 3: Product Hunt
**기간:** Week 7  
**타이밍:** 화요일/수요일 (트래픽 높음)

**준비물:**
- 스크린샷 (5장)
- Demo 비디오 (1분)
- Maker 스토리
- First Comment (기능 상세 설명)

**목표:**
- Top 5 Product of the Day
- 500+ upvotes
- 300+ sign-ups

---

## 📊 성공 지표 (KPIs)

### 사용자 행동 지표
| 지표 | 현재 (추정) | 목표 (3개월 후) |
|------|-------------|----------------|
| **재방문율 (7일)** | 5% | 20% |
| **주간 활성 사용자** | 10% | 40% |
| **평균 세션 시간** | 2분 | 5분 |
| **Goal 설정률** | 0% | 60% |
| **Trends 탭 방문률** | 0% | 30% |

### 수익 지표
| 지표 | 목표 (Month 3) |
|------|---------------|
| **Trial 시작** | 120명/월 |
| **Trial → Paid** | 18% (22명) |
| **MRR** | $176 |
| **Churn (Monthly)** | <5% |

### 감성 지표 (정성적)
- **NPS (Net Promoter Score):** >30
- **피드백:** "매일 확인한다" 10+ 코멘트
- **리퍼럴:** 자발적 공유 10+ 건

---

## 🎯 최종 요약: 우선순위 3개 기능

### ⭐ Priority 1: Goal Setting
**개발 시간:** 6시간  
**가치:** 재방문 동기 +300%  
**Free:** 1개 목표, Premium: 3개 동시

### ⭐ Priority 2: Alerts (Weekly Email)
**개발 시간:** 8시간  
**가치:** 주간 재참여 +200%  
**Free:** 주간 요약, Premium: 실시간 SMS

### ⭐ Priority 3: Trend Graphs
**개발 시간:** 8시간  
**가치:** 시각적 만족 + 진행률 확인  
**Free:** 3개월, Premium: 12개월 + CSV

**총 개발 시간:** 22시간 (현실적으로 30-35시간, 버퍼 포함)

---

## 📝 다음 단계

### 즉시 실행
1. ✅ 이 문서 검토 (메이님)
2. ⬜ Goal Setting 컴포넌트 개발 시작 (Week 1)
3. ⬜ Resend 계정 생성 (이메일 발송)
4. ⬜ Chart.js 설치 및 테스트

### Week 1 종료 시 점검
- Goal Setting 동작 확인
- 친구 1명 테스트
- 피드백 반영

### Week 2 종료 시 점검
- 주간 이메일 발송 테스트
- Trends 차트 확인
- Soft Launch 준비

---

**문서 작성 완료!** 🎉

이 명세서는 다음을 포함합니다:
- ✅ 페르소나별 니즈 분석
- ✅ 기능 우선순위 (개발 시간 고려)
- ✅ Free vs Premium 명확한 구분
- ✅ 모바일 우선 UI/UX 디자인
- ✅ Tailwind 클래스 포함 상세 명세
- ✅ 사용자 플로우
- ✅ 데이터 모델 (Supabase)
- ✅ 개발 로드맵 (2-3주)
- ✅ 성공 지표

**Figma 프로토타입 대신 → 실무 바로 적용 가능한 개발 명세서**

질문이나 추가 상세 설명이 필요하면 알려주세요!
