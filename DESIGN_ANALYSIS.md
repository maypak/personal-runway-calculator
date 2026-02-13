# 🎨 Design Analysis - Personal Runway Calculator
**Analyst:** Senior Product Designer  
**Date:** 2026-02-13  
**Target:** https://personal-runway-calculator.vercel.app

---

## 📊 Executive Summary

**Overall Assessment:** ⭐⭐⭐⭐☆ (4/5)

이 프로젝트는 이미 **높은 UX 품질**을 달성했습니다:
- ✅ Split layout Auth (모바일 친화적)
- ✅ 감정적 메시지 ("survive without a job")
- ✅ 테마 시스템 (8가지 색상 팔레트)
- ✅ 반응형 디자인 (모바일 최적화)
- ✅ 명확한 정보 계층 구조

**BUT**, 몇 가지 **Quick Wins**로 사용자 경험을 크게 개선할 수 있습니다.

---

## 🚀 Quick Wins (1시간 이내 개선)

### 1️⃣ **Auth 페이지: 소셜 증명 아이콘 불일치** ⏱️ 15분
**문제:**
```tsx
<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
  <span className="text-lg">🔒</span>
</div>
```
- 이모지가 컨테이너보다 **훨씬 작음**
- 시각적 불균형 ("왜 이렇게 큰 상자에 작은 아이콘?")

**해결책:**
```tsx
// Before: 이모지 (너무 작음)
<span className="text-lg">🔒</span>

// After: SVG 아이콘 (정확한 크기)
<svg className="w-5 h-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
</svg>
```

**Impact:** 시각적 일관성 ↑, 프로페셔널 느낌 ↑

---

### 2️⃣ **Dashboard: "Sign Out" 버튼 색상 오류** ⏱️ 5분
**문제:**
```tsx
<button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-gray-900">
  Sign Out
</button>
```
- `bg-red-600` + `text-gray-900` = **읽기 어려움** (대비 불량)
- 레드 버튼에 다크 그레이 텍스트는 시각적으로 이상함

**해결책:**
```tsx
<button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white">
  Sign Out
</button>
```

**Impact:** 접근성 개선, WCAG AA 준수

---

### 3️⃣ **Settings 버튼: 색상 충돌** ⏱️ 5분
**문제:**
```tsx
<button className="px-3 py-2 md:px-4 bg-gray-700 hover:bg-gray-800 text-gray-900">
  ⚙️
</button>
```
- `bg-gray-700` + `text-gray-900` = **거의 보이지 않음**
- 다크 배경에 다크 텍스트 (대비율 1.2:1, WCAG 기준 미달)

**해결책:**
```tsx
<button className="px-3 py-2 md:px-4 bg-gray-700 hover:bg-gray-800 text-white">
  ⚙️
</button>
```

**Impact:** 가독성 ↑, 접근성 ↑

---

### 💡 **추가 Quick Win: Simulator 텍스트 오타** ⏱️ 2분
**문제:**
```tsx
<div className="text-sm text-gray-900600 mb-2">Simulated Runway</div>
```
- `text-gray-900600` → 존재하지 않는 클래스 (오타)

**해결책:**
```tsx
<div className="text-sm text-gray-600 mb-2">Simulated Runway</div>
```

---

## 🎯 다음 디자인 스프린트 제안

### Sprint 1: **Onboarding Experience** (2-3일)
**목표:** 첫 방문자 → 활성 사용자 전환율 ↑

**Tasks:**
1. **3-Step 온보딩 마법사**
   - Step 1: "당신의 현재 저축은?"
   - Step 2: "월 평균 지출은?"
   - Step 3: "런웨이 확인!"
   - **왜?** 현재는 Settings에 모든 값이 숨겨져 있어 초보자 진입 장벽 ↑

2. **Empty State 개선**
   - 지출 0개일 때: "첫 지출 추가하고 트래킹 시작하세요!"
   - Recurring 0개일 때: "월세, 구독료 등 고정 지출 추가 권장"

3. **Tooltip & Hints**
   - "Lump Sum이 뭔가요?" → "퇴직금, 보너스 등 일회성 수입"
   - "Runway가 뭔가요?" → "현재 자금으로 버틸 수 있는 기간"

---

### Sprint 2: **Data Visualization** (3-4일)
**목표:** 숫자 → 스토리로 전환

**Tasks:**
1. **Runway History Chart**
   - Line graph: 30일간 런웨이 추이
   - **왜?** "내가 잘하고 있나?" 불안감 해소

