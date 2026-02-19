# 🔴 P0 긴급 수정 가이드

**작성일**: 2026-02-18  
**예상 소요 시간**: 2-3시간  
**우선순위**: CRITICAL - 런칭 블로커

---

## 📋 P0 이슈 요약

최종 팀 리뷰(6명)에서 발견된 치명적 이슈들입니다.

| 팀 | 이슈 | 우선순위 | 소요시간 |
|-----|------|----------|----------|
| **QA** | DB 마이그레이션 3개 누락 | 🔴 P0 | 10분 |
| **Developer** | UPSERT 잘못 사용 | 🔴 P0 | 20분 |
| **Developer** | console.log 135개 | 🟡 P1 | 30분 |
| **Marketing** | 베타 프로그램 구축 | 🔴 P0 | 3시간 |
| **Marketing** | Share 기능 없음 | 🔴 P0 | 2-3일 |
| **Designer** | 온보딩 튜토리얼 | 🔴 P0 | 1일 |

---

## 🎯 오늘 해결할 것 (우선순위 순)

### 1단계: 데이터베이스 마이그레이션 (10분) 🔴

**문제**: 프로덕션 DB에 3개 테이블 없음 (scenarios, fire_settings, phases)  
**영향**: Week 2, 3, 4 기능 전부 작동 불가  
**해결**: Supabase Dashboard에서 SQL 실행

**실행 방법**:
1. **Supabase Dashboard 열기**:
   - https://supabase.com/dashboard/project/dpbugqijqwulwojzphre
   - 로그인 (메이님 계정)

2. **SQL Editor 이동**:
   - 왼쪽 메뉴 > SQL Editor
   - 또는 직접 링크: https://supabase.com/dashboard/project/dpbugqijqwulwojzphre/sql/new

3. **SQL 복사 & 실행**:
   ```bash
   # P0_DATABASE_MIGRATION.sql 내용 전체 복사
   # SQL Editor에 붙여넣기
   # Run (Ctrl+Enter 또는 우측 상단 Run 버튼)
   ```

4. **검증**:
   - 왼쪽 메뉴 > Database > Tables
   - 새 테이블 3개 확인:
     - ✅ scenarios
     - ✅ fire_settings
     - ✅ phases

**예상 결과**: 모든 P0 기능 즉시 작동

---

### 2단계: useFIRESettings.ts UPSERT 수정 (20분) 🔴

**문제**: CLAUDE.md 원칙 위반 - UPSERT 대신 조건부 INSERT/UPDATE 사용해야 함  
**파일**: `app/hooks/useFIRESettings.ts`  
**라인**: 182-191

**Before (❌ WRONG)**:
```typescript
const { data, error: updateError } = await supabase
  .from('fire_settings')
  .upsert({ user_id: user.id, ...updates })
  .select()
  .maybeSingle();
```

**After (✅ CORRECT)**:
```typescript
// First, check if settings exist
const { data: existing } = await supabase
  .from('fire_settings')
  .select('id')
  .eq('user_id', user.id)
  .maybeSingle();

if (existing) {
  // Update existing
  const { data, error: updateError } = await supabase
    .from('fire_settings')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .maybeSingle();
  
  if (updateError) throw updateError;
  setSettings(data);
} else {
  // Insert new
  const { data, error: insertError } = await supabase
    .from('fire_settings')
    .insert({ ...updates, user_id: user.id })
    .select()
    .maybeSingle();
  
  if (insertError) throw insertError;
  setSettings(data);
}
```

**실행**:
```bash
# 어메이징메이가 자동으로 수정하거나
# 메이님이 직접 수정
```

---

### 3단계: console.log 제거 (30분, 선택사항) 🟡

**문제**: 프로덕션 빌드에 135개 console.log 남아있음  
**영향**: 성능 저하 (미미), 보안 위험 (낮음), 전문성 ↓

**해결**:
```bash
cd /Users/claw_may/.openclaw/workspace/personal-runway-calculator

# 모든 console.log 찾기
grep -r "console.log" app/ --exclude-dir=node_modules

# 수동 제거 또는 ESLint 규칙 추가
# eslint.config.mjs에 추가:
rules: {
  'no-console': ['error', { allow: ['warn', 'error'] }]
}
```

