import Link from 'next/link';
import { Skill, SUBJECT_LABELS, LEVEL_LABELS, TOOL_LABELS } from '@/lib/types';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';

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

const TOOL_ICONS: Record<string, string> = {
  chatgpt: '🤖',
  claude: '🧠',
  gemini: '✨',
  copilot: '💻',
  any: '🔧',
};

type Props = {
  skill: Skill;
};

export default function SkillCard({ skill }: Props) {
  const dotColor = SUBJECT_DOT[skill.subject] ?? '#8A8070';
  const stepCount = skill.steps.length;
  const stepLabel = stepCount === 1 ? '1 vaihe' : `${stepCount} vaihetta`;

  return (
    <Link href={`/skills/${skill.id}`} className="block group">
      <article className="card-accent bg-card rounded-xl border border-warm-border p-6 flex flex-col">

        {/* Top row: meta dots + step badge + PRO */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
              {SUBJECT_LABELS[skill.subject]}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal/60 shrink-0" aria-hidden="true" />
              {LEVEL_LABELS[skill.level]}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Step count pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-light text-teal border border-teal/20">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {stepLabel}
            </span>
            <BookmarkButton item_type="skill" item_id={skill.id} size="card" />
            {skill.is_pro && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white">
                PRO
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif text-[1.05rem] font-semibold leading-snug text-foreground group-hover:text-teal transition-colors duration-200 mb-2">
          {skill.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed flex-1 mb-4">
          {skill.description}
        </p>

        {/* Step preview — show first 2 step titles */}
        <div className="mb-4 space-y-1">
          {skill.steps.slice(0, 2).map((step) => (
            <div key={step.step_number} className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal text-white font-bold text-[9px] shrink-0">
                {step.step_number}
              </span>
              <span className="truncate">{step.title}</span>
            </div>
          ))}
          {skill.steps.length > 2 && (
            <p className="text-xs text-muted/60 pl-6">+ {skill.steps.length - 2} vaihetta lisää</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-warm-border">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <span className="text-sm">{TOOL_ICONS[skill.tool] ?? '🔧'}</span>
            {TOOL_LABELS[skill.tool]}
          </span>
          <div className="flex items-center gap-3">
            {/* Usage counters */}
            <span className="flex items-center gap-2 text-[11px] text-muted/60">
              {(skill.view_count ?? 0) > 0 && (
                <span title="Katselukerrat">👁 {skill.view_count}</span>
              )}
              {(skill.copy_count ?? 0) > 0 && (
                <span title="Kopiointikerrat">📋 {skill.copy_count}</span>
              )}
              {skill.comment_count !== undefined && (
                <span title="Kommentit">💬 {skill.comment_count}</span>
              )}
            </span>
            {/* Like button */}
            <LikeButton
              item_type="skill"
              item_id={skill.id}
              initial_like_count={skill.like_count ?? 0}
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
