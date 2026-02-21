# ANALYST_GUIDE.md - Analyst를 위한 완벽한 가이드

## 🎯 Analyst의 역할

데이터를 분석하고, 인사이트를 도출하고, 의사결정을 지원하는 **데이터 전문가**.

---

## 📊 데이터 분석 프로세스

### 1. 질문 정의 (10분)
```markdown
무엇을 알고 싶은가?
- 사용자 행동: "어떤 기능을 가장 많이 쓰나?"
- 성능: "어디서 이탈하나?"
- 비즈니스: "전환율은?"
- 기술: "어떤 에러가 많나?"
```

### 2. 데이터 수집 (20분)
```markdown
**Supabase (사용자 데이터):**
- scenarios 테이블: 시나리오 생성/편집
- financial_settings: 재무 정보
- user_preferences: 사용자 설정
- auth.users: 가입/로그인

**Vercel Analytics (행동 데이터):**
- Page Views
- Unique Visitors
- Bounce Rate
- Session Duration

**Logs (에러 데이터):**
- Vercel Logs: 런타임 에러
- Supabase Logs: DB 에러
- Browser Console: Frontend 에러
```

### 3. 데이터 분석 (40min)
```markdown
**기본 통계:**
- 평균, 중앙값, 표준편차
- 백분위수 (P50, P90, P99)

**시계열 분석:**
- 일별/주별/월별 트렌드
- 증가/감소율

**세그먼트 분석:**
- 신규 vs 기존 사용자
- 모바일 vs 데스크톱
- 국가별, 브라우저별

**퍼널 분석:**
- 가입 → 온보딩 → 첫 시나리오 → 비교 모드
- 각 단계 전환율
```

### 4. 인사이트 도출 (30분)
```markdown
**패턴 발견:**
- "시나리오 생성 완료율 60% (낮음)"
- "온보딩 5분 이상 → 70% 이탈"
- "모바일 사용자 40%인데 비교 기능 사용 10%"

**원인 추정:**
- 가설: "온보딩이 너무 길어서 이탈"
- 데이터: 5분 이상 소요 시 이탈률 2배
- 결론: 온보딩 간소화 필요

**액션 아이템:**
- P0: 온보딩 3분 이내로 단축
- P1: 모바일 비교 UI 개선
- P2: 이탈 사용자 이메일 리마인더
```

### 5. 리포트 작성 (20분)
```markdown
**구조:**
1. 요약 (Executive Summary)
2. 질문 (Research Question)
3. 데이터 (Data Sources)
4. 분석 (Analysis)
5. 인사이트 (Key Findings)
6. 권장 사항 (Recommendations)
```

---

## 🔍 Supabase 데이터 분석

### SQL 쿼리 예시
```sql
-- 일별 시나리오 생성 수
SELECT 
  DATE(created_at) as date,
  COUNT(*) as scenarios_created
FROM scenarios
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;

-- 사용자당 평균 시나리오 수
SELECT 
  AVG(scenario_count) as avg_scenarios_per_user
FROM (
  SELECT user_id, COUNT(*) as scenario_count
  FROM scenarios
  GROUP BY user_id
) t;

-- 가장 많이 편집되는 시나리오
SELECT 
  id, name, edit_count,
  EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600 as hours_since_creation
FROM scenarios
ORDER BY edit_count DESC
LIMIT 10;

-- 온보딩 완료율
SELECT 
  COUNT(DISTINCT user_id) FILTER (WHERE onboarding_completed_at IS NOT NULL) * 100.0 / 
  COUNT(DISTINCT user_id) as completion_rate
FROM financial_settings;
```

### 데이터 추출 & 시각화
```markdown
1. Supabase Dashboard → SQL Editor
2. 쿼리 실행
3. Export CSV
4. 시각화 (추천 도구):
   - Google Sheets (간단)
   - Excel (중간)
   - Python/Jupyter (고급)
```

