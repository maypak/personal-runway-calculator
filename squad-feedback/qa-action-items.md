# QA Action Items (Beta Feedback Review)

**Date:** 2026-02-21 23:51  
**Source:** BETA_RETEST_RESULTS_V2.md  
**QA Specialist:** Subagent  
**Priority:** P0 testing needed before Sunday launch

---

## P0 (Test/Verify This Week)

### 1. FIRE Calculator Messaging Consistency ⚠️ CRITICAL
- **User feedback:** "You added a FIRE Calculator with the 4% rule - that's what I asked for. But then the README says 'NOT a 30-year retirement calculator' and 'For FIRE planning, use FIRECalc.' So... should I use this or not?" - Jenny (Software Engineer, FIRE)
- **What to test:**
  1. Open FIRE Calculator tab in browser
  2. Check if there's a clarity message explaining "quick checks vs serious planning"
  3. Verify tooltips explain limitations (no Monte Carlo, no inflation)
  4. Check if messaging matches README positioning
  5. Test Coast FIRE calculation accuracy
- **Expected behavior:** 
  - UI should clarify: "For quick FI number estimates. For 30-year planning with Monte Carlo, use FIRECalc"
  - Tooltip on FIRE Calculator explaining scope
  - No conflicting messages between UI and README
- **Affected features:** FIRE Calculator tab, FI number, Coast FIRE, 4% rule calculator
- **Priority:** P0 (3 personas confused, impacts FIRE market segment)

---

### 2. Onboarding Complexity for New Users ⚠️
- **User feedback:** "The jargon is a bit better - 'time your money will last' makes sense. But now there's EVEN MORE stuff: FIRE calculator, Phase Planning, Scenario Comparison. Where do I start?" - Onboarding Newbie
- **What to test:**
  1. Create fresh account (new user flow)
  2. Complete signup → Verify if guided onboarding exists
  3. Count number of tabs visible on first login (Dashboard, FIRE, Phases, Scenarios, Settings)
  4. Check for tooltips on advanced features ("Coast FIRE", "Burn Rate", "Scenarios")
  5. Verify if "Quick Start" or tutorial exists
  6. Test if features can be hidden (progressive disclosure)
- **Expected behavior:**
  - New users see simplified interface OR guided tutorial
  - Tooltips on all jargon terms (Burn Rate, Coast FIRE, etc.)
  - Optional "Simple Mode" toggle to hide advanced features
  - First-time user experience <= 3 clicks to see runway number
- **Affected features:** Entire onboarding flow, Dashboard, FIRE tab, Phases, Scenarios
- **Priority:** P0 (2 personas overwhelmed, impacts conversion)

---

### 3. Scenario Comparison Edge Cases 🎯
- **User feedback:** "Scenario Comparison is exactly what I'd build in Excel at BCG. Side-by-side table, multi-line chart, auto-generated insights." - Sarah (Career Transitioner, ex-BCG)
- **What to test:**
  1. Create 3 scenarios with different income/expense combinations
  2. Select all 3 → Click "Compare Selected"
  3. Verify comparison table shows:
     - Baseline scenario marked
     - Delta calculations accurate
     - Multi-line runway chart displays correctly
  4. Edge cases:
     - What happens with 1 scenario selected? (should disable Compare button)
     - What happens with 5+ scenarios? (performance test)
     - What if scenarios have identical values? (edge case)
     - Delete scenario while in compare mode (state management)
  5. Screenshot comparison table for documentation
- **Expected behavior:**
  - Accurate delta calculations
  - Clear baseline marking
  - Chart legend matches scenario names
  - Graceful handling of edge cases (1 scenario, 5+ scenarios)
- **Affected features:** Scenario Comparison, Dashboard metrics, Runway chart
- **Priority:** P0 (HIGH VALUE feature for target users, 2 personas rated 7/7 because of this)

---