2. **Category Breakdown (Pie/Donut)**
   - "어디에 돈을 가장 많이 쓰는가?"
   - 클릭 시 해당 카테고리 지출 내역 필터링

3. **Monthly Comparison**
   - "이번 달 vs 지난 달"
   - "Food: $800 → $650 (↓18%)" 👈 작은 성공 시각화

---

### Sprint 3: **Mobile-First Optimization** (2일)
**목표:** 모바일 UX 완성도 ↑

**Tasks:**
1. **Sticky Header (모바일)**
   - 스크롤 시 Runway 숫자 상단 고정
   - **왜?** 항상 "내 런웨이"를 볼 수 있어야 안심

2. **Swipe Gestures**
   - Expense 항목 왼쪽 스와이프 → Delete
   - iOS/Android 네이티브 UX 패턴

3. **Bottom Sheet for Forms**
   - 현재: 인라인 폼 (콘텐츠 밀림)
   - 개선: 하단 시트 (iOS 스타일)

---

## 🤔 리더에게 드릴 질문 3가지

### Q1: **타겟 유저는 누구인가요?**
**배경:**
- 현재 UI는 "엔지니어가 10년 일하다 퇴사" 스토리 기반
- BUT, 일반인도 사용할 수 있나요? (대학생, 주부, 프리랜서 등)

**왜 중요한가:**
- 타겟에 따라 용어 변경 필요
  - 엔지니어: "Runway", "Burn rate" → OK
  - 일반인: "생활비로 버틸 수 있는 기간" → 더 직관적

**제안:**
- 온보딩에서 "누구세요?" 질문 → 맞춤형 메시지

---

### Q2: **데이터 프라이버시 vs 소셜 기능**
**배경:**
- 현재: 100% 프라이빗 (개인만 봄)
- 가능성: "익명 공유" 기능?
  - "저는 런웨이 23개월이에요. 당신은?"
  - Reddit 스타일 커뮤니티

**트레이드오프:**
- 프라이버시 ↑ vs 바이럴성 ↓
- 소셜 기능 ↑ vs 복잡도 ↑

**질문:**
- MVP는 프라이빗 유지? 아니면 소셜 실험?

---

### Q3: **수익화 계획은?**
**배경:**
- 현재: "100% Free" 강조
- 장기적으로 비즈니스 모델은?

**디자인 영향:**
- **Free forever:** UI 단순 유지, 광고 없음
- **Freemium:** "Pro 기능" 구간 디자인 필요
  - 예: Chart, Export CSV, Multi-currency
- **B2B:** 팀 대시보드, 관리자 뷰

**질문:**
- 지금 "Free" 메시지가 향후 유료화 시 신뢰 손상 가능성은?

---

## ⚔️ Product Manager와 예상 충돌

### 충돌 1: **Onboarding Wizard vs Quick Start**
**PM 입장:**
- "온보딩은 마찰 포인트! 바로 사용하게 해야 해!"
- "3-step wizard? 이탈률 ↑"

**Designer 입장:**
- "빈 대시보드는 더 큰 마찰! 뭘 입력해야 할지 모름"
- "Netflix, Spotify도 온보딩 있음"

**제안 (중재안):**
- **Option A:** Default 값으로 바로 시작 → 나중에 수정
  - "런웨이 12개월로 시작해요! (나중에 조정 가능)"
- **Option B:** Progressive Disclosure
  - 필수만 묻고 (저축, 월지출) → 나머지는 나중에

**결정 기준:**
- A/B 테스트! (Wizard vs No Wizard)

---

### 충돌 2: **Chart vs Simplicity**
**PM 입장:**
- "Chart는 개발 시간 2-3일 소요"
- "MVP는 빠른 출시! Chart는 v2에"

**Designer 입장:**
- "사람들은 **시각적 피드백** 원함"
- "숫자만 보여주면 '앱이 뭐 하는 거지?' 느낌"

**타협안:**
- **Phase 1:** Simple Progress Bar (이미 있음 ✅)
- **Phase 1.5:** Sparkline (작은 트렌드 라인, 1일 개발)
  ```
  Runway: 23mo ↗︎ (mini chart)
  ```
- **Phase 2:** Full Chart (Recharts 라이브러리)

**내 주장:**
- "Sparkline은 Quick Win! Chart 체감 효과 90%를 1일에 얻음"

---

