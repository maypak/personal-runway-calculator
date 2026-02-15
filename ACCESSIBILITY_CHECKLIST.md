# Accessibility (a11y) Checklist

**Standard:** WCAG 2.1 Level AA  
**Goal:** Make Personal Runway accessible to all users  
**Status:** 🟡 Needs review

---

## WCAG 2.1 Level AA Checklist

### 1. Perceivable

#### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images use alt=""
- [ ] Icon buttons have aria-label
- [ ] Charts/graphs have text alternatives

**Current Status:**
- ✅ Minimal images (mostly text-based UI)
- ⏳ Icon buttons need aria-labels (Settings, Add Expense)

---

#### 1.2 Time-based Media
- N/A (No video/audio content)

---

#### 1.3 Adaptable
- [ ] Semantic HTML used (headings, lists, forms)
- [ ] Content structure makes sense
- [ ] Reading order is logical
- [ ] Instructions don't rely solely on visual characteristics

**Current Status:**
- ⏳ Review semantic HTML
- ⏳ Ensure proper heading hierarchy (h1 → h2 → h3)

---

#### 1.4 Distinguishable

##### 1.4.1 Use of Color
- [ ] Color is not the only visual means of conveying information
- [ ] Links are distinguishable from text (not just by color)

**Current Status:**
- ✅ Status indicators use both color AND text (e.g., "2yr 7mo")
- ⏳ Review all color-coded elements

##### 1.4.3 Contrast (Minimum)
**Required:** 4.5:1 for normal text, 3:1 for large text

- [ ] Text has sufficient contrast
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators are visible

**Check List:**
- Primary text (gray-900 on white): ⏳ Measure
- Secondary text (gray-600 on white): ⏳ Measure
- Buttons (violet-600 bg, white text): ⏳ Measure
- Links: ⏳ Measure

**Tool:** Use WebAIM Contrast Checker

##### 1.4.4 Resize Text
- [ ] Page is usable when text size is increased to 200%
- [ ] No horizontal scrolling at 200% zoom

**Test:** Browser zoom 200% on mobile and desktop

##### 1.4.5 Images of Text
- [ ] No images of text (use actual text instead)

**Current Status:**
- ✅ All text is actual text (no text images)

##### 1.4.10 Reflow
- [ ] Content reflows at 320px width
- [ ] No two-dimensional scrolling

**Current Status:**
- ✅ Mobile-first design, responsive
- ⏳ Test at 320px width

##### 1.4.11 Non-text Contrast
- [ ] UI components have 3:1 contrast
- [ ] Graphical objects have 3:1 contrast

**Current Status:**
- ⏳ Check input borders
- ⏳ Check button states

##### 1.4.12 Text Spacing
- [ ] Content is readable when text spacing is increased

**Test:** Apply CSS:
```css
* {
  line-height: 1.5;
  letter-spacing: 0.12em;
  word-spacing: 0.16em;
  paragraph-spacing: 2em;
}
```

##### 1.4.13 Content on Hover or Focus
- [ ] Content appearing on hover/focus can be dismissed
- [ ] Content appearing on hover/focus is hoverable
- [ ] Content appearing on hover/focus is persistent

**Current Status:**
- ✅ No hover-only content
- ✅ All interactive elements keyboard accessible

---

### 2. Operable

#### 2.1 Keyboard Accessible

##### 2.1.1 Keyboard
- [ ] All functionality available via keyboard
- [ ] No keyboard traps

**Test List:**
- [ ] Tab through entire page
- [ ] Enter to submit forms
- [ ] Escape to close modals
- [ ] Arrow keys for navigation (if applicable)

**Current Status:**
- ⏳ Test keyboard navigation
- ⏳ Ensure modal close with Escape

##### 2.1.2 No Keyboard Trap
- [ ] User can navigate away from all elements

**Test:** Tab through, ensure no traps

##### 2.1.4 Character Key Shortcuts
- [ ] No single-key shortcuts (unless exception applies)

