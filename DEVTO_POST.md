# How I Built a Personal Runway Calculator in 4 Weeks (and Why You Need One)

**Published on:** dev.to  
**Tags:** #showdev #webdev #startup #opensource  
**Cover Image:** Dashboard screenshot (1000x420)

---

## TL;DR

I quit my engineering job without knowing how long my savings would last. Built a free calculator to solve this. Now sharing with the dev community.

**Live:** https://personal-runway-calculator.vercel.app  
**GitHub:** [repo link]  
**Stack:** Next.js 15, TypeScript, Supabase, Tailwind

---

## The Problem

6 months ago, I decided to quit my job after 10 years. The scariest question wasn't "what will I do?" — it was:

**"How long can I survive without income?"**

I had $80K saved. But I didn't know if that was:
- 6 months?
- 12 months?
- 24 months?

Excel felt intimidating. So I just... didn't calculate. And stressed every day.

---

## The Breaking Point

One night at 2am, anxiety spiral. Opened Excel. Did the math.

**Result: 31 months** (2 years 7 months)

That number changed everything:
- ❌ "Can I afford to quit?" 
- ✅ "I have 2.5 years to figure this out"

Anxiety → Clarity  
Fear → Confidence

---

## The Realization

I checked that number every morning. Some days it went up, some days down. But I always KNEW where I stood.

Then I thought: **"Why don't more people do this?"**

Because:
- Spreadsheets = friction
- Mental math = fuzzy
- Banking apps don't show runway
- Budgeting apps are overkill

**What if it was dead simple?**

---

## The Build

### Week 1: MVP

**Goal:** One feature that works perfectly

```typescript
// Core calculation (literally this simple)
const runway = Math.floor(savings / monthlyExpenses);
const years = Math.floor(runway / 12);
const months = runway % 12;
```

**Tech choices:**
- Next.js 15 (wanted to learn App Router)
- TypeScript (sanity)
- Tailwind (fast iteration)
- LocalStorage first (no backend needed)

**Time:** ~15 hours (nights + weekend)

---

### Week 2: Data Persistence

**Problem:** Users wanted to track across devices

**Solution:** Add Supabase

```typescript
// Schema (dead simple)
CREATE TABLE finance_settings (
  user_id UUID PRIMARY KEY,
  current_savings DECIMAL,
  monthly_fixed DECIMAL,
  monthly_variable DECIMAL
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL,
  category TEXT,
  date DATE
);
```

**Why Supabase:**
- Auth out of the box
- Real-time subscriptions (nice to have)
- RLS policies (security)
- Free tier (generous)

**Gotcha:** RLS policies took me 3 hours to get right. Pro tip: Test with `set role` in SQL.

**Time:** ~20 hours

---

### Week 3: Polish

**User feedback:** "I want to test scenarios before deciding"

**Feature:** "What-if" simulator

```typescript
const simRunway = (savings - oneTimeExpense) / 
                  (monthlyExpense - additionalIncome);
const runwayDiff = simRunway - actualRunway;
```

**UI Polish:**
- Glassmorphism design (backdrop-blur is 🔥)
- Color-coded status (green/yellow/red)
- Progress bars (visual feedback)
- Mobile-first (Tailwind responsive)

**Time:** ~18 hours

---

### Week 4: Launch Prep

**Tasks:**
- SEO metadata (OpenGraph, Twitter Cards)
- PWA manifest (mobile app feel)
- README cleanup
- Deployment (Vercel)
- Beta testing (7 alpha users)

**Deployment:**
```bash
# Literally this easy with Vercel
vercel deploy
# Done. 30 seconds.
```

**Time:** ~10 hours

---

## Tech Stack Breakdown

### Frontend
```json
{
  "framework": "Next.js 15",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "state": "React hooks (useState, useEffect)",
  "forms": "Native (no library needed)"
}
```

### Backend
```json
{
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage (future)",
  "functions": "Supabase Edge Functions (future)"
}
```

### Deployment
```json
{
  "hosting": "Vercel",
  "domain": "Vercel DNS",
  "ssl": "Auto (Let's Encrypt)",
  "ci/cd": "Auto (Git push → deploy)"
}
```

