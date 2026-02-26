# 🚨 P0 Quick Fix Guide - Undefined.length Errors

## Problem
```
PageError: Cannot read properties of undefined (reading 'length')
```
Occurs 2x per page load on all pages.

---

## Root Cause
Arrays/strings accessed before initialization. Missing null checks.

---

## Files to Check (Priority Order)

### 1. app/contexts/ScenarioContext.tsx ⚠️ HIGH
```typescript
// Line ~45: UNSAFE
if (selectedScenarios.length === 0 && scenarios.length >= 2) {
  
// FIX:
if (selectedScenarios?.length === 0 && scenarios?.length >= 2) {

// Line ~48: UNSAFE
if (ids.length > 3) {

// FIX:
if (ids?.length > 3) {
```

### 2. app/components/RunwayChart.tsx ⚠️ HIGH
```typescript
// Line ~23: UNSAFE
if (results.length === 0) return [];

// FIX:
if (!results || results.length === 0) return [];

// Line ~28: UNSAFE  
if (!active || !payload || payload.length === 0) return null;

// FIX (already safe, but double-check):
if (!active || !payload || !payload?.length) return null;

// Line ~34: UNSAFE
if (scenarios.length === 0) {

// FIX:
if (!scenarios || scenarios.length === 0) {
```

### 3. app/components/ComparisonTable.tsx ⚠️ MEDIUM
```typescript
// Multiple locations: UNSAFE
if (scenarios.length === 0) { ... }
if (values.length === 0) { ... }

// FIX ALL with:
if (!scenarios || scenarios.length === 0) { ... }
if (!values || values.length === 0) { ... }
```

---

## Quick Fix Pattern

### Search & Replace (Use with caution!)
```bash
# Find all .length usages without null check
grep -rn "if (.*\.length" app/ --include="*.tsx" --include="*.ts"

# Look for patterns like:
# if (array.length   ❌
# if (!array || array.length   ✅
```

### Safe Pattern Template
```typescript
// ❌ BEFORE (causes errors)
if (array.length > 0) { ... }
for (let i = 0; i < items.length; i++) { ... }
return data.filter(x => x.values.length > 0);

// ✅ AFTER (safe)
if (array?.length > 0) { ... }
if (Array.isArray(array) && array.length > 0) { ... }

// For iteration:
for (let i = 0; i < (items?.length ?? 0); i++) { ... }
items?.forEach(item => { ... })

// For chaining:
return data?.filter(x => x.values?.length > 0) ?? [];
```

---

## Testing After Fix

### 1. Manual Browser Test
```bash
# Start dev server
npm run dev

# Open browser console (F12)
# Navigate to:
- http://localhost:3000/
- http://localhost:3000/onboarding
- http://localhost:3000/dashboard

# Check console: Should be 0 errors
```

### 2. Automated Test
```bash
npm run test:e2e -- beta-test-taehyun.spec.ts

# Expected output:
# 5 passed
# 0 failed
```

### 3. Verification Script
```bash
node manual-beta-verification.js

# Should complete without errors
```

---

## Expected Impact
- **Before:** 2 errors per page load
- **After:** 0 errors
- **Time to fix:** 30-60 minutes
- **Risk:** Low (defensive code is always safe)

---

## TypeScript Enhancement (Optional but Recommended)

Enable strict null checks to catch these at compile time:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

Then run:
```bash
npm run build

# Fix all new TypeScript errors
# They're the same issues we're fixing manually
```

---

## Regression Prevention

Add a pre-commit hook to catch unsafe patterns:

```bash
# .husky/pre-commit (or equivalent)
#!/bin/sh

# Check for unsafe .length usage
UNSAFE=$(grep -r "if (.*[^?]\.length" app/ --include="*.tsx" --include="*.ts" | wc -l)

if [ $UNSAFE -gt 0 ]; then
  echo "⚠️  Found unsafe .length usage without null check"
  echo "Run: grep -rn 'if (.*[^?]\.length' app/ --include='*.tsx'"
  exit 1
fi
```

---

## Done When
- [ ] All console errors gone
- [ ] Playwright tests pass (5/5)
- [ ] Manual onboarding flow completes
- [ ] Dashboard loads without errors
- [ ] TypeScript strict mode enabled (optional)

---

**Priority:** 🔴 P0 - CRITICAL  
**Estimated Fix Time:** 30-60 minutes  
**Risk:** Low  
**Impact:** High (enables launch)

---

**Ready to fix?** Start with ScenarioContext.tsx (highest impact)  
**Questions?** See full report in `beta-test-report-taehyun.md`
