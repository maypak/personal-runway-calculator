# ⚡ P0 Quick Fix Guide (5-6 hours)

**Goal:** Make the codebase production-ready for beta launch

---

## 🔧 Fix #1: Remove console.log from production (2-3 hours)

### Step 1: Create Logger Utility (15 min)

```typescript
// app/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  debug(message: string, ...args: any[]) {
    if (this.isDev) {
      console.log(`🔍 ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.isDev) {
      console.info(`ℹ️ ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.isDev) {
      console.warn(`⚠️ ${message}`, ...args);
    } else {
      // In production, send to error tracking service
      // TODO: Add Sentry/LogRocket integration
    }
  }

  error(message: string, context?: any) {
    if (this.isDev) {
      console.error(`❌ ${message}`, context);
    } else {
      // In production, always track errors
      // TODO: Add Sentry.captureException()
      console.error(message); // Keep errors in prod (but not debug logs)
    }
  }
}

export const logger = new Logger();
```

---

### Step 2: Replace console.log in hooks (1-1.5 hours)

**Files to update:**
- `app/hooks/useScenarios.ts` (~20 console statements)
- `app/hooks/useFIRESettings.ts` (~15 console statements)
- `app/hooks/useAuth.ts`
- `app/hooks/useSupabaseFinance.ts`
- Other hooks in `app/hooks/`

**Find & Replace:**

```typescript
// OLD
console.log('🔍 [useScenarios] Loading scenarios...');
console.error('❌ Failed to load scenarios:', err);
console.warn('⚠️ No user authenticated');

// NEW
import { logger } from '@/lib/logger';

logger.debug('[useScenarios] Loading scenarios...');
logger.error('Failed to load scenarios', { error: err });
logger.warn('No user authenticated');
```

**Automated replacement:**

```bash
# Find all console.log in hooks
grep -r "console\.log" app/hooks --include="*.ts" --include="*.tsx"

# Manual review + replace with logger.debug()
# (Can't automate - need to choose debug/info/warn/error)
```

---

### Step 3: Replace console.* in components (1-1.5 hours)

**Files to update:**
- `app/components/FIREDashboard.tsx`
- `app/components/ComparisonView.tsx`
- `app/components/FinanceDashboardSupabase.tsx`
- Other components with console statements

**Same pattern:**

```typescript
import { logger } from '@/lib/logger';

// Replace console.* with logger.*
```

---

### Step 4: Verify (15 min)

```bash
# Should return 0 results
grep -r "console\." app --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "__tests__"

# Build should succeed with no console spam in output
npm run build

# Dev mode should still show logs
npm run dev
# (Check browser console - logs should appear)

# Production build should be clean
NODE_ENV=production npm run build
# (No debug logs in browser console)
```

---

## 🔧 Fix #2: Add React Error Boundary (1 hour)

### Step 1: Create ErrorBoundary Component (30 min)

```typescript
// app/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. The error has been logged and we'll look into it.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-100 p-4 rounded mb-4 text-sm">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (dev only)
                </summary>
                <pre className="whitespace-pre-wrap text-red-600">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

### Step 2: Wrap Root Layout (15 min)

```typescript
// app/layout.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

### Step 3: Test Error Boundary (15 min)

Create test component:

```typescript
// app/components/TestError.tsx (dev only)
'use client';

export function TestError() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error - ErrorBoundary working!');
  }

  return (
    <button onClick={() => setShouldError(true)}>
      Trigger Error (Test)
    </button>
  );
}
```

Add to page temporarily:

```typescript
// app/page.tsx
{process.env.NODE_ENV === 'development' && <TestError />}
```

Click button → should see error boundary UI ✅

---

## 🔧 Fix #3: Fix ESLint Errors (2 hours)

### Error 1: setState in useEffect (ComparisonView.tsx)

**Current (BAD):**
```typescript
// app/components/ComparisonView.tsx:43
useEffect(() => {
  if (idsParam) {
    const ids = idsParam.split(',').filter(id => scenarios.some(s => s.id === id));
    setLocalSelection(ids); // ❌ setState in effect
    selectForComparison(ids);
  }
}, []);
```

**Fixed (GOOD):**
```typescript
// Derive state from props instead
const initialSelection = useMemo(() => {
  if (!idsParam) return [];
  return idsParam.split(',').filter(id => scenarios.some(s => s.id === id));
}, [idsParam, scenarios]);

// Separate effect for side effects
useEffect(() => {
  if (initialSelection.length > 0) {
    selectForComparison(initialSelection);
  }
}, [initialSelection, selectForComparison]);

// Use initialSelection directly (no local state needed)
```

---

### Error 2: setState in useEffect (FIRESettings.tsx)

**Current (BAD):**
```typescript
// app/components/FIRESettings.tsx:87
useEffect(() => {
  setLocalInvestmentRate(investmentReturnRate); // ❌
  setLocalSWR(safeWithdrawalRate);
  setLocalMonthlySavings(monthlySavings);
  setLocalTargetExpenses(targetAnnualExpenses?.toString() ?? '');
}, [investmentReturnRate, safeWithdrawalRate, monthlySavings, targetAnnualExpenses]);
```

**Fixed (GOOD):**
```typescript
// Option 1: Remove local state (use props directly)
// If you need to track "dirty" state for editing, use this pattern:

const [isDirty, setIsDirty] = useState(false);
const [localValues, setLocalValues] = useState({
  investmentRate: investmentReturnRate,
  swr: safeWithdrawalRate,
  monthlySavings,
  targetExpenses: targetAnnualExpenses?.toString() ?? '',
});

// Only sync on mount or reset
const resetToProps = useCallback(() => {
  setLocalValues({
    investmentRate: investmentReturnRate,
    swr: safeWithdrawalRate,
    monthlySavings,
    targetExpenses: targetAnnualExpenses?.toString() ?? '',
  });
  setIsDirty(false);
}, [investmentReturnRate, safeWithdrawalRate, monthlySavings, targetAnnualExpenses]);

// Don't sync on every prop change - only when user clicks "Reset"
<button onClick={resetToProps}>Reset to Saved</button>
```

---

### Error 3: Component Created During Render (FIProjectionChart.tsx)

**Current (BAD):**
```typescript
// app/components/FIProjectionChart.tsx:147
const CustomTooltip = ({ active, payload, label }: any) => {
  // ❌ Created on every render
  if (!active || !payload || payload.length === 0) return null;
  // ...
};

return <Tooltip content={<CustomTooltip />} />;
```

**Fixed (GOOD):**
```typescript
// Option 1: Define outside component
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  // ...
};

// Then use inside component
export function FIProjectionChart() {
  // ...
  return <Tooltip content={<CustomTooltip />} />;
}

// OR Option 2: Use useCallback (if you need access to component state)
const CustomTooltip = useCallback(({ active, payload, label }: TooltipProps) => {
  // ...
}, [/* dependencies */]);
```

Also fix the `any` types:

```typescript
// Define proper type
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  // ✅ Type-safe
};
```

---

### Error 4: Remove unused imports

```typescript
// app/components/FIREDashboard.tsx:21
import { Calendar } from 'lucide-react'; // ❌ Unused

// Remove it
```

```typescript
// app/components/ComparisonTable.tsx:71
const t = ...; // ❌ Defined but never used

// Remove it or use it
```

---

### Step 4: Verify All Fixed (15 min)

```bash
# Should return 0 errors (warnings are OK)
npm run lint

# Should show:
# ✓ No ESLint errors
# ⚠ X warnings (acceptable)

# If you still see errors, fix them before continuing
```

---

## 🔧 Fix #4: Verify Vercel Environment Variables (15 min)

```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Link project
cd personal-runway-calculator
vercel link

# 3. List environment variables
vercel env ls

# Should show:
# Production:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**If missing:**

```bash
# Add them
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste value from .env.local

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste value from .env.local

# Redeploy
vercel --prod
```

**Verify deployment:**

```bash
# Open production URL
# Check browser console - should see no errors
# Try logging in - should work
```

---

## ✅ FINAL VERIFICATION

After all fixes:

```bash
# 1. Clean build
rm -rf .next
npm run build

# Should see:
# ✓ Compiled successfully
# 0 errors, 0 warnings (or acceptable warnings)

# 2. Lint check
npm run lint

# Should see:
# ✓ No ESLint errors

# 3. Type check
npx tsc --noEmit

# Should see:
# 0 errors (except test files - that's OK)

# 4. Test deployment
vercel --prod

# 5. Manual test on production URL
# - Sign up / Log in
# - Add expense
# - Save settings
# - Check that data persists
# - Trigger an error (network offline)
# - Should see error boundary or graceful fallback
```

---

## 📊 COMPLETION CHECKLIST

- [ ] **Fix #1:** Logger utility created + all console.* replaced (2-3h)
- [ ] **Fix #2:** ErrorBoundary component + wrapped in layout (1h)
- [ ] **Fix #3:** All 5 ESLint errors fixed (2h)
- [ ] **Fix #4:** Vercel env vars verified (15min)
- [ ] **Verify:** Clean build, lint, deploy (30min)

**Total:** 5-6 hours

---

## 🎯 SUCCESS CRITERIA

✅ **npm run build** → 0 errors  
✅ **npm run lint** → 0 errors (warnings OK)  
✅ **Production deployment** → Working (auth + data)  
✅ **Error boundary** → Catches crashes gracefully  
✅ **Console logs** → Only in development mode  

**When all ✅ → Ready for beta launch!**

---

**Next steps:** See `DEV_FINAL_REVIEW.md` for P1 (high priority) fixes

