'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Prompt, SUBJECT_LABELS, LEVEL_LABELS, TOOL_LABELS, USE_CASE_LABELS } from '@/lib/types';
import OpenInAIButtons from '@/components/OpenInAIButtons';
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

/* Matches the dot colours in PromptCard */
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
  prompt: Prompt;
};

export default function PromptDetail({ prompt }: Props) {
  const [copied, setCopied] = useState(false);

  // Track view once per session
  useEffect(() => {
    trackView('prompt', prompt.id);
  }, [prompt.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt.prompt_text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    trackCopy('prompt', prompt.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dotColor = SUBJECT_DOT[prompt.subject] ?? '#8A8070';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Takaisin kirjastoon
      </Link>

      {/* Meta — dot labels, matching PromptCard style */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
            aria-hidden="true"
          />
          {SUBJECT_LABELS[prompt.subject]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-teal/60 shrink-0" aria-hidden="true" />
          {LEVEL_LABELS[prompt.level]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="text-base">{TOOL_ICONS[prompt.tool] ?? '🔧'}</span>
          {TOOL_LABELS[prompt.tool]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-mustard/60 shrink-0" aria-hidden="true" />
          {USE_CASE_LABELS[prompt.use_case]}
        </span>
        {prompt.is_pro && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white">
            PRO
          </span>
        )}
      </div>

      {/* Title + description */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
        {prompt.title}
      </h1>
      <p className="text-base text-muted leading-relaxed mb-4">{prompt.description}</p>
      {/* Stats + like row */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <LikeButton
          item_type="prompt"
          item_id={prompt.id}
          initial_like_count={prompt.like_count ?? 0}
          size="detail"
        />
        <BookmarkButton item_type="prompt" item_id={prompt.id} size="detail" />
        {((prompt.view_count ?? 0) > 0 || (prompt.copy_count ?? 0) > 0) && (
          <div className="flex items-center gap-3 text-xs text-muted/60">
            {(prompt.view_count ?? 0) > 0 && (
              <span title="Katselukerrat" className="flex items-center gap-1">
                <span>👁</span> {prompt.view_count}
              </span>
            )}
            {(prompt.copy_count ?? 0) > 0 && (
              <span title="Kopiointikerrat" className="flex items-center gap-1">
                <span>📋</span> {prompt.copy_count}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Prompt text block */}
      <section className="mb-8">
        <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Promptiteksti</h2>

        <div className="relative">
          <pre
            className={`bg-card border border-warm-border rounded-2xl p-6 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto${prompt.is_pro ? ' select-none' : ''}`}
          >
            {prompt.prompt_text}
          </pre>

          {/* Pro blur overlay */}
          {prompt.is_pro && (
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
                    Tämä prompti on saatavilla Pro-tilaajille. Saat käyttöön kaikki PRO-promptit yhdellä tilauksella.
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

        {/* Action row: open in AI + copy — shown only for free prompts */}
        {!prompt.is_pro && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            {/* AI buttons with label */}
            <div className="flex-1">
              <p className="text-xs text-muted mb-2">Avaa suoraan tekoälychatissa:</p>
              <OpenInAIButtons prompt_text={prompt.prompt_text} trackId={prompt.id} trackType="prompt" />
            </div>

            {/* Copy button — right-aligned on desktop */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors shrink-0 sm:self-end"
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
                  Kopioi prompti
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-terracotta-light text-terracotta"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Example output */}
      {prompt.example_output && (
        <section className="mb-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Esimerkkivastaus</h2>
          <div className="bg-teal-light border border-teal/20 rounded-2xl p-6">
            <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
              {prompt.example_output}
            </pre>
          </div>
        </section>
      )}

      {/* Tips */}
      {prompt.tips && (
        <section className="mb-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Vinkit</h2>
          <div className="bg-mustard-light border border-mustard/30 rounded-2xl p-6">
            <p className="text-sm text-foreground leading-relaxed">{prompt.tips}</p>
          </div>
        </section>
      )}

      {/* Comments */}
      <CommentSection
        item_type="prompt"
        item_id={prompt.id}
        initial_comment_count={prompt.comment_count}
      />
    </div>
  );
}
