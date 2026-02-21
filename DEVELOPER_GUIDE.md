# DEVELOPER_GUIDE.md - Developer를 위한 완벽한 가이드

## 🎯 Developer의 역할

코드를 작성하고, 버그를 수정하고, 기능을 구현하는 **실행 전문가**.

---

## 💻 개발 환경 설정

### 필수 읽기 (시작 전)
```
1. /Users/claw_may/.openclaw/workspace/personal-runway-calculator/README.md
2. /Users/claw_may/.openclaw/workspace/personal-runway-calculator/CLAUDE.md
   - Karpathy-inspired 코딩 원칙
   - "Make the change, but only the change"
3. 관련 스펙 파일 (specs/*.md)
```

### 로컬 환경 시작
```bash
cd /Users/claw_may/.openclaw/workspace/personal-runway-calculator
npm install
npm run dev
```

### 테스트 실행
```bash
npm test                 # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run build            # Production build
```

---

## 📋 표준 워크플로우

### 1. 작업 시작 (5분)
```markdown
1. 스펙 파일 읽기 (specs/*.md)
2. 관련 파일 탐색 (Read tool 사용)
3. 기존 패턴 확인
4. 시작 확인 메시지 전송
   예: "✅ P0-2 버그 수정 시작합니다. 예상 2시간."
```

### 2. 개발 진행 (매 15분)
```markdown
1. 코드 작성
2. TypeScript 에러 확인 (npm run build)
3. 수동 테스트 (브라우저)
4. 진행 상황 보고
   예: "📊 50% 완료. Edit 라우팅 수정 중..."
```

### 3. 완료 전 체크리스트
```markdown
- [ ] TypeScript 0 errors (npm run build)
- [ ] 기존 테스트 통과 (npm test)
- [ ] 브라우저에서 수동 테스트
- [ ] CLAUDE.md 원칙 준수 확인
- [ ] Git commit + push
```

### 4. 완료 보고
```markdown
✅ 완료 보고 템플릿:

**작업:** [기능/버그 설명]
**파일:** [변경된 파일 목록]
**커밋:** [커밋 해시]
**테스트:** [테스트 결과]
**시간:** [소요 시간]

**변경 사항:**
- [구체적 변경 1]
- [구체적 변경 2]

**검증 방법:**
1. [재현 단계]
2. [예상 결과]
```

---

## 🎯 Personal Runway Calculator 전용 가이드

### 프로젝트 구조
```
app/
  components/         # React 컴포넌트
  hooks/             # Custom hooks
  contexts/          # Context providers
  types/             # TypeScript 타입
  utils/             # 유틸리티 함수
supabase/
  migrations/        # DB 마이그레이션
tests/               # 테스트 파일
specs/               # 기능 스펙
```

### 핵심 파일
```
app/types/index.ts              # 전역 타입 정의
app/contexts/ScenarioContext.tsx # 시나리오 상태 관리
app/hooks/useScenarios.ts       # 시나리오 CRUD hook
supabase/migrations/...         # DB 스키마
```

### 코딩 규칙

#### TypeScript
```typescript
// ✅ Good: 명확한 타입
interface Scenario {
  id: string;
  name: string;
  monthlyIncome: number;
  // ...
}

// ❌ Bad: any 사용
function createScenario(data: any) { ... }

// ✅ Good: 타입 안전
function createScenario(data: CreateScenarioInput): Promise<Result<Scenario>> {
  // ...
}
```

#### React Patterns
```typescript
// ✅ Good: Custom hook 사용
const { scenarios, createScenario, loading } = useScenarios();

// ❌ Bad: 직접 Supabase 호출
const { data } = await supabase.from('scenarios').select();

// ✅ Good: Error handling
const result = await createScenario(name);
if (!result.success) {
  toast.error(result.error);
  return;
}

// ❌ Bad: Error 무시
await createScenario(name);
```