**Why this stack:**
- Wanted to learn Supabase (worth it!)
- Next.js = fast development
- Tailwind = no CSS files
- Vercel = zero config

**Total cost:** $0/month (so far)

---

## Key Features

### 1. Instant Runway Calculation

```typescript
// User inputs
const savings = 60000;
const monthlyExpenses = 3000;

// Output
const runway = 20; // months
// Display: "1yr 8mo"
```

30 seconds to start. Zero friction.

---

### 2. Daily Expense Tracking

```typescript
// Add expense
await supabase
  .from('expenses')
  .insert({
    amount: 45,
    category: 'Food',
    date: new Date().toISOString()
  });

// Recalculate runway (real-time)
const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
const newRunway = (savings - totalSpent) / monthlyExpenses;
```

Track as you go. See impact immediately.

---

### 3. What-If Scenarios

```typescript
// Simulator
const scenarios = {
  cutExpenses30: runway * 1.43, // 30% cut = 43% more runway
  freelance2K: monthlyExpenses <= 2000 ? Infinity : runway * 2,
  sabbatical: runway - 6 // 6-month trip
};
```

Test before you leap.

---

## What I Learned

### 1. Start with LocalStorage

Don't add a database until you NEED it.

**Week 1:** LocalStorage only  
**Week 2:** Users asked for sync → added Supabase

This kept Week 1 focused on the core feature.

---

### 2. Supabase RLS is Powerful (but tricky)

**Gotcha:** RLS policies apply to service role too (unless you bypass).

```sql
-- Wrong (blocks even service role)
CREATE POLICY "Users can only see own data"
ON expenses FOR SELECT
USING (auth.uid() = user_id);

-- Right (bypass for service role)
CREATE POLICY "Users can only see own data"
ON expenses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

**Pro tip:** Test RLS with `set role`:
```sql
SET role authenticated;
SET request.jwt.claims.sub = '<user-uuid>';
SELECT * FROM expenses; -- Should only show user's data
```

---

### 3. Deploy Early, Deploy Often

I deployed to Vercel on Day 3.

**Why:**
- Caught mobile issues early
- Showed friends real product (not localhost)
- Forced me to think about production

**Lesson:** Localhost lies. Production tells truth.

---

### 4. Users Want Simplicity

Early feedback:
- "Can you add budgeting categories?"
- "Can you integrate with my bank?"
- "Can you forecast 10 years out?"

My response: **No.**

This is a runway calculator. One job. Do it well.

**Feature creep kills MVPs.**

---

### 5. TypeScript is Worth It

I almost went vanilla JS for speed.

Glad I didn't. TypeScript caught:
- 14 bugs before runtime
- Silly mistakes (typos, wrong types)
- API shape changes

**Time saved:** Probably 5+ hours of debugging.

---

## Performance Metrics

### Lighthouse Score
- Performance: 98
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**How:**
- Next.js optimizations (auto)
- Lazy loading images
- Minimal JS bundle
- No external dependencies (analytics, etc.)

---

### Bundle Size
```bash
Route (app)                Size     First Load JS
┌ ○ /                      142 B          87.2 kB
└ ○ /_not-found            871 B          80.8 kB
```

**87 kB total.** Fast on 3G.

---

### Database Queries
Average query time: **8ms**

**Why fast:**
- Simple schema (3 tables)
- Indexed columns (user_id, date)
- Supabase edge network

---

## Challenges & Solutions

### Challenge 1: Email Verification

**Problem:** Supabase email verification = extra step = friction

**Attempt 1:** Anonymous auth  
→ Failed (users lost data on device switch)

**Attempt 2:** Magic links  
→ Too slow (email delays)

**Solution:** Email + password (classic)  
→ Works. Not sexy, but reliable.

**Lesson:** Boring technology wins.

---

### Challenge 2: Mobile Layout

**Problem:** Dashboard cramped on iPhone SE

**Solution:**
```tsx
// Before (desktop-first)
<div className="grid grid-cols-3 gap-4">

// After (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

**Lesson:** Mobile-first isn't just marketing.

---

