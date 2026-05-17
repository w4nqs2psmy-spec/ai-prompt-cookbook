'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'ai-cookbook-intro-hidden';

const STEPS = [
  {
    n: '1',
    title: 'Valitse prompti',
    body: 'Selaa kokoelmaa ja löydä sopiva prompti oppiaineesi ja tarpeesi mukaan.',
  },
  {
    n: '2',
    title: 'Kopioi ja liitä',
    body: 'Kopioi prompti ja liitä se tekoälychatiin — esimerkiksi ChatGPT:hen, Claudeen tai Geminiin.',
  },
  {
    n: '3',
    title: 'Käytä opetuksessa',
    body: 'Tekoäly antaa sinulle valmiin ehdotuksen, jonka voit muokata ja viedä suoraan oppitunnille.',
  },
];

export default function IntroBox() {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === '1') setHidden(true);
  }, []);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [mounted]);

  const toggle = () => {
    const next = !hidden;
    setHidden(next);
    try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* ignore */ }
  };

  return (
    <div className="border-l-[3px] border-teal bg-background rounded-r-xl overflow-hidden">

      {/* Header row — always visible */}
      <div className="flex items-center justify-between px-5 pt-5 pb-0">
        <h2 className="font-serif text-sm font-semibold text-foreground">
          Miten tämä toimii?
        </h2>
        <button
          onClick={toggle}
          className="text-xs text-muted hover:text-foreground transition-colors ml-4 shrink-0"
          aria-expanded={!hidden}
        >
          {hidden ? 'Näytä ohje' : 'Piilota ohje'}
        </button>
      </div>

      {/* Collapsible content */}
      <div
        style={{
          maxHeight: hidden ? 0 : mounted ? contentHeight : 500,
          opacity: hidden ? 0 : 1,
          transition: mounted ? 'max-height 200ms ease, opacity 200ms ease' : 'none',
          overflow: 'hidden',
        }}
      >
        <div ref={contentRef} className="px-5 pb-5 pt-4">
          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="flex flex-col sm:flex-row gap-5">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-3 flex-1">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal text-white font-serif font-bold text-base shrink-0 mt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-snug mb-1">
                    {step.title}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted/70 mt-5 leading-relaxed">
            Prompti on ohje tai kysymys, jonka annat tekoälylle. Mitä tarkempi prompti, sitä parempi tulos.
          </p>
        </div>
      </div>

      {hidden && <div className="pb-4" />}
    </div>
  );
}
