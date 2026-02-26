# 베타 테스트 - 구현 가이드 (최지민 피드백 기반)

**기반:** 최지민 베타 테스트 피드백  
**날짜:** 2026-02-23  
**우선순위:** P0 → P1 → P2

---

## 🚀 P0 - 즉시 개선 (1일 내)

### 1. 숫자 키패드 자동 열림

**문제:**
- 모바일에서 숫자 입력 시 키패드가 일반 텍스트 모드로 열림
- 사용자가 수동으로 숫자 키패드로 전환해야 함

**해결책:**

```tsx
// Step2Assets.tsx, Step3Expenses.tsx
<input
  type="text"
  inputMode="numeric"  // ✅ 추가
  pattern="[0-9]*"     // ✅ 추가 (iOS 최적화)
  value={inputValue}
  onChange={handleInputChange}
  placeholder="3800000"
  className="..."
/>
```

**적용 파일:**
- `app/components/Onboarding/Step2Assets.tsx` (line ~37)
- `app/components/Onboarding/Step3Expenses.tsx` (line ~58, ~100)

---

### 2. 천단위 구분 표시

**문제:**
- "3800000" → 읽기 어려움
- "₩3,800,000" → 명확함

**해결책 A: 입력 중 실시간 포맷팅**

```tsx
// lib/utils/formatters.ts (새 파일 생성)
export function formatNumberInput(value: string): string {
  // Remove non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '');
  
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parseFormattedNumber(formatted: string): number {
  return parseInt(formatted.replace(/,/g, '')) || 0;
}
```

**Step2Assets.tsx 수정:**

```tsx
const [inputValue, setInputValue] = useState(
  formatNumberInput(balance.toString())
);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value.replace(/[^0-9]/g, '');
  const formatted = formatNumberInput(rawValue);
  setInputValue(formatted);
  onBalanceChange(parseInt(rawValue) || 0);
};

// Placeholder도 포맷팅
placeholder="3,800,000"
```

**해결책 B: 프리셋 버튼 (더 편함!)**

```tsx
// Step2Assets.tsx에 추가
const presets = [
  { label: '₩100만', value: 1_000_000 },
  { label: '₩300만', value: 3_000_000 },
  { label: '₩500만', value: 5_000_000 },
  { label: '₩1,000만', value: 10_000_000 },
];

<div className="grid grid-cols-2 gap-2 mb-4">
  {presets.map(({ label, value }) => (
    <button
      key={value}
      onClick={() => {
        setInputValue(value.toString());
        onBalanceChange(value);
      }}
      className="
        min-h-[44px] px-4 py-2 
        bg-gray-100 hover:bg-orange-100 
        border border-gray-300 rounded-lg 
        text-sm font-medium
        transition-all
      "
    >
      {label}
    </button>
  ))}
</div>
```

---

## 🎯 P1 - 1주일 내

### 1. SNS 공유 버튼

**목표:**
- 카카오톡, 인스타, 트위터 공유 버튼 추가
- 바이럴 가능성 극대화

**Step 1: 카카오톡 공유**

```tsx
// lib/share/kakao.ts (새 파일)
declare global {
  interface Window {
    Kakao: any;
  }
}

export function initKakao() {
  if (typeof window !== 'undefined' && !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
  }
}

export function shareToKakao(runway: number, balance: number, expenses: number) {
  if (!window.Kakao) {
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }
  
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `💸 나의 재정 런웨이: ${runway.toFixed(1)}개월`,
      description: '취준 중인데 런웨이 계산해봤어요! 여러분도 해보세요 🤔',
      imageUrl: 'https://your-domain.com/og-image.png',
      link: {
        mobileWebUrl: 'https://your-domain.com',
        webUrl: 'https://your-domain.com',
      },
    },
    buttons: [
      {
        title: '나도 계산하기',
        link: {
          mobileWebUrl: 'https://your-domain.com/onboarding',
          webUrl: 'https://your-domain.com/onboarding',
        },
      },
    ],
  });
}
```

**app/layout.tsx에 Kakao SDK 추가:**

```tsx
<Script
  src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
  integrity="sha384-l+xbElFSnPZ2rOaPrU//2FF5B4LB8FiX5q4fXYTlfcG4PGpMkE1vcL7kNXI6Cci0"
  crossOrigin="anonymous"
  onLoad={() => {
    if (window.Kakao) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }
  }}
/>
```

