# Korean i18n Fix Plan - ACTION REQUIRED

**Status:** 🚨 BLOCKING LAUNCH  
**Priority:** P0  
**Estimated Time:** 3-4 hours  
**Date:** 2026-02-22

---

## 🎯 Quick Summary

**Problem:** 3 major pages showing 100% English despite Korean mode selected:
1. Dashboard onboarding - showing translation keys
2. FIRE Calculator - hardcoded English
3. Phase Planning - hardcoded English

**Root Cause:** Missing translation files + hardcoded text in empty states

---

## 🔧 Fix #1: Create Onboarding Translation Files (30min)

### Files to create:

**`public/locales/en/onboarding.json`**
```json
{
  "welcome": {
    "title": "Welcome to Personal Runway!",
    "description": "Calculate your financial runway in 3 simple steps",
    "cta": "Get Started",
    "steps": {
      "savings": "Enter savings",
      "expenses": "Enter expenses",
      "runway": "See runway!"
    }
  },
  "progress": {
    "step": "Step {{current}} of {{total}}",
    "skip": "Skip for now"
  }
}
```

**`public/locales/ko/onboarding.json`**
```json
{
  "welcome": {
    "title": "런웨이 계산기에 오신 것을 환영합니다!",
    "description": "3단계로 재정 런웨이를 계산하세요",
    "cta": "시작하기",
    "steps": {
      "savings": "저축 입력",
      "expenses": "지출 입력",
      "runway": "런웨이 확인!"
    }
  },
  "progress": {
    "step": "{{current}}/{{total}} 단계",
    "skip": "나중에 하기"
  }
}
```

### Update component:
**File:** `app/components/OnboardingModal.tsx` (or similar)

Find hardcoded text and replace with:
```tsx
const { t } = useI18n();

// Replace:
"Step 1 of 4" → {t('onboarding:progress.step', { current: 1, total: 4 })}
"Skip for now" → {t('onboarding:progress.skip')}
"Enter savings" → {t('onboarding:welcome.steps.savings')}
```

---

## 🔧 Fix #2: FIRE Calculator Empty State (30min)

### File: `app/components/FIREDashboard.tsx`

**Lines 157-184** - Replace hardcoded English:

```tsx
// BEFORE (hardcoded):
<h2>FIRE Calculator</h2>
<p>Financial Independence, Retire Early</p>
<h3>Add Your Expenses First</h3>
<p>To calculate your FIRE number, we need to know your monthly expenses.</p>
<Link>Go to Dashboard →</Link>
<p><strong>What is FIRE?</strong> Financial Independence, Retire Early...</p>

// AFTER (with i18n):
<h2>{t('fire:title')}</h2>
<p>{t('fire:subtitle')}</p>
<h3>{t('fire:emptyState.title')}</h3>
<p>{t('fire:emptyState.description')}</p>
<Link>{t('fire:emptyState.cta')}</Link>
<p><strong>{t('fire:info.title')}</strong> {t('fire:info.description')}</p>
```

### Add to `public/locales/ko/fire.json`:

```json
{
  "title": "FIRE 계산기",
  "subtitle": "경제적 독립, 조기 은퇴",
  "emptyState": {
    "title": "먼저 지출을 추가하세요",
    "description": "FIRE 숫자를 계산하려면 월간 지출을 알아야 합니다.",
    "cta": "대시보드로 가기 →"
  },
  "info": {
    "title": "FIRE란 무엇인가요?",
    "description": "경제적 독립, 조기 은퇴. FIRE 계산기는 다시는 일하지 않아도 되는 금액을 보여줍니다 (4% 룰)."
  }
  // ... existing translations
}
```

---

## 🔧 Fix #3: FIRE Page "Back to Dashboard" (15min)

### File: `app/fire/page.tsx`

**Line 60** - Replace:
```tsx
// BEFORE:
<Link href="/">
  <ArrowLeft />
  Back to Dashboard
</Link>

// AFTER:
import { useI18n } from '../contexts/I18nContext';

const { t } = useI18n();

<Link href="/">
  <ArrowLeft />
  {t('common:navigation.backToDashboard')}
</Link>
```

