# 🛟 Support & Community Guidelines

**Personal Runway Calculator**  
**We're here to help you succeed.** 💪

---

## 📑 Table of Contents

1. [How to Get Help](#-how-to-get-help)
2. [Reporting Bugs](#-reporting-bugs)
3. [Feature Requests](#-feature-requests)
4. [Community Guidelines](#-community-guidelines)
5. [Support Channels](#-support-channels)
6. [Response Times](#-response-times)
7. [Beta Tester Program](#-beta-tester-program)

---

## 💬 How to Get Help

### Quick Answers

**Before reaching out, try:**

1. **Check the FAQ** - [FAQ.md](./FAQ.md)
   - 30+ common questions answered
   
2. **Read the Onboarding Guide** - [ONBOARDING_GUIDE.md](./ONBOARDING_GUIDE.md)
   - Step-by-step tutorials

3. **Search Discord** - [Join here](#)
   - Someone might have asked already

4. **Watch Video Tutorials** - [YouTube channel](#)
   - Visual walkthroughs

---

### Still Stuck? Contact Us

**Choose your channel:**

| Issue Type | Best Channel | Response Time |
|------------|--------------|---------------|
| 🐛 Bug report | Email or GitHub | 4-24 hours |
| 💡 Feature request | Discord or Email | 1-3 days |
| ❓ How-to question | Discord or Email | 1-4 hours |
| 🚨 Urgent (can't access account) | Email | 1-4 hours |
| 💬 General chat | Discord | Instant (community) |

---

## 🐛 Reporting Bugs

**Found a bug? Thank you!** Reporting bugs helps everyone.

### What Counts as a Bug?

**✅ These are bugs:**
- Calculator shows wrong math
- Scenarios won't save
- App crashes or freezes
- Buttons don't work
- PDF export is blank
- Language switch fails

**❌ These are NOT bugs:**
- "I don't like the design" (feature request)
- "I want multi-currency" (feature request)
- "How do I use scenarios?" (support question)

---

### How to Report a Bug

**Use this template:**

```markdown
**Bug Title:** [Short, descriptive title]

**What happened:**
[Describe what went wrong]

**What I expected:**
[What should have happened]

**Steps to reproduce:**
1. Go to...
2. Click...
3. See error

**Screenshots:**
[Attach if possible]

**Environment:**
- Browser: [Chrome 120, Firefox 115, Safari 17, etc.]
- OS: [Windows 11, macOS 14, iOS 17, Android 13, etc.]
- Account: [Logged in / Guest mode]

**Additional context:**
[Anything else that might help]
```

---

### Example Bug Report

```markdown
**Bug Title:** PDF export shows blank page

**What happened:**
When I click "Export PDF," a blank page opens. No data visible.

**What I expected:**
A PDF with my runway calculation and scenarios.

**Steps to reproduce:**
1. Go to Dashboard
2. Click "Export PDF"
3. New tab opens
4. Page is blank (white screen)

**Screenshots:**
[Attached: blank-pdf-screenshot.png]

**Environment:**
- Browser: Safari 17.2
- OS: macOS 14.2 (Sonoma)
- Account: Logged in (free tier)

**Additional context:**
- Works fine in Chrome
- Safari console shows error: "Failed to load resource"
```

---

### Where to Report Bugs

**Option 1: GitHub Issues** (Recommended for developers)
- URL: [github.com/personalrunway/issues](#)
- Public (helps others see if bug is known)
- Can track progress

**Option 2: Email**
- Email: bugs@personalrunway.app
- Private
- Faster for urgent issues

**Option 3: Discord**
- Channel: #bug-reports
- Community can help troubleshoot
- Good for "is this a bug or am I doing it wrong?"

---

### What Happens After Reporting?

**1. Acknowledgment (within 4 hours)**
- We confirm we received your report
- Assign a tracking number

**2. Triage (within 24 hours)**
- We assess severity:
  - 🔴 Critical (app broken for everyone)
  - 🟠 High (major feature broken)
  - 🟡 Medium (minor feature broken)
  - 🟢 Low (cosmetic issue)

**3. Fix Timeline**
- Critical: 1-24 hours
- High: 1-3 days
- Medium: 1-2 weeks
- Low: Next sprint (2-4 weeks)

**4. Update**
- We'll notify you when fixed
- Release notes mention your contribution!

**5. Credit**
- Beta testers who report bugs get:
  - Shoutout in changelog
  - Beta tester badge 🏅
  - Our eternal gratitude 🙏

---

### Bug Bounty Program (Coming Soon)

**Find a security vulnerability?**

We'll reward you!

**Scope:**
- XSS (cross-site scripting)
- SQL injection
- Authentication bypass
- Data leaks

**Rewards:**
- Critical: $500-1,000
- High: $200-500
- Medium: $50-200

**How to report:**
- Email: security@personalrunway.app
- **Do NOT** post publicly (responsible disclosure)

**Not live yet!** Coming Q2 2026.

---

## 💡 Feature Requests

**Want something new? Tell us!**

### What Makes a Good Feature Request?

**✅ Good feature requests:**
- Solve a specific problem
- Include use case / user story
- Explain why existing features don't work
- Suggest implementation (optional)

**❌ Bad feature requests:**
- "Make it better" (too vague)
- "Add everything Mint has" (out of scope)
- "I want X because I want X" (no reasoning)

---

### How to Submit a Feature Request

**Use this template:**

```markdown
**Feature:** [Short, descriptive title]

**Problem:**
[What problem are you trying to solve?]

**Current workaround:**
[How do you solve this now? Why is it painful?]

**Proposed solution:**
[What feature would solve this?]

**Use case:**
[Describe a scenario where you'd use this]

**Who benefits:**
[Who else would find this useful?]

**Priority:**
[ ] Must-have (can't use product without it)
[ ] Should-have (would improve experience)
[ ] Nice-to-have (would be cool)

**Alternatives considered:**
[Any other ways to solve this?]
```

---

### Example Feature Request

```markdown
**Feature:** Shared Scenarios (Partner Planning)

**Problem:**
My spouse and I are planning a career transition together. We each create scenarios, but can't see each other's work. We end up emailing PDFs back and forth. Painful!

**Current workaround:**
1. I create scenarios
2. Export PDF
3. Email to spouse
4. Spouse reads PDF, creates own scenarios
5. Repeat
→ Takes 2 hours, no real-time collaboration

**Proposed solution:**
- "Share" button on scenarios
- Generate unique link
- Partner opens link → sees live scenario
- Optional: Real-time co-editing (Google Docs style)

**Use case:**
Sarah and Tom are both quitting jobs to travel. Sarah models "6 months Asia" scenario. Tom opens link, duplicates it, changes to "9 months Asia + Europe." They compare and decide together.

**Who benefits:**
- Couples planning together (sabbaticals, FIRE)
- Founders + co-founders (startup runway)
- Parent + adult child (helping them plan)
- Financial advisors + clients

**Priority:**
[X] Should-have (would improve experience significantly)

**Alternatives considered:**
- Screen sharing (clunky)
- Shared account (privacy concerns)
- Exporting JSON and importing (too technical)
```

---

### Where to Submit Feature Requests

**Option 1: Discord** (Recommended for discussion)
- Channel: #feature-requests
- Community can vote (👍 reactions)
- We track top-voted requests

**Option 2: Email**
- Email: features@personalrunway.app
- Private (if you want to keep idea confidential)

**Option 3: Feedback Board** (Coming soon)
- Public voting system
- Roadmap transparency
- URL: [feedback.personalrunway.app](#)

---

### What Happens After Submission?

**1. Review (within 3 days)**
- We read your request
- Ask clarifying questions if needed

**2. Triage**
- Assess fit with product vision
- Estimate development effort
- Gauge demand (votes, similar requests)

**3. Roadmap Placement**
- 🟢 **Accepted:** Added to roadmap
- 🟡 **Considering:** Under review
- 🔴 **Declined:** Doesn't fit (we'll explain why)

**4. Updates**
- We'll notify you of status changes
- If accepted: ETA for development
- If declined: Reasoning + alternatives

**5. Shipping**
- When feature ships, you get:
  - Early access (7 days before public)
  - Shoutout in release notes
  - Beta tester badge 🏅

---

### Feature Request Voting

**How it works:**
- Browse requests in Discord #feature-requests
- React with 👍 for features you want
- Top-voted requests get prioritized

**Current top requests** (as of beta):
1. **Shared Scenarios** (45 votes) - In development!
2. **Multi-currency** (38 votes) - Q2 2026
3. **Tax calculator** (32 votes) - Q3 2026
4. **Investment tracking** (28 votes) - Considering
5. **Mobile app** (25 votes) - Q3 2026

**Your vote matters!** We use votes to prioritize.

---

## 🤝 Community Guidelines

**Our community is kind, helpful, and inclusive.**

### The Golden Rule

**Treat others how you want to be treated.**

Simple as that.

---

### ✅ Do's

**1. Be Helpful**
- Answer questions if you know the answer
- Share your experiences (what worked, what didn't)
- Celebrate others' wins

**2. Be Respectful**
- Disagree without being disagreeable
- No personal attacks, ever
- Assume good intentions

**3. Be Constructive**
- Criticize ideas, not people
- Offer solutions, not just complaints
- "I think X could be better because Y" > "X sucks"

**4. Be Inclusive**
- Welcome newcomers
- No gatekeeping ("You're not a REAL FIRE seeker if...")
- All career transitions are valid

**5. Search Before Asking**
- Check FAQ first
- Search Discord history
- Someone might have asked already

**6. Share Your Success**
- Posted your runway? Share it!
- Quit your job? Celebrate!
- Hit a milestone? Tell us!

---

### ❌ Don'ts

**1. No Spam**
- Don't promote your product/service
- No affiliate links (unless explicitly allowed by mods)
- No self-promotion disguised as advice

**2. No Financial Advice**
- You can share what YOU did
- You can't tell others what to do
- "I chose X" ✅ / "You should choose X" ❌

**3. No Harassment**
- No bullying, trolling, doxxing
- No sexism, racism, homophobia, etc.
- Zero tolerance policy

**4. No Off-Topic**
- Keep discussions relevant
- Politics, religion → other places
- #random exists for casual chat

**5. No Illegal Activity**
- Tax evasion ≠ tax optimization
- We're not here to help you break the law

---

### Enforcement

**If you break guidelines:**

**1st offense:** Warning (DM from mod)  
**2nd offense:** Temporary mute (24 hours)  
**3rd offense:** Kick from community  
**Severe offense:** Instant ban (harassment, spam, illegal)

**Appeal:** Email: community@personalrunway.app

**We're humans too.** Mistakes happen. Apologize, move on.

---

### Reporting Violations

**See someone breaking rules?**

**Option 1: Flag it**
- Discord: Right-click → Report
- We review all reports

**Option 2: DM a mod**
- Discord: @Moderator
- Faster for urgent issues

**Option 3: Email**
- community@personalrunway.app
- For serious violations (harassment, threats)

**We investigate all reports.**  
False reports = you get warned.

---

## 📞 Support Channels

### 1. **Email** 📧

**Best for:**
- Bug reports
- Feature requests
- Account issues
- Private matters

**Addresses:**
- General: hello@personalrunway.app
- Bugs: bugs@personalrunway.app
- Features: features@personalrunway.app
- Security: security@personalrunway.app
- Community: community@personalrunway.app

**Response time:**
- Free tier: <24 hours
- Pro tier: <4 hours
- Premium tier: <1 hour (business hours)

---

### 2. **Discord** 💬

**Best for:**
- Quick questions
- Community discussion
- Feature voting
- Hanging out with other planners

**Channels:**
- #introductions - Say hi!
- #general - Casual chat
- #help - Ask questions
- #feature-requests - Suggest features
- #bug-reports - Report bugs
- #wins - Celebrate milestones
- #fire - FIRE-specific discussion
- #sabbaticals - Sabbatical planning
- #startups - Founder-specific
- #korean - 한국어 채널

**Join:** [discord.gg/personalrunway](#)

**Rules:** See [Community Guidelines](#-community-guidelines)

---

### 3. **Twitter/X** 🐦

**Best for:**
- Updates & announcements
- Quick tips
- Community highlights

**Follow:** [@personal_runway](https://twitter.com/personal_runway)

**Korean:** [@personal_runway_kr](https://twitter.com/personal_runway_kr)

**Use hashtag:** #PersonalRunway

---

### 4. **Reddit** 📱

**Best for:**
- Long-form discussions
- Detailed use cases
- AMAs (Ask Me Anything)

**Subreddit:** r/PersonalRunway

**Cross-posted to:**
- r/financialindependence (FIRE)
- r/careeradvice (transitions)
- r/digitalnomad (sabbaticals)
- r/startups (founders)

---

### 5. **GitHub** 💻

**Best for:**
- Bug tracking
- Technical discussions
- Open-source contributions (if/when we open-source)

**URL:** [github.com/personalrunway/calculator](#)

**Issues:** Bug reports + feature requests  
**Discussions:** Technical Q&A

---

### 6. **Blog** 📰

**Best for:**
- Deep dives
- Case studies
- Feature announcements

**URL:** [blog.personalrunway.app](#)

**Topics:**
- How we built X feature
- User success stories
- FIRE strategies
- Career transition guides

**Subscribe:** RSS or email newsletter

---

## ⏱️ Response Times

### Email Support

| Tier | Response Time | Support Hours |
|------|---------------|---------------|
| **Free** | <24 hours | Mon-Fri, 9am-5pm PST |
| **Pro** | <4 hours | Mon-Fri, 9am-9pm PST |
| **Premium** | <1 hour | Mon-Sun, 8am-10pm PST |

**Note:** "Response time" = first reply, not resolution time.

---

### Discord (Community)

**Instant!** Community members typically reply within minutes.

**Moderators:** Online 12+ hours/day

---

### Bug Fixes

| Severity | Initial Response | Fix Timeline |
|----------|------------------|--------------|
| 🔴 Critical | 1 hour | 1-24 hours |
| 🟠 High | 4 hours | 1-3 days |
| 🟡 Medium | 24 hours | 1-2 weeks |
| 🟢 Low | 48 hours | Next sprint |

---

### Feature Requests

**Review:** 1-3 days  
**Roadmap decision:** 1-2 weeks  
**Implementation:** Varies (2 weeks to 6 months)

---

## 🧪 Beta Tester Program

**Want to help shape the product?**

### What is it?

**Beta Testers** get early access to new features and give feedback.

**Benefits:**
- 🎁 Try features 7-14 days early
- 🎁 Direct influence on product direction
- 🎁 Beta tester badge 🏅
- 🎁 Exclusive Discord role
- 🎁 Shoutouts in release notes
- 🎁 Premium tier FREE (while in beta program)

**Responsibilities:**
- Test new features thoroughly
- Report bugs (if any)
- Give honest feedback
- Participate in Discord discussions

---

### How to Join

**Step 1: Apply**
- Email: beta@personalrunway.app
- Subject: "Beta Tester Application"
- Include:
  - Why you want to join
  - Your use case (FIRE, sabbatical, startup, etc.)
  - How much time you can commit (2-5 hours/month)

**Step 2: Onboarding**
- We'll send you beta access
- Invite to #beta-testers Discord channel
- Assign beta tester role

**Step 3: Test & Feedback**
- We'll notify you of new features
- Test them
- Fill out feedback form (5-10 min)

**Step 4: Repeat!**
- New features every 2-4 weeks
- Stay engaged → Stay in program

---

### Current Beta Testers

**20 AI beta testers** completed Phase 1 (Feb 2026).

**50 human beta testers** starting Phase 2 (Mar 2026).

**1,000 public beta users** starting Phase 3 (Mar 24, 2026).

**Want to join Phase 2?** Apply now (50 spots filling fast!)

---

## 🎓 Resources

### Documentation
- 📖 [FAQ](./FAQ.md) - 30+ questions answered
- 📚 [Onboarding Guide](./ONBOARDING_GUIDE.md) - Get started in 5 min
- 🌟 [Feature Showcase](./FEATURE_SHOWCASE.md) - Deep dives
- 📊 [Beta Testing Report](./BETA_TESTING_FINAL_REPORT.md) - What we learned

### Video Tutorials
- 🎥 [5-Minute Quickstart](#)
- 🎥 [Scenario Comparison Tutorial](#)
- 🎥 [Phase Planning Walkthrough](#)
- 🎥 [FIRE Calculator Explained](#)

### Community
- 💬 [Discord Server](#) - Join the conversation
- 🐦 [Twitter](https://twitter.com/personal_runway) - Updates
- 📱 [Reddit](https://reddit.com/r/PersonalRunway) - Discussions
- 📰 [Blog](#) - Deep dives

---

## 🙏 Thank You

**To our beta testers:**  
You helped us build something special. Your feedback shaped every feature.

**To our community:**  
You're not just users. You're co-creators. Thank you for being here.

**To our supporters:**  
Your encouragement keeps us going. We're building this for you.

---

## 📞 Contact Us

**General:**  
hello@personalrunway.app

**Support:**  
support@personalrunway.app

**Bugs:**  
bugs@personalrunway.app

**Features:**  
features@personalrunway.app

**Security:**  
security@personalrunway.app

**Press:**  
press@personalrunway.app

**Partnerships:**  
partnerships@personalrunway.app

---

**Office Hours:**  
Monday-Friday, 9am-5pm PST

**Location:**  
San Francisco, CA (Remote team)

---

**Let's build the future of career planning together.** 🚀

**Made with ❤️ by people who've been there.**

---

**Last Updated:** March 2026  
**Version:** Public Beta 1.0
