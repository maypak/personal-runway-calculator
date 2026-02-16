# P0-1: i18n 다중언어 지원 (영어 + 한국어)

**작성일:** 2026-02-16  
**개발 기간:** 5일  
**우선순위:** P0 (Week 1)  
**담당:** Developer  
**승인:** Amazing May

---

## 🎯 목표

Personal Runway Calculator에 다중언어 지원 프레임워크를 구축하고, 초기 언어로 영어(English)와 한국어(Korean)를 지원한다.

### 비즈니스 임팩트
- 한국 시장 진입 (FIRE 코리아 카페 2만+ 회원)
- 한국인 베타 테스터 6명 평균 점수: 5.5 → **7.2** (+1.7점 예상)
- 향후 일본어, 스페인어 등 추가 언어 확장 용이

---

## 📋 요구사항

### Functional Requirements

1. **언어 전환**
   - Header에 언어 선택 드롭다운 (EN/KO)
   - 선택 시 즉시 UI 전체 변경
   - 로컬스토리지에 언어 설정 저장

2. **번역 범위**
   - 모든 UI 텍스트 (버튼, 라벨, 플레이스홀더)
   - 설명 문구
   - 에러 메시지
   - 이메일 템플릿 (Auth)

3. **숫자/날짜 포맷**
   - 영어: $1,234.56 / MM/DD/YYYY
   - 한국어: ₩1,234,567 / YYYY-MM-DD

4. **확장성**
   - 새 언어 추가 시 1일 이내 완료 가능
   - 번역 파일만 추가하면 동작

### Non-Functional Requirements

1. **성능**
   - 언어 전환 시 < 100ms
   - 초기 로딩 시간 영향 최소화

2. **유지보수성**
   - 번역 키 네이밍 일관성
   - 컴포넌트별 번역 파일 분리

3. **품질**
   - 번역 누락 시 영어 fallback
   - TypeScript 타입 안전성

---

## 🛠 기술 스펙

### 라이브러리 선택: next-i18next

**이유:**
- ✅ Next.js 공식 권장
- ✅ SSR/SSG 지원
- ✅ 타입 안전성
- ✅ 성능 최적화

**대안 검토:**
- react-intl: 더 무거움
- i18next: next-i18next 기반이므로 동일

### 디렉토리 구조

```
personal-runway-calculator/
├── public/
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── auth.json
│       │   ├── dashboard.json
│       │   ├── settings.json
│       │   └── goals.json
│       └── ko/
│           ├── common.json
│           ├── auth.json
│           ├── dashboard.json
│           ├── settings.json
│           └── goals.json
├── next-i18next.config.js
└── app/
    └── components/
        └── LanguageSwitcher.tsx (신규)
```

---

## 📝 구현 단계

### Day 1: 프레임워크 설정 (4h)

**1. 패키지 설치**
```bash
npm install next-i18next react-i18next i18next
```

**2. next-i18next.config.js 생성**
```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    localeDetection: false, // 수동 선택만
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
```

**3. next.config.js 수정**
```javascript
const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  // ... existing config
}
```

**4. _app.tsx 수정**
```typescript
import { appWithTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
```

---

### Day 2: 번역 파일 작성 (6h)

**영어 번역 파일 예시 (public/locales/en/common.json):**
```json
{
  "app": {
    "title": "Personal Runway Calculator",
    "tagline": "Know exactly how long you can survive"
  },
  "nav": {
    "dashboard": "Dashboard",
    "settings": "Settings",
    "goals": "Goals",
    "signOut": "Sign Out"
  },
  "cta": {
    "calculate": "Calculate",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit"
  }
}
```

**한국어 번역 파일 (public/locales/ko/common.json):**
```json
{
  "app": {
    "title": "런웨이 계산기",
    "tagline": "정확히 얼마나 버틸 수 있는지 확인하세요"
  },
  "nav": {
    "dashboard": "대시보드",
    "settings": "설정",
    "goals": "목표",
    "signOut": "로그아웃"
  },
  "cta": {
    "calculate": "계산하기",
    "save": "저장",
    "cancel": "취소",
    "delete": "삭제",
    "edit": "수정"
  }
}
```

**전체 번역 항목 수:** 약 150-200개 (5개 파일)

---

### Day 3: 컴포넌트 전환 (6h)

**Before (하드코딩):**
```typescript
<h1>Your Financial Runway</h1>
<button>Calculate</button>
<label>Monthly Expenses</label>
```

