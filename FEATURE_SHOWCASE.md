# 🌟 Feature Showcase - Personal Runway Calculator

**Version:** Public Beta 1.0  
**Last Updated:** March 2026  
**Audience:** New Users, Marketing Materials

---

## 🎯 Overview

Personal Runway Calculator has 4 revolutionary features that no other financial tool offers:

1. **🌍 i18n (Internationalization)** - English + Korean (한국어)
2. **🔄 Scenario Comparison** - Side-by-side "what-if" modeling
3. **🔥 FIRE Calculator** - FI Date, Coast FIRE, 4% rule
4. **📅 Phase Planning** - Different stages, different budgets

**Why these matter:** They transform financial planning from "static calculator" to "life decision simulator."

---

## 1. 🌍 i18n: English + Korean Support

### What It Is
Full bilingual support for English and Korean speakers:
- ✅ Complete UI translation
- ✅ Currency support (USD $, KRW ₩, EUR €)
- ✅ Localized terminology (FIRE terms, financial jargon)
- ✅ PDF reports in both languages
- ✅ Seamless language switching

### Why It Matters

**The Problem:**
> *"I wanted to show my parents why quitting is financially sound. But there's no Korean financial planning tool. I had to translate Excel screenshots. They didn't get it."*  
> — 최소연, Career Transitioner

**The Solution:**
Korean speakers (75M globally, 20K+ in FIRE Korea Cafe) finally have a tool in their language.

**Impact:**
- Family persuasion materials (PDF in Korean)
- Community sharing (FIRE Korea Cafe, Korean Reddit)
- Trust & credibility (not "another foreign tool")

### Screenshots Placeholders

**[Screenshot 1: Language Toggle]**
- Location: Top right corner
- Shows: EN ↔️ KO switch
- Caption: "Switch languages instantly - no page reload"

**[Screenshot 2: Dashboard Comparison]**
- Left: English UI
- Right: Korean UI (한국어)
- Caption: "Same data, your language"

**[Screenshot 3: PDF Report]**
- Shows: Korean PDF export
- Caption: "Share with family in their language"

### User Story: 최소연 (Career Transitioner)

**Background:**
- 29, Product Manager at tech company
- Wants to quit to study UX design abroad
- Parents skeptical: "너무 위험해!" (Too risky!)

**Before Personal Runway:**
- Excel spreadsheet (English)
- Parents couldn't read it
- "Just trust me" arguments
- Anxiety: 9/10

**After (Korean Version):**
1. Switched to 한국어
2. Entered data: ₩45M savings, ₩2.5M/mo expenses
3. Created scenario: 6mo UK study (₩5M/mo) + 6mo job search (₩3M/mo)
4. **Result: 18 months runway**
5. Exported PDF in Korean
6. Showed parents: "여기 봐. 18개월은 안전해." (Look, 18 months is safe)

**Parents' reaction:**
> *"아, 이렇게 계획이 있구나. 괜찮겠다."*  
> (Oh, you have a plan. This seems okay.)

**Decision:** Got parental approval. Resigned. Now in London.

**Her review:**
> *"한국어 없었으면 설득 불가능했어요. 부모님 설득 = 인생 바뀜."*  
> (Without Korean, persuasion impossible. Convincing parents = life changed.)

**Score:** 5.0 → 7.5 (Korean support added)

---

### Technical Implementation

**Libraries:**
- `next-intl` - i18n framework
- `locale` detection - Auto-detect user language
- `Intl.NumberFormat` - Currency formatting

**Supported:**
- 🇺🇸 English (en)
- 🇰🇷 Korean (ko)

**Coming Soon:**
- 🇯🇵 Japanese (ja)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)

**Localized Terms:**

| English | 한국어 (Korean) | Notes |
|---------|---------------|-------|
| Financial Independence | 경제적 자유 | Not literal "독립" |
| Runway | 런웨이 / 버틸 수 있는 기간 | Dual term |
| Coast FIRE | 코스트 파이어 | Keep English acronym |
| 4% Rule | 4% 룰 | Keep percentage |
| Burn Rate | 소진율 | Literal translation |

---

## 2. 🔄 Scenario Comparison

### What It Is
Compare unlimited "what-if" scenarios side-by-side:
- Create multiple scenarios
- Compare them visually (table + charts)
- Switch between scenarios instantly
- Save and name each scenario

