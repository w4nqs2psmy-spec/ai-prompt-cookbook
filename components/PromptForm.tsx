'use client';

/**
 * PromptForm
 * ─────────────────────────────────────────────────────────────
 * Shared form for both /admin/add (admin, with Pro checkbox) and
 * /submit (public, no Pro checkbox).
 *
 * The parent provides an `onSubmit` server action that receives the
 * cleaned form data. PromptForm handles all UI state: fields,
 * validation, submit loading, and toast notifications.
 */

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

export type PromptFormFields = {
  title: string;
  description: string;
  prompt_text: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];        // already split + trimmed
  example_output: string;
  tips: string;
  is_pro: boolean;
};

type FormState = Omit<PromptFormFields, 'tags'> & { tags: string }; // raw comma string in the field

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
  prompt_text: '',
  subject: 'general',
  level: 'primary',
  tool: 'any',
  use_case: 'lesson_planning',
  tags: '',
  example_output: '',
  tips: '',
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

function SelectField<T extends string>({
  id,
  value,
  onChange,
  items,
  labels,
}: {
  id: string;
  value: T;
  onChange: (v: T) => void;
  items: T[];
  labels: Record<T, string>;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`${baseInput} border-warm-border appearance-none pr-10 cursor-pointer`}
      >
        {items.map((item) => (
          <option key={item} value={item}>
            {labels[item]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}

function Toast({ kind, message, onClose }: { kind: ToastKind; message: string; onClose: () => void }) {
  const bg = kind === 'success' ? 'bg-teal text-white' : 'bg-red-500 text-white';
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium animate-card-in ${bg}`}
    >
      {kind === 'success' ? '✓' : '✕'}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */

type Props = {
  /** Called with cleaned data on valid submit. Throw to show an error toast. */
  onSubmit: (data: PromptFormFields) => Promise<void>;
  /** Show the Pro checkbox (admin only). Default: false. */
  showProCheckbox?: boolean;
  /** Submit button label. Default: "Tallenna" */
  submitLabel?: string;
  /** Toast message on success. Default: "Tallennettu!" */
  successMessage?: string;
};

export default function PromptForm({
  onSubmit,
  showProCheckbox = false,
  submitLabel = 'Tallenna',
  successMessage = 'Tallennettu!',
}: Props) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const [form, setForm] = useState<FormState>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ kind: ToastKind; message: string } | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function touch(key: keyof FormState) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  const errors = {
    title: !form.title.trim(),
    description: !form.description.trim(),
    prompt_text: !form.prompt_text.trim(),
  };

  const showError = (key: keyof typeof errors) => touched[key] && errors[key];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({ title: true, description: true, prompt_text: true });
    if (errors.title || errors.description || errors.prompt_text) return;

    setSubmitting(true);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        prompt_text: form.prompt_text.trim(),
        subject: form.subject,
        level: form.level,
        tool: form.tool,
        use_case: form.use_case,
        tags,
        example_output: form.example_output.trim(),
        tips: form.tips.trim(),
        is_pro: form.is_pro,
      });

      setToast({ kind: 'success', message: successMessage });
      setForm(INITIAL);
      setTouched({});
    } catch (err) {
      setToast({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Jokin meni pieleen, yritä uudelleen.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-7">

        {/* Otsikko */}
        <div>
          <FieldLabel htmlFor={id('title')} label="Otsikko" required value={form.title} max={100} />
          <input
            id={id('title')}
            type="text"
            maxLength={120}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            onBlur={() => touch('title')}
            placeholder="Lyhyt, kuvaava otsikko promptille"
            className={inputClass(!!showError('title'))}
          />
          {showError('title') && <p className="mt-1 text-xs text-red-500">Otsikko on pakollinen</p>}
        </div>

        {/* Kuvaus */}
        <div>
          <FieldLabel htmlFor={id('description')} label="Kuvaus" required value={form.description} max={300} />
          <textarea
            id={id('description')}
            rows={3}
            maxLength={320}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            onBlur={() => touch('description')}
            placeholder="Mitä tämä prompti tekee? Miten opettaja hyötyy siitä?"
            className={`${inputClass(!!showError('description'))} resize-none`}
          />
          {showError('description') && <p className="mt-1 text-xs text-red-500">Kuvaus on pakollinen</p>}
        </div>

        {/* Promptiteksti */}
        <div>
          <FieldLabel htmlFor={id('prompt_text')} label="Prompti" required value={form.prompt_text} max={2000} />
          <textarea
            id={id('prompt_text')}
            rows={10}
            maxLength={2200}
            value={form.prompt_text}
            onChange={(e) => set('prompt_text', e.target.value)}
            onBlur={() => touch('prompt_text')}
            placeholder="Kirjoita tai liitä promptiteksti tähän..."
            className={`${inputClass(!!showError('prompt_text'))} resize-y font-mono text-[13px] leading-relaxed`}
          />
          {showError('prompt_text') && <p className="mt-1 text-xs text-red-500">Promptiteksti on pakollinen</p>}
        </div>

        {/* 2-column dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor={id('subject')} label="Oppiaine" />
            <SelectField id={id('subject')} value={form.subject} onChange={(v) => set('subject', v)} items={SUBJECTS} labels={SUBJECT_LABELS} />
          </div>
          <div>
            <FieldLabel htmlFor={id('level')} label="Taso" />
            <SelectField id={id('level')} value={form.level} onChange={(v) => set('level', v)} items={LEVELS} labels={LEVEL_LABELS} />
          </div>
          <div>
            <FieldLabel htmlFor={id('tool')} label="Työkalu" />
            <SelectField id={id('tool')} value={form.tool} onChange={(v) => set('tool', v)} items={TOOLS} labels={TOOL_LABELS} />
          </div>
          <div>
            <FieldLabel htmlFor={id('use_case')} label="Käyttötarkoitus" />
            <SelectField id={id('use_case')} value={form.use_case} onChange={(v) => set('use_case', v)} items={USE_CASES} labels={USE_CASE_LABELS} />
          </div>
        </div>

        {/* Tagit */}
        <div>
          <FieldLabel htmlFor={id('tags')} label="Tagit" />
          <input
            id={id('tags')}
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="esim. eriyttäminen, ryhmätyö, arviointi"
            className={inputClass(false)}
          />
          <p className="mt-1 text-xs text-muted">Erota pilkulla. Välilyönnit poistetaan automaattisesti.</p>
        </div>

        {/* Divider */}
        <div className="border-t border-warm-border" />

        {/* Esimerkkivastaus */}
        <div>
          <FieldLabel htmlFor={id('example_output')} label="Esimerkkivastaus" value={form.example_output} max={1000} />
          <textarea
            id={id('example_output')}
            rows={5}
            maxLength={1100}
            value={form.example_output}
            onChange={(e) => set('example_output', e.target.value)}
            placeholder="Valinnainen. Liitä tähän esimerkki AI:n vastauksesta."
            className={`${inputClass(false)} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </div>

        {/* Vinkit */}
        <div>
          <FieldLabel htmlFor={id('tips')} label="Vinkit" value={form.tips} max={500} />
          <textarea
            id={id('tips')}
            rows={3}
            maxLength={550}
            value={form.tips}
            onChange={(e) => set('tips', e.target.value)}
            placeholder="Valinnainen. Miten muokata tai käyttää tätä promptia parhaiten?"
            className={`${inputClass(false)} resize-none`}
          />
        </div>

        {/* Pro checkbox — admin only */}
        {showProCheckbox && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.is_pro}
              onChange={(e) => set('is_pro', e.target.checked)}
              className="w-4 h-4 rounded border-warm-border accent-[#1A7A6D] cursor-pointer"
            />
            <span className="text-sm text-foreground group-hover:text-teal transition-colors">
              Merkitse Pro-promptiksi
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-mustard text-white">
              PRO
            </span>
          </label>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-teal text-white font-semibold text-base hover:bg-teal-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
        >
          {submitting ? 'Tallennetaan…' : submitLabel}
        </button>

      </form>

      {/* Toast */}
      {toast && (
        <Toast kind={toast.kind} message={toast.message} onClose={() => setToast(null)} />
      )}
    </>
  );
}