### 4. Phase Planning Multi-Phase Calculations 📊
- **User feedback:** "Phase Planning makes this tool USABLE for sabbaticals! I modeled 'Spain (€2.5K/mo, 3mo)' → 'Travel (€1.8K/mo, 2mo)' → 'Job hunt (€3K/mo, 4mo)' perfectly." - Sofia (Sabbatical Planner)
- **What to test:**
  1. Create 3 phases with different expenses and durations:
     - Phase 1: $3000/mo, 3 months
     - Phase 2: $2000/mo, 2 months
     - Phase 3: $3500/mo, 6 months
  2. Verify total runway calculation = sum of all phases
  3. Test edge cases:
     - What if total expenses > savings? (should show negative runway)
     - Add/remove phases dynamically (state management)
     - Edit phase mid-plan (recalculation accuracy)
     - Delete all phases (reset state)
  4. Verify dashboard reflects phase-based calculations
  5. Screenshot phase planning UI for documentation
- **Expected behavior:**
  - Accurate multi-phase runway calculation
  - Dashboard updates in real-time as phases change
  - Clear error message if expenses exceed savings
  - Smooth add/edit/delete phase experience
- **Affected features:** Phase Planning, Dashboard runway, Burn rate calculations
- **Priority:** P0 (CRITICAL for sabbatical planners, 2 personas gave +1.3 improvement)

---

### 5. Korean Language (i18n) Validation 🇰🇷
- **User feedback:** "한국어 지원으로 7점 달성! 시나리오 비교로 '6개월 vs 12개월 커리어 전환' 계획을 부모님께 한글로 설명할 수 있어요." - 최소연 (Career Transitioner, Korea)
- **What to test:**
  1. Switch language to Korean (🇰🇷 한국어 toggle)
  2. Verify ALL text is translated:
     - Navigation menu (Dashboard, FIRE Calculator, Phases, Scenarios, Settings)
     - Form labels (가용 자금, 월간 지출, etc.)
     - Button text (저장, 취소, 삭제)
     - Error messages
     - Tooltips
  3. Check number formatting (Korean locale)
  4. Check date formatting (YYYY-MM-DD Korean style)
  5. Currency display (₩ or $ with Korean context)
  6. Screenshot each page in Korean for documentation
- **Expected behavior:**
  - 100% Korean translation (no English fallbacks)
  - Numbers formatted correctly (예: 15,000원)
  - Dates in Korean format
  - All tooltips/errors in Korean
  - Language persists across page refreshes
- **Affected features:** Entire UI, all pages, all components
- **Priority:** P0 (Korean market = 20K FIRE Korea cafe members, 3 personas improved avg +0.75)

---

### 6. Privacy & Analytics Disclosure Verification 🔒
- **User feedback:** "The README has a full 'Privacy & Security' section with SPECIFICS: 'Vercel Analytics: no cookies, 24h retention.' You told me EXACTLY what's tracked." - Privacy-Focused user (+1.5 improvement)
- **What to test:**
  1. Open browser DevTools → Network tab
  2. Check for analytics requests (Vercel Analytics)
  3. Verify NO cookies are set (Application → Cookies)
  4. Check localStorage/sessionStorage for PII
  5. Test data export feature:
     - Settings → Export Data
     - Verify JSON format download
     - Check if all user data included (expenses, scenarios, phases)
  6. Verify RLS (Row Level Security) - attempt to access another user's data via URL manipulation
  7. Screenshot Network tab showing analytics requests
- **Expected behavior:**
  - Vercel Analytics present (documented in README)
  - No cookies set
  - No PII in analytics
  - Data export = complete JSON with all user data
  - RLS prevents unauthorized data access
- **Affected features:** Analytics, Data Export, Database security
- **Priority:** P0 (Privacy promise = trust factor, 1 persona +1.5 improvement)

---

## Test Coverage Gaps

**Scenarios we missed:**

1. **Multi-currency manual conversion confusion**
   - Beta user (Sofia, Spain): "I have to convert € to $ manually"
   - We never tested: What happens if user enters mixed currencies?
   - Edge case: User inputs "$3000 + €500" - does it break?

2. **Manual entry tedium with multiple features**
   - Beta user (Mint refugee): "Added scenarios/phases but still manual entry for everything"
   - We never tested: Time to complete full setup with Scenarios + Phases + FIRE
   - UX test: Is it <5 minutes or >15 minutes for full setup?

3. **Feature intimidation (Paradox of Choice)**
   - Beta user (Casual user): "More tabs and buttons everywhere. Do I NEED FIRE calculator?"
   - We never tested: New user's first reaction to navigation complexity
   - Usability test: Can new user find runway number in <2 minutes?