**Current Status:**
- ✅ No keyboard shortcuts implemented

---

#### 2.2 Enough Time

##### 2.2.1 Timing Adjustable
- N/A (No time limits)

##### 2.2.2 Pause, Stop, Hide
- N/A (No auto-updating content)

---

#### 2.3 Seizures and Physical Reactions

##### 2.3.1 Three Flashes or Below Threshold
- [ ] No content flashes more than 3 times per second

**Current Status:**
- ✅ No flashing content

---

#### 2.4 Navigable

##### 2.4.1 Bypass Blocks
- [ ] Skip navigation link (if multi-page)
- [ ] Proper heading structure

**Current Status:**
- ✅ Single-page app (skip nav not needed)
- ⏳ Ensure proper heading hierarchy

##### 2.4.2 Page Titled
- [ ] Page has descriptive title

**Current Status:**
- ✅ Title: "Personal Runway Calculator - Your Money is TIME"

##### 2.4.3 Focus Order
- [ ] Focus order is logical and intuitive

**Test:** Tab through page, ensure order makes sense

##### 2.4.4 Link Purpose (In Context)
- [ ] Link text describes destination

**Current Status:**
- ⏳ Review all links (e.g., GitHub, Twitter)

##### 2.4.5 Multiple Ways
- N/A (Single-page app)

##### 2.4.6 Headings and Labels
- [ ] Headings and labels describe topic or purpose

**Current Status:**
- ⏳ Review all form labels
- ⏳ Ensure headings are descriptive

##### 2.4.7 Focus Visible
- [ ] Keyboard focus indicator is visible

**Current Status:**
- ✅ Tailwind default focus rings applied
- ⏳ Verify on all interactive elements

---

#### 2.5 Input Modalities

##### 2.5.1 Pointer Gestures
- [ ] All multipoint/path-based gestures have single-pointer alternative

**Current Status:**
- ✅ No complex gestures

##### 2.5.2 Pointer Cancellation
- [ ] Click events fire on up-event (not down-event)

**Current Status:**
- ✅ Standard button/link behavior (onClick)

##### 2.5.3 Label in Name
- [ ] Accessible name matches visible label

**Current Status:**
- ⏳ Review all buttons/inputs

##### 2.5.4 Motion Actuation
- N/A (No motion-based input)

---

### 3. Understandable

#### 3.1 Readable

##### 3.1.1 Language of Page
- [ ] Page language is specified

**Current Status:**
- ✅ `<html lang="en">`

##### 3.1.2 Language of Parts
- [ ] Language changes are identified

**Current Status:**
- ✅ All content in English

---

#### 3.2 Predictable

##### 3.2.1 On Focus
- [ ] Receiving focus does not trigger unexpected actions

**Current Status:**
- ✅ No focus-triggered changes

##### 3.2.2 On Input
- [ ] Changing input does not trigger unexpected actions

**Current Status:**
- ⏳ Review form inputs (ensure no auto-submit)

##### 3.2.3 Consistent Navigation
- [ ] Navigation is consistent across pages

**Current Status:**
- ✅ Single-page app (consistent UI)

##### 3.2.4 Consistent Identification
- [ ] Components with same function are identified consistently

**Current Status:**
- ⏳ Review button labels (ensure consistency)

---

#### 3.3 Input Assistance

##### 3.3.1 Error Identification
- [ ] Errors are clearly identified in text

**Current Status:**
- ⏳ Review error messages (ensure descriptive)

##### 3.3.2 Labels or Instructions
- [ ] Labels or instructions are provided

**Current Status:**
- ✅ All form fields have labels
- ⏳ Verify all labels are descriptive

##### 3.3.3 Error Suggestion
- [ ] Suggestions provided for fixing errors

**Current Status:**
- ⏳ Review error messages (add suggestions)

##### 3.3.4 Error Prevention (Legal, Financial, Data)
- [ ] User can review/confirm before submitting

