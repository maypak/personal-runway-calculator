# Developer Action Items (Beta Feedback Review)

**Date:** 2026-02-21 23:52  
**Reviewer:** Developer (Subagent)  
**Source:** BETA_RETEST_RESULTS_V2.md  
**Testing:** 20 personas, 70% improved, 30% declined

---

## P0 (Critical - This Week)

### 1. Add Tooltips for Advanced Terms
- **Problem:** "I clicked 'FIRE Calculator' and saw 'Coast FIRE' - what is that?! No explanation." (Onboarding newbie, -1.0 pts)
- **Affected personas:** Onboarding newbie (-1.0), Casual user (-0.5), Mint refugee (-0.5)
- **Technical approach:** 
  - Add `<InfoTooltip>` component with Lucide `Info` icon
  - Implement tooltips for: "Coast FIRE", "Burn rate", "FI Number", "4% Rule", "Scenario", "Phase"
  - Use Shadcn Tooltip component for consistency
- **Estimated time:** 2-3 hours
- **Files to change:**
  - `src/components/ui/Tooltip.tsx` (create if missing)
  - `src/components/FIRE/FIRECalculator.tsx` (add tooltips)
  - `src/components/Dashboard.tsx` (burn rate tooltip)
  - `src/components/Scenarios/ScenarioComparison.tsx` (scenario tooltip)
  - `src/components/Phases/PhaseList.tsx` (phase tooltip)

**Priority Rationale:** Quick win (2-3 hours) that addresses complaints from 3 personas. Beginners are confused by jargon - this is low-hanging fruit.

---

### 2. Fix FIRE Messaging Confusion in README
- **Problem:** "Features exist (FI number, Coast FIRE) but README says 'NOT for FIRE, use FIRECalc' - confusing. Should I use this or not?" (박준영, Jenny)
- **Affected personas:** FIRE expert (-1.0), 박준영 (+0.7 but confused), Jenny (+0.2 but confused)
- **Technical approach:** 
  - Update README.md with nuanced FIRE positioning
  - Replace "NOT a 30-year retirement calculator" with clearer guidance:
    ```markdown
    ## FIRE Calculator: Quick Checks vs Serious Planning
    
    Our FIRE Calculator is perfect for:
    - ✅ Quick FI number checks ("How much do I need to retire?")
    - ✅ Coast FIRE calculations ("Can I stop saving and let it grow?")
    - ✅ 1-2 year FIRE runway modeling
    
    For comprehensive 30-year retirement planning with inflation modeling, 
    Monte Carlo simulations, and tax optimization, we recommend FIRECalc.
    
    Think of us as your "FIRE quick check" tool, FIRECalc as your 
    "FIRE comprehensive planner."
    ```
  - Add similar messaging in FIRE Calculator UI (not just README)
- **Estimated time:** 1 hour
- **Files to change:**
  - `README.md` (update FIRE section)
  - `src/components/FIRE/FIRECalculator.tsx` (add clarifying text above calculator)

**Priority Rationale:** 1-hour fix that resolves confusion for 3 FIRE personas. Current "bait and switch" feeling hurts trust.

---

### 3. Add "What is Runway?" Explainer Tooltip (Enhance Existing)
- **Problem:** "Tooltip on 'runway' helps, but what about 'burn rate', 'scenarios'?" (Onboarding newbie)
- **Affected personas:** Onboarding newbie (-1.0), Casual user (-0.5)
- **Technical approach:**
  - Enhance existing "What is runway?" tooltip (already exists per QA notes)
  - Make it more prominent (larger info icon, or always-visible explainer card for first-time users)
  - Add LocalStorage flag: `hasSeenRunwayExplainer` to show once
  - Create dismissible "New User Guide" card at top of Dashboard
- **Estimated time:** 2 hours
- **Files to change:**
  - `src/components/Dashboard.tsx` (add NewUserGuide component)
  - `src/components/ui/NewUserGuide.tsx` (create dismissible card)
  - `src/utils/localStorage.ts` (add flag tracking)

**Priority Rationale:** Onboarding newbie dropped -1.0 specifically due to jargon. Enhancing existing tooltip is quick win.

