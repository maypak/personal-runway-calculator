# 🚨 P0 우선순위 작업 목록

**생성일:** 2026-02-18  
**목표:** 베타 런칭 준비 (3일 스프린트)  
**총 작업:** 10개 P0 차단 이슈

---

## ⚡ 즉시 실행 (Priority #1-3, 2시간)

### #1: DB 마이그레이션 적용 🔴 **BLOCKING**
- **문제:** Scenarios, FIRE, Phases 테이블 프로덕션에 없음
- **영향:** 3개 주요 기능 100% 고장
- **담당:** Developer
- **시간:** 30분
- **체크리스트:**
  ```bash
  cd personal-runway-calculator
  supabase login
  supabase link --project-ref jafbkmwaqxyszzccwsls
  supabase db push
  ```
- **검증:**
  - [ ] Scenarios 테이블 생성 확인
  - [ ] FIRE settings 테이블 생성 확인
  - [ ] Phases 테이블 생성 확인
  - [ ] RLS 정책 적용 확인
  - [ ] Production 테스트: /scenarios, /fire, /phases 작동

---

### #2: 보안 헤더 추가 🔴
- **문제:** CSP, X-Frame-Options, HSTS 없음
- **영향:** XSS, Clickjacking 취약
- **담당:** Developer
- **시간:** 30분
- **파일:** `next.config.ts`
- **코드:**
  ```typescript
  const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
            },
          ],
        },
      ];
    },
  };
  ```
- **검증:**
  - [ ] 빌드 성공
  - [ ] https://securityheaders.com 테스트
  - [ ] A 등급 달성

---

### #3: 비밀번호 강화 🔴
- **문제:** 최소 6자 (너무 약함)
- **영향:** 계정 탈취 위험
- **담당:** Developer
- **시간:** 1시간
- **변경 사항:**
  - Supabase Auth 설정: 12자 이상
  - 복잡도: 대소문자 + 숫자 + 특수문자
  - 클라이언트 검증 추가
- **체크리스트:**
  - [ ] Supabase Dashboard → Auth → Password → 12 characters
  - [ ] 프론트엔드 검증 로직 추가
  - [ ] 에러 메시지 업데이트
  - [ ] 기존 사용자 마이그레이션 계획

---

## 📋 Day 1 작업 (Priority #4, 4시간)

### #4: Privacy Policy 작성 🔴
- **문제:** GDPR 법적 요구사항 미충족
- **영향:** 법적 리스크, EU 사용자 서비스 불가
- **담당:** PM + Legal Review
- **시간:** 4시간
- **파일:** 
  - `app/privacy/page.tsx` (새로 생성)
  - `app/terms/page.tsx` (새로 생성)
- **내용 포함:**
  - 데이터 수집 항목
  - 데이터 사용 목적
  - 데이터 저장 기간
  - 사용자 권리 (삭제, 수정, 다운로드)
  - 쿠키 정책
  - 연락처
- **템플릿:** Supabase Privacy Policy 참고
- **검증:**
  - [ ] Privacy Policy 페이지 생성
  - [ ] Terms of Service 페이지 생성
  - [ ] Footer에 링크 추가
  - [ ] 회원가입 시 동의 체크박스 추가

---

## 💻 Day 2 작업 (Priority #5-7, 6시간)

### #5: Error Boundary 구현 🔴
- **문제:** 컴포넌트 크래시 시 빈 화면
- **영향:** 사용자 경험 치명적, 디버깅 불가
- **담당:** Developer
- **시간:** 1시간
- **파일:** 
  - `app/components/ErrorBoundary.tsx` (새로 생성)
  - `app/layout.tsx` (수정)
- **코드:**
  ```typescript
  // app/components/ErrorBoundary.tsx
  'use client';
  
  import { Component, ErrorInfo, ReactNode } from 'react';
  
  interface Props {
    children: ReactNode;
    fallback?: ReactNode;
  }
  
  interface State {
    hasError: boolean;
    error?: Error;
  }
  
  export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('ErrorBoundary caught:', error, errorInfo);
      // TODO: Send to error tracking service (Sentry)
    }
  
    render() {
      if (this.state.hasError) {
        return this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        );
      }
  
      return this.props.children;
    }
  }
  ```
- **검증:**
  - [ ] ErrorBoundary 래핑 확인
  - [ ] 테스트: 의도적 에러 발생 → Fallback UI 표시
  - [ ] 빌드 성공

---

### #6: ESLint 에러 수정 🔴
- **문제:** 5개 ESLint ERROR (성능/버그 위험)
- **영향:** 예측 불가능한 버그, 성능 저하
- **담당:** Developer
- **시간:** 2시간
- **수정 항목:**
  1. setState in useEffect (cascading renders)
  2. Component created during render
  3. TypeScript any types
  4. Missing dependencies
  5. Unused variables
- **체크리스트:**
  - [ ] `npm run lint` 실행
  - [ ] 각 ERROR 확인 및 수정
  - [ ] 리팩토링 테스트
  - [ ] 빌드 성공

---

### #7: console.log 제거 🔴
- **문제:** 135개 console.log (프로덕션 코드)
- **영향:** 보안 (데이터 노출), 성능, 비전문적
- **담당:** Developer
- **시간:** 3시간
- **접근 방법:**
  1. Logger utility 생성
  2. console.log → logger.debug 교체
  3. 프로덕션 빌드 시 제거
