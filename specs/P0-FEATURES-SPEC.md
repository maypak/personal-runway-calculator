# P0 Features Specification

**Date:** 2026-02-26  
**Target:** 7.3/10 → 9/10 satisfaction  
**Source:** 최준호(창업가) 베타 피드백  
**Total time:** 9 hours

---

## 1. 시나리오 비교 기능 (4h)

### Problem
창업가의 핵심 니즈: **"What-if" 질문**
- "지출 20% 줄이면 얼마나 더 버틸까?"
- "최악의 경우 런웨이는?"
- "브릿지 펀딩 받으면?"

현재: 단일 숫자만 제공 (5.6개월)  
필요: 여러 시나리오 동시 비교

### User Story
```
AS A 창업가
I WANT TO 여러 시나리오를 동시에 비교하고 싶다
SO THAT 의사결정에 필요한 데이터를 한눈에 볼 수 있다
```

### UI Design
```
📊 시나리오 비교

┌────────────────────────────────────┐
│ 현재 (₩4,500,000)     → 5.6개월 🟡 │
│ 절약 -10%             → 6.2개월 ✅ │
│ 절약 -20%             → 6.9개월 🎯 │
│ 최악 +20%             → 4.6개월 🔴 │
│ 브릿지 펀딩 +₩10M     → 7.8개월 💎 │
└────────────────────────────────────┘

[+ 커스텀 시나리오 추가]
```

### Component Structure
```tsx
// app/components/ScenarioComparison.tsx (NEW)
interface ScenarioComparisonProps {
  balance: number;
  monthlyExpenses: number;
  scenarios?: Scenario[];
}

interface Scenario {
  name: string;
  type: 'expense_adjustment' | 'balance_increase';
  value: number; // -0.2 for -20%, +10000000 for +10M
  icon?: string;
}

const defaultScenarios: Scenario[] = [
  { name: '현재', type: 'expense_adjustment', value: 0, icon: '🟡' },
  { name: '절약 -10%', type: 'expense_adjustment', value: -0.1, icon: '✅' },
  { name: '절약 -20%', type: 'expense_adjustment', value: -0.2, icon: '🎯' },
  { name: '최악 +20%', type: 'expense_adjustment', value: 0.2, icon: '🔴' },
];
```

### Calculation Logic
```typescript
// lib/calculations/runway.ts (UPDATE)
export function calculateScenario(
  balance: number,
  monthlyExpenses: number,
  scenario: Scenario
): ScenarioResult {
  let adjustedBalance = balance;
  let adjustedExpenses = monthlyExpenses;

  if (scenario.type === 'expense_adjustment') {
    adjustedExpenses = monthlyExpenses * (1 + scenario.value);
  } else if (scenario.type === 'balance_increase') {
    adjustedBalance = balance + scenario.value;
  }

  const months = adjustedBalance / adjustedExpenses;
  const endDate = addMonths(new Date(), months);

  return {
    name: scenario.name,
    months: parseFloat(months.toFixed(1)),
    endDate,
    balance: adjustedBalance,
    monthlyExpenses: adjustedExpenses,
    icon: scenario.icon,
    status: months >= 6 ? 'safe' : months >= 4 ? 'warning' : 'danger',
  };
}
```

### Integration Point
```tsx
// app/dashboard/page.tsx (UPDATE)
import ScenarioComparison from '@/components/ScenarioComparison';

export default function DashboardPage() {
  const { balance, monthlyExpenses } = useRunwayStore();

  return (
    <div>
      {/* Existing runway display */}
      <RunwayDisplay />

      {/* NEW: Scenario comparison */}
      <ScenarioComparison
        balance={balance}
        monthlyExpenses={monthlyExpenses}
      />
    </div>
  );
}
```

### Acceptance Criteria
- [ ] 최소 4개 시나리오 동시 표시
- [ ] 각 시나리오마다 런웨이(개월), 종료일, 상태 아이콘
- [ ] 모바일 반응형 (320px+)
- [ ] 한국어 + 영어 i18n
- [ ] 커스텀 시나리오 추가 가능 (선택)

