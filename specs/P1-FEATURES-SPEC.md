# P1 Features Specification

**Date:** 2026-02-26  
**Target:** 8.6/10 → 9.0/10 (+0.4점)  
**Total time:** 10 hours  
**Priority:** Post-launch optimization

---

## Overview

Phase 1에서 8.6/10 달성했지만 9.0 목표에는 0.4점 부족.
3개 P1 기능으로 마지막 갭을 메우고 완벽한 MVP 완성.

**Key Insight from Beta:**
- 3명이 SNS 공유 요청 (바이럴 포텐셜)
- 준호가 커스텀 시나리오 요청 (9.1 → 9.5 가능)
- 태현이 데이터 내보내기 요청 (파워유저 확보)

---

## 1. SNS 공유 기능 (4h)

### Problem
베타 테스터 3명(지민, 지혜, 준호)이 공통 요청:
> "친구한테 공유하고 싶은데 방법이 없어요"
> "카카오톡으로 보내면 좋겠어요"
> "링크 복사 버튼 필요합니다"

바이럴 성장의 핵심 = 공유 기능

### User Stories
```
AS A 사용자
I WANT TO 내 런웨이 결과를 친구와 공유하고 싶다
SO THAT 조언을 받거나 자랑할 수 있다

AS A 마케터
I WANT TO 유저가 자발적으로 공유하게 하고 싶다
SO THAT 바이럴 성장을 만들 수 있다
```

### UI Design
```
📊 내 런웨이: 5.6개월

┌─────────────────────────────────┐
│ 🎯 목표 달성 가능!              │
│ 절약 10%로 6.2개월 확보         │
└─────────────────────────────────┘

[📤 공유하기]  [⚙️ 설정]

// 클릭 시 모달:
┌─────────────────────────────────┐
│ 공유하기                         │
│                                 │
│ [💬 카카오톡]                   │
│ [🐦 트위터]                     │
│ [🔗 링크 복사]                  │
│ [📧 이메일]                     │
│                                 │
│ [취소]                          │
└─────────────────────────────────┘
```

### Component Structure
```tsx
// app/components/ShareButton.tsx (NEW)
interface ShareButtonProps {
  runway: number; // 5.6
  balance: number;
  monthlyExpenses: number;
  situation?: string;
}

export default function ShareButton({ runway, balance, monthlyExpenses, situation }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const shareText = `나의 재정 런웨이: ${runway}개월! Personal Runway Calculator로 확인해보세요 🎯`;
  const shareUrl = 'https://personal-runway-calculator.vercel.app';
  
  const handleKakao = () => {
    // Kakao SDK
  };
  
  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
  };
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success('링크가 복사되었습니다!');
  };
  
  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent('Personal Runway Calculator')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
  };
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        📤 공유하기
      </button>
      
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onKakao={handleKakao}
        onTwitter={handleTwitter}
        onCopyLink={handleCopyLink}
        onEmail={handleEmail}
      />
    </>
  );
}
```

### Kakao SDK Integration
```tsx
// app/layout.tsx (UPDATE)
<Script
  src="https://developers.kakao.com/sdk/js/kakao.js"
  strategy="afterInteractive"
  onLoad={() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
    }
  }}
/>

// lib/share/kakao.ts (NEW)
export function shareToKakao(params: {
  runway: number;
  balance: number;
  monthlyExpenses: number;
}) {
  if (!window.Kakao) return;
  
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '💰 나의 재정 런웨이',
      description: `${params.runway}개월 동안 버틸 수 있어요!`,
      imageUrl: 'https://personal-runway-calculator.vercel.app/og-image.png',
      link: {
        mobileWebUrl: 'https://personal-runway-calculator.vercel.app',
        webUrl: 'https://personal-runway-calculator.vercel.app',
      },
    },
    buttons: [
      {
        title: '내 런웨이 계산하기',
        link: {
          mobileWebUrl: 'https://personal-runway-calculator.vercel.app',
          webUrl: 'https://personal-runway-calculator.vercel.app',
        },
      },
    ],
  });
}
```

