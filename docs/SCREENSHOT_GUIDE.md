# Screenshot Guide for Marketing Materials

## 🎯 Purpose
Create 5 professional screenshots for Product Hunt, Reddit, website, and social media.

## 📸 Screenshots Needed

### 1. Hero Shot - Dashboard Overview
**URL:** `https://personal-runway-calculator.vercel.app/dashboard`
**Focus:** Main dashboard with sample data
**Viewport:** 1920x1080 (desktop)
**Data to show:**
- Monthly expenses: $3,500
- Current savings: $45,000
- Monthly income: $5,800
- Runway: 19.5 months visualization

**Tool:** Screely.com
**Settings:**
- Browser: Chrome (light mode)
- Background: Gradient (default)
- Padding: Medium
- Shadow: Yes

**File name:** `01-dashboard-overview.png`

---

### 2. Scenario Planning (Future P0-2)
**URL:** Wait until P0-2 ships (Week 2)
**Focus:** Scenario comparison feature
**Viewport:** 1920x1080
**Data to show:**
- 3 scenarios: "Current", "Freelance", "Side Project"
- Comparison chart showing runway differences

**File name:** `02-scenario-comparison.png`

---

### 3. FIRE Calculator (Future P0-3)
**URL:** Wait until P0-3 ships (Week 3)
**Focus:** FIRE date calculation
**Viewport:** 1920x1080
**Data to show:**
- FI Number calculation
- Progress visualization
- Projected FI date

**File name:** `03-fire-calculator.png`

---

### 4. Income Tracking
**URL:** `https://personal-runway-calculator.vercel.app/dashboard` (income section)
**Focus:** Income tracking with multiple sources
**Viewport:** 1920x1080
**Data to show:**
- Salary: $4,500
- Freelance: $800
- Side Project: $500
- Total: $5,800/month

**File name:** `04-income-tracking.png`

---

### 5. Mobile View
**URL:** `https://personal-runway-calculator.vercel.app/dashboard`
**Focus:** Mobile responsive design
**Viewport:** 375x667 (iPhone SE)
**Data to show:** Same dashboard but mobile layout

**Tool:** Screely.com (Mobile device option)

**File name:** `05-mobile-responsive.png`

---

## 🛠️ How to Create (Step-by-Step)

### Step 1: Prepare Sample Data
1. Login to production: https://personal-runway-calculator.vercel.app
2. Create test account or use existing
3. Input realistic sample data:
   - Expenses: $3,500/month (rent $1,500, food $600, utilities $200, misc $1,200)
   - Income: $5,800/month (salary $4,500, freelance $800, side $500)
   - Savings: $45,000

### Step 2: Take Screenshots
1. Open production URL in Chrome (incognito if needed)
2. Set viewport to 1920x1080 (or use browser dev tools)
3. Make sure UI looks clean:
   - No console errors
   - All data loaded
   - Dark/Light mode as needed
4. Take screenshot:
   - Mac: `Cmd + Shift + 4` → Space → Click window
   - Or use built-in browser screenshot tools

### Step 3: Polish with Screely.com
1. Go to https://screely.com
2. Upload raw screenshot
3. Settings:
   - Browser frame: Chrome
   - Background: Gradient or solid color
   - Padding: Medium
   - Shadow: Yes
   - Instant: Yes (for speed)
4. Download PNG

### Step 4: Save to Project
```bash
mkdir -p docs/marketing/screenshots
mv ~/Downloads/01-dashboard-overview.png docs/marketing/screenshots/
```

---

## 📋 Checklist

Before releasing screenshots:

- [ ] All data is realistic and professional
- [ ] No test data like "asdf" or "test@test.com"
- [ ] UI is clean (no console errors visible)
- [ ] Charts render properly
- [ ] Light mode screenshots (or dark mode if specified)
- [ ] Consistent browser chrome across all shots
- [ ] File names follow convention: `01-description.png`
- [ ] Resolution: At least 1920x1080 for desktop, 750x1334 for mobile
- [ ] File size: Under 500KB each (optimize if needed)

---

## 🎨 Design Principles

1. **Consistency:** Use same browser frame, background style
2. **Realism:** Show realistic data that users can relate to
3. **Clarity:** Focus on one key feature per screenshot
4. **Quality:** High resolution, no artifacts or blurriness
5. **Story:** Together, screenshots should tell the product story

---

## 📦 Output Location

Save all screenshots to:
```
docs/marketing/screenshots/
├── 01-dashboard-overview.png
├── 02-scenario-comparison.png (after P0-2)
├── 03-fire-calculator.png (after P0-3)
├── 04-income-tracking.png
└── 05-mobile-responsive.png
```

---

## 🚀 Quick Start (Current - 2 screenshots available)

**Right now, we can create:**
1. Dashboard overview (#1)
2. Mobile view (#5)

**After P0-2 (Week 2):**
3. Scenario comparison (#2)

**After P0-3 (Week 3):**
4. FIRE calculator (#3)

**Note:** Screenshots #2 and #3 require features not yet shipped. Create #1, #4, #5 first.

---

## 🔧 Troubleshooting

**Issue:** Screenshot looks blurry on Screely
- **Fix:** Upload higher resolution (2x or 3x)

**Issue:** Data doesn't look realistic
- **Fix:** Use these realistic samples:
  - Expenses: $2,800-$4,500/month
  - Income: $4,000-$7,000/month
  - Savings: $25,000-$75,000

**Issue:** Dark mode screenshots look better
- **Fix:** Use dark mode! Just be consistent across all 5

**Issue:** File size too large
- **Fix:** Use TinyPNG.com or ImageOptim.app to compress

---

**Next step:** Create screenshots #1 and #5 today (30 min total)