### Add to `public/locales/ko/common.json`:
```json
{
  "navigation": {
    "backToDashboard": "대시보드로 돌아가기"
  }
  // ... existing translations
}
```

---

## 🔧 Fix #4: Phase Planning Page (1h)

### File: `app/phases/page.tsx` (or similar)

Similar to FIRE fix - replace ALL hardcoded English with translation keys.

**Find and replace:**
- "Back to Dashboard" → `{t('common:navigation.backToDashboard')}`
- "Total Savings (for runway calculation)" → `{t('phases:savingsInput.label')}`
- "Phase Timeline" → `{t('phases:timeline.title')}`
- "Templates" → `{t('phases:actions.templates')}`
- "Add Phase" → `{t('phases:actions.addPhase')}`
- etc.

### Check if `public/locales/ko/phases.json` has all needed keys

If missing, add them. Example:
```json
{
  "savingsInput": {
    "label": "총 저축 (런웨이 계산용)",
    "hint": "모든 단계의 런웨이를 계산하는 데 사용됩니다"
  },
  "timeline": {
    "title": "단계 타임라인",
    "description": "재정 패턴이 다른 단계로 여정을 나누세요"
  },
  "actions": {
    "templates": "템플릿",
    "addPhase": "단계 추가",
    "browseTemplates": "템플릿 둘러보기",
    "createPhase": "단계 만들기"
  },
  "emptyState": {
    "title": "아직 단계가 없습니다",
    "description": "첫 단계를 만들거나 템플릿을 사용하여 단계별 계획을 시작하세요"
  }
  // ... existing translations
}
```

---

## 🔧 Fix #5: NewUserGuide Component (30min)

### File: `app/components/ui/NewUserGuide.tsx`

**Replace ALL hardcoded English:**

```tsx
// BEFORE:
<h3>Welcome! Here's how to calculate your runway:</h3>
<ol>
  <li><strong>Enter your savings</strong> - How much money do you have now?</li>
  <li><strong>Add your expenses</strong> - How much do you spend per month?</li>
  <li><strong>See your runway</strong> - We'll show exactly how long your money lasts!</li>
</ol>
<p>💡 <strong>Tip:</strong> Hover over any term with an info icon (ⓘ) for explanations.</p>

// AFTER:
import { useI18n } from '@/contexts/I18nContext';

const { t } = useI18n();

<h3>{t('dashboard:newUserGuide.title')}</h3>
<ol>
  <li><strong>{t('dashboard:newUserGuide.step1.title')}</strong> - {t('dashboard:newUserGuide.step1.description')}</li>
  <li><strong>{t('dashboard:newUserGuide.step2.title')}</strong> - {t('dashboard:newUserGuide.step2.description')}</li>
  <li><strong>{t('dashboard:newUserGuide.step3.title')}</strong> - {t('dashboard:newUserGuide.step3.description')}</li>
</ol>
<p>💡 <strong>{t('dashboard:newUserGuide.tip.label')}</strong> {t('dashboard:newUserGuide.tip.text')}</p>
```

### Add to `public/locales/ko/dashboard.json`:

```json
{
  "newUserGuide": {
    "title": "환영합니다! 런웨이 계산 방법:",
    "step1": {
      "title": "저축 입력",
      "description": "현재 보유한 돈은 얼마인가요?"
    },
    "step2": {
      "title": "지출 추가",
      "description": "한 달에 얼마나 쓰시나요?"
    },
    "step3": {
      "title": "런웨이 확인",
      "description": "돈이 얼마나 오래 지속되는지 정확히 보여드립니다!"
    },
    "tip": {
      "label": "팁:",
      "text": "정보 아이콘 (ⓘ)이 있는 용어 위에 마우스를 올려 설명을 보세요."
    }
  }
  // ... existing translations
}
```

---

## 🔧 Fix #6: Landing Page Minor Fixes (15min)

### File: `app/components/Auth.tsx` (or similar)

