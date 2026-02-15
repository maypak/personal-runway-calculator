# Beta Tester Guide - Personal Runway Calculator

**Thank you for testing!** 🙏

You're one of the first 10-20 people to use Personal Runway Calculator. Your feedback will shape this product for thousands of future users.

---

## 🎯 What We Need From You

### Time Commitment
**30-60 minutes over 2-3 days**

- Day 1: Sign up, enter settings, add a few expenses (15-20 min)
- Day 2: Use it like normal, check your runway (5-10 min)
- Day 3: Fill out feedback form (10-15 min)

### What to Test

**1. Core Flow (Day 1)**
- ✅ Sign up (email or wait for OAuth)
- ✅ Enter your financial settings
- ✅ See your runway calculate
- ✅ Add 3-5 real expenses
- ✅ Watch runway update

**2. Daily Use (Day 2-3)**
- ✅ Open the app on your phone
- ✅ Add today's expenses
- ✅ Check if data persists (refresh page)
- ✅ Try on different devices (if possible)

**3. Feedback (Day 3)**
- ✅ Fill out feedback form (link will be sent)
- ✅ Report any bugs you find
- ✅ Suggest improvements

---

## 🚀 Getting Started

### Step 1: Access the App

**Link:** https://personal-runway-calculator.vercel.app

**Bookmark it** on your phone and desktop for easy access.

### Step 2: Sign Up

**Current options:**
- Email + password

**Coming soon:**
- Google OAuth
- GitHub OAuth

**Privacy note:** Your financial data is encrypted and private. We don't sell data, track you, or show ads.

### Step 3: Enter Your Financial Settings

Click the **⚙️ Settings** button and enter:

**Required:**
- Current Savings ($)
- Monthly Fixed Expenses ($)

**Optional:**
- Lump Sum ($) - one-time money (bonus, gift, etc.)
- Monthly Income ($) - if you have income during your "runway"
- Income Months - how many months that income lasts
- Monthly Variable ($) - fluctuating expenses (optional)

**Example:**
```
Current Savings: $50,000
Lump Sum: $10,000 (tax refund)
Monthly Income: $2,000 (freelance)
Income Months: 6
Monthly Fixed: $1,500
Monthly Variable: $300
```

**Result:** You'll see your runway (e.g., "2yr 7mo")

### Step 4: Add Expenses

Click **+ Add Expense**

**Fields:**
- Amount ($)
- Category (Food, Transport, Housing, etc.)
- Memo (optional)

**Try adding:**
- Yesterday's coffee ($5 - Food)
- This week's groceries ($80 - Food)
- Last month's rent ($1,200 - Housing)

**Watch your runway update in real-time!**

### Step 5: Explore Features

**What-If Simulator:**
- Click "🎲 Runway Simulator"
- Try: "What if I cut expenses 30%?"
- Try: "What if I earn $2,000/mo freelancing?"

**Themes:**
- Click 🎨 to change color theme
- Try: Purple, Blue, Pink, Orange, Green

**Mobile:**
- Install on your home screen (PWA)
- Check your runway in 5 seconds

---

## 🐛 What to Look For (Bugs)

### Critical Bugs (Report ASAP)

- ❌ **Data not saving** - You refresh, your settings disappear
- ❌ **Calculations wrong** - Runway doesn't match your math
- ❌ **Can't sign up** - Email verification fails
- ❌ **Can't log in** - Credentials correct but login fails
- ❌ **App crashes** - White screen, errors

### Nice-to-Have Fixes

- UI bugs (buttons overlap, text cut off)
- Confusing labels
- Missing features
- Slow performance

**How to report:**
- Email: [beta-feedback@personalrunway.com] (or DM)
- Include: What you did, what happened, what you expected
- Screenshots help!

---

## 💬 Feedback We Want

### Questions We'll Ask (Preview)

**1. First Impression**
- How clear was the "runway" concept?
- Did you understand what to do immediately?
- Any confusion during signup/setup?

**2. Value Prop**
- Does this solve a real problem for you?
- Would you use this regularly? (daily/weekly/monthly)
- Would you recommend to a friend?

**3. Features**
- Which features did you use?
- Which features were confusing?
- What's missing?

**4. Design/UX**
- Is it visually appealing?
- Is it easy to navigate?
- Mobile experience good?

