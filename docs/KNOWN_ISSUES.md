# Known Issues & Limitations

**Last updated:** February 21, 2026

This is a **Private Beta**. We're transparent about what works and what doesn't. Below are known issues we're actively working on.

---

## 🐛 Known Bugs

### None Currently! 🎉

All P0 (critical) bugs have been fixed as of Feb 20, 2026. Daily QA tests running at 3 AM KST.

**Last QA run:** Feb 21, 2026 03:00 AM (expected)
**Status:** ✅ 10/10 tests passing (last run)

---

## 🔧 Recently Resolved Issues

### FIRE Calculator - "Something went wrong" Error (Feb 20, 2026)
**Issue:** New users saw React Error #185 when visiting `/fire`

**Root cause:** Three separate issues discovered through iterative debugging:
1. **Server/client timestamp mismatch** → Server rendered `new Date().toISOString()` differently than client
2. **i18n hydration mismatch** → Translations loaded differently on server vs client
3. **Zero expenses handling** → Calculator threw error when `monthlyExpenses = 0` (new users)

**Fix timeline:**
- 7:54 PM: Error reported by user
- 8:00 PM: Fix attempt #1 — Remove dynamic timestamps → Still failing
- 8:20 PM: Fix attempt #2 — Force client-only rendering → Still failing
- 10:00 PM: User insight: "인풋없을때 생기는 에러?" (Zero input error?)
- 10:10 PM: Fix attempt #3 — Add empty state for zero expenses → ✅ **Resolved!**

**Solution:**
```typescript
// Skip calculation if no expense data
if (annualExpenses <= 0) {
  return <EmptyState message="Add Your Expenses First" />;
}
```

**Lessons learned:**
- Always test with **completely fresh accounts** (no data)
- Edge cases matter: null, 0, empty arrays
- User insights are invaluable for diagnosis

**Commits:**
- `586338a` - Hydration fix #1 (timestamps)
- `d0e6d2f` - Hydration fix #2 (client-only rendering)
- `8595da9` - Hydration fix #3 (zero expenses handling) ✅

---

## 🚧 Limitations (By Design)

These aren't bugs — they're features we haven't built yet!

### 1. Single Currency Only
**Issue:** Only USD is supported (or you can use your own currency but without conversion)

**Workaround:** 
- Use any currency consistently (KRW, EUR, GBP, etc.)
- Just don't mix currencies

**Coming in:** Week 5+ (Multi-currency support)

---

### 2. Single Savings Account
**Issue:** Can't track multiple savings accounts separately

**Workaround:**
- Add all savings together and enter the total
- Example: Bank ($20k) + Emergency fund ($15k) = Total $35k

**Coming in:** Week 5+ (Multi-account tracking)

---

### 3. No Scenario Comparison
**Issue:** Can't compare "what if" scenarios side-by-side

**Example:**
- "What if I quit now vs. wait 6 months?"
- "Freelance income vs. Full-time job?"

**Workaround:**
- Use a calculator/spreadsheet for now
- Or create multiple accounts (not recommended)

**Coming in:** **Week 2** (Late Feb 2026) — P0-2 feature!

---

### 4. ~~No FIRE Date Calculator~~ ✅ IMPLEMENTED!
**Status:** ✅ **Available now** at `/fire`

**Implemented (Feb 20, 2026):**
- ✅ FI Number calculation (4% rule)
- ✅ Projected FI Date (with investment returns)
- ✅ Coast FIRE calculation
- ✅ Progress tracking with milestones
- ✅ Lean/Fat FIRE scenarios
- ✅ Interactive projection chart
- ✅ Customizable assumptions (return rate, SWR)

**Note for new users:** You need to add your monthly expenses on the main Dashboard first. The FIRE calculator requires expense data to calculate your FI Number.

**Known issue fixed:** Initial "Something went wrong" error for new users (empty state now shows helpful message)

---

### 5. No Phase-Based Planning
**Issue:** Can't break runway into different life phases

**Example use case:**
- "6 months travel ($4k/mo) → 3 months job search ($3k/mo) → new job"

**Workaround:**
- Calculate manually or use spreadsheets

**Coming in:** **Week 4** (Mid Mar 2026) — P0-4 feature!

---

### 6. No Data Export
**Issue:** Can't export data to CSV/JSON/PDF

**Workaround:**
- Take screenshots
- Manually copy data to Excel/Sheets

**Coming in:** Week 5+ (Export feature)

---

### 7. OAuth Limited to Email Signup
**Issue:** Google and GitHub OAuth configured but email signup is primary

