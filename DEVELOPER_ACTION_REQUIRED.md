# ⚠️ DEVELOPER ACTION REQUIRED

**Priority**: HIGH  
**Issue**: P1-5 Touch Target fix applied to wrong component  
**Estimated Fix Time**: 15 minutes  
**Blocks**: Production deployment

---

## 🐛 The Problem

You fixed touch targets in `OnboardingWizard.tsx`, but **that file is not being used**.

The actual flow is:
```
/onboarding → OnboardingFlow.tsx → Step1/Step2/Step3 components
```

**6 buttons in Step components still use `py-3` without `min-h-[44px]`** ❌

---

## ✅ Required Fix

Add `min-h-[44px]` to these buttons:

### 1. Step1Situation.tsx
**File**: `app/components/Onboarding/Step1Situation.tsx`  
**Line**: ~92

**Before**:
```tsx
<button
  onClick={onNext}
  disabled={!selected}
  className={`
    px-8 py-3 rounded-lg font-semibold text-white transition-all
    ...
  `}
>
```

**After**:
```tsx
<button
  onClick={onNext}
  disabled={!selected}
  className={`
    min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all
    ...
  `}
>
```

---

### 2. Step2Assets.tsx
**File**: `app/components/Onboarding/Step2Assets.tsx`  
**Lines**: ~81, ~88 (2 buttons)

**Button 1 - "Previous"** (~Line 81):
```tsx
<button
  onClick={onPrev}
  className="
    min-h-[44px] px-6 py-3 rounded-lg font-semibold text-gray-700
    bg-gray-200 hover:bg-gray-300
    transition-all
  "
>
```

**Button 2 - "Next"** (~Line 88):
```tsx
<button
  onClick={onNext}
  disabled={balance <= 0}
  className={`
    min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all
    ...
  `}
>
```

---

### 3. Step3Expenses.tsx
**File**: `app/components/Onboarding/Step3Expenses.tsx`  
**Lines**: ~146, ~153 (2 buttons)

**Button 1 - "Previous"** (~Line 146):
```tsx
<button
  onClick={onPrev}
  className="
    min-h-[44px] px-6 py-3 rounded-lg font-semibold text-gray-700
    bg-gray-200 hover:bg-gray-300
    transition-all
  "
>
```

**Button 2 - "Complete"** (~Line 153):
```tsx
<button
  onClick={onComplete}
  disabled={!canComplete}
  className={`
    min-h-[44px] px-8 py-3 rounded-lg font-semibold text-white transition-all
    ...
  `}
>
```

---

## 🔧 Copy-Paste Quick Fix

Run these sed commands:

```bash
cd ~/personal-runway-calculator

# Step1Situation.tsx - Line 92
sed -i '' '92s/px-8 py-3/min-h-[44px] px-8 py-3/' app/components/Onboarding/Step1Situation.tsx

# Step2Assets.tsx - Lines 81, 88
sed -i '' '81s/px-6 py-3/min-h-[44px] px-6 py-3/' app/components/Onboarding/Step2Assets.tsx
sed -i '' '88s/px-8 py-3/min-h-[44px] px-8 py-3/' app/components/Onboarding/Step2Assets.tsx

# Step3Expenses.tsx - Lines 146, 153
sed -i '' '146s/px-6 py-3/min-h-[44px] px-6 py-3/' app/components/Onboarding/Step3Expenses.tsx
sed -i '' '153s/px-8 py-3/min-h-[44px] px-8 py-3/' app/components/Onboarding/Step3Expenses.tsx
```

**Warning**: Line numbers are approximate. Verify manually!

---

## ✅ Verification After Fix

1. **Rebuild**:
   ```bash
   npm run build
   ```
   Should complete with 0 errors.

2. **Visual Check** (DevTools):
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000/onboarding
   - Resize to 320px width
   - Right-click each button → Inspect
   - Verify `height: 44px` or greater

3. **Git Commit**:
   ```bash
   git add app/components/Onboarding/*.tsx
   git commit -m "fix: Add min-h-[44px] to Step component buttons (P1-5 completion)"
   ```

---

## 📝 Optional Cleanup

### Delete Unused OnboardingWizard
Since it's not being used:
```bash
git rm app/components/OnboardingWizard.tsx
git commit -m "chore: Remove unused OnboardingWizard component"
```

---

## 🚀 After This Fix

All P0/P1 bugs will be **RESOLVED** ✅

- ✅ P0-2: Bottom padding
- ✅ P1-3: Export button removed
- ✅ P1-4: Scenario button replaced
- ✅ P1-5: Touch targets 44px (after this fix)
- ✅ P0-1: Header responsive

**Production Ready**: YES ✅

---

## 📞 Questions?

See full analysis in:
- `QA_P0P1_VERIFICATION_REPORT.md` (detailed findings)
- `QA_EXECUTIVE_SUMMARY.md` (quick overview)

---

**QA Agent**: Subagent QA  
**Date**: 2026-02-23 18:49 KST
