'use client';

import { useState, useId } from 'react';
import {
  Subject,
  Level,
  Tool,
  UseCase,
  SUBJECT_LABELS,
  LEVEL_LABELS,
  TOOL_LABELS,
  USE_CASE_LABELS,
} from '@/lib/types';

/* ── Types ───────────────────────────────────────────────────── */

export type TipFormFields = {
  title: string;
  description: string;
  tip_text: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  is_pro: boolean;
};

type FormState = Omit<TipFormFields, 'tags'> & { tags: string };

type ToastKind = 'success' | 'error';

/* ── Constants ───────────────────────────────────────────────── */

const SUBJECTS: Subject[] = [
  'math', 'science', 'languages', 'history',
  'arts', 'entrepreneurship', 'computer_science', 'general',
];
const LEVELS: Level[] = [
  'primary', 'lower_secondary', 'upper_secondary',
  'higher_education', 'adult_education',
];
const TOOLS: Tool[] = ['chatgpt', 'claude', 'gemini', 'copilot', 'any'];
const USE_CASES: UseCase[] = [
  'lesson_planning', 'assessment', 'differentiation', 'feedback',
  'group_work', 'creative_tasks', 'research', 'admin',
];

const INITIAL: FormState = {
  title: '',
  description: '',
  tip_text: '',
  subject: 'general',
  level: 'primary',
  tool: 'any',
  use_case: 'lesson_planning',
  tags: '',
  is_pro: false,
};

/* ── Sub-components ──────────────────────────────────────────── */

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs tabular-nums ${over ? 'text-red-500' : 'text-muted'}`}>
      {value.length}/{max}
    </span>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required,
  value,
  max,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  value?: string;
  max?: number;
}) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-terracotta ml-0.5">*</span>}
      </label>
      {value !== undefined && max !== undefined && (
        <CharCount value={value} max={max} />
      )}
    </div>
  );
}

const baseInput =
  'w-full rounded-xl border px-4 py-3 text-sm text-foreground bg-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors';

function inputClass(invalid: boolean) {
  return `${baseInput} ${invalid ? 'border-red-400' : 'border-warm-border'}`;
}

type Props = {
  onSubmit: (data: TipFormFields) => Promise<void>;
  isAdmin?: boolean;
  submitLabel?: string;
  successMessage?: string;
};

export default function TipForm({
  onSubmit,
  isAdmin = false,
  submitLabel = 'Lähetä',
  successMessage = 'Kiitos! Vinkki on lähetetty.',
}: Props) {
  const id = useId();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ kind: ToastKind; msg: string } | null>(null);

  const invalidTitle = form.title.length > 100;
  const invalidDesc = form.description.length > 500;
  const invalidTip = form.tip_text.length > 10000;

  const handleChange = (field: keyof FormState, val: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.tip_text.trim()) {
      setToast({ kind: 'error', msg: 'Täytä kaikki pakolliset kentät.' });
      return;
    }

    if (invalidTitle || invalidDesc || invalidTip) {
      setToast({ kind: 'error', msg: 'Liian pitkä sisältö joissain kentissä.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        tip_text: form.tip_text.trim(),
        subject: form.subject as Subject,
        level: form.level as Level,
        tool: form.tool as Tool,
        use_case: form.use_case as UseCase,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        is_pro: isAdmin ? form.is_pro : false,
      });
      setToast({ kind: 'success', msg: successMessage });
      setForm(INITIAL);
    } catch (err) {
      setToast({ kind: 'error', msg: err instanceof Error ? err.message : 'Virhe' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {toast && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            toast.kind === 'success'
              ? 'bg-teal-light border border-teal/30 text-teal'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Title */}
      <div>
        <FieldLabel htmlFor={`${id}-title`} label="Otsikko" required value={form.title} max={100} />
        <input
          id={`${id}-title`}
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Lyhyt ja selkeä otsikko vinkkiin"
          maxLength={100}
          className={inputClass(invalidTitle)}
        />
      </div>

      {/* Description */}
      <div>
        <FieldLabel htmlFor={`${id}-desc`} label="Kuvaus" required value={form.description} max={500} />
        <textarea
          id={`${id}-desc`}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Miksi tämä vinkki on hyödyllinen?"
          maxLength={500}
          rows={2}
          className={inputClass(invalidDesc)}
        />
      </div>

      {/* Tip text */}
      <div>
        <FieldLabel htmlFor={`${id}-tip`} label="Vinkki" required value={form.tip_text} max={10000} />
        <textarea
          id={`${id}-tip`}
          value={form.tip_text}
          onChange={(e) => handleChange('tip_text', e.target.value)}
          placeholder="Kirjoita täydellinen vinkki..."
          maxLength={10000}
          rows={6}
          className={inputClass(invalidTip)}
        />
      </div>

      {/* Subject, Level, Tool, Use Case */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor={`${id}-subj`} label="Oppiaine" />
          <select
            id={`${id}-subj`}
            value={form.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={inputClass(false)}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {SUBJECT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-level`} label="Opetustaso" />
          <select
            id={`${id}-level`}
            value={form.level}
            onChange={(e) => handleChange('level', e.target.value)}
            className={inputClass(false)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-tool`} label="Työkalu" />
          <select
            id={`${id}-tool`}
            value={form.tool}
            onChange={(e) => handleChange('tool', e.target.value)}
            className={inputClass(false)}
          >
            {TOOLS.map((t) => (
              <option key={t} value={t}>
                {TOOL_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-use`} label="Käyttötarkoitus" />
          <select
            id={`${id}-use`}
            value={form.use_case}
            onChange={(e) => handleChange('use_case', e.target.value)}
            className={inputClass(false)}
          >
            {USE_CASES.map((u) => (
              <option key={u} value={u}>
                {USE_CASE_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <FieldLabel htmlFor={`${id}-tags`} label="Tagit (pilkulla erotettu)" />
        <input
          id={`${id}-tags`}
          type="text"
          value={form.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="esim: motivaatio, palaute, oppilastyöskentely"
          className={inputClass(false)}
        />
      </div>

      {/* Pro toggle (admin only) */}
      {isAdmin && (
        <div className="flex items-center gap-3">
          <input
            id={`${id}-pro`}
            type="checkbox"
            checked={form.is_pro}
            onChange={(e) => handleChange('is_pro', e.target.checked)}
            className="w-4 h-4 rounded border-warm-border cursor-pointer"
          />
          <label htmlFor={`${id}-pro`} className="text-sm font-medium text-foreground cursor-pointer">
            Pro-vinkki
          </label>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || invalidTitle || invalidDesc || invalidTip}
        className="w-full px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Lähetetään...' : submitLabel}
      </button>
    </form>
  );
}