---

## P1 (Important - Phase 3)

### 4. Progressive Disclosure / "Simple Mode" Toggle
- **Problem:** "More features (FIRE, Phases, Scenarios) = overwhelming. Where do I start?" (Onboarding newbie, Casual user)
- **Affected personas:** Onboarding newbie (-1.0), Casual user (-0.5)
- **Technical approach:**
  - Add Settings toggle: "Simple Mode" (default: ON for new users)
  - Simple Mode hides: FIRE Calculator tab, Phase Planning tab, Scenario Comparison
  - Simple Mode shows: Dashboard, Basic expenses/income, Settings
  - Store preference in LocalStorage + DB (UserSettings table)
  - Add "Enable Advanced Features" CTA in Settings with tooltip explaining what unlocks
- **Estimated time:** 6-8 hours
- **Files to change:**
  - `src/components/Settings/Settings.tsx` (add toggle)
  - `src/components/Navigation.tsx` (conditionally hide tabs)
  - `src/lib/db/schema.ts` (add `simpleMode` to UserSettings)
  - `src/hooks/useUserSettings.ts` (manage simple mode state)
  - `src/components/Dashboard.tsx` (show CTA to enable advanced features)

**Priority Rationale:** Addresses major complaint (feature overwhelm) from 2 personas. Bigger effort (6-8h) but high impact for retention.

---

### 5. Goal-Based Onboarding Flow
- **Problem:** "No guided onboarding or tutorial. I'm lost navigating features." (Onboarding newbie)
- **Affected personas:** Onboarding newbie (-1.0), Casual user (-0.5), Mint refugee (-0.5)
- **Technical approach:**
  - Create first-run onboarding modal: "What are you planning?"
    - Option 1: "Track my runway" (shows Dashboard only)
    - Option 2: "Plan a sabbatical" (shows Phase Planning)
    - Option 3: "Compare scenarios" (shows Scenarios)
    - Option 4: "Check my FIRE number" (shows FIRE Calculator)
    - Option 5: "Show me everything" (power user mode)
  - Based on selection, set initial feature visibility + show contextual tour
  - Use React-Joyride or similar for product tour
  - Store preference in DB: `userGoal` field
- **Estimated time:** 10-12 hours
- **Files to change:**
  - `src/components/Onboarding/OnboardingModal.tsx` (create modal)
  - `src/components/Onboarding/ProductTour.tsx` (create contextual tours)
  - `src/lib/db/schema.ts` (add `userGoal` to UserSettings)
  - `src/hooks/useOnboarding.ts` (manage onboarding state)
  - `src/app/page.tsx` (trigger onboarding on first visit)

**Priority Rationale:** Biggest complaint from beginners. 10-12h investment but critical for user activation. Phase 3 priority.

---

### 6. CSV Import for Expenses/Income
- **Problem:** "Mint automatically pulled transactions. This makes me MANUALLY type every expense. I thought you'd add CSV import - nope." (Mint refugee)
- **Affected personas:** Mint refugee (-0.5)
- **Technical approach:**
  - Add "Import CSV" button in Expenses/Income sections
  - Support common formats: Mint CSV, YNAB CSV, generic bank CSV
  - CSV parser with column mapping UI (drag-drop columns to match fields)
  - Preview imported data before confirming
  - Bulk insert into DB with transaction rollback on error
  - Use `papaparse` library for CSV parsing
- **Estimated time:** 8-10 hours
- **Files to change:**
  - `src/components/Expenses/ImportCSV.tsx` (create import modal)
  - `src/components/Expenses/CSVMapper.tsx` (column mapping UI)
  - `src/lib/csvParser.ts` (parsing logic with papaparse)
  - `src/lib/db/mutations.ts` (bulk insert expenses)
  - `src/components/Expenses/ExpenseList.tsx` (add Import button)

**Priority Rationale:** Mint refugee specifically requested this. 8-10h effort. Medium priority (only 1 persona, but represents "Mint refugee" segment).

---

