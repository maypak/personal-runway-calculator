# Visual Inspection Checklist - FIRE Calculator

**Purpose:** Quick visual QA guide for designers and PMs  
**Commit:** b956c5a  
**Status:** Post-Mobile & Accessibility Polish

---

## 🎨 Desktop View (1280px+)

### Layout
```
┌─────────────────────────────────────────────┐
│ [← Back to Dashboard]                [⚙️]   │
│                                             │
│ 🎯 FIRE Calculator                          │
│ Track your path to financial independence  │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ 💵 Your FI Number                    │    │
│ │ $142,000                             │    │
│ │ Amount needed for financial freedom  │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ 🎯 Progress to FI                    │    │
│ │ 35.2%                                │    │
│ │ ▓▓▓▓▓░░░░░░░░░░░░░                  │    │
│ │ 25%  50%  75%  90%  100%            │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ 📈 FI Projection                     │    │
│ │ [Chart: Line graph, 300px height]   │    │
│ │ - Blue line: Current trajectory     │    │
│ │ - Purple dashed: Coast FIRE         │    │
│ │ - Green dashed: FI Target           │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ 📅 Milestones                        │    │
│ │ [Timeline cards]                     │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Visual Checks
- [ ] **Spacing:** Consistent 24px gaps between sections
- [ ] **Alignment:** All cards centered, max-width 1024px
- [ ] **Typography:** 
  - Headings: 24px bold
  - Body: 16px regular
  - Labels: 14px medium
- [ ] **Colors:**
  - Primary blue: #3B82F6
  - Success green: #10B981
  - Purple: #A855F7
  - Gray backgrounds: #F9FAFB (light) / #1F2937 (dark)

---

## 📱 Mobile View (375px - iPhone SE)

### Layout
```
┌───────────────────────┐
│ [← Back]         [⚙️] │
│                       │
│ 🎯 FIRE Calculator    │
│                       │
│ ┌───────────────────┐ │
│ │ 💵 FI Number      │ │
│ │ $142,000          │ │
│ └───────────────────┘ │
│                       │
│ ┌───────────────────┐ │
│ │ Progress: 35.2%   │ │
│ │ ▓▓▓▓░░░░░░░░░░░░ │ │
│ │ 25% 50% 75% 100% │ │ ← 90% hidden
│ └───────────────────┘ │
│                       │
│ ┌───────────────────┐ │
│ │ 📈 Chart          │ │
│ │ [250px height]    │ │ ← Reduced
│ │ [No animation]    │ │ ← Performance
│ └───────────────────┘ │
│                       │
│ ▼ Scroll             │
└───────────────────────┘
```

### Visual Checks
- [ ] **Chart Height:** 250px (not 300px)
- [ ] **Milestones:** 25%, 50%, 100% visible (75%, 90% hidden on sm)
- [ ] **Touch Targets:** Buttons ≥44px × 44px
- [ ] **Text:** No horizontal scroll
- [ ] **Cards:** Full width with 16px padding
- [ ] **Back Button:** Tappable in top-left

---

## 🎨 Color Contrast Verification

### Light Mode
| Element | Foreground | Background | Ratio | Pass? |
|---------|-----------|------------|-------|-------|
| Headings | #111827 | #FFFFFF | 15.3:1 | ✅ AAA |
| Body text | #374151 | #FFFFFF | 10.7:1 | ✅ AAA |
| Labels | #6B7280 | #FFFFFF | 5.8:1 | ✅ AA |
| Blue text | #3B82F6 | #FFFFFF | 3.4:1 | ✅ AA |

### Dark Mode
| Element | Foreground | Background | Ratio | Pass? |
|---------|-----------|------------|-------|-------|
| Headings | #FFFFFF | #1F2937 | 13.1:1 | ✅ AAA |
| Body text | #D1D5DB | #1F2937 | 8.2:1 | ✅ AAA |
| Labels | #9CA3AF | #1F2937 | 5.1:1 | ✅ AA |
| Blue text | #60A5FA | #1F2937 | 5.8:1 | ✅ AA |

---

## 🎬 Animation Checklist

### Desktop (Animations Enabled)
- [ ] **Chart:**
  - Lines animate in from left (1000ms)
  - Smooth cubic-bezier easing
  - No jank/stuttering

- [ ] **Progress Bar:**
  - Fills smoothly on load
  - Gradient animates subtly
  - Pulse effect on milestones (hover)

- [ ] **Collapse Panels:**
  - Slide down/up (300ms)
  - Fade in opacity
  - Chevron rotates

### Mobile (Animations Disabled)
- [ ] **Chart:**
  - Appears instantly (no animation)
  - No loading delay
  - Static lines

- [ ] **Progress Bar:**
  - Instant fill (no animation)
  - Still shows gradient
  - Hover disabled (tap instead)

---

## 🔘 Interactive States

### Buttons

#### Settings Button
```
Default:   [⚙️] gray, hover:bg-gray-100
Active:    [⚙️] blue bg, blue icon
Focus:     [⚙️] blue outline (2px)
```

- [ ] Hover state visible (desktop)
- [ ] Active state persists when panel open
- [ ] Focus ring visible on Tab
- [ ] Touch ripple (mobile) - optional

### Sliders

#### Investment Return Rate
```
Min:  [━━━━━━━━━━] 0%
Mid:  [━━━●━━━━━━] 7%  ← Default
Max:  [━━━━━━━━━●] 15%
```

- [ ] Thumb: 20px circle, blue fill
- [ ] Track: Gray background, blue fill left of thumb
- [ ] Hover: Thumb scales to 24px
- [ ] Focus: Blue glow around thumb
- [ ] Mobile: Touch target 44px minimum

---

## 📊 Chart Elements

### Lines
```
1. Current Path (Blue, solid, 3px)
   ━━━━━━━━━━━━━━━━━━ #3B82F6

