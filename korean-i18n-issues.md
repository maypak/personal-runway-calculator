# 한국어 i18n 이슈 (2026-02-22)

**QA 테스터:** Subagent QA  
**테스트 날짜:** 2026-02-22  
**테스트 환경:** http://localhost:3000 (Korean mode)

---

## 🚨 P0 (즉시 수정 필요) - 런칭 블로커

### 1. **Onboarding 번역 완전 누락** (CRITICAL!)
**위치:** Dashboard onboarding modal  
**문제:** `onboarding.json` 파일이 존재하지 않음  
**증상:** 번역 키가 그대로 노출됨:
- `onboarding:welcome.title`
- `onboarding:welcome.description`
- `onboarding:welcome.cta`
- `dashboard:onboarding.title`
- `dashboard:onboarding.description`
- `dashboard:onboarding.cta`

**영향:** 신규 사용자가 가장 먼저 보는 화면이 깨져 보임 → 즉시 이탈 가능  
**스크린샷:** `screenshots/korean-i18n/dashboard-ko.png`

**해결 방법:**
```bash
# 필요한 파일:
public/locales/en/onboarding.json
public/locales/ko/onboarding.json
```

**예상 번역 (ko/onboarding.json):**
```json
{
  "welcome": {
    "title": "런웨이 계산기에 오신 것을 환영합니다",
    "description": "3단계로 당신의 재정 런웨이를 확인하세요",
    "cta": "시작하기"
  }
}
```

---

### 2. **FIRE Calculator 페이지 100% 영어**
**위치:** `/fire` 페이지 전체  
**문제:** 한국어 번역이 전혀 적용되지 않음  
**스크린샷:** `screenshots/korean-i18n/fire-calculator-ko.png`

**영어로 남은 텍스트:**
- ❌ "Back to Dashboard" → "대시보드로 돌아가기"
- ❌ "FIRE Calculator" → "FIRE 계산기" (또는 "경제적 자유 계산기")
- ❌ "Financial Independence, Retire Early" → "경제적 독립, 조기 은퇴"
- ❌ "Add Your Expenses First" → "먼저 지출을 추가하세요"
- ❌ "To calculate your FIRE number, we need to know your monthly expenses." → "FIRE 숫자를 계산하려면 월간 지출을 알아야 합니다."
- ❌ "Go to Dashboard →" → "대시보드로 가기 →"
- ❌ "What is FIRE?" → "FIRE란 무엇인가요?"
- ❌ "Financial Independence, Retire Early. The FIRE calculator shows you how much money you need to never work again (4% Rule)." → 전체 설명 번역 필요

**파일:** 
- `app/fire/page.tsx` 또는 관련 컴포넌트
- `public/locales/ko/fire.json` 확인 필요

---

### 3. **Phase Planning 페이지 100% 영어**
**위치:** `/phases` 페이지 전체  
**문제:** 한국어 번역이 전혀 적용되지 않음  
**스크린샷:** `screenshots/korean-i18n/phases-ko.png`

**영어로 남은 텍스트:**
- ❌ "Back to Dashboard" → "대시보드로 돌아가기"
- ❌ "Total Savings (for runway calculation)" → "총 저축 (런웨이 계산용)"
- ❌ "This will be used to calculate your runway across all phases" → "모든 단계의 런웨이를 계산하는 데 사용됩니다"
- ❌ "Phase Timeline" → "단계 타임라인"
- ❌ "Divide your journey into phases with different financial patterns" → "재정 패턴이 다른 단계로 여정을 나누세요"
- ❌ "Templates" → "템플릿"
- ❌ "Add Phase" → "단계 추가"
- ❌ "No phases yet" → "아직 단계가 없습니다"
- ❌ "Create your first phase or use a template to get started with phase-based planning" → "첫 단계를 만들거나 템플릿을 사용하여 단계별 계획을 시작하세요"
- ❌ "Browse Templates" → "템플릿 둘러보기"
- ❌ "Create Phase" → "단계 만들기"

**파일:**
- `app/phases/page.tsx` 또는 관련 컴포넌트
- `public/locales/ko/phases.json` 확인 필요

---

### 4. **Landing Page 부분 영어 남음**
**위치:** 홈페이지 (`/`)  
**문제:** 대부분 한국어지만 2개 텍스트가 영어로 남음  
**스크린샷:** `screenshots/korean-i18n/landing-ko.png`

**영어로 남은 텍스트:**
- ❌ "Forgot password?" → "비밀번호를 잊으셨나요?"
- ❌ "Privacy Policy" → "개인정보 처리방침"

**파일:** 
- `app/components/Auth.tsx` 또는 유사 파일
- `public/locales/ko/auth.json` 확인

---

