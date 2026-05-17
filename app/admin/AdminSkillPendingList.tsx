'use client';

import { useState } from 'react';
import { approveSkillAction, deleteSkillAction } from '@/app/actions/skillActions';
import { SUBJECT_LABELS, LEVEL_LABELS, TOOL_LABELS, USE_CASE_LABELS, type Subject, type Level, type Tool, type UseCase } from '@/lib/types';

export type PendingSkill = {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  tool: string;
  use_case: string;
  tags: string[];
  steps: Array<{ step_number: number; title: string; description: string; prompt_text: string }>;
  tips: string | null;
  submitted_by: string | null;
  created_at: string;
  view_count?: number;
  copy_count?: number;
  like_count?: number;
};

function PendingSkillCard({
  item, onApprove, onDelete, isFading, isLoading,
}: {
  item: PendingSkill;
  onApprove: () => void;
  onDelete: () => void;
  isFading: boolean;
  isLoading: boolean;
}) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div
      className="bg-card border border-warm-border rounded-2xl overflow-hidden"
      style={{
        transition: 'opacity 350ms ease, transform 350ms ease, max-height 400ms ease',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'translateY(-8px) scale(0.98)' : 'none',
        maxHeight: isFading ? '0px' : '3000px',
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground text-lg leading-snug">{item.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-muted">
                {item.submitted_by ?? 'Anonyymi'} ·{' '}
                {new Date(item.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{item.steps.length} vaihetta
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

        <p className="text-sm text-muted mb-4 leading-relaxed">{item.description}</p>

        {/* Steps preview */}
        <div className="space-y-2 mb-4">
          {item.steps.map((step) => (
            <div key={step.step_number} className="border border-warm-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === step.step_number ? null : step.step_number)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-background/50 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal text-white text-xs font-bold shrink-0">
                  {step.step_number}
                </span>
                <span className="text-sm font-medium text-foreground flex-1 truncate">{step.title}</span>
                <svg className={`w-4 h-4 text-muted transition-transform ${expandedStep === step.step_number ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedStep === step.step_number && (
                <div className="px-4 pb-3 border-t border-warm-border">
                  {step.description && <p className="text-xs text-muted mt-2 mb-2">{step.description}</p>}
                  <pre className="bg-background rounded-lg p-3 text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                    {step.prompt_text}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-muted">#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-warm-border">
          <button
            onClick={onApprove} disabled={isLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '✓ Hyväksy'}
          </button>
          <button
            onClick={onDelete} disabled={isLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '✕ Hylkää'}
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = { initialItems: PendingSkill[] };

export default function AdminSkillPendingList({ initialItems }: Props) {
  const [items, setItems] = useState<PendingSkill[]>(initialItems);
  const [fading, setFading] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const removeWithAnimation = (id: string) => {
    setFading((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFading((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setLoading((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }, 420);
  };

  const handleApprove = async (id: string) => {
    setLoading((prev) => new Set(prev).add(id));
    try {
      await approveSkillAction(id);
      removeWithAnimation(id);
    } catch (err) {
      setLoading((prev) => { const n = new Set(prev); n.delete(id); return n; });
      alert('Virhe: ' + (err instanceof Error ? err.message : 'Tuntematon virhe'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hylätäänkö skill pysyvästi?\n\nTätä ei voi peruuttaa.')) return;
    setLoading((prev) => new Set(prev).add(id));
    try {
      await deleteSkillAction(id);
      removeWithAnimation(id);
    } catch (err) {
      setLoading((prev) => { const n = new Set(prev); n.delete(id); return n; });
      alert('Virhe: ' + (err instanceof Error ? err.message : 'Tuntematon virhe'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-lg font-semibold text-foreground mb-2">Kaikki käsitelty!</p>
        <p className="text-sm text-muted">Ei odottavia skillejä tällä hetkellä.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <PendingSkillCard
          key={item.id} item={item}
          isFading={fading.has(item.id)}
          isLoading={loading.has(item.id)}
          onApprove={() => handleApprove(item.id)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
}