---

## 📈 주요 메트릭 (KPI)

### 사용자 메트릭
```markdown
**Acquisition (획득):**
- 신규 가입자 수
- 가입 전환율 (방문자 → 가입자)

**Activation (활성화):**
- 온보딩 완료율
- 첫 시나리오 생성율

**Retention (리텐션):**
- D1, D7, D30 리텐션
- MAU (Monthly Active Users)

**Revenue (수익):**
- Premium 전환율
- ARPU (Average Revenue Per User)

**Referral (추천):**
- 공유 기능 사용률
- 바이럴 계수 (K-factor)
```

### 기능 메트릭
```markdown
**시나리오 비교:**
- 생성된 시나리오 수
- 비교 모드 사용률
- 시나리오당 평균 편집 횟수

**온보딩:**
- 완료 시간 (P50, P90)
- 완료율
- 드롭오프 단계 (어디서 이탈?)

**성능:**
- Page Load Time (P50, P95)
- Time to Interactive
- Error Rate
```

---

## 🚨 흔한 분석 실수

### ❌ 하지 말 것

1. **샘플 크기 무시**
   ```markdown
   ❌ "2명이 사용했는데 50% 전환율!"
   ✅ "100명 중 50명 전환 (신뢰 구간: 40-60%)"
   ```

2. **상관관계 = 인과관계**
   ```markdown
   ❌ "Premium 사용자가 시나리오 많이 만듦 → Premium이 원인"
   ✅ "상관관계 있음. 하지만 Power User가 Premium 가입했을 수도"
   ```

3. **평균의 함정**
   ```markdown
   ❌ "평균 로딩 시간 2초 (만족스러움)"
   ✅ "P50: 1초, P95: 10초 → 5% 사용자는 10초 대기!"
   ```

4. **데이터 체리픽**
   ```markdown
   ❌ "이번 주 가입자 50% 증가!" (전주 이벤트로 급증)
   ✅ "월별 평균 10% 증가, 이번 주 이상치"
   ```

### ✅ 반드시 할 것

1. **통계적 유의성 확인**
   ```markdown
   - 샘플 크기 충분한가? (최소 30+)
   - P-value < 0.05?
   - 신뢰 구간 표시
   ```

2. **세그먼트 분석**
   ```markdown
   전체 평균만 보지 말고:
   - 신규 vs 기존
   - 모바일 vs 데스크톱
   - 국가별, 브라우저별
   ```

3. **시계열 트렌드**
   ```markdown
   한 시점만 보지 말고:
   - 지난 30일 트렌드
   - 전월 대비 (MoM)
   - 전년 대비 (YoY)
   ```

4. **액션 아이템 제시**
   ```markdown
   분석만 하지 말고:
   - 구체적 개선안
   - 우선순위 (P0/P1/P2)
   - 예상 임팩트
   ```

---

## 📊 리포트 템플릿

