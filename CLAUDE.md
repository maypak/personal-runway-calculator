# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. Supabase & Database Guidelines

**Specific to this project. Based on lessons learned.**

### 🚨 Critical: UPSERT + RLS = Trouble

**Never use UPSERT with Supabase when RLS policies are enabled.**

**Why it breaks:**
- UPSERT = Try INSERT → If conflict, UPDATE
- Supabase RLS has separate INSERT and UPDATE policies
- Both policies must pass for UPSERT to succeed
- This causes **409 Conflict** errors even with correct permissions

**What happened (P0 Bug - 2026-02-15):**
```typescript
// ❌ WRONG - Causes 409 Conflict
await supabase
  .from('finance_settings')
  .upsert({ ...data, user_id: userId }, { onConflict: 'user_id' })

// ✅ CORRECT - Check first, then INSERT or UPDATE
const { data: existing } = await supabase
  .from('finance_settings')
  .select('id')
  .eq('user_id', userId)
  .maybeSingle();

if (existing) {
  await supabase.from('finance_settings').update(data).eq('user_id', userId);
} else {
  await supabase.from('finance_settings').insert({ ...data, user_id: userId });
}
```

**Reference:** `qa-reports/2026-02-15-10-30-P0-FIX.md`

---

### Row Level Security (RLS) Best Practices

**When RLS is enabled:**
- Always check `auth.uid()` in policies
- Test with actual authenticated users (not service role key)
- Use `.maybeSingle()` instead of `.single()` to avoid throwing on empty results
- Monitor for 406/409 errors in production console

**Policy structure:**
```sql
-- Separate policies for each operation
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);
```

---

### Database Operation Checklist

Before any Supabase query:
1. ✅ Is RLS enabled on this table?
2. ✅ Are you using conditional INSERT/UPDATE (not UPSERT)?
3. ✅ Do you have proper error handling?
4. ✅ Are you logging errors for debugging?
5. ✅ Did you test with page refresh (data persistence)?

---

### Common Pitfalls

**Don't:**
- ❌ Use UPSERT with RLS-enabled tables
- ❌ Ignore 409/406/400 errors ("it works in dev")
- ❌ Remove debug logging too early
- ❌ Assume `.upsert()` and manual INSERT/UPDATE are equivalent (they're not)
- ❌ Test only optimistic UI updates (must verify backend persistence)

**Do:**
- ✅ Check for existing records explicitly
- ✅ Keep comprehensive logging in production
- ✅ Test data persistence with hard refresh
- ✅ Document WHY you're not using UPSERT (code comments)
- ✅ Add regression tests for critical data flows

---

### Emergency Debugging

If financial settings don't persist:
1. Open browser DevTools → Console
2. Look for Supabase errors (409, 406, 400)
3. Check Network tab → Filter "finance_settings"
4. Verify auth token exists (localStorage/cookies)
5. Test with `.maybeSingle()` to see if record exists

**Common fix:** Replace UPSERT with conditional INSERT/UPDATE

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
