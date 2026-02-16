# 🚀 Week 1 개발 작업 브리핑

**날짜:** 2026-02-16  
**시작일:** 2026-02-17 (월) 09:00  
**완료 목표:** 2026-02-21 (금) 18:00  
**담당:** Developer  
**프로젝트:** Personal Runway Calculator  

---

## 📋 과제 요약

**P0-1: i18n 다중언어 지원 (영어 + 한국어)**

- **개발 기간:** 5일 (2/17-2/21)
- **기술 스택:** next-i18next
- **목표:** 영어/한국어 언어 전환 기능 구현
- **예상 효과:** 한국인 베타 테스터 평균 +1.5점 상승

---

## 📄 상세 스펙

**위치:** `/Users/claw_may/.openclaw/workspace/personal-runway-calculator/specs/P0-1-i18n-multilingual-support.md`

**주요 내용:**
- Day 1: 프레임워크 설정 (4h)
- Day 2: 번역 파일 작성 (6h) - 150-200개 항목
- Day 3: 컴포넌트 전환 (6h) - 5개 주요 컴포넌트
- Day 4: 언어 전환기 구현 (4h) - LanguageSwitcher.tsx
- Day 5: 테스트 & 마무리 (4h)

---

## 🎯 성공 기준

### Definition of Done
- [x] 언어 전환 (EN/KO) 동작
- [x] 모든 UI 텍스트 번역됨
- [x] 숫자/날짜 포맷 정확 ($1,234 vs ₩1,234,567)
- [x] 언어 설정 저장/복원
- [x] 번역 누락 0건
- [x] 10개 테스트 시나리오 통과
- [x] Production 배포 완료

---

## 🚨 중요 원칙 (CLAUDE.md 준수)

### 1. Think Before Coding
- 모든 하드코딩 텍스트 먼저 식별
- 번역 키 네이밍 컨벤션 정의
- 컴포넌트별 번역 파일 분리

### 2. Simplicity First
- 복잡한 interpolation 피하기
- 간단한 key-value 구조
- Namespace 5개만 (common, auth, dashboard, settings, goals)

### 3. Surgical Changes
- 기존 로직 건드리지 않기
- UI 텍스트만 교체
- 컴포넌트 구조 변경 최소화

### 4. Goal-Driven
- 목표: 한국 시장 진입
- 수단: 다중언어 지원
- 과도한 기능 추가 지양

---

## 📊 진행 보고 프로토콜

### 매 작업 시작 시 (5초 내)
```
✅ Day 1 시작: next-i18next 설치 중...
```

### 5분마다 (10분+ 작업 시)
```
Day 1 진행: 50% - next.config.js 설정 완료, _app.tsx 수정 중...
```

### 문제 발생 시 즉시
```
⚠️ 문제 발견: next-i18next 버전 충돌. 해결 방법: X → 시도 중...
```

### 작업 완료 시
```
✅ Day 1 완료! (4h)
- next-i18next 설치 ✅
- 설정 파일 3개 생성 ✅
- 테스트: 언어 전환 동작 확인 ✅
- Commit: feat: Set up next-i18next framework
- 다음: Day 2 번역 파일 작성
```

---

## 🔧 개발 환경

**로컬 환경:**
- Node.js v25.6.0
- npm
- Supabase 로컬 실행 중 (http://127.0.0.1:54321)
- Git repo: /Users/claw_may/.openclaw/workspace/personal-runway-calculator

**배포 환경:**
- Vercel
- Production URL: https://personal-runway-calculator.vercel.app

**테스트 계정:**
- (메이님 제공 예정)

---

## 📚 참고 자료

1. **스펙 문서:** `specs/P0-1-i18n-multilingual-support.md`
2. **CLAUDE.md:** 프로젝트 루트 (코딩 원칙)
3. **베타 분석:** `BETA_COMPREHENSIVE_ANALYSIS.md`
4. **next-i18next 공식 문서:** https://github.com/i18next/next-i18next

---

## ⚠️ 주의사항

### 번역 품질
- 한국어 번역은 메이님이 최종 검수
- Developer는 영어 → 한국어 번역 초안 작성
- 애매한 용어는 질문하기 (추측 금지)

### 테스트 필수
- 모든 페이지에서 언어 전환 확인
- 모바일/데스크톱 반응형 확인
- 새로고침 시 언어 유지 확인

### 배포 전 체크리스트
- [ ] ESLint warning 0건
- [ ] TypeScript 에러 0건
- [ ] 번역 누락 0건
- [ ] 10개 테스트 시나리오 통과

---

## 📞 Communication

**질문/이슈:**
- Amazing May에게 즉시 보고
- 2일 이상 블로킹되면 에스컬레이션

**일일 요약 (EOD):**
- 오늘 완료 항목
- 내일 계획
- 블로커 유무

---

## 🎯 마일스톤

| 날짜 | 목표 | 상태 |
|------|------|------|
| 2/17 (월) | Day 1: 프레임워크 설정 | 🔜 |
| 2/18 (화) | Day 2: 번역 파일 작성 | ⏳ |
| 2/19 (수) | Day 3: 컴포넌트 전환 | ⏳ |
| 2/20 (목) | Day 4: 언어 전환기 구현 | ⏳ |
| 2/21 (금) | Day 5: 테스트 & 배포 | ⏳ |

---

**준비 완료!** 내일 아침 9시에 시작합니다. 🚀

**Questions?** Amazing May에게 물어보세요.

**Let's ship it!** 🎉
