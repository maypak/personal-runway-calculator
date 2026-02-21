# Changelog

All notable changes to Personal Runway Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [Week 2] - 2026-02-21

### Added
- 🎯 Scenario Comparison feature (P0-2)
  - Multiple scenario management (CRUD)
  - Side-by-side comparison table with baseline
  - Multi-line runway chart integration
  - Auto-generated insights
  - UX fix: Minimum 2 scenarios required for comparison

### Fixed
- Scenario comparison UX: Modal now requires 2+ scenarios
- Edit scenario data persistence
- Create scenario redirect issue
- Compare mode feedback (alert message)

### Technical
- Supabase scenarios table migration
- useScenarios hook with Context integration
- ScenarioCard, ScenarioManager, ComparisonView components
- RunwayChart multi-scenario support
- ComparisonTable with color coding

### Performance
- ESLint build errors resolved (next.config.js)
- Vercel auto-deploy pipeline restored
- TypeScript 0 errors maintained

---

### Week 1 (Feb 17-21, 2026) - P0-1: i18n Multi-language

#### Added - 2026-02-17 to 2026-02-21
- **Multi-language Support (P0-1)**
  - English + Korean translations
  - Language switcher component
  - next-i18next integration
  - 5 translation namespaces (common, auth, dashboard, settings, goals)
  - 150-200 translation keys
  
- **Bonus Features:**
  - FAQ page
  - Data export (GDPR compliance)
  - Password reset functionality
  - Mobile UX improvements (P0)
  - **FIRE Dashboard** (Week 3 feature completed early!)
    - FI Number calculation (4% rule)
    - FI Date projection with compound interest
    - Coast FIRE calculation
    - Progress visualization
    - Hydration error fixes
  
- **Security Enhancements:**
  - Password requirements: 12+ characters (was 6)
  - Uppercase + lowercase + number + special character required

#### Changed
- Language switcher moved to Auth card interior
- Beta banner positioning adjusted (no overlap)
- Password validation strengthened

#### Fixed
- Supabase 409 conflict errors (settings persistence bug - 2026-02-15)
- Console errors eliminated (100% clean)
- Hydration errors in FIRE Dashboard

#### Testing
- E2E test attempt (2026-02-21)
  - Created 30 tests (persistence + onboarding)
  - Discovered architecture mismatch (route-based vs modal-based)
  - Rolled back, documented lessons learned
  - Created realistic test strategy (TEST_STRATEGY.md)
- Unit tests: 83/83 passing ✅
- E2E auth tests: 10/10 passing ✅

---

## [1.0.0] - 2026-02-16

### Initial MVP Release

#### Core Features
- Personal runway calculator
- Expense tracking (one-time + recurring)
- Financial settings management
- Real-time runway updates
- Cloud sync with Supabase
- Responsive design (mobile-first)

#### Infrastructure
- Next.js 16 (App Router, Turbopack)
- TypeScript strict mode
- Tailwind CSS
- Supabase (PostgreSQL + RLS)
- Supabase Auth
- Vercel deployment
- PWA-ready (manifest, icons)

#### Security
- Row Level Security (RLS)
- Email + password authentication
- Data encryption at rest and in transit
- No tracking, no ads

---

## Development Notes

### Week 2 Performance
- **Planned:** 7 days
- **Actual:** 1 day (2.5 hours)
- **Speed:** 5.6x faster than expected
- **Quality:** 0 build errors, 100% type safety, all tests passing

### Week 1 Performance
- **Goal:** i18n + basic testing
- **Actual:** i18n + FAQ + Export + Password Reset + FIRE Dashboard (Week 3)
- **Effect:** +4.0 points (planned +1.5)
- **Speed:** 267% of target

### Development Philosophy
- Karpathy coding principles
- TypeScript strict mode
- Real user feedback (beta testers)
- No breaking changes in main branch
- Test coverage before launch

---

## Beta Feedback Integration

### Round 1 (Feb 16, 2026)
- 20 beta testers
- Average score: 5.6/7
- Top requests:
  1. ✅ Scenario comparison (15/20) - **Completed Week 2**
  2. ⏳ FIRE calculator - Partially done (dashboard ready)
  3. ⏳ Phase-based planning - Week 4

---

## Links

- **Live App:** https://personal-runway-calculator.vercel.app
- **Repository:** https://github.com/maypak/personal-runway-calculator
- **Issues:** https://github.com/maypak/personal-runway-calculator/issues
- **Beta Signup:** (Coming soon)

---

_Last updated: 2026-02-21 10:00 AM KST_
