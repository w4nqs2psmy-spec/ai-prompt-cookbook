'use client';

import { useState } from 'react';
import { toggleTipApprovalAction } from '@/app/actions/adminActions';
import {
  SUBJECT_LABELS,
  LEVEL_LABELS,
  TOOL_LABELS,
  type Subject,
  type Level,
  type Tool,
} from '@/lib/types';

export type SubmittedTip = {
  id: string;
  title: string;
  description: string;
  tip_text: string;
  
  subject: string;
  level: string;
  tool: string;
  tags: string[];
  submitted_by: string;
  is_approved: boolean;
  created_at: string;
  view_count?: number;
  copy_count?: number;
  like_count?: number;
};

// ── Per-card component (owns its own expanded state) ───────

function TipCard({
  item,
  onToggle,
  isFading,
  isLoading,
}: {
  item: SubmittedTip;
  onToggle: () => void;
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
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted mb-4 leading-relaxed">{item.description}</p>

        {/* Expand/collapse tip */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-sm text-teal hover:text-teal-dark font-medium transition-colors mb-3"
        >
          {expanded ? 'Piilota vinkki ▲' : 'Näytä vinkki ▼'}
        </button>

        {expanded && (
          <pre className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed mb-3 max-h-64 overflow-y-auto">
            {item.tip_text}
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

        {/* Status + action button */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="flex-1">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              item.is_approved
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {item.is_approved ? '✓ Hyväksytty' : '⏳ Odottaa hyväksyntää'}
            </span>
          </div>
          <button
            onClick={onToggle}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              item.is_approved
                ? 'bg-gray-100 text-muted hover:bg-gray-200'
                : 'bg-teal text-white hover:bg-teal-dark'
            }`}
          >
            {isLoading ? '...' : (item.is_approved ? '← Peruuta' : '✓ Hyväksy')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── List component ────────────────────────────────────────

type Props = {
  initialItems: SubmittedTip[];
};

export default function AdminTipsPendingList({ initialItems }: Props) {
  const [items, setItems] = useState<SubmittedTip[]>(initialItems);
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const handleToggle = async (id: string, currentApproved: boolean) => {
    setLoading((prev) => new Set(prev).add(id));
    try {
      await toggleTipApprovalAction(id, !currentApproved);
      // Update the item in place instead of removing
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_approved: !currentApproved } : item
        )
      );
    } catch (err) {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert('Virhe: ' + (err instanceof Error ? err.message : 'Tuntematon virhe'));
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-lg font-semibold text-foreground mb-2">Kaikki käsitelty!</p>
        <p className="text-sm text-muted">Ei odottavia koodeja tällä hetkellä.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <TipCard
          key={item.id}
          item={item}
          isFading={false}
          isLoading={loading.has(item.id)}
          onToggle={() => handleToggle(item.id, item.is_approved)}
        />
      ))}
    </div>
  );
}
