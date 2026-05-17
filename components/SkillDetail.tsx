'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Skill, SkillStep,
  SUBJECT_LABELS, LEVEL_LABELS, TOOL_LABELS, USE_CASE_LABELS,
} from '@/lib/types';
import OpenInAIButtons from '@/components/OpenInAIButtons';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';
import CommentSection from '@/components/CommentSection';
import { trackView, trackCopy } from '@/lib/track';

const SUBJECT_DOT: Record<string, string> = {
  math: '#3B82F6', science: '#16A34A', languages: '#9333EA', history: '#D97706',
  arts: '#EC4899', entrepreneurship: '#F97316', computer_science: '#64748B', general: '#8A8070',
};

const TOOL_ICONS: Record<string, string> = {
  chatgpt: '🤖', claude: '🧠', gemini: '✨', copilot: '💻', any: '🔧',
};

/* ── Step accordion card ─────────────────────────────────────── */

function StepCard({
  step, index, isLastStep, isPro, skillId,
}: {
  step: SkillStep; index: number; isLastStep: boolean; isPro: boolean; skillId: string;
}) {
  const [expanded, setExpanded] = useState(index === 0); // first step open by default
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(step.prompt_text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = step.prompt_text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    trackCopy('skill', skillId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-card border border-warm-border rounded-2xl overflow-hidden transition-shadow ${expanded ? 'shadow-sm' : ''}`}>
      {/* Step header — always visible, clickable to expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-background/50 transition-colors"
        aria-expanded={expanded}
      >
        {/* Number circle */}
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-teal text-white font-serif font-bold text-base shrink-0 mt-0.5">
          {step.step_number}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-foreground leading-snug text-base">
            {step.title}
          </h3>
          {step.description && (
            <p className="text-sm text-muted mt-1 leading-relaxed line-clamp-2">
              {step.description}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-muted shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Step connector line (except last) */}
      {!isLastStep && !expanded && (
        <div className="ml-[2.75rem] h-px bg-warm-border" />
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-warm-border">
          {step.description && (
            <p className="text-sm text-muted mt-4 mb-4 leading-relaxed">{step.description}</p>
          )}

          {/* Prompt block */}
          <div className="relative">
            <pre
              className={`bg-background border border-warm-border rounded-2xl p-5 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto${isPro ? ' select-none' : ''}`}
            >
              {step.prompt_text}
            </pre>

            {/* PRO blur overlay */}
            {isPro && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-background/40" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="bg-card rounded-2xl border border-warm-border p-6 max-w-xs text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white mb-3">
                      PRO
                    </span>
                    <p className="text-sm text-muted mb-4 leading-relaxed">
                      Tämä vaihe on saatavilla Pro-tilaajille.
                    </p>
                    <button className="w-full py-2.5 px-5 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark transition-colors">
                      Avaa Pro — 9 €/kk
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action row — free steps only */}
          {!isPro && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted mb-2">Avaa suoraan tekoälychatissa:</p>
                <OpenInAIButtons prompt_text={step.prompt_text} trackId={skillId} trackType="skill" />
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors shrink-0 sm:self-end"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */

type Props = { skill: Skill };

export default function SkillDetail({ skill }: Props) {
  const dotColor = SUBJECT_DOT[skill.subject] ?? '#8A8070';
  const stepCount = skill.steps.length;
  const stepLabel = stepCount === 1 ? '1 vaihe' : `${stepCount} vaihetta`;

  // Track view once per session
  useEffect(() => {
    trackView('skill', skill.id);
  }, [skill.id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Back link */}
      <Link
        href="/skills"
        className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Takaisin skilleihin
      </Link>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} aria-hidden="true" />
          {SUBJECT_LABELS[skill.subject]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-teal/60 shrink-0" aria-hidden="true" />
          {LEVEL_LABELS[skill.level]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="text-base">{TOOL_ICONS[skill.tool] ?? '🔧'}</span>
          {TOOL_LABELS[skill.tool]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-mustard/60 shrink-0" aria-hidden="true" />
          {USE_CASE_LABELS[skill.use_case]}
        </span>
        {/* Step count */}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-light text-teal border border-teal/20">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {stepLabel}
        </span>
        {skill.is_pro && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white">
            PRO
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
        {skill.title}
      </h1>
      <p className="text-base text-muted leading-relaxed mb-4">{skill.description}</p>
      {/* Stats + like row */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <LikeButton
          item_type="skill"
          item_id={skill.id}
          initial_like_count={skill.like_count ?? 0}
          size="detail"
        />
        <BookmarkButton item_type="skill" item_id={skill.id} size="detail" />
        {((skill.view_count ?? 0) > 0 || (skill.copy_count ?? 0) > 0) && (
          <div className="flex items-center gap-3 text-xs text-muted/60">
            {(skill.view_count ?? 0) > 0 && (
              <span title="Katselukerrat" className="flex items-center gap-1">
                <span>👁</span> {skill.view_count}
              </span>
            )}
            {(skill.copy_count ?? 0) > 0 && (
              <span title="Kopiointikerrat" className="flex items-center gap-1">
                <span>📋</span> {skill.copy_count}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      {skill.tips && (
        <div className="bg-mustard-light border border-mustard/30 rounded-2xl p-5 mb-8">
          <p className="text-sm font-semibold text-foreground mb-1">Vinkit</p>
          <p className="text-sm text-foreground leading-relaxed">{skill.tips}</p>
        </div>
      )}

      {/* Steps */}
      <section>
        <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
          Vaiheet
        </h2>
        <div className="space-y-3">
          {skill.steps.map((step, index) => (
            <StepCard
              key={step.step_number}
              step={step}
              index={index}
              isLastStep={index === skill.steps.length - 1}
              isPro={skill.is_pro}
              skillId={skill.id}
            />
          ))}
        </div>
      </section>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {skill.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-terracotta-light text-terracotta">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments */}
      <CommentSection
        item_type="skill"
        item_id={skill.id}
        initial_comment_count={skill.comment_count}
      />
    </div>
  );
}