### Testing
```typescript
// tests/scenario-comparison.spec.ts
test('should calculate scenario correctly', () => {
  const result = calculateScenario(25000000, 4500000, {
    name: '절약 -20%',
    type: 'expense_adjustment',
    value: -0.2,
  });
  
  expect(result.months).toBe(6.9); // 25M / (4.5M * 0.8) = 6.94
  expect(result.status).toBe('safe');
});
```

---

## 2. 목표 설정 & 역산 (3h)

### Problem
창업가는 **목표일**이 있음:
- "6개월 후 투자 유치"
- "3개월 후 계약 마감"
- "12개월 후 브레이크이븐"

현재: 런웨이만 표시 (5.6개월)  
필요: 목표와 비교 + 부족하면 액션 제안

### User Story
```
AS A 창업가
I WANT TO 목표일을 설정하고 현재 런웨이와 비교하고 싶다
SO THAT 목표 달성 가능 여부와 필요한 조치를 알 수 있다
```

### UI Design
```
🎯 목표 설정
┌──────────────────────────────────────┐
│ 투자 유치 목표일                      │
│ [______] 개월 후  또는  [날짜 선택]   │
│                                      │
│ 현재 상황: ⚠️ 타이트                  │
│ • 남은 런웨이: 5.6개월                │
│ • 목표까지: 6.0개월                   │
│ • 차이: -0.4개월 (부족)               │
│                                      │
│ 💡 목표 달성을 위한 제안:             │
│ ✅ 지출 8% 절감 (₩360K) → 목표 달성  │
│ ✅ 브릿지 펀딩 ₩5M → 안전권 진입      │
└──────────────────────────────────────┘
```

### Component Structure
```tsx
// app/components/GoalSetting.tsx (NEW)
interface GoalSettingProps {
  currentRunway: number;
  balance: number;
  monthlyExpenses: number;
}

interface GoalAnalysis {
  targetMonths: number;
  currentMonths: number;
  gap: number; // negative = 부족
  status: 'safe' | 'tight' | 'danger';
  suggestions: Suggestion[];
}

interface Suggestion {
  type: 'reduce_expense' | 'increase_balance';
  description: string;
  value: number;
  icon: string;
}
```

### Calculation Logic
```typescript
// lib/calculations/goal.ts (NEW)
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
    const neededExpenseReduction = Math.abs(gap) / targetMonths;
    const neededFunding = Math.abs(gap) * monthlyExpenses;

    suggestions.push({
      type: 'reduce_expense',
      description: `지출 ${(neededExpenseReduction * 100).toFixed(0)}% 절감`,
      value: monthlyExpenses * neededExpenseReduction,
      icon: '✅',
    });

    suggestions.push({
      type: 'increase_balance',
      description: `브릿지 펀딩 ₩${formatMoney(neededFunding)}`,
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
```

### State Management
```typescript
// lib/stores/runwayStore.ts (UPDATE)
interface RunwayState {
  // existing...
  balance: number;
  monthlyExpenses: number;
  
  // NEW: Goal setting
  goalEnabled: boolean;
  goalTargetMonths: number | null;
  goalTargetDate: Date | null;
  
  setGoal: (months: number) => void;
  clearGoal: () => void;
}
```

### Integration Point
```tsx
// app/dashboard/page.tsx (UPDATE)
import GoalSetting from '@/components/GoalSetting';

export default function DashboardPage() {
  const { balance, monthlyExpenses, goalEnabled, goalTargetMonths } = useRunwayStore();
  const currentRunway = balance / monthlyExpenses;

  return (
    <div>
      <RunwayDisplay />
      <ScenarioComparison />
      
      {/* NEW: Goal setting */}
      <GoalSetting
        currentRunway={currentRunway}
        balance={balance}
        monthlyExpenses={monthlyExpenses}
      />
    </div>
  );
}
```

### Acceptance Criteria
- [ ] 목표일 입력 (개월 또는 날짜)
- [ ] 현재 vs 목표 비교 표시
- [ ] 부족할 경우 2가지 제안 (지출 절감 / 펀딩)
- [ ] 상태 아이콘 (🎯 안전 / ⚠️ 타이트 / 🔴 위험)
- [ ] 목표 on/off 토글 가능
- [ ] LocalStorage에 목표 저장

