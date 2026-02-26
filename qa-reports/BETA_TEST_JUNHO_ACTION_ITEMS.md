# ⚡ Action Items: 창업가 페르소나 피드백

**출처:** 최준호 베타 테스트 (2026-02-23)  
**우선순위:** P0 (출시 전) → P1 (출시 후 1개월) → P2 (Future)

---

## 🔴 P0 - 출시 전 필수 (Critical)

### 1. 시나리오 비교 기능
**Why:** 창업가는 "What-if" 질문 필수. 없으면 재방문 안 함.  
**How:**
```tsx
// 컴포넌트 구조 제안
<ScenarioComparison
  balance={25000000}
  monthlyExpenses={4500000}
  scenarios={[
    { name: '현재', adjustment: 0 },
    { name: '절약 (-10%)', adjustment: -0.1 },
    { name: '절약 (-20%)', adjustment: -0.2 },
    { name: '최악 (+20%)', adjustment: 0.2 },
  ]}
/>

// 출력:
📊 시나리오 비교
현재 (₩4,500,000)     → 5.6개월 🟡
절약 -10%             → 6.2개월 ✅
절약 -20%             → 6.9개월 🎯
최악 +20%             → 4.6개월 🔴
```

**파일:**
- `app/components/ScenarioComparison.tsx` (새 파일)
- `lib/calculations/runway.ts` (calculateScenario 함수 추가)

**예상 시간:** 4시간  
**영향도:** ⭐⭐⭐⭐⭐ (만족도 6/10 → 9/10)

---

### 2. 목표일 설정 & 역산
**Why:** "6개월 안에 투자"처럼 목표가 있을 때 역산 필요.  
**How:**
```tsx
<GoalSetting
  currentRunway={5.6}
  targetMonths={6}
  monthlyExpenses={4500000}
/>

// 출력:
🎯 목표 설정
목표일: [6개월 후] (2026-08-23)
현재: 5.6개월
차이: -0.4개월 ⚠️ 부족

💡 제안:
✅ 지출 8% 절감 (₩360,000) → 목표 달성
✅ 브릿지 펀딩 ₩5,000,000 → 안전권
```

**파일:**
- `app/components/GoalSetting.tsx` (새 파일)
- `lib/stores/runwayStore.ts` (goal 상태 추가)

**예상 시간:** 3시간  
**영향도:** ⭐⭐⭐⭐⭐

---

### 3. 데이터 수정 플로우
**Why:** 온보딩 후 데이터 수정 방법 불명확.  
**How:**
```tsx
// Dashboard에 버튼 추가
<button onClick={() => router.push('/settings')}>
  ⚙️ 설정 수정
</button>

// 또는 온보딩 재진입
<button onClick={() => router.push('/onboarding?edit=true')}>
  ✏️ 데이터 수정
</button>
```

**파일:**
- `app/components/RunwayDashboard.tsx` (버튼 추가)
- `app/onboarding/page.tsx` (edit 모드 지원)

**예상 시간:** 2시간  
**영향도:** ⭐⭐⭐⭐

---

## 🟡 P1 - 출시 후 1개월 (High Priority)

### 4. 지출 상세 분석
**Why:** "어디를 줄일까?" 질문에 답 필요.  
**How:**
```tsx
<ExpenseBreakdown
  categories={[
    { name: '사무실', amount: 1500000, flexible: false },
    { name: '인건비', amount: 2000000, flexible: false },
    { name: '마케팅', amount: 500000, flexible: true },
    { name: '소프트웨어', amount: 300000, flexible: true },
    { name: '기타', amount: 200000, flexible: true },
  ]}
/>

// 출력:
📝 지출 내역
고정: ₩3,500,000 (78%)
변동: ₩1,000,000 (22%) ← 절감 가능

💡 변동 지출 50% 절감 시 → +1.1개월
```

**파일:**
- `app/components/ExpenseBreakdown.tsx` (새 파일)
- `app/onboarding/Step3Expenses.tsx` (카테고리 입력 추가)
- `lib/stores/runwayStore.ts` (categories 상태 추가)

**예상 시간:** 6시간  
**영향도:** ⭐⭐⭐⭐

---

### 5. 스타트업 특화 지표
**Why:** 창업가는 일반인과 다른 지표 필요.  
**How:**
```tsx
<StartupMetrics
  mrr={0}
  targetMRR={5000000}
  burnRate={4500000}
  cac={0}
/>

// 출력:
📈 스타트업 지표
월간 번레이트: ₩4,500,000
MRR: ₩0 → 목표 ₩5,000,000
브레이크이븐까지: Infinite

💡 MRR ₩4,500,000 달성 시 런웨이 무한
```

**파일:**
- `app/components/StartupMetrics.tsx` (새 파일)
- `lib/calculations/startup.ts` (새 파일)

**예상 시간:** 4시간  
**영향도:** ⭐⭐⭐⭐

---

### 6. 주간 리포트 & 알림
**Why:** 정기적 체크 유도, 위험 조기 경고.  
**How:**
```tsx
<WeeklyReport
  enabled={true}
  dayOfWeek="monday"
  emailOrNotification="notification"
/>

// 예시 알림:
📊 런웨이 업데이트 (2월 4주차)
현재: 4.8개월 (-0.8개월) ⚠️
이번 주 지출: ₩1,200,000 (예상 대비 +10%)

💡 경고: 2주 연속 지출 증가
```

**파일:**
- `app/components/WeeklyReport.tsx` (새 파일)
- `lib/utils/notifications.ts` (새 파일)
- Web Notifications API 또는 localStorage 기반 알림

