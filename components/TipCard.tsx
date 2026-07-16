'use client';

import Link from 'next/link';
import { Tip, SUBJECT_LABELS, LEVEL_LABELS } from '@/lib/types';
import { Profile } from '@/lib/profiles';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';

/* Small coloured dot per subject */
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
  profile?: Profile | null;
};

export default function TipCard({ tip, profile }: Props) {
  const dotColor = SUBJECT_DOT[tip.subject] ?? '#8A8070';

  return (
    <Link href={`/tips/${tip.id}`} className="block group">
      <article className="card-accent bg-card rounded-xl border border-warm-border p-6 flex flex-col">
        {/* Top row: meta dots + PRO badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {/* Subject dot label */}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              {SUBJECT_LABELS[tip.subject]}
            </span>
            {/* Level dot label */}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal/60 shrink-0" aria-hidden="true" />
              {LEVEL_LABELS[tip.level]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <BookmarkButton item_type="tip" item_id={tip.id} size="card" />
            {tip.is_pro && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white">
                PRO
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif text-[1.05rem] font-semibold leading-snug text-foreground group-hover:text-teal transition-colors duration-200 mb-2">
          {tip.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed mb-4">
          {tip.description}
        </p>

        {/* Tip preview (first 3 lines) — truncated with ellipsis */}
        <div className="mb-4 p-3 bg-foreground/5 rounded-lg border border-warm-border/50 text-xs text-muted overflow-hidden">
          <pre className="line-clamp-3 whitespace-pre-wrap break-words">{tip.tip_text}</pre>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-warm-border">
          <div className="flex items-center gap-2 min-w-0">
            {/* Contributor avatar + name */}
            {profile && (
              <>
                <Link
                  href={`/profile/${profile.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 min-w-0 group/author"
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: profile.avatar_color }}
                    aria-hidden="true"
                  >
                    {profile.avatar_initials}
                  </span>
                  <span className="text-xs text-muted truncate group-hover/author:text-teal transition-colors">
                    {profile.display_name}
                  </span>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-2">
            {/* Usage counters */}
            <span className="flex items-center gap-2 text-[11px] text-muted/60">
              {(tip.view_count ?? 0) > 0 && (
                <span title="Katselukerrat">👁 {tip.view_count}</span>
              )}
              {(tip.copy_count ?? 0) > 0 && (
                <span title="Kopiointikerrat">📋 {tip.copy_count}</span>
              )}
              {tip.comment_count !== undefined && (
                <span title="Kommentit">💬 {tip.comment_count}</span>
              )}
            </span>
            {/* Like button */}
            <LikeButton
              item_type="tip"
              item_id={tip.id}
              initial_like_count={tip.like_count ?? 0}
              size="card"
            />
            <span className="text-xs font-medium text-teal opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Avaa →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