### Challenge 3: Time Zones

**Problem:** User in Tokyo sees wrong dates

**Solution:**
```typescript
// Before
new Date().toISOString(); // UTC

// After
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localDate = new Date().toLocaleString('en-US', { timeZone: userTimezone });
```

**Lesson:** Never assume timezone.

---

## What I'd Do Differently

### ✅ Right Decisions

1. **Started with MVP** (one feature only)
2. **Used Supabase** (auth + DB in one)
3. **Deployed early** (Day 3)
4. **TypeScript** (caught bugs)
5. **Mobile-first** (most users on phone)

---

### ❌ Wrong Decisions

1. **Spent 8 hours on "What-If" feature** (users barely use it)
2. **Didn't set up analytics early** (missed user behavior data)
3. **Over-engineered state management** (plain useState was enough)
4. **Didn't write tests** (regret this now)
5. **Built dark mode** (0 requests for it)

---

### 🤔 Things I'm Unsure About

1. **Pricing:** Free vs $5/mo vs $20/mo?
2. **Monetization:** When to paywall features?
3. **Marketing:** Where are my users?
4. **Features:** What's actually valuable?

---

## Code Snippets

### Runway Calculation Hook

```typescript
// /app/hooks/useRunway.ts
import { useState, useEffect } from 'react';

export function useRunway(savings: number, monthlyExpenses: number) {
  const [runway, setRunway] = useState(0);

  useEffect(() => {
    if (monthlyExpenses > 0) {
      const months = Math.floor(savings / monthlyExpenses);
      setRunway(months);
    } else {
      setRunway(999); // "Infinite"
    }
  }, [savings, monthlyExpenses]);

  const years = Math.floor(runway / 12);
  const months = runway % 12;

  return {
    runway,
    years,
    months,
    display: years > 0 ? `${years}yr ${months}mo` : `${months}mo`
  };
}
```

---

### Supabase Client Setup

```typescript
// /app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### Expense Tracking Component

```typescript
// Simplified version
function ExpenseTracker() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const handleAdd = async () => {
    const { error } = await supabase
      .from('expenses')
      .insert({
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString()
      });

    if (!error) {
      setAmount('');
      // Trigger runway recalculation
      refreshRunway();
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Transport</option>
        <option>Entertainment</option>
      </select>
      <button type="submit">Add Expense</button>
    </form>
  );
}
```

---

## Next Steps

### This Week
- [ ] Beta testing (50 users)
- [ ] Gather feedback
- [ ] Fix bugs

### This Month
- [ ] Product Hunt launch
- [ ] Add multi-currency support
- [ ] Export to PDF/CSV
- [ ] Recurring expenses

### This Quarter
- [ ] Mobile app (React Native?)
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Integrations (banks, accounting software)

---

## Open Questions for the Community

1. **Pricing:** Would you pay $5/mo or $20/mo for this? What features would justify that?

2. **Features:** What's missing? What would make you actually USE this daily?

3. **Tech:** Should I add tests now (before more features) or later?

4. **Marketing:** Where would you share this? Who needs it most?

---

## Try It!

**Live app:** https://personal-runway-calculator.vercel.app  
**GitHub:** [repo link]  
**Beta access:** [form link] (50 spots)

---

## Conclusion

Built in 4 weeks. Helped me quit my job with confidence. Now helping others do the same.

**Key takeaways:**
- Start simple (one feature)
- Deploy early (Day 3)
- Listen to users (but don't build everything they ask for)
- Boring tech wins (email auth > magic links)
- Runway > bank balance (for clarity)

If you're thinking about quitting your job, freelancing, or taking a career break:

**Calculate your runway first.**

That one number will give you more confidence than any motivational quote.

---

**Questions? Roast my code? Feature requests?**

Drop a comment below 👇

Or DM me on Twitter: [@personalrunway]

Happy to discuss anything: tech stack, quitting a job, runway calculations, Next.js, Supabase, whatever!

---

**Thanks for reading!** 🚀

If this was helpful:
- ⭐ Star the repo
- 🐦 Share on Twitter
- 💬 Drop a comment

Let's help more people take the leap 🙏