**예상 시간:** 5시간  
**영향도:** ⭐⭐⭐⭐

---

## 🔵 P2 - Future (Nice to Have)

### 7. 팀 공유 기능
**Why:** 공동창업자/CFO와 데이터 공유.  
**How:**
- QR 코드 생성
- 링크 공유 (읽기 전용)
- 댓글/메모 기능

**예상 시간:** 8시간  
**영향도:** ⭐⭐⭐

---

### 8. 캘린더 통합
**Why:** 마일스톤 자동 등록, 알림.  
**How:**
- Google Calendar API 연동
- "런웨이 2개월 남음" 이벤트 자동 생성
- D-Day 카운트다운

**예상 시간:** 6시간  
**영향도:** ⭐⭐⭐

---

### 9. 산업 벤치마크
**Why:** "나만 이러나?" 불안감 해소.  
**How:**
```tsx
<Benchmark
  industry="AI Startup"
  stage="Pre-seed"
/>

// 출력:
📊 AI 스타트업 평균 (Pre-seed)
평균 런웨이: 8개월
당신: 5.6개월 (30% 낮음) ⚠️

평균 번레이트: ₩5,200,000
당신: ₩4,500,000 (13% 낮음) ✅

투자 유치 소요 시간: 4-6개월
```

**예상 시간:** 10시간 (데이터 수집 포함)  
**영향도:** ⭐⭐⭐

---

## 🐛 버그 수정

### B1. 브라우저 자동화 타임아웃
**우선순위:** P2 (수동 테스트 가능)  
**재현:** 100%  
**영향:** QA 자동화만 영향  
**해결:** OpenClaw gateway 설정 확인

---

### B2. 입력 검증 강화
**우선순위:** P1  
**추가 필요:**
- 음수 입력 방지
- 비현실적 값 경고 (예: ₩1,000,000,000)
- 0원 입력 시 안내 메시지

**파일:**
- `app/components/Onboarding/Step2Assets.tsx`
- `app/components/Onboarding/Step3Expenses.tsx`

---

## 📊 예상 영향도

| 기능 | 개발 시간 | 만족도 향상 | ROI |
|------|----------|------------|-----|
| 시나리오 비교 | 4h | +3 | ⭐⭐⭐⭐⭐ |
| 목표 설정 | 3h | +2 | ⭐⭐⭐⭐⭐ |
| 데이터 수정 | 2h | +1 | ⭐⭐⭐⭐ |
| 지출 분석 | 6h | +1 | ⭐⭐⭐⭐ |
| 스타트업 지표 | 4h | +2 | ⭐⭐⭐⭐ |
| 주간 리포트 | 5h | +1 | ⭐⭐⭐⭐ |

**총 예상 시간 (P0+P1):** 24시간 (3 work days)  
**예상 만족도:** 7/10 → 9/10

---

## 🎯 Quick Wins (1시간 이내)

### QW1. "곧 출시 예정" 메시지 개선
```tsx
// Before:
"시나리오 분석, 데이터 내보내기, 목표 설정 등
더 많은 기능이 곧 추가됩니다."

// After:
🗓️ 2월 말 출시 예정:
✅ 시나리오 비교 (지출 ±30% 시뮬레이션)
✅ 목표일 설정 ("6개월 후 투자 유치")
✅ 주간 리포트 & 알림

📧 출시 알림 받기: [이메일 입력]
```

---

### QW2. 격려 메시지 개선
```tsx
// Before:
"타이트하지만 계획이 있다면 충분히 가능합니다!"

// After (시나리오 추가 전):
"타이트하지만 계획이 있다면 충분히 가능합니다!

💡 Tip: 지출 10% 절감 시 목표 달성 가능
(곧 출시될 '시나리오 분석' 기능으로 확인하세요)"
```

---

### QW3. Dashboard 헤더에 "베타" 뱃지
```tsx
<h1>
  Personal Runway Calculator
  <span className="beta-badge">BETA</span>
</h1>
```

---

## 📝 개발 순서 제안

### Week 1 (P0):
1. 시나리오 비교 UI (4h)
2. 목표 설정 기능 (3h)
3. 데이터 수정 플로우 (2h)
4. Quick Wins (1h)
**Total: 10h**

### Week 2 (P1):
1. 지출 상세 분석 (6h)
2. 스타트업 특화 지표 (4h)
3. 주간 리포트 (5h)
4. 입력 검증 강화 (2h)
**Total: 17h**

### Week 3+ (P2):
1. 팀 공유 기능 (8h)
2. 캘린더 통합 (6h)
3. 산업 벤치마크 (10h)
**Total: 24h**

---

## ✅ 체크리스트

### P0 출시 전:
- [ ] 시나리오 비교 기능
- [ ] 목표일 설정
- [ ] 데이터 수정 플로우
- [ ] Quick Wins 3가지

### P1 출시 후 1개월:
- [ ] 지출 상세 분석
- [ ] 스타트업 특화 지표
- [ ] 주간 리포트
- [ ] 입력 검증 강화

### QA:
- [ ] 모바일 터치 UX 검증
- [ ] 시나리오 계산 정확도 테스트
- [ ] 목표일 역산 로직 검증
- [ ] 브라우저 호환성 테스트

---

**작성자:** QA Subagent  
**기반:** 최준호 (창업가) 베타 테스트  
**우선순위 기준:** 사용자 만족도 향상 + 재방문율 + 개발 시간