**Status:**
- ✅ Email signup works perfectly
- ✅ Google OAuth configured (works!)
- ✅ GitHub OAuth configured (works!)
- ⚠️ UI shows all three options, fully functional

**Note:** All three methods work! Not really an issue anymore.

---

### 8. No Mobile App (Native)
**Issue:** No iOS/Android native apps

**Workaround:**
- **Website is fully mobile-responsive!**
- Works great on phones/tablets
- Add to home screen for app-like experience:
  - **iOS:** Safari → Share → "Add to Home Screen"
  - **Android:** Chrome → Menu → "Install app"

**Coming in:** Q2 2026 (React Native apps)

---

### 9. No Integrations
**Issue:** Can't import data from other apps (YNAB, Mint, Plaid, etc.)

**Workaround:**
- Enter data manually (takes 2-5 minutes)

**Coming in:** Week 5+ (API integrations)

---

### 10. No Collaboration/Sharing
**Issue:** Can't share runway with partner, advisor, or coach

**Workaround:**
- Take screenshots and share manually
- Or give them your login (not recommended)

**Coming in:** Week 5+ (Read-only sharing links)

---

## ⚙️ Browser Compatibility

### ✅ Fully Supported
- **Chrome** (Desktop & Mobile) — Recommended
- **Safari** (Desktop & Mobile)
- **Firefox** (Desktop & Mobile)
- **Edge** (Desktop)

### ⚠️ Limited Support
- **Internet Explorer** — Not supported (use Edge instead)
- **Opera** — Should work but not actively tested

### 📱 Mobile
- ✅ **iOS Safari** (iPhone/iPad)
- ✅ **Android Chrome**
- ✅ **Samsung Internet**

**Note:** For best experience, use latest browser version.

---

## 🔐 Security & Privacy

### Current Status: ✅ Production-Ready

**Implemented:**
- ✅ Row-level security (RLS) — you can only see your own data
- ✅ Encryption at rest and in transit
- ✅ Security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Password policy (12+ chars, complexity required)
- ✅ Privacy Policy published
- ✅ Error boundary (graceful error handling)
- ✅ Console logs removed (73 cleaned up)
- ✅ No XSS/CSRF vulnerabilities

**Coming soon:**
- Rate limiting (prevent abuse)
- 2FA (two-factor authentication)
- Account deletion (self-service)
- Terms of Service

---

## 📊 Performance

### Current Status: ✅ Excellent

**Lighthouse scores (as of Feb 15, 2026):**
- **Performance:** 89/100
- **Accessibility:** 98/100
- **Best Practices:** 100/100
- **SEO:** 100/100

**Bundle size:** 192 KB (reduced by 33% from original)

**Load time:** <3 seconds on 3G

---

## 🧪 Testing

### Automated Tests
- ✅ **Playwright E2E:** 10 scenarios, running daily at 3 AM KST
- ✅ **Production smoke tests:** Auth, dashboard, calculations

### Manual Testing
- ✅ **20-person AI beta test** (Feb 16) — Average 5.6/7
- ✅ **Browser compatibility** (Chrome, Safari, Firefox)
- ✅ **Mobile responsive** (iPhone, Android)

---

## 🛠️ Reporting Issues

Found a bug not listed here?

**Please report it!**

1. **Email:** beta@personalrunway.app
2. **Include:**
   - What you were trying to do
   - What happened (vs. what you expected)
   - Screenshot (if possible)
   - Browser + device (e.g., "Chrome on Mac")

**Response time:** Within 24 hours

**Priority:**
- **P0 (Critical):** Breaks core functionality → Fixed within 24h
- **P1 (High):** Major feature broken → Fixed within 3 days
- **P2 (Medium):** Annoying but not blocking → Fixed within 1 week
- **P3 (Low):** Nice-to-have → Backlog

---

## 📅 Roadmap

Want to see when features are coming?

**Check out:**
- `SPRINT_ROADMAP.md` — Week-by-week plan
- `specs/` folder — Detailed P0-P2 feature specs
- `BETA_LAUNCH_CHECKLIST.md` — Launch timeline

**Coming soon:**
- Public roadmap (Trello/Linear board)
- Feature voting (let users prioritize)

---

## 💬 Questions?

**Email:** beta@personalrunway.app  
**Response time:** Within 24 hours

**Coming soon:**
- Beta Slack/Discord community
- Live chat support
- FAQ page (check `docs/FAQ.md` for now!)

---

**Bottom line:** This is a beta. Things will improve weekly. We're committed to transparency and fast iteration.

Thanks for being part of this journey! 🚀