### 7. Multi-Currency Support
- **Problem:** "Still wish it had multi-currency (I have to convert € to $ manually)" (Sofia, Spain)
- **Affected personas:** Sofia (+1.3 but requested), international users
- **Technical approach:**
  - Add currency selector in Settings (USD, EUR, GBP, KRW, JPY, etc.)
  - Use exchange rate API (e.g., exchangerate-api.io, free tier)
  - Store user's base currency in DB
  - Allow per-expense currency override (for multi-currency expenses)
  - Display all amounts in user's base currency with conversion
  - Show exchange rate source + last updated timestamp
- **Estimated time:** 12-15 hours
- **Files to change:**
  - `src/lib/currency/exchangeRates.ts` (API integration)
  - `src/lib/db/schema.ts` (add `baseCurrency` to UserSettings, `currency` to Expenses)
  - `src/components/Settings/CurrencySelector.tsx` (create selector)
  - `src/components/Expenses/ExpenseForm.tsx` (add currency per expense)
  - `src/utils/formatCurrency.ts` (update to handle multi-currency)
  - `src/hooks/useCurrency.ts` (manage currency state + conversions)

**Priority Rationale:** Requested by 1 persona but unlocks international market. Already on Phase 3 roadmap. 12-15h effort.

---

### 8. Export to CSV/Excel (Not Just JSON)
- **Problem:** "Export format: JSON, not CSV (less Excel-friendly)" (Spreadsheet purist)
- **Affected personas:** Spreadsheet purist (+0.5 but requested CSV)
- **Technical approach:**
  - Add export format selector: JSON, CSV, Excel (.xlsx)
  - CSV export: Use `papaparse` to convert JSON → CSV
  - Excel export: Use `xlsx` library (SheetJS) for .xlsx format
  - Include all user data: expenses, income, scenarios, phases, FIRE calculations
  - Separate sheets/files for each data type
- **Estimated time:** 4-6 hours
- **Files to change:**
  - `src/components/Settings/DataExport.tsx` (add format selector)
  - `src/lib/export/csvExport.ts` (create CSV export logic)
  - `src/lib/export/excelExport.ts` (create Excel export logic)
  - `src/lib/export/jsonExport.ts` (existing, enhance)

**Priority Rationale:** Quick win (4-6h) that makes Spreadsheet purists happier. Already have JSON export, just need format conversion.

---

## P2 (Nice to Have - Future)

### 9. PDF Export for Reports
- **Problem:** "PDF 출력 기능 있으면 7점!" (김지훈, Burnout escapist)
- **Affected personas:** 김지훈 (+0.5, would be +1.0 with PDF), Korean users wanting to share with family
- **Technical approach:**
  - Create PDF report generator with summary stats
  - Include: Runway number, burn rate, income, scenario comparison chart, phase breakdown
  - Use `react-pdf` or `jspdf` + `html2canvas` for PDF generation
  - Offer templates: "Family persuasion report" (Korean), "Financial summary" (English)
  - Download as PDF button in Dashboard + Settings
- **Estimated time:** 10-12 hours
- **Files to change:**
  - `src/lib/pdf/reportGenerator.ts` (create PDF logic)
  - `src/components/Reports/PDFReport.tsx` (create report template)
  - `src/components/Dashboard.tsx` (add "Download PDF" button)
  - `src/lib/pdf/templates/` (create template variants)

**Priority Rationale:** Nice to have. Korean market specifically requested for "family persuasion." 10-12h effort. Future phase.

---

### 10. Inflation Adjustment Calculator
- **Problem:** "Still no inflation adjustment" (FIRE expert, multiple FIRE personas)
- **Affected personas:** FIRE expert (-1.0), Jenny (+0.2), 박준영 (+0.7)
- **Technical approach:**
  - Add inflation rate input to FIRE Calculator (default: 3% annual)
  - Adjust FI number calculation: `FI Number = (Annual Expenses * 25) * (1 + inflation)^years`
  - Show "FI number today" vs "FI number in 10 years (inflation-adjusted)"
  - Add inflation-adjusted runway projection chart
  - Store inflation rate in UserSettings
