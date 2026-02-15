# Contributing to Personal Runway Calculator

First off, thanks for taking the time to contribute! 🎉

This document provides guidelines for contributing to the Personal Runway Calculator project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Guidelines](#coding-guidelines)
5. [Commit Message Convention](#commit-message-convention)
6. [Pull Request Process](#pull-request-process)
7. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

**Be respectful, be kind, be helpful.**

This is a tool built to help people, by people. We're all learning, all growing.

If you see something that could be better, suggest it constructively. If someone makes a mistake, help them learn.

---

## How Can I Contribute?

### 🐛 Report Bugs

Found a bug? [Open an issue](https://github.com/maypak/personal-runway-calculator/issues/new) with:

- **Clear title**: "Bug: Runway calculation incorrect when..."
- **Steps to reproduce**: What you did
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device

### 💡 Suggest Features

Have an idea? [Open an issue](https://github.com/maypak/personal-runway-calculator/issues/new) with:

- **Clear title**: "Feature: Add multi-currency support"
- **Problem**: What pain point does this solve?
- **Solution**: How would this feature work?
- **Alternatives**: Other ways to solve this?
- **Mockups/sketches**: Visual helps!

### 🔧 Submit Code

Want to contribute code? Awesome! Follow the [Pull Request Process](#pull-request-process) below.

### 📝 Improve Documentation

Typos, unclear instructions, missing examples? PRs welcome!

---

## Development Setup

### Prerequisites

- **Node.js**: 20+ (recommended: 20.x LTS)
- **npm**: 10+
- **Git**: Latest version
- **Supabase account**: For auth + database (free tier OK)

### Local Setup

1. **Fork the repository**

   Click "Fork" on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/personal-runway-calculator.git
   cd personal-runway-calculator
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   [Get your Supabase credentials](https://supabase.com/dashboard)

5. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

6. **Make your changes**

   - Create a new branch: `git checkout -b feature/your-feature-name`
   - Make changes
   - Test locally
   - Commit with [conventional commit messages](#commit-message-convention)

7. **Run checks before committing**

   ```bash
   npm run lint      # Check for linting errors
   npm run build     # Ensure build succeeds
   npm run type-check # TypeScript type checking
   ```

---

## Coding Guidelines

We follow **Karpathy principles** (see [CLAUDE.md](./CLAUDE.md) for full guidelines).

### Core Principles

1. **Think Before Coding**
   - Understand the problem deeply
   - Consider edge cases
   - Plan the solution

2. **Simplicity First**
   - Simple > clever
   - Fewer lines > more features
   - Maintainability > performance (until proven otherwise)

3. **Surgical Changes**
   - One thing at a time
   - No drive-by refactoring
   - If you touch it, test it

4. **Goal-Driven**
   - Every PR solves a real problem
   - No "might need this later" code
   - Delete > comment out

### TypeScript

- **Use strict mode**: Enabled by default
- **Avoid `any`**: Use proper types
- **Prefer interfaces**: Over types (for objects)
- **Document complex types**: Add comments

```typescript
// ✅ Good
interface FinancialSettings {
  currentSavings: number;
  monthlyFixed: number;
  monthlyVariable: number;
  lumpSum?: number; // Optional
}

// ❌ Bad
const settings: any = { ... };
```

### React

- **Functional components**: No class components
- **Hooks**: Use built-in hooks (useState, useEffect, etc.)
- **Custom hooks**: Prefix with `use` (e.g., `useSupabaseFinance`)
- **Props**: Destructure in function signature

```typescript
// ✅ Good
export default function Dashboard({ user }: { user: User }) {
  const [settings, setSettings] = useState<FinancialSettings>(defaultSettings);
  ...
}

// ❌ Bad
export default function Dashboard(props: any) {
  ...
}
```

### CSS (Tailwind)

- **Use Tailwind utilities**: Avoid custom CSS unless necessary
- **Responsive design**: Mobile-first (`sm:`, `md:`, `lg:`)
- **Dark mode**: Not yet implemented, but planned
- **Consistent spacing**: Use Tailwind's spacing scale (p-4, m-2, etc.)

```tsx
// ✅ Good
<div className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition">
  ...
</div>

// ❌ Bad
<div style={{ padding: '8px 16px', backgroundColor: 'white' }}>
  ...
</div>
```

### File Structure

```
app/
├── components/       # React components
│   ├── Auth.tsx
│   ├── FinanceDashboard.tsx
│   └── ...
├── hooks/            # Custom hooks
│   ├── useSupabaseFinance.ts
│   └── useLocalStorage.ts
├── types/            # TypeScript types/interfaces
│   └── index.ts
├── layout.tsx        # Root layout
└── page.tsx          # Home page

public/               # Static assets
supabase/             # Supabase schema & migrations
```

---

## Commit Message Convention

We follow **Conventional Commits** for clear, structured commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, no logic change)
- **refactor**: Code restructuring (no behavior change)
- **perf**: Performance improvement
- **test**: Add or update tests
- **chore**: Build process, dependencies, etc.

### Examples

```bash
# Feature
git commit -m "feat(dashboard): Add multi-currency support"

# Bug fix
git commit -m "fix(auth): Resolve OAuth login redirect issue"

# Documentation
git commit -m "docs(readme): Update installation instructions"

# Refactor
git commit -m "refactor(hooks): Extract Supabase logic to custom hook"

# Breaking change
git commit -m "feat(api)!: Change expense data structure

BREAKING CHANGE: Expense schema now uses `amount` instead of `value`"
```

### Scope (Optional)

- `dashboard`: Financial dashboard
- `auth`: Authentication
- `expenses`: Expense tracking
- `settings`: Settings panel
- `hooks`: Custom hooks
- `types`: TypeScript types
- `db`: Database/Supabase
- `ui`: UI components
- `docs`: Documentation

---

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/multi-currency-support
```

Branch naming:
- `feature/feature-name` (new features)
- `fix/bug-description` (bug fixes)
- `docs/what-youre-updating` (docs)
- `refactor/what-youre-refactoring` (refactors)

### 2. Make Your Changes

- Follow [coding guidelines](#coding-guidelines)
- Write clear commit messages
- Test your changes locally
- Update documentation if needed

### 3. Run Checks

```bash
npm run lint
npm run build
npm run type-check
```

**All must pass** before submitting PR.

### 4. Push to Your Fork

```bash
git push origin feature/multi-currency-support
```

### 5. Open a Pull Request

Go to [GitHub](https://github.com/maypak/personal-runway-calculator) and click "New Pull Request"

**PR Template:**

```markdown
## Description

[What does this PR do?]

## Motivation

[Why is this change needed? What problem does it solve?]

## Changes

- Added multi-currency selector to settings
- Updated runway calculation to handle currency conversion
- Added currency conversion API integration

## Screenshots (if applicable)

[Before/after screenshots]

## Checklist

- [ ] Code follows project coding guidelines
- [ ] Commit messages follow conventional commit format
- [ ] All checks pass (lint, build, type-check)
- [ ] Documentation updated (if needed)
- [ ] Tested locally
- [ ] No breaking changes (or documented if unavoidable)

## Related Issues

Fixes #123
```

### 6. Code Review

- Maintainer will review within 1-3 days
- Address feedback
- Iterate until approved
- PR will be merged or closed with explanation

---

## Issue Reporting

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Device: [e.g., iPhone 15]

**Additional context**
Any other context about the problem.
```

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, screenshots, or mockups.
```

---

## Development Tips

### Debugging

**Supabase Logs:**
```typescript
// useSupabaseFinance.ts has comprehensive logging
console.log('🔍 [functionName] Context:', data);
```

**Browser DevTools:**
- Network tab: Check Supabase API calls
- Console: Look for errors
- React DevTools: Inspect component state

### Testing Locally

**Test scenarios:**
1. Fresh user (no data)
2. Existing user (with data)
3. Edge cases (zero savings, negative expenses, etc.)
4. Mobile viewport (Chrome DevTools responsive mode)
5. Offline mode (PWA, future feature)

### Common Issues

**Build fails:**
- Check TypeScript errors: `npm run type-check`
- Check ESLint: `npm run lint`
- Clear cache: `rm -rf .next && npm run dev`

**Supabase connection fails:**
- Verify `.env.local` credentials
- Check Supabase dashboard (project status)
- Review RLS policies (ensure enabled)

**Deployment issues:**
- Check Vercel logs
- Ensure environment variables set in Vercel dashboard
- Verify build succeeds locally first

---

## Questions?

**Before asking:**
1. Check [README.md](./README.md)
2. Search [existing issues](https://github.com/maypak/personal-runway-calculator/issues)
3. Read [CLAUDE.md](./CLAUDE.md) for coding philosophy

**Still stuck?**
- Open an issue with `question` label
- Or DM on Twitter [@PersonalRunway](https://twitter.com/personalrunway)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

See [LICENSE](./LICENSE) for details.

---

**Thank you for contributing!** 🙏

Every PR, issue, and suggestion helps make this tool better for everyone.

— May  
Founder, Personal Runway Calculator