### 5. **NewUserGuide 컴포넌트 영어 하드코딩**
**위치:** Dashboard 최상단 가이드 카드  
**문제:** Phase 3에서 추가된 컴포넌트가 영어로 하드코딩됨  
**스크린샷:** `screenshots/korean-i18n/dashboard-ko.png`

**영어로 남은 텍스트:**
- ❌ "Welcome! Here's how to calculate your runway:" → "환영합니다! 런웨이 계산 방법:"
- ❌ "Enter your savings - How much money do you have now?" → "저축 입력 - 현재 보유한 돈은 얼마인가요?"
- ❌ "Add your expenses - How much do you spend per month?" → "지출 추가 - 한 달에 얼마나 쓰시나요?"
- ❌ "See your runway - We'll show exactly how long your money lasts!" → "런웨이 확인 - 돈이 얼마나 오래 지속되는지 정확히 보여드립니다!"
- ❌ "Tip: Hover over any term with an info icon (ⓘ) for explanations." → "팁: 정보 아이콘 (ⓘ)이 있는 용어 위에 마우스를 올려 설명을 보세요."

**파일:** `app/components/ui/NewUserGuide.tsx`

**해결 방법:** i18n hook 사용 (useTranslation)

---

### 6. **Dashboard 런타임 에러 (React Hooks)**
**위치:** Dashboard (`/`)  
**문제:** "Rendered more hooks than during the previous render."  
**증상:** Dashboard 페이지가 로드되지 않고 에러 화면 표시

**영향:** Dashboard 테스트 불가 → 다른 i18n 이슈 확인 불가  
**우선순위:** CRITICAL - 코드 버그, i18n 이슈는 아니지만 테스트 블로커

**해결 필요:** 
- Onboarding 컴포넌트의 조건부 렌더링 확인
- Hooks 사용 순서 검증
- React 18 Strict Mode 이슈 가능성

---

### 7. **에러 메시지 (Error Boundary) 영어**
**위치:** 모든 페이지 (에러 발생 시)  
**문제:** 에러 경계(Error Boundary) 메시지가 영어로 표시됨

**영어로 남은 텍스트:**
- ❌ "Something went wrong" → "문제가 발생했습니다"
- ❌ "Try Again" → "다시 시도"

**파일:** `app/error.tsx` 또는 error boundary 컴포넌트

---

### 8. **404 페이지 영어**
**위치:** `/settings` (존재하지 않는 페이지)  
**문제:** 404 에러 페이지가 영어로 표시됨

**영어로 남은 텍스트:**
- ❌ "404" → 숫자는 그대로 OK
- ❌ "This page could not be found." → "페이지를 찾을 수 없습니다."

**파일:** `app/not-found.tsx` 또는 Next.js 기본 404 페이지

---

### 9. **Onboarding Modal 부분 영어**
**위치:** Dashboard onboarding modal  
**문제:** 일부 UI 요소가 영어로 표시

**영어로 남은 텍스트:**
- ❌ "Step 1 of 4" → "1/4 단계"
- ❌ "Skip for now" → "나중에 하기"
- ❌ "Enter savings" → "저축 입력"
- ❌ "Enter expenses" → "지출 입력"
- ❌ "See runway!" → "런웨이 확인!"

---

## 📊 P0 이슈 요약

| 페이지/컴포넌트 | 영어 비율 | 우선순위 | 예상 수정 시간 |
|---|---|---|---|
| Onboarding Modal | 100% | P0 | 1시간 |
| FIRE Calculator | 100% | P0 | 1시간 |
| Phase Planning | 100% | P0 | 1시간 |
| NewUserGuide | 100% | P0 | 30분 |
| Landing Page | ~5% | P0 | 15분 |
| Dashboard (에러로 미확인) | ? | P0 | ? |
| 404 Page | 100% | P0 | 15분 |
| Error Boundary | 100% | P0 | 15분 |

**총 예상 수정 시간:** 4-5시간

---

## 🟡 P1 (나중에 수정)

### 1. **툴팁 번역 확인 필요**
**위치:** Phase 2에서 추가된 6개 툴팁  
**문제:** Dashboard 에러로 인해 확인 불가  
**필요 작업:** Dashboard 에러 수정 후 재테스트

**확인 필요 툴팁:**
- Runway
- Burn Rate
- FI Number
- Coast FIRE
- Scenario
- Phase

---

### 2. **공통 UI 요소 확인 필요**
**위치:** 네비게이션, 버튼, 레이블 등  
**문제:** Dashboard 에러로 인해 전체 테스트 불가  
**필요 작업:** 에러 수정 후 전체 페이지 재검증

---

### 3. **숫자/날짜 포맷 확인 필요**
**위치:** 모든 페이지  
**문제:** Dashboard 에러로 인해 확인 불가  
**필요 작업:**
- 천 단위 구분자: 1,000 vs 1000
- 날짜 포맷: YYYY-MM-DD vs MM/DD/YYYY
- 통화 기호: $ vs ₩

