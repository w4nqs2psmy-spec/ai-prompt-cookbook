'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tip, SUBJECT_LABELS, LEVEL_LABELS, TOOL_LABELS, USE_CASE_LABELS } from '@/lib/types';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';
import CommentSection from '@/components/CommentSection';
import { trackView, trackCopy } from '@/lib/track';

const TOOL_ICONS: Record<string, string> = {
  chatgpt: '🤖',
  claude: '🧠',
  gemini: '✨',
  copilot: '💻',
  any: '🔧',
};

/* Matches the dot colours in CodeCard */
const SUBJECT_DOT: Record<string, string> = {
  math: '#3B82F6',
  science: '#16A34A',
  languages: '#9333EA',
  history: '#D97706',
  arts: '#EC4899',
  entrepreneurship: '#F97316',
  computer_science: '#64748B',
  general: '#8A8070',
};

type Props = {
  tip: Tip;
};

export default function TipDetail({ tip }: Props) {
  const [copied, setCopied] = useState(false);

  // Track view once per session
  useEffect(() => {
    trackView('tip', tip.id);
  }, [tip.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tip.tip_text);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = tip.tip_text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    trackCopy('tip', tip.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dotColor = SUBJECT_DOT[tip.subject] ?? '#8A8070';
  

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/tips"
        className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Takaisin vinkkeihin
      </Link>

      {/* Meta — dot labels */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
            aria-hidden="true"
          />
          {SUBJECT_LABELS[tip.subject]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-teal/60 shrink-0" aria-hidden="true" />
          {LEVEL_LABELS[tip.level]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="text-base">{TOOL_ICONS[tip.tool] ?? '🔧'}</span>
          {TOOL_LABELS[tip.tool]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-mustard/60 shrink-0" aria-hidden="true" />
          {USE_CASE_LABELS[tip.use_case]}
        </span>
        {tip.is_pro && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white">
            PRO
          </span>
        )}
      </div>

      {/* Title + description */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
        {tip.title}
      </h1>
      <p className="text-base text-muted leading-relaxed mb-4">{tip.description}</p>

      {/* Stats + like row */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <LikeButton
          item_type="tip"
          item_id={tip.id}
          initial_like_count={tip.like_count ?? 0}
          size="detail"
        />
        <BookmarkButton item_type="tip" item_id={tip.id} size="detail" />
        {((tip.view_count ?? 0) > 0 || (tip.copy_count ?? 0) > 0) && (
          <div className="flex items-center gap-3 text-xs text-muted/60">
            {(tip.view_count ?? 0) > 0 && (
              <span title="Katselukerrat" className="flex items-center gap-1">
                <span>👁</span> {tip.view_count}
              </span>
            )}
            {(tip.copy_count ?? 0) > 0 && (
              <span title="Kopiointikerrat" className="flex items-center gap-1">
                <span>📋</span> {tip.copy_count}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tip text section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-foreground">Vinkki</h2>
        </div>

        <div className="relative">
          <pre
            className={`bg-card border border-warm-border rounded-2xl p-6 text-sm text-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto${tip.is_pro ? ' select-none' : ''}`}
          >
            {tip.tip_text}
          </pre>

          {/* Pro blur overlay */}
          {tip.is_pro && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-background/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-card rounded-2xl border border-warm-border p-8 max-w-sm">
                  <div className="text-4xl mb-3">🔒</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white mb-4">
                    PRO
                  </span>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">Avaa Pro-tilillä</h3>
                  <p className="text-sm text-muted mb-6">
                    Tämä vinkki on saatavilla Pro-tilaajille. Saat käyttöön kaikki PRO-vinkit yhdellä tilauksella.
                  </p>
                  <button className="w-full py-3 px-6 rounded-xl bg-teal text-white font-semibold text-base hover:bg-teal-dark transition-colors">
                    Avaa Pro-tilillä — 9 €/kk
                  </button>
                  <p className="text-xs text-muted mt-3">Peruuta koska tahansa</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Copy button — shown only for free tips */}
        {!tip.is_pro && (
          <div className="mt-4 flex">
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors"
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4 animate-check"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kopioitu!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Kopioi vinkki
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Tags */}
      {tip.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tip.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-terracotta-light text-terracotta"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <CommentSection
        item_type="tip"
        item_id={tip.id}
        initial_comment_count={tip.comment_count}
      />
    </div>
  );
}