4. **FIRE Calculator accuracy vs competitors**
   - Beta users questioned: "Why use this vs FIRECalc?"
   - We never tested: Compare FIRE calculations with FIRECalc (same inputs, different outputs?)
   - Benchmark test needed

5. **Delete scenario while in compare mode**
   - Reported nowhere, but obvious edge case
   - What happens if you're comparing 3 scenarios and delete one mid-comparison?

6. **Browser compatibility (only tested Chrome)**
   - No feedback on Safari, Firefox, Edge
   - Mobile responsiveness not validated

7. **Onboarding completion rate**
   - How many users complete signup → Dashboard vs abandon?
   - No analytics on this yet

8. **Error message clarity**
   - Beta users didn't report error scenarios
   - We never tested: What if user enters negative income? Text instead of numbers?

---

**Recommended additions to qa-scenarios.md:**

```markdown
## Edge Cases - Scenario Comparison
- [TC-022] Compare 1 scenario (should disable button)
- [TC-023] Compare 5+ scenarios (performance test)
- [TC-024] Delete scenario while in compare mode
- [TC-025] Compare identical scenarios (zero delta)

## Edge Cases - Phase Planning
- [TC-026] Expenses > Savings (negative runway)
- [TC-027] 10+ phases (performance test)
- [TC-028] Delete all phases (reset state)
- [TC-029] Edit phase #2 of 3 (mid-plan recalculation)

## Onboarding UX
- [TC-030] New user → Runway number in <2 minutes
- [TC-031] Tooltip visibility on first login
- [TC-032] Feature complexity overwhelm test (click count to first value)

## FIRE Calculator Accuracy
- [TC-033] Compare FI number with FIRECalc (same inputs)
- [TC-034] Coast FIRE edge case: $0 current savings
- [TC-035] 4% rule with $0 target expenses

## Korean i18n
- [TC-036] All pages 100% translated (no English fallbacks)
- [TC-037] Number formatting (Korean locale)
- [TC-038] Currency display (₩ vs $)
- [TC-039] Error messages in Korean

## Privacy & Security
- [TC-040] Verify Vercel Analytics = no cookies
- [TC-041] Data export completeness (all user data)
- [TC-042] RLS test (attempt unauthorized data access)

## Error Handling
- [TC-043] Negative income input
- [TC-044] Text in number field
- [TC-045] Extremely large numbers (overflow test)
- [TC-046] Empty required fields

## Browser Compatibility
- [TC-047] Test on Safari
- [TC-048] Test on Firefox
- [TC-049] Test on Edge
- [TC-050] Mobile responsiveness (iOS Safari, Android Chrome)
```

---

## Process Improvements

**What went well:**

1. ✅ **Brutal honesty testing** - V2 revealed realistic 70/30 split (not fake 100% positive like V1)
2. ✅ **Persona-based testing** - 20 diverse personas covered edge cases we missed
3. ✅ **Feature validation** - Scenario Comparison, Phase Planning, i18n all delivered value
4. ✅ **Positioning clarity** - Wrong users filtered out correctly (FIRE expert -1, YNAB -1, Couples -1)

**What to improve:**

1. ⚠️ **Test messaging consistency** 
   - Problem: FIRE features exist but README discourages usage
   - Fix: QA should validate UI messaging matches README/marketing claims
   - Add to checklist: "Messaging Consistency Audit" for every feature

2. ⚠️ **Edge case testing BEFORE beta**
   - Problem: Delete-while-comparing not tested until beta found it
   - Fix: Expand qa-scenarios.md with edge cases BEFORE user testing
   - New rule: Every CRUD feature needs Delete-while-active test

3. ⚠️ **Onboarding UX metrics**
   - Problem: No data on completion rate, time-to-value, abandonment
   - Fix: Add analytics events for onboarding funnel
   - Track: Signup → Dashboard → First scenario created (conversion funnel)

4. ⚠️ **Browser compatibility as P0**
   - Problem: Only tested Chrome, users might use Safari/Firefox
   - Fix: Add Safari/Firefox to standard test matrix BEFORE launch
   - Target: 3 browsers minimum (Chrome, Safari, Firefox)

