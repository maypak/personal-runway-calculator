/**
 * KakaoSDK.tsx - Kakao SDK Loader
 * 
 * Purpose: Client component to load and initialize Kakao SDK
 * Note: Must be a client component due to window access
 * 
 * Created: 2026-02-26 (P1 Features)
 */

'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function KakaoSDK() {
  useEffect(() => {
    // SDK will be initialized via onLoad callback
  }, []);

  const handleLoad = () => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
      if (kakaoKey) {
        window.Kakao.init(kakaoKey);
        console.log('✅ Kakao SDK initialized');
      }
    }
  };

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}
