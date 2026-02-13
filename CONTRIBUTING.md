# Contributing to Personal Runway Calculator

Thank you for your interest in contributing! 🙏

This project aims to help people calculate their financial runway and make confident decisions about quitting their jobs, freelancing, or taking career breaks.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

Be kind, be respectful, be helpful.

This is a safe space for people learning, growing, and building together.

**We don't tolerate:**
- Harassment, discrimination, or hate speech
- Trolling or deliberate disruption
- Spam or self-promotion
- Sharing private information without consent

**If you see a violation:** Report it to [your-email@example.com]

---

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting:**
1. Check if the bug is already reported (search [Issues](issues-link))
2. Try the latest version (bug might be fixed)
3. Reproduce the bug (consistent steps)

**When reporting:**
- Use a clear title: "Bug: [feature] doesn't work when [condition]"
- Describe steps to reproduce
- Include expected vs actual behavior
- Add screenshots if UI-related
- Share your environment (browser, OS, device)

**Template:**
```markdown
## Bug Description
[Clear description]

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: Chrome 120
- OS: macOS 14.0
- Device: Desktop

## Screenshots
[If applicable]
```

---

### 💡 Suggesting Features

**Before suggesting:**
1. Check if it's already requested (search [Issues](issues-link))
2. Think about the use case (who needs this?)
3. Consider if it fits the project scope (runway calculator, not general budgeting app)

**When suggesting:**
- Use a clear title: "Feature: Add [specific feature]"
- Explain the problem it solves
- Describe your proposed solution
- Mention alternatives you've considered
- Explain why this matters

**Template:**
```markdown
## Problem
[What problem does this solve?]

## Proposed Solution
[How would this feature work?]

## Alternatives Considered
[Other ways to solve this]

## Why This Matters
[Use case, user benefit]

## Additional Context
[Screenshots, mockups, examples]
```

---

### 🔧 Code Contributions

**Good first issues:**
- Look for `good-first-issue` label
- Usually small, well-defined tasks
- Great for getting familiar with the codebase

**Areas we need help:**
- [ ] Writing tests (we have none!)
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Mobile UX polish
- [ ] Documentation
- [ ] Translations (future)

---

## Development Setup

### Prerequisites

```bash
- Node.js 18+ (check: node --version)
- npm 9+ (check: npm --version)
- Git (check: git --version)
- Supabase account (free tier)
```

---

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/personal-runway-calculator.git
cd personal-runway-calculator
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Setup

```bash
# Copy example env file
cp .env.example .env.local

# Add your Supabase credentials
# Get these from: https://app.supabase.com/project/YOUR-PROJECT/settings/api
```

`.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 4. Database Setup

```bash
# Option A: Use existing Supabase project
# 1. Create new project on supabase.com
# 2. Run migrations from /supabase/schema.sql

# Option B: Local Supabase (advanced)
npx supabase init
npx supabase start
npx supabase db reset
```

---

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### 6. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring
- `test/` for adding tests

---

## Pull Request Process

### 1. Make Your Changes

- Write clean, readable code
- Follow our coding standards (see below)
- Add comments for complex logic
- Update documentation if needed

---

### 2. Test Locally

```bash
# Run the app
npm run dev

# Build for production (check for errors)
npm run build

# Run the production build
npm start
```

**Manual testing checklist:**
- [ ] Feature works on desktop
- [ ] Feature works on mobile (iPhone, Android)
- [ ] No console errors
- [ ] UI is responsive
- [ ] Accessibility: keyboard navigation works
- [ ] Works in Chrome, Firefox, Safari

---

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add expense categories"
```

**See Commit Guidelines below for format.**

---

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

---

### 5. Open a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template:

```markdown
## Description
[What does this PR do?]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Go to...
2. Click on...
3. Verify that...

## Screenshots
[If UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] I've tested this locally
- [ ] I've updated documentation
- [ ] No new warnings or errors
```

---

### 6. Code Review

- We'll review your PR within 2-3 days
- Be ready to make changes if requested
- Once approved, we'll merge!

---

## Coding Standards

### TypeScript

✅ **Do:**
```typescript
// Use explicit types
interface ExpenseData {
  amount: number;
  category: string;
  date: string;
}

// Prefer named exports
export function calculateRunway(savings: number, expenses: number): number {
  return Math.floor(savings / expenses);
}

// Use async/await
async function fetchExpenses(): Promise<ExpenseData[]> {
  const { data } = await supabase.from('expenses').select('*');
  return data || [];
}
```

❌ **Don't:**
```typescript
// Avoid `any`
function doSomething(data: any) { ... }

// Avoid default exports (use named exports)
export default function MyComponent() { ... }

// Avoid `.then()` chains (use async/await)
supabase.from('expenses').select('*').then(data => { ... });
```

