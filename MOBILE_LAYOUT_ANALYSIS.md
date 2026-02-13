# 📱 모바일 레이아웃 분석 및 개선 제안

**시니어 프로덕트 디자이너**  
**날짜:** 2026-02-13  
**타겟:** Personal Runway Calculator - Mobile UX

---

## 📊 현재 모바일 대응 상태

### ✅ 이미 잘 구현된 부분

1. **반응형 그리드**
   ```tsx
   // Auth.tsx
   <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
   ```
   - ✅ 모바일: 1열 세로 배치
   - ✅ 데스크톱: 2열 Split layout

2. **적응형 텍스트 크기**
   ```tsx
   <h2 className="text-3xl md:text-5xl font-bold">
   ```
   - ✅ 모바일: 3xl (작은 화면 최적화)
   - ✅ 데스크톱: 5xl (큰 화면 활용)

3. **버튼 라벨 축약**
   ```tsx
   <span className="hidden sm:inline">Sign Out</span>
   <span className="sm:hidden">Exit</span>
   ```
   - ✅ 모바일에서 공간 절약

4. **터치 친화적 버튼 크기**
   ```tsx
   className="px-4 py-3"  // 최소 44px 이상 (Apple HIG 권장)
   ```

---

## ⚠️ 개선이 필요한 부분

### 1️⃣ **Simulator 슬라이더 - 모바일에서 조작 어려움**

**문제:**
```tsx
<input type="range" className="w-full h-3" />
```
- `h-3` (12px) = 터치 타겟 너무 작음
- 모바일에서 정확한 슬라이더 조작 어려움

**해결책:**
```tsx
<input 
  type="range" 
  className="w-full h-3 appearance-none cursor-pointer
    [&::-webkit-slider-thumb]:w-5 
    [&::-webkit-slider-thumb]:h-5 
    [&::-webkit-slider-thumb]:bg-purple-600 
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:shadow-md"
/>
```
- Thumb 크기 20px → 터치 타겟 확보
- 시각적 피드백 강화 (shadow)

**우선순위:** 🟡 YELLOW (다음 주)

---

### 2️⃣ **Settings 패널 - 모바일에서 스크롤 과다**

**문제:**
- Settings 패널이 인라인으로 열림 → 콘텐츠 밀림
- 6개 입력 필드 = 화면 3배 이상 길이

**해결책: Bottom Sheet 패턴**
```tsx
// React Spring 또는 Framer Motion 사용
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: showSettings ? 0 : '100%' }}
  className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
>
  {/* Settings content */}
</motion.div>
```

**장점:**
- iOS/Android 네이티브 패턴 (사용자 익숙함)
- 콘텐츠 밀림 없음
- 스와이프로 닫기 가능

**우선순위:** 🟡 YELLOW (Sprint 3: Mobile-First)

---

### 3️⃣ **Expense List - 스와이프 제스처 없음**

**현재:**
- Delete 버튼으로만 삭제 가능
- 버튼이 공간 차지

**개선안: Swipe to Delete**
```tsx
// react-swipeable 또는 framer-motion 사용
<motion.div
  drag="x"
  dragConstraints={{ left: -80, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x < -50) {
      deleteExpense(exp.id);
    }
  }}
>
  {/* Expense item */}
</motion.div>
```

**장점:**
- iOS Mail 스타일 (직관적)
- UI 공간 절약
- 빠른 삭제 액션

**우선순위:** 🟢 GREEN (Quick Win 후속, 1일)

---

### 4️⃣ **Sticky Header - 스크롤 시 Runway 숫자 사라짐**

**문제:**
- Runway 카드가 상단에만 있음
- 스크롤하면 "내가 몇 개월인지" 잊어버림
- 불안감 유발

**해결책: Sticky Mini Header**
```tsx
<div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-2 shadow-sm">
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">Your Runway</span>
    <span className="text-2xl font-bold text-blue-600">{runway}mo</span>
  </div>
</div>
```

**트리거:**
- 메인 Runway 카드가 화면 밖으로 나가면 나타남
- IntersectionObserver 사용

**우선순위:** 🟡 YELLOW (Sprint 3)

---

### 5️⃣ **Theme Picker - 모바일에서 작은 터치 타겟**

**문제:**
```tsx
<button className="px-3 py-2 md:px-4">🎨</button>
```
- 이모지 버튼 작음 (≈40px)
- 드롭다운이 화면 밖으로 나갈 수 있음

**해결책:**
1. **버튼 크기 증가**
   ```tsx
   <button className="p-3 min-w-[44px] min-h-[44px]">🎨</button>
   ```

2. **드롭다운 위치 조정**
   ```tsx
   <div className="absolute top-12 right-0 sm:right-0 left-0 sm:left-auto">
   ```
   - 모바일: 전체 폭
   - 데스크톱: 오른쪽 정렬

**우선순위:** 🟢 GREEN (Quick Win, 10분)

---

### 6️⃣ **Expense Form - 키보드 올라올 때 Submit 버튼 가려짐**

**문제:**
- iOS에서 키보드 올라오면 하단 버튼 안 보임
- 스크롤해야 Submit 가능