#### Supabase
```typescript
// ✅ Good: snake_case ↔ camelCase 변환
const dbScenario = {
  monthly_income: scenario.monthlyIncome,
  monthly_expenses: scenario.monthlyExpenses,
};

// ✅ Good: RLS 고려
const { data } = await supabase
  .from('scenarios')
  .select()
  .eq('user_id', userId); // 자동으로 현재 사용자만 조회

// ❌ Bad: 전체 조회
const { data } = await supabase.from('scenarios').select();
```

---

## 🚨 흔한 실수 방지

### ❌ 하지 말 것

1. **Drive-by 리팩토링**
   ```diff
   // 버그 수정하러 왔는데...
   - // ❌ 관련 없는 파일까지 리팩토링
   - const oldFunction = () => { ... }
   + const betterFunction = () => { ... }
   ```
   → **CLAUDE.md 원칙:** "Make the change, but only the change"

2. **타입 안전성 무시**
   ```typescript
   // ❌ Bad
   const data = await fetch() as any;
   
   // ✅ Good
   const data: Scenario[] = await fetch();
   ```

3. **에러 처리 생략**
   ```typescript
   // ❌ Bad
   await createScenario(name);
   
   // ✅ Good
   const result = await createScenario(name);
   if (!result.success) {
     console.error(result.error);
     toast.error('시나리오 생성 실패');
     return;
   }
   ```

4. **테스트 없이 커밋**
   ```bash
   # ❌ Bad
   git commit -m "fix: edit bug"
   git push
   
   # ✅ Good
   npm run build    # TypeScript 체크
   npm test         # Unit tests
   # 브라우저 수동 테스트
   git commit -m "fix: edit routing issue in ScenarioCard"
   git push
   ```

### ✅ 반드시 할 것

1. **매 변경마다 빌드 확인**
   ```bash
   npm run build
   # 0 errors? → 계속 진행
   # Errors? → 즉시 수정
   ```

2. **기존 패턴 따르기**
   ```typescript
   // 기존 코드 읽기
   const existingComponent = ReadFile('app/components/Similar.tsx');
   
   // 같은 패턴 사용
   export default function NewComponent() {
     const { data, loading } = useCustomHook();
     // ...
   }
   ```

3. **명확한 커밋 메시지**
   ```bash
   # ❌ Bad
   git commit -m "fix bug"
   
   # ✅ Good
   git commit -m "fix(scenarios): resolve 'Scenario not found' error in edit routing"
   ```

4. **진행 상황 보고**
   ```markdown
   [15분] 📊 Edit 라우팅 분석 완료. 원인 파악함.
   [30분] 🔧 ScenarioCard.tsx 수정 중...
   [45분] ✅ 수정 완료. 로컬 테스트 중...
   [60분] 🚀 테스트 통과. 커밋 + 푸시 완료!
   ```

---

## 🐛 버그 수정 프로세스

### Step 1: 버그 재현 (10분)
```markdown
1. QA 리포트 읽기 (재현 단계 확인)
2. 로컬에서 재현 시도
3. 브라우저 DevTools 콘솔 확인
4. 에러 메시지 & 스택 트레이스 수집
```

### Step 2: 원인 분석 (20분)
```markdown
1. 에러 발생 파일 찾기
2. 관련 코드 읽기 (전후 맥락)
3. 데이터 플로우 추적
   - Props → State → Hook → API → DB
4. 가설 수립
   - "아마도 X가 Y 때문에 실패하는 것 같음"
```

### Step 3: 수정 (30분)
```markdown
1. 최소한의 변경으로 수정
   - CLAUDE.md: "Make the change, but only the change"
2. TypeScript 에러 확인
3. 관련 파일만 수정 (drive-by 금지)
4. 주석 추가 (복잡한 로직만)
```

### Step 4: 검증 (20분)
```markdown
1. 로컬에서 재현 단계 다시 실행
2. 버그 사라졌는지 확인
3. 관련 기능도 테스트 (회귀 방지)
4. Edge cases 체크
```

### Step 5: 커밋 & 보고 (10분)
```markdown
1. git add [변경된 파일들]
2. git commit -m "fix: [명확한 설명]"
3. git push origin main
4. 완료 보고 (템플릿 사용)
```

**총 소요 시간: 90분 (평균)**

---

## 🎯 성공 기준

