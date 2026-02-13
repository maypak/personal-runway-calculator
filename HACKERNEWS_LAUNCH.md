# Hacker News Launch Strategy

**Target:** HN Front Page (Top 10)  
**Submission Type:** Show HN  
**Timing:** Tuesday or Wednesday, 8-10 AM EST  
**Avoid:** Weekends, Mondays, Fridays

---

## Show HN Guidelines (Must Follow)

From HN rules:
- Must be something you made
- Must be substantive (not just an idea)
- Must work (no broken demos)
- Must be new (first time showing on HN)

**We qualify:** ✅ All criteria met

---

## Title Format

**HN title structure:**
```
Show HN: [Product Name] – [Brief Description]
```

**Option A (Clear Value):**
```
Show HN: Personal Runway Calculator – Know how long you can survive without a job
```
(84 chars)

**Option B (Developer Angle):**
```
Show HN: Personal Runway Calculator – Track your financial runway (Next.js + Supabase)
```
(90 chars)

**Option C (Personal Story):**
```
Show HN: I quit my job with 31-month runway – built a calculator to help others do the same
```
(98 chars - too long, trim to:)
```
Show HN: Built a runway calculator after quitting my job (Next.js + Supabase)
```
(79 chars)

**Recommendation:** Option A (clearest value prop)

---

## Submission Body

**Keep it technical and humble. HN hates marketing fluff.**

```
I quit my engineering job 6 months ago. Before quitting, I calculated my financial runway: 31 months.

That number gave me the confidence to take the leap.

Built a free calculator to help others do the same:
https://personal-runway-calculator.vercel.app

Stack:
- Next.js 15 (App Router)
- TypeScript
- Supabase (auth + PostgreSQL)
- Tailwind CSS
- Deployed on Vercel

Open source: [GitHub link]

Core feature: Input savings + monthly expenses → get runway (months/years)

Also tracks daily expenses and has "what-if" scenarios.

Built in 4 weeks (nights + weekends).

Happy to answer technical questions about the stack, RLS policies, deployment, or anything else.

Would love feedback from the HN community!
```

**Length:** ~150 words (ideal for HN)  
**Tone:** Technical, humble, inviting discussion

---

## HN Comment Strategy

### First Comment (Post Immediately)

**Purpose:** Set the tone, invite technical discussion

```
Hey HN!

I built this after quitting my job without knowing how long my savings would last.

Tech stack:
• Next.js 15 (App Router, RSC)
• TypeScript
• Supabase (PostgreSQL with RLS)
• Tailwind CSS
• Vercel deployment

Interesting challenges I solved:
1. Supabase RLS policies (took 3 hours to get right)
2. Mobile-first responsive design (most users on phone)
3. Real-time runway updates without over-fetching

Open to technical questions, feedback, or roasting my architecture choices!

Repo: [link]
```

---

### Anticipated Questions & Responses

**Q: "Why not just use a spreadsheet?"**

```
Fair point! I built this because:
1. Wanted something I could check on my phone in 5 seconds
2. Wanted daily tracking without manual formulas
3. Wanted to learn Supabase RLS

For power users, Excel is absolutely better. This is for people who find spreadsheets intimidating (like my non-technical friends).
```

---

**Q: "How is this different from YNAB/Mint/etc?"**

```
Different use case:

YNAB/Mint: General budgeting (ongoing income)
This: Runway tracking (no income, how long until money runs out)

Target users:
- Planning to quit job
- Already freelancing (irregular income)
- Taking sabbatical
- Building startup

It's intentionally simple. One job: show your runway.
```

---

**Q: "Privacy concerns with Supabase?"**

```
Valid concern. Options:

1. Use free tier without signup (local storage only)
2. Self-host (it's open source)
3. Trust Supabase encryption (same security as Notion, Vercel, etc.)

I chose Supabase because:
- RLS policies for security
- Free tier is generous
- Easy to self-host if needed

Data is end-to-end encrypted, never sold.
```

---

**Q: "This is just savings / expenses. Why does this need an app?"**

```
You're right that the math is trivial.

But:
- 80% of people don't calculate it (friction)
- Of those who do, 90% don't update it (Excel is work)
- Checking it daily changes behavior (I spent less knowing my runway)

The value isn't the calculation — it's the habit of checking it.

Like a bathroom scale. The math (weight) is simple. The behavior change comes from daily visibility.
```

---

**Q: "How do you make money?"**