**Find and replace:**
- "Forgot password?" → `{t('auth:forgotPassword')}`
- "Privacy Policy" → `{t('auth:privacyPolicy')}`

### Add to `public/locales/ko/auth.json`:
```json
{
  "forgotPassword": "비밀번호를 잊으셨나요?",
  "privacyPolicy": "개인정보 처리방침"
  // ... existing translations
}
```

---

## 🔧 Fix #7: Error Pages (15min)

### File: `app/error.tsx`

```tsx
// BEFORE:
<h2>Something went wrong</h2>
<button>Try Again</button>

// AFTER:
import { useI18n } from './contexts/I18nContext';

const { t } = useI18n();

<h2>{t('common:errors.somethingWrong')}</h2>
<button>{t('common:errors.tryAgain')}</button>
```

### File: `app/not-found.tsx`

```tsx
// BEFORE:
<h1>404</h1>
<h2>This page could not be found.</h2>

// AFTER:
<h1>404</h1>
<h2>{t('common:errors.pageNotFound')}</h2>
```

### Add to `public/locales/ko/common.json`:
```json
{
  "errors": {
    "somethingWrong": "문제가 발생했습니다",
    "tryAgain": "다시 시도",
    "pageNotFound": "페이지를 찾을 수 없습니다."
  },
  "navigation": {
    "backToDashboard": "대시보드로 돌아가기"
  }
  // ... existing translations
}
```

---

## 🔧 Fix #8: Dashboard Runtime Error (1h)

**Error:** "Rendered more hooks than during the previous render."

**Location:** Dashboard page  
**Cause:** Conditional hook usage in onboarding component

### Investigation needed:
1. Check `app/components/OnboardingModal.tsx` (or similar)
2. Look for hooks called conditionally
3. Common patterns to avoid:
   ```tsx
   // BAD:
   if (someCondition) {
     const { data } = useHook(); // ❌ Hook called conditionally
   }
   
   // GOOD:
   const { data } = useHook(); // ✅ Hook called unconditionally
   if (someCondition) {
     // use data
   }
   ```

### Quick fix:
Move all hooks to top of component, before any conditional returns.

---

## ✅ Testing Checklist

After all fixes, test in Korean mode:

### Pages
- [ ] Landing page - 0 English text
- [ ] Dashboard - 0 English text, no errors
- [ ] Onboarding modal - 0 English text, no translation keys
- [ ] NewUserGuide - 0 English text
- [ ] FIRE Calculator - 0 English text
- [ ] Phase Planning - 0 English text
- [ ] 404 page - Korean text
- [ ] Error boundary - Korean text

### Screenshots (re-take all)
- [ ] `landing-ko.png`
- [ ] `dashboard-ko.png`
- [ ] `fire-calculator-ko.png`
- [ ] `phases-ko.png`
- [ ] `onboarding-ko.png`
- [ ] `new-user-guide-ko.png`

### Final QA
- [ ] Switch language EN → KO → EN (works?)
- [ ] Refresh page in Korean mode (persists?)
- [ ] All tooltips showing (Phase 2)
- [ ] Number formatting (1,000 vs 1000)
- [ ] No console errors
- [ ] No hydration warnings

---

## 📝 Summary

**Total fixes:** 8  
**New files:** 2 (onboarding.json en/ko)  
**Modified files:** ~10  
**Estimated time:** 3-4 hours  

**Critical path:**
1. Fix Dashboard error (1h) → Unblocks testing
2. Create onboarding.json (30min) → Fixes translation keys
3. Fix FIRE + Phases (1.5h) → Removes English pages
4. Fix minor issues (1h) → Polish

**After fixes:** Re-run full QA validation (1h)

**Ready to launch:** Tomorrow (2026-02-23)

---

**Developer Notes:**
- Use find-replace carefully to avoid breaking working code
- Test after each fix (don't batch commit)
- Check browser console for i18n errors
- Use `check-i18n.js` script if available
- Git commit after each major fix

**Questions?** Check `korean-i18n-issues.md` for detailed findings.
