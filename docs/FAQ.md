# Frequently Asked Questions (FAQ)

## 🎯 Getting Started

### What is Personal Runway Calculator?
Personal Runway Calculator helps you answer the question: **"How long can I survive on my current savings?"**

It's designed for:
- **Career transitioners** planning job changes
- **FIRE seekers** calculating when they can retire early
- **Sabbatical planners** taking career breaks
- **Founders** tracking startup runway
- **Anyone** making financial decisions that involve time

### How does it work?
1. Enter your current savings
2. Add your monthly expenses
3. Add any ongoing income (optional)
4. See your runway instantly

**Formula:** `Runway = Savings / (Expenses - Income)`

### Is it free?
Yes! Currently in **Private Beta** (free for all beta testers).

**Beta tester perks:**
- Lifetime 50% discount when we launch pricing
- Priority feature requests
- Early access to all new features

---

## 💰 Money & Privacy

### Is my financial data safe?
**Absolutely.** We use:
- **Supabase** (bank-grade security, SOC 2 certified)
- **Encryption** at rest and in transit
- **Row-level security** (you can only see your own data)
- **No third-party sharing** — ever

### Where is my data stored?
Your data is stored on **Supabase** (AWS infrastructure, US region by default).

### Can I export my data?
Not yet, but it's planned for Week 5 (late March 2026). You'll be able to export to CSV/JSON.

### Can I delete my account?
Yes! Email us at beta@personalrunway.app and we'll delete everything within 24 hours.

(Self-service account deletion coming soon!)

### Do you sell my data?
**Never.** We're building a product people pay for, not an ad-driven platform. See our [Privacy Policy](/privacy).

---

## 🔧 Features & Functionality

### What currencies do you support?
Currently, **USD** is the default. However, you can use **any currency** — the calculations work the same:
- Enter amounts in KRW (₩), EUR (€), GBP (£), etc.
- Just be consistent across all fields
- We'll add multi-currency support in a future update

### Can I track multiple savings accounts?
Not individually yet. For now, **add them together** and enter the total.

Example:
- Bank account: $20,000
- Emergency fund: $15,000
- Accessible investments: $10,000
- **Total savings: $45,000** ← Enter this

Multi-account tracking is on the roadmap!

### Can I track variable income (freelance, contract work)?
Yes! Use **average monthly income** from the last 3-6 months.

**Example:**
- Jan: $3,200
- Feb: $4,800
- Mar: $2,100
- April: $5,400
- May: $3,900
- June: $4,200
- **Average: $3,933/month** ← Enter this

**Conservative approach:** Use your **minimum monthly income** instead.

### What if I have no income?
That's fine! Just leave income at **$0**. Your runway = Savings / Expenses.

### Can I compare different scenarios?
**Coming in Week 2!** (Late Feb 2026)

You'll be able to create multiple scenarios like:
- "Current job vs. Quit now"
- "Freelance vs. Full-time"
- "Stay vs. Sabbatical"

And see side-by-side runway comparisons.

### Can I calculate my FIRE date?
**Yes!** The FIRE Calculator is now available at `/fire`.

It includes:
- **FI Number** (based on 4% rule)
- **Projected FI Date** (with investment returns and monthly contributions)
- **Coast FIRE** calculation (when you can stop saving)
- **Progress tracking** (visual progress bar with milestones)
- **Lean/Fat FIRE** scenarios
- **Interactive projection chart** (10-year forecast)

**Note:** You need to add your monthly expenses first (on the main Dashboard) for the FIRE calculator to work.

### Can I plan different life phases?
**Coming in Week 4!** (Mid March 2026)

Phase-based planning lets you break your runway into stages:
- "6 months travel ($4k/mo) → 3 months job search ($3k/mo) → new job"
- Different budgets per phase
- Timeline visualization
- Drag-and-drop reordering

---

## 🐛 Troubleshooting

### I can't sign up / Login doesn't work
**Try these steps:**

1. **Email signup issues:**
   - Check your spam folder for verification email
   - Password must be 12+ characters with uppercase, lowercase, number, and special character
   - Wait 1-2 minutes for verification email