### Why It Matters

**The Problem:**
> *"I opened 3 browser tabs to compare timelines. Tab 1: conservative savings. Tab 2: moderate. Tab 3: YOLO. It was chaos."*  
> — Sarah, ex-BCG Consultant

**The Solution:**
See all your options at once. Make informed decisions.

**Impact:**
- Eliminate decision paralysis
- See trade-offs clearly (risk vs reward)
- Confidence in big decisions

### Screenshots Placeholders

**[Screenshot 1: Split View]**
- Left: Scenario A (Conservative: 24mo runway)
- Right: Scenario B (Aggressive: 18mo runway)
- Caption: "Compare any 2 scenarios side-by-side"

**[Screenshot 2: Comparison Table]**
```
| Metric            | Conservative | Moderate | Aggressive |
|-------------------|--------------|----------|------------|
| Monthly Savings   | $3,000       | $4,000   | $5,000     |
| Runway (months)   | 24           | 20       | 16         |
| Side Income       | $500         | $1,000   | $2,000     |
| Anxiety Level     | Low          | Medium   | High       |
```
Caption: "See all metrics at a glance"

**[Screenshot 3: Chart Overlay]**
- Line chart with 3 lines (3 scenarios)
- X-axis: Months
- Y-axis: Savings balance
- Caption: "Visualize your options"

### User Story: Michael (Serial Founder)

**Background:**
- 35, 3rd-time founder
- Deciding: Bootstrap vs VC
- $120K saved, burn rate $8K/mo

**The Decision:**
Should I:
- **Scenario A:** Bootstrap 12mo, stay lean
- **Scenario B:** Raise $500K VC, scale fast (24mo runway)
- **Scenario C:** Hybrid - bootstrap 6mo, then raise seed

**Before Personal Runway:**
- Excel: 3 separate sheets
- Switching between sheets = headache
- Can't see trade-offs clearly
- Decision: Paralyzed for 2 months

**After (Scenario Comparison):**

**Scenario A: Bootstrap 12mo**
- Savings: $120K
- Burn: $8K/mo
- Side consulting: $3K/mo
- **Runway: 24 months** (120K / (8K-3K))
- **Outcome:** Profitable before running out

**Scenario B: VC $500K**
- Total: $620K
- Burn: $25K/mo (hired team)
- Revenue goal: $50K MRR by Month 18
- **Runway: 24.8 months**
- **Outcome:** Need revenue or bridge round

**Scenario C: Hybrid**
- Bootstrap 6mo (burn $5K)
- Raise $300K seed at Month 6
- Total runway: 6mo + 18mo = **24 months**
- **Outcome:** Traction before raising = better terms

**Comparison View:**
```
| Metric              | Bootstrap | VC      | Hybrid  |
|---------------------|-----------|---------|---------|
| Initial Capital     | $120K     | $620K   | $120K→$420K |
| Monthly Burn        | $5-8K     | $25K    | $5K→$18K |
| Runway              | 24mo      | 24.8mo  | 24mo    |
| Equity Dilution     | 0%        | 20%     | 10%     |
| Team Size           | 1         | 5       | 1→3     |
| Risk Level          | Low       | High    | Medium  |
| Decision Confidence | 85%       | 60%     | 95%     |
```

**Decision:** Chose Scenario C (Hybrid)

**Reasoning:**
> *"Seeing all 3 side-by-side made it obvious. Bootstrap proves PMF, then raise with leverage. I'd have wasted 2 months overthinking without this."*

**His review:**
> *"Scenario comparison = my co-founder. Worth $30/month easy."*

**Score:** 6.5 → 8.0 (Scenario feature)

---

### Key Use Cases

**1. Job Search Timeline**
- Scenario A: 6-month runway (aggressive)
- Scenario B: 12-month runway (safe)
- Trade-off: Save 6 more months vs start living now

**2. Geographic Arbitrage**
- Scenario A: Stay in SF ($8K/mo expenses)
- Scenario B: Move to Bali ($2.5K/mo expenses)
- Impact: Runway 15mo → 48mo (3.2x)

**3. Side Income Modeling**
- Scenario A: No side income (24mo runway)
- Scenario B: Freelance $2K/mo (48mo runway)
- Impact: 2x runway extension