---

### 4단계: 베타 프로그램 구축 (3시간) 🔴

**문제**: Google Form 템플릿만 있고 실제 폼 생성 안 됨  
**영향**: 런칭해도 피드백 못 받음 → PMF 검증 실패

**해결 체크리스트**:

#### 1. Google Form 생성 (30분)
- [ ] https://forms.google.com 접속
- [ ] "Personal Runway Beta Signup" 폼 생성
- [ ] 필드 추가:
  - Name (단답형)
  - Email (단답형, 필수)
  - Current Situation (장문, "Are you a freelancer, between jobs, sabbatical...?")
  - What features excite you? (체크박스: Scenario Comparison, FIRE Calculator, etc.)
  - Availability for 30-min interview (예/아니오)
- [ ] 응답 → 스프레드시트로 자동 저장 설정
- [ ] 폼 URL 복사

#### 2. 관리 스프레드시트 설정 (1시간)
- [ ] 응답 스프레드시트에 시트 추가:
  - "Responses" (자동)
  - "Status Tracker" (수동: Invited, Active, Churned)
  - "Feedback Log" (피드백 수집)
- [ ] 상태 트래킹 컬럼 추가:
  - Signup Date
  - Invited (Y/N)
  - First Login Date
  - Last Active
  - Feedback Count
  - Net Promoter Score (1-10)

#### 3. Welcome Email 템플릿 (1시간)
- [ ] Gmail에서 Draft 작성:
  ```
  Subject: Welcome to Personal Runway Beta! 🚀
  
  Hi {Name},
  
  Thanks for joining our beta! You're one of the first 50 people to get early access.
  
  **Your Beta Access:**
  - URL: https://personal-runway-calculator.vercel.app
  - Login: {Your Email}
  - Features: All P0 features unlocked (Scenarios, FIRE, Phases)
  
  **We'd love your feedback on:**
  - What works well?
  - What's confusing?
  - What features are you missing?
  
  **Stay in touch:**
  - Discord: [Link]
  - Feedback form: [Typeform link]
  
  Happy runway calculating! ✈️
  
  Amazing May
  Personal Runway Team
  ```

#### 4. Typeform 피드백 폼 (30분)
- [ ] https://typeform.com (무료 플랜)
- [ ] "Beta Feedback" 폼 생성
- [ ] 질문:
  - How would you rate your experience? (1-10)
  - What's one thing you love?
  - What's one thing we should fix?
  - Would you recommend this to a friend? (NPS)
- [ ] URL 복사 → Welcome email에 추가

---

## ⏱️ 타임라인

### 오늘 (2026-02-18) - 4시간
- [x] 1단계: DB 마이그레이션 (10분)
- [ ] 2단계: UPSERT 수정 (20분)
- [ ] 4단계: 베타 프로그램 구축 (3시간)

### 내일-모레 (2026-02-19~20) - Optional
- [ ] 3단계: console.log 제거 (30분)
- [ ] Share 기능 개발 (2-3일, Developer 필요)
- [ ] 온보딩 튜토리얼 (1일, Designer 필요)

---

## ✅ 완료 체크리스트

완료 시 체크:

- [ ] 1. DB 마이그레이션 실행 완료
- [ ] 2. useFIRESettings.ts 수정 완료
- [ ] 3. 베타 프로그램 구축 완료:
  - [ ] Google Form 생성
  - [ ] 스프레드시트 설정
  - [ ] Welcome Email 템플릿
  - [ ] Typeform 피드백 폼
- [ ] 4. 프로덕션 배포 후 테스트:
  - [ ] Scenario 생성 테스트
  - [ ] FIRE Calculator 테스트
  - [ ] Phase 생성 테스트

---

## 🚀 완료 후 다음 단계

P0 해결 후:
1. **QA 재테스트** (30분) - 모든 P0 이슈 해결 확인
2. **Private Beta 시작** (2-3일) - 첫 50명 모집
3. **피드백 수집** (1주) - Typeform + Discord
4. **Product Hunt 준비** (2일) - 로고 + 스크린샷
5. **Public Launch** 🚀

---

**작성자**: 어메이징메이  
**검토자**: Developer, QA, Marketing 팀