- **파일:**
  - `app/utils/logger.ts` (새로 생성)
  - 모든 컴포넌트 (console.log 교체)
- **코드:**
  ```typescript
  // app/utils/logger.ts
  const isDev = process.env.NODE_ENV === 'development';
  
  export const logger = {
    debug: (...args: any[]) => {
      if (isDev) console.log(...args);
    },
    info: (...args: any[]) => {
      if (isDev) console.info(...args);
    },
    warn: (...args: any[]) => {
      console.warn(...args); // Always log warnings
    },
    error: (...args: any[]) => {
      console.error(...args); // Always log errors
    },
  };
  ```
- **검증:**
  - [ ] grep "console.log" 결과 0건
  - [ ] Production 빌드 시 로그 없음
  - [ ] Development 모드 로그 작동

---

## 🎨 Day 3 작업 (Priority #8-10, 10시간)

### #8: 온보딩 플로우 구현 🔴
- **문제:** 사용자가 기능 발견 못 함
- **영향:** 80% 이탈률 예상
- **담당:** Designer + Developer
- **시간:** 4시간
- **구현:**
  - First-time user wizard (3-step)
  - Feature discovery tooltips
  - Dashboard empty state 개선
- **파일:**
  - `app/components/OnboardingWizard.tsx` (새로 생성)
  - `app/components/FeatureTooltip.tsx` (새로 생성)
- **Steps:**
  1. Welcome + Value proposition
  2. Enter first financial data
  3. See first calculation
  4. Explore features (Scenarios, FIRE, Phases)
- **검증:**
  - [ ] 신규 사용자: 온보딩 자동 표시
  - [ ] Skip 가능
  - [ ] localStorage에 완료 저장
  - [ ] 모바일 반응형

---

### #9: i18n 완성 (40% → 100%) 🔴
- **문제:** 하드코딩 영어 텍스트 남아있음
- **영향:** 한국 시장 30% 매출 손실
- **담당:** Developer
- **시간:** 1일 (Day 4-5)
- **작업:**
  - 나머지 40% 컴포넌트 변환
  - 차트 컴포넌트 5개
  - 에러 메시지
  - 검증 메시지
- **체크리스트:**
  - [ ] 모든 JSX 하드코딩 영어 제거
  - [ ] translation 파일 완성도 100%
  - [ ] 언어 전환 테스트 (EN ↔ KO)
  - [ ] 모바일 테스트

---

### #10: 접근성 개선 🔴
- **문제:** 키보드 nav, 스크린리더 미지원
- **영향:** 법적 리스크 + 사용자 배제
- **담당:** Designer + Developer
- **시간:** 3시간
- **작업:**
  1. ARIA 레이블 추가 (1h)
  2. 키보드 navigation (1h)
  3. Focus 스타일 (1h)
- **WCAG 2.1 AA 준수:**
  - [ ] 모든 interactive 요소 ARIA label
  - [ ] Tab 순서 logical
  - [ ] Enter/Space 작동
  - [ ] Escape로 modal 닫기
  - [ ] Focus indicator 명확
- **검증:**
  - [ ] Lighthouse 접근성 95+
  - [ ] 키보드만으로 전체 플로우 완료
  - [ ] VoiceOver/NVDA 테스트

---

## 📊 진행 상황 트래킹

### Day 1 체크리스트
- [ ] #1: DB 마이그레이션 (30min)
- [ ] #2: 보안 헤더 (30min)
- [ ] #3: 비밀번호 강화 (1h)
- [ ] #4: Privacy Policy (4h)

**Total:** 6시간

### Day 2 체크리스트
- [ ] #5: Error Boundary (1h)
- [ ] #6: ESLint 에러 (2h)
- [ ] #7: console.log (3h)

**Total:** 6시간

### Day 3 체크리스트
- [ ] #8: 온보딩 (4h)
- [ ] #10: 접근성 (3h)
- [ ] 플레이스홀더 탭 제거 (2h)
- [ ] 다크모드 polish (1h)

**Total:** 10시간

### Day 4-5 체크리스트
- [ ] #9: i18n 완성 (1일)

**Total:** 8시간

---

## 🎯 완료 기준

### 기술 점수
- **목표:** 85/100
- **현재:** 70/100
- **개선:** +15점

### 런칭 가능 여부
- **목표:** 베타 런칭 OK
- **현재:** NO-GO
- **개선:** 조건부 GO → GO

### 사용자 경험
- **목표:** 이탈률 40% 이하
- **현재:** 이탈률 80%
- **개선:** -50%

---

## 📞 에스컬레이션

### 블로킹 발생 시
1. 즉시 메이님께 보고
2. 대안 제시
3. 우선순위 재조정

### 시간 초과 시
- 2시간 초과: 경고
- 4시간 초과: 에스컬레이션
- 옵션: 외부 도움 또는 스킵

---

**작업 시작일:** 2026-02-18  
**목표 완료일:** 2026-02-21 (3일)  
**담당:** Developer + Designer (서브에이전트)

🚀 **즉시 실행 준비 완료!**