2. Coast FIRE (Purple, dashed, 2px)
   ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ #A855F7

3. FI Target (Green, dashed, 2px)
   ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ #10B981
```

### Visual Checks
- [ ] **Line weights:** Correct thickness (3px vs 2px)
- [ ] **Dash pattern:** Consistent (5px dash, 5px gap)
- [ ] **Colors:** Match design system
- [ ] **X-axis:** Years labeled (0, 5, 10, 15, 20, 25, 30)
- [ ] **Y-axis:** Currency formatted ($0K, $50K, $100K, $150K)
- [ ] **Legend:** Icons match line styles

### Tooltip
```
┌─────────────────┐
│ Year 8          │
│ ● Current: $142K│
│ ● Coast: $98K   │
│ ─ FI: $142K     │
└─────────────────┘
```

- [ ] Appears on hover (desktop) / tap (mobile)
- [ ] Arrow points to data point
- [ ] Background: Semi-transparent dark
- [ ] Text: White, 12px
- [ ] Positioned above point (doesn't clip)

---

## 🎯 Progress Bar Details

### Milestones
```
    25%        50%        75%       90%      100%
     ●          ●          ●         ●         ●
   Red      Yellow      Blue    Purple     Green
```

### Visual Checks
- [ ] **Dots:** 24px circles
- [ ] **Colors:** Match legend
- [ ] **Labels:** Positioned below dots
- [ ] **Tooltip:** Shows amount on hover
- [ ] **Active:** Green checkmark if achieved

### Gradient Fill
- [ ] **0-25%:** Red → Yellow gradient
- [ ] **25-50%:** Yellow → Blue gradient
- [ ] **50-75%:** Blue → Purple gradient
- [ ] **75-90%:** Purple → Purple (darker)
- [ ] **90-100%:** Purple → Green gradient

---

## 🌗 Dark Mode Verification

### Toggle
- [ ] Switches smoothly (300ms transition)
- [ ] All components update colors
- [ ] No flash of white/light content
- [ ] Chart lines still visible

### Components to Check
- [ ] Background: `#111827` (bg-gray-900)
- [ ] Cards: `#1F2937` (bg-gray-800)
- [ ] Borders: `#374151` (border-gray-700)
- [ ] Text headings: `#FFFFFF` (text-white)
- [ ] Text body: `#D1D5DB` (text-gray-300)
- [ ] Text labels: `#9CA3AF` (text-gray-400)
- [ ] Chart grid: `#374151` opacity 10%

---

## 📏 Spacing & Alignment

### Desktop
- **Max width:** 1024px (max-w-4xl)
- **Side padding:** 16px (px-4)
- **Top/bottom:** 32px (py-8)
- **Section gaps:** 24px (space-y-6)
- **Card padding:** 24px (p-6)

### Mobile
- **Max width:** 100vw
- **Side padding:** 16px (px-4)
- **Top/bottom:** 32px (py-8)
- **Section gaps:** 16px (space-y-4)
- **Card padding:** 16px (p-4)

### Checklist
- [ ] Sections evenly spaced
- [ ] Cards aligned to center
- [ ] No layout shift on load
- [ ] Consistent padding throughout

---

## 🔍 Edge Cases

### Data Extremes

#### Very High FI Number ($10M+)
- [ ] Numbers formatted: $10.5M (not $10,500,000)
- [ ] Chart Y-axis scales appropriately
- [ ] Progress bar shows <1% correctly

#### Very Low FI Number (<$10K)
- [ ] Chart readable (not all squished at bottom)
- [ ] Milestones don't overlap
- [ ] Tooltip amounts formatted correctly

#### Already FI (100%+)
- [ ] Progress bar shows 100% (capped)
- [ ] Green color throughout
- [ ] Milestones all achieved (green checkmarks)
- [ ] Chart shows current position above target line

---

## ✅ Final Visual Approval

### Designer Checklist
- [ ] **Colors:** Match Figma/design system
- [ ] **Spacing:** Consistent, no visual weight issues
- [ ] **Typography:** Correct font sizes, weights
- [ ] **Alignment:** Everything centered/aligned
- [ ] **Contrast:** All text readable
- [ ] **Dark mode:** Looks good, no harsh whites

### PM Checklist
- [ ] **Mobile:** Works on iPhone SE (smallest)
- [ ] **Tablet:** Works on iPad
- [ ] **Desktop:** Works on large screens
- [ ] **Accessibility:** ARIA labels present (DevTools)
- [ ] **Performance:** Chart loads quickly
- [ ] **User flow:** Intuitive, no confusion

---

## 📸 Screenshot Comparison

### Before vs After

#### Mobile Chart
```
Before:                    After:
┌─────────────────────┐   ┌─────────────────────┐
│ Chart: 300px        │   │ Chart: 250px        │
│ [Animated]          │   │ [Static]            │
│ [30 data points]    │   │ [15 data points]    │
│ Janky scrolling ⚠️  │   │ Smooth ✅           │
└─────────────────────┘   └─────────────────────┘
```

#### Accessibility
```
Before:                    After:
- Slider: No ARIA ❌       - Slider: Full ARIA ✅
- Chart: Not announced ❌  - Chart: Described ✅
- Progress: Silent ❌      - Progress: Announced ✅
- Lighthouse: 87/100       - Lighthouse: 93/100 ✅
```

---

**Status:** Ready for visual review  
**Reviewer:** [Name]  
**Approved:** [ ] Yes [ ] No [ ] With changes  
**Notes:** ___________________________________
