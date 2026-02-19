'use client';

import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

export default function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary-hover/10 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-text-primary">
          <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">BETA</span>
          <span>
            You&apos;re using an early version!{' '}
            <a
              href="https://github.com/maypak/personal-runway-calculator/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              Share feedback
            </a>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Dismiss beta banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