- **Estimated time:** 6-8 hours
- **Files to change:**
  - `src/components/FIRE/FIRECalculator.tsx` (add inflation input)
  - `src/lib/calculations/fireCalculations.ts` (update FI formulas)
  - `src/components/FIRE/InflationChart.tsx` (create chart)
  - `src/lib/db/schema.ts` (add `inflationRate` to UserSettings)

**Priority Rationale:** FIRE users want this, but it's a "serious FIRE planning" feature. We're positioning as "quick FIRE checks" not "30-year planning." Future phase, or reconsider if pivoting to full FIRE tool.

---

### 11. Monte Carlo Simulation
- **Problem:** "Still no Monte Carlo simulation" (FIRE expert)
- **Affected personas:** FIRE expert (-1.0), advanced FIRE users
- **Technical approach:**
  - Implement Monte Carlo simulation for runway projections
  - Simulate 1,000 scenarios with variable income/expense/returns
  - Show probability distribution: 90% confidence interval, median, worst-case
  - Visualize with chart (probability fan chart)
  - Computationally expensive - consider Web Workers for background processing
  - Use libraries: `d3-random`, `@visx/stats` for visualization
- **Estimated time:** 20-25 hours (complex feature)
- **Files to change:**
  - `src/lib/simulations/monteCarlo.ts` (create simulation engine)
  - `src/components/FIRE/MonteCarloChart.tsx` (visualization)
  - `src/workers/monteCarloWorker.ts` (Web Worker for performance)
  - `src/components/FIRE/FIRECalculator.tsx` (add Monte Carlo section)

**Priority Rationale:** High effort (20-25h), niche feature for advanced FIRE users. Out of scope for "1-2 year runway calculator" positioning. Only build if pivoting to full FIRE tool.

---

### 12. Tax Modeling
- **Problem:** "Missing: tax modeling" (FIRE expert, QA specialist notes)
- **Affected personas:** FIRE expert (-1.0), high-earners planning FIRE
- **Technical approach:**
  - Add tax bracket calculator (federal + state)
  - Model tax-advantaged accounts (401k, IRA, Roth IRA)
  - Calculate tax on withdrawals vs contributions
  - Show tax-optimized withdrawal strategies
  - Country-specific: Start with US, add Korea/UK/EU later
  - Use tax bracket data APIs or static JSON files
- **Estimated time:** 25-30 hours (very complex, multi-jurisdiction)
- **Files to change:**
  - `src/lib/tax/taxCalculator.ts` (create tax engine)
  - `src/lib/tax/brackets/` (tax bracket data by country)
  - `src/components/FIRE/TaxOptimization.tsx` (UI for tax modeling)
  - `src/lib/db/schema.ts` (add tax-related fields)

**Priority Rationale:** Very high effort (25-30h), requires legal/accounting domain knowledge. Out of scope for MVP. Only build if becoming a comprehensive FIRE tool (which current positioning says NO).

---

### 13. Location-Based Cost Databases
- **Problem:** "Would be 7/7 if it had location-based cost databases" (Emma, Sabbatical planner)
- **Affected personas:** Emma (+1.3, would be +1.5 with this), Sofia (+1.3), sabbatical planners
- **Technical approach:**
  - Integrate cost-of-living API (e.g., Numbeo API, Teleport API)
  - Auto-suggest expense amounts based on location: "Seoul, Korea → $2.5K/mo avg"
  - Phase Planning enhancement: "Add phase → Select location → Auto-populate budget"
  - Show breakdown: Housing $X, Food $Y, Transport $Z for selected location
  - Cache API results to reduce API costs
- **Estimated time:** 15-18 hours
- **Files to change:**
  - `src/lib/locations/costOfLiving.ts` (API integration)
  - `src/components/Phases/LocationSelector.tsx` (location picker with autocomplete)
  - `src/components/Phases/CostBreakdown.tsx` (show location-based costs)
  - `src/lib/db/schema.ts` (add `location` to Phase)

**Priority Rationale:** Nice-to-have for sabbatical planners (2 personas requested). 15-18h effort. APIs may have costs. Future phase.

---

