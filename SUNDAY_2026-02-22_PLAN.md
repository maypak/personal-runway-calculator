# 일요일(2/22) 할 일 플랜

**작성:** 2026-02-22 00:02 (어메이징메이)  
**출처:** 7개 스쿼드 베타 피드백 분석 종합  
**베이스:** BETA_RETEST_RESULTS_V2.md (20명, 70/30 분포)

---

## 📊 Executive Summary

**현재 상태:**
- 베타 평균: 2.5/7 → **4-5/7 예상** (P0 수정 후)
- PMF 검증: 타겟 사용자 +0.81, 잘못된 사용자 -1.0 (건강함)
- 런칭 준비도: **90%** (블로커 1개만)

**일요일 목표:**
- **블로커 제거:** FIRE 메시징 혼란 해결
- **Quick Wins 3개:** 툴팁, 온보딩, 한국 시장
- **예상 시간:** 8-12시간 (코어 6시간 + 옵션 2-6시간)

---

## 🎯 P0 블로커 (반드시 수정)

### 1. FIRE 메시징 혼란 해결 ⚠️ **CRITICAL**

**문제:**
- 기능은 존재 (FI Number, Coast FIRE, 4% rule)
- README는 "NOT a FIRE calculator, use FIRECalc"
- 사용자 혼란: "있는데 쓰지 말라고?" (3명)

**해결책:**
```markdown
## FIRE Calculator: Quick Checks vs Serious Planning

Perfect for:
- ✅ Quick FI number ("How much to retire?")
- ✅ Coast FIRE ("Can I stop saving?")
- ✅ 1-2 year FIRE runway

NOT for:
- ❌ 30-year Monte Carlo simulations
- ❌ Inflation modeling
- ❌ Tax optimization

For serious planning → Use FIRECalc
We're your "FIRE quick check", FIRECalc is your "FIRE comprehensive planner"
```

**액션:**
- [ ] README.md 업데이트 (30분)
- [ ] FIRE Calculator UI에 동일 메시지 추가 (30분)
- [ ] QA 검증 - 메시징 일관성 (30분)

**담당:** Technical Writer + Developer  
**예상 시간:** 1.5시간  
**영향:** 3명 FIRE 페르소나 혼란 해소 → +0.5-1.0 예상

---

## ⚡ Quick Wins (높은 영향, 낮은 노력)

### 2. 전문용어 툴팁 추가 🎓

**문제:**
- "Coast FIRE가 뭐지? 설명이 없어" (초보자 -1.0, 캐주얼 -0.5)
- Burn rate, Scenario, Phase 등 설명 부재

**해결책:**
- 모든 전문용어에 `<InfoTooltip>` 추가
- 용어: Coast FIRE, Burn rate, FI Number, 4% Rule, Scenario, Phase
- Shadcn Tooltip 컴포넌트 사용

**액션:**
- [ ] `src/components/ui/Tooltip.tsx` 생성 (30min)
- [ ] FIRE Calculator에 툴팁 추가 (45min)
- [ ] Dashboard burn rate 툴팁 (15min)
- [ ] Scenarios/Phases 툴팁 (30min)

**담당:** Developer  
**예상 시간:** 2-3시간  
**영향:** 초보자 3.5 → 4.5, 캐주얼 5.5 → 6.0 예상

---

### 3. "What is Runway?" 첫 사용자 가이드 강화 📘

**문제:**
- 기존 툴팁 있지만 충분하지 않음
- 첫 방문자 "뭘 해야 하지?" 혼란

**해결책:**
- Dashboard 상단에 dismissible "New User Guide" 카드
- LocalStorage 플래그로 1회만 표시
- 핵심 3단계 안내: 1) 저축 입력 → 2) 지출 입력 → 3) 런웨이 확인

**액션:**
- [ ] `NewUserGuide.tsx` 컴포넌트 생성 (60min)
- [ ] Dashboard에 통합 (30min)
- [ ] LocalStorage 플래그 (30min)