**After (i18n):**
```typescript
import { useTranslation } from 'next-i18next'

function Dashboard() {
  const { t } = useTranslation('dashboard')
  
  return (
    <>
      <h1>{t('title')}</h1>
      <button>{t('common:cta.calculate')}</button>
      <label>{t('fields.monthlyExpenses')}</label>
    </>
  )
}
```

**변환 대상 컴포넌트:**
1. Auth.tsx
2. FinanceDashboard.tsx
3. FinanceDashboardSupabase.tsx
4. GoalSetting.tsx
5. GoalProgress.tsx
6. Settings (신규 필요 시)

---

### Day 4: 언어 전환기 구현 (4h)

**LanguageSwitcher.tsx (신규 컴포넌트):**
```typescript
'use client'

import { useRouter } from 'next/router'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const { locale } = router

  const handleChange = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale })
    localStorage.setItem('preferredLocale', newLocale)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <select 
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent border rounded px-2 py-1"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

**Header/Navigation에 추가:**
- Desktop: 우측 상단 (Sign Out 옆)
- Mobile: Settings 메뉴 내부

---

### Day 5: 테스트 & 마무리 (4h)

**1. 번역 누락 체크**
```bash
# 모든 하드코딩된 텍스트 찾기
rg '"[A-Z][a-z ]{3,}"' app/components --type tsx
```

**2. 숫자 포맷 테스트**
```typescript
// utils/formatters.ts (신규)
import { useRouter } from 'next/router'