### 14. Plaid Bank Integration (Auto-Sync)
- **Problem:** "Missing Mint's automatic transaction sync. No bank account integration." (Mint refugee)
- **Affected personas:** Mint refugee (-0.5)
- **Technical approach:**
  - Integrate Plaid API for bank account linking
  - Auto-fetch transactions daily via webhook
  - Categorize transactions automatically (ML or rule-based)
  - Allow manual categorization override
  - Security: Plaid handles auth, we store access tokens encrypted
  - Cost: Plaid charges $0.01-0.05 per active user/month
- **Estimated time:** 30-40 hours (large feature with security implications)
- **Files to change:**
  - `src/lib/plaid/plaidClient.ts` (Plaid SDK integration)
  - `src/components/Settings/BankAccounts.tsx` (link bank UI)
  - `src/api/webhooks/plaid.ts` (handle Plaid webhooks)
  - `src/lib/db/schema.ts` (add BankAccounts, PlaidTokens tables)
  - `src/lib/transactions/autoCategorize.ts` (transaction categorization)

**Priority Rationale:** Very high effort (30-40h), ongoing API costs, security/compliance concerns. Only 1 persona requested. Requires product decision: Are we becoming a "bank-syncing tool" or staying "manual-entry runway calculator"? Current positioning says NO.

---

## Summary

**Total items:** 14 action items
- **P0:** 3 items (~5-6 hours total) ⚡ **DO THIS WEEK**
- **P1:** 5 items (~48-61 hours total) 📅 **PHASE 3**
- **P2:** 6 items (~111-163 hours total) 🔮 **FUTURE / PIVOT-DEPENDENT**

---

## Top 3 Recommendations for Sunday (2/22)

### 1. 🔥 Add Tooltips for Advanced Terms (2-3h)
**Why:** Quick win that helps 3 personas (Onboarding newbie, Casual user, Mint refugee). Reduces confusion for beginners without major code changes.

**Specific tasks:**
- Create `<InfoTooltip>` component with Lucide `Info` icon
- Add tooltips for: Coast FIRE, Burn rate, FI Number, 4% Rule, Scenario, Phase
- Test on mobile (tooltip accessibility)

**Files:** `src/components/ui/Tooltip.tsx`, `src/components/FIRE/FIRECalculator.tsx`, `src/components/Dashboard.tsx`

---

### 2. 📝 Fix FIRE Messaging in README + UI (1h)
**Why:** Resolves confusion for 3 FIRE personas. Current "bait and switch" feeling hurts trust. Simple copy change, big impact.

**Specific tasks:**
- Rewrite README "FIRE Calculator" section with nuanced positioning
- Add clarifying text in FIRE Calculator UI: "Quick checks vs serious planning"
- Remove harsh "NOT a 30-year calculator" language, replace with helpful guidance

**Files:** `README.md`, `src/components/FIRE/FIRECalculator.tsx`

---

### 3. ✨ Enhance "What is Runway?" Explainer (2h)
**Why:** Onboarding newbie dropped -1.0 due to jargon. Existing tooltip exists but needs prominence. Low effort, high impact for first-time users.

**Specific tasks:**
- Create dismissible "New User Guide" card at top of Dashboard (first visit only)
- Add LocalStorage flag: `hasSeenRunwayExplainer`
- Make info icon larger/more prominent
- Include links to other tooltips (burn rate, scenarios, phases)

**Files:** `src/components/Dashboard.tsx`, `src/components/ui/NewUserGuide.tsx`, `src/utils/localStorage.ts`

---

## 📊 Impact vs Effort Analysis

### Quick Wins (High Impact, Low Effort) ✅
1. Tooltips for advanced terms (3h, 3 personas) ⚡
2. FIRE messaging fix (1h, 3 personas) ⚡
3. Runway explainer enhancement (2h, 2 personas) ⚡
4. CSV/Excel export (4-6h, 1 persona)

### High-Impact, High-Effort (Phase 3) 📅
1. Progressive disclosure / Simple Mode (6-8h, 2 personas)
2. Goal-based onboarding flow (10-12h, 3 personas)
3. Multi-currency support (12-15h, international market)

