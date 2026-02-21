# QA_GUIDE.md - QA Engineer를 위한 완벽한 가이드

## 🎯 QA의 역할

코드 분석이 아닌 **실제 브라우저에서 사용자처럼 테스트**하는 것!

---

## 🌐 Browser Tool 사용법 (필수!)

### 1. 브라우저 시작
```
browser(action="start", profile="openclaw")
```

### 2. URL 열기
```
browser(action="open", targetUrl="https://personal-runway-calculator.vercel.app", profile="openclaw")
```

### 3. 페이지 스냅샷 (현재 상태 확인)
```
browser(action="snapshot", profile="openclaw")
```
- 이걸로 버튼, 입력창, 텍스트 등 모든 요소를 볼 수 있음
- 클릭할 요소의 ref (예: e12) 확인 가능

### 4. 클릭하기
```
browser(action="act", request={"kind": "click", "ref": "e12"}, profile="openclaw")
```

### 5. 텍스트 입력
```
browser(action="act", request={"kind": "type", "ref": "e23", "text": "Test Scenario"}, profile="openclaw")
```

### 6. 스크린샷 찍기 (증거)
```
browser(action="screenshot", profile="openclaw")
```

### 7. 다른 페이지로 이동
```
browser(action="navigate", targetUrl="https://...", profile="openclaw")
```

---

## 📋 표준 테스트 프로세스

### Step 1: 환경 준비
```markdown
1. browser(action="start", profile="openclaw")
2. browser(action="open", targetUrl="https://personal-runway-calculator.vercel.app", profile="openclaw")
3. browser(action="snapshot") → 로그인 페이지 확인
```

### Step 2: 로그인
```markdown
1. 이메일 입력창 찾기 (snapshot에서 ref 확인)
2. browser(action="act", request={"kind": "click", "ref": "eXX"})
3. browser(action="act", request={"kind": "type", "text": "test@example.com"})
4. 비밀번호도 동일하게
5. 로그인 버튼 클릭
6. browser(action="snapshot") → 로그인 성공 확인
```

### Step 3: 테스트 실행
```markdown
각 테스트 케이스마다:
1. snapshot으로 현재 화면 확인
2. 필요한 액션 수행 (click, type)
3. screenshot으로 결과 캡처
4. Pass/Fail 판단
5. Fail이면 재현 단계 + 스크린샷 저장
```

### Step 4: 리포트 작성
```markdown
QA_REPORT_[feature].md 파일에:
- 테스트 환경 (Production/Local, 브라우저)
- 각 테스트 케이스별 Pass/Fail
- Fail 케이스: 재현 단계 + 스크린샷 경로
- 우선순위 (P0/P1/P2)
- 총평
```

---

## 🎯 Personal Runway Calculator 전용 가이드

### 테스트 계정 만들기
```markdown
1. 첫 방문 시 자동으로 회원가입 화면
2. 이메일/비밀번호 입력
3. Sign Up 클릭
4. Onboarding 완료 (재무 정보 입력)
```

### Scenarios 페이지 접근
```markdown
1. 로그인 후 대시보드에서
2. "Scenarios" 메뉴 클릭 또는
3. 직접 URL: https://personal-runway-calculator.vercel.app/scenarios
```

### 주요 테스트 포인트
```markdown
✅ Create Scenario
- "+ Create Scenario" 버튼 클릭
- 이름 입력
- "Create" 클릭
- 새 시나리오 카드 생성 확인

✅ Duplicate Scenario
- 기존 시나리오의 "Duplicate" 버튼 클릭
- 복사본 생성 확인
- 데이터 동일한지 확인

✅ Delete Scenario
- "Delete" 버튼 클릭
- 확인 다이얼로그
- 삭제 후 목록에서 사라짐 확인

✅ Edit Scenario
- "Edit" 버튼 클릭
- 모달 열림
- 값 수정
- Save 후 반영 확인

✅ Compare Mode
- 2개 이상 시나리오 선택 (체크박스)
- "Compare Selected" 버튼 활성화
- 클릭 후 비교 테이블 표시 확인
- Baseline 비교, 차이 계산 확인
```

---

## 🚨 흔한 실수 방지

### ❌ 하지 말 것
1. **코드만 읽고 "구현되어 있으니 Pass"** → 실제 브라우저 테스트 필수!
2. **에러 무시하고 계속 진행** → 에러 발생 시 즉시 보고
3. **스크린샷 안 찍음** → 버그 증거 필수
4. **재현 단계 불명확** → "버튼 클릭했는데 안됨" (X), "Step 1~5 따라하면 재현" (O)

### ✅ 반드시 할 것
1. **매 액션마다 snapshot** → 현재 상태 확인
2. **Fail 시 스크린샷** → 증거 저장
3. **명확한 재현 단계** → Developer가 바로 수정할 수 있게
4. **우선순위 표시** → P0 (치명적) / P1 (중요) / P2 (사소)

---

## 📊 리포트 템플릿

```markdown
# QA Report: [Feature Name]

**테스트 일시:** YYYY-MM-DD HH:MM
**테스트 환경:** Production / Chrome
**테스터:** QA Engineer (Subagent)

---

## 요약
- **총 테스트:** XX개
- **Pass:** XX개
- **Fail:** XX개
- **전체 상태:** ✅ Pass / ⚠️ Minor Issues / ❌ Major Issues

---

## 테스트 결과

### ✅ Pass (XX개)
1. [TC-001] Create Scenario - Pass
2. [TC-002] Duplicate Scenario - Pass
...

### ❌ Fail (XX개)

#### [TC-XXX] Test Case Name - **P0** ❌
**재현 단계:**
1. Step 1
2. Step 2
3. Step 3

**예상 결과:** XXX
**실제 결과:** YYY

**스크린샷:** 
![Bug Screenshot](./screenshots/bug-xxx.png)

**에러 메시지:**
```
Console error: ...
```

---

## 권장 사항
1. P0 버그 즉시 수정 필요
2. P1 버그는 이번 주 내
3. UX 개선 제안: XXX

---

## 다음 단계
- [ ] Developer에게 버그 리포트 전달
- [ ] 수정 후 회귀 테스트
```

---

## 🎯 성공 기준

### QA가 성공한 것:
- ✅ 실제 브라우저에서 21개 케이스 모두 테스트
- ✅ Pass/Fail 명확히 구분
- ✅ Fail 케이스는 재현 단계 + 스크린샷
- ✅ 우선순위 분류 (P0/P1/P2)
- ✅ 리포트 파일 생성 (QA_REPORT_*.md)

### QA가 실패한 것:
- ❌ 코드만 읽고 "잘 구현되어 있음" 보고
- ❌ "브라우저 필요해요" 하고 멈춤
- ❌ 테스트 없이 가정으로 판단

---

## 💡 Tip: 효율적인 테스트

### 병렬 테스트 불가
- 브라우저는 한 번에 하나씩
- 테스트 케이스 순서대로 진행

### 상태 유지
- 로그인 한 번만 하면 됨
- 세션 유지되므로 페이지 이동 자유

### 빠른 체크
- Happy path 먼저 (정상 케이스)
- Edge case 나중에 (극단적 케이스)
- 버그 발견 시 즉시 보고 (전부 끝낼 때까지 기다리지 말고)

---

**마지막 업데이트:** 2026-02-21 07:40
**작성자:** 어메이징메이 (Squad Leader)

**이 가이드를 따르면 100% 성공합니다!** 🎯