5. ⚠️ **Error scenario coverage**
   - Problem: Beta users never hit error states (or didn't report them)
   - Fix: Dedicated error scenario testing (negative numbers, text in number fields, etc.)
   - Add: Error message clarity checklist

**Updated protocols:**

### Add to QA_GUIDE.md:

```markdown
## 🎯 Messaging Consistency Audit (새 프로토콜)

**When:** Every new feature launch  
**What:** Validate UI messaging matches README/marketing

**Checklist:**
- [ ] README says feature X → UI has feature X (no missing features)
- [ ] README says "NOT for Y" → UI doesn't imply Y is supported
- [ ] Tooltips explain limitations mentioned in README
- [ ] Error messages align with positioning (no mixed signals)

**Example (FIRE Calculator):**
- README: "NOT a 30-year retirement calculator"
- UI should say: "For quick FI estimates. For 30-year planning, use FIRECalc"
- ❌ Don't: Show FIRE Calculator with no explanation (confusing)
```

### Add to qa-scenarios.md:

```markdown
## Standard Edge Cases for CRUD Features

**For every Create/Read/Update/Delete feature, test:**
1. Create → Success (happy path)
2. Create → Duplicate name (error handling)
3. Update → While viewing (state management)
4. Delete → While in use (active state deletion)
5. Delete → Last item (empty state)
6. Bulk operations → Select all, delete all

**Example: Scenarios**
- [TC-051] Delete scenario while comparing
- [TC-052] Delete baseline scenario (should auto-select new baseline)
- [TC-053] Delete all scenarios (empty state message)
```

### Add to LAUNCH_CHECKLIST.md:

```markdown
## Browser Compatibility (P0 Required)

**Before launch, test on:**
- [ ] Chrome (latest)
- [ ] Safari (macOS + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile: iOS Safari
- [ ] Mobile: Android Chrome

**Critical paths to test:**
- Signup flow
- Dashboard view
- Scenario creation
- Phase planning
- FIRE calculator
```

---

## Top 3 QA Priorities for Sunday

### 1. 🔥 FIRE Calculator Messaging Audit (P0 - 2 hours)
**Why:** 3 personas confused, impacts FIRE market segment  
**Task:**
1. Open FIRE Calculator in browser (production)
2. Check if positioning tooltip exists ("Quick estimates vs 30-year planning")
3. Screenshot current state
4. If missing: Create bug report with specific UX copy recommendation
5. Test Coast FIRE, FI number calculations for accuracy

**Deliverable:** QA_REPORT_FIRE_MESSAGING.md with screenshots + recommendations

---

### 2. 🎯 Critical Feature Validation (P0 - 3 hours)
**Why:** Scenario Comparison & Phase Planning = highest value features  
**Task:**
1. Test all edge cases from "Test Coverage Gaps" above
2. Focus on:
   - Delete scenario while comparing
   - Expenses > Savings (negative runway)
   - Multi-phase calculations accuracy
3. Screenshot bugs
4. Create reproduction steps for each bug

**Deliverable:** QA_REPORT_SCENARIOS_PHASES.md with Pass/Fail for 15 test cases

---

### 3. 🇰🇷 Korean i18n Validation (P0 - 1.5 hours)
**Why:** Korean market = 20K potential users, 3 personas improved +0.75  
**Task:**
1. Switch to Korean language
2. Check ALL pages for untranslated text
3. Verify number/date/currency formatting
4. Screenshot each page in Korean
5. Test language persistence across refreshes

**Deliverable:** QA_REPORT_KOREAN_I18N.md with 100% translation checklist

---

**Total Time Estimate:** 6.5 hours (doable in one Sunday session)

**Success Criteria:**
- ✅ All 3 reports created
- ✅ P0 bugs identified (if any)
- ✅ Screenshots for every bug
- ✅ Clear Pass/Fail on critical features

---

## Next Steps After Sunday QA

1. **Monday:** Developer fixes P0 bugs (FIRE messaging, any Scenario/Phase bugs)
2. **Tuesday:** QA regression testing on fixes
3. **Wednesday:** Browser compatibility testing (Safari, Firefox, Edge)
4. **Thursday:** Final pre-launch smoke test
5. **Friday:** 🚀 Launch ready

---

**END OF QA ACTION ITEMS**

**Prepared by:** QA Specialist (Subagent)  
**Ready for:** Sunday QA session (2026-02-22)  
**Estimated effort:** 6.5 hours  
**Expected outcome:** P0 feature validation + bug reports for Developer to fix Monday

🎯 **Let's make Sunday count!**
