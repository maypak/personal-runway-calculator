# Option B 실행 가이드

**작성:** 2026-02-22 00:54 (어메이징메이)  
**목적:** 메이님이 내일 일어나셨을 때 바로 실행 가능하도록 완벽 준비  
**예상 시간:** 10-12시간  
**목표:** 런칭 블로커 제거 + 한국 시장 진입

---

## 🎯 전체 플로우

```
1. FIRE 메시징 (1.5h)
   ↓ (검증: 메시징 일관성)
2. 툴팁 6개 (2-3h) 
   ↓ (검증: 모든 페이지)
3. Runway 가이드 (2h)
   ↓ (검증: 첫 사용자 경험)
4. 한국어 검증 (1.5h)
   ↓ (검증: 전체 페이지)
5. 한국 모니터링 (2-3h)
   ↓ (검증: 로그 확인)
6. 한국 런칭 전략 (1h)
   ✓ (검증: 포스트 초안)
```

**병렬 가능:**
- 5번 (모니터링) & 6번 (전략) 동시 진행 가능
- 1-4번은 순차 (의존성 있음)

---

## 🚀 Phase 1: FIRE 메시징 (1.5h)

### 담당
- **Primary:** Technical Writer
- **Review:** 어메이징메이 (편집증 검증)

### 작업 순서

#### Step 1: README.md 업데이트 (30min)

**파일:** `/Users/claw_may/.openclaw/workspace/personal-runway-calculator/README.md`

**찾기:** (현재 ~Line 96-99)
```markdown
❌ **Not a 30-year retirement calculator**  
Missing: inflation adjustment, Monte Carlo simulation, tax modeling.  
For comprehensive retirement planning, use [FIRECalc](https://firecalc.com) or [cFIREsim](https://cfiresim.com).
```

**교체:**
```markdown
## 🔥 FIRE Calculator - Quick Checks & Coast FIRE

**Perfect for:**
- ✅ Quick FI number calculations (4% rule: "How much do I need to retire?")
- ✅ Coast FIRE math ("Can I stop saving now and let it grow?")
- ✅ 1-2 year FIRE runway modeling ("Am I on track for early retirement?")

**NOT for:**
- ❌ 30-year Monte Carlo simulations with market volatility
- ❌ Inflation adjustment across decades
- ❌ Tax-optimized withdrawal strategies
- ❌ Comprehensive retirement planning

**For serious FIRE planning:** Use [FIRECalc](https://firecalc.com) or [cFIREsim](https://cfiresim.com) for advanced features like Monte Carlo, inflation modeling, and tax optimization.

**Think of us as your "FIRE quick check" tool.** We help you answer "Am I roughly on track?" FIRECalc is your "FIRE comprehensive planner" for detailed 30-year projections.

**Our focus:** 1-2 year runway calculations for variable income earners.
```

**검증:**
- [ ] "NOT a X" 문구 완전 제거
- [ ] "Perfect for" 섹션 명확
- [ ] FIRECalc 추천 유지 (경쟁 아닌 보완)
- [ ] 한국어 번역 일치 여부 체크 필요 (Phase 4에서)

---

#### Step 2: FIRE Calculator UI 메시지 추가 (30min)

**파일:** `/Users/claw_may/.openclaw/workspace/personal-runway-calculator/app/fire/page.tsx`

**위치:** FIRE Calculator 탭 상단 (Dashboard 위)

