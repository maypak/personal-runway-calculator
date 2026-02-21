# DEVOPS_GUIDE.md - DevOps Engineer를 위한 완벽한 가이드

## 🎯 DevOps의 역할

배포를 자동화하고, 인프라를 관리하고, 성능을 최적화하는 **운영 전문가**.

---

## 🚀 Personal Runway Calculator 인프라

### 현재 스택
```markdown
**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Supabase (PostgreSQL + Auth + Realtime)
- Row Level Security (RLS)

**Hosting:**
- Vercel (Auto-deploy from main)
- Edge Network (Global CDN)

**CI/CD:**
- GitHub Actions (선택, 현재 Vercel 자동 배포)
- Vercel Bot (자동 PR 미리보기)
```

### 배포 플로우
```
main branch push
  ↓
Vercel 자동 감지
  ↓
빌드 (npm run build)
  ↓
성공? → Production 배포
실패? → 롤백 (이전 버전 유지)
  ↓
배포 완료 (1-3분)
```

---

## 📋 표준 DevOps 작업

### 1. 배포 확인 (Deploy Verification)
```bash
# 로컬 빌드 테스트
npm run build
# 성공하면 Production도 성공 가능성 높음

# Vercel 배포 상태 확인
# https://vercel.com/dashboard → Recent Deployments

# Production URL 테스트
curl -I https://personal-runway-calculator.vercel.app
# Status: 200 OK
```

### 2. 환경 변수 관리
```markdown
**위치:** Vercel Dashboard → Settings → Environment Variables

**주요 변수:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (Supabase connection string)

**추가 시:**
1. Vercel Dashboard → Add Variable
2. Name, Value 입력
3. Environment 선택 (Production / Preview / Development)
4. Save → 재배포 필요!
```

### 3. 롤백 (Rollback)
```markdown
**언제:**
- Production에 치명적 버그 배포됨
- 즉시 이전 버전으로 복구 필요

**방법:**
1. Vercel Dashboard → Deployments
2. 이전 성공 배포 찾기
3. "..." 메뉴 → Promote to Production
4. 즉시 롤백 (30초 이내)

**또는 Git:**
```bash
git revert HEAD
git push origin main
# Vercel이 자동으로 이전 커밋 배포
```
```

### 4. 로그 & 모니터링
```markdown
**Vercel 로그:**
- Vercel Dashboard → Deployments → [배포] → Logs
- 빌드 로그, 런타임 로그 확인

**Supabase 로그:**
- Supabase Dashboard → Logs
- Database queries, Auth events

**Browser 로그:**
- Browser tool로 Console errors 확인
- browser(action="console", level="error")
```

### 5. 성능 최적화
```markdown
**Lighthouse 점수:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**체크:**
- Image 최적화 (Next.js Image)
- Code splitting (Lazy loading)
- CDN 활용 (Vercel Edge)
- Font 최적화 (next/font)

**측정:**
```bash
npm run build
# Size analysis 확인
```
```

---

## 🚨 흔한 문제 해결

### Issue #1: 빌드 실패
```markdown
**증상:** Vercel 배포 실패

**원인 체크:**
1. TypeScript 에러?
   ```bash
   npm run build
   # 로컬에서 먼저 확인
   ```

2. 환경 변수 누락?
   - Vercel Dashboard → Environment Variables 확인

3. 의존성 문제?
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

**해결:**
- 에러 메시지 정확히 읽기
- Vercel Build Logs 확인
- 로컬 재현 후 수정
```

### Issue #2: 느린 로딩
```markdown
**측정:**
- Vercel Analytics → Performance
- Lighthouse 점수

**원인 체크:**
1. Bundle 크기?
   - npm run build → Size analysis

2. 이미지 최적화?
   - <Image> 컴포넌트 사용 확인

3. 불필요한 의존성?
   - npm ls → 사용하지 않는 패키지 제거

**해결:**
- Code splitting
- Lazy loading
- Image 최적화 (WebP, 적절한 크기)
```

### Issue #3: Supabase 연결 실패
```markdown
**증상:** "Connection refused" 또는 "Unauthorized"

**체크:**
1. 환경 변수 확인
   - NEXT_PUBLIC_SUPABASE_URL 정확한가?
   - ANON_KEY 올바른가?

2. RLS 규칙 확인
   - Supabase Dashboard → Authentication → Policies
   - 필요한 권한 있는가?

3. API Key 만료?
   - Supabase Dashboard → Settings → API
   - 새 키 발급

**해결:**
- 환경 변수 재설정
- RLS 규칙 수정
- 재배포
```