### Developer가 성공한 것:
- ✅ 스펙/버그 리포트 완전히 이해
- ✅ CLAUDE.md 원칙 준수
- ✅ TypeScript 0 errors
- ✅ 기존 테스트 통과
- ✅ 로컬 브라우저 테스트 완료
- ✅ Git commit + push
- ✅ 명확한 완료 보고

### Developer가 실패한 것:
- ❌ 스펙 안 읽고 추측으로 구현
- ❌ Drive-by 리팩토링
- ❌ TypeScript any 남발
- ❌ 테스트 없이 커밋
- ❌ 에러 처리 생략
- ❌ 침묵 (진행 상황 보고 없음)

---

## 💡 Tip: 효율적인 개발

### 빠른 피드백 루프
```bash
# 터미널 1: Dev server
npm run dev

# 터미널 2: Watch mode (실시간 타입 체크)
npx tsc --watch --noEmit

# 브라우저: Hot reload로 즉시 확인
```

### Git 전략
```bash
# 작은 커밋 자주
git commit -m "fix: resolve edit routing"
git commit -m "test: add edit scenario test"
git commit -m "docs: update changelog"

# 큰 커밋 피하기 (롤백 어려움)
```

### 블로커 발생 시
```markdown
❌ 혼자 해결하려고 30분 이상 헤매기
✅ 15분 시도 후 즉시 보고
   "🚫 Blocker: Supabase RLS 설정 필요. 권한 문제로 진행 불가."
```

---

## 📊 예상 작업 시간

### 신규 기능 (from scratch)
```
소형 (컴포넌트 1개): 1-2시간
중형 (hook + 컴포넌트 2-3개): 3-4시간
대형 (여러 페이지 + 통합): 1-2일
```

### 버그 수정
```
P0 (치명적): 1-2시간
P1 (중요): 30분-1시간
P2 (사소): 15-30분
```

### 리팩토링
```
작은 개선: 30분-1시간
구조 변경: 2-4시간
전면 재작성: 1-2일 (가급적 피하기)
```

---

## 📝 완료 보고 템플릿

```markdown
# ✅ [작업명] 완료

**작업 시간:** [시작] ~ [종료] (총 X시간)

## 변경 사항
- `app/components/ScenarioCard.tsx`: Edit 라우팅 수정
- `app/scenarios/[id]/edit/page.tsx`: ID 검증 로직 추가

## 커밋
- Commit: `abc1234`
- Message: "fix(scenarios): resolve edit routing issue"
- Pushed: ✅ main branch

## 테스트
- ✅ TypeScript: 0 errors
- ✅ Unit tests: 83/83 passing
- ✅ 로컬 브라우저: Edit 기능 정상 작동
- ✅ 회귀 테스트: CRUD 전체 기능 확인

## 검증 방법
1. `/scenarios` 페이지 접속
2. 기존 시나리오의 "Edit" 버튼 클릭
3. Edit 모달 정상 오픈 확인
4. 데이터 수정 후 Save
5. 시나리오 목록에 반영 확인

## 다음 단계
- QA 재테스트 권장
- P1 버그 (Create 리다이렉트) 수정 필요

---

**Developer:** [이름/세션]
```

---

## 🎯 CLAUDE.md 핵심 원칙 (필수 숙지)

```markdown
1. Make the change, but only the change
   - 요청된 것만 수정
   - Drive-by 리팩토링 금지

2. Think before you code
   - 코드 작성 전 5분 생각
   - 여러 방법 고려 후 최선 선택

3. Read the code, don't assume
   - 기존 패턴 확인
   - 추측 금지

4. Small, focused changes
   - 작은 커밋 자주
   - 큰 PR 피하기

5. Test your changes
   - 커밋 전 반드시 테스트
   - "Works on my machine" 금지
```

전체 내용: `/Users/claw_may/.openclaw/workspace/personal-runway-calculator/CLAUDE.md`

---

**마지막 업데이트:** 2026-02-21 07:55  
**작성자:** 어메이징메이 (Squad Leader)

**이 가이드를 따르면 완벽한 코드를 작성할 수 있습니다!** 💻