**추가할 컴포넌트:**
```tsx
<Card className="mb-6 bg-blue-50 border-blue-200">
  <CardContent className="pt-6">
    <div className="flex items-start gap-3">
      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-blue-900 mb-2">
          Quick FIRE Checks & Coast FIRE
        </h3>
        <p className="text-sm text-blue-800 mb-2">
          Perfect for quick FI number estimates (4% rule) and Coast FIRE calculations.
        </p>
        <p className="text-xs text-blue-700">
          For comprehensive 30-year planning with Monte Carlo simulations, we recommend{' '}
          <a href="https://firecalc.com" target="_blank" rel="noopener" className="underline">
            FIRECalc
          </a>.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

**검증:**
- [ ] README 메시징과 100% 일치
- [ ] 링크 작동
- [ ] 모바일 레이아웃 OK

---

#### Step 3: QA 메시징 일관성 감사 (30min)

**Technical Writer 완료 후 즉시 실행**

**체크 항목:**
1. README.md - FIRE 섹션
2. FIRE Calculator UI - 안내 카드
3. FAQ (있다면) - FIRE 관련 질문
4. Landing page - FIRE 언급 여부
5. Meta description - FIRE 키워드

**도구:**
```bash
cd /Users/claw_may/.openclaw/workspace/personal-runway-calculator
grep -r "FIRE" --include="*.md" --include="*.tsx" --include="*.ts" app/ | grep -v node_modules
```

**불일치 발견 시:**
- 즉시 Technical Writer에게 수정 요청
- 모든 FIRE 언급은 "Quick Checks" 또는 "Quick FIRE estimates" 프레이밍

**성공 기준:**
- [ ] 모순 0건
- [ ] 모든 FIRE 언급이 "Quick checks vs serious planning" 구분
- [ ] 사용자가 "있는데 쓰지 말라고?" 느낌 없음

---

## 🚀 Phase 2: 툴팁 6개 (2-3h)

### 담당
- **Primary:** Developer
- **Review:** UX Designer (디자인 일관성)

### 작업 순서

#### Step 1: Tooltip 컴포넌트 생성 (30min)

**파일 생성:** `app/components/ui/InfoTooltip.tsx`

```tsx
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  content: string;
  maxWidth?: string;
}