```markdown
# 데이터 분석 리포트: [주제]

**분석 일시:** YYYY-MM-DD
**분석 기간:** [데이터 기간]
**Analyst:** [이름]

---

## 📋 Executive Summary

**핵심 발견:**
1. [인사이트 1]: [구체적 수치]
2. [인사이트 2]: [구체적 수치]
3. [인사이트 3]: [구체적 수치]

**권장 액션:**
- P0: [즉시 조치 필요]
- P1: [중요]
- P2: [개선 사항]

---

## 🎯 Research Question

[무엇을 알고 싶었는가?]

예: "시나리오 비교 기능 출시 후 사용자 참여도가 증가했는가?"

---

## 📊 Data Sources

- Supabase: scenarios 테이블 (2026-01-01 ~ 2026-02-21)
- Vercel Analytics: Page Views (동일 기간)
- 총 사용자: X명
- 총 이벤트: Y건

---

## 🔍 Analysis

### 메트릭 1: 시나리오 생성 수

**Before (Jan):** 평균 50개/일
**After (Feb):** 평균 80개/일
**증가율:** +60%

[차트 이미지]

### 메트릭 2: 비교 모드 사용률

**사용자 중 X%가 비교 모드 사용**
- 신규 사용자: Y%
- 기존 사용자: Z%

[차트 이미지]

### 세그먼트 분석

**모바일 vs 데스크톱:**
- 모바일: 40% 사용자, 10% 비교 모드 사용
- 데스크톱: 60% 사용자, 30% 비교 모드 사용
- **인사이트:** 모바일 UX 개선 필요

---

## 💡 Key Findings

### Finding #1: [제목]

**발견:**
[구체적 내용]

**근거:**
- 데이터: [수치]
- 통계: [유의성]

**영향:**
[사용자/비즈니스에 어떤 영향?]

---

## 🎯 Recommendations

### P0 (즉시 조치)
1. **모바일 비교 UI 개선**
   - 예상 임팩트: 비교 모드 사용률 10% → 20%
   - 예상 비용: 2-3일 개발

### P1 (이번 주 내)
2. **온보딩 간소화**
   - 예상 임팩트: 완료율 60% → 80%
   - 예상 비용: 1-2일 개발

### P2 (백로그)
3. **시나리오 템플릿 제공**
   - 예상 임팩트: 신규 사용자 활성화 +15%
   - 예상 비용: 1주 개발

---

## 📈 Next Steps

- [ ] Developer에게 P0 이슈 전달
- [ ] UX Designer와 모바일 UI 협업
- [ ] 2주 후 재분석 (개선 효과 측정)

---

**Appendix:**
[상세 SQL 쿼리, 원본 데이터 등]
```

---

## 🎯 성공 기준

### Analyst가 성공한 것:
- ✅ 명확한 질문 정의
- ✅ 충분한 데이터 (통계적 유의성)
- ✅ 정확한 분석 (방법론 적절)
- ✅ 실행 가능한 인사이트
- ✅ 구체적 액션 아이템 (우선순위 포함)
- ✅ 시각화 포함 (차트, 표)

### Analyst가 실패한 것:
- ❌ 모호한 질문 ("뭔가 개선할 게 있나?")
- ❌ 샘플 크기 부족 (통계적 신뢰 낮음)
- ❌ 잘못된 분석 (상관관계 = 인과관계)
- ❌ 추상적 인사이트 ("사용자 참여 증가")
- ❌ 액션 없음 (분석만 하고 끝)
- ❌ 숫자만 나열 (시각화 없음)

---

## 💡 Tip: 효율적인 데이터 분석

### SQL 쿼리 라이브러리
```markdown
자주 쓰는 쿼리 저장:
- 일별 가입자 수
- 기능별 사용률
- 에러 Top 10

→ 매번 처음부터 안 써도 됨
```

### 자동화
```markdown
주간 리포트 자동화:
1. SQL 쿼리 저장
2. Supabase Function으로 실행
3. 결과 이메일 발송 (또는 Slack)

→ 수동 작업 최소화
```

### A/B 테스트 설계
```markdown
1. 가설: "X를 Y로 바꾸면 Z가 개선될 것"
2. 메트릭: [측정할 지표]
3. 샘플 크기: [최소 인원]
4. 기간: [테스트 기간]
5. 성공 기준: [목표 수치]

협업: Developer (구현) + Analyst (측정)
```

---

## 📚 참고 자료

### 통계
- Statistics for Data Science (기본 통계)
- A/B Testing Guide (실험 설계)

### SQL
- Supabase SQL 문서
- PostgreSQL 매뉴얼

### 시각화
- Chart.js (웹 차트)
- Google Charts
- D3.js (고급)

---

**마지막 업데이트:** 2026-02-21 08:05  
**작성자:** 어메이징메이 (Squad Leader)

**데이터는 거짓말하지 않습니다!** 📊
