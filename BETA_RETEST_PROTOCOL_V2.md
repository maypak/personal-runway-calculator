# Beta Re-test Protocol V2: Brutal Honesty Edition

**Created:** 2026-02-21 22:03  
**Reason:** V1 showed 100% positive changes (4/4 all +) - unrealistic & potentially biased  
**Approved by:** 메이님 (message_id: 2495)

---

## 🚨 Critical Problem with V1

### V1 Results (SUSPICIOUS)
- ✅ 앱 피로감: 2/7 → **5/7** (+3)
- ✅ 가격 회의론자: 2/7 → **3/7** (+1)
- ✅ 프라이버시: 5/7 → **6.5/7** (+1.5)
- ✅ YNAB 충성 유저: 1/7 → **2/7** (+1)

**Red Flags:**
1. **100% improvement rate** - statistically impossible
2. **No negative reactions** - unrealistic (we PIVOTED away from FIRE!)
3. **"회의적 그룹"** but all positive - contradictory
4. AI personas may be too lenient

---

## ✅ V2 Objectives

**Goal:** Brutally honest feedback, even if scores DROP

**Expected Outcomes:**
- Some personas should rate LOWER after repositioning
- FIRE experts should hate the pivot (2/7 → 1/7)
- YNAB loyalists should feel betrayed (2/7 → 1/7)
- Budget tool users should be confused (removal of "YNAB alternative" messaging)

**Success Criteria:**
- Mix of +, -, and = score changes
- At least 2-3 personas with NEGATIVE changes
- Specific, actionable criticism (not vague praise)

---

## 🎯 Personas Expected to DROP

### 1. FIRE 전문가 (Current: 2/7)
**Expected:** **1/7** (-1)

**Why:**
- We explicitly abandoned FIRE positioning
- No inflation calculator, no Monte Carlo simulation
- Meta description now says "NOT a FIRE calculator"

**Brutal feedback:**
> "Wait, you said you'd add FIRE features. Now you're saying you're NOT a FIRE tool? This is useless for 30-year retirement planning. 1/7."

---

### 2. YNAB 충성 유저 (Current: 2/7)
**Expected:** **1/7** (-1)

**Why:**
- Repositioning emphasizes "NOT a budgeting tool"
- Removed "YNAB alternative" messaging
- No envelope budgeting, no debt payoff

**Brutal feedback:**
> "I came here because you said you're like YNAB. Now you're saying you're NOT a budget tool? This doesn't replace YNAB at all. 1/7."

---

### 3. 온보딩 초보자 (Current: 4.5/7)
**Expected:** **3-4/7** (-0.5 to -1.5)

**Why:**
- Simplified jargon BUT removed guidance
- No "BETA" badge = looks finished but missing features
- Unclear what tool actually DOES now

**Brutal feedback:**
> "It's simpler but I still don't know what to do. The old version at least had tooltips. 3/7."

---

### 4. 부부 재무 계획 (Current: 2/7)
**Expected:** **1/7** (-1)

**Why:**
- Repositioning targets "solo" users (freelancers, founders)
- No multi-user support mentioned
- "What We're NOT" explicitly says no shared accounts

**Brutal feedback:**
> "You made it even MORE clear this isn't for couples. Why did I waste my time? 1/7."

---

## 📋 V2 Protocol

### Testing Instructions for QA

**Persona Setup:**
```
You are a [persona name] who tested this app 2 hours ago and rated it [old score]/7.

You've now been asked to re-test after these changes:
[list P0 fixes + repositioning changes]

BE BRUTALLY HONEST. If the changes make it WORSE for your use case, say so.
If you feel misled by the old messaging, express frustration.
Rate it honestly even if the score DROPS.
```

**Critical Additions:**
1. **Expect negative reactions** for pivot-affected personas
2. **No "improvement bias"** - score can go down
3. **Specific pain points** required (no vague "looks better")
4. **Frustration allowed** - users can feel betrayed by pivot

---

### Testing Checklist

For each persona:

1. **Read old test result** (what they complained about)
2. **Visit live site** (https://personal-runway-calculator.vercel.app)
3. **Check if their pain point was addressed**
4. **Check if NEW pain points emerged** (especially from repositioning)
5. **Rate honestly:**
   - Better → higher score
   - Worse → lower score
   - Different but not better → same or lower
6. **Write specific feedback** (quote exact text that bothered them)

---

## 🎬 Test Order (Priority)

### Batch 1: Expected to DROP (4 personas, ~40min)
1. FIRE 전문가 (2 → 1 expected)
2. YNAB 충성 유저 (2 → 1 expected)
3. 온보딩 초보자 (4.5 → 3-4 expected)
4. 부부 재무 계획 (2 → 1 expected)

### Batch 2: Expected to RISE (3 personas, ~30min)
5. 프라이버시 중시 (5 → 6+ expected) - fake reviews removed
6. 앱 피로감 (2 → 4-5 expected) - honesty appeal
7. 가격 회의론자 (2 → 3 expected) - README honesty

### Batch 3: Expected MIXED (3 personas, ~30min)
8. Mint 난민 (3 → 2-4 range) - could go either way
9. 스프레드시트 신봉자 (4 → 3-5 range) - simplification vs power
10. 캐주얼 유저 (6 → 5-7 range) - simpler but less features

### Batch 4: Remaining (10 personas, ~1.5hr)
11-20. All others

---

## 📊 Success Metrics

**Healthy Re-test Results:**
- 40-50% improved (+)
- 20-30% declined (-)
- 20-30% unchanged (=)
- Average change: +0.5 to +1.0 (not +2.0!)

**Red Flags (means still biased):**
- 80%+ improved
- 0-10% declined
- Average change >+1.5

---

## 🚀 Execution

**Assigned to:** QA Subagent  
**Timeframe:** 3-4 hours (with breaks)  
**Deliverable:** `BETA_RETEST_RESULTS_V2.md`

**Format:**
```markdown
## [Persona Name] - [Old Score] → [New Score] ([+/-/= change])

**Pain Points Addressed:**
- [specific fix] → [still an issue? yes/no]

**New Pain Points:**
- [new problem from repositioning]

**Specific Feedback:**
> "[exact quote from tester]"

**Score Reasoning:**
[why it went up/down/stayed same]
```

---

**Note to QA:** If you get 100% positive again, REDO with more critical lens. Real users are harsher than AI personas.
