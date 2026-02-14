# Changelog

All notable changes to Personal Runway Calculator will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **QA Automation System** (2026-02-14)
  - Daily automated QA at 3:00 AM KST
  - 17 comprehensive test scenarios
  - QA Tester subagent role definition
  - Automated reporting to `/qa-reports/`
- Google OAuth social login UI
- GitHub OAuth social login UI
- Karpathy-inspired coding guidelines (CLAUDE.md)
- Comprehensive research insights document
- Time-centric SEO metadata ("Your Money is TIME")
- OG image template for social sharing
- Cleanup notes for future improvements

### Changed
- Updated SEO metadata to emphasize time-over-money metaphor
- Improved error handling (removed `any` types)
- Enhanced metadata keywords for better discoverability
- Separated viewport and themeColor to viewport export (Next.js 16 best practice)

### Fixed
- **Financial settings not persisting** (2026-02-14)
  - Root cause: Incorrect upsert usage with .eq() after upsert
  - Fix: Use onConflict: 'user_id' for proper upsert
  - Added error handling and return values
- **Next.js 16 build warnings** (2026-02-14)
  - Added metadataBase for absolute OG image URLs
  - Moved viewport/themeColor to separate export
  - All 4 warnings resolved
- Code quality improvements (ESLint warnings)
  - Removed unused variables and imports
  - Fixed unescaped apostrophes in JSX
  - Replaced `any` types with proper Error type guards

### Documentation
- Added QA Automation Plan (A+B hybrid approach)
- Added QA test scenarios document
- Added Supabase OAuth setup guide
- Created research insights summary (target audience, monetization, launch strategy)
- Updated coding guidelines based on industry best practices (Karpathy principles)
- Added cleanup notes documenting unused files and types

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
