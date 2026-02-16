# Design Overhaul Specification
**Date:** 2026-02-16  
**Goal:** Professional UI/UX polish for beta launch  
**Reference:** Dropbox-style Storage UI + File Management UI  
**Timeline:** 7-10 hours (Full completion)

---

## 🎯 External Designer Feedback (11 Issues)

### P0 - Critical (가독성)
1. ✅ **#8 - Placeholder & Input 가독성 최악**
   - 현재: `rgba(0,0,0,0.3)` → 거의 안 보임
   - 목표: `#A0AEC0` (참고 디자인 수준)
   - 입력값도 명확히: `#1E1E2D`

2. ✅ **#7 - Disabled state 가독성 나쁨**
   - 현재: `opacity: 0.5` → 극단적 어두움
   - 목표: `#E5E7EB` background + `#9CA3AF` text + `cursor: not-allowed`

### P1 - High (UX 품질)
3. ✅ **#9 - Emoji → Icon Library**
   - 제거: 💰💸📈🎯📊
   - 추가: Lucide React icons
   - 모바일 Sign Out → Settings 내부로 이동

4. ✅ **#3 - Loading State 허전**
   - Skeleton UI 추가 (animate-pulse)
   - Progress indicator

5. ✅ **#10 - Hover → Active Effect + Micro-interactions**
   - `transform: scale(0.98)` on click
   - Background color shift
   - 200ms transition

### P2 - Medium (폴리싱)
6. ✅ **#1 - Font size/line height 강약 극단적**
   - 현재: 12-18-32-48px
   - 목표: 14-16-20-24px (적당한 스케일)

7. ✅ **#2 - Animation 사이즈 변동 극단적**
   - Duration: 300ms → 200ms
   - Easing: cubic-bezier(0.4, 0, 0.2, 1)

8. ✅ **#5 - Radius/Shadow 조잡**
   - Border radius: 8px → 12px (cards), 16px (modals)
   - Box shadow: `0 2px 8px rgba(0,0,0,0.06)` (subtle)

9. ✅ **#6 - 컬러 단조로움**
   - Light mode: #F0F4F8 배경, #2E7CF6 Primary
   - Dark mode: #1B1B3A 배경, #6C63FF Accent
   - Gradient 추가 (CTA buttons)

### P3 - Nice to have
10. ✅ **#11 - Dark/Light 선택 + 강조색 컨트롤**
    - Theme switcher component
    - Accent color picker (5 presets)

11. ✅ **#4 - 이모티콘 대체** (P1 #9와 동일)

---

## 🎨 Design System (참고 디자인 기반)

### Color Palette

#### Light Mode
```css
:root[data-theme="light"] {
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F0F4F8;
  --bg-tertiary: #F7F9FC;
  --bg-elevated: #FFFFFF;
  
  /* Surfaces */
  --surface-card: #FFFFFF;
  --surface-hover: #F8FAFC;
  --surface-active: #E8F1FE;
  
  /* Text */
  --text-primary: #1A202C;
  --text-secondary: #4A5568;
  --text-tertiary: #A0AEC0;
  --text-disabled: #CBD5E0;
  
  /* Brand */
  --primary: #2E7CF6;
  --primary-hover: #2563EB;
  --primary-active: #1D4ED8;
  --primary-light: #E8F1FE;
  
  /* Semantic */
  --success: #52C41A;
  --warning: #FAAD14;
  --error: #E53E3E;
  --info: #4299E1;
  
  /* Borders */
  --border-subtle: #E2E8F0;
  --border-default: #CBD5E0;
  --border-strong: #A0AEC0;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-xl: 0 8px 32px rgba(0,0,0,0.12);
}
```

#### Dark Mode
```css
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg-primary: #1B1B3A;
  --bg-secondary: #252550;
  --bg-tertiary: #2D2D5E;
  --bg-elevated: #363663;
  
  /* Surfaces */
  --surface-card: #252550;
  --surface-hover: #2D2D5E;
  --surface-active: #363663;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #E0E0F0;
  --text-tertiary: #7E7EA0;
  --text-disabled: #4A4A6E;
  
  /* Brand */
  --primary: #6C63FF;
  --primary-hover: #5A52E0;
  --primary-active: #4942C8;
  --primary-light: rgba(108, 99, 255, 0.15);
  
  /* Semantic */
  --success: #73D13D;
  --warning: #FFC53D;
  --error: #FF4D4F;
  --info: #40A9FF;
  
  /* Borders */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.20);
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.2);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.3);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-xl: 0 8px 32px rgba(0,0,0,0.5);
}
```

### Typography Scale
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px - body */
  --text-base: 1rem;    /* 16px - default */
  --text-lg: 1.125rem;  /* 18px - heading 3 */
  --text-xl: 1.25rem;   /* 20px - heading 2 */
  --text-2xl: 1.5rem;   /* 24px - heading 1 */
  --text-3xl: 2rem;     /* 32px - hero */
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing System
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
}
```

### Border Radius
```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}
```

---

## 🔧 Component-Level Changes

### 1. Input Fields
**File:** `app/components/FinanceDashboardSupabase.tsx`

**Before:**
```tsx
<input
  className="w-full px-3 py-2 border rounded-lg"
  placeholder="Enter amount"
/>
```

**After:**
```tsx
<input
  className="w-full px-4 py-3 
    bg-surface-card
    border border-border-default
    rounded-lg
    text-text-primary placeholder:text-text-tertiary
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    disabled:bg-bg-tertiary disabled:text-text-disabled disabled:cursor-not-allowed
    transition-all duration-200"
  placeholder="Enter amount"