**4. Study vs Immediate Job Search**
- Scenario A: 6mo bootcamp ($5K/mo) + 6mo search
- Scenario B: 12mo job search ($3.5K/mo)
- Trade-off: Skill upgrade vs faster employment

---

### Technical Implementation

**Features:**
- Save up to 10 scenarios (free)
- Unlimited scenarios (Pro)
- Name each scenario
- Duplicate & modify
- Delete & archive
- Export comparison as PDF

**UI/UX:**
- Split-screen view (2 scenarios)
- Table view (up to 5 scenarios)
- Chart overlay (all scenarios)
- Highlight differences

---

## 3. 🔥 FIRE Calculator

### What It Is
Complete Financial Independence suite:
- **FI Number** - How much you need (4% rule)
- **FI Date** - When you'll reach FI (with investment returns)
- **Coast FIRE** - When you can stop saving
- **Progress Tracking** - Visual journey to FI

### Why It Matters

**The Problem:**
> *"I've been saving for FIRE for 5 years. But I don't know WHEN I'll hit my number. Excel formulas broke. I'm flying blind."*  
> — 박준영, Doctor

**The Solution:**
Know your FI Date. Track progress. Stay motivated.

**Impact:**
- Clarity (know the finish line)
- Motivation (see progress)
- Optimization (adjust to hit FI sooner)

### Screenshots Placeholders

**[Screenshot 1: FI Number Calculator]**
```
Annual Expenses: $48,000
FI Number (4% rule): $1,200,000
Current Savings: $320,000
Progress: 26.7% → FI
```
Caption: "Know your target"

**[Screenshot 2: FI Date Projection]**
```
Timeline to FI:
- Current: $320K (Age 32)
- Monthly Savings: $4,000
- Investment Return: 7% annually
- FI Date: Dec 2032 (Age 41)
- Years to FI: 8.5 years
```
Caption: "Know when you're free"

**[Screenshot 3: Coast FIRE Calculator]**
```
Coast FIRE Number: $450,000
Current: $320,000
Coast Date: June 2028 (Age 35)
After Coast: Let it grow to $1.2M by age 41
```
Caption: "Know when you can relax"

**[Screenshot 4: Progress Chart]**
- Line chart: Savings growth over time
- Milestone markers: Coast FI, FI, Fat FI
- Projection line (7% returns)
Caption: "Visualize your journey"

### User Story: 박준영 (FIRE Seeker)

**Background:**
- 33, Doctor (정형외과 전문의)
- Income: ₩25M/month (gross)
- Current savings: ₩400M
- Goal: FIRE at 40

**The Questions:**
1. How much do I need? (FI Number)
2. When will I hit it? (FI Date)
3. Am I on track? (Progress)
4. When can I go part-time? (Coast FIRE)

**Before Personal Runway:**
- Excel: Broken formulas
- Assumptions: Inconsistent
- Answer: "약 44개월?" (About 44 months?)
- Confidence: 30%

**After (FIRE Calculator):**

**Input:**
- Current savings: ₩400M
- Monthly expenses: ₩4M
- Monthly savings: ₩10M
- Investment return: 7% annually

**Results:**

**1. FI Number:**
- Annual expenses: ₩48M (₩4M × 12)
- FI Number (4% rule): **₩1,200M** (₩48M / 0.04)
- Current: ₩400M
- Progress: **33.3%** 🎯

**2. FI Date:**
- Monthly savings: ₩10M
- Investment return: 7%
- Compounding calculation:
  - Year 1: ₩400M → ₩548M
  - Year 2: ₩548M → ₩706M
  - Year 3: ₩706M → ₩875M
  - Year 4: ₩875M → ₩1,057M
  - Year 5: ₩1,057M → ₩1,252M ✅
- **FI Date: October 2029**
- **Age: 38** (2 years earlier than goal!)

**3. Coast FIRE:**
- Need at retirement (age 65): ₩1,200M
- Coast number (with 7% for 27 years): ₩200M
- Current: ₩400M
- **Coast FIRE achieved!** (Already there!)
- **Can go part-time NOW**

**4. Milestones:**
```
✅ Coast FIRE: Achieved (Age 33)
🎯 FI: Oct 2029 (Age 38)
💰 Fat FI (₩2B): 2035 (Age 44)
```

