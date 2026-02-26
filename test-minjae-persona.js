const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ko-KR'
  });
  const page = await context.newPage();
  
  const report = {
    persona: '이민재 (36세, 기혼, PM, 구직중)',
    testDate: new Date().toISOString(),
    steps: [],
    feedback: {
      scores: {},
      positives: [],
      improvements: [],
      psychologicalImpact: '',
      features: []
    }
  };

  try {
    console.log('📋 민재 페르소나 테스트 시작...');
    console.log('가족 4인, 자산 ₩30M, 월 지출 ₩5M');
    console.log('');

    // Step 1: Onboarding 접속
    console.log('Step 1: 온보딩 페이지 접속...');
    await page.goto('http://localhost:3000/onboarding');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/minjae-01-onboarding-start.png' });
    report.steps.push({
      step: 1,
      action: '온보딩 시작',
      timestamp: Date.now()
    });

    // Step 2: "구직자" 선택
    console.log('Step 2: "구직자" 선택...');
    await page.waitForSelector('text=구직자', { timeout: 5000 });
    await page.click('text=구직자');
    await page.screenshot({ path: 'screenshots/minjae-02-selected-jobseeker.png' });
    
    // 다음 버튼 클릭
    const nextButton1 = await page.locator('button:has-text("다음")').first();
    await nextButton1.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/minjae-03-step2.png' });
    report.steps.push({
      step: 2,
      action: '구직자 선택 완료',
      timestamp: Date.now()
    });

    // Step 3: 자산 입력 (₩30,000,000)
    console.log('Step 3: 자산 ₩30,000,000 입력...');
    const assetsInput = await page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await assetsInput.fill('30000000');
    await page.screenshot({ path: 'screenshots/minjae-04-assets-input.png' });
    
    const nextButton2 = await page.locator('button:has-text("다음")').first();
    await nextButton2.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/minjae-05-step3.png' });
    report.steps.push({
      step: 3,
      action: '자산 입력: ₩30,000,000',
      timestamp: Date.now()
    });

    // Step 4: 월 지출 입력 (₩5,000,000)
    console.log('Step 4: 월 지출 ₩5,000,000 입력...');
    const expensesInput = await page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await expensesInput.fill('5000000');
    await page.screenshot({ path: 'screenshots/minjae-06-expenses-input.png' });
    
    const submitButton = await page.locator('button:has-text("계산하기"), button:has-text("완료"), button[type="submit"]').first();
    await submitButton.click();
    await page.waitForTimeout(2000);
    report.steps.push({
      step: 4,
      action: '월 지출 입력: ₩5,000,000',
      timestamp: Date.now()
    });

    // Dashboard 확인
    console.log('');
    console.log('✅ 온보딩 완료! Dashboard로 이동...');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/minjae-07-dashboard.png', fullPage: true });

    // 런웨이 숫자 추출
    const runwayText = await page.textContent('body');
    const runwayMatch = runwayText.match(/(\d+\.?\d*)\s*(개월|months?)/i);
    
    let runwayMonths = null;
    if (runwayMatch) {
      runwayMonths = parseFloat(runwayMatch[1]);
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 런웨이 결과: ' + runwayMonths + '개월');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    }

    report.runwayMonths = runwayMonths;

    // 민재의 심리적 반응 시뮬레이션
    console.log('🧠 민재의 심리적 반응 분석:');
    console.log('');
    if (runwayMonths !== null) {
      if (runwayMonths >= 6) {
        console.log('😰 "6개월... 가족 4명이 살려면 빠듯하다"');
        console.log('💭 "자녀 학원비, 갑작스러운 의료비 나오면?"');
        console.log('⚠️  "예비비는 계산된 건가? 너무 낙관적인 거 아닌가?"');
      } else if (runwayMonths >= 3) {
        console.log('😱 "' + runwayMonths + '개월밖에 안 남았다니!"');
        console.log('💭 "빨리 구해야 한다는 압박감..."');
        console.log('⚠️  "이미 레드존이 아닌가?"');
      } else {
        console.log('🚨 "' + runwayMonths + '개월은 위험 수준이다"');
        console.log('💭 "당장 급전 대책이 필요하다"');
      }
    }
    console.log('');

    // 추가 화면 캡처
    console.log('📸 추가 화면 캡처 중...');
    
    // 스크롤해서 전체 내용 확인
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.screenshot({ path: 'screenshots/minjae-08-dashboard-middle.png' });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.screenshot({ path: 'screenshots/minjae-09-dashboard-bottom.png' });

    // 경고/상태 메시지 확인
    const bodyText = await page.textContent('body');
    const hasWarning = bodyText.match(/경고|warning|위험|critical/i);
    const hasCritical = bodyText.match(/위험|critical/i);
    const hasEncouragement = bodyText.match(/할 수 있|괜찮|충분|안심/i);

    console.log('');
    console.log('📝 메시징 분석:');
    console.log('- 경고 메시지: ' + (hasWarning ? '있음 ✓' : '없음 ✗'));
    console.log('- 위험 알림: ' + (hasCritical ? '있음 ✓' : '없음 ✗'));
    console.log('- 격려 메시지: ' + (hasEncouragement ? '있음 ✓' : '없음 ✗'));
    console.log('');

    report.messaging = {
      hasWarning: !!hasWarning,
      hasCritical: !!hasCritical,
      hasEncouragement: !!hasEncouragement
    };

    // 페르소나 피드백 작성
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 민재 페르소나 피드백');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // 점수 평가 (기혼자/부양자 관점)
    let usabilityScore = 8; // 온보딩 간단함
    let helpfulnessScore = 6; // 숫자는 나오지만 충분한가?
    let trustScore = 5; // 보수적 계산인지 불확실

    console.log('점수 (1-10):');
    console.log('- 사용성: ' + usabilityScore + '/10 (온보딩 간단함)');
    console.log('- 도움됨: ' + helpfulnessScore + '/10 (숫자는 나오지만...)');
    console.log('- 신뢰성: ' + trustScore + '/10 (보수적 계산인가?)');
    console.log('');

    report.feedback.scores = {
      usability: usabilityScore,
      helpfulness: helpfulnessScore,
      trust: trustScore
    };

    console.log('좋았던 점:');
    const positives = [
      '간단한 온보딩 (3단계로 빠르게 입력)',
      '명확한 숫자 제시 (' + (runwayMonths || '?') + '개월)',
      '직관적인 UI'
    ];
    positives.forEach((p, i) => console.log((i + 1) + '. ' + p));
    report.feedback.positives = positives;
    console.log('');

    console.log('개선 필요:');
    const improvements = [
      '⚠️  예비비/안전 마진이 고려되는지 불명확',
      '⚠️  6개월이 "안전"한지 "위험"한지 판단 기준 불명확',
      '⚠️  가족 4인 부양 시 특수성 반영 안됨 (교육비, 의료비)'
    ];
    improvements.forEach((i, idx) => console.log((idx + 1) + '. ' + i));
    report.feedback.improvements = improvements;
    console.log('');

    console.log('추가 원하는 기능:');
    const features = [
      '✓ 보수적 계산 옵션 (예비비 20% 자동 빼기)',
      '✓ 지출 세부 항목 (고정비 vs 변동비)',
      '✓ 위험 알림 기준 명시 (3개월, 6개월 등)',
      '✓ 가족 구성원 수 입력 → 권장 안전 마진',
      '✓ "만약" 시나리오 계산 (지출 증가 시)',
      '✓ 배우자 공유 기능'
    ];
    features.forEach((f, i) => console.log('• ' + f));
    report.feedback.features = features;
    console.log('');

    console.log('심리적 영향:');
    const psychologicalImpact = `
    😰 불안감이 더 커졌다. 6개월이라는 숫자를 보니:
    - "정말 6개월인가?" (예비비는?)
    - "자녀 학원비 올라가면?"
    - "갑자기 병원 가면?"
    
    📊 숫자는 명확하지만, "안전한지" 판단이 어렵다.
    ⚠️  "Critical" 기준이 언제인지 모르겠다.
    
    👨‍👩‍👧‍👦 배우자에게 보여주기 전에:
    - 더 보수적인 계산이 필요할 것 같다
    - "최악의 경우" 시나리오를 보고 싶다
    - 가족과 함께 대책을 세우고 싶다
    `;
    console.log(psychologicalImpact);
    report.feedback.psychologicalImpact = psychologicalImpact.trim();
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 테스트 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📸 스크린샷 저장: screenshots/minjae-*.png');
    console.log('📄 리포트 저장: qa-reports/minjae-persona-test.json');
    console.log('');

    // 리포트 저장
    fs.writeFileSync(
      'qa-reports/minjae-persona-test.json',
      JSON.stringify(report, null, 2)
    );

    // 3초 대기 후 종료
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    await page.screenshot({ path: 'screenshots/minjae-error.png' });
    report.error = error.message;
    fs.writeFileSync(
      'qa-reports/minjae-persona-test.json',
      JSON.stringify(report, null, 2)
    );
  } finally {
    await browser.close();
  }
})();
