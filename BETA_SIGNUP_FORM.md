# Personal Runway Calculator - Beta Signup Form

**Google Forms Template**  
Create at: [https://forms.google.com](https://forms.google.com)

---

## Form Title
**Personal Runway Calculator - Early Access**

## Description
```
Calculate your personal runway in seconds. Track savings, expenses, and know exactly how long you can survive without a job.

We're looking for 50 beta users to help test and improve the app before public launch.

🎁 Early Access Perks:
• Lifetime Pro features (normally $20/month)
• Priority support
• Vote on new features
• Early adopter badge

Time to complete: 2 minutes
```

---

## Questions

### Q1: Basic Info
**Email Address** *  
Type: Short answer  
Required: Yes  
Validation: Email format

**Name**  
Type: Short answer  
Required: Yes

---

### Q2: Current Situation
**Are you currently planning to quit your job or go freelance?** *  
Type: Multiple choice  
Required: Yes

Options:
- ○ Yes, planning to quit within 6 months
- ○ Yes, planning to quit within 1 year
- ○ Already quit / freelancing
- ○ Considering it, no timeline yet
- ○ Not planning, but interested in financial tracking
- ○ Other: ___

---

### Q3: Current Runway Awareness
**Do you know your current financial runway (how long you can survive without income)?** *  
Type: Multiple choice  
Required: Yes

Options:
- ○ Yes, I've calculated it precisely
- ○ Yes, rough estimate only
- ○ No, but I want to know
- ○ No, never thought about it

**If yes, how many months?**  
Type: Short answer  
Required: No

---

### Q4: Pain Points
**What's your biggest challenge with managing personal finances?** *  
Type: Checkboxes (select all that apply)  
Required: Yes

Options:
- ☐ Don't know how long my savings will last
- ☐ Can't track daily expenses consistently
- ☐ Don't have a clear monthly budget
- ☐ Afraid to take the leap (quit job) due to financial uncertainty
- ☐ Losing track of multiple income sources
- ☐ No good tools for runway calculation
- ☐ Other: ___

---

### Q5: Features Interest
**Which features interest you most?** *  
Type: Checkboxes (select all that apply)  
Required: Yes

Options:
- ☐ Runway calculator (months/years left)
- ☐ Daily expense tracking
- ☐ Monthly budget monitoring
- ☐ Income tracking (freelance gigs)
- ☐ "What-if" scenarios (cut expenses, add income)
- ☐ Cloud sync across devices
- ☐ Export reports (PDF/CSV)
- ☐ Other: ___

---

### Q6: Usage Commitment
**If selected for early access, can you commit to:**  
Type: Checkboxes (select all that apply)  
Required: Yes

Options:
- ☐ Use the app at least 3x per week for 2 weeks
- ☐ Report bugs or issues you find
- ☐ Fill out a quick feedback survey (5 min)
- ☐ Optional: 15-min interview for deeper feedback

---

### Q7: Referral Source
**How did you hear about Personal Runway Calculator?**  
Type: Multiple choice  
Required: No

Options:
- ○ Product Hunt
- ○ Reddit
- ○ Twitter/X
- ○ Friend referral
- ○ Google search
- ○ Dev.to
- ○ Hacker News
- ○ Other: ___

---

### Q8: Additional Comments
**Anything else you'd like to share? (optional)**  
Type: Paragraph  
Required: No

Placeholder text:
```
Example:
- Specific use case you have in mind
- Features you wish existed
- Questions about the app
```

---

## Confirmation Message (After Submit)

```
🎉 Thank you for signing up!

Your application has been received.

What happens next?
1. We'll review applications within 3-5 days
2. Selected users will receive an email with access instructions
3. You'll get early access + lifetime Pro features!

Selection criteria:
• Diversity of use cases
• Active commitment to testing
• Clear interest in personal finance

Questions? Email: [your-email@example.com]

Follow us:
🐦 Twitter: [@personalrunway]
🌐 Website: [https://personal-runway-calculator.vercel.app]

Thank you! 🚀
```

---

## Google Sheets Auto-Response Setup

### Auto-Email (using Google Apps Script)

```javascript
function onFormSubmit(e) {
  var email = e.values[1]; // Email address column
  var name = e.values[2]; // Name column
  
  var subject = "✅ Early Access Application Received - Personal Runway Calculator";
  
  var body = `
Hi ${name},

Thank you for applying for early access to Personal Runway Calculator!

Your application has been received and is under review.

🎁 What you'll get if selected:
• Lifetime Pro features (worth $20/month)
• Priority support from the founder
• Vote on new features
• Early adopter badge

📅 Timeline:
• Review: 3-5 days
• Access: Immediate upon selection
• Beta period: 2 weeks

We're selecting 50 users who represent diverse use cases and can provide valuable feedback.

Questions? Just reply to this email!

Best,
[Your Name]
Founder, Personal Runway Calculator

🌐 https://personal-runway-calculator.vercel.app
🐦 @personalrunway
  `;
  
  MailApp.sendEmail(email, subject, body);
}
```

---

## Selection Criteria (Internal)

### Scoring System (Total: 100 points)

**Use Case Clarity (30 points)**
- Planning to quit within 6 months: 30
- Planning to quit within 1 year: 25
- Already quit/freelancing: 20
- Considering: 15
- Just interested: 10

**Pain Point Relevance (25 points)**
- 4+ pain points selected: 25
- 3 pain points: 20
- 2 pain points: 15
- 1 pain point: 10

**Feature Interest (20 points)**
- 5+ features: 20
- 3-4 features: 15
- 1-2 features: 10

**Commitment Level (25 points)**
- All 4 commitments: 25
- 3 commitments: 20
- 2 commitments: 15
- 1 commitment: 10

---

### Selection Process

1. **Auto-filter**: Remove duplicates, spam, invalid emails
2. **Scoring**: Calculate total score for each applicant
3. **Manual review**: Read top 100 applications
4. **Diversity check**: Ensure mix of use cases (quit planning, freelancers, FI seekers)
5. **Final selection**: 50 users
6. **Waitlist**: Next 50 for future beta rounds

---

### Diversity Targets (50 users)

- Planning to quit (6 months): 15 users (30%)
- Planning to quit (1 year): 10 users (20%)
- Already freelancing: 10 users (20%)
- FIRE enthusiasts: 10 users (20%)
- Other: 5 users (10%)

---

## Follow-Up Email (Selected Users)

```
Subject: 🎉 You're in! Early Access to Personal Runway Calculator

Hi [Name],

Congratulations! You've been selected for early access to Personal Runway Calculator.

Out of [X] applications, you're one of 50 users we chose based on your clear use case and commitment to testing.

🚀 Get Started (5 minutes):

1. Visit: https://personal-runway-calculator.vercel.app
2. Sign up with this email: [their-email]
3. Your Pro features are already unlocked!

📋 Beta Tester Checklist:

Week 1:
- [ ] Complete initial setup (savings, expenses)
- [ ] Track expenses for 3-5 days
- [ ] Try "What-if" scenarios

Week 2:
- [ ] Fill out feedback survey (we'll send link)
- [ ] Optional: 15-min interview

🎁 Your Lifetime Pro Benefits:

✓ Unlimited expense tracking
✓ Advanced analytics
✓ Export reports
✓ Priority support
✓ Early access to new features

💬 Questions or bugs?

Join our beta testers Discord: [invite-link]
Or email me directly: [your-email]

Thank you for being an early believer!

Best,
[Your Name]
Founder, Personal Runway Calculator

P.S. Know someone else who'd love this? Share the beta signup: [form-link]
```

---

## Rejection Email (Not Selected This Round)

```
Subject: Personal Runway Calculator Early Access Update

Hi [Name],

Thank you for applying for early access to Personal Runway Calculator.

We received an overwhelming response ([X] applications!) and unfortunately couldn't accept everyone in this round.

✨ Good news:

You're on our waitlist and will get priority access when we:
• Open the second beta round (2-3 weeks)
• Launch publicly with a special early supporter discount

Want to try it anyway?

The app is live at https://personal-runway-calculator.vercel.app

Free tier includes:
• Basic runway calculation
• 50 expenses per month
• Cloud sync

We'd still love your feedback even if you're not in the official beta group!

Thank you for your interest 🙏

Best,
[Your Name]
Founder, Personal Runway Calculator

P.S. Follow @personalrunway on Twitter for launch updates!
```

---

## Analytics to Track

- Total applications
- Conversion rate (form visits → submissions)
- Score distribution
- Most common pain points
- Most desired features
- Referral source breakdown
- Geographic distribution (if collected)

---

**Form Creation Time: ~20 minutes**  
**Setup Auto-Responses: ~10 minutes**  
**Total: ~30 minutes** ✅

---

**Next Steps:**
1. Create Google Form with these questions
2. Set up auto-response email
3. Share form link via:
   - Reddit posts
   - Product Hunt coming soon page
   - Twitter/X
   - Personal network