### Analytics Tracking
```typescript
// lib/analytics/tracking.ts (NEW)
export function trackShare(method: 'kakao' | 'twitter' | 'link' | 'email') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      method,
      content_type: 'runway_result',
    });
  }
}
```

### Integration Points
```tsx
// app/components/RunwayDashboard.tsx (UPDATE)
import ShareButton from './ShareButton';

export default function RunwayDashboard() {
  const { balance, monthlyExpenses, situation } = useRunwayStore();
  const runway = balance / monthlyExpenses;
  
  return (
    <div>
      <RunwayDisplay runway={runway} />
      
      {/* NEW: Share button */}
      <div className="flex gap-2">
        <ShareButton
          runway={runway}
          balance={balance}
          monthlyExpenses={monthlyExpenses}
          situation={situation}
        />
        <button onClick={() => router.push('/settings')}>
          ⚙️ 설정
        </button>
      </div>
    </div>
  );
}
```

### Environment Variables
```bash
# .env.local (NEW)
NEXT_PUBLIC_KAKAO_KEY=your_kakao_javascript_key
```

### Acceptance Criteria
- [ ] 4가지 공유 방법 모두 작동 (카톡, 트위터, 링크, 이메일)
- [ ] 카카오톡 미리보기 이미지 표시
- [ ] 링크 복사 시 토스트 알림
- [ ] 공유 시 Analytics 이벤트 발생
- [ ] 모바일 반응형
- [ ] i18n (한/영)

### Testing
```typescript
// tests/share.spec.ts
test('should open share modal', async () => {
  await page.click('button:has-text("공유하기")');
  await expect(page.locator('text=카카오톡')).toBeVisible();
});

test('should copy link to clipboard', async () => {
  await page.click('button:has-text("공유하기")');
  await page.click('button:has-text("링크 복사")');
  await expect(page.locator('text=링크가 복사되었습니다')).toBeVisible();
});
```

### Expected Impact
- **지민 (학생):** 8.7 → 9.2 (+0.5) - SNS 바이럴 니즈 충족
- **지혜 (프리랜서):** 8.9 → 9.3 (+0.4) - 동료 추천 가능
- **준호 (창업가):** 9.1 → 9.4 (+0.3) - 투자자 공유

**평균 기여:** +0.15점

---

## 2. 커스텀 시나리오 (투자/펀딩) (4h)

### Problem
준호(창업가) 피드백:
> "브릿지 펀딩 받으면 얼마나 늘어나는지 시뮬레이션하고 싶어요"
> "₩10,000,000 vs ₩20,000,000 비교하고 싶은데 매번 다시 계산해야 해요"

현재: 고정 4개 시나리오 (현재/-10%/-20%/+20%)  
필요: 자산 추가 시나리오 (브릿지 펀딩, 상여금 등)

### User Story
```
AS A 창업가
I WANT TO 브릿지 펀딩 금액을 입력해서 시뮬레이션하고 싶다
SO THAT 투자 유치 필요 금액을 역산할 수 있다

AS A 프리랜서
I WANT TO 예상 계약금을 추가해서 시뮬레이션하고 싶다
SO THAT 계약 수주 목표를 세울 수 있다
```

### UI Design
```
📊 시나리오 비교

현재 (₩4,500,000)     → 5.6개월 🟡
절약 -10%             → 6.2개월 ✅
절약 -20%             → 6.9개월 🎯
최악 +20%             → 4.6개월 🔴

[+ 커스텀 시나리오 추가]

// 클릭 시:
┌─────────────────────────────────┐
│ 새 시나리오 추가                 │
│                                 │
│ 이름:                           │
│ [브릿지 펀딩                  ] │
│                                 │
│ 유형:                           │
│ (•) 자산 증가  ( ) 지출 변경    │
│                                 │
│ 금액:                           │
│ [₩ 10,000,000             ]    │
│                                 │
│ [취소]  [추가하기]              │
└─────────────────────────────────┘

// 결과:
브릿지 펀딩 +₩10M     → 7.8개월 💎
```