**RunwayDisplay.tsx에 공유 버튼 추가:**

```tsx
import { shareToKakao } from '../../lib/share/kakao';

// ...

<div className="flex gap-2 mt-4">
  <button
    onClick={() => shareToKakao(runway, balance, monthlyExpenses)}
    className="
      flex-1 min-h-[44px] px-4 py-2 
      bg-[#FEE500] hover:bg-[#FADA0A] 
      text-[#3C1E1E] font-semibold 
      rounded-lg transition-all
      flex items-center justify-center gap-2
    "
  >
    <span>💬</span>
    <span>카톡 공유</span>
  </button>
  
  <button
    onClick={() => {
      const url = `${window.location.origin}/onboarding`;
      navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다!');
    }}
    className="
      flex-1 min-h-[44px] px-4 py-2 
      bg-gray-100 hover:bg-gray-200 
      text-gray-700 font-semibold 
      rounded-lg transition-all
      flex items-center justify-center gap-2
    "
  >
    <span>🔗</span>
    <span>링크 복사</span>
  </button>
</div>
```

---

### 2. 행동 계획 가이드

**목표:**
- "3.2개월"을 보고 나서 뭘 해야 할지 명확히 제시

```tsx
// components/ActionPlan.tsx (새 파일)
interface ActionPlanProps {
  runway: number;
  balance: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}

export default function ActionPlan({
  runway,
  balance,
  monthlyExpenses,
  monthlyIncome,
}: ActionPlanProps) {
  // 런웨이별 맞춤 조언
  const getActionItems = () => {
    if (runway < 3) {
      return [
        {
          emoji: '🚨',
          title: '긴급 행동 필요',
          items: [
            '즉시 수입 창출 방안 찾기 (알바, 프리랜서)',
            '불필요한 지출 즉시 중단',
            '가족/친구 도움 요청 고려',
          ],
        },
      ];
    }
    
    if (runway < 6) {
      return [
        {
          emoji: '📋',
          title: '계획적 행동',
          items: [
            '추가 수입원 찾기 (월 50만원 목표)',
            '지출 10-20% 줄이기',
            '비상 예산 수립',
          ],
        },
      ];
    }
    
    return [
      {
        emoji: '🎯',
        title: '장기 계획',
        items: [
          '런웨이 12개월 목표 설정',
          '투자 계획 수립',
          '재정 자동화 시스템 구축',
        ],
      },
    ];
  };
  
  const actionItems = getActionItems();
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🎯</span>
        <span>다음 할 일</span>
      </h3>
      
      {actionItems.map((section, idx) => (
        <div key={idx} className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>{section.emoji}</span>
            <span>{section.title}</span>
          </h4>
          
          <ul className="space-y-2">
            {section.items.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className="flex items-start gap-2 text-gray-700"
              >
                <span className="text-orange-500 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

**RunwayDashboard.tsx에 추가:**

```tsx
import ActionPlan from './ActionPlan';

// ...

<ActionPlan
  runway={runway}
  balance={basicData.balance}
  monthlyExpenses={basicData.monthlyExpenses}
  monthlyIncome={basicData.monthlyIncome || 0}
/>
```

---

### 3. What-if 시나리오

**목표:**
- "알바 월 50만원 벌면?" 같은 시나리오 즉시 계산

```tsx
// components/WhatIfScenarios.tsx (새 파일)
interface Scenario {
  label: string;
  type: 'income' | 'expense';
  delta: number;
  emoji: string;
}

const scenarios: Scenario[] = [
  {
    label: '알바 월 50만원',
    type: 'income',
    delta: 500_000,
    emoji: '💼',
  },
  {
    label: '카페값 월 10만원 절약',
    type: 'expense',
    delta: -100_000,
    emoji: '☕',
  },
  {
    label: '부모님 도움 월 50만원',
    type: 'income',
    delta: 500_000,
    emoji: '👨‍👩‍👧',
  },
  {
    label: '월세 20% 감소',
    type: 'expense',
    delta: -200_000,
    emoji: '🏠',
  },
];