**담당:** Developer + UX Designer  
**예상 시간:** 2시간  
**영향:** 초보자 온보딩 완료율 +30% 예상

---

### 4. 한국 시장 모니터링 & 런칭 준비 🇰🇷

**기회:**
- FIRE Korea 카페: 2만명 잠재 사용자
- 한국 페르소나 +0.75 평균 개선
- 명시적 공유 의향: "카페에 공유하겠어요"
- 지불 의향: ₩10-15K/월

**P0 액션 (런칭 전 필수):**
- [ ] 한국어 i18n 전체 페이지 검증 (90min)
  - 모든 페이지 한국어로 전환 후 스크린샷
  - 오타, 번역 이상함 체크
  - 영어 섞임 제거
  
- [ ] 한국 시장 모니터링 설정 (2-3h)
  - Vercel Analytics에 `locale:ko-KR` 태그 추가
  - 에러 로깅에 locale 정보 포함
  - 온보딩 완료율 퍼널 (목표 >70%)
  
- [ ] 한국 시장 런칭 전략 문서 (1h)
  - FIRE Korea 카페 포스트 초안 (한국어)
  - 타겟: 프리랜서, 창업자, FIRE 추구자
  - 메시징: "변동 소득 전용 런웨이 계산기"

**담당:** QA (i18n 검증), DevOps (모니터링), Product Strategist (전략)  
**예상 시간:** 4.5-5.5시간  
**영향:** 500명 가입 @ 2.5% 전환 = ₩5M/월 수익 잠재

---

## 📋 P1 (중요하지만 Phase 3 가능)

### 5. Progressive Disclosure / Simple Mode

**문제:**
- 기능 과부하: FIRE, Phases, Scenarios 동시 표시
- 초보자/캐주얼 사용자 overwhelmed

**해결책:**
- Settings에 "Simple Mode" 토글 추가
- Simple Mode = Dashboard만 표시 (FIRE/Phases/Scenarios 숨김)
- "Enable Advanced Features" CTA로 점진적 공개

**예상 시간:** 6-8시간 (Phase 3)  
**영향:** 초보자 유지율 +40% 예상

---

### 6. CSV Import (Expenses)

**문제:**
- Mint 난민: "수동 입력 너무 귀찮아" (-0.5)
- 은행 statement CSV 가져오기 원함

**해결책:**
- CSV 파일 업로드 → 자동 파싱 → 지출 카테고리 매핑
- 지원 포맷: Mint, YNAB, 일반 CSV

**예상 시간:** 8-10시간 (Phase 3)  
**영향:** Mint 난민 전환율 +50%

---

## 🚀 일요일 실행 플랜 (우선순위)

### Option A: 코어만 (6시간)

**목표:** 런칭 블로커 제거 + 최소 Quick Wins

1. FIRE 메시징 (1.5h) ⭐ **블로커**
2. 툴팁 추가 (2-3h) ⭐ **Quick Win**
3. Runway 가이드 (2h) ⭐ **Quick Win**

**완료 시:** 런칭 가능, 초보자 경험 개선

---

### Option B: 코어 + 한국 시장 (10-12시간) ⭐ **추천**

**목표:** 런칭 + 한국 시장 진입

1. FIRE 메시징 (1.5h) ⭐ **블로커**
2. 툴팁 (2-3h) ⭐ **Quick Win**
3. Runway 가이드 (2h) ⭐ **Quick Win**
4. **한국 i18n 검증 (1.5h)** 🇰🇷
5. **한국 모니터링 (2-3h)** 🇰🇷
6. **한국 런칭 전략 (1h)** 🇰🇷

**완료 시:** 런칭 + 2만명 시장 진입 준비

---

### Option C: 풀 스택 (16-20시간)

**목표:** 런칭 + 한국 + Progressive Disclosure

- Option B (10-12h)
- Simple Mode (6-8h)

**완료 시:** 런칭 + 초보자 유지율 극대화

---

## 📊 예상 영향 (Option B 기준)

**베타 점수 변화:**