### Component Structure
```tsx
// app/components/ScenarioComparison.tsx (UPDATE)
interface CustomScenario {
  id: string;
  name: string;
  type: 'balance_increase' | 'balance_decrease' | 'expense_adjustment';
  value: number;
  icon?: string;
}

export default function ScenarioComparison({ balance, monthlyExpenses }: Props) {
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const allScenarios = [
    ...defaultScenarios,
    ...customScenarios.map(cs => ({
      name: cs.name,
      type: cs.type,
      value: cs.value,
      icon: cs.icon || '💎',
    })),
  ];
  
  const handleAddScenario = (scenario: CustomScenario) => {
    setCustomScenarios([...customScenarios, scenario]);
    // Save to localStorage
    localStorage.setItem('custom_scenarios', JSON.stringify([...customScenarios, scenario]));
  };
  
  return (
    <div>
      {allScenarios.map(scenario => (
        <ScenarioCard key={scenario.name} scenario={scenario} />
      ))}
      
      <button onClick={() => setIsAddModalOpen(true)}>
        + 커스텀 시나리오 추가
      </button>
      
      <AddScenarioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddScenario}
      />
    </div>
  );
}
```

### Add Scenario Modal
```tsx
// app/components/AddScenarioModal.tsx (NEW)
export default function AddScenarioModal({ isOpen, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'balance_increase' | 'expense_adjustment'>('balance_increase');
  const [value, setValue] = useState(0);
  
  const handleSubmit = () => {
    const scenario: CustomScenario = {
      id: nanoid(),
      name,
      type,
      value: type === 'expense_adjustment' ? value / 100 : value, // Convert % to decimal
    };
    onAdd(scenario);
    onClose();
    // Reset form
    setName('');
    setValue(0);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>새 시나리오 추가</h2>
      
      <label>이름:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="브릿지 펀딩"
      />
      
      <label>유형:</label>
      <RadioGroup value={type} onChange={setType}>
        <Radio value="balance_increase">자산 증가 (펀딩, 상여금)</Radio>
        <Radio value="expense_adjustment">지출 변경 (%)</Radio>
      </RadioGroup>
      
      <label>
        {type === 'balance_increase' ? '금액:' : '변경률 (%):'}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={type === 'balance_increase' ? '10000000' : '30'}
      />
      
      <div className="actions">
        <button onClick={onClose}>취소</button>
        <button onClick={handleSubmit} disabled={!name || !value}>
          추가하기
        </button>
      </div>
    </Modal>
  );
}
```

### Preset Templates
```typescript
// lib/scenarios/presets.ts (NEW)
export const presetScenarios = {
  startup: [
    { name: '브릿지 펀딩 ₩10M', type: 'balance_increase', value: 10000000, icon: '💎' },
    { name: '브릿지 펀딩 ₩20M', type: 'balance_increase', value: 20000000, icon: '💰' },
    { name: '엔젤 투자 ₩50M', type: 'balance_increase', value: 50000000, icon: '🦄' },
  ],
  freelancer: [
    { name: '계약금 ₩5M', type: 'balance_increase', value: 5000000, icon: '📝' },
    { name: '성수기 +30%', type: 'expense_adjustment', value: -0.3, icon: '🔥' },
    { name: '비수기 -30%', type: 'expense_adjustment', value: 0.3, icon: '❄️' },
  ],
  jobseeker: [
    { name: '실업급여 ₩3M', type: 'balance_increase', value: 3000000, icon: '🎁' },
    { name: '부모님 지원 ₩2M', type: 'balance_increase', value: 2000000, icon: '👪' },
  ],
};

// UI: "프리셋 사용하기" 버튼
<button onClick={() => setShowPresets(true)}>
  📋 프리셋 사용하기
</button>
```

