# Personal Runway Calculator ⏱️

**Your money isn't just money. It's TIME.**

Calculate how much time you have to chase your dream, build your startup, or find yourself.

Track expenses. See your runway in real-time. Make confident decisions.

🌐 **Live App:** [https://personal-runway-calculator.vercel.app](https://personal-runway-calculator.vercel.app)

---

## 🎯 What is this?

A free web app that helps you calculate your **personal runway** (also called "financial runway" - the time your money will last) — how long your savings will last without a job.

Built by a software engineer who quit after 10 years. I calculated my runway (31 months) and it gave me the confidence to take the leap.

Now I'm sharing this tool with you.

---

## ✨ Features

### 💰 Runway Calculator
- Track your savings, expenses, and income
- See exactly how many months/years you can last
- Real-time updates with every change
- Color-coded status (green/yellow/red)

### 📊 Expense Tracking
- Add daily expenses with categories
- Track recurring monthly bills
- Monthly budget monitoring
- Overspending alerts

### 📈 Financial Dashboard
- Current runway visualization
- Spending breakdown
- Monthly spending (burn rate)
- Available funds tracker

### 🎯 Scenario Comparison (NEW!)
Compare multiple financial scenarios side-by-side:
- Create up to 3 scenarios with different assumptions
- Side-by-side comparison table
- Multi-line runway projection chart
- Auto-generated insights (best runway, lowest burn rate)
- Mobile-responsive design

**Use Cases:**
- "Should I bootstrap or fundraise?"
- "Conservative vs Optimistic planning"
- "Impact of part-time income on runway"

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

- 🧑‍💼 Planning to quit your 9-5
- 🎨 Freelancers tracking finances
- 🚀 Building a side project while employed
- 🌍 Digital nomads managing runway
- 💸 Anyone pursuing FIRE (Financial Independence / Retire Early)
- 🛠️ Indie hackers & solopreneurs

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

