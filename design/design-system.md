# 디자인 시스템
Personal Runway Calculator - 일관된 UI를 위한 규칙

---

## 🎨 색상 팔레트

### Primary Colors (테마별)
```
whiteBlue:   Blue-600 (#2563eb)
whiteBlack:  Gray-900 (#111827)
skyGreen:    Lime-600 (#65a30d)
mint:        Emerald-600 (#059669)
purple:      Purple-600 (#9333ea)
```

### Semantic Colors
```
Success:  Green-500  (#22c55e)
Warning:  Yellow-500 (#eab308)
Danger:   Red-500    (#ef4444)
Info:     Blue-500   (#3b82f6)
```

### Neutral Scale
```
Gray-50:  #f9fafb  (배경)
Gray-100: #f3f4f6  (카드 배경)
Gray-200: #e5e7eb  (보더)
Gray-500: #6b7280  (캡션)
Gray-600: #4b5563  (본문)
Gray-700: #374151  (제목)
Gray-900: #111827  (강조)
```

---

## 🔤 타이포그래피

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
| 클래스 | 크기 | 용도 | 예시 |
|--------|------|------|------|
| `text-display` | 60px (3.75rem) | 히어로 숫자 | 런웨이 "23개월" |
| `text-h1` | 36px (2.25rem) | 페이지 제목 | "💰 Personal Runway" |
| `text-h2` | 24px (1.5rem) | 섹션 제목 | "Recent Expenses" |
| `text-h3` | 20px (1.25rem) | 서브섹션 | "This Month's Budget" |
| `text-body-lg` | 18px (1.125rem) | 강조 본문 | 감성 메시지 |
| `text-body` | 16px (1rem) | 기본 본문 | 설명 텍스트 |
| `text-caption` | 14px (0.875rem) | 캡션/라벨 | "Total Income" |
| `text-xs` | 12px (0.75rem) | 메타 정보 | 날짜, 태그 |

### Font Weights
```
Regular: 400  (본문)
Semibold: 600 (제목, 강조)
Bold: 700     (히어로, 숫자)
```

---

## 📏 간격 & 그리드

### Spacing Scale (Tailwind 기본)
```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
```

### Container Max Width
```
max-w-4xl: 896px (메인 컨테이너)
max-w-6xl: 1152px (대시보드 확장 시)
```

### Border Radius
```
rounded-lg:  8px   (기본 카드)
rounded-xl:  12px  (중요 카드)
rounded-2xl: 16px  (히어로 카드)
rounded-full: 9999px (버튼, 프로그레스)
```

---

## 🃏 컴포넌트 라이브러리

### Button
```tsx
// Primary
className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold 
           transform active:scale-95 transition-all shadow-md hover:shadow-lg"

// Secondary
className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold
           transition-all"

// Danger
className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold
           transform active:scale-95 transition-all"

// Icon Only
className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
```

### Card
```tsx
// Tier 1 (Hero)
className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-blue-100
           transform hover:scale-105 transition-transform"

// Tier 2 (Important)
className="bg-white rounded-xl shadow-lg p-5 border border-gray-200"

// Tier 3 (List Item)
className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
```

### Input
```tsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg
           focus:ring-2 focus:ring-blue-500 focus:border-transparent
           transition-all text-gray-900 placeholder-gray-400"
```

### Progress Bar
```tsx
// Container
className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"

// Fill
className="h-full bg-blue-500 rounded-full transition-all duration-500"
style={{ width: `${percent}%` }}
```

---

## 🎭 애니메이션

### Transitions
```css
/* 기본 */
transition-all duration-200 ease-in-out

/* 부드러운 변화 */
transition-all duration-300 ease-out

/* 드라마틱 */
transition-all duration-500 ease-in-out
```

### Hover Effects
```tsx
// 스케일
transform hover:scale-105 transition-transform

// 그림자
hover:shadow-xl transition-shadow

// 색상
hover:bg-blue-700 transition-colors
```

### Loading States
```tsx
// 스피너
<svg className="animate-spin h-5 w-5">...</svg>

// 펄스
<div className="animate-pulse bg-gray-200 h-4 rounded" />
```

---

## ♿ 접근성 (A11y)

### Color Contrast
- **AA 기준:** 4.5:1 (일반 텍스트), 3:1 (큰 텍스트)
- **AAA 기준:** 7:1 (일반 텍스트), 4.5:1 (큰 텍스트)

**검증:**
- Gray-600 on White: 7.2:1 ✅ AAA
- Gray-500 on White: 4.6:1 ✅ AA
- Blue-600 on White: 8.6:1 ✅ AAA

### Focus States
```tsx
focus:ring-2 focus:ring-blue-500 focus:outline-none
```

### ARIA Labels
```tsx
<button aria-label="지출 추가" title="지출 추가">
  +
</button>
```

---

## 📱 반응형 Breakpoints

```css
sm:  640px   (큰 폰)
md:  768px   (태블릿)
lg:  1024px  (작은 데스크톱)
xl:  1280px  (데스크톱)
2xl: 1536px  (큰 데스크톱)
```

### 반응형 패턴
```tsx
// 모바일: 1컬럼, 데스크톱: 3컬럼
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 작은 화면에서 숨기기
<div className="hidden lg:block">

// 큰 화면에서 숨기기
<div className="lg:hidden">
```

---

## 🎯 사용 예시

### 런웨이 카드
```tsx
<div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-blue-100">
  <h2 className="text-h3 font-semibold text-gray-700 mb-4">
    Your Financial Runway
  </h2>
  <div className="text-display font-bold text-gray-900 tabular-nums">
    23<span className="text-h2 text-gray-500">개월</span>
  </div>
  <p className="text-body-lg text-gray-600 mt-4">
    안정적이에요. 계획대로 가고 있습니다.
  </p>
</div>
```

### Stat Card
```tsx
<div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
  <div className="flex items-center justify-between mb-2">
    <span className="text-2xl">💰</span>
    <span className="text-caption text-gray-500">Total Income</span>
  </div>
  <div className="text-h2 font-bold text-green-600">
    $125,000
  </div>
</div>
```

---

**버전:** 1.0.0  
**마지막 업데이트:** 2026-02-13