**Current Status:**
- ⏳ Add confirmation for delete actions
- ✅ No legal/financial transactions (just tracking)

---

### 4. Robust

#### 4.1 Compatible

##### 4.1.1 Parsing
- [ ] Valid HTML (no duplicate IDs, proper nesting)

**Test:** W3C Markup Validation Service

##### 4.1.2 Name, Role, Value
- [ ] All UI components have accessible name and role
- [ ] State changes are programmatically determinable

**Current Status:**
- ⏳ Review all custom components
- ⏳ Add ARIA labels where needed

##### 4.1.3 Status Messages
- [ ] Status messages are announced to screen readers

**Current Status:**
- ⏳ Add aria-live for success/error messages

---

## Priority Fixes

### 🔴 High Priority (Blocking)
1. **Aria-labels for icon buttons**
   - Settings button
   - Add Expense button
   - Delete buttons

2. **Contrast ratios**
   - Measure all text
   - Ensure 4.5:1 minimum

3. **Keyboard navigation**
   - Test full page tabbing
   - Ensure modals close with Escape

### 🟠 Medium Priority
4. **Focus indicators**
   - Verify visible on all elements

5. **Error messages**
   - Add descriptive suggestions

6. **Confirmation dialogs**
   - Add for delete actions

### 🟡 Low Priority
7. **Heading hierarchy**
   - Audit h1 → h2 → h3

8. **Form labels**
   - Ensure all are descriptive

---

## Testing Tools

### Automated
- **axe DevTools** (Chrome extension)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools)

### Manual
- **Keyboard-only navigation**
- **Screen reader** (VoiceOver on Mac, NVDA on Windows)
- **Color contrast checker** (WebAIM)

---

## Screen Reader Testing

### VoiceOver (Mac)
```
Cmd + F5: Enable VoiceOver
VO + Right Arrow: Next item
VO + Space: Activate
VO + Shift + Down: Interact with item
```

**Test scenarios:**
1. Navigate entire page
2. Fill out financial settings
3. Add expense
4. Hear runway announcement

### Expected Behavior
- All interactive elements announced
- Form labels read correctly
- Buttons have clear purpose
- Errors announced clearly

---

## Quick Fixes (Can implement now)

### 1. Add aria-labels
```tsx
// Settings button
<button aria-label="Open financial settings" onClick={...}>
  ⚙️
</button>

// Add expense
<button aria-label="Add new expense" onClick={...}>
  + Add Expense
</button>

// Delete
<button aria-label="Delete expense" onClick={...}>
  🗑️
</button>
```

### 2. Add aria-live regions
```tsx
// Success message
<div role="status" aria-live="polite">
  Settings saved successfully
</div>

// Error message
<div role="alert" aria-live="assertive">
  Failed to save: {error}
</div>
```

### 3. Keyboard shortcuts
```tsx
// Close modal with Escape
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowSettings(false);
  };
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, []);
```

---

## Implementation Plan

### Phase 1: Critical Fixes (1-2 hours)
- [ ] Add aria-labels to all icon buttons
- [ ] Test keyboard navigation
- [ ] Add Escape key to close modals
- [ ] Measure contrast ratios
- [ ] Fix any contrast issues

### Phase 2: Improvements (2-3 hours)
- [ ] Add aria-live regions
- [ ] Audit heading hierarchy
- [ ] Add confirmation dialogs
- [ ] Improve error messages

### Phase 3: Testing (1-2 hours)
- [ ] Run axe DevTools
- [ ] Test with screen reader
- [ ] Test keyboard-only
- [ ] Manual accessibility review

---

## Success Criteria

**Level AA Compliance:**
- ✅ All WCAG 2.1 AA criteria met
- ✅ axe DevTools: 0 violations
- ✅ Lighthouse Accessibility: 95+ score
- ✅ Keyboard navigation: 100% functional
- ✅ Screen reader: All content accessible

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

_Created: 2026-02-15 by 어메이징메이_
