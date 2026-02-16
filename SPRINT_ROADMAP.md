# 🚀 4주 스프린트 로드맵

**작성일:** 2026-02-16  
**전략:** 빠른 승리 (Quick Wins)  
**목표:** 평균 5.6/7 → 7.5/7 (+1.9점)  
**최종:** Public Beta 런칭 준비 완료  

---

## 📅 전체 일정

| Week | 날짜 | 기능 | 개발 기간 | 예상 효과 |
|------|------|------|-----------|----------|
| **1** | 2/17-2/21 | i18n 다중언어 (EN/KO) | 5일 | +1.5점 (한국인) |
| **2** | 2/24-2/28 | 시나리오 비교 | 7일 | +1.6점 (75% 유저) |
| **3** | 3/3-3/7 | FIRE Date 계산 | 7일 | +1.7점 (FIRE) |
| **4** | 3/10-3/17 | Phase-based Planning | 10일 | +1.7점 (Sabbatical) |
| **5** | 3/18-3/21 | 통합 테스트 & 런칭 | 4일 | Public Beta |

**총 개발 기간:** 33일 (5주)  
**누적 점수:** 5.6 → 6.8 (Week 2) → 7.2 (Week 3) → 7.5 (Week 4)

---

## 🎯 P0 기능 4개 상세

### Week 1: i18n 다중언어 지원

**📋 스펙:** `specs/P0-1-i18n-multilingual-support.md` (9.2KB)

**목표:**
- 영어 + 한국어 지원
- next-i18next 프레임워크
- 언어 전환 드롭다운
- 숫자/날짜 포맷 현지화

**Deliverables:**
- LanguageSwitcher.tsx
- 5개 번역 파일 (common, auth, dashboard, settings, goals)
- 150-200개 번역 항목

**예상 효과:**
- 한국인 베타 테스터 6명: +1.5점
- 한국 시장 진입 (FIRE 코리아 2만+ 회원)

**자동 시작:** 2026-02-17 09:00 (크론 설정 완료)

---

### Week 2: 시나리오 비교

**📋 스펙:** `specs/P0-2-scenario-comparison.md` (21.3KB)

**목표:**
- 최대 3개 시나리오 생성
- Side-by-side 비교 테이블
- 차트 오버레이 (Recharts)
- Supabase scenarios 테이블

**Deliverables:**
- ScenarioManager.tsx
- ComparisonView.tsx
- RunwayChart.tsx (multi-line)
- scenarios DB 테이블

**예상 효과:**
- 요청자 15/20명 (75%)
- 평균 +1.6점
- "Deal-breaker" 해결 (Sarah, Michael)

**시작일:** 2026-02-24 (Week 1 완료 후)

---

### Week 3: FIRE Date 계산

**📋 스펙:** `specs/P0-3-fire-date-calculator.md` (18.8KB)

**목표:**
- FI Number 계산 (4% rule)
- FI Date 계산 (복리 반영)
- Coast FIRE 계산
- 진행률 시각화

**Deliverables:**
- FIREDashboard.tsx
- fireCalculator.ts (4개 계산 함수)
- FIProgressBar.tsx
- FIProjectionChart.tsx

**예상 효과:**
- FIRE Seeker 4/4명 전원
- 평균 +1.7점
- 한국/글로벌 FIRE 커뮤니티 진입

**시작일:** 2026-03-03 (Week 2 완료 후)

---

### Week 4: Phase-based Planning

**📋 스펙:** `specs/P0-4-phase-based-planning.md` (23.7KB)

**목표:**
- 최대 10개 Phase 생성
- 드래그 앤 드롭 순서 변경
- Phase별 독립 예산
- 타임라인 시각화

**Deliverables:**
- PhaseTimeline.tsx (드래그)
- PhaseCard.tsx
- PhaseTimelineChart.tsx
- phases DB 테이블

**예상 효과:**
- Sabbatical Planner 4/4명 + 추가 6명
- 평균 +1.7점 (가장 높음)
- "필수 기능" (Sofia, Emma)

**시작일:** 2026-03-10 (Week 3 완료 후)

---

## 📊 누적 효과 예측

### 점수 변화 (주차별)

```
 점수 ↑
 7.5 ┤                               ●━━━━━━ Week 4 완료
 7.2 ┤                       ●━━━━━━━┛
 6.8 ┤               ●━━━━━━━┛
 6.0 ┤       ●━━━━━━━┛
 5.6 ┤●━━━━━━┛
 5.0 ┤
     └───┴───┴───┴───┴───┴───┴───┴───┴───┴───→
     현재  W1  W2  W3  W4  Week
```

### 세그먼트별 예상 점수 (Week 4 완료 후)

| 세그먼트 | 현재 | Week 2 | Week 3 | Week 4 | 최종 |
|----------|------|--------|--------|--------|------|
| **Aspiring Founder** | 6.1 | 7.5 | 7.5 | 7.8 | **7.8** |
| **Career Transitioner** | 5.9 | 7.3 | 7.3 | 7.6 | **7.6** |
| **Burnout Escapist** | 5.5 | 7.0 | 7.0 | 7.2 | **7.2** |
| **FIRE Seeker** | 5.3 | 6.5 | 7.8 | 7.8 | **7.8** |
| **Sabbatical Planner** | 5.2 | 6.5 | 6.5 | 7.5 | **7.5** |
| **전체 평균** | **5.6** | **6.9** | **7.2** | **7.6** | **7.6** |