```
Freemium model:

Free:
- Core runway calculator
- 50 expenses/month
- Cloud sync

Pro ($20/month):
- Unlimited expenses
- Advanced analytics
- Export to CSV/PDF

Currently: Everything is free during beta.

Plan: Launch paid tier after validating PMF.

Open question: Is $20/mo the right price? Or should it be $5/mo?
```

---

**Q: "Why Supabase instead of X?"**

```
Considered:
- Firebase (too much vendor lock-in)
- Custom backend (too much time)
- LocalStorage only (users wanted sync)

Chose Supabase because:
- PostgreSQL (familiar, powerful)
- RLS policies (security built-in)
- Real-time subscriptions (nice to have)
- Easy self-hosting (if needed)
- Free tier is generous

Main gotcha: RLS testing took me 3 hours to figure out. Pro tip: Use `set role` in SQL to test policies.
```

---

**Q: "What's your tech stack rationale?"**

```
Next.js 15:
- App Router (learning opportunity)
- RSC (less client-side JS)
- Image optimization (free)

TypeScript:
- Caught 14 bugs before runtime
- Worth the setup time

Tailwind:
- Fast iteration
- No CSS files to manage
- Mobile-first utilities

Vercel:
- Zero-config deployment
- Git push → live in 30 sec
- Edge network (fast globally)

Total monthly cost: $0 (Vercel free tier + Supabase free tier)
```

---

**Q: "Show me the code for [X]"**

```
Sure! Here's the runway calculation hook:

[paste code snippet from repo]

Full code: [GitHub link]

Open to feedback on the implementation!
```

---

**Q: "This already exists: [competitor]"**

```
You're right that [competitor] does [similar thing].

I built this because:
1. Wanted to learn Supabase
2. [Competitor] is $X/month, this is free
3. [Competitor] does 10 things, this does 1 thing well
4. Scratching my own itch (I needed this when quitting)

Not trying to compete with [competitor] — different target user (people who find [competitor] too complex).
```

---

**Q: "What's your launch plan?"**

```
Week 1: Beta testing (50 users)
Week 2: Product Hunt launch
Week 3: Dev.to write-up (technical)
Week 4: Reddit (r/financialindependence)

Goal: 100 active users in first month

Learning as I go. First time launching on HN, so feedback appreciated!
```

---

**Q: "How long did this take to build?"**

```
Timeline:
- Week 1: MVP (15 hours) - just calculator + LocalStorage
- Week 2: Supabase integration (20 hours) - auth + sync
- Week 3: Polish (18 hours) - UI, what-if scenarios
- Week 4: Launch prep (10 hours) - docs, SEO, deploy

Total: ~60 hours over 4 weeks (nights + weekends)

Biggest time sink: Supabase RLS policies (3 hours of debugging)
Fastest part: Vercel deployment (30 seconds!)
```

---

## Engagement Strategy

### First 2 Hours (Critical)

**HN algorithm loves early engagement.**

- [ ] Reply to EVERY comment within 15 minutes
- [ ] Be technical (HN respects code, not marketing)
- [ ] Be humble (admit limitations)
- [ ] Be helpful (answer questions thoroughly)

**Don't:**
- ❌ Ask for upvotes
- ❌ Be defensive
- ❌ Argue with critics
- ❌ Use marketing language

**Do:**
- ✅ Share code snippets
- ✅ Discuss technical tradeoffs
- ✅ Acknowledge alternatives
- ✅ Learn from criticism

---

### Hours 2-6

- [ ] Continue fast replies
- [ ] Share on Twitter (with HN link)
- [ ] Monitor ranking (aim for front page)
- [ ] Engage with new comment threads

---

### Hours 6-24

- [ ] Keep replying (even if slower)
- [ ] Thank people for thoughtful feedback
- [ ] Fix bugs mentioned in comments
- [ ] Update repo based on suggestions

---

## What Makes HN Front Page

**Factors:**
1. **Early engagement** (first 2 hours)
2. **Quality discussions** (technical depth)
3. **Timing** (weekday mornings EST)
4. **Novelty** (new, not seen before)
5. **Execution** (working product, not just idea)

**We have:**
- ✅ Working product
- ✅ Open source (HN loves this)
- ✅ Technical depth (Next.js, Supabase)
- ✅ Personal story (relatable)
- ✅ Free (no paywall)

**Challenges:**
- Simple concept (might be seen as trivial)
- Crowded space (budgeting apps exist)
- First-time launcher (no HN karma)

---

## HN-Specific Optimizations

### 1. Make It Easy to Try

- No signup required for basic features
- Fast load time (<2 sec)
- Works on mobile (HN users browse on phone)
- No pop-ups or modals

