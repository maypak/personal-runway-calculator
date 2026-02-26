/**
 * ShareButton.tsx - P1: SNS 공유 버튼
 * 
 * Purpose: Trigger button for social sharing
 * Features: 4 channels (Kakao, Twitter, Link, Email)
 * 
 * Created: 2026-02-26 (P1 Features)
 */

'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';
import { shareToKakao } from '@/lib/share/kakao';
import { trackShare } from '@/lib/analytics/tracking';

interface ShareButtonProps {
  runway: number;
  balance: number;
  monthlyExpenses: number;
  situation?: string;
}

export default function ShareButton({
  runway,
  balance,
  monthlyExpenses,
  situation,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const shareUrl = 'https://personal-runway-calculator.vercel.app';
  const shareText = `나의 재정 런웨이: ${runway.toFixed(1)}개월! Personal Runway Calculator로 확인해보세요 🎯`;

  const handleKakao = () => {
    shareToKakao({ runway, balance, monthlyExpenses });
    trackShare('kakao');
  };

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    trackShare('twitter');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      trackShare('link');
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('링크 복사에 실패했습니다');
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Personal Runway Calculator');
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare('email');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
        aria-label="공유하기"
      >
        <Share2 className="w-4 h-4" />
        <span>공유하기</span>
      </button>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onKakao={handleKakao}
        onTwitter={handleTwitter}
        onCopyLink={handleCopyLink}
        onEmail={handleEmail}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          ✅ 링크가 복사되었습니다!
        </div>
      )}
    </>
  );
}