export default function WhatIfScenarios({
  balance,
  monthlyExpenses,
  monthlyIncome,
}: {
  balance: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}) {
  const calculateScenario = (scenario: Scenario) => {
    const newIncome = scenario.type === 'income' 
      ? monthlyIncome + scenario.delta 
      : monthlyIncome;
    const newExpenses = scenario.type === 'expense'
      ? monthlyExpenses + scenario.delta
      : monthlyExpenses;
    
    return calculateRunway(balance, newExpenses, newIncome);
  };
  
  const baseRunway = calculateRunway(balance, monthlyExpenses, monthlyIncome);
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md border border-blue-200 mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🤔</span>
        <span>What-if 시나리오</span>
      </h3>
      
      <div className="space-y-3">
        {scenarios.map((scenario, idx) => {
          const newRunway = calculateScenario(scenario);
          const diff = newRunway - baseRunway;
          
          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{scenario.emoji}</span>
                  <span className="font-medium text-gray-800">
                    {scenario.label}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    {formatRunwayMonths(newRunway)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{diff.toFixed(1)}개월
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 📝 P2 - 2주일 내

### 1. 친구들과 비교 (익명)

**구현 개요:**
- 익명 데이터 수집 (동의 하에)
- 나이대/직업별 평균 런웨이 표시

```tsx
// lib/analytics/anonymous.ts
export async function submitAnonymousData(data: {
  ageGroup: '20-25' | '26-30' | '31-35';
  occupation: 'student' | 'job-seeker' | 'freelancer' | 'employed';
  runway: number;
}) {
  // Supabase 또는 Firebase에 익명 저장
  await fetch('/api/analytics/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAverageRunway(filter: {
  ageGroup?: string;
  occupation?: string;
}) {
  const response = await fetch('/api/analytics/average', {
    method: 'POST',
    body: JSON.stringify(filter),
  });
  return response.json();
}
```

---

### 2. 위로 메시지 더 추가

**현재:**
- "숨 쉴 여유가 있습니다. 지금이 계획을 세울 때입니다."

**개선:**

```ts
// lib/calculations/runway.ts
export function getRunwayMessage(
  runwayMonths: number,
  locale: string = 'ko'
): string {
  const messages = {
    ko: {
      critical: [
        '숫자를 보는 것이 두려울 수 있습니다. 하지만 지금이 변화의 시작입니다.',
        '3개월도 충분한 시간입니다. 친구들도 비슷할 거예요.',
        '알바 한 달만 하면 4개월 이상으로 늘어나요!',
      ],
      warning: [
        '숨 쉴 여유가 있습니다. 지금이 계획을 세울 때입니다.',
        '3-6개월이면 안정적인 준비 기간이에요.',
        '지출 10%만 줄여도 런웨이가 크게 늘어나요!',
      ],
      // ...
    },
  };
  
  const langMessages = messages[locale as keyof typeof messages] || messages.en;
  const { category } = getRunwayColor(runwayMonths);
  const categoryMessages = langMessages[category];
  
  // 랜덤 선택
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}
```

---

### 3. 다크모드

```tsx
// app/layout.tsx에 next-themes 추가
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// components/ThemeToggle.tsx
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
```

---

## 🧪 테스트 체크리스트

### P0 구현 후 테스트

- [ ] iPhone 12 (375px)에서 숫자 키패드 자동 열림 확인
- [ ] Android에서도 동일하게 작동하는지 확인
- [ ] 천단위 구분이 실시간으로 표시되는지 확인
- [ ] 프리셋 버튼 클릭 시 값 정상 입력되는지 확인

### P1 구현 후 테스트

- [ ] 카카오톡 공유 버튼 클릭 시 정상 작동
- [ ] 공유 링크가 올바른 URL인지 확인
- [ ] 행동 계획이 런웨이별로 다르게 표시되는지 확인
- [ ] What-if 시나리오 계산이 정확한지 확인

### P2 구현 후 테스트

- [ ] 익명 데이터가 올바르게 저장되는지 확인
- [ ] 평균 런웨이 표시가 정확한지 확인
- [ ] 다크모드 전환이 부드러운지 확인

---

## 📊 예상 임팩트

### P0 구현 시
- **사용성 점수:** 8/10 → **9/10** (+1)
- **모바일 경험 크게 개선**

### P1 구현 시
- **바이럴 가능성:** 낮음 → **높음**
- **재사용 의향:** Maybe → **Yes**
- **도움됨 점수:** 7/10 → **9/10** (+2)

### P2 구현 시
- **디자인 점수:** 9/10 → **10/10** (+1)
- **전체 만족도:** 8/10 → **9.5/10** (+1.5)

---

**작성자:** Subagent (QA)  
**날짜:** 2026-02-23  
**업데이트:** 필요 시 지속 업데이트
