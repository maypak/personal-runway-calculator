# TECHNICAL_WRITER_GUIDE.md - Technical Writer를 위한 완벽한 가이드

## 🎯 Technical Writer의 역할

복잡한 기술을 쉽게 설명하고, 명확한 문서를 작성하는 **커뮤니케이션 전문가**.

---

## 📝 문서 작성 프로세스

### 1. 자료 수집 (15분)
```markdown
1. 관련 코드 읽기 (app/components/*)
2. 스펙 파일 읽기 (specs/*.md)
3. QA 리포트 읽기 (실제 사용법)
4. Developer에게 기술적 세부사항 확인
```

### 2. 독자 파악 (10분)
```markdown
누구를 위한 문서인가?
- 사용자: 기능 사용법, 가이드
- 개발자: API, 컴포넌트 사용법
- 기여자: CONTRIBUTING.md
- 스쿼드: 내부 가이드 (QA_GUIDE 등)
```

### 3. 구조 설계 (15분)
```markdown
문서 구조:
1. 개요 (What): 이게 뭔가?
2. 목적 (Why): 왜 필요한가?
3. 사용법 (How): 어떻게 쓰나?
4. 예제 (Example): 실제 예시
5. 문제 해결 (Troubleshooting): 흔한 문제
6. 참고 자료 (References): 추가 정보
```

### 4. 작성 (60분)
```markdown
원칙:
- 짧은 문장 (주어 + 동사 + 목적어)
- 능동태 ("You can..." 보다 "Click...")
- 구체적 ("나중에" → "2분 후")
- 예제 포함 (코드, 스크린샷)
```

### 5. 리뷰 & 개선 (20분)
```markdown
체크리스트:
- [ ] 오타 없음
- [ ] 링크 작동
- [ ] 코드 예제 테스트
- [ ] 스크린샷 최신
- [ ] 일관된 용어
```

---

## 📚 문서 유형별 가이드

### README.md
```markdown
구조:
# Project Name
[한 줄 설명]

## Features
- [주요 기능 3-5개]

## Quick Start
```bash
# 3-4 commands만
git clone ...
npm install
npm run dev
```

## Demo
[스크린샷 또는 GIF]

## Documentation
[상세 문서 링크]

---

길이: 1-2 화면 (스크롤 최소화)
```

### API 문서
```markdown
구조:
## Function Name

**설명:** [한 줄 요약]

**Parameters:**
- `param1` (type): [설명]
- `param2` (type, optional): [설명]

**Returns:** type - [설명]

**Example:**
```typescript
const result = functionName(arg1, arg2);
// result: { ... }
```

**Errors:**
- `ErrorType`: [언제 발생하는지]
```

### 사용자 가이드
```markdown
구조:
# How to [Task]

**목표:** [이 가이드를 따르면 뭘 할 수 있는지]

**소요 시간:** 5분

## Step 1: [첫 단계]
1. [구체적 액션]
2. [예상 결과]

[스크린샷]

## Step 2: [다음 단계]
...

## 문제 해결
**Q: [흔한 문제]**
A: [해결 방법]

---

Tone: 친절하고 격려하는 ("Great! Now...")
```

### CHANGELOG.md
```markdown
형식:
# Changelog

## [1.2.0] - 2026-02-21

### Added
- 시나리오 비교 기능 (#123)
- 모바일 반응형 개선

### Fixed
- Edit 버튼 "Scenario not found" 에러 (#456)
- Create 후 잘못된 리다이렉트

### Changed
- 온보딩 플로우 간소화

### Removed
- 사용하지 않는 Premium 제한 (개발 중)

---

원칙:
- 사용자 관점 ("You can now..." 보다 "Added X")
- 이슈 번호 링크
- Breaking changes 강조
```

---

## 🎯 Personal Runway Calculator 문서

### 현재 문서 상태 확인
```markdown
필수 문서:
✅ README.md
✅ CONTRIBUTING.md (있으면)
⏳ USER_GUIDE.md (필요 시)
⏳ API.md (없어도 됨, 사용자 앱이므로)
⏳ CHANGELOG.md

내부 문서:
✅ CLAUDE.md
✅ specs/*.md
✅ *_GUIDE.md (QA, Developer 등)
```

### 용어 일관성
```markdown
통일된 용어 사용:

✅ Good:
- Scenario (시나리오)
- Runway (런웨이)
- Burn Rate (번 레이트)
- Monthly Income (월 수입)

❌ Bad:
- Scenario / 시나리오 혼용
- Runway / 활주로 / 버틸 수 있는 시간
```

### 예제 작성 원칙
```markdown
실제 사용 가능한 예제:
- ✅ 복사-붙여넣기 가능
- ✅ 실제 작동하는 코드
- ✅ 주석 포함 (설명)
- ✅ 예상 결과 명시

```typescript
// Create a new scenario
const result = await createScenario("Conservative Plan");

if (result.success) {
  console.log("Created:", result.data);
  // Created: { id: "abc123", name: "Conservative Plan", ... }
} else {
  console.error("Error:", result.error);
}
```
```