---

### React Components

✅ **Do:**
```tsx
// Functional components with TypeScript
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function Button({ onClick, label, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {label}
    </button>
  );
}
```

❌ **Don't:**
```tsx
// Avoid class components
class Button extends React.Component { ... }

// Avoid inline styles (use Tailwind)
<button style={{ padding: '10px' }}>Click</button>
```

---

### Tailwind CSS

✅ **Do:**
```tsx
// Use Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>

// Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

❌ **Don't:**
```tsx
// Avoid custom CSS files
<div className="my-custom-class">

// Avoid inline styles
<div style={{ display: 'flex' }}>
```

---

### File Structure

```
/app
  /components      # Reusable UI components
    Auth.tsx
    Dashboard.tsx
  /hooks           # Custom React hooks
    useAuth.ts
    useRunway.ts
  /lib             # Utilities, helpers
    supabase.ts
    utils.ts
  /types           # TypeScript types
    index.ts
  page.tsx         # Route pages
  layout.tsx
/supabase
  schema.sql       # Database schema
/public
  manifest.json    # PWA manifest
  og-image.png
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build, dependencies, etc.

### Examples

```bash
feat(dashboard): add expense categories

Added dropdown for expense categories (Food, Transport, Entertainment).
Users can now organize expenses better.

Closes #42

---

fix(auth): resolve email verification bug

Email verification link was broken on mobile Safari.
Fixed by adjusting redirect URL format.

Fixes #56

---

docs(readme): update installation instructions

Added troubleshooting section for Supabase setup.

---

refactor(hooks): simplify useRunway hook

Removed unnecessary state, improved performance by 20%.

---

test(utils): add tests for runway calculation

Added unit tests for edge cases (zero expenses, negative savings).
```

---

## Testing

**We currently don't have tests (yet!)**

If you'd like to help set up testing:
1. Choose a framework (Jest + React Testing Library?)
2. Write tests for core functions:
   - Runway calculation
   - Expense tracking
   - Auth flows
3. Open a PR with testing setup

**Priority:**
- Unit tests for calculations
- Integration tests for Supabase
- E2E tests for critical flows (signup, expense tracking)

---

## Documentation

### Code Comments

✅ **Do comment:**
- Complex logic or algorithms
- Non-obvious decisions
- Edge cases or gotchas
- Public API functions

```typescript
/**
 * Calculate financial runway based on savings and monthly expenses.
 * Returns number of months until funds run out.
 * 
 * @param savings - Total available savings (USD)
 * @param monthlyExpenses - Average monthly burn rate (USD)
 * @returns Number of months (rounded down)
 * 
 * @example
 * calculateRunway(60000, 3000) // Returns: 20
 */
export function calculateRunway(savings: number, monthlyExpenses: number): number {
  if (monthlyExpenses <= 0) return 999; // Infinite runway
  return Math.floor(savings / monthlyExpenses);
}
```

❌ **Don't comment:**
- Obvious code
- What the code does (code should be self-explanatory)

```typescript
// Bad: Obvious comment
const total = a + b; // Add a and b
```

---

### README Updates

If your PR changes user-facing features:
- Update README.md
- Add screenshots if UI changed
- Update feature list
- Add to "What's New" section

---

## Project-Specific Notes

### Supabase RLS Policies

**When adding new tables:**
1. Add RLS policies (users can only see their own data)
2. Test with `set role authenticated` in SQL

```sql
-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see own data
CREATE POLICY "Users can view own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Test the policy
SET role authenticated;
SET request.jwt.claims.sub = '<test-user-uuid>';
SELECT * FROM expenses; -- Should only show test user's data
```

---

### Mobile-First Design

**Always test on mobile:**
- Use Chrome DevTools device emulation
- Test on real iPhone if possible
- Check touch targets (min 44px)
- Verify text is readable (min 16px)

---

### Performance

**Lighthouse score targets:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Keep bundle size small:**
- Current: 87 kB
- Target: <100 kB

---

## Questions?

- **General questions:** Open a [Discussion](discussions-link)
- **Bug reports:** Open an [Issue](issues-link)
- **Feature requests:** Open an [Issue](issues-link)
- **Security issues:** Email [security@example.com]
- **DM me:** Twitter [@personalrunway]

---

## Recognition

Contributors are recognized in:
- README.md (Contributors section)
- Release notes (for significant contributions)
- Shout-outs on Twitter

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🙏

Every contribution, big or small, makes this project better.

Thank you for being part of the journey!

---

**Happy coding!** 🚀
