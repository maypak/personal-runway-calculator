# Personal Runway Calculator
### The #1 financial timeline calculator for variable income

Track how long your money will last when income is unpredictable.  
Built for freelancers, founders, and anyone planning 1-2 years without steady income.

🌐 **Live App:** [https://personal-runway-calculator.vercel.app](https://personal-runway-calculator.vercel.app)

---

## 🎯 What is this?

A free web app that helps you calculate your **runway** — how long your money will last with variable income and expenses.

Built by a software engineer who quit after 10 years. I calculated my runway (31 months) and it gave me the confidence to take the leap.

Now I'm sharing this tool with you.

---

## ✨ Features

### 🏆 Variable Income & Expenses
The killer feature other calculators don't have:
- Enter different income/expenses each month
- Model "good month ($8K) vs dry spell ($2K)"
- One-time expenses at specific dates
- Recurring bills with start/end dates

### 📊 Scenario Comparison (NEW!)
Compare 3 scenarios side-by-side:
- "6-month sabbatical vs 12-month"
- "Bootstrap vs take funding"
- "Conservative vs optimistic"
- Multi-line runway projection chart
- Auto-generated insights (best runway, lowest burn rate)

### 📅 Phase-Based Planning
Plan life stages with different budgets:
- Phase 1: Travel (low expenses)
- Phase 2: Home (normal expenses)
- Phase 3: Back to work (income resumes)

### 🔥 Real-time Burn Rate
See your runway shrink/grow as you adjust numbers:
- Track your savings, expenses, and income
- See exactly how many months/years you can last
- Real-time updates with every change
- Color-coded status (green/yellow/red)

### ☁️ Cloud Sync
- Your data syncs across devices
- Secure authentication with Supabase
- **Data persists reliably** — never lose your settings
- Access anywhere, anytime

### 📱 Progressive Web App (PWA)
- Install on mobile/desktop like a native app
- Works offline (coming soon)
- Fast, responsive, mobile-first design
- Home screen icon ready

---

## 📖 Real-World Use Cases

### Freelancer: Sarah ($2K-$10K monthly swings)
**Problem:** "My income is crazy unpredictable. Can I survive a 3-month dry spell?"

**Solution:**
- Created 3 scenarios: "Good months ($8K)", "Average ($5K)", "Dry spell ($2K)"
- Discovered she has 9 months runway even at $2K/month
- Now confidently turns down low-paying gigs

### Founder: James (18-month startup runway)
**Problem:** "Burning $5K/month. When do I need revenue or go back to work?"

**Solution:**
- Tracked personal ($3K) + business ($2K) burn separately
- Set milestone: "12 months = must hit $5K MRR"
- Extended runway by cutting AWS spend

### Sabbatical: Lisa (6-month travel plan)
**Problem:** "Can I afford 6 months off? What if I extend to 12?"

**Solution:**
- Modeled travel phase ($2K/month) vs home phase ($3.5K)
- Scenario comparison: 6mo vs 12mo
- Decided to quit with confidence (18-month cushion)

---

## 🚫 What This Tool Is NOT

We're honest about limitations:

❌ **Not a 30-year retirement calculator**  
Missing: inflation adjustment, Monte Carlo simulation, tax modeling.  
For FIRE planning, use [FIRECalc](https://firecalc.com).

❌ **Not multi-currency (yet)**  
Currently single-currency only. Phase 3 roadmap item.

❌ **Not multi-user**  
Built for individuals, not couples/households.

❌ **Not a budgeting app**  
We show runway, not "spend $X on groceries."

**What we ARE:** The best 1-2 year runway calculator for variable income.

---

## 🚀 Quick Start

### 🎉 Join Private Beta (New!)

We're accepting a limited number of beta testers! Get early access and help shape the product.

**Beta Tester Perks:**
- ✅ Lifetime 50% discount (when we launch pricing)
- ✅ Priority feature requests
- ✅ Early access to all new features (FIRE calculator, scenario planning, phase-based planning)
- ✅ Direct line to the founding team

**👉 [Apply for Private Beta](#)** _(Google Form - link coming soon!)_

---

### Use the App (Recommended)

1. Visit [https://personal-runway-calculator.vercel.app](https://personal-runway-calculator.vercel.app)
2. Create a free account
3. Enter your financial settings
4. See your runway instantly!

### Run Locally

```bash
# Clone the repo
git clone https://github.com/maypak/personal-runway-calculator.git
cd personal-runway-calculator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Who is this for?

### Perfect for (our sweet spot):
- **Freelancers** with $2K-$10K monthly income swings
- **Startup founders** tracking 18-month runway
- **Sabbatical planners** asking "Can I take 6 months off?"
- **Job seekers** with 3-month severance packages
- **Career breakers** quitting to travel/study

### NOT for (use other tools):
- **30-year retirement planning** → Use [FIRECalc](https://firecalc.com) or [cFIREsim](https://cfiresim.com)
- **Investment portfolio tracking** → Use Personal Capital
- **Budgeting & debt payoff** → Use YNAB or Actual Budget

**Why we're different:** We're the ONLY calculator that handles variable income month-by-month. Most tools assume steady paychecks — useless for freelancers and founders.

---

## 💡 Why I built this

I worked as a software engineer for 10+ years. When I decided to quit, my biggest fear was:

> **"How long can I survive without income?"**

But here's the truth: **Your money isn't just money. It's TIME.**

- $50,000 in savings? That's **12 months** of freedom.
- $100,000? That's **2+ years** to chase your dream.

I built this calculator to answer that question. My result: **31 months**.

That number gave me confidence to take the leap. Now it's your turn.

**Stop counting dollars. Start counting days.** 🕐

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL + Row Level Security)
- **Auth:** Supabase Auth (Email + OAuth ready)
- **Deployment:** Vercel (Edge Network)
- **PWA:** Manifest + Icons (installable)
- **Code Quality:** ESLint, Karpathy principles

---

## 📸 Screenshots

![Dashboard](./screenshots/dashboard.png)
![Auth](./screenshots/auth.png)

---

## 🔐 Privacy & Security

- ✅ **Row Level Security (RLS)** — only you can access your data
- ✅ Data encrypted at rest and in transit (Supabase)
- ✅ **Reliable persistence** — settings saved correctly (tested daily)
- ✅ No ads, no selling data
- ✅ Privacy-friendly analytics (Vercel Analytics: no cookies, 24h retention)
- ✅ **Open source** — audit the code yourself
- ✅ Your financial data never leaves Supabase's secure infrastructure

---

## 📝 Roadmap

### Phase 1: MVP (✅ Done - Feb 2026)
- [x] Runway calculator with real-time updates
- [x] Expense tracking (one-time + recurring)
- [x] Cloud sync with Supabase
- [x] **Reliable data persistence** (P0 bug fixed 2/15)
- [x] **PWA ready** (installable icons)
- [x] Mobile-first responsive design
- [x] Production deployment (Vercel)
- [x] Comprehensive QA automation

### Phase 2: Launch (🚀 In Progress - Feb 2026)
- [x] **95% ready** — P0 bugs fixed, PWA ready, a11y improved, SEO optimized
- [x] **Beta signup form** — Google Form template ready
- [x] **Launch materials ready** — Twitter, Product Hunt, Reddit guides (40KB)
- [x] **SEO optimized** — Structured data, metadata, accessibility
- [x] **WCAG 2.1 AA compliant** — ARIA labels, keyboard support, a11y audit
- [x] **Scenario Comparison** ✅ — Create, compare, edit scenarios (Week 2 P0-2)
- [ ] Private beta (10-20 testers) ⏳ **Next step**
- [ ] Product Hunt launch (materials ready, waiting for beta feedback)
- [ ] Reddit/HackerNews launch (posts ready, waiting for beta validation)
- [ ] User feedback collection & iteration
- [ ] OAuth providers (Google, GitHub) — UI ready, needs Supabase activation

### Phase 3: Features
- [ ] Multi-currency support
- [ ] Export to PDF/CSV
- [ ] Goal setting
- [ ] Projections & trends
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

This is an open-source project. Contributions welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

## 🙏 Support

If this tool helped you:
- ⭐ Star this repo
- 🐦 Share on [Twitter](https://twitter.com/intent/tweet?text=Just%20calculated%20my%20personal%20runway!%20Check%20out%20this%20free%20tool%20→%20https://personal-runway-calculator.vercel.app)
- 💬 Spread the word to friends planning financial freedom

---

## 📧 Contact

Built by [@maypak](https://github.com/maypak)

Questions? Found a bug? Open an issue or reach out!

---

**Stop guessing. Start planning.** 🚀

Calculate your runway and take control of your future.

[Launch the Calculator →](https://personal-runway-calculator.vercel.app)

