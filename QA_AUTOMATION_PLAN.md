# QA Automation Plan

**Decision:** A+B Hybrid (Daily auto + Pre-deploy manual)  
**Budget:** Token cost less critical  
**Created:** 2026-02-14 22:37

---

## 🎯 Goals

1. **Prevent production issues** (like today's OAuth & settings bugs)
2. **Catch regressions early** (before users notice)
3. **Maintain confidence** during rapid development

---

## 📋 QA Subagent Design

### Daily Automated QA (Option A)

**Schedule:** Every day at 3:00 AM KST (low traffic time)

**Test Suite:**
1. **Smoke Test** (~5 min)
   - Production URL responds (200 OK)
   - Auth page loads correctly
   - Dashboard page loads (after login)
   - No console errors

2. **Critical Flows** (~15 min)
   - Email signup flow
   - Email login flow
   - OAuth login (Google + GitHub) - if enabled
   - Financial settings save & persist
   - Expense add & delete
   - Runway calculation accuracy

3. **Browser Compatibility** (~10 min)
   - Chrome (latest)
   - Safari (latest)
   - Firefox (latest)
   - Mobile Safari (iOS)
   - Mobile Chrome (Android)

4. **Build Status** (~2 min)
   - Check Vercel deployment status
   - Check for failed builds
   - Check for warnings

**Output:**
- Success: Silent (no notification)
- Failure: Telegram alert with details
- Report: Save to `/qa-reports/YYYY-MM-DD.md`

**Estimated Token Cost:**
- ~30K tokens/day (including browser automation)
- ~900K tokens/month
- **Acceptable** per 메이님's guidance

---

### Pre-Deploy Manual QA (Option B)

**Trigger:** Manual command `/qa-check` or before major releases

**Test Suite:** Same as Daily, but:
- More thorough (include edge cases)
- Test new features specifically
- Check for visual regressions
- Performance testing (load time, bundle size)

**Output:**
- Detailed report to Telegram
- Pass/Fail decision
- Recommendations before deploy

**Estimated Token Cost:**
- ~50K tokens/run
- Only when needed (2-3 times/week)

---

## 🏗️ Implementation Plan

### Phase 1: MVP (Tonight)
1. Create QA subagent role (`/subagent-roles/qa-tester.md`)
2. Write test scenarios document
3. Set up daily cron (3:00 AM)
4. Test manually once

**Time:** 2-3 hours

### Phase 2: Enhancements (This Week)
1. Add screenshot comparison (visual regression)
2. Add performance benchmarks
3. Add API endpoint testing
4. Add security checks (HTTPS, headers, etc.)

**Time:** 4-5 hours

### Phase 3: Advanced (Later)
1. Integration with Vercel preview deployments
2. Automated rollback on critical failures
3. Slack/Discord integration (if needed)
4. Historical trend analysis

**Time:** Future

---

## 📝 QA Subagent Role Definition

**Persona:** Detail-oriented QA Engineer  
**Mindset:** "Trust, but verify"  
**Communication:** Clear, actionable bug reports

**Responsibilities:**
- Execute test scenarios systematically
- Document failures with reproduction steps
- Suggest fixes (not implement)
- Report success/failure concisely

**Tools:**
- `browser` tool for UI testing
- `web_fetch` for API testing
- `exec` for build checks

---

## 🚨 Alert Criteria

**Immediate Alert (Telegram):**
- Production URL unreachable (504, 500, etc.)
- Critical flow broken (login, signup, settings save)
- Build failed
- Security issue detected

**Daily Summary:**
- Test results (pass/fail)
- Performance metrics
- New warnings/errors

**Weekly Report:**
- Trend analysis
- Recommendations
- Coverage gaps

---

## 📊 Success Metrics

**Week 1:**
- 0 production bugs reported by users
- 100% test execution rate
- <5 min average test time

**Month 1:**
- 95%+ test pass rate
- <10 false positives
- 0 critical bugs in production

---

## 🔄 Continuous Improvement

**After each bug:**
1. Add test case to prevent regression
2. Update QA scenarios
3. Review alert thresholds

**Monthly:**
1. Review false positives
2. Optimize test suite
3. Add new test cases for new features

---

## 💡 Today's Issues (Examples)

**Issue #1: OAuth Login Broken**
- Root cause: Site URL set to localhost
- Prevention: Add to smoke test (OAuth button clickable)
- Test: Try OAuth login, check for errors

**Issue #2: Settings Not Saving**
- Root cause: Incorrect upsert usage
- Prevention: Add to critical flows (save & reload)
- Test: Change settings, refresh, verify persistence

---

## 🎬 Next Steps

1. ✅ Get 메이님 approval
2. Create QA subagent role file
3. Write detailed test scenarios
4. Set up cron (3:00 AM daily)
5. Manual test run tonight
6. Monitor for 1 week, adjust

---

**Status:** Draft  
**Awaiting:** 메이님 approval to proceed  
**ETA:** 2-3 hours to MVP