export function useFormatCurrency() {
  const { locale } = useRouter()
  
  return (amount: number) => {
    if (locale === 'ko') {
      return `₩${amount.toLocaleString('ko-KR')}`
    }
    return `$${amount.toLocaleString('en-US')}`
  }
}
```

**3. 체크리스트**
- [ ] 모든 페이지에서 언어 전환 동작
- [ ] 새로고침 시 언어 유지
- [ ] 로그아웃 후 재로그인 시 언어 유지
- [ ] 숫자/날짜 포맷 정확
- [ ] 번역 누락 없음 (fallback 동작 확인)
- [ ] 모바일 반응형 정상

**4. 배포**
```bash
npm run build
vercel --prod
```

---

## 📋 번역 가이드라인

### 톤 & 보이스

**영어:**
- Professional but friendly
- Direct and clear
- "You" instead of "User"
- Example: "Your runway is 23 months"

**한국어:**
- 존댓말 (~습니다, ~세요)
- 명확하고 간결
- "당신의" 생략 (한국어 특성)
- Example: "런웨이는 23개월입니다"

### 번역 원칙

1. **일관성**
   - "Runway" → "런웨이" (고유명사 유지)
   - "Dashboard" → "대시보드"
   - "Goal" → "목표"

2. **현지화 (Localization)**
   - "FIRE" → "경제적 자립 조기 은퇴" (첫 언급 시)
   - "Savings" → "저축" (not "절약")
   - "Expenses" → "지출"

3. **금융 용어**
   - Monthly Income → 월 소득
   - Emergency Fund → 비상 자금
   - Runway → 런웨이 (그대로 사용)

4. **금지 사항**
   - ❌ 구글 번역 직역
   - ❌ 영어 단어를 한글로 적기 (예: "세이브")
   - ❌ 반말 (친근함보다 신뢰가 중요)

---

## 🎨 UI 변경사항

### Header (Desktop)
```
Before: [Logo] Dashboard | Goals | Settings | [Sign Out]
After:  [Logo] Dashboard | Goals | Settings | [🌐 EN▾] | [Sign Out]
```

### Header (Mobile)
```
Settings 메뉴 내부에 추가:
- Dark Mode Toggle
- Language Selector (🌐 EN / 🇰🇷 KO)
- Sign Out
```

### 언어별 폰트 최적화 (Optional)
- 영어: Inter (기존)
- 한국어: Noto Sans KR (웹폰트)

---

## 🧪 테스트 시나리오

### Scenario 1: 언어 전환
1. 영어로 시작
2. 헤더에서 한국어 선택
3. ✅ 모든 텍스트 즉시 한국어로 변경
4. ✅ 숫자 포맷 $1,234 → ₩1,234,567
5. 새로고침
6. ✅ 한국어 유지됨

### Scenario 2: 계정 전환
1. User A: 한국어 선택
2. Sign Out
3. User B: Sign In
4. ✅ 영어로 시작 (User B 설정 없음)
5. User B: 한국어 선택 → 저장됨
6. User A: Sign In
7. ✅ 한국어 유지 (User A 설정)

### Scenario 3: 번역 누락
1. 새 기능 추가 (번역 없음)
2. ✅ 영어 fallback 표시
3. ❌ 에러 발생 안 함
4. Console에 warning: "Missing translation: dashboard.newFeature"

---

## 📊 예상 효과

### 베타 테스터 피드백 기반

**한국인 테스터 (6명):**
- 박준영 (Lean FIRE): 5.0 → 7.0 (+2.0)
- 최소연 (Transitioner): 5.5 → 7.2 (+1.7)
- 이지혜 (Burnout): 5.8 → 7.0 (+1.2)
- 이수진 (Burnout): 6.0 → 7.0 (+1.0)
- 박태희 (Burnout): 5.8 → 6.8 (+1.0)
- 김지민 (FIRE): 5.2 → 6.7 (+1.5)

**평균 효과:** +1.5점

### 유료 전환 영향
- 전환율: 50% → 100% (한국어 있으면 즉시 결제)
- 가격: ₩5,000-15,000/월
- TAM: FIRE 코리아 2만+ 회원

---

## 🚀 향후 확장 (Phase 2+)

### 추가 언어 우선순위
1. **日本語 (Japanese)** - r/JapanFinance 50K+
2. **Español (Spanish)** - Sofia, Emma 요청
3. **Deutsch (German)** - r/Finanzen 200K+
4. **中文 (Chinese)** - Marcus 요청

### 예상 공수 (언어당)
- 번역 작업: 4h
- 테스트: 2h
- 배포: 1h
**총:** 1일 (언어당)

---

## 📂 Deliverables

### 코드
- [ ] next-i18next 설정
- [ ] 5개 번역 파일 (en/ko × 5)
- [ ] LanguageSwitcher 컴포넌트
- [ ] 모든 컴포넌트 i18n 전환
- [ ] 숫자/날짜 포맷 유틸

### 문서
- [ ] 번역 가이드라인 (이 문서)
- [ ] 새 언어 추가 가이드
- [ ] 번역 체크리스트

### 테스트
- [ ] 10개 테스트 시나리오 통과
- [ ] 모바일/데스크톱 확인
- [ ] 크로스 브라우저 (Chrome/Safari/Firefox)

---

## ⚠️ 주의사항

### CLAUDE.md 원칙 준수

1. **Think Before Coding**
   - 모든 하드코딩 텍스트 먼저 식별
   - 번역 키 네이밍 컨벤션 정의
   - 컴포넌트별 번역 파일 분리

2. **Simplicity First**
   - 복잡한 interpolation 피하기
   - 간단한 key-value 구조
   - Namespace 최소화 (5개 파일만)

3. **Surgical Changes**
   - 기존 로직 건드리지 않기
   - UI 텍스트만 교체
   - 컴포넌트 구조 변경 최소화

4. **Goal-Driven**
   - 목표: 한국 시장 진입 (+1.5점)
   - 수단: 다중언어 지원
   - 과도한 기능 추가 지양

### 잠재적 이슈

**1. Supabase Auth 이메일**
- 문제: Supabase 이메일은 영어만
- 해결: Phase 2에서 커스텀 이메일 템플릿

**2. Currency 선택**
- 현재: USD만 지원
- 한국어 사용자: ₩ 기대
- 해결: Multi-currency는 별도 P2 작업

**3. 번역 품질**
- Developer가 한국어 네이티브 아닐 수 있음
- 해결: 메이님 최종 검수 필요

---

## ✅ Definition of Done

### 기능
- [x] 언어 전환 (EN/KO) 동작
- [x] 모든 UI 텍스트 번역됨
- [x] 숫자/날짜 포맷 정확
- [x] 언어 설정 저장/복원

### 품질
- [x] 번역 누락 0건
- [x] TypeScript 에러 0건
- [x] ESLint warning 0건
- [x] 10개 테스트 시나리오 통과

### 배포
- [x] Production 배포 완료
- [x] 한국인 베타 테스터 재테스트 완료
- [x] 점수 향상 확인 (+1.5 이상)

---

## 📞 Questions & Support

**개발 중 질문:**
- Slack: #personal-runway-dev
- Amazing May: 즉시 응답

**번역 검수:**
- 메이님: 최종 검수
- 한국어 네이티브 확인

**긴급 이슈:**
- 2일 내 해결 불가 시 즉시 에스컬레이션

---

**작성자:** Amazing May  
**최종 수정:** 2026-02-16  
**상태:** ✅ 승인 완료  

**개발 시작:** 2026-02-17 (월)  
**목표 완료:** 2026-02-21 (금)  

🚀 **Let's make Personal Runway truly global!**
