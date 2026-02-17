# 🔥 FIRE Calculator - Quick Start Guide

**How to test and use the new FIRE components**

---

## 🚀 Quick Start (Local Development)

```bash
cd personal-runway-calculator

# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## 🧪 Testing the Components

### 1. **Access FIRE Calculator**

**Option A:** From main dashboard
- Log in to app
- Click **🔥 (flame icon)** in header
- Navigate to `/fire`

**Option B:** Direct URL
- Go to `http://localhost:3000/fire`
- (Requires authentication)

---

### 2. **Test Each Component**

#### ✅ FIProgressBar
- **What to see:** Color-coded progress bar with 5 milestones
- **Test:**
  - Hover over milestone dots → Should show tooltip with $ amount
  - Progress should match your current FI progress %
  - Colors should transition: red → yellow → blue → purple → green

#### ✅ FIProjectionChart
- **What to see:** Line chart with 3 lines (current, coast, target)
- **Test:**
  - Hover any point → Custom tooltip with formatted amounts
  - Chart should be responsive (resize browser)
  - Lines should compound upward over time
  - X-axis: Years (0-30), Y-axis: Net worth ($)

#### ✅ FIMilestones
- **What to see:** List of 5 milestones with status icons
- **Test:**
  - Completed milestones: Green background + ✅
  - Current milestone: Blue background + 🔄 spinner + ring
  - Future milestones: Gray background + ⏳
  - Dates should be human-readable ("8 months", "2y 1m")

#### ✅ FIScenarioCards
- **What to see:** 3 cards (Lean/Regular/Fat)
- **Test:**
  - Click any card → Should highlight with ring + scale effect
  - Progress bars show different percentages
  - Dates show when each scenario would be achieved
  - Regular FIRE should be selected by default

#### ✅ FIRESettings
- **What to see:** Settings panel with sliders
- **Test:**
  - Drag Investment Return slider → Chart/dates update
  - Drag Safe Withdrawal slider → FI Number changes
  - Change Monthly Savings → Timeline updates
  - Hover ℹ️ icons → Tooltips appear
  - Click Reset → Back to defaults (7% return, 4% SWR)
  - Updates should happen in real-time (300ms debounce)

---

## 🎯 Sample Test Data

To see meaningful results, ensure your financial settings have:

```
Current Savings: $500,000+
Monthly Income: $6,000+
Monthly Expenses: $4,000
Monthly Savings: $2,000+
```

This will show:
- Progress: ~40-50%
- FI Date: 3-5 years away
- Coast FIRE: Possibly already achieved
- Milestones: Some completed, some in progress

---

## 🐛 Troubleshooting

### No FIRE button in header?
- Clear cache, hard refresh (Cmd+Shift+R)
- Check build: `npm run build`

### Components not showing?
- Check authentication (must be logged in)
- Check financial settings (must have data)
- Open DevTools → Console for errors

### Chart not rendering?
- Verify Recharts is installed: `npm ls recharts`
- Check for JavaScript errors in console

### Settings not saving?
- Check Supabase connection
- Verify RLS policies (see CLAUDE.md)
- Check Network tab for 409/406 errors

---

## 📱 Mobile Testing

```bash
# Get local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from phone on same network
http://YOUR_IP:3000/fire
```

**Test:**
- All components should be responsive
- Touch targets should be 44px+ (easy to tap)
- Sliders should work with touch gestures
- Chart should scale to screen width

---

## 🌙 Dark Mode Testing

- Toggle theme with moon/sun icon in header
- All components should adapt:
  - Backgrounds: white → dark gray
  - Text: black → white
  - Borders: light → dark
  - Charts: colors should remain vibrant

---

## ✅ Acceptance Criteria

Component is working correctly if:

1. **FIProgressBar:**
   - [ ] Shows current progress %
   - [ ] 5 milestones visible
   - [ ] Tooltips work on hover
   - [ ] Colors transition smoothly

2. **FIProjectionChart:**
   - [ ] 3 lines visible (current, coast, target)
   - [ ] Chart responsive
   - [ ] Tooltips show formatted amounts
   - [ ] Legend explains each line

3. **FIMilestones:**
   - [ ] Status icons correct (✅🔄⏳)
   - [ ] Dates human-readable
   - [ ] Current milestone highlighted
   - [ ] "Next milestone" summary shows

4. **FIScenarioCards:**
   - [ ] 3 cards visible (Lean/Regular/Fat)
   - [ ] Selection works (click → ring effect)
   - [ ] Each shows FI Number, date, progress
   - [ ] Mobile: Stacks vertically

5. **FIRESettings:**
   - [ ] Sliders work smoothly
   - [ ] Tooltips appear on hover
   - [ ] Changes update in real-time
   - [ ] Reset button works
   - [ ] Values persist after refresh

6. **Integration:**
   - [ ] FIRE button in main header
   - [ ] `/fire` route accessible
   - [ ] Back button works
   - [ ] All components integrated in FIREDashboard

---

## 🎨 Visual Regression (Optional)

Take screenshots at key breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1440px (MacBook)

Compare with `WEEK3-DAY3-4-VISUAL-SUMMARY.md` for expected layout.

---

## 📊 Performance Check

```bash
# Build size
npm run build
# Check route sizes in output

# Lighthouse
npm run dev
# Open DevTools → Lighthouse → Run audit
# Target: Performance 90+, Accessibility 95+
```

---

## ✅ Ready for Production

Checklist before deploying:

- [ ] `npm run build` passes
- [ ] TypeScript 0 errors (new code)
- [ ] All components render correctly
- [ ] Mobile responsive verified
- [ ] Dark mode works
- [ ] Settings persist after refresh
- [ ] FIRE button visible in header
- [ ] `/fire` route accessible
- [ ] No console errors
- [ ] Recharts animations smooth

---

## 📞 Support

**Issues?** Check:
1. `WEEK3-DAY3-4-COMPLETION.md` - Full technical details
2. `WEEK3-DAY3-4-VISUAL-SUMMARY.md` - Expected UI layout
3. `CLAUDE.md` - Supabase/RLS troubleshooting
4. Component source files - Inline documentation

**Still stuck?** Open a GitHub issue with:
- Browser/device info
- Console errors (screenshot)
- Steps to reproduce

---

**Happy FIRE planning! 🔥💰🎯**