export function InfoTooltip({ content, maxWidth = '300px' }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-muted-foreground cursor-help inline ml-1" />
        </TooltipTrigger>
        <TooltipContent 
          style={{ maxWidth }}
          className="text-sm max-w-xs"
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

**검증:**
- [ ] Shadcn Tooltip 설치 확인 (`npx shadcn-ui add tooltip`)
- [ ] 모바일 터치 작동 확인

---

#### Step 2: 6개 툴팁 추가 (90min)

**우선순위 순서:**

**1. Coast FIRE** (FIRE Calculator 페이지)
**파일:** `app/fire/page.tsx` or `app/components/FIRE/FIRECalculator.tsx`
**위치:** "Coast FIRE" 레이블 옆
**텍스트:**
```
Coast FIRE = Financial Independence, Retire Early with "coasting"

You stop actively saving for retirement and let your current investments 
grow to reach your FI number by your target retirement age. 

Example: If you have $200K at age 30 and need $1M at 65, you can "coast" 
if that $200K will grow to $1M by 65 (assuming ~7% annual returns).
```

---

**2. Burn Rate** (Dashboard)
**파일:** `app/components/FinanceDashboardSupabase.tsx` 또는 `app/dashboard/page.tsx`
**위치:** "Monthly Burn Rate" 또는 "지출 속도" 옆
**텍스트:**
```
Burn Rate = How fast you're spending money

Your average monthly expenses. Called "burn rate" because it's how quickly 
you're "burning through" your savings.

Lower burn rate = your money lasts longer = longer runway
```

---

**3. FI Number** (FIRE Calculator)
**파일:** `app/fire/page.tsx`
**위치:** "FI Number" 또는"Financial Independence Number" 레이블 옆
**텍스트:**
```
FI Number = Amount needed to retire (4% rule)

Based on the 4% Safe Withdrawal Rule: Multiply your annual expenses by 25.

Example: $40K annual expenses × 25 = $1M FI Number

Once you reach $1M, you can withdraw 4% ($40K) per year indefinitely 
without running out of money (historically safe withdrawal rate).
```

---

**4. Scenario** (Scenario Comparison 페이지)
**파일:** `app/scenarios/page.tsx` or `app/components/ScenarioManager.tsx`
**위치:** "Create Scenario" 버튼 또는 페이지 제목 옆
**텍스트:**
```
Scenario = "What if?" financial simulation

Test different situations: "What if I get a $5K/mo freelance gig?" 
or "What if rent increases to $2.5K?"

Compare scenarios side-by-side to make better financial decisions.
```

---

**5. Phase** (Phase Planning 페이지)
**파일:** `app/phases/page.tsx` 또는 Phase 관련 컴포넌트
**위치:** "Phase Planning" 제목 옆
**텍스트:**
```
Phase = Time period with different expenses

Example sabbatical: 
- Phase 1: "Traveling Europe" (€2.5K/mo, 3 months)
- Phase 2: "Staying in Barcelona" (€1.8K/mo, 2 months)  
- Phase 3: "Job hunting" (€3K/mo, 4 months)

See exactly how long your money lasts across all phases.
```

---

**6. Runway** (Dashboard - 기존 툴팁 강화)
**파일:** `app/components/FinanceDashboardSupabase.tsx`
**위치:** "Runway" 또는 "런웨이" 제목 옆
**텍스트:**
```
Runway = How long your money will last

Like an airplane runway: the distance you can go before you run out.

Your runway = Savings ÷ Monthly burn rate

Example: $30K savings ÷ $3K/mo expenses = 10 months runway

This tells you exactly how long you can survive without income.
```

---

#### Step 3: QA 툴팁 전체 검증 (30min)

**체크리스트:**
- [ ] 모든 6개 툴팁 작동 확인
- [ ] 텍스트 명확성 (초보자가 이해 가능?)
- [ ] 모바일 터치 작동
- [ ] 데스크톱 호버 작동
- [ ] 디자인 일관성 (같은 스타일)
- [ ] 한국어 페이지에서도 표시 (영어 툴팁이라도 OK, Phase 4에서 번역)

**브라우저 테스트:**
```bash
cd /Users/claw_may/.openclaw/workspace/personal-runway-calculator
npm run dev
# Open http://localhost:3000
# 각 페이지 방문 + 툴팁 클릭/호버
```

**스크린샷:**
- 6개 툴팁 각각 스크린샷
- 저장: `screenshots/tooltips/` 폴더

---

## 🚀 Phase 3: Runway 가이드 (2h)

### 담당
- **Primary:** Developer
- **Support:** UX Designer (카드 디자인)

### 작업 순서

#### Step 1: NewUserGuide 컴포넌트 생성 (60min)

**파일 생성:** `app/components/ui/NewUserGuide.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function NewUserGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen this before
    const hasSeenGuide = localStorage.getItem('hasSeenRunwayGuide');
    if (!hasSeenGuide) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hasSeenRunwayGuide', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Lightbulb className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Welcome! Here's how to calculate your runway:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 mr-2">1.</span>
                  <span>
                    <strong>Enter your savings</strong> - How much money do you have now?
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 mr-2">2.</span>
                  <span>
                    <strong>Add your expenses</strong> - How much do you spend per month?
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 mr-2">3.</span>
                  <span>
                    <strong>See your runway</strong> - We'll show exactly how long your money lasts!
                  </span>
                </li>
              </ol>
              <p className="text-xs text-gray-600 mt-3">
                💡 <strong>Tip:</strong> Hover over any term with an info icon (ⓘ) for explanations.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

#### Step 2: Dashboard에 통합 (30min)

**파일 수정:** `app/dashboard/page.tsx` 또는 `app/components/FinanceDashboardSupabase.tsx`

**추가 위치:** Dashboard 최상단 (타이틀 아래, 메트릭 카드 위)

```tsx
import { NewUserGuide } from '@/components/ui/NewUserGuide';

// ... existing code

return (
  <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    
    {/* Add this */}
    <NewUserGuide />
    
    {/* Existing dashboard content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* ... metrics cards */}
    </div>
  </div>
);
```

---

#### Step 3: QA 첫 사용자 경험 테스트 (30min)

**테스트 시나리오:**

1. **Fresh 브라우저 (시크릿 모드)**
   ```bash
   # Chrome incognito
   open -na "Google Chrome" --args --incognito http://localhost:3000
   ```

2. **회원가입 → Dashboard 도착**
   - [ ] NewUserGuide 카드 보임?
   - [ ] 3단계 설명 명확?
   - [ ] X 버튼 작동?
   - [ ] 다시 로그인 시 안 보임? (localStorage 체크)

3. **모바일 테스트**
   - [ ] 반응형 레이아웃 OK
   - [ ] 텍스트 가독성
   - [ ] X 버튼 터치 크기 충분

**스크린샷:**
- Desktop: NewUserGuide 전체
- Mobile: NewUserGuide 전체
- 저장: `screenshots/onboarding/`

---

## 🚀 Phase 4: 한국어 검증 (1.5h)

### 담당
- **Primary:** QA
- **Support:** 어메이징메이 (한국어 네이티브 체크)

### 작업 순서

#### Step 1: 언어 전환 & 전체 페이지 순회 (60min)

**준비:**
```bash
cd /Users/claw_may/.openclaw/workspace/personal-runway-calculator
npm run dev
```

**브라우저:**
1. Settings → Language → 한국어 선택
2. 모든 페이지 순회:
   - Dashboard
   - FIRE Calculator
   - Scenario Comparison
   - Phase Planning
   - Settings
   - About/FAQ (있다면)

**체크 항목:**
```markdown
### Dashboard
- [ ] "런웨이" 올바른 번역?
- [ ] "지출 속도" (Burn Rate) 자연스러움?
- [ ] 숫자 포맷 (천 단위 구분자)?
- [ ] 날짜 포맷 (YYYY-MM-DD vs MM/DD/YYYY)?

### FIRE Calculator
- [ ] "경제적 자유" 또는 "FIRE" 어느 쪽?
- [ ] "Coast FIRE" 번역? (영어 그대로 vs 번역?)
- [ ] "4% 룰" 자연스러움?
- [ ] Phase 2 추가된 메시지 번역됨?

### Scenarios
- [ ] "시나리오" vs "상황" 어느 쪽?
- [ ] "비교" 버튼
- [ ] 테이블 헤더

### Phases
- [ ] "단계" vs "기간" 용어 일관성?
- [ ] Phase 설명

### Settings
- [ ] 모든 설정 항목 번역
- [ ] 언어 선택 UI

### 공통
- [ ] 영어 섞임 없음?
- [ ] 오타 없음?
- [ ] 띄어쓰기 자연스러움?
- [ ] 존댓말 일관성?
```

---

#### Step 2: 스크린샷 전체 세트 (20min)

**필수 스크린샷 (한국어 모드):**
1. `dashboard-ko.png`
2. `fire-calculator-ko.png`
3. `scenarios-ko.png`
4. `phases-ko.png`
5. `settings-ko.png`
6. `new-user-guide-ko.png` (Phase 3 가이드 카드)

**저장 위치:** `screenshots/korean-i18n/`

---

#### Step 3: 이슈 리스트 작성 (10min)

**발견된 이슈 기록:**

**파일 생성:** `korean-i18n-issues.md`

```markdown
# 한국어 i18n 이슈 (2026-02-22)

## P0 (즉시 수정 필요)
- [ ] Dashboard: "Burn rate" → "지출 속도" 번역 누락 (Line 42)
- [ ] ...

## P1 (나중에 수정)
- [ ] FIRE: "Coast FIRE" 번역 vs 영어 그대로? (토론 필요)
- [ ] ...

## 확인된 OK 항목
- ✅ Dashboard 런웨이 숫자 포맷 정상
- ✅ ...
```

**P0 이슈 있으면:**
- Technical Writer 즉시 수정 요청
- 10-30분 추가 소요

---

## 🚀 Phase 5: 한국 모니터링 (2-3h)

### 담당
- **Primary:** DevOps
- **Review:** 어메이징메이 (설정 검증)

### 작업 순서

#### Step 1: Vercel Analytics locale 태그 (60min)

**파일 수정:** `app/layout.tsx`

**현재 Vercel Analytics:**
```tsx
import { Analytics } from '@vercel/analytics/react';

// ...
return (
  <html>
    <body>
      {children}
      <Analytics />
    </body>
  </html>
);
```

**추가할 커스텀 속성:**
```tsx
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

// Locale detection
function getLocale() {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('language') || navigator.language || 'en';
}

export default function RootLayout({ children }) {
  const locale = getLocale();
  
  useEffect(() => {
    // Send locale to Vercel Analytics
    if (window.va) {
      window.va('event', 'locale_detected', { locale });
    }
  }, [locale]);

  return (
    <html lang={locale}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**검증:**
```bash
# Deploy to Vercel
git add .
git commit -m "feat: Add locale tracking to Vercel Analytics"
git push origin main

# Wait for deployment
# Check Vercel Analytics dashboard
# Event: "locale_detected" with locale property
```

---

#### Step 2: 온보딩 완료율 퍼널 (60min)

**목표:** 추적 이벤트
1. Signup → Dashboard 도착
2. Dashboard → Savings 입력
3. Savings → Expenses 입력
4. Expenses → Runway 확인

**구현:**

**파일 생성:** `lib/analytics.ts`

```typescript
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', eventName, properties);
  }
}

export function trackOnboardingStep(step: string) {
  trackEvent('onboarding_step', { step });
}
```

**파일 수정:** 각 컴포넌트에 추가

**Dashboard.tsx:**
```tsx
import { trackOnboardingStep } from '@/lib/analytics';

useEffect(() => {
  trackOnboardingStep('dashboard_arrived');
}, []);
```

**Savings Input:**
```tsx
const handleSavingsSubmit = () => {
  trackOnboardingStep('savings_entered');
  // ... existing logic
};
```

**Expenses Input:**
```tsx
const handleExpenseAdd = () => {
  trackOnboardingStep('expense_added');
  // ... existing logic
};
```

**Runway Display:**
```tsx
useEffect(() => {
  if (runwayMonths > 0) {
    trackOnboardingStep('runway_calculated');
  }
}, [runwayMonths]);
```

**검증:**
- 회원가입 → 각 단계 진행
- Vercel Analytics에서 이벤트 확인
- 퍼널 계산: (runway_calculated / dashboard_arrived) * 100%

---

#### Step 3: 에러 로깅에 locale 추가 (30min)

**Sentry 또는 에러 핸들러 수정:**

**파일:** `lib/error-handler.ts` (또는 유사)

```typescript
export function logError(error: Error, context?: Record<string, any>) {
  const locale = getLocale();
  
  console.error('Error:', error, {
    ...context,
    locale,
    timestamp: new Date().toISOString(),
  });
  
  // Send to Sentry/logging service
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      extra: { ...context, locale },
    });
  }
}
```

**사용 예:**
```tsx
try {
  // ... risky operation
} catch (error) {
  logError(error as Error, { component: 'Dashboard' });
}
```

---

## 🚀 Phase 6: 한국 런칭 전략 (1h)

### 담당
- **Primary:** Product Strategist
- **Review:** 어메이징메이 (한국어 교정)

### 작업 순서

#### Step 1: FIRE Korea 카페 포스트 초안 (45min)

**파일 생성:** `korean-market-launch.md`

```markdown
# FIRE Korea 카페 런칭 포스트 초안

## 제목 옵션 3가지

**Option A (직접적):**
"변동 소득 전용 런웨이 계산기 - 프리랜서/창업자를 위한 무료 도구"

**Option B (공감대):**
"프리랜서 런웨이 얼마나 남았는지 계산해보셨나요? (무료 도구)"

**Option C (FIRE 타겟):**
"FIRE 준비 중이신 분들, 런웨이 계산 자동화 도구 (무료)"

---

## 본문 (1,000자 이내)

안녕하세요!

10년 넘게 개발자로 일하다가 퇴사 후 프리랜서로 전환한 메이입니다.

퇴사할 때 가장 두려웠던 게 **"돈이 얼마나 버틸까?"**였어요.
엑셀로 계산해봤지만, 프리랜서 특성상 수입이 매달 달라서 계산이 너무 복잡했습니다.

그래서 만들었습니다: **Personal Runway Calculator**

### 🎯 이런 분께 딱 맞아요

- ✅ 프리랜서 (매달 수입 다름)
- ✅ 사이드 프로젝트/창업 준비 중
- ✅ 안식년/sabbatical 계획 중
- ✅ FIRE 준비하며 런웨이 추적

### 💡 주요 기능

1. **변동 소득 지원** - 매달 다른 수입 입력 가능
2. **시나리오 비교** - "프리랜서 vs 취업" 비교
3. **단계별 계획** - "여행 3개월 → 부트캠프 4개월" 단계별 지출 모델링
4. **FIRE 계산기** - 4% 룰 기반 FI Number + Coast FIRE
5. **한국어 완벽 지원** - UI/용어 모두 한국어

### 🇰🇷 한국 시장 특별 고려사항

- 원화(₩) 기본 지원
- 한국 프리랜서 시장 특성 반영
- FIRE Korea 커뮤니티 피드백 적극 반영 예정

### 🆓 완전 무료

- 가입만 하면 모든 기능 사용 가능
- 광고 없음
- 개인정보 최소 수집 (이메일만)

### 🔗 링크

https://personal-runway-calculator.vercel.app

---

**피드백 환영합니다!**

이 도구가 FIRE Korea 커뮤니티에 도움이 되었으면 좋겠습니다.
사용해보시고 개선점 있으면 편하게 댓글 남겨주세요!

감사합니다 🙏

---

**FAQ 미리 준비:**

Q: 수익화 계획은?  
A: 당분간 무료. 나중에 프리미엄 기능 추가 시 freemium (기본 기능 영구 무료)

Q: 데이터 보안은?  
A: Supabase RLS (Row Level Security) 적용. 본인 데이터만 접근 가능.

Q: 모바일 앱 있나요?  
A: 웹앱이지만 모바일 브라우저에서 완벽 작동. PWA 지원 예정.

Q: YNAB/Mint와 다른 점?  
A: 우리는 "런웨이 계산" 전문. 예산 관리는 YNAB이 더 좋음. 보완 관계.
```

---

#### Step 2: 런칭 타이밍 전략 (15min)

**파일:** `korean-market-launch.md` (계속)

```markdown
## 런칭 타이밍 전략

### Option A: 즉시 (월요일 오전)
- **장점:** 빠른 초기 유저 확보
- **단점:** 버그 있으면 첫인상 나쁨
- **추천:** P0 이슈 0건일 때만

### Option B: 1주일 후 (다음 월요일)
- **장점:** 충분한 QA, 초기 유저 피드백 반영
- **단점:** 한국 시장 진입 1주 지연
- **추천:** 안전 우선

### Option C: 2주 후 (Soft Launch)
- **장점:** 베타 테스터 5-10명 먼저 모집 → 피드백 → 공개
- **단점:** 가장 느림
- **추천:** 품질 극대화

**제안:** Option A (월요일 즉시)
- 이유: 이미 70% 베타 통과, P0 수정만 하면 충분
- 리스크 완화: "베타" 명시, 피드백 적극 수용 자세
```

---

## ✅ 최종 검증 체크리스트

### Phase 1: FIRE 메시징
- [ ] README.md 업데이트 완료
- [ ] FIRE Calculator UI 메시지 추가
- [ ] 메시징 일관성 100%
- [ ] 한국어 번역 일치

### Phase 2: 툴팁
- [ ] 6개 툴팁 모두 작동
- [ ] 텍스트 명확성 확인
- [ ] 모바일/데스크톱 OK
- [ ] 스크린샷 6장

### Phase 3: Runway 가이드
- [ ] NewUserGuide 컴포넌트 생성
- [ ] Dashboard 통합
- [ ] LocalStorage 작동
- [ ] 첫 사용자 경험 테스트

### Phase 4: 한국어 검증
- [ ] 전체 페이지 한국어 확인
- [ ] 스크린샷 6장
- [ ] P0 이슈 0건
- [ ] P1 이슈 문서화

### Phase 5: 모니터링
- [ ] Locale 태그 추가
- [ ] 온보딩 퍼널 이벤트
- [ ] 에러 로깅 locale 포함
- [ ] Vercel Analytics 확인

### Phase 6: 런칭 전략
- [ ] 포스트 초안 작성
- [ ] FAQ 준비
- [ ] 타이밍 결정

---

## 🚨 블로커 발견 시 프로토콜

**즉시 중단 조건:**
- Git push 실패 (원격 설정 문제)
- Vercel 배포 실패 (빌드 에러)
- 한국어 번역 50% 이상 누락

**블로커 발견 시:**
1. 진행 중단
2. 메이님께 즉시 보고
3. 해결 방법 제안
4. 승인 후 재개

---

## 📊 예상 결과 (Option B 완료 후)

**베타 점수:**
- 초보자: 3.5 → 4.5-5/7 (+1.0-1.5)
- FIRE: 1-5.5 → 2-6.5/7 (+0.5-1.0)
- 평균: 2.5 → 4.5-5.5/7 (+2.0-3.0)

**한국 시장:**
- 준비도: 100%
- 타겟: FIRE Korea 카페 2만명
- 예상: 500명 @ 2.5% = ₩5M/월

**런칭 준비도:**
- 현재: 90%
- 완료 후: **100%** ✅

---

**작성 완료: 2026-02-22 00:54**  
**준비 상태: READY**  
**실행 대기: 메이님 지시**
