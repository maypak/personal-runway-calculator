/**
 * kakao.ts - Kakao SDK Integration
 * 
 * Purpose: Kakao Share API wrapper
 * Note: Requires NEXT_PUBLIC_KAKAO_KEY in .env.local
 * 
 * Created: 2026-02-26 (P1 Features)
 */

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (params: KakaoShareParams) => void;
      };
    };
  }
}

interface KakaoShareParams {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

export function initKakaoSDK() {
  if (typeof window === 'undefined') return;
  
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
  
  if (!kakaoKey) {
    console.warn('⚠️ NEXT_PUBLIC_KAKAO_KEY not found in environment variables');
    return;
  }

  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey);
    console.log('✅ Kakao SDK initialized');
  }
}

export function shareToKakao(params: {
  runway: number;
  balance: number;
  monthlyExpenses: number;
}) {
  if (typeof window === 'undefined') return;
  
  if (!window.Kakao) {
    alert('카카오톡 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요.');
    return;
  }

  const shareUrl = 'https://personal-runway-calculator.vercel.app';
  const imageUrl = 'https://personal-runway-calculator.vercel.app/og-image.png';

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '💰 나의 재정 런웨이',
      description: `${params.runway.toFixed(1)}개월 동안 버틸 수 있어요! 당신의 런웨이는 얼마인가요?`,
      imageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: '내 런웨이 계산하기',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
}
