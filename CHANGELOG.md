# Changelog

All notable changes to Personal Runway Calculator will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Accessibility (a11y) Improvements** (2026-02-15)
  - ARIA labels for all icon buttons (Settings, Theme, Add Expense, Delete)
  - Dynamic aria-labels for Delete buttons (includes category + amount)
  - Aria-expanded attribute for collapsible simulator
  - Escape key closes all modals (Settings, Expense Form, Simulator, Theme)
  - WCAG 2.1 Level AA compliance checklist (10.8KB)
  - Improved screen reader support
  - Better keyboard navigation
- **SEO Enhancement: Structured Data** (2026-02-15)
  - JSON-LD WebApplication schema
  - Feature list, pricing, rating metadata
  - Improves Google rich results visibility
- **Launch Preparation Materials** (2026-02-15, 40KB total)
  - Beta Signup Form template (7.6KB) - Google Form with 12 questions
  - Twitter Strategy guide (9.9KB) - Account setup + content calendar
  - Product Hunt Checklist (11.4KB) - Comprehensive launch guide
  - Launch Readiness Report (9.5KB) - 95% ready assessment
  - Accessibility checklist (10.8KB) - WCAG 2.1 AA compliance
- **PWA Icons** (2026-02-15)
  - Generated 192px and 512px icons with brand colors
  - Purple gradient background with $ symbol
  - Updated manifest.json with icon definitions
  - Fixes 404 errors for missing PWA assets
- **QA Automation System** (2026-02-14)
  - Daily automated QA at 3:00 AM KST
  - 17 comprehensive test scenarios
  - QA Tester subagent role definition
  - Automated reporting to `/qa-reports/`
- **Debug Logging System** (2026-02-14)
  - Comprehensive logging in all useSupabaseFinance functions
  - Request/response tracking for all database operations
  - Error context and stack traces
  - Helps diagnose production issues without browser access
- Google OAuth social login UI
- GitHub OAuth social login UI
- Karpathy-inspired coding guidelines (CLAUDE.md)
- Comprehensive research insights document
- Time-centric SEO metadata ("Your Money is TIME")
- OG image template for social sharing
- Cleanup notes for future improvements

### Changed
- **UX Improvement: Optional fields** (2026-02-15)
  - Lump Sum, Monthly Income, Income Months, Monthly Variable now allow empty values
  - Added placeholder "0" instead of forcing 0 value
  - Added "(optional)" labels for clarity
  - Better user experience - cleaner initial state
- **Code Quality** (2026-02-15)
  - ESLint warnings reduced from 11 to 4 (63% improvement)
  - Removed unused variables (recurringExpenses, newRecurring - future features)
  - Documented intentional patterns with comments
  - Created .eslintignore for build scripts
- Updated SEO metadata to emphasize time-over-money metaphor
- Improved error handling (removed `any` types)
- Enhanced metadata keywords for better discoverability
- Separated viewport and themeColor to viewport export (Next.js 16 best practice)

### Fixed
- **🔴 P0: Financial settings data loss on refresh** (2026-02-15)
  - **Issue**: Settings not persisting after page reload (regression from 2/14)
  - **Root cause**: Supabase UPSERT operation conflicting with RLS policies (409 Conflict)
  - **Solution**: Replace upsert with conditional INSERT/UPDATE (check existing record first)
  - **Impact**: Users' financial data now persists correctly across sessions
  - **Status**: ✅ Fixed, deployed to production
- **Financial settings not persisting** (2026-02-14, initial attempt)
  - Root cause: Incorrect upsert usage with .eq() after upsert
  - Fix: Use onConflict: 'user_id' for proper upsert
  - Note: This fix didn't fully resolve the issue (see 2/15 P0 fix above)
- **Next.js 16 build warnings** (2026-02-14)
  - Added metadataBase for absolute OG image URLs
  - Moved viewport/themeColor to separate export
  - All 4 warnings resolved
- Code quality improvements (ESLint warnings)
  - Removed unused variables and imports
  - Fixed unescaped apostrophes in JSX
  - Replaced `any` types with proper Error type guards

### Documentation
- **README.md overhaul** (2026-02-15)
  - Updated to reflect 93% launch readiness
  - Added PWA features section
  - Updated tech stack (Next.js 16, Turbopack, RLS)
  - Strengthened "Your Money is TIME" messaging
  - Documented Phase 1 completion (P0 fix, PWA, QA)
- **CLAUDE.md: Supabase guidelines** (2026-02-15)
  - Section 5: Database & RLS best practices
  - Critical: UPSERT + RLS pitfalls documented
  - Correct pattern (conditional INSERT/UPDATE)
  - Emergency debugging checklist
  - Prevent future regressions
- **QA Regression Tests** (2026-02-15)
  - Added P0 bug history to test scenarios
  - Document critical test points
  - Reference QA fix report for full analysis
- **Code Comments** (2026-02-15)
  - Explained why UPSERT is avoided
  - Referenced QA reports for context
  - Help future developers avoid same mistakes
- Added QA Automation Plan (A+B hybrid approach)
- Added QA test scenarios document (40 scenarios)
- Added Supabase OAuth setup guide
- Created research insights summary (target audience, monetization, launch strategy)
- Updated coding guidelines based on industry best practices (Karpathy principles)
- Added cleanup notes documenting unused files and types
- **P0 Fix Report** (qa-reports/2026-02-15-10-30-P0-FIX.md, 8.5KB)

## [0.1.0] - 2026-02-13

### Added
- Initial MVP release
- Runway calculator with real-time updates
- Expense tracking with categories
- Cloud sync with Supabase
- User authentication
- Responsive mobile-first design
- 5 color themes (Classic, Dark, Ocean, Forest, Sunset)
- Budget tracking and alerts
- Recurring expense support
- Production deployment on Vercel

### Technical
- Next.js 16 with Turbopack
- TypeScript strict mode
- Tailwind CSS 4
- Supabase integration (PostgreSQL + Auth)
- Vercel deployment with automatic CI/CD

---

**Note:** This changelog will be updated with each release. For detailed commit history, see [GitHub commits](https://github.com/maypak/personal-runway-calculator/commits/main).
