'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SAFETY_KEY = 'ai-cookbook-safety-hidden';

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

export default function SiteFooter() {
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    try {
      // Restore previous open/closed state; default = closed
      const stored = localStorage.getItem(SAFETY_KEY);
      if (stored === '0') setSafetyOpen(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [mounted]);

  const toggleSafety = () => {
    const next = !safetyOpen;
    setSafetyOpen(next);
    try { localStorage.setItem(SAFETY_KEY, next ? '0' : '1'); } catch { /* ignore */ }
  };

  return (
    <footer className="border-t border-warm-border bg-background mt-auto">

      {/* ── Safety notice ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Collapsible header */}
        <button
          onClick={toggleSafety}
          className="w-full flex items-center justify-between py-4 text-left group"
          aria-expanded={safetyOpen}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldIcon className="w-4 h-4 text-teal shrink-0" />
            Tietosuojamuistutus opettajille
          </span>
          <span className="text-xs text-muted group-hover:text-foreground transition-colors ml-4 shrink-0">
            {safetyOpen ? 'Piilota ▴' : 'Näytä ▾'}
          </span>
        </button>

        {/* Collapsible body */}
        <div
          style={{
            maxHeight: safetyOpen ? (mounted ? contentHeight + 24 : 400) : 0,
            opacity: safetyOpen ? 1 : 0,
            transition: mounted ? 'max-height 220ms ease, opacity 180ms ease' : 'none',
            overflow: 'hidden',
          }}
        >
          <div ref={contentRef} className="pb-6">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Tämä palvelu ei lähetä tietojasi tekoälypalveluihin — kopioit promptin itse.
              Kun liität promptin ChatGPT:hen, Claudeen tai muuhun palveluun, muista:
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Don't */}
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">
                  Älä koskaan syötä tekoälychatiin:
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Oppilaiden nimiä tai henkilötietoja',
                    'Arviointeja tai todistustietoja',
                    'Henkilötunnuksia tai yhteystietoja',
                    'Oppilaiden kirjoittamia tekstejä sellaisenaan',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted leading-snug">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Do */}
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">
                  Näin käytät turvallisesti:
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Käytä kuvitteellisia nimiä (esim. 'Oppilas A')",
                    'Kuvaile tilanne yleisellä tasolla',
                    'Poista tunnistetiedot ennen liittämistä',
                    'Tarkista aina koulusi omat AI-ohjeet',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted leading-snug">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-border" />
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted">Tehty opettajille ❤️</p>
        <div className="flex items-center gap-5">
          <Link href="/tietosuoja" className="text-xs text-muted/60 hover:text-muted transition-colors">
            Tietosuoja
          </Link>
          <Link href="/submit" className="text-xs text-muted/60 hover:text-muted transition-colors">
            + Lähetä prompti
          </Link>
          <Link href="/skills/submit" className="text-xs text-muted/60 hover:text-muted transition-colors">
            + Jaa skill
          </Link>
        </div>
      </div>

    </footer>
  );
}