---

### 4. **FIRE 메시징 (Phase 1) 한국어 확인**
**위치:** FIRE Calculator 페이지, README.md  
**문제:** 영어 페이지라 한국어 번역 여부 확인 불가  
**필요 작업:**
- Phase 1에서 추가된 FIRE 메시징이 한국어로도 번역되었는지 확인
- "Quick FIRE checks" vs "Comprehensive planning" 구분 메시지

---

## ✅ 확인된 OK 항목

### Landing Page (부분 OK)
- ✅ "런웨이 계산기" - 올바른 번역
- ✅ "프리랜서, 창업자, 커리어 브레이크를 위한 도구" - 자연스러움
- ✅ "당신의 돈은 얼마나 오래 지속될까요?" - 명확
- ✅ "60초 안에 런웨이를 계산하세요" - OK
- ✅ "안전하고 비공개" - OK
- ✅ "클라우드 동기화" - OK
- ✅ "100% 무료" - OK
- ✅ "로그인", "회원가입" - OK
- ✅ "Google로 계속하기" - OK
- ✅ "GitHub로 계속하기" - OK
- ✅ "이메일", "비밀번호" - OK
- ✅ Language selector 작동 (한국어 선택 가능)

### Onboarding Modal (부분 OK)
- ✅ 이모지 사용 정상 (🎯)
- ✅ 아이콘 표시 정상

---

## 🛠️ 권장 수정 순서

### Phase 1: 런칭 블로커 제거 (3-4시간)
1. **Onboarding 번역 파일 생성** (1h)
   - `public/locales/en/onboarding.json`
   - `public/locales/ko/onboarding.json`
   
2. **Dashboard 런타임 에러 수정** (1h)
   - React Hooks 조건부 렌더링 이슈 해결
   
3. **FIRE Calculator 번역 적용** (1h)
   - i18n hook 추가
   - 하드코딩된 영어 텍스트 → 번역 키로 교체
   
4. **Phase Planning 번역 적용** (1h)
   - i18n hook 추가
   - 하드코딩된 영어 텍스트 → 번역 키로 교체

### Phase 2: 나머지 P0 이슈 (1h)
5. **NewUserGuide 번역 적용** (30min)
6. **Landing Page 잔여 영어** (15min)
7. **404 & Error Boundary** (15min)

### Phase 3: 재검증 (1h)
8. Dashboard 전체 페이지 재테스트
9. 툴팁 6개 확인
10. 숫자/날짜 포맷 확인
11. 스크린샷 전체 세트 재촬영

---

## 📸 스크린샷 현황

### 촬영 완료 (3/6)
- ✅ `landing-ko.png` - Landing page (부분 영어 발견)
- ✅ `dashboard-ko.png` - Dashboard onboarding (번역 키 노출)
- ✅ `fire-calculator-ko.png` - FIRE Calculator (100% 영어)
- ✅ `phases-ko.png` - Phase Planning (100% 영어)

### 촬영 필요 (2/6) - Dashboard 에러 수정 후
- ❌ `settings-ko.png` - Settings page (404 발생)
- ❌ `new-user-guide-ko.png` - NewUserGuide 컴포넌트 확대

### 추가 촬영 필요 (재테스트 시)
- ❌ `scenarios-ko.png` - Scenario Comparison
- ❌ `tooltips-ko.png` - Tooltips 예시

---

## 🚨 결론: 런칭 불가 (P0 이슈 너무 많음)

### 현재 상태
- **한국어 완성도: ~30%**
- Landing page: 95% OK (2개 단어만 영어)
- Dashboard: 테스트 불가 (런타임 에러)
- FIRE Calculator: 0% (100% 영어)
- Phase Planning: 0% (100% 영어)
- Onboarding: 0% (번역 파일 없음)

### 권장 조치
1. ❌ **즉시 런칭 불가** - P0 이슈 너무 많음
2. ✅ **Technical Writer + Developer 긴급 투입** (3-5시간)
3. ✅ **수정 후 재검증 필수** (1시간)
4. ✅ **예상 런칭 가능 시점:** 내일 (2026-02-23)

### 런칭 전 체크리스트
- [ ] Onboarding 번역 파일 생성
- [ ] Dashboard 에러 수정
- [ ] FIRE Calculator 100% 한국어
- [ ] Phase Planning 100% 한국어
- [ ] NewUserGuide 한국어
- [ ] Landing page 잔여 영어 제거
- [ ] Error pages 한국어
- [ ] 전체 페이지 재검증
- [ ] 스크린샷 6장 완료
- [ ] 네이티브 한국어 리뷰 통과

---

**작성자:** QA Subagent  
**작성일:** 2026-02-22  
**다음 단계:** Technical Writer + Developer에게 이슈 전달 → 수정 → 재검증
