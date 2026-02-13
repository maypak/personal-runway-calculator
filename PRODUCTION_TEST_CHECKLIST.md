# Production URL Test Checklist

**Target:** https://personal-runway-calculator.vercel.app  
**Date:** 2026-02-13  
**Status:** In Progress

---

## 🎯 Critical Path Tests (Must Pass)

### 1. Authentication Flow
- [ ] Sign Up with Email
  - [ ] Enter email + password
  - [ ] Email verification sent
  - [ ] Click verification link
  - [ ] Redirect to dashboard
  
- [ ] Sign In
  - [ ] Existing user login
  - [ ] Remember me works
  - [ ] Error handling (wrong password)

- [ ] Sign Out
  - [ ] Logout successful
  - [ ] Session cleared
  - [ ] Redirect to auth page

### 2. Dashboard Core Functions
- [ ] Initial Setup
  - [ ] Settings form displays
  - [ ] Input monthly expenses
  - [ ] Input savings
  - [ ] Input monthly income (optional)
  - [ ] Save settings successful

- [ ] Runway Calculation
  - [ ] Displays correct number
  - [ ] Shows months/years
  - [ ] Updates in real-time
  - [ ] Color coding works (green/yellow/red)

- [ ] Expenses Management
  - [ ] Add expense
  - [ ] Edit expense
  - [ ] Delete expense
  - [ ] Recurring expenses work

### 3. Data Persistence
- [ ] Refresh page → data persists
- [ ] Logout → Login → data loads
- [ ] Multiple tabs sync

---

## 📱 Mobile Tests (iOS/Android)

### iOS Safari
- [ ] Auth flow works
- [ ] Dashboard renders correctly
- [ ] Buttons clickable
- [ ] Forms usable
- [ ] No layout overflow

### Android Chrome
- [ ] Auth flow works
- [ ] Dashboard renders correctly
- [ ] Touch targets adequate
- [ ] No performance issues

---

## 🐛 Known Issues to Check

1. **Text Overflow**
   - [ ] Long email addresses
   - [ ] Large expense names
   - [ ] Currency formatting

2. **Edge Cases**
   - [ ] Zero savings
   - [ ] Negative numbers
   - [ ] Very large numbers (₩1억+)
   - [ ] No expenses added

3. **Performance**
   - [ ] Initial load time <3s
   - [ ] Dashboard render <1s
   - [ ] No console errors

---

## ✅ Success Criteria

**Green Light (Launch Ready):**
- All Critical Path Tests pass
- Mobile renders correctly
- No blocking bugs

**Yellow (Needs Fix):**
- Minor UI issues
- Non-critical bugs
- Performance acceptable

**Red (Block Launch):**
- Auth broken
- Data loss
- Critical bugs

---

## 📊 Test Results

**Tested by:** 어메이징메이  
**Date:** 2026-02-13  
**Browser:** Chrome, Safari, Mobile  
**Status:** [ ] Pass [ ] Fail [ ] Partial

**Notes:**
