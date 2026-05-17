'use client';

import { useState } from 'react';
import { approvePromptAction, deletePromptAction } from '@/app/actions/adminActions';
import {
  SUBJECT_LABELS,
  LEVEL_LABELS,
  TOOL_LABELS,
  USE_CASE_LABELS,
  type Subject,
  type Level,
  type Tool,
  type UseCase,
} from '@/lib/types';

export type SubmittedPrompt = {
  id: string;
  title: string;
  description: string;
  prompt_text: string;
  subject: string;
  level: string;
  tool: string;
  use_case: string;
  tags: string[];
  example_output: string | null;
  tips: string | null;
  submitted_by: string;
  created_at: string;
  view_count?: number;
  copy_count?: number;
  like_count?: number;
};

// ── Per-card component (owns its own expanded state) ───────

function PendingCard({
  item,
  onApprove,
  onDelete,
  isFading,
  isLoading,
}: {
  item: SubmittedPrompt;
  onApprove: () => void;
  onDelete: () => void;
  isFading: boolean;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-card border border-gray-100 rounded-2xl overflow-hidden"
      style={{
        transition: 'opacity 350ms ease, transform 350ms ease, max-height 400ms ease',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'translateY(-8px) scale(0.98)' : 'none',
        maxHeight: isFading ? '0px' : '2000px',
        marginBottom: isFading ? '0' : undefined,
      }}
    >
      <div className="p-6">
        {/* Card header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground text-lg leading-snug">{item.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-muted">
                {item.submitted_by} ·{' '}
                {new Date(item.created_at).toLocaleDateString('fi-FI', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              {((item.view_count ?? 0) > 0 || (item.copy_count ?? 0) > 0 || (item.like_count ?? 0) > 0) && (
                <span className="flex items-center gap-2 text-[11px] text-muted/60">
                  {(item.view_count ?? 0) > 0 && <span>👁 {item.view_count}</span>}
                  {(item.copy_count ?? 0) > 0 && <span>📋 {item.copy_count}</span>}
                  {(item.like_count ?? 0) > 0 && <span className="text-red-400">♥ {item.like_count}</span>}
                </span>
              )}
            </div>
          </div>
          {/* Meta badges */}
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-light text-teal font-medium">
              {SUBJECT_LABELS[item.subject as Subject] ?? item.subject}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-muted font-medium">
              {LEVEL_LABELS[item.level as Level] ?? item.level}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-muted font-medium">
              {TOOL_LABELS[item.tool as Tool] ?? item.tool}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-muted font-medium">
              {USE_CASE_LABELS[item.use_case as UseCase] ?? item.use_case}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted mb-4 leading-relaxed">{item.description}</p>

        {/* Expand/collapse prompt text */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-sm text-teal hover:text-teal-dark font-medium transition-colors mb-3"
        >
          {expanded ? 'Piilota promptiteksti ▲' : 'Näytä promptiteksti ▼'}
        </button>

        {expanded && (
          <pre className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed mb-3 max-h-64 overflow-y-auto">
            {item.prompt_text}
          </pre>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Optional fields summary */}
        {(item.example_output || item.tips) && (
          <div className="flex gap-3 mb-4">
            {item.example_output && (
              <span className="text-xs text-teal bg-teal-light px-2.5 py-1 rounded-full">
                ✓ Esimerkkivastaus
              </span>
            )}
            {item.tips && (
              <span className="text-xs text-teal bg-teal-light px-2.5 py-1 rounded-full">
                ✓ Vinkit
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onApprove}
            disabled={isLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '✓ Hyväksy'}
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '✕ Hylkää'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── List component ────────────────────────────────────────

type Props = {
  initialItems: SubmittedPrompt[];
};

export default function AdminPendingList({ initialItems }: Props) {
  const [items, setItems] = useState<SubmittedPrompt[]>(initialItems);
  const [fading, setFading] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());

  /** Triggers the fade-out animation then removes the card from state. */
  const removeWithAnimation = (id: string) => {
    setFading((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 420); // slightly longer than CSS transition
  };

  const handleApprove = async (id: string) => {
    setLoading((prev) => new Set(prev).add(id));
    try {
      await approvePromptAction(id);
      removeWithAnimation(id);
    } catch (err) {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert('Virhe: ' + (err instanceof Error ? err.message : 'Tuntematon virhe'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Hylätäänkö prompti pysyvästi?\n\nTätä ei voi peruuttaa.`)) return;
    setLoading((prev) => new Set(prev).add(id));
    try {
      await deletePromptAction(id);
      removeWithAnimation(id);
    } catch (err) {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert('Virhe: ' + (err instanceof Error ? err.message : 'Tuntematon virhe'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-lg font-semibold text-foreground mb-2">Kaikki käsitelty!</p>
        <p className="text-sm text-muted">Ei odottavia prompteja tällä hetkellä.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <PendingCard
          key={item.id}
          item={item}
          isFading={fading.has(item.id)}
          isLoading={loading.has(item.id)}
          onApprove={() => handleApprove(item.id)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
}
