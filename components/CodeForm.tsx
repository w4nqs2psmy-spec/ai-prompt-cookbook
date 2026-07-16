'use client';

import { useState, useId } from 'react';
import {
  CodeLanguage,
  Subject,
  Level,
  Tool,
  UseCase,
  CODE_LANGUAGE_LABELS,
  SUBJECT_LABELS,
  LEVEL_LABELS,
  TOOL_LABELS,
  USE_CASE_LABELS,
} from '@/lib/types';

/* ── Types ───────────────────────────────────────────────────── */

export type CodeFormFields = {
  title: string;
  description: string;
  code_text: string;
  code_language: CodeLanguage;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  is_pro: boolean;
};

type FormState = Omit<CodeFormFields, 'tags'> & { tags: string };

type ToastKind = 'success' | 'error';

/* ── Constants ───────────────────────────────────────────────── */

const CODE_LANGUAGES: CodeLanguage[] = [
  'javascript', 'python', 'sql', 'html', 'css',
  'java', 'csharp', 'cpp', 'php', 'ruby',
  'go', 'rust', 'typescript', 'bash', 'other',
];
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
  code_text: '',
  code_language: 'javascript',
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
  onSubmit?: (data: CodeFormFields) => Promise<void>;
  isAdmin?: boolean;
  submitLabel?: string;
  successMessage?: string;
};

export default function CodeForm({
  onSubmit,
  isAdmin = false,
  submitLabel = 'Lähetä koodi',
  successMessage = 'Koodi lähetetty!',
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
    code_text: !form.code_text.trim(),
  };

  const showError = (key: keyof typeof errors) => touched[key] && errors[key];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({ title: true, description: true, code_text: true });
    if (errors.title || errors.description || errors.code_text) return;

    if (!onSubmit) {
      setToast({ kind: 'error', message: 'Lomake ei ole valmis' });
      return;
    }

    setSubmitting(true);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        code_text: form.code_text.trim(),
        code_language: form.code_language,
        subject: form.subject,
        level: form.level,
        tool: form.tool,
        use_case: form.use_case,
        tags,
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
            placeholder="Lyhyt, kuvaava otsikko koodille"
            className={inputClass(!!showError('title'))}
          />
          {showError('title') && <p className="mt-1 text-xs text-red-500">Otsikko on pakollinen</p>}
        </div>

        {/* Kuvaus */}
        <div>
          <FieldLabel htmlFor={id('description')} label="Kuvaus" required value={form.description} max={500} />
          <textarea
            id={id('description')}
            rows={3}
            maxLength={520}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            onBlur={() => touch('description')}
            placeholder="Mitä tämä koodi tekee? Miten opettaja hyötyy siitä?"
            className={`${inputClass(!!showError('description'))} resize-none`}
          />
          {showError('description') && <p className="mt-1 text-xs text-red-500">Kuvaus on pakollinen</p>}
        </div>

        {/* Ohjelmointikieli */}
        <div>
          <FieldLabel htmlFor={id('code_language')} label="Ohjelmointikieli" required />
          <SelectField<CodeLanguage>
            id={id('code_language')}
            value={form.code_language}
            onChange={(v) => set('code_language', v)}
            items={CODE_LANGUAGES}
            labels={CODE_LANGUAGE_LABELS}
          />
        </div>

        {/* Koodi */}
        <div>
          <FieldLabel htmlFor={id('code_text')} label="Koodi" required value={form.code_text} max={10000} />
          <textarea
            id={id('code_text')}
            rows={12}
            maxLength={10200}
            value={form.code_text}
            onChange={(e) => set('code_text', e.target.value)}
            onBlur={() => touch('code_text')}
            placeholder="Liitä koodiesi tähän..."
            className={`${inputClass(!!showError('code_text'))} resize-none font-mono text-xs`}
          />
          {showError('code_text') && <p className="mt-1 text-xs text-red-500">Koodi on pakollinen</p>}
        </div>

        {/* Aine */}
        <div>
          <FieldLabel htmlFor={id('subject')} label="Aine" />
          <SelectField<Subject>
            id={id('subject')}
            value={form.subject}
            onChange={(v) => set('subject', v)}
            items={SUBJECTS}
            labels={SUBJECT_LABELS}
          />
        </div>

        {/* Taso */}
        <div>
          <FieldLabel htmlFor={id('level')} label="Opetustaso" />
          <SelectField<Level>
            id={id('level')}
            value={form.level}
            onChange={(v) => set('level', v)}
            items={LEVELS}
            labels={LEVEL_LABELS}
          />
        </div>

        {/* Väline */}
        <div>
          <FieldLabel htmlFor={id('tool')} label="Väline" />
          <SelectField<Tool>
            id={id('tool')}
            value={form.tool}
            onChange={(v) => set('tool', v)}
            items={TOOLS}
            labels={TOOL_LABELS}
          />
        </div>

        {/* Käyttötapaus */}
        <div>
          <FieldLabel htmlFor={id('use_case')} label="Käyttötapaus" />
          <SelectField<UseCase>
            id={id('use_case')}
            value={form.use_case}
            onChange={(v) => set('use_case', v)}
            items={USE_CASES}
            labels={USE_CASE_LABELS}
          />
        </div>

        {/* Tunnisteissa */}
        <div>
          <FieldLabel htmlFor={id('tags')} label="Tunnisteita" value={form.tags} />
          <input
            id={id('tags')}
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="web, javascript, aloittelijat (erotettuna pilkuilla)"
            className={inputClass(false)}
          />
        </div>

        {/* Pro checkbox — admin only */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <input
              id={id('is_pro')}
              type="checkbox"
              checked={form.is_pro}
              onChange={(e) => set('is_pro', e.target.checked)}
              className="w-4 h-4 rounded border border-warm-border cursor-pointer"
            />
            <label htmlFor={id('is_pro')} className="text-sm font-medium text-foreground cursor-pointer">
              Pro-sisältö
            </label>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Lähetetään...' : submitLabel}
        </button>
      </form>

      {/* Toast notification */}
      {toast && (
        <Toast
          kind={toast.kind}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