### State Management
```typescript
// lib/stores/runwayStore.ts (UPDATE)
interface RunwayState {
  // existing...
  customScenarios: CustomScenario[];
  addCustomScenario: (scenario: CustomScenario) => void;
  removeCustomScenario: (id: string) => void;
  clearCustomScenarios: () => void;
}
```

### Acceptance Criteria
- [ ] 커스텀 시나리오 추가 가능
- [ ] 자산 증가 / 지출 변경 둘 다 지원
- [ ] 이름, 금액, 아이콘 커스터마이즈
- [ ] LocalStorage에 저장 (새로고침 시 유지)
- [ ] 시나리오 삭제 가능
- [ ] 프리셋 템플릿 제공 (창업가/프리랜서/취준생)
- [ ] 최대 10개까지 추가 가능

### Testing
```typescript
test('should add custom scenario', async () => {
  await page.click('button:has-text("커스텀 시나리오 추가")');
  await page.fill('input[placeholder="브릿지 펀딩"]', '투자 유치');
  await page.fill('input[type="number"]', '15000000');
  await page.click('button:has-text("추가하기")');
  
  await expect(page.locator('text=투자 유치 +₩15M')).toBeVisible();
});
```

### Expected Impact
- **준호 (창업가):** 9.1 → 9.5 (+0.4) - 핵심 니즈 충족
- **지혜 (프리랜서):** 8.9 → 9.2 (+0.3) - 계약 시뮬레이션

**평균 기여:** +0.15점

---

## 3. Data Export (CSV/JSON) (2h)

### Problem
태현(개발자) 피드백:
> "스프레드시트로 내보내고 싶어요"
> "데이터를 백업하고 싶은데 방법이 없어요"

파워유저 = 데이터 소유권 중요

### User Story
```
AS A 파워유저
I WANT TO 내 데이터를 CSV/JSON으로 내보내고 싶다
SO THAT 스프레드시트에서 추가 분석을 할 수 있다
```

### UI Design
```
⚙️ 설정

💰 자산: ₩25,000,000
💸 월 지출: ₩4,500,000
🎯 상황: 창업가

[저장]  [취소]

───────────────────────────────

📥 데이터 관리

[📊 CSV로 내보내기]
[📄 JSON으로 내보내기]
[🗑️ 모든 데이터 삭제]
```

### Export Formats

**CSV:**
```csv
field,value,unit
balance,25000000,KRW
monthlyExpenses,4500000,KRW
monthlyIncome,0,KRW
runway,5.6,months
situation,startup,
goalEnabled,true,
goalTargetMonths,6,months
createdAt,2026-02-26T09:00:00Z,
updatedAt,2026-02-26T17:30:00Z,
```

**JSON:**
```json
{
  "version": "1.0",
  "exportedAt": "2026-02-26T17:30:00Z",
  "data": {
    "balance": 25000000,
    "monthlyExpenses": 4500000,
    "monthlyIncome": 0,
    "runway": 5.6,
    "situation": "startup",
    "goalEnabled": true,
    "goalTargetMonths": 6,
    "customScenarios": [
      {
        "id": "abc123",
        "name": "브릿지 펀딩",
        "type": "balance_increase",
        "value": 10000000
      }
    ],
    "createdAt": "2026-02-26T09:00:00Z",
    "updatedAt": "2026-02-26T17:30:00Z"
  },
  "calculations": {
    "runwayMonths": 5.6,
    "runwayEndDate": "2026-08-15",
    "scenarios": {
      "current": { "months": 5.6 },
      "save10": { "months": 6.2 },
      "save20": { "months": 6.9 },
      "worst20": { "months": 4.6 }
    }
  }
}
```