---

### 2. Open Source Advantage

HN loves open source. Lead with this:
- Link to repo in title or first comment
- Welcome code reviews
- Accept PRs
- Show architecture decisions

---

### 3. Technical Depth

Prepare to discuss:
- Why Next.js App Router vs Pages
- Supabase RLS implementation
- TypeScript patterns
- Performance optimizations
- Security considerations

---

### 4. Acknowledge Limitations

**Don't hide flaws. HN will find them anyway.**

Pre-emptive honesty:
- "I know the calculation is simple (savings / expenses)"
- "Yes, Excel can do this. This is for people who won't use Excel"
- "I didn't write tests yet (regret this)"
- "UI could be better (working on it)"

---

## Response Templates (HN Style)

### For Positive Feedback
```
Thank you! [specific thing they mentioned] was actually the hardest part to get right.

If you have thoughts on [related topic], I'd love to hear them.
```

### For Criticism
```
Fair point. I built this for [specific use case], but I can see how it doesn't fit [their use case].

How would you approach [their concern]?
```

### For Feature Requests
```
Interesting idea! Added to the roadmap.

Quick question: Would this be a must-have or nice-to-have for you?
```

### For "Just use X" Comments
```
You're absolutely right that X can do this (and more).

I built this because [specific reason]. Different tools for different folks.

Are you happy with X? What would make you switch?
```

---

## Metrics to Track

**Success benchmarks:**

**Decent launch:**
- 20+ points
- 10+ comments
- Front page for 1+ hours
- 50+ site visits

**Good launch:**
- 100+ points
- 30+ comments
- Front page for 6+ hours
- 300+ site visits

**Great launch:**
- 300+ points
- 100+ comments
- #1-5 on front page
- 1,000+ site visits

---

## Post-Launch

### If It Goes Well
- [ ] Write "Show HN retrospective" (next week)
- [ ] Thank commenters (Twitter thread)
- [ ] Implement top-requested features
- [ ] Share learnings on dev.to

### If It Doesn't Go Well
- [ ] Don't delete (HN frowns on this)
- [ ] Learn from comments
- [ ] Try again in 6 months (different angle)
- [ ] Focus on other channels (Reddit, PH)

---

## HN Posting Checklist

**Before submitting:**
- [ ] Product works flawlessly (no bugs)
- [ ] Mobile responsive (HN mobile users)
- [ ] Fast load time (<3 sec)
- [ ] GitHub repo public
- [ ] README is clear
- [ ] No signup required to try
- [ ] Tuesday or Wednesday morning
- [ ] Coffee ready (you'll be replying for hours)

**After submitting:**
- [ ] Post first comment immediately
- [ ] Share on Twitter
- [ ] Set timer (check every 30 min)
- [ ] Reply to comments ASAP
- [ ] Be humble and technical

---

## Emergency Playbook

**If you get criticized harshly:**
- Don't argue
- Acknowledge valid points
- Ask for specific feedback
- Thank them for honesty

**If you get called out for self-promotion:**
- Apologize if tone was off
- Emphasize technical discussion
- Share code, not marketing

**If someone finds a security issue:**
- Thank them publicly
- Fix immediately
- Post update when fixed
- Give credit

---

## Sample HN Thread (What Success Looks Like)

```
You: [Submission with title + description]

Commenter 1: "How is this different from YNAB?"
You: [Thoughtful technical comparison]

Commenter 2: "Cool! But your RLS policy looks wrong here: [code]"
You: "You're right! Fixing now. Here's what I learned: [explanation]"

Commenter 3: "I needed this exact thing last year!"
You: "Glad it resonates! What would make it more useful for you?"

Commenter 4: "The code is pretty clean. Have you considered [optimization]?"
You: "Great idea! I hadn't thought of that. Opening an issue now."
```

**Notice:**
- Technical discussions
- Humility
- Fast replies
- Code-focused

---

## Next Steps

1. **This week:** Finalize product (no bugs)
2. **Next week:** Submit to HN (Tue or Wed, 9 AM EST)
3. **Launch day:** Clear calendar (reply to comments all day)
4. **Post-launch:** Implement feedback

**Time commitment:** 4-6 hours on launch day (active engagement)

---

## Final Thoughts

HN is tough. High standards, critical audience, fierce competition.

But also:
- Best technical feedback you'll get
- Direct access to potential users (engineers, founders)
- If it goes well, massive traffic spike

**Keys to success:**
1. Be technical
2. Be humble
3. Be fast (replies)
4. Be useful (working product)

Good luck! 🚀