---

## 🎁 보너스 기능 (시간 남으면)

### P1 (선택적)

1. **PDF Export** (2-3일)
   - 요청: 10/20명
   - 우선순위: 중간
   - 시기: Week 4 완료 후 or Week 5

2. **Slider UX 개선** (1일)
   - Input field + Slider 병행
   - 정확한 값 입력 가능

3. **Multi-currency** (3-5일)
   - USD, KRW, EUR, GBP, JPY
   - 환율 API 통합

---

## 📋 주차별 체크리스트

### Week 1 (i18n)
- [ ] Day 1: next-i18next 설치 & 설정
- [ ] Day 2: 번역 파일 작성 (150-200개)
- [ ] Day 3: 컴포넌트 전환
- [ ] Day 4: LanguageSwitcher 구현
- [ ] Day 5: 테스트 & 배포
- [ ] 한국인 베타 테스터 재테스트
- [ ] 점수 향상 확인 (+1.5 이상)

### Week 2 (시나리오 비교)
- [ ] Day 1-2: DB 마이그레이션 & Hook
- [ ] Day 3-4: UI 컴포넌트 (Manager, Card)
- [ ] Day 5-6: Chart & ComparisonView
- [ ] Day 7: 테스트 & 배포
- [ ] 15명 베타 테스터 재테스트
- [ ] 점수 향상 확인 (+1.6 이상)

### Week 3 (FIRE)
- [ ] Day 1-2: 계산 로직 & 테스트 (Excel 대조)
- [ ] Day 3-4: UI 컴포넌트 (Dashboard, Progress)
- [ ] Day 5-6: 통합 & 테스트
- [ ] Day 7: 배포
- [ ] FIRE 베타 테스터 4명 재테스트
- [ ] 점수 향상 확인 (+1.7 이상)

### Week 4 (Phase Planning)
- [ ] Day 1-3: DB & Hook (드래그 앤 드롭)
- [ ] Day 4-7: UI 컴포넌트 (Timeline, Card, Chart)
- [ ] Day 8-10: 통합, 테스트, 배포
- [ ] Sabbatical 베타 테스터 4명 재테스트
- [ ] 점수 향상 확인 (+1.7 이상)

### Week 5 (통합 & 런칭)
- [ ] 전체 QA (Playwright E2E)
- [ ] 성능 최적화 (Lighthouse >90)
- [ ] 문서 최종 업데이트
- [ ] 베타 테스터 20명 전체 재테스트
- [ ] 평균 점수 7.5+ 확인
- [ ] Public Beta 런칭 결정

---

## 🚨 리스크 & 완화 전략

### 리스크 1: 개발 지연
**완화:**
- 각 주마다 2일 버퍼 (5일 → 7일)
- P1 기능은 선택적 (시간 없으면 Phase 2)

### 리스크 2: 예상 효과 미달
**완화:**
- Week 2 후 중간 점검
- 베타 테스터 피드백 즉시 반영

### 리스크 3: 기술적 블로킹
**완화:**
- 스펙 상세 (70KB+)
- CLAUDE.md 원칙 준수
- Amazing May 즉시 지원

---

## 📞 커뮤니케이션 프로토콜

### 일일 보고 (EOD)
- 오늘 완료 항목
- 내일 계획
- 블로커 유무

### 주간 보고 (금요일)
- Week X 완료 요약
- 베타 테스터 점수
- Week X+1 준비 상태

### 긴급 에스컬레이션
- 2일 이상 블로킹 시
- 예상 효과 미달 시
- 기술적 불가능 발견 시

---

## 🎯 성공 지표

### 정량적
- [x] 평균 점수: 5.6 → 7.5 (+1.9)
- [x] NPS: 7.5 → 9.0 (+1.5)
- [x] 유료 전환 의향: 85% → 95%

### 정성적
- [x] "Deal-breaker 해결" (Sarah, Michael)
- [x] "Excel 대체 가능" (FIRE 커뮤니티)
- [x] "필수 도구" (Sabbatical Planner)

### 시장 진입
- [x] 한국 시장 (FIRE 코리아 2만+)
- [x] r/financialindependence (2.4M)
- [x] Expat FIRE (1.5M)

---

## 🎉 Week 5: Public Beta 런칭

### 준비 사항
1. **마케팅 자료**
   - Reddit 5개 포스트 (이미 작성 완료)
   - Twitter 7개 스레드 (완료)
   - Product Hunt 가이드 (완료)

2. **베타 테스터 모집**
   - 목표: 50-100명
   - 채널: Reddit, HackerNews, Twitter
   - 기간: 2주

3. **모니터링**
   - Vercel Analytics
   - Sentry (에러 추적)
   - User feedback 폼

4. **지원 채널**
   - Discord 커뮤니티
   - Email 지원
   - 1:1 온보딩 (처음 10명)

---

**작성자:** Amazing May  
**최종 수정:** 2026-02-16  
**상태:** ✅ 승인 완료  

**개발 시작:** 2026-02-17 (내일!)  
**목표 완료:** 2026-03-21 (5주 후)  

🚀 **Let's ship it and change lives!**