**해결책:**
```tsx
// 키보드 올라올 때 자동 스크롤
useEffect(() => {
  if (showExpenseForm) {
    setTimeout(() => {
      document.getElementById('expense-submit')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300); // 키보드 애니메이션 후
  }
}, [showExpenseForm]);
```

**우선순위:** 🟡 YELLOW (유저 피드백 후)

---

## 🎯 모바일 최적화 로드맵

### Phase 1: Quick Wins (1-2일)
- [ ] Theme Picker 터치 타겟 증가
- [ ] Simulator 슬라이더 Thumb 크기 증대
- [ ] Expense 항목 간격 증가 (터치 실수 방지)

### Phase 2: 제스처 추가 (3일)
- [ ] Swipe to Delete (Expense)
- [ ] Swipe to Disable (Recurring Expense)
- [ ] Pull to Refresh (데이터 새로고침)

### Phase 3: 네이티브 패턴 (5일)
- [ ] Bottom Sheet (Settings, Add Forms)
- [ ] Sticky Mini Header
- [ ] Haptic Feedback (iOS/Android)

---

## 📏 모바일 디자인 가이드라인

### 터치 타겟 크기
- ✅ 최소: 44x44px (Apple HIG)
- ✅ 권장: 48x48px (Material Design)
- ✅ 편안함: 56x56px

### 간격 (Spacing)
- ✅ 아이템 간 최소: 8px
- ✅ 터치 요소 간: 12-16px
- ✅ 섹션 간: 24px

### 폰트 크기
- ✅ 본문 최소: 16px (작으면 확대 유도)
- ✅ 버튼 텍스트: 16-18px
- ✅ 헤딩: 24-32px

### 애니메이션
- ✅ 빠른 피드백: 150-200ms
- ✅ 화면 전환: 300-400ms
- ✅ 자연스러움: easing (cubic-bezier)

---

## 🔍 현재 코드 감사 결과

### ✅ 통과 (잘 구현됨)
1. **반응형 브레이크포인트** (sm:, md:, lg:)
2. **모바일 우선 클래스** (기본 = 모바일, md: = 데스크톱)
3. **적절한 패딩/마진** (px-4, py-3 등)
4. **Overflow 처리** (rounded-xl, overflow-hidden)

### ⚠️ 개선 필요
1. **일부 터치 타겟 < 44px**
   - 예: Theme Picker, 일부 작은 버튼
2. **슬라이더 Thumb 크기**
   - 기본 크기 너무 작음
3. **인라인 패널** (Settings, Forms)
   - 콘텐츠 밀림 → Bottom Sheet 권장

---

## 📱 테스트 디바이스 권장사항

### 우선순위 High
- **iPhone SE (3rd gen)** - 작은 화면 (4.7")
- **iPhone 14 Pro** - 노치 + Dynamic Island
- **Samsung Galaxy A53** - 안드로이드 중급기

### 우선순위 Medium
- **iPad Mini** - 태블릿 (8.3")
- **Pixel 7** - 안드로이드 플래그십

### 테스트 체크리스트
- [ ] 세로 모드에서 모든 기능 접근 가능
- [ ] 가로 모드에서 레이아웃 깨짐 없음
- [ ] 키보드 올라올 때 Submit 버튼 접근 가능
- [ ] 한 손으로 주요 액션 가능 (하단 영역)
- [ ] 터치 타겟 실수 없이 정확히 클릭

---

## 💡 추가 제안: Progressive Web App (PWA)

### 왜 PWA?
- **모바일 사용자 경험 향상**
  - 홈 화면 추가 → 네이티브 앱처럼 사용
  - 오프라인 지원 (Service Worker)
  - 빠른 로딩 (캐싱)

### 구현 난이도
- ⭐⭐☆☆☆ (쉬움, Next.js는 대부분 지원)

### 필요한 작업
1. `manifest.json` 추가
2. Service Worker 등록
3. 아이콘 세트 (192x192, 512x512)
4. "Add to Home Screen" 프롬프트

### 개발 시간
- **2-3시간** (설정 + 테스트)

### ROI
- **높음!** 모바일 재방문율 2-3배 증가 (업계 평균)

**우선순위:** 🟡 YELLOW (PMF 후)

---

## 🏁 결론

**현재 상태:** ⭐⭐⭐⭐☆ (모바일 대응 80% 완료)

**강점:**
- ✅ 반응형 디자인 잘 구현
- ✅ 적응형 텍스트 크기
- ✅ 터치 친화적 버튼 (대부분)

**개선 여지:**
- ⚠️ 네이티브 패턴 추가 (Swipe, Bottom Sheet)
- ⚠️ 일부 터치 타겟 크기
- ⚠️ Sticky Header (스크롤 시)

**Quick Wins (1-2일):**
1. Theme Picker 터치 타겟
2. Slider Thumb 크기
3. Swipe to Delete

**큰 개선 (Sprint 3, 5일):**
1. Bottom Sheet
2. Sticky Header
3. PWA 전환

---

**다음 액션:**
- 리더와 디베이팅 후 모바일 우선순위 결정
- 유저 분석 데이터 확인 (모바일 vs 데스크톱 비율)
- Sprint 3 스코프 확정

---

**시니어 프로덕트 디자이너**  
*"Mobile is not a feature, it's the majority." - Luke Wroblewski*
