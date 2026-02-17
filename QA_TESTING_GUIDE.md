# QA Testing Guide - FIRE Calculator (Week 3 Day 6)

**Version:** Post-Mobile & Accessibility Polish  
**Commit:** b956c5a  
**Date:** 2026-02-17

---

## 🎯 Quick Test (5 minutes)

### Critical Path
1. ✅ Navigate to `/fire`
2. ✅ Verify page loads without errors
3. ✅ Open Settings panel (gear icon)
4. ✅ Move investment return slider → Chart updates
5. ✅ Move safe withdrawal slider → FI Number updates
6. ✅ Tab through all interactive elements
7. ✅ Press Enter on collapse buttons

**Expected:** All interactions smooth, no console errors.

---

## 📱 Mobile Testing (iPhone SE - 375px)

### Test Steps
```bash
# Chrome DevTools
1. Press F12
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone SE"
4. Navigate to http://localhost:3000/fire
```

### Checklist
- [ ] **Header:** Back button visible and tappable
- [ ] **FI Number Card:** Readable, no overflow
- [ ] **Progress Bar:** Milestones visible (25%, 50%, 100%)
- [ ] **Chart:** Renders without horizontal scroll
  - Expected height: 250px
  - Legend readable
  - Touch to show tooltip
- [ ] **Sliders:** Easy to drag with finger/pointer
- [ ] **Settings Panel:** Collapses smoothly
- [ ] **Scenarios:** Toggle button works

### Performance
- [ ] Chart appears within 1-2 seconds (lazy loading)
- [ ] No janky animations
- [ ] Scrolling is smooth
- [ ] Touch targets ≥44px (Apple guideline)

---

## 📱 Tablet Testing (iPad - 768px)

### Checklist
- [ ] **Layout:** Single column, centered
- [ ] **Chart:** Full width, readable labels
- [ ] **Milestones:** All 5 visible (25%, 50%, 75%, 90%, 100%)
- [ ] **Legend:** Visible below chart
- [ ] **Tooltips:** Tap to activate

---

## 💻 Desktop Testing (1280px+)

### Checklist
- [ ] **Chart:** 300px height, full animations
- [ ] **Hover States:** Tooltips appear on hover
- [ ] **Milestones:** Hover to see exact amounts
- [ ] **Animations:** Chart animates on load (1000ms)
- [ ] **Legend:** Icons and text aligned

---

## ♿ Accessibility Testing

### Keyboard Navigation
```
Tab → Tab → Tab (should cycle through):
1. Back button
2. Settings button
3. Reset button (if settings open)
4. Investment slider
5. Safe withdrawal slider
6. Monthly savings input
7. Scenarios toggle button
```

#### Expected Behavior
- [ ] Focus visible (blue outline)
- [ ] Enter/Space toggles collapse buttons
- [ ] Sliders: Arrow keys adjust values
- [ ] No keyboard traps

### Screen Reader (VoiceOver on Mac)

**Enable:** Cmd + F5

#### Test Script
```
1. Navigate to /fire
2. Press Ctrl+Option+A (start reading)

Expected announcements:
- "Main landmark, FIRE Calculator Dashboard"
- "Progress bar, 35 percent towards financial independence"
- "Slider, Investment return rate, 7.0 percent annual return"
- "Image, Your assets will reach FI Number in 8 years"
```

#### Checklist
- [ ] Main landmark announced
- [ ] Progress bar reads current percentage
- [ ] Sliders announce values as you move them
- [ ] Chart has meaningful description
- [ ] Buttons have descriptive labels

### Lighthouse Audit

```bash
# Terminal
npx lighthouse http://localhost:3000/fire \
  --only-categories=accessibility \
  --view
```

**Target:** ≥90/100  
**Current:** 93/100 ✅

#### Common Issues to Check
- [ ] Color contrast (should pass)
- [ ] Main landmark (should pass)
- [ ] Viewport allows zoom (should pass)
- [ ] Form labels present (should pass)

---

## 🔧 Developer Testing

### Console Errors
```javascript
// Open DevTools Console (F12)
// Navigate to /fire
// Check for errors
```

- [ ] No React hydration warnings
- [ ] No 404s for missing assets
- [ ] No TypeScript errors in console
- [ ] No ARIA warnings

### Network Tab
```
1. Open DevTools → Network tab
2. Navigate to /fire
3. Check for:
```

- [ ] FIProjectionChart chunk loads separately (lazy)
- [ ] Total page size <500KB (initial load)
- [ ] Chart chunk ~50-100KB
- [ ] Fonts loaded from cache

### Performance Tab
```
1. DevTools → Performance
2. Record page load
3. Look for:
```

- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] No long tasks >50ms (mobile)
- [ ] Chart animation smooth (desktop)

---

## 🐛 Known Issues

### Resolved
- ✅ Main landmark missing → Fixed
- ✅ Sliders missing ARIA → Fixed
- ✅ Chart missing description → Fixed
- ✅ Viewport prevents zoom → Fixed
- ✅ Animations janky on mobile → Fixed

### Won't Fix (Out of Scope)
- ⚠️ Auth component color contrast (87/100 on login page)
  - Note: FIRE dashboard itself is 93/100
  - Auth page is separate concern

---

## 📊 Acceptance Criteria

### Must Pass
- [x] Lighthouse accessibility ≥90
- [x] TypeScript 0 errors
- [x] Build successful
- [ ] Manual mobile test (375px, 768px)
- [ ] Keyboard navigation works
- [ ] Screen reader announces key info

### Nice to Have
- [ ] Performance score >80
- [ ] No console warnings
- [ ] Bundle size <300KB (gzipped)

---

## 🚀 Deployment Checklist

### Pre-Deploy
- [x] All tests passing
- [x] Git commit pushed
- [x] Build successful
- [ ] Manual QA passed
- [ ] Accessibility verified

### Deploy
```bash
# Vercel auto-deploys on push to main
git push origin main
```

### Post-Deploy
- [ ] Test on production URL
- [ ] Run Lighthouse on live site
- [ ] Verify analytics tracking
- [ ] Check error monitoring (Sentry/etc)

---

## 🆘 Troubleshooting

### Issue: Chart doesn't load
**Cause:** Lazy loading failed  
**Fix:** Check network tab for chunk errors

### Issue: Sliders not announcing values
**Cause:** Screen reader not detecting ARIA  
**Fix:** Verify aria-valuetext is present in DOM

### Issue: Keyboard focus not visible
**Cause:** CSS :focus styles missing  
**Fix:** Check Tailwind focus: classes

### Issue: Mobile chart too slow
**Cause:** Too many data points  
**Fix:** Verify data point reduction (every 2nd point)

---

## 📝 Test Report Template

```markdown
## Test Report - FIRE Calculator A11y/Mobile

**Tester:** [Name]
**Date:** [YYYY-MM-DD]
**Commit:** b956c5a
**Browser:** [Chrome/Safari/Firefox]
**Device:** [Desktop/iPhone SE/iPad]

### Results
- [ ] Mobile responsive (375px, 768px, 1280px+)
- [ ] Accessibility (Lighthouse ≥90)
- [ ] Keyboard navigation
- [ ] Screen reader

### Issues Found
1. [Issue description]
   - Severity: [Critical/High/Medium/Low]
   - Steps to reproduce:
   - Screenshot: [Link]

### Recommendation
- [ ] Approve for production
- [ ] Fix issues first
- [ ] Needs design review
```

---

**Status:** Ready for Manual QA  
**Next Steps:** Real device testing + Screen reader verification