---

## 🚨 흔한 실수 방지

### ❌ 하지 말 것

1. **Jargon 남발**
   ```markdown
   ❌ "Leverage the API to instantiate a scenario entity"
   ✅ "Use the API to create a scenario"
   ```

2. **모호한 설명**
   ```markdown
   ❌ "Click the button to proceed"
   ✅ "Click the blue 'Create Scenario' button in the top-right"
   ```

3. **오래된 정보**
   ```markdown
   ❌ 1년 전 스크린샷 (UI 바뀜)
   ✅ 최신 스크린샷 (주기적 업데이트)
   ```

4. **설명 없는 코드**
   ```markdown
   ❌ 
   ```typescript
   const x = await y(z);
   ```
   
   ✅
   ```typescript
   // Fetch all scenarios for the current user
   const scenarios = await getScenarios(userId);
   ```
   ```

### ✅ 반드시 할 것

1. **능동형 문장**
   ```markdown
   ✅ "Click the button"
   ❌ "The button can be clicked"
   ```

2. **단계별 넘버링**
   ```markdown
   1. Open the app
   2. Click "Settings"
   3. Select "Privacy"
   ```

3. **스크린샷에 화살표/강조**
   ```markdown
   [🔴 빨간 화살표로 클릭할 버튼 표시]
   ```

4. **링크 텍스트 명확**
   ```markdown
   ✅ "Read the [API documentation](link)"
   ❌ "Click [here](link)"
   ```

---

## 📊 완료 보고 템플릿

```markdown
# ✅ [문서명] 작성 완료

**작성 시간:** [시작] ~ [종료] (총 X시간)
**문서 유형:** README / API / User Guide / Changelog

## 작성 내용
- **파일:** [경로]
- **길이:** [단어 수 / 라인 수]
- **포함 요소:**
  - 개요 ✅
  - 사용법 ✅
  - 예제 (3개) ✅
  - 스크린샷 (2개) ✅

## 주요 섹션
1. [섹션 1]: [간단 설명]
2. [섹션 2]: [간단 설명]

## 리뷰 체크
- [x] 오타 확인 (Grammarly)
- [x] 링크 테스트
- [x] 코드 예제 작동 확인
- [x] 일관된 용어 사용

## 다음 단계
- [ ] Developer 리뷰 요청 (기술적 정확성)
- [ ] 사용자 피드백 수집
- [ ] 주기적 업데이트 일정 (3개월마다)

---

**Technical Writer:** [이름]
```

---

## 🎯 성공 기준

### Technical Writer가 성공한 것:
- ✅ 명확하고 이해하기 쉬움
- ✅ 실제 작동하는 예제
- ✅ 일관된 구조와 용어
- ✅ 최신 정보 (스크린샷, 코드)
- ✅ 오타 없음
- ✅ 링크 작동

### Technical Writer가 실패한 것:
- ❌ 기술 용어 남발 (독자 고려 X)
- ❌ 예제 없음 또는 작동 안 함
- ❌ 용어 불일치
- ❌ 오래된 스크린샷
- ❌ 오타 다수
- ❌ 깨진 링크

---

## 💡 Tip: 효율적인 문서 작성

### 템플릿 활용
```markdown
자주 쓰는 구조 저장:
- README 템플릿
- API 템플릿
- 가이드 템플릿

→ 매번 처음부터 안 써도 됨
```

### 스크린샷 팁
```markdown
도구: Browser tool (screenshot)
- 화살표/강조: macOS Preview 또는 Skitch
- 크기 조정: 너무 크면 로딩 느림 (max 800px width)
- 파일명: descriptive (screenshot-1.png → create-scenario-modal.png)
```

### 버전 관리
```markdown
문서도 Git으로 관리:
- 커밋 메시지: "docs: update API guide with new endpoints"
- 변경 이력 추적 가능
- 롤백 가능
```

---

## 📚 참고 자료

### 스타일 가이드
- Google Developer Documentation Style Guide
- Microsoft Writing Style Guide
- Write the Docs

### 도구
- Grammarly (문법 체크)
- Hemingway Editor (가독성)
- Markdown lint (포맷 체크)

### 좋은 문서 예시
- Stripe API Docs
- Next.js Docs
- Supabase Docs

---

## 🔄 문서 유지보수

```markdown
주기적 업데이트 (3개월마다):
1. 스크린샷 확인 (UI 바뀌었나?)
2. 코드 예제 테스트 (아직 작동하나?)
3. 링크 확인 (깨진 링크 없나?)
4. 용어 업데이트 (새 기능 추가됨?)

Breaking Changes 시:
- 즉시 문서 업데이트
- 마이그레이션 가이드 작성
- 이전 버전 문서 보관
```

---

**마지막 업데이트:** 2026-02-21 08:00  
**작성자:** 어메이징메이 (Squad Leader)

**명확한 문서는 최고의 UX입니다!** 📝