### 충돌 3: **Mobile First vs Desktop First**
**PM 입장:**
- "사용자 대부분 데스크톱 (금융 앱은 PC에서)"
- "모바일은 나중에 최적화"

**Designer 입장:**
- "퇴사 준비하는 사람 = 직장에서 몰래 봄 → 모바일!"
- "런웨이 확인은 충동적 (커피 마시며 폰으로)"

**데이터로 해결:**
- Google Analytics → 모바일 vs 데스크톱 비율 확인
- **만약 모바일 > 60%:** Designer 승
- **만약 데스크톱 > 60%:** PM 승

**현재 상태:**
- 이미 모바일 최적화 잘됨! ✅
- **BUT**, Swipe gesture, Bottom sheet 등은 선택적 개선

---

## 🔥 "이건 꼭 고쳐야" vs "나중에 괜찮아"

### 🚨 **꼭 고쳐야 (Critical):**

1. **Sign Out / Settings 버튼 색상**
   - **이유:** 접근성 기본 (WCAG)
   - **리스크:** 시각 장애인 사용 불가
   - **시간:** 10분

2. **Auth 페이지 이모지 크기**
   - **이유:** 첫인상 (랜딩 페이지)
   - **리스크:** "아마추어 느낌" → 신뢰도 ↓
   - **시간:** 15분

3. **Simulator 오타 (`text-gray-900600`)**
   - **이유:** 실제 버그 (스타일 미적용)
   - **시간:** 2분

---

### ✅ **나중에 괜찮아 (Nice to Have):**

1. **Chart / Visualization**
   - **이유:** 핵심 기능(런웨이 계산)은 작동 중
   - **타이밍:** v1.1 (2주 후)

2. **Onboarding Wizard**
   - **이유:** 현재도 Settings로 입력 가능
   - **타이밍:** 유저 피드백 받은 후

3. **Swipe Gestures**
   - **이유:** Delete 버튼도 있음 (기능 중복)
   - **타이밍:** 모바일 사용자 80% 이상일 때

4. **소셜 기능 / 커뮤니티**
   - **이유:** MVP 스코프 초과
   - **타이밍:** PMF 달성 후 (유저 1000명+)

---

## 📝 Action Items (우선순위)

### ⚡ 오늘 해야 할 것 (30분):
- [ ] Sign Out 버튼: `text-gray-900` → `text-white`
- [ ] Settings 버튼: `text-gray-900` → `text-white`
- [ ] Simulator 오타: `text-gray-900600` → `text-gray-600`

### 🎯 이번 주 (1-2일):
- [ ] Auth 페이지 소셜 증명 아이콘 → SVG로 교체
- [ ] Empty State 메시지 추가
- [ ] Tooltip 시스템 설계 (Onboarding 준비)

### 📅 다음 주 (디베이팅 후):
- [ ] Onboarding Wizard vs Default Values 결정
- [ ] Chart/Visualization 우선순위 확정
- [ ] 타겟 유저 페르소나 정의

---

## 🎨 Design System Notes

**현재 강점:**
- ✅ 일관된 색상 팔레트 (테마 시스템)
- ✅ Rounded corners (모던함)
- ✅ Shadow hierarchy (깊이감)

**개선 포인트:**
- ⚠️ 일부 색상 대비 문제 (접근성)
- ⚠️ 이모지 vs SVG 혼재 (일관성)
- ⚠️ 모바일 터치 타겟 크기 (일부 버튼 작음)

---

## 🏁 결론

**준비 완료!** ✅

이 프로젝트는 이미 **탄탄한 기반**을 갖췄습니다. 위 Quick Wins 3가지(실제로는 4가지)만 적용해도 **즉시 체감되는 개선**을 얻을 수 있습니다.

**다음 단계:**
1. Quick Wins 적용 (30분)
2. 리더와 디베이팅 (타겟 유저, 수익화, 소셜 기능)
3. 다음 스프린트 우선순위 결정

**개인 의견:**
이 앱은 "개인적 문제 해결"에서 시작했지만, **보편적 니즈**를 건드립니다. 퇴사 준비자, 프리랜서, 학생 모두 "내가 얼마나 버틸 수 있나?" 궁금해합니다. **감정적 메시지 + 간단한 UX**가 핵심 경쟁력입니다. 잘 키우면 **바이럴 가능성** 높습니다.

---

**Designer:** 시니어 프로덕트 디자이너  
**Next sync:** 리더와 디베이팅 후 업데이트