### Component Structure
```tsx
// app/components/DataExport.tsx (NEW)
export default function DataExport() {
  const store = useRunwayStore();
  
  const handleExportCSV = () => {
    const csv = generateCSV(store);
    downloadFile(csv, 'runway-data.csv', 'text/csv');
    toast.success('CSV 파일이 다운로드되었습니다');
  };
  
  const handleExportJSON = () => {
    const json = generateJSON(store);
    downloadFile(json, 'runway-data.json', 'application/json');
    toast.success('JSON 파일이 다운로드되었습니다');
  };
  
  const handleDeleteAll = async () => {
    const confirmed = window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
      localStorage.clear();
      store.reset();
      router.push('/onboarding');
    }
  };
  
  return (
    <section>
      <h2>📥 데이터 관리</h2>
      
      <button onClick={handleExportCSV}>
        📊 CSV로 내보내기
      </button>
      
      <button onClick={handleExportJSON}>
        📄 JSON으로 내보내기
      </button>
      
      <button onClick={handleDeleteAll} className="danger">
        🗑️ 모든 데이터 삭제
      </button>
    </section>
  );
}
```

### Export Utilities
```typescript
// lib/export/csv.ts (NEW)
export function generateCSV(store: RunwayState): string {
  const rows = [
    ['field', 'value', 'unit'],
    ['balance', store.balance, 'KRW'],
    ['monthlyExpenses', store.monthlyExpenses, 'KRW'],
    ['monthlyIncome', store.monthlyIncome || 0, 'KRW'],
    ['runway', (store.balance / store.monthlyExpenses).toFixed(1), 'months'],
    ['situation', store.situation || '', ''],
    ['goalEnabled', store.goalEnabled ? 'true' : 'false', ''],
    ['goalTargetMonths', store.goalTargetMonths || '', 'months'],
    ['createdAt', new Date().toISOString(), ''],
  ];
  
  return rows.map(row => row.join(',')).join('\n');
}

// lib/export/json.ts (NEW)
export function generateJSON(store: RunwayState): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {
      balance: store.balance,
      monthlyExpenses: store.monthlyExpenses,
      monthlyIncome: store.monthlyIncome || 0,
      runway: parseFloat((store.balance / store.monthlyExpenses).toFixed(1)),
      situation: store.situation,
      goalEnabled: store.goalEnabled,
      goalTargetMonths: store.goalTargetMonths,
      customScenarios: store.customScenarios || [],
      createdAt: store.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    calculations: {
      runwayMonths: parseFloat((store.balance / store.monthlyExpenses).toFixed(1)),
      runwayEndDate: addMonths(new Date(), store.balance / store.monthlyExpenses).toISOString(),
      scenarios: calculateAllScenarios(store),
    },
  };
  
  return JSON.stringify(data, null, 2);
}

// lib/export/download.ts (NEW)
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
```

### Integration Point
```tsx
// app/settings/page.tsx (UPDATE)
import DataExport from '@/components/DataExport';

export default function SettingsPage() {
  return (
    <div>
      {/* Existing settings form */}
      <SettingsForm />
      
      {/* NEW: Data export */}
      <DataExport />
    </div>
  );
}
```

### Acceptance Criteria
- [ ] CSV 다운로드 작동
- [ ] JSON 다운로드 작동
- [ ] 파일명에 타임스탬프 포함 (runway-data-2026-02-26.csv)
- [ ] 데이터 삭제 시 확인 다이얼로그
- [ ] 삭제 후 온보딩으로 리디렉션
- [ ] Toast 알림 (성공/실패)

### Testing
```typescript
test('should export CSV', async () => {
  await page.goto('/settings');
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("CSV로 내보내기")');
  const download = await downloadPromise;
  
  expect(download.suggestedFilename()).toMatch(/runway-data.*\.csv/);
});
```

### Expected Impact
- **태현 (개발자):** 8.6 → 9.1 (+0.5) - 파워유저 니즈 충족

**평균 기여:** +0.1점

---

## Technical Checklist

