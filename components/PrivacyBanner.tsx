'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ai-cookbook-privacy-ok';

export default function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch { /* private browsing */ }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none"
      role="region"
      aria-label="Tietosuojailmoitus"
    >
      <div className="max-w-xl mx-auto pointer-events-auto">
        <div className="bg-card border border-warm-border rounded-2xl shadow-lg px-5 py-4 flex items-center gap-4">
          {/* Icon */}
          <svg
            className="w-5 h-5 text-teal shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>

          {/* Text */}
          <p className="text-sm text-muted leading-relaxed flex-1">
            Käytämme selaimen paikallista tallennustilaa palvelun toimintaan. Emme käytä
            seurantaevästeitä.{' '}
            <Link
              href="/tietosuoja"
              className="text-teal hover:text-teal-dark underline underline-offset-2 transition-colors whitespace-nowrap"
            >
              Lue lisää
            </Link>
          </p>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="shrink-0 px-4 py-1.5 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
          >
            Selvä
          </button>
        </div>
      </div>
    </div>
  );
}
