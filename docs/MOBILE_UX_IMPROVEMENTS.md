# Mobile UX Improvements - 2026-02-20

## 발견된 문제점 & 개선 방안

### P0 (즉시 수정 필요)

#### 1. 대시보드 런웨이 숫자 크기
**문제:** `text-4xl md:text-6xl` - 모바일에서 36px는 충분히 크지만, 시각적 임팩트가 약함
**개선:** `text-5xl md:text-6xl` (모바일 48px → 더 강렬한 임팩트)

#### 2. 버튼 최소 탭 영역
**문제:** 일부 버튼이 44x44px 미만 (Apple HIG 최소 기준)
**개선:** 모든 버튼 최소 `py-3 px-4` (최소 44px 높이 보장)

#### 3. Settings 패널 스크롤
**문제:** 모바일에서 Settings 패널이 화면을 넘칠 수 있음
**개선:** `max-h-[80vh] overflow-y-auto` 추가

#### 4. 모바일 네비게이션 간격
**문제:** 하단 네비게이션 버튼들이 너무 좁음
**개선:** gap 증가, 아이콘 크기 조정

---

### P1 (베타 런칭 전)

#### 5. 입력 필드 폰트 크기
**문제:** iOS는 16px 미만 폰트에서 자동 줌인
**개선:** 모든 input에 `text-base` (16px) 이상

#### 6. 카드 패딩 최적화
**문제:** `p-6 md:p-8` - 모바일에서 24px는 약간 많을 수 있음
**개선:** `p-4 sm:p-6 md:p-8` (작은 화면에서 더 많은 공간 확보)

#### 7. 텍스트 줄바꿈
**문제:** 긴 텍스트가 넘칠 수 있음
**개선:** `break-words` 또는 `overflow-wrap: break-word` 추가

---

### P2 (베타 후 개선)

#### 8. 스와이프 제스처 지원
**개선:** 모바일에서 카드 스와이프로 삭제/편집

#### 9. Pull-to-Refresh
**개선:** 새로고침 제스처 지원

#### 10. 햅틱 피드백
**개선:** 버튼 탭 시 진동 피드백 (iOS/Android)

---

## 즉시 적용할 수정사항

### FinanceDashboardSupabase.tsx

**Before:**
```tsx
<div className="text-4xl md:text-6xl font-bold text-text-primary mb-3 tabular-nums">
```

**After:**
```tsx
<div className="text-5xl md:text-6xl font-bold text-text-primary mb-3 tabular-nums">
```

**Before:**
```tsx
<div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-6 md:p-8">
```

**After:**
```tsx
<div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-4 sm:p-6 md:p-8">
```

**Before (Settings 패널):**
```tsx
<div className="bg-surface-card rounded-xl shadow-lg border border-border-subtle p-6 space-y-4">
```

**After:**
```tsx
<div className="bg-surface-card rounded-xl shadow-lg border border-border-subtle p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
```

---

### Auth.tsx

**Before (Input 필드):**
```tsx
className="w-full px-4 py-3 border-2 border-border-default rounded-lg..."
```

**After:**
```tsx
className="w-full px-4 py-3 text-base border-2 border-border-default rounded-lg..."
```

**Before (Hero 텍스트):**
```tsx
<h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
```

**After:**
```tsx
<h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
```

---

### OnboardingWizard.tsx

**Before (큰 입력 필드):**
```tsx
className="w-full pl-12 pr-6 py-4 text-3xl font-bold text-center..."
```

**After:**
```tsx
className="w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 text-2xl sm:text-3xl font-bold text-center..."
```

---

## 테스트 체크리스트

- [ ] iPhone SE (375x667) - 가장 작은 현대 디바이스
- [ ] iPhone 12/13 (390x844) - 표준 사이즈
- [ ] iPhone 14 Pro Max (430x932) - 큰 화면
- [ ] Android (360x800) - 표준 안드로이드
- [ ] iPad Mini (768x1024) - 태블릿

**테스트 항목:**
- [ ] 모든 텍스트 읽기 가능
- [ ] 모든 버튼 쉽게 탭 가능 (엄지손가락으로)
- [ ] 가로 스크롤 없음
- [ ] 입력 필드 탭 시 자동 줌 없음 (iOS)
- [ ] Settings 패널이 화면 안에 맞음

---

## 구현 우선순위

**지금 바로 (10분):**
1. 런웨이 숫자 크기 증가
2. 카드 패딩 조정
3. Settings 스크롤 추가

**베타 전 (20분):**
4. Input 폰트 크기 통일
5. 버튼 최소 크기 보장
6. 텍스트 줄바꿈 개선

**베타 후:**
7. 제스처 지원
8. 햅틱 피드백