**5. Comparison**
- Have you used YNAB, Mint, spreadsheets?
- How does this compare?
- What does this do better/worse?

**6. Pricing (Hypothetical)**
- Would you pay for this? If so, how much?
- What features would justify paying?

---

## 🎁 What You Get

### Thank You Perks

**1. Listed as Beta Contributor** (optional)
- Your name on the website (if you want)
- Twitter shoutout when we launch

**2. Early Access to Pro Features** (when launched)
- Multi-currency support
- Export to PDF/CSV
- Goal setting
- Advanced analytics

**3. Lifetime 50% Discount** (if we charge)
- Pro plan at half price forever
- No ads, no tracking, priority support

**4. Direct Line to Founder**
- Your feedback shapes the roadmap
- You help thousands of future users

---

## 📋 Testing Checklist

Use this to guide your testing:

### Day 1: Setup & First Use

- [ ] Sign up successfully
- [ ] Enter financial settings
- [ ] See runway calculate correctly
- [ ] Add 3-5 expenses
- [ ] Watch runway update in real-time
- [ ] Refresh page - data still there?
- [ ] Try theme picker (🎨)
- [ ] Open on mobile (bookmark or install)

### Day 2: Daily Use

- [ ] Open app on phone
- [ ] Add today's expenses (1-3)
- [ ] Check if runway changed
- [ ] Try desktop (if you used mobile yesterday)
- [ ] Data syncs across devices?

### Day 3: Exploration & Feedback

- [ ] Try What-If Simulator
- [ ] Change settings (increase/decrease expenses)
- [ ] See how runway changes
- [ ] Fill out feedback form
- [ ] Report any bugs found
- [ ] Suggest 1-2 improvements

---

## 🤔 Common Questions

### Q: Is my data safe?

**A:** Yes. Your financial data is:
- Encrypted at rest and in transit (Supabase)
- Only visible to you (not even we can see it)
- Not sold, tracked, or used for ads
- Open source - you can audit the code

### Q: What if I find a bug?

**A:** Report it! That's what beta testing is for. We'll fix it ASAP.

### Q: Can I share this with friends?

**A:** Not yet! We want to fix bugs before opening to the public. After beta (1-2 weeks), yes please share!

### Q: What happens to my data after beta?

**A:** Nothing. It stays. This is the real product, not a demo.

### Q: Will this always be free?

**A:** The core features (runway calculator, expense tracking) will always be free. We may add Pro features later (multi-currency, exports, analytics), but free users won't lose anything.

---

## 🛠️ Troubleshooting

### Data Not Saving

**Symptoms:** You refresh, your settings disappear.

**Fix:**
1. Clear browser cache
2. Try a different browser (Chrome recommended)
3. Check if you're logged in
4. Report to us (this is a critical bug)

### Can't Sign Up

**Symptoms:** Email verification never arrives.

**Fix:**
1. Check spam folder
2. Wait 5 minutes (emails can be slow)
3. Try a different email
4. Contact us (we'll manually verify)

### Calculations Seem Wrong

**Symptoms:** Runway doesn't match your math.

**How to check:**
- Available funds = Savings + Lump Sum + (Income × Months)
- Monthly burn = Fixed + Variable - Income
- Runway (months) = Available funds ÷ Monthly burn

**If still wrong:** Report with screenshots of your settings.

### App Slow/Laggy

**Fix:**
1. Refresh page
2. Clear browser cache
3. Close other tabs
4. Check internet connection
5. Report if persists (tell us your device/browser)

---

## 📞 Contact

**Email:** [beta-feedback@personalrunway.com]  
**Twitter:** [@PersonalRunway](https://twitter.com/personalrunway) (DM open)  
**Response time:** Within 24 hours

**Bug reports:** Priority - we'll respond ASAP  
**Feature requests:** Noted and considered  
**Questions:** Happy to help!

---

## 🙏 Final Notes

**You're helping build something meaningful.**

Every bug you find, every piece of feedback you give, every "this is confusing" comment - it all makes this product better for thousands of people who will use it after launch.

Quitting a job to chase a dream is scary. Knowing your runway makes it less scary. You're helping make that possible.

**Thank you.** 🙌

---

**— May**  
Founder, Personal Runway Calculator  
[Email] | [@PersonalRunway](https://twitter.com/personalrunway)

---

_Last updated: 2026-02-15_