### Future / Pivot-Dependent 🔮
1. Plaid bank integration (30-40h, positioning conflict)
2. Monte Carlo simulation (20-25h, out of scope)
3. Tax modeling (25-30h, out of scope)
4. Inflation adjustment (6-8h, FIRE-specific)

---

## 🚨 Critical Insights for Developer

### 1. Feature Overwhelm is REAL
**Data:** Onboarding newbie (-1.0), Casual user (-0.5) both complained about "too many features"

**Implication:** Every new feature we add makes the tool HARDER for beginners. We need progressive disclosure or we'll keep bleeding casual users.

**Action:** Prioritize Simple Mode toggle (P1) to hide advanced features by default.

---

### 2. FIRE Positioning is Confusing (But Fixable in 1 Hour)
**Data:** 3 FIRE personas confused by "features exist but told not to use them"

**Implication:** Current README messaging creates "bait and switch" feeling. Quick copy fix resolves this.

**Action:** Rewrite FIRE section in README with nuanced positioning (P0, 1 hour).

---

### 3. Tooltips are Low-Hanging Fruit
**Data:** Multiple personas mentioned "no explanation" for Coast FIRE, burn rate, scenarios

**Implication:** Jargon is blocking adoption. Tooltips are 2-3 hour fix for major pain point.

**Action:** Add tooltips to all advanced terms (P0, 2-3 hours).

---

### 4. Don't Build for Wrong Users
**Data:** Mint refugee wants Plaid (30-40h), FIRE expert wants Monte Carlo (20-25h), Tax modeling (25-30h)

**Implication:** These are 75-95 HOURS of work for personas we're explicitly NOT targeting (repositioning worked - they filtered out).

**Action:** Reject Plaid, Monte Carlo, Tax modeling unless we pivot positioning. Stay focused on "1-2 year runway calculator."

---

### 5. Korean Market Validated
**Data:** Korean personas improved +0.5 to +1.1 avg. 20K FIRE Korea cafe untapped.

**Implication:** Korean i18n was worth it. Korean-specific features (PDF export for family persuasion) have ROI.

**Action:** Prioritize PDF export (P2, 10-12h) if targeting Korean market aggressively.

---

## ⚠️ Anti-Recommendations (DO NOT BUILD)

### ❌ Plaid Bank Integration (30-40h)
**Reason:** Only 1 persona requested (Mint refugee, who we're NOT targeting). Positioning says "manual-entry runway calculator" not "bank-syncing budget app." High effort, ongoing costs, security risks.

**Decision:** REJECT unless we pivot to compete with Mint/Copilot (which README explicitly says we DON'T).

---

### ❌ Monte Carlo Simulation (20-25h)
**Reason:** FIRE expert requested, but we're positioning as "quick FIRE checks" not "30-year comprehensive planning." Only hardcore FIRE users need this (we're redirecting them to FIRECalc).

**Decision:** REJECT unless we pivot to full FIRE tool.

---

### ❌ Tax Modeling (25-30h)
**Reason:** FIRE expert requested. Very high effort, requires legal/accounting domain expertise. Out of scope for "1-2 year runway calculator."

**Decision:** REJECT unless we pivot to full FIRE tool.

---

## ✅ Summary for Sunday (2/22)

**Focus on P0 (5-6 hours total):**
1. Tooltips (2-3h) → Helps beginners
2. FIRE messaging (1h) → Removes confusion
3. Runway explainer (2h) → Improves first-run experience

**Total time:** ~5-6 hours of focused work on Sunday = 3 quick wins shipped.

**Impact:** Addresses complaints from 6 personas (Onboarding newbie, Casual user, Mint refugee, FIRE expert, 박준영, Jenny) with minimal code changes.

**After P0:** Move to Phase 3 planning for P1 items (Progressive disclosure, Onboarding flow, CSV import).

---

**END OF DEVELOPER ACTION ITEMS**

**Next Steps:**
1. Review P0 items with 메이님 (5-6h time budget OK?)
2. Confirm priority: Tooltips → FIRE messaging → Explainer
3. Ship P0 by EOD Sunday (2/22)
4. Plan Phase 3 sprint for P1 items

🚀 Ready to build!
