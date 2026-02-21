# Manual UX Fix Verification Checklist
**Date:** 2026-02-21 10:45 GMT+9  
**URL:** https://personal-runway-calculator.vercel.app  
**Fix Commit:** e552803

---

## ✅ Pre-Test Setup

1. Open Chrome in Incognito mode (Cmd+Shift+N)
2. Navigate to: https://personal-runway-calculator.vercel.app
3. Hard refresh to clear cache (Cmd+Shift+R)
4. Sign in with your account
5. Navigate to `/scenarios` page

---

## TC-019A: 1개 선택 시 모달 안 열림 ✅

**Steps:**
1. Click "Compare" button to enter comparison mode
2. Select **only 1** scenario (click checkbox)
3. Wait 2 seconds

**Expected Result:**
- ✅ Modal does **NOT** open
- ✅ You can still see and select other scenarios
- ✅ Checkbox stays checked

**Actual Result:** [ ] PASS  / [ ] FAIL

**Screenshot:** (optional)

---

## TC-019B: 2개 선택 시 모달 자동 열림 ✅

**Steps:**
1. While in comparison mode (from TC-019A)
2. Select a **second** scenario
3. Wait 1 second

**Expected Result:**
- ✅ Modal **automatically opens**
- ✅ Header shows "Comparing 2 scenarios"
- ✅ Chart displays both scenarios
- ✅ Table shows both scenarios
- ✅ Insights section visible

**Actual Result:** [ ] PASS  / [ ] FAIL

**Screenshot:** (optional)

---

## TC-019C: 3개 선택 가능 ✅

**Steps:**
1. Close the modal (click "Close" button)
2. Select a **third** scenario
3. Wait 1 second

**Expected Result:**
- ✅ Modal opens with "Comparing 3 scenarios"
- ✅ Chart shows 3 lines (different colors)
- ✅ Table shows 3 scenarios
- ✅ Insights compares all 3

**Actual Result:** [ ] PASS  / [ ] FAIL

**Screenshot:** (optional)

---

## TC-020: Chart & Insights 빠른 확인

**Steps:**
1. With 2 scenarios selected, observe the modal
2. Check Chart section
3. Check Insights section

**Expected Result:**
- ✅ Chart: 2 lines with different colors
- ✅ Chart: Proper legend with scenario names
- ✅ Insights: "Best Runway" highlighted
- ✅ Insights: Analysis bullets present

**Actual Result:** [ ] PASS  / [ ] FAIL

---

## TC-021: 모바일 빠른 체크 (5분)

**Steps:**
1. Open Chrome DevTools (Cmd+Option+I)
2. Click "Toggle device toolbar" (Cmd+Shift+M)
3. Select "iPhone SE" or set width to 375px
4. Refresh page (Cmd+Shift+R)
5. Navigate to /scenarios
6. Enter comparison mode
7. Select 2 scenarios

**Expected Result:**
- ✅ Modal responsive (full width on mobile)
- ✅ Chart adjusts to mobile width
- ✅ Table allows horizontal scroll
- ✅ Insights stack vertically
- ✅ All text readable

**Actual Result:** [ ] PASS  / [ ] FAIL

**Screenshot:** (optional)

---

## ✅ Code Verification (Already Done)

**File:** `app/components/ScenarioManager.tsx`

```typescript
// Line 82-83 (approx)
{compareMode && selectedForComparison.length >= 2 && (
  <ComparisonView
```

**Status:** ✅ VERIFIED - Code shows `>= 2` condition

---

## 📊 Final Checklist

- [ ] TC-019A: 1개 선택 → 모달 안 열림
- [ ] TC-019B: 2개 선택 → 모달 열림
- [ ] TC-019C: 3개 선택 가능
- [ ] TC-020: Chart & Insights 정상
- [ ] TC-021: 모바일 반응형

**Overall Status:** [ ] PASS  / [ ] FAIL

**Tester Name:** _______________  
**Date/Time:** _______________

---

## 📝 Notes

(Add any observations, bugs, or suggestions here)

