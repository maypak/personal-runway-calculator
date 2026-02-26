/**
 * ShareModal.tsx - P1: SNS 공유 모달
 * 
 * Purpose: Modal for sharing runway results to social platforms
 * Channels: Kakao, Twitter, Link Copy, Email
 * 
 * Created: 2026-02-26 (P1 Features)
 * Author: Developer Agent
 */

'use client';

import { X, MessageCircle, Twitter as TwitterIcon, Link as LinkIcon, Mail } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKakao: () => void;
  onTwitter: () => void;
  onCopyLink: () => void;
  onEmail: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  onKakao,
  onTwitter,
  onCopyLink,
  onEmail,
}: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="share-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            📤 공유하기
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-6 space-y-3">
          {/* Kakao Talk */}
          <button
            onClick={() => {
              onKakao();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-lg">카카오톡으로 공유</span>
          </button>

          {/* Twitter */}
          <button
            onClick={() => {
              onTwitter();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <TwitterIcon className="w-6 h-6" />
            <span className="text-lg">트위터에 공유</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => {
              onCopyLink();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <LinkIcon className="w-6 h-6" />
            <span className="text-lg">링크 복사</span>
          </button>

          {/* Email */}
          <button
            onClick={() => {
              onEmail();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Mail className="w-6 h-6" />
            <span className="text-lg">이메일로 공유</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            친구들과 함께 재정 런웨이를 계산해보세요 💰
          </p>
        </div>
      </div>
    </div>
  );
}