2. **OAuth (Google/GitHub) issues:**
   - Make sure pop-ups are allowed
   - Try incognito/private mode
   - Clear browser cache

3. **Still stuck?**
   - Email us: beta@personalrunway.app
   - We'll respond within 24 hours

### My data didn't save
**Possible causes:**

1. **Network issue:** Check your internet connection
2. **Session expired:** Try logging out and back in
3. **Browser issue:** Try a different browser (Chrome recommended)

### The FIRE Calculator page is empty / shows "Add Your Expenses First"
This is normal for new users! The FIRE calculator needs your expense data to calculate your FI Number.

**Solution:**
1. Go to the **main Dashboard** (/)
2. Click **Settings** (gear icon)
3. Add your **monthly expenses** (Fixed + Variable)
4. Return to the **FIRE page** (/fire)
5. Your FIRE metrics will now appear!

**Why?** The FIRE calculator uses the **4% rule**, which requires knowing your annual expenses:
- FI Number = Annual Expenses × 25
- Example: $4,000/month × 12 = $48,000/year → FI Number = $1,200,000

Without expense data, we can't calculate your FI Number.

**If it keeps happening:** Report a bug at beta@personalrunway.app

### The calculations seem wrong
**Check these:**

1. **Units:** Are all amounts in the same currency?
2. **Time period:** Expenses and income should both be **monthly**
3. **Negatives:** Don't enter negative numbers (income and expenses are separate)

**Example of correct input:**
- Savings: `45000` (not `$45,000` or `45k`)
- Expenses: `3500` (per month)
- Income: `5800` (per month)

**Still wrong?** Email us with screenshots: beta@personalrunway.app

### The page won't load / Keeps crashing
**Try:**

1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Try incognito/private mode
4. Try a different browser

**If it's still broken:** We have a bug! Report it: beta@personalrunway.app

### Mobile app doesn't work
We don't have a native mobile app yet. But the **website is mobile-responsive**:
- Visit https://personal-runway-calculator.vercel.app on your phone
- Works on iPhone, Android, tablets
- Add to home screen for app-like experience

Native apps (iOS/Android) are on the roadmap!

---

## 🚀 Beta Program

### How do I join the beta?
Fill out our **Private Beta application** (link in README or welcome email).

We review applications on a rolling basis and accept in batches.

### What are the beta tester requirements?
We're looking for people who:
- Match our target use cases (career change, FIRE, sabbatical, startup, etc.)
- Are willing to provide honest feedback
- Can use the app for at least 1 week
- Bonus: Willing to do a 15-min user interview

### How long is the beta period?
**Private Beta:** 2 weeks (limited to 20-50 users)

**Public Beta:** Mid-March 2026 (after P0-4 features ship)

### What do beta testers get?
- ✅ Lifetime 50% discount (when we launch pricing)
- ✅ Priority feature requests
- ✅ Early access to all new features
- ✅ Direct access to the founding team
- ✅ Optional: Your name in our "Beta Hall of Fame"

### How do I give feedback?
**Quick feedback:**
- Reply to any of our emails

**Detailed feedback:**
- Fill out our survey (link in welcome email)

**Bug reports:**
- Email: beta@personalrunway.app
- Include: what you did, what happened, screenshot (if possible)

**Feature requests:**
- Tell us what you'd love to see!
- We prioritize based on user demand

---

## 🗺️ Roadmap

### What features are coming next?

**Week 2 (Late Feb):**
- Scenario comparison (compare multiple runway plans)

**Week 3 (Early Mar):**
- FIRE date calculator (when can you retire?)

**Week 4 (Mid Mar):**
- Phase-based planning (break runway into life stages)

**Week 5+ (Late Mar & beyond):**
- Data export (CSV/JSON)
- Multi-currency support
- Investment returns modeling
- Sharing/collaboration
- Mobile apps (iOS/Android)
- Integrations (Mint, YNAB, Plaid)

### Can I request a feature?
**Absolutely!** We prioritize based on user feedback.