---

## 🔒 보안 체크리스트

```markdown
- [ ] 환경 변수 절대 커밋 안 함 (.env.local은 .gitignore에)
- [ ] Supabase RLS 활성화 (모든 테이블)
- [ ] API Key는 Anon Key만 사용 (Service Key 절대 노출 금지)
- [ ] HTTPS만 사용 (Vercel 자동 제공)
- [ ] CORS 설정 확인 (Supabase Dashboard)
- [ ] Auth token 만료 설정 (Supabase)
```

---

## 📊 모니터링 대시보드

### Vercel Analytics
```markdown
**지표:**
- Page Views
- Unique Visitors
- Top Pages
- Performance (Web Vitals)
- Error Rate

**경보 설정:**
- Error Rate > 5% → 즉시 알림
- Performance < 70 → 조사 필요
```

### Supabase Metrics
```markdown
**지표:**
- Database Size
- Active Connections
- Query Performance
- Auth Events

**제한:**
- Free Tier: 500MB DB, 2GB bandwidth
- 초과 시 업그레이드 필요
```

---

## 🎯 성공 기준

### DevOps가 성공한 것:
- ✅ 배포 자동화 (main push → 3분 내 배포)
- ✅ 빠른 롤백 (문제 발생 시 1분 내 복구)
- ✅ 로그 & 모니터링 설정
- ✅ 환경 변수 안전 관리
- ✅ 성능 최적화 (Lighthouse 90+)
- ✅ 보안 체크 완료

### DevOps가 실패한 것:
- ❌ 수동 배포 (자동화 안 됨)
- ❌ 배포 실패 시 복구 느림 (10분+)
- ❌ 로그 없음 (문제 파악 어려움)
- ❌ 환경 변수 노출 (보안 위험)
- ❌ 느린 성능 (Lighthouse < 70)

---

## 💡 Tip: 효율적인 DevOps

### 배포 전 체크리스트
```bash
#!/bin/bash
# pre-deploy.sh

echo "🔍 Pre-deploy checks..."

# TypeScript
echo "1. TypeScript check..."
npm run build || exit 1

# Tests
echo "2. Running tests..."
npm test || exit 1

# Lint
echo "3. Linting..."
npm run lint || exit 1

echo "✅ All checks passed! Ready to deploy."
```

### 빠른 디버깅
```markdown
1. Vercel Logs 먼저 확인
2. Supabase Logs 확인 (DB 관련)
3. Browser Console 확인 (Frontend 관련)

대부분의 문제는 로그에 답이 있음!
```

### 성능 최적화 우선순위
```markdown
1. 번들 크기 (가장 큰 영향)
2. 이미지 최적화 (두 번째)
3. Code splitting (세 번째)
4. CDN (Vercel 자동 제공)
5. 캐싱 (Vercel 자동 제공)

→ 위에서부터 순서대로 최적화
```

---

## 📋 완료 보고 템플릿

```markdown
# ✅ [DevOps 작업] 완료

**작업 시간:** [시작] ~ [종료] (총 X시간)
**작업 유형:** 배포 / 모니터링 / 최적화 / 문제 해결

## 작업 내용
- [구체적 작업 1]
- [구체적 작업 2]

## 결과
- **배포 상태:** ✅ Success / ❌ Failed
- **배포 시간:** X분
- **URL:** https://...
- **성능:** Lighthouse 점수 (Before → After)

## 변경 사항
- 환경 변수 추가: `NEW_VAR`
- 빌드 최적화: Bundle 크기 10% 감소

## 모니터링
- [ ] Vercel Analytics 확인
- [ ] Supabase Metrics 확인
- [ ] 에러 로그 없음

## 다음 단계
- [ ] 주기적 성능 모니터링 (1주일)
- [ ] 사용자 피드백 수집

---

**DevOps Engineer:** [이름]
```

---

## 🔄 정기 유지보수

```markdown
**매주:**
- Vercel Analytics 리뷰
- Supabase 용량 확인
- 에러 로그 체크

**매월:**
- 의존성 업데이트 (npm outdated)
- 보안 패치 적용 (npm audit)
- 성능 벤치마크 (Lighthouse)

**분기별:**
- 인프라 비용 리뷰
- 백업 정책 검토
- 재해 복구 테스트
```

---

**마지막 업데이트:** 2026-02-21 08:02  
**작성자:** 어메이징메이 (Squad Leader)

**안정적인 서비스가 최고의 기능입니다!** 🚀
