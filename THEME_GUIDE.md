# Theme Guide - Personal Runway Calculator

**Updated:** Feb 13, 2026

---

## 🎨 5 Distinctive Themes

### 1. Classic Blue (기본) 💙
```
배경: 순백색 (bg-white)
액센트: 블루 (blue-600 to blue-700)
분위기: 깔끔하고 전문적
Best for: 공식적인 사용, 명확한 가시성
```

**시각적 특징:**
- 흰색 배경 + 파란색 버튼/진행바
- 높은 대비, 가독성 최고
- 프로페셔널한 느낌

---

### 2. Dark Mode 🌙
```
배경: 다크 슬레이트 (slate-900)
액센트: 밝은 슬레이트 (slate-600~700)
분위기: 눈이 편한, 세련된
Best for: 야간 사용, 눈 피로 감소
```

**시각적 특징:**
- 어두운 배경 + 밝은 텍스트
- OLED 스크린 최적화
- 고급스러운 느낌

**주의사항:**
- 텍스트 색상 자동 조정 (white → slate-100)
- 카드 배경 투명도 높여야 함

---

### 3. Ocean Breeze 🌊
```
배경: 청록색 그라데이션 (cyan-50 to blue-100)
액센트: 시안 (cyan-600 to blue-700)
분위기: 신선하고 차분한
Best for: 아침 사용, 집중력 향상
```

**시각적 특징:**
- 하늘색~바다색 그라데이션
- 시원하고 깨끗한 느낌
- 눈에 부담 없는 중간 톤

---

### 4. Forest Green 🌲
```
배경: 녹색 그라데이션 (emerald-50 to green-100)
액센트: 에메랄드 (emerald-600 to green-700)
분위기: 자연스럽고 균형잡힌
Best for: 장시간 사용, 안정감
```

**시각적 특징:**
- 연한 녹색 배경
- 눈의 피로 최소화
- 차분하고 집중 잘 됨

---

### 5. Sunset Glow 🌅
```
배경: 따뜻한 그라데이션 (orange-50 to pink-100)
액센트: 오렌지 (orange-600 to pink-600)
분위기: 따뜻하고 에너지 넘치는
Best for: 저녁 사용, 동기부여
```

**시각적 특징:**
- 노을 같은 따뜻한 색감
- 활력 있는 느낌
- 긍정적인 분위기

---

## 🎯 테마 선택 가이드

### 시간대별 추천

**아침 (06:00-12:00):**
- ✅ Ocean Breeze (상쾌함)
- ✅ Classic Blue (업무 집중)

**오후 (12:00-18:00):**
- ✅ Classic Blue (가독성)
- ✅ Forest Green (눈 피로 감소)

**저녁 (18:00-24:00):**
- ✅ Sunset Glow (따뜻함)
- ✅ Dark Mode (눈 편안)

**야간 (00:00-06:00):**
- ✅ Dark Mode (필수!)
- ⚠️ 다른 테마 권장 안 함

---

### 사용 목적별 추천

**장시간 작업:**
- Forest Green (눈 피로 최소)
- Dark Mode (야간)

**프레젠테이션/공유:**
- Classic Blue (가장 깔끔)

**개인 사용:**
- 취향껏! (모두 좋음)

**에너지 필요할 때:**
- Sunset Glow (동기부여)

---

## 🛠️ 기술 구현

### 테마 구조
```typescript
{
  gradient: string;       // 배경색 클래스
  name: string;           // 표시 이름
  accent: string;         // 액센트 컬러
  description: string;    // 짧은 설명
  classes: {              // 동적 클래스
    bg500: string;
    bg600: string;
    bg700: string;
    text500: string;
    // ... etc
  }
}
```

### 테마 전환 메커니즘
1. 사용자가 테마 선택
2. `setTheme(newTheme)` 호출
3. localStorage 저장
4. State 업데이트 → 리렌더
5. 모든 컴포넌트에 `key={theme}` → 강제 리마운트
6. `transition-colors duration-300` → 부드러운 전환

---

## 🎨 다크 모드 특수 처리

다크 모드 선택 시:
```tsx
{theme === 'dark' && (
  <style jsx global>{`
    .dark-adjust {
      color: rgb(226 232 240); /* slate-200 */
    }
  `}</style>
)}
```

**또는** 조건부 클래스:
```tsx
className={theme === 'dark' ? 'text-slate-100' : 'text-gray-900'}
```

---

## 📊 테마별 통계 (예상)

| Theme | 선택률 | 만족도 | 특징 |
|-------|-------|-------|------|
| Classic Blue | 40% | ⭐⭐⭐⭐⭐ | 기본값, 안전한 선택 |
| Dark Mode | 25% | ⭐⭐⭐⭐⭐ | 야간 사용자 필수 |
| Ocean Breeze | 15% | ⭐⭐⭐⭐ | 신선함 선호 |
| Forest Green | 10% | ⭐⭐⭐⭐ | 장시간 사용자 |
| Sunset Glow | 10% | ⭐⭐⭐⭐ | 개성 추구 |

---

## 🚀 향후 추가 예정 테마 (아이디어)

- **Rose Gold** - 핑크+골드 (여성 선호)
- **Midnight Purple** - 진한 보라 (고급스러움)
- **Neon Cyber** - 형광 색상 (젊은 층)
- **Autumn Leaves** - 갈색+주황 (따뜻함)
- **Arctic Ice** - 흰색+청록 (깔끔함)

---

## 💡 테마 디자인 철학

**각 테마는 명확한 차별점을 가져야 함:**

❌ **Before:** 
- 모두 비슷한 파스텔 배경
- 액센트만 약간 다름
- 차별점 없음

✅ **After:**
- 5가지 완전히 다른 분위기
- 배경부터 다름 (흰색 vs 다크 vs 그라데이션)
- 사용자가 명확히 구분 가능

---

**마지막 업데이트:** 2026-02-13 16:28  
**변경 사항:** 기존 5개 테마 완전 재설계 (차별화 강화)