/>
```

### 2. Buttons
**File:** `app/components/*.tsx` (모든 버튼)

**Primary Button:**
```tsx
<button className="px-6 py-3 
  bg-primary hover:bg-primary-hover active:bg-primary-active
  text-white font-medium rounded-lg
  shadow-md hover:shadow-lg
  active:scale-[0.98]
  disabled:bg-bg-tertiary disabled:text-text-disabled disabled:cursor-not-allowed
  transition-all duration-200">
  Save Settings
</button>
```

**Secondary Button:**
```tsx
<button className="px-6 py-3 
  bg-surface-card hover:bg-surface-hover active:bg-surface-active
  text-text-primary font-medium rounded-lg
  border border-border-default
  active:scale-[0.98]
  transition-all duration-200">
  Cancel
</button>
```

### 3. Cards
**File:** `app/components/FinanceDashboardSupabase.tsx`

**Before:**
```tsx
<div className="bg-white rounded-lg shadow p-6">
```

**After:**
```tsx
<div className="bg-surface-card rounded-xl shadow-md 
  border border-border-subtle
  p-6 transition-all duration-200
  hover:shadow-lg">
```

### 4. Loading Skeleton
**New Component:** `app/components/SkeletonLoader.tsx`

```tsx
export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Runway Card */}
      <div className="h-32 bg-bg-tertiary rounded-xl" />
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 bg-bg-tertiary rounded-lg" />
        <div className="h-24 bg-bg-tertiary rounded-lg" />
        <div className="h-24 bg-bg-tertiary rounded-lg" />
        <div className="h-24 bg-bg-tertiary rounded-lg" />
      </div>
      
      {/* Expense List */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-bg-tertiary rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

### 5. Icon Replacement
**Install:**
```bash
npm install lucide-react
```

**Replacements:**
| Emoji | Lucide Icon | Usage |
|-------|-------------|-------|
| 💰 | `<Wallet />` | Financial Settings |
| 💸 | `<TrendingDown />` | Expenses |
| 📈 | `<TrendingUp />` | Income |
| 🎯 | `<Target />` | Goals |
| 📊 | `<BarChart3 />` | Statistics |
| ⚙️ | `<Settings />` | Settings |
| 🚪 | `<LogOut />` | Sign Out |

**Example:**
```tsx
import { Wallet, TrendingDown, TrendingUp, Target, BarChart3, Settings, LogOut } from 'lucide-react';

<div className="flex items-center gap-2">
  <Wallet className="w-5 h-5 text-primary" />
  <span>Current Savings</span>
</div>
```

### 6. Mobile Sign Out
**Before:**
```tsx
<button className="sm:hidden">🚪 Exit</button>
```

**After:**
```tsx
// Remove from header
// Add to Settings dropdown:
<div className="sm:hidden mt-4 pt-4 border-t border-border-subtle">
  <button className="w-full flex items-center gap-2 px-4 py-2 text-error hover:bg-surface-hover rounded-lg transition-colors">
    <LogOut className="w-4 h-4" />
    <span>Sign Out</span>
  </button>
</div>
```

---

## 🎬 Animation Guidelines

### Transitions
```css
/* Fast interactions */
.transition-fast {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Normal interactions */
.transition-normal {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slow/smooth movements */
.transition-slow {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Micro-interactions
```tsx
// Button press
<button className="active:scale-[0.98] transition-transform duration-150">

// Card hover
<div className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

// Input focus
<input className="focus:ring-2 focus:ring-primary transition-shadow duration-150">
```

---

## 📱 Responsive Breakpoints
```css
/* Mobile first */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
```

---

## ✅ Acceptance Criteria

### Visual Polish
- [ ] All text legible in both light/dark modes (WCAG AA contrast ratio)
- [ ] No emoji icons remaining (Lucide icons only)
- [ ] Consistent border-radius (12px cards, 16px modals)
- [ ] Subtle shadows (no harsh blacks)
- [ ] Smooth animations (200ms default)

### Interactions
- [ ] Active states on all buttons (scale-98)
- [ ] Disabled states clearly visible (not-allowed cursor)
- [ ] Loading skeleton during data fetch
- [ ] Hover effects on interactive elements

### Accessibility
- [ ] Placeholder text contrast ≥ 4.5:1
- [ ] Disabled elements contrast ≥ 3:1
- [ ] Focus indicators visible
- [ ] Icon + text labels (not icon-only)

### Mobile
- [ ] Sign Out inside Settings menu
- [ ] Touch targets ≥ 44px
- [ ] No accidental logout button taps

---

## 🚀 Implementation Order

### Phase 1: Foundation (2-3 hours)
1. ✅ Install Lucide React
2. ✅ Create `globals.css` with CSS variables
3. ✅ Add theme switcher hook
4. ✅ Update Tailwind config with design tokens

### Phase 2: Components (3-4 hours)
5. ✅ Replace all emoji with Lucide icons
6. ✅ Update input/button/card styles
7. ✅ Add loading skeletons
8. ✅ Implement active states

### Phase 3: Polish (2-3 hours)
9. ✅ Refine animations
10. ✅ Mobile sign-out relocation
11. ✅ Contrast audit (WCAG)
12. ✅ Final testing (light/dark modes)

---

## 📸 Before/After Screenshots
*To be captured after implementation*

---

## 🔗 References
- Dropbox UI: `file_17---5fb6c308-df9d-4fec-a867-2aada905d8e6.jpg`
- File Management UI: `file_18---e601aaf0-dba3-4cdb-a9d4-64e6a358d355.jpg`
- Lucide Icons: https://lucide.dev/icons/
- Tailwind CSS Variables: https://tailwindcss.com/docs/customizing-colors#using-css-variables
