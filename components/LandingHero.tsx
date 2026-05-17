'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import IntroBox from '@/components/IntroBox';

export default function LandingHero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/promptit?search=${encodeURIComponent(q)}`);
    } else {
      router.push('/promptit');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="pt-16 pb-14 px-4 border-b border-warm-border">
        <div className="max-w-7xl mx-auto">

          {/* Two-column layout: text 60% left, illustration 40% right */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">

            {/* ── Left column: all text content ───────────────────── */}
            <div className="flex-1 min-w-0 lg:max-w-[60%]">
              <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-4">
                Opettajien AI-työkalupakki
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-5 leading-none">
                Testattuja prompteja
                <br />
                <span className="keyword-highlight text-teal">opettajille</span>
              </h1>
              <p className="text-lg text-muted mb-10 leading-relaxed max-w-lg">
                Kopioi, muokkaa ja käytä suoraan. Jokainen prompti on suunniteltu
                suomalaiseen kouluympäristöön ja testattu oikeilla AI-työkaluilla.
              </p>

              {/* Search form — submits to /promptit */}
              <form onSubmit={handleSubmit} role="search">
                <div className="relative w-full max-w-xl">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Hae prompteja aiheella, oppiaineella tai avainsanalla..."
                    className="w-full pl-12 pr-28 py-4 text-base rounded-2xl border border-warm-border bg-white focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent placeholder-muted text-foreground"
                    aria-label="Hae prompteja"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-2 my-2 px-4 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors"
                  >
                    Hae
                  </button>
                </div>
              </form>

              {/* Browse links */}
              <p className="mt-4 text-sm text-muted">
                Tai selaa:{' '}
                <Link href="/promptit" className="text-teal hover:text-teal-dark font-medium transition-colors">
                  Promptit
                </Link>
                {' · '}
                <Link href="/skills" className="text-teal hover:text-teal-dark font-medium transition-colors">
                  Skillit
                </Link>
              </p>
            </div>

            {/* ── Right column: illustration ───────────────────────── */}
            <div className="mt-12 lg:mt-0 lg:w-[40%] flex justify-center lg:justify-end shrink-0">
              <div
                className="w-full max-w-[300px] lg:max-w-[400px]"
                style={{
                  animation: 'heroImageFadeIn 300ms ease-out both',
                }}
              >
                <Image
                  src="/images/hero-illustration.png"
                  alt="Opettajia käyttämässä tekoälyä yhdessä"
                  width={400}
                  height={400}
                  priority
                  className="w-full h-auto object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Intro / onboarding ──────────────────────────────────── */}
      <div className="py-8">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8">
          <IntroBox />
        </div>
      </div>

      {/* Keyframe for hero image fade-in */}
      <style>{`
        @keyframes heroImageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
