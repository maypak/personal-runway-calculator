# Week 2 P0-2 Scenario Comparison - Testing Checklist

**Created:** 2026-02-21 09:00 AM KST  
**Feature:** Scenario Comparison (CRUD + Comparison Mode)  
**Priority:** P0 (Week 2)

---

## 🧪 Phase 2: Integration Tests

### Basic CRUD Operations

#### 1. Create Scenario ✅
**Test Steps:**
1. Navigate to `/scenarios`
2. Click "New Scenario" button
3. Enter name: "Test Scenario"
4. Click "Create Scenario"

**Expected:**
- ✅ Scenario created from current financial settings
- ✅ Appears in grid
- ✅ Shows runway calculation
- ✅ Shows financial stats

**Status:** [ ]

---

#### 2. Duplicate Scenario
**Test Steps:**
1. Click "Duplicate" (Copy icon) on existing scenario
2. Enter new name: "Test Copy"
3. Confirm

**Expected:**
- ✅ New scenario created with same values
- ✅ Different name
- ✅ Same runway calculation

**Status:** [ ]

---

#### 3. Delete Scenario
**Test Steps:**
1. Click "Delete" (Trash icon) on non-base scenario
2. Confirm deletion

**Expected:**
- ✅ Confirmation dialog appears
- ✅ Scenario removed from list
- ✅ Cannot delete base scenario

**Status:** [ ]

---

#### 4. Edit Scenario (Future)
**Note:** Edit functionality not yet implemented
**Expected:** Modal with editable fields

**Status:** [ ] Not Implemented

---

### Comparison Mode

#### 5. Toggle Comparison Mode
**Test Steps:**
1. Have at least 2 scenarios
2. Click "Compare" button

**Expected:**
- ✅ Button changes to "Exit Compare"
- ✅ First 2 scenarios auto-selected
- ✅ Selection visual feedback (border)
- ✅ Comparison placeholder appears

**Status:** [ ]

---

#### 6. Select Scenarios for Comparison
**Test Steps:**
1. Enter comparison mode
2. Click on different scenario cards

**Expected:**
- ✅ Selected scenarios highlighted
- ✅ Max 3 scenarios selectable
- ✅ Comparison view updates

**Status:** [ ]

---

### Data Persistence

#### 7. Page Refresh
**Test Steps:**
1. Create 2-3 scenarios
2. Refresh page (Cmd+R)

**Expected:**
- ✅ All scenarios persist
- ✅ Loaded in correct order (base first)
- ✅ Calculations remain accurate

**Status:** [ ]

---

#### 8. Logout/Login
**Test Steps:**
1. Create scenarios
2. Logout
3. Login again

**Expected:**
- ✅ Scenarios still exist
- ✅ No duplicate scenarios
- ✅ RLS enforced (can only see own scenarios)

**Status:** [ ]

---

### Edge Cases

#### 9. Empty State
**Test Steps:**
1. Fresh account (no scenarios)
2. Visit `/scenarios`

**Expected:**
- ✅ Empty state message
- ✅ "Create First Scenario" button
- ✅ "Use Current Settings" button

**Status:** [ ]

---

#### 10. Zero Savings
**Test Steps:**
1. Create scenario with $0 savings
2. Create scenario with $0 expenses

**Expected:**
- ✅ $0 savings: 0 months runway
- ✅ $0 expenses: Infinite runway (999 months)
- ✅ No division errors

**Status:** [ ]

---

#### 11. Negative Burn Rate (Surplus)
**Test Steps:**
1. Create scenario where income > expenses

**Expected:**
- ✅ Burn rate shows as positive (green)
- ✅ TrendingUp icon displayed
- ✅ Infinite runway

**Status:** [ ]

---

#### 12. Very Large Numbers
**Test Steps:**
1. Enter $1,000,000 savings
2. Enter $50,000 monthly expenses

**Expected:**
- ✅ Calculations accurate
- ✅ Currency formatting correct (commas)
- ✅ No overflow errors

**Status:** [ ]

---

### Mobile Responsiveness

#### 13. Mobile View (375px)
**Test Steps:**
1. Resize browser to mobile width
2. Interact with all features

**Expected:**
- ✅ Grid becomes single column
- ✅ Buttons remain clickable (44px+)
- ✅ Modal fits screen
- ✅ No horizontal scroll

**Status:** [ ]

---

#### 14. Tablet View (768px)
**Test Steps:**
1. Resize to tablet width

**Expected:**
- ✅ 2-column grid
- ✅ All features accessible

**Status:** [ ]

---

### Performance

#### 15. 10 Scenarios
**Test Steps:**
1. Create 10 scenarios
2. Measure load time

**Expected:**
- ✅ Loads in <2 seconds
- ✅ No lag when scrolling
- ✅ No console errors

**Status:** [ ]

---

#### 16. Rapid Creates
**Test Steps:**
1. Click "New Scenario" 5 times rapidly
2. Submit all

**Expected:**
- ✅ All 5 created successfully
- ✅ No duplicate scenarios
- ✅ No race conditions

**Status:** [ ]

---

### Error Handling

#### 17. Network Offline
**Test Steps:**
1. Turn off network
2. Try creating scenario

**Expected:**
- ✅ Error message displayed
- ✅ User-friendly text (not "NetworkError")
- ✅ Data not lost

**Status:** [ ]

---

#### 18. Invalid Name
**Test Steps:**
1. Create scenario with empty name
2. Create scenario with 200-char name

**Expected:**
- ✅ Empty name: validation error
- ✅ Long name: truncated or rejected
- ✅ Clear error message

**Status:** [ ]

---

#### 19. Duplicate Name
**Test Steps:**
1. Create scenario "Test"
2. Create another scenario "Test"

**Expected:**
- ✅ Either allowed (with warning) or prevented
- ✅ Clear feedback

**Status:** [ ]

---

### Security (RLS)

#### 20. User Isolation
**Test Steps:**
1. Create scenarios as User A
2. Login as User B

**Expected:**
- ✅ User B cannot see User A's scenarios
- ✅ No leaked data in API

**Status:** [ ]

---

#### 21. Base Scenario Protection
**Test Steps:**
1. Try deleting base scenario

**Expected:**
- ✅ Delete button disabled OR
- ✅ Error message: "Cannot delete base scenario"

**Status:** [ ]

---

## 📊 Test Results Summary

**Total Tests:** 21  
**Passed:** ___ / 21  
**Failed:** ___ / 21  
**Skipped:** ___ / 21

**Critical Failures:** [ ]  
**Minor Issues:** [ ]

---

## 🐛 Bugs Found

### Bug #1:
**Severity:** [ ] Critical [ ] Major [ ] Minor  
**Description:**  
**Steps to Reproduce:**  
**Expected vs Actual:**  
**Fix:**

---

## ✅ Sign-off

**Tested By:**  
**Date:**  
**Status:** [ ] Pass [ ] Fail [ ] Conditional Pass

**Ready for Production:** [ ] Yes [ ] No

**Notes:**