### New Files (P1)
- [ ] `app/components/ShareButton.tsx`
- [ ] `app/components/ShareModal.tsx`
- [ ] `app/components/AddScenarioModal.tsx`
- [ ] `app/components/DataExport.tsx`
- [ ] `lib/share/kakao.ts`
- [ ] `lib/analytics/tracking.ts`
- [ ] `lib/scenarios/presets.ts`
- [ ] `lib/export/csv.ts`
- [ ] `lib/export/json.ts`
- [ ] `lib/export/download.ts`

### Updated Files
- [ ] `app/components/RunwayDashboard.tsx` (add ShareButton)
- [ ] `app/components/ScenarioComparison.tsx` (add custom scenarios)
- [ ] `app/settings/page.tsx` (add DataExport)
- [ ] `lib/stores/runwayStore.ts` (add customScenarios state)
- [ ] `app/layout.tsx` (add Kakao SDK script)
- [ ] `.env.local` (add NEXT_PUBLIC_KAKAO_KEY)

### Dependencies
```bash
npm install nanoid  # For unique IDs
```

### Testing
- [ ] Share modal opens/closes
- [ ] Each share method works (kakao/twitter/link/email)
- [ ] Custom scenario CRUD operations
- [ ] CSV/JSON export downloads correctly
- [ ] Delete confirmation dialog
- [ ] Mobile responsive
- [ ] i18n coverage

### Quality Gates
- [ ] TypeScript 0 errors
- [ ] Build success
- [ ] Console 0 errors
- [ ] All tests pass
- [ ] Lighthouse score 90+
- [ ] CLAUDE.md followed

---

## Success Metrics

### Before (Current)
- Satisfaction: 8.6/10
- Shareability: None
- Data portability: None
- Customization: Limited (4 fixed scenarios)

### After (Target)
- Satisfaction: 9.0+/10
- Shareability: 4 channels (Kakao/Twitter/Link/Email)
- Data portability: CSV + JSON export
- Customization: Unlimited custom scenarios + presets

### Key Results
- ✅ SNS share: 3+ channels working
- ✅ Custom scenarios: Add/edit/delete functional
- ✅ Data export: CSV + JSON downloads
- ✅ 9.0/10 satisfaction achieved

---

## Development Order

### Phase 1: SNS 공유 (4h)
1. ShareButton + ShareModal UI (1h)
2. Kakao SDK integration (1.5h)
3. Twitter/Link/Email handlers (1h)
4. Analytics tracking (0.5h)

### Phase 2: 커스텀 시나리오 (4h)
1. AddScenarioModal UI (1h)
2. Custom scenario CRUD logic (1.5h)
3. Preset templates (1h)
4. LocalStorage persistence (0.5h)

### Phase 3: Data Export (2h)
1. CSV/JSON generators (1h)
2. DataExport component (0.5h)
3. Download utilities (0.5h)

---

## Risks & Mitigation

### Risk 1: Kakao SDK 설정 복잡
**Mitigation:** Kakao Developers 계정 필요, 앱 등록 후 JavaScript Key 발급

### Risk 2: CSV 포맷 호환성
**Mitigation:** UTF-8 BOM 추가 (Excel 한글 깨짐 방지)

### Risk 3: 커스텀 시나리오 UI 복잡도
**Mitigation:** 프리셋 제공으로 쉬운 시작, 고급 유저만 커스텀

---

## Notes

- SNS 공유는 **바이럴 성장의 핵심** - 우선순위 높음
- 커스텀 시나리오는 **준호(KEY PERSONA) 만족도** 직격탄
- Data export는 **파워유저 retention** 핵심
- 모두 합쳐서 **9.0+ 달성 가능**

---

**Estimated Total:** 10 hours  
**Priority:** P1 (post-launch optimization)  
**Impact:** +0.4 points (8.6 → 9.0)  
**Risk:** Low-Medium (Kakao SDK 설정 필요)