**Realization:**
> *"제가... 이미 Coast FIRE였네요. 몰랐어요. 당장 파트타임 전환 가능."*  
> (I... was already Coast FIRE. Didn't know. Can go part-time now.)

**Decision:**
1. Reduced hours to 3 days/week (Age 34)
2. Saved ₩6M/mo instead of ₩10M
3. **Happiness: 10/10**
4. Still hitting FI by 40 (new calc: June 2031, Age 39)

**His review:**
> *"44개월 저축하면 FI 달성. 이 계산 Excel로 2시간 걸렸어요. 이건 2분."*  
> (44 months of saving = FI. Excel took 2 hours. This took 2 minutes.)

> *"Coast FIRE 이미 달성한 줄 몰랐어요. 인생 바뀜."*  
> (Didn't know I already hit Coast FIRE. Life changed.)

**Score:** 5.0 → 8.5 (FIRE features)

---

### FIRE Terminology Explained

**1. FI Number (Financial Independence Number)**
- Amount needed to retire
- Formula: Annual Expenses / 0.04
- Example: $48K/year → $1.2M FI Number

**2. 4% Rule**
- Withdraw 4% of portfolio annually
- Portfolio lasts 30+ years (historical data)
- Safe withdrawal rate

**3. FI Date**
- When you'll hit FI Number
- Factors: Savings rate + Investment returns
- Example: $4K/mo savings + 7% returns = 8.5 years

**4. Coast FIRE**
- Amount that grows to FI Number by retirement age
- Formula: FI Number / (1 + return)^years
- Example: $1.2M needed at 65, you're 35 → Coast = $200K

**5. Types of FIRE**
- **Lean FIRE:** Minimal expenses ($20-30K/year)
- **Regular FIRE:** Comfortable ($40-60K/year)
- **Fat FIRE:** Luxurious ($100K+/year)
- **Barista FIRE:** Part-time work for health insurance
- **Coast FIRE:** Stop saving, let it grow

---

### Key Use Cases

**1. Doctor Planning FIRE at 40**
- High income, high savings
- Needs: FI Date precision
- Result: 2 years earlier than expected

**2. Couple with One Working**
- Single income household
- Needs: FI Number clarity
- Result: Realized they're 40% there

**3. Expat Planning Geographic FIRE**
- Live in Thailand ($2K/mo expenses)
- Needs: Multi-currency FI Number
- Result: FI Number $600K (vs $1.2M in US)

**4. Engineer Considering Coast FIRE**
- Age 32, $400K saved
- Needs: Coast calculation
- Result: Already Coast → Switched to 3-day workweek

---

### Technical Implementation

**Formulas:**

**FI Number:**
```
FI_Number = Annual_Expenses / 0.04
```

**FI Date (with investment returns):**
```
FV = PV × (1 + r)^t + PMT × [((1 + r)^t - 1) / r]

Where:
- FV = Future Value (FI Number)
- PV = Present Value (current savings)
- r = Monthly investment return (annual / 12)
- t = Months to FI
- PMT = Monthly savings
```

**Coast FIRE:**
```
Coast_Number = FI_Number / (1 + annual_return)^years_to_retirement
```

**Progress:**
```
Progress = (Current_Savings / FI_Number) × 100%
```

---

## 4. 📅 Phase Planning

### What It Is
Model life transitions with different phases:
- Create unlimited phases
- Each phase: Duration + Budget
- Visual timeline
- Automatic calculations

### Why It Matters

**The Problem:**
> *"My sabbatical: 3mo Asia cheap, 3mo Europe expensive, 6mo job search. Average budget doesn't work. Need phase-by-phase."*  
> — Emma, Sabbatical Planner

**The Solution:**
Different life stages = different budgets. Plan accurately.

**Impact:**
- Realistic planning (not averages)
- Flexibility (adjust phases)
- Confidence (see the whole journey)

### Screenshots Placeholders

**[Screenshot 1: Phase Timeline]**
```
Phase 1: Travel Asia
├─ Duration: 3 months
├─ Budget: $3,000/mo
└─ Total: $9,000

Phase 2: Bootcamp (London)
├─ Duration: 6 months
├─ Budget: $5,000/mo
└─ Total: $30,000

Phase 3: Job Search
├─ Duration: 6 months
├─ Budget: $3,500/mo
└─ Total: $21,000

Total Runway: 15 months
Total Cost: $60,000
```
Caption: "See your journey, phase by phase"

**[Screenshot 2: Budget Breakdown Chart]**
- Stacked bar chart
- Each bar = month
- Colors = phase
- Caption: "Visualize budget fluctuations"

**[Screenshot 3: Phase Edit Modal]**
```
Edit Phase: "Travel Asia"
├─ Name: [Travel Asia]
├─ Duration: [3] months
├─ Monthly Expenses: [$3,000]
├─ Monthly Income: [$500] (freelance)
├─ Notes: [Bali → Thailand → Vietnam]
└─ [Save] [Cancel]
```
Caption: "Easy to edit, instant recalculation"

### User Story: Emma (Sabbatical Planner)

**Background:**
- 31, Marketing Manager
- Saved: $65K
- Plan: World tour sabbatical + career transition

**The Journey (3 Phases):**

**Phase 1: Asia Exploration (3 months)**
- Locations: Bali → Thailand → Vietnam
- Budget: $3,000/mo
- Why cheap: Coworking, hostels, street food
- Freelance: $500/mo (writing gigs)
- **Net burn: $2,500/mo**
- **Cost: $7,500**

**Phase 2: Europe + Bootcamp (6 months)**
- Location: London (UX bootcamp)
- Budget: $5,000/mo
  - Bootcamp: $2,500/mo
  - Rent: $1,500/mo
  - Living: $1,000/mo
- Freelance: $0 (full-time study)
- **Net burn: $5,000/mo**
- **Cost: $30,000**

**Phase 3: Job Search (6 months)**
- Location: Back to US (with parents)
- Budget: $3,500/mo
  - Rent: $800 (parents' place)
  - Living: $1,500
  - Networking: $700
  - Misc: $500
- Freelance: $1,000/mo
- **Net burn: $2,500/mo**
- **Cost: $15,000**

**Total Calculation:**
```
Phase 1: $7,500 (3mo)
Phase 2: $30,000 (6mo)
Phase 3: $15,000 (6mo)
--------------------------
Total: $52,500
Savings: $65,000
Buffer: $12,500 (2.4 months)
✅ FEASIBLE
```

**Before Personal Runway:**
- Tried averaging: ($3K + $5K + $3.5K) / 3 = $3,833/mo
- Result: $65K / $3,833 = 17 months (wrong!)
- Reality: High expense months drain faster
- Anxiety: 8/10 (will I run out?)

**After (Phase Planning):**
- Entered 3 phases
- Saw exact timeline: 15 months
- Saw buffer: $12,500 (safety net)
- **Anxiety: 3/10** (crystal clear)

**Adjustments Made:**

**Scenario 1: Original Plan**
- Total: 15mo, $52,500
- Buffer: $12,500
- Risk: Medium

**Scenario 2: Extended Asia (cheaper)**
- Phase 1: 6mo Asia ($15K) instead of 3mo
- Phase 2: 3mo bootcamp ($15K) instead of 6mo
- Phase 3: 6mo job search ($15K)
- Total: 15mo, $45K
- Buffer: $20K
- Risk: Low
- **Trade-off:** Less formal education, more travel

**Scenario 3: Skip bootcamp**
- Phase 1: 6mo Asia ($15K)
- Phase 2: 0mo (skip bootcamp)
- Phase 3: 12mo job search ($30K)
- Total: 18mo, $45K
- Buffer: $20K
- Risk: Medium (self-taught UX)

**Decision:** Chose Scenario 2 (Extended Asia + Short bootcamp)

**Reasoning:**
> *"Seeing the 3 scenarios side-by-side made it obvious. Extended Asia gives me $20K buffer AND still gets UX skills. Less stress, same outcome."*

**Her review:**
> *"Phase planning saved my sabbatical. Without it, I'd have burned through savings in Phase 2 and panicked."*

**Score:** 5.0 → 7.5 (Phase Planning)

---

### Key Use Cases

**1. Multi-Location Nomad**
- Phase 1: SEA 6mo ($2K/mo)
- Phase 2: Europe 6mo ($4K/mo)
- Phase 3: Latin America 6mo ($2.5K/mo)

**2. Startup Founder**
- Phase 1: MVP build 3mo ($5K/mo burn)
- Phase 2: Launch 3mo ($8K/mo burn)
- Phase 3: Growth 6mo ($15K/mo burn)

**3. Career Transitioner**
- Phase 1: Upskilling 6mo ($4K/mo)
- Phase 2: Freelance transition 6mo ($3K/mo, +$2K income)
- Phase 3: Full-time search 6mo ($3.5K/mo)

**4. Parental Leave Extension**
- Phase 1: Paid leave 3mo ($0 cost)
- Phase 2: Unpaid leave 6mo ($5K/mo)
- Phase 3: Part-time return 6mo ($3K/mo, +$4K income)

---

### Technical Implementation

**Data Model:**
```typescript
interface Phase {
  id: string
  name: string
  duration: number // months
  monthlyExpenses: number
  monthlyIncome: number
  notes?: string
  order: number
}
```

**Calculations:**
- Phase net burn: `monthlyExpenses - monthlyIncome`
- Phase total cost: `net_burn × duration`
- Overall runway: Sum of all phase durations
- Total cost: Sum of all phase costs
- Buffer: `savings - total_cost`

**UI Features:**
- Drag-to-reorder phases
- Duplicate phase
- Visual timeline (Gantt-style)
- Expandable/collapsible view

---

## 🎨 Design Philosophy

### Visual Hierarchy
1. **Primary:** Key metrics (runway, FI date)
2. **Secondary:** Details (phases, scenarios)
3. **Tertiary:** Settings, notes

### Color System
- 🟢 Green: Safe, on track
- 🟡 Yellow: Caution, low buffer
- 🔴 Red: Danger, insufficient funds
- 🔵 Blue: Informational, neutral

### Iconography
- Lucide icons (consistent, professional)
- Meaningful (💰 money, 📅 calendar, 🔄 comparison)
- Not overused (clarity > decoration)

---

## 📊 Feature Comparison Matrix

| Feature | Personal Runway | Mint | YNAB | Excel |
|---------|----------------|------|------|-------|
| Scenario Comparison | ✅ Unlimited | ❌ | ❌ | ⚠️ Manual |
| Phase Planning | ✅ Unlimited | ❌ | ❌ | ⚠️ Manual |
| FIRE Calculator | ✅ Full suite | ❌ | ❌ | ⚠️ DIY |
| i18n (Korean) | ✅ Native | ❌ | ❌ | ⚠️ Manual |
| Mobile-First | ✅ | ✅ | ✅ | ❌ |
| Local-First | ✅ Privacy | ❌ Cloud | ❌ Cloud | ✅ |
| Income Tracking | ✅ | ✅ | ✅ | ⚠️ Manual |
| PDF Export | ✅ | ⚠️ Limited | ❌ | ✅ |

**Key Differentiators:**
1. Scenario Comparison (only us)
2. Phase Planning (only us)
3. FIRE Calculator (only us)
4. Korean support (only us in this space)

---

## 🚀 Coming Soon

### Q2 2026
- 🌍 Multi-currency live conversion
- 📱 Mobile app (iOS + Android)
- 🤝 Shared scenarios (partner planning)
- 📊 Advanced charting

### Q3 2026
- 🌏 Japanese language (ja)
- 💼 Team accounts (startups)
- 🔔 Milestone notifications
- 📈 Investment portfolio integration

### Q4 2026
- 🇪🇸 Spanish language (es)
- 🏦 Tax optimization tips
- 🎓 1-on-1 coaching integration
- 🤖 AI-powered suggestions

---

## 💬 User Testimonials by Feature

### i18n (Korean)
> *"한국어 없었으면 부모님 설득 불가능. 이제 가족 전체가 이해함."*  
> — 최소연 (7.5/7)

### Scenario Comparison
> *"BCG에서 했던 시나리오 분석, 이제 혼자 5분 만에."*  
> — Sarah (8/7)

### FIRE Calculator
> *"Coast FIRE 이미 달성. 몰랐어요. 파트타임 전환 결정."*  
> — 박준영 (8.5/7)

### Phase Planning
> *"$20K 버퍼 생김. 안식년 불안감 제로."*  
> — Emma (7.5/7)

---

## 🎯 Call to Action

**Experience these features yourself:**

🚀 **[Sign Up for Beta](#)** - Free for 6 months  
📖 **[Read User Stories](#)** - Real people, real results  
💬 **[Join Community](#)** - Discord, Twitter, Reddit

**Questions?** Email: hello@personalrunway.app

---

**End of Feature Showcase** 🌟

**Next:** Onboarding Guide →