### Testing
```typescript
test('should analyze goal correctly', () => {
  const analysis = analyzeGoal(25000000, 4500000, 6);
  
  expect(analysis.currentMonths).toBe(5.6);
  expect(analysis.gap).toBe(-0.4);
  expect(analysis.status).toBe('tight');
  expect(analysis.suggestions.length).toBe(2);
});
```

---

## 3. 데이터 수정 플로우 (2h)

### Problem
온보딩 완료 후 데이터 수정 방법 불명확:
- "자산이 늘었는데 어떻게 업데이트하지?"
- "월 지출이 바뀌었는데..."

현재: 온보딩 재진입 방법 없음  
필요: Dashboard에서 쉽게 수정 가능

### User Story
```
AS A 사용자
I WANT TO Dashboard에서 데이터를 쉽게 수정하고 싶다
SO THAT 매번 온보딩을 다시 할 필요 없이 빠르게 업데이트할 수 있다
```

### UI Design (Option A: Settings Page)
```tsx
// Dashboard에 버튼 추가
<button onClick={() => router.push('/settings')}>
  ⚙️ 설정
</button>

// app/settings/page.tsx (NEW)
┌────────────────────────────────┐
│ ⚙️ 설정                         │
│                                │
│ 💰 자산                         │
│ [₩ 25,000,000           ]     │
│                                │
│ 💸 월 지출                      │
│ [₩ 4,500,000            ]     │
│                                │
│ 🎯 상황                         │
│ [🚀 창업가              ▼]     │
│                                │
│ [취소]  [저장]                 │
└────────────────────────────────┘
```

### UI Design (Option B: Inline Edit)
```tsx
// Dashboard에서 직접 수정
┌────────────────────────────────┐
│ 💰 당신의 재정 런웨이           │
│    5.6개월                     │
│                                │
│ 현재 자산: ₩25.0M  [✏️ 수정]  │
│ 월 평균 지출: ₩4.5M [✏️ 수정]  │
└────────────────────────────────┘

// 클릭 시 인라인 편집
│ 현재 자산: [₩ ________] [✓] [✗] │
```

### Component Structure (Option A 추천)
```tsx
// app/settings/page.tsx (NEW)
export default function SettingsPage() {
  const { balance, monthlyExpenses, situation, updateData } = useRunwayStore();
  const [localBalance, setLocalBalance] = useState(balance);
  const [localExpenses, setLocalExpenses] = useState(monthlyExpenses);

  const handleSave = () => {
    updateData({
      balance: localBalance,
      monthlyExpenses: localExpenses,
    });
    router.push('/dashboard');
  };

  return (
    <div className="settings-page">
      <h1>⚙️ 설정</h1>
      
      <label>💰 자산</label>
      <input
        type="number"
        value={localBalance}
        onChange={(e) => setLocalBalance(Number(e.target.value))}
      />

      <label>💸 월 지출</label>
      <input
        type="number"
        value={localExpenses}
        onChange={(e) => setLocalExpenses(Number(e.target.value))}
      />

      <div className="actions">
        <button onClick={() => router.back()}>취소</button>
        <button onClick={handleSave}>저장</button>
      </div>
    </div>
  );
}
```

### State Management
```typescript
// lib/stores/runwayStore.ts (UPDATE)
interface RunwayState {
  // existing...
  updateData: (data: Partial<RunwayData>) => void;
}

// Implementation
updateData: (data) => {
  set((state) => ({
    ...state,
    ...data,
    updatedAt: Date.now(),
  }));
  // Persist to localStorage
  localStorage.setItem('runway_data', JSON.stringify(get()));
},
```

### Navigation
```tsx
// app/dashboard/page.tsx (UPDATE)
<header>
  <h1>Personal Runway Calculator</h1>
  <button onClick={() => router.push('/settings')}>
    ⚙️
  </button>
</header>
```

### Acceptance Criteria
- [ ] Dashboard에 설정 버튼 추가
- [ ] Settings 페이지에서 모든 데이터 수정 가능
- [ ] 저장 시 LocalStorage 업데이트
- [ ] Dashboard로 자동 리디렉션
- [ ] 취소 버튼으로 변경사항 무시
- [ ] 모바일 반응형