**How to request:**
1. Email us: beta@personalrunway.app
2. Fill out the feedback form (in welcome email)
3. Vote on our roadmap (coming soon: public voting board)

### Will this always be free?
**Beta testers get lifetime 50% off.**

We plan to launch pricing in Q2 2026 (April-June). Likely models:
- **Free tier:** Basic runway calculation
- **Pro tier ($5-10/mo):** Scenario comparison, FIRE calculator, phase planning, data export
- **Lifetime deal:** One-time payment for beta testers

Details TBD — we'll ask for your input!

---

## 📖 Terminology

### What is "runway"?
The amount of time you can survive on your current savings before you run out of money.

**Example:**
- Savings: $30,000
- Monthly expenses: $3,000
- Monthly income: $0
- **Runway: 10 months**

### What is "burn rate"?
Your **net monthly spending** (expenses minus income).

**Example:**
- Expenses: $4,000/month
- Income: $1,500/month
- **Burn rate: $2,500/month**

Higher burn rate = shorter runway.

### What is FIRE?
**Financial Independence, Retire Early**

The movement of saving/investing aggressively to retire decades earlier than traditional retirement age (65).

**Key concepts:**
- **FI Number:** Amount needed to retire (usually 25x annual expenses, based on 4% rule)
- **FI Date:** When you'll reach your FI Number
- **Coast FIRE:** Enough invested that you can stop contributing and it'll grow to your FI Number by retirement age

### What is the 4% rule?
A retirement guideline that says you can withdraw **4% of your portfolio per year** indefinitely without running out of money.

**Example:**
- Portfolio: $1,000,000
- Annual expenses: $40,000 (4% of $1M)
- You can retire!

**FI Number = Annual Expenses ÷ 0.04**

### What does "Coast FIRE" mean?
You've saved enough that **you can stop contributing** to retirement and your investments will grow (via compound interest) to your full FI Number by traditional retirement age.

**Example:**
- Age: 30
- Saved: $250,000
- At 7% growth, it'll be $2M by age 60
- You can "coast" (work part-time, lower stress) without saving more

---

## 💬 Contact & Support

### How do I get help?
**Email:** beta@personalrunway.app (response within 24 hours)

**Coming soon:**
- Beta Slack/Discord community
- Live chat support

### I found a bug! How do I report it?
Email us at **beta@personalrunway.app** with:
- What you were trying to do
- What happened (vs. what you expected)
- Screenshot (if possible)
- Browser + device (e.g., "Chrome on Mac")

We'll respond within 24 hours and prioritize fixes.

### Can I suggest a partnership/integration?
Yes! Email us at beta@personalrunway.app with details.

We're especially interested in:
- Financial apps (YNAB, Mint, Plaid)
- FIRE communities (ChooseFI, Mr. Money Mustache, etc.)
- Career coaching platforms
- Startup accelerators

### Who built this?
Personal Runway Calculator was created to solve a real problem: **making confident financial decisions during life transitions.**

**Team:** Currently solo (bootstrapped)

**Tech stack:** Next.js, React, TypeScript, Tailwind, Supabase, Vercel

**Open source?** Considering it for v2!

---

## 🌍 Other

### Do you support languages other than English?
Not yet, but it's high priority!

**Coming soon:** Korean, Spanish, French (based on user demand)

### Can I use this for my business/startup runway?
**Absolutely!** Many founders use it to track how long their startup can survive on current funding.

**Tip:** 
- Savings = Available funding
- Expenses = Monthly burn rate
- Income = Monthly revenue (if any)

We're considering a "Startup Mode" with features like:
- Fundraising milestones
- Team salary planning
- VC-style runway charts

Let us know if you'd use this!

### Can I share my runway with someone? (Partner, advisor, etc.)
Not yet, but it's on the roadmap!

**Planned features:**
- Read-only sharing link
- Collaborative planning (for couples)
- Advisor/coach view

Coming in Week 5+.

---

**Still have questions?** Email us: beta@personalrunway.app

We read every email and respond within 24 hours! 💙