| 페르소나 | 현재 | 예상 (P0 후) | 변화 | 주요 개선 |
|---------|------|-------------|------|----------|
| 초보자 | 3.5/7 | **4.5-5/7** | +1.0-1.5 | 툴팁, 가이드 |
| 캐주얼 | 5.5/7 | **6/7** | +0.5 | 툴팁 |
| FIRE expert | 1/7 | **2/7** | +1.0 | 메시징 명확화 |
| 박준영 (KR) | 6/7 | **6.5-7/7** | +0.5-1.0 | 메시징 + i18n |
| Jenny (FIRE) | 5.5/7 | **6-6.5/7** | +0.5-1.0 | 메시징 |

**종합:**
- 평균: 2.5 → **4.5-5.5/7** (+2.0-3.0)
- 런칭 준비도: 90% → **100%** ✅
- 한국 시장: 0 → **2만명 진입** 🇰🇷

---

## 🎯 성공 지표

**일요일 종료 시:**
- [ ] FIRE 메시징 혼란 0건
- [ ] 전문용어 툴팁 6개 이상
- [ ] 첫 사용자 가이드 카드 추가
- [ ] 한국어 전체 페이지 검증 완료
- [ ] 한국 시장 모니터링 설치
- [ ] FIRE Korea 카페 포스트 초안 준비

**월요일 (2/24) 베타 런칭:**
- 타겟: 100명 가입 (일반 50 + 한국 50)
- 예상 전환율: 15-25% (Trial 모델)
- 예상 MRR: ₩750K-1.25M ($600-1K)

---

## 💡 스쿼드 할당 (Option B)

| 담당 | 작업 | 시간 |
|------|------|------|
| **Technical Writer** | FIRE 메시징 재작성 | 1h |
| **Developer** | FIRE UI 메시지 + 툴팁 6개 + Runway 가이드 | 5-6h |
| **QA** | 한국어 i18n 검증 | 1.5h |
| **DevOps** | 한국 시장 모니터링 | 2-3h |
| **Product Strategist** | 한국 런칭 전략 문서 | 1h |

**총 예상:** 10.5-12.5시간

---

## 🔥 치명적 리스크 & 완화

### Risk 1: FIRE 메시징 또 혼란

**리스크:** README 수정했지만 UI 안 했거나, 또 다른 곳에서 모순
**완화:** QA가 전체 메시징 일관성 감사 (30분)

### Risk 2: 한국어 번역 이상함

**리스크:** 자동 번역 티 남, 오타, 어색함
**완화:** QA가 전체 페이지 스크린샷 + 검증 (1.5h)

### Risk 3: 툴팁 너무 많아서 UI 지저분

**리스크:** 6개 툴팁 = info 아이콘 범람
**완화:** UX Designer 승인 후 진행, 필요시 대안 (inline help text)

---

## 📝 메이님께 질문

**Q1: Option A/B/C 중 어느 것?**
- A: 코어만 (6h) - 빠른 런칭
- B: 코어 + 한국 (10-12h) - 추천 ⭐
- C: 풀 (16-20h) - Simple Mode 포함

**Q2: 일요일 작업 시간?**
- 오전 9시 시작?
- 저녁까지 (8-12시간)?
- 밤샘? (16-20시간)

**Q3: 월요일 베타 런칭 확정?**
- 일요일 작업 완료 후 월요일 9AM 런칭?
- 아니면 수요일로 연기?

---

**작성:** 어메이징메이  
**시간:** 2026-02-22 00:02  
**다음 단계:** 메이님 승인 후 즉시 실행

---

## 📚 참고 문서

- `BETA_RETEST_RESULTS_V2.md` - 20명 베타 피드백
- `squad-feedback/developer-action-items.md` - 14개 기술 액션
- `squad-feedback/qa-action-items.md` - 테스트 시나리오
- `research/ux-trends-2026.md` - UX 트렌드 인사이트
- `research/freemium-monetization-2026-02-21.md` - 수익화 전략

**스쿼드 리포트:** 7개 완료 (일부 파일 누락, 메시지 내용 반영)