### Alternative: Onboarding Edit Mode
```tsx
// app/onboarding/page.tsx (UPDATE)
export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const isEditMode = searchParams.edit === 'true';
  const { balance, monthlyExpenses, situation } = useRunwayStore();

  // Pre-fill with existing data in edit mode
  useEffect(() => {
    if (isEditMode && balance) {
      setInitialData({ balance, monthlyExpenses, situation });
    }
  }, [isEditMode]);

  return (
    <OnboardingWizard
      editMode={isEditMode}
      initialData={isEditMode ? { balance, monthlyExpenses } : undefined}
    />
  );
}
```

---

## Technical Checklist

### New Files
- [ ] `app/components/ScenarioComparison.tsx`
- [ ] `app/components/GoalSetting.tsx`
- [ ] `app/settings/page.tsx` (Option A) OR inline edit in Dashboard (Option B)
- [ ] `lib/calculations/goal.ts`
- [ ] `tests/scenario-comparison.spec.ts`
- [ ] `tests/goal-analysis.spec.ts`

### Updated Files
- [ ] `app/dashboard/page.tsx` (add new components)
- [ ] `lib/calculations/runway.ts` (add scenario calculations)
- [ ] `lib/stores/runwayStore.ts` (add goal state + updateData)
- [ ] `app/locales/ko.json` (translations)
- [ ] `app/locales/en.json` (translations)

### Testing
- [ ] Scenario calculation accuracy (4 scenarios minimum)
- [ ] Goal analysis logic (gap calculation)
- [ ] Settings page CRUD operations
- [ ] Mobile responsive (320px+)
- [ ] TypeScript 0 errors
- [ ] Build success

### Quality Gates
- [ ] CLAUDE.md followed (surgical changes only)
- [ ] No drive-by refactoring
- [ ] Existing tests still pass
- [ ] New tests added for new features
- [ ] Console 0 errors
- [ ] Lighthouse score maintained (90+)

---

## Success Metrics

### Before (Current)
- Satisfaction: 7.3/10 (avg of 5 personas)
- 준호 (창업가): 7.0/10
- "계산기는 충분, 필요한 건 시뮬레이터"

### After (Target)
- Satisfaction: 9/10 (expected)
- 준호 (창업가): 9/10 (expected)
- "주간 체크인 루틴에 포함하겠습니다"

### Key Results
- ✅ Scenario comparison: 3+ scenarios visible
- ✅ Goal setting: Target vs current clear
- ✅ Data editing: 1-click from Dashboard
- ✅ Mobile UX: 44px+ touch targets
- ✅ Performance: <200ms load time

---

## Development Order

### Phase 1: Core Logic (2h)
1. `lib/calculations/runway.ts` - scenario calculation
2. `lib/calculations/goal.ts` - goal analysis
3. Unit tests for calculations

### Phase 2: UI Components (4h)
1. `ScenarioComparison.tsx` - scenario UI
2. `GoalSetting.tsx` - goal UI
3. `SettingsPage` - data editing

### Phase 3: Integration (2h)
1. Add components to Dashboard
2. Update store with goal state
3. Add navigation buttons
4. i18n translations

### Phase 4: Testing (1h)
1. Manual testing (all features)
2. E2E tests update
3. Mobile responsive check
4. Console error check

---

## Risks & Mitigation

### Risk 1: Calculation Complexity
**Mitigation:** Write comprehensive unit tests first (TDD approach)

### Risk 2: UI Clutter on Dashboard
**Mitigation:** Use collapsible sections, "Show More" buttons

### Risk 3: Mobile Performance
**Mitigation:** Lazy load scenario calculations, memoize results

### Risk 4: i18n Coverage
**Mitigation:** Extract all strings to locale files from start

---

## Notes

- Focus on **창업가 페르소나** as primary user
- Keep calculations **transparent** (show formula)
- Prioritize **speed** over perfection (9h time limit)
- **No scope creep**: P1 features can wait

---

**Estimated Total:** 9 hours  
**Priority:** P0 (blocking launch)  
**Impact:** +1.7 points (7.3 → 9.0)  
**Risk:** Low (well-defined scope)
