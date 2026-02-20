# E2E Test Strategy - Revised

**Updated:** 2026-02-21 07:00 AM KST  
**Status:** 🔴 Paused - Architecture Alignment Needed

---

## 🚨 Why We Paused

### Initial Plan (Feb 21, 06:00)
Ambitious expansion from 10 → 30 tests based on:
- QA Engineer analysis
- UX Designer analysis
- Assumed routes: `/settings`, `/expenses`, etc.

### Reality Check (Feb 21, 07:00)
**Architecture mismatch discovered:**

| Assumption | Reality |
|------------|---------|
| `/settings` page | ❌ Settings modal in Dashboard |
| `/expenses` page | ❌ Expense modal in Dashboard |
| Route-based navigation | ✅ Modal-based UI |
| OnboardingWizard lacks testids | ✅ Added (committed) |

**Impact:** 20/20 new tests failed  
**Root cause:** Tests designed for wrong UI architecture

---

## ✅ What We Kept

### auth.spec.ts (10 tests)
**Status:** 100% passing ✅

- Page load
- Sign up/Sign in toggle
- OAuth buttons
- Email validation
- Password validation
- Console errors
- Mobile responsive
- Performance (<3s load)

**Why it works:** Auth flow is route-based, not modal-based.

---

## 🎯 Revised Strategy

### Phase 1: Stabilize Core (Current)
**Focus:** Feature development > Test expansion

**Keep:**
- 10 auth tests (working)
- Manual testing for new features

**Skip:**
- E2E expansion until UI stable
- Regression tests (manually verify)

### Phase 2: UI-Aligned Tests (Week 2-3)
**After:** Dashboard UI finalized

**Approach:**
1. Map actual UI structure:
   - Dashboard modals (Settings, Expenses, Goals)
   - /fire page
   - /scenarios page
   - /phases page

2. Design tests for actual implementation:
   ```typescript
   // CORRECT approach:
   await page.click('[data-testid="settings-button"]'); // Open modal
   await page.waitForSelector('[data-testid="settings-modal"]');
   
   // WRONG approach (what we did):
   await page.goto('/settings'); // Route doesn't exist!
   ```

3. Add data-testids proactively:
   - All modals
   - All forms
   - All interactive elements

### Phase 3: Comprehensive Coverage (Week 4+)
**Target:** 90% P0 coverage

**Test Files:**
- `dashboard.spec.ts` - Modal interactions
- `fire.spec.ts` - FIRE calculator
- `scenarios.spec.ts` - Scenario comparison
- `phases.spec.ts` - Phase planning
- `mobile.spec.ts` - Mobile UX

---

## 📚 Lessons Learned

### ❌ What Went Wrong

**1. Assumption over exploration**
- Built tests without inspecting actual routes
- Trusted analysis over verification

**2. Big-bang approach**
- 30 tests at once = 30 failures at once
- Should have tested incrementally

**3. Missing testids**
- Onboarding had no data-testids
- Selectors too fragile

### ✅ What Went Right

**1. Collaboration worked**
- QA + UX perspectives valuable
- Analysis documents still useful

**2. Quick pivot**
- Recognized mismatch early
- Stopped before wasting more time

**3. Incremental value**
- OnboardingWizard now has testids
- Auth tests still 100% passing

---

## 🛠️ Immediate Actions

### For Developers
1. **Add data-testids** to new components:
   ```tsx
   <div data-testid="settings-modal">
   <input name="currentSavings" data-testid="savings-input" />
   ```

2. **Document modals** in code:
   ```typescript
   // Modal-based, not route-based
   // Test via: page.click('[data-testid="open-settings"]')
   ```

3. **Manual testing checklist**:
   - [ ] Settings save & persist
   - [ ] Expenses add/delete
   - [ ] Goals create/update
   - [ ] FIRE calculations
   - [ ] Scenario comparison

### For QA (Future)
1. **Map UI first**, then write tests
2. **Start small**: 1-2 tests per feature
3. **Verify route existence** before testing
4. **Use Playwright Inspector** to explore UI

---

## 📊 Current Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Authentication | 10 | ✅ 100% |
| Dashboard | 0 | ⏸️ Paused |
| Onboarding | 0 | ⏸️ Paused |
| FIRE | 0 | ⏸️ Paused |
| Scenarios | 0 | ⏸️ Paused |
| Phases | 0 | ⏸️ Paused |
| **Total** | **10** | **33% target** |

**Target (Week 4):** 30+ tests, 90% P0 coverage

---

## 🔮 Future Roadmap

### Week 2: Foundation
- [ ] Add data-testids to all modals
- [ ] Document modal testing patterns
- [ ] Write 1-2 dashboard tests (proof of concept)

### Week 3: Expansion
- [ ] Dashboard modal tests (5-10)
- [ ] FIRE page tests (5)
- [ ] Scenarios tests (3-5)

### Week 4: Polish
- [ ] Mobile-specific tests
- [ ] Accessibility tests
- [ ] Visual regression (optional)

---

## 💡 Key Takeaways

**Testing follows architecture, not assumptions.**

Good tests = Good UI understanding + Good tooling

**Better to pause than force.**

10 working tests > 30 failing tests

**Collaboration insight, execution reality.**

Analysis was valuable, but implementation needs verification.

---

**Next Review:** After Dashboard UI stable (Week 2-3)
