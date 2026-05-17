'use client';

/**
 * SkillForm
 * ─────────────────────────────────────────────────────────────
 * Shared form for /admin/skills/add and /skills/submit.
 * Includes dynamic steps management (add, remove, reorder).
 */

import { useState, useId } from 'react';
import {
  Subject, Level, Tool, UseCase,
  SUBJECT_LABELS, LEVEL_LABELS, TOOL_LABELS, USE_CASE_LABELS,
} from '@/lib/types';

/* ── Types ───────────────────────────────────────────────────── */

export type SkillStepField = {
  title: string;
  description: string;
  prompt_text: string;
};

export type SkillFormFields = {
  title: string;
  description: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  steps: Array<{ step_number: number; title: string; description: string; prompt_text: string }>;
  tips: string;
  is_pro: boolean;
};

type FormState = {
  title: string;
  description: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string;
  tips: string;
  is_pro: boolean;
};

type ToastKind = 'success' | 'error';

/* ── Constants ───────────────────────────────────────────────── */

const SUBJECTS: Subject[] = ['math','science','languages','history','arts','entrepreneurship','computer_science','general'];
const LEVELS: Level[] = ['primary','lower_secondary','upper_secondary','higher_education','adult_education'];
const TOOLS: Tool[] = ['chatgpt','claude','gemini','copilot','any'];
const USE_CASES: UseCase[] = ['lesson_planning','assessment','differentiation','feedback','group_work','creative_tasks','research','admin'];

const INITIAL_FORM: FormState = {
  title: '', description: '',
  subject: 'general', level: 'primary', tool: 'any', use_case: 'lesson_planning',
  tags: '', tips: '', is_pro: false,
};

const INITIAL_STEP: SkillStepField = { title: '', description: '', prompt_text: '' };

/* ── Sub-components ──────────────────────────────────────────── */

const baseInput = 'w-full rounded-xl border px-4 py-3 text-sm text-foreground bg-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-colors';

function inputClass(invalid?: boolean) {
  return `${baseInput} ${invalid ? 'border-red-400' : 'border-warm-border'}`;
}

function FieldLabel({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground mb-1.5">
      {label}{required && <span className="text-terracotta ml-0.5">*</span>}
    </label>
  );
}

function SelectField<T extends string>({
  id, value, onChange, items, labels,
}: {
  id: string; value: T; onChange: (v: T) => void; items: T[]; labels: Record<T, string>;
}) {
  return (
    <div className="relative">
      <select
        id={id} value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`${baseInput} border-warm-border appearance-none pr-10 cursor-pointer`}
      >
        {items.map((item) => (
          <option key={item} value={item}>{labels[item]}</option>
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
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium animate-card-in ${kind === 'success' ? 'bg-teal text-white' : 'bg-red-500 text-white'}`}>
      {kind === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ── Step card ───────────────────────────────────────────────── */

function StepCard({
  index, total, step, onChange, onRemove, onMoveUp, onMoveDown, touched,
}: {
  index: number;
  total: number;
  step: SkillStepField;
  onChange: (field: keyof SkillStepField, value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  touched: boolean;
}) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  return (
    <div className="bg-white border border-warm-border rounded-2xl p-5">
      {/* Step header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal text-white font-serif font-bold text-sm shrink-0">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-foreground">Vaihe {index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-warm-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Siirrä ylös"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-warm-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Siirrä alas"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {total > 2 && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
              title="Poista vaihe"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <FieldLabel htmlFor={id('title')} label="Vaiheen otsikko" required />
          <input
            id={id('title')}
            type="text"
            maxLength={120}
            value={step.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Lyhyt, kuvaava otsikko vaiheelle"
            className={inputClass(touched && !step.title.trim())}
          />
          {touched && !step.title.trim() && (
            <p className="mt-1 text-xs text-red-500">Vaiheen otsikko on pakollinen</p>
          )}
        </div>

        {/* Description */}
        <div>
          <FieldLabel htmlFor={id('desc')} label="Vaiheen kuvaus" />
          <textarea
            id={id('desc')}
            rows={2}
            maxLength={300}
            value={step.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Mitä tässä vaiheessa tehdään?"
            className={`${inputClass()} resize-none`}
          />
        </div>

        {/* Prompt text */}
        <div>
          <FieldLabel htmlFor={id('prompt')} label="Promptiteksti" required />
          <textarea
            id={id('prompt')}
            rows={6}
            maxLength={2200}
            value={step.prompt_text}
            onChange={(e) => onChange('prompt_text', e.target.value)}
            placeholder="Kirjoita tai liitä tämän vaiheen prompti..."
            className={`${inputClass(touched && !step.prompt_text.trim())} resize-y font-mono text-[13px] leading-relaxed`}
          />
          {touched && !step.prompt_text.trim() && (
            <p className="mt-1 text-xs text-red-500">Promptiteksti on pakollinen</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */

type Props = {
  onSubmit: (data: SkillFormFields) => Promise<void>;
  showProCheckbox?: boolean;
  submitLabel?: string;
  successMessage?: string;
};

export default function SkillForm({
  onSubmit,
  showProCheckbox = false,
  submitLabel = 'Tallenna',
  successMessage = 'Tallennettu!',
}: Props) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [steps, setSteps] = useState<SkillStepField[]>([
    { ...INITIAL_STEP },
    { ...INITIAL_STEP },
  ]);
  const [touchedMeta, setTouchedMeta] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [touchedSteps, setTouchedSteps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ kind: ToastKind; message: string } | null>(null);

  function setMeta<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function touchMeta(key: keyof FormState) {
    setTouchedMeta((prev) => ({ ...prev, [key]: true }));
  }

  function updateStep(index: number, field: keyof SkillStepField, value: string) {
    setSteps((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  function addStep() {
    if (steps.length >= 10) return;
    setSteps((prev) => [...prev, { ...INITIAL_STEP }]);
  }

  function removeStep(index: number) {
    if (steps.length <= 2) return;
    if (!confirm(`Poistetaanko vaihe ${index + 1}?`)) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function moveStep(index: number, direction: 'up' | 'down') {
    const next = [...steps];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  }

  const metaErrors = {
    title: !form.title.trim(),
    description: !form.description.trim(),
  };

  const stepsValid = steps.every(
    (s) => s.title.trim() && s.prompt_text.trim()
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouchedMeta({ title: true, description: true });
    setTouchedSteps(true);

    if (metaErrors.title || metaErrors.description || !stepsValid) return;

    setSubmitting(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject,
        level: form.level,
        tool: form.tool,
        use_case: form.use_case,
        tags,
        steps: steps.map((s, i) => ({
          step_number: i + 1,
          title: s.title.trim(),
          description: s.description.trim(),
          prompt_text: s.prompt_text.trim(),
        })),
        tips: form.tips.trim(),
        is_pro: form.is_pro,
      });

      setToast({ kind: 'success', message: successMessage });
      setForm(INITIAL_FORM);
      setSteps([{ ...INITIAL_STEP }, { ...INITIAL_STEP }]);
      setTouchedMeta({});
      setTouchedSteps(false);
    } catch (err) {
      setToast({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Jokin meni pieleen.',
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
          <FieldLabel htmlFor={id('title')} label="Skillin otsikko" required />
          <input
            id={id('title')} type="text" maxLength={120}
            value={form.title}
            onChange={(e) => setMeta('title', e.target.value)}
            onBlur={() => touchMeta('title')}
            placeholder="Lyhyt, kuvaava otsikko skillille"
            className={inputClass(!!touchedMeta.title && metaErrors.title)}
          />
          {touchedMeta.title && metaErrors.title && <p className="mt-1 text-xs text-red-500">Otsikko on pakollinen</p>}
        </div>

        {/* Kuvaus */}
        <div>
          <FieldLabel htmlFor={id('desc')} label="Kuvaus" required />
          <textarea
            id={id('desc')} rows={3} maxLength={320}
            value={form.description}
            onChange={(e) => setMeta('description', e.target.value)}
            onBlur={() => touchMeta('description')}
            placeholder="Mitä tämä skill tekee? Miten opettaja hyötyy siitä?"
            className={`${inputClass(!!touchedMeta.description && metaErrors.description)} resize-none`}
          />
          {touchedMeta.description && metaErrors.description && <p className="mt-1 text-xs text-red-500">Kuvaus on pakollinen</p>}
        </div>

        {/* 2-column dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor={id('subject')} label="Oppiaine" />
            <SelectField id={id('subject')} value={form.subject} onChange={(v) => setMeta('subject', v)} items={SUBJECTS} labels={SUBJECT_LABELS} />
          </div>
          <div>
            <FieldLabel htmlFor={id('level')} label="Taso" />
            <SelectField id={id('level')} value={form.level} onChange={(v) => setMeta('level', v)} items={LEVELS} labels={LEVEL_LABELS} />
          </div>
          <div>
            <FieldLabel htmlFor={id('tool')} label="Työkalu" />
            <SelectField id={id('tool')} value={form.tool} onChange={(v) => setMeta('tool', v)} items={TOOLS} labels={TOOL_LABELS} />
          </div>
          <div>
            <FieldLabel htmlFor={id('usecase')} label="Käyttötarkoitus" />
            <SelectField id={id('usecase')} value={form.use_case} onChange={(v) => setMeta('use_case', v)} items={USE_CASES} labels={USE_CASE_LABELS} />
          </div>
        </div>

        {/* Tagit */}
        <div>
          <FieldLabel htmlFor={id('tags')} label="Tagit" />
          <input
            id={id('tags')} type="text"
            value={form.tags}
            onChange={(e) => setMeta('tags', e.target.value)}
            placeholder="esim. eriyttäminen, ryhmätyö, arviointi"
            className={inputClass()}
          />
          <p className="mt-1 text-xs text-muted">Erota pilkulla.</p>
        </div>

        {/* Divider */}
        <div className="border-t border-warm-border" />

        {/* Vaiheet */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-lg font-semibold text-foreground">Vaiheet</h2>
            <span className="text-sm text-muted">{steps.length}/10</span>
          </div>
          <p className="text-sm text-muted mb-5">
            Skill koostuu vähintään kahdesta vaiheesta. Jokainen vaihe sisältää otsikon ja promptin.
          </p>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                index={index}
                total={steps.length}
                step={step}
                touched={touchedSteps}
                onChange={(field, value) => updateStep(index, field, value)}
                onRemove={() => removeStep(index)}
                onMoveUp={() => moveStep(index, 'up')}
                onMoveDown={() => moveStep(index, 'down')}
              />
            ))}
          </div>

          {steps.length < 10 && (
            <button
              type="button"
              onClick={addStep}
              className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-warm-border text-sm text-muted hover:border-teal hover:text-teal font-medium transition-colors"
            >
              + Lisää vaihe
            </button>
          )}

          {touchedSteps && !stepsValid && (
            <p className="mt-2 text-xs text-red-500">Jokaisella vaiheella pitää olla otsikko ja promptiteksti.</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-warm-border" />

        {/* Vinkit */}
        <div>
          <FieldLabel htmlFor={id('tips')} label="Vinkit" />
          <textarea
            id={id('tips')} rows={3} maxLength={550}
            value={form.tips}
            onChange={(e) => setMeta('tips', e.target.value)}
            placeholder="Valinnainen. Miten tätä skilliä käytetään parhaiten?"
            className={`${inputClass()} resize-none`}
          />
        </div>

        {/* Pro checkbox — admin only */}
        {showProCheckbox && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.is_pro}
              onChange={(e) => setMeta('is_pro', e.target.checked)}
              className="w-4 h-4 rounded border-warm-border accent-[#1A7A6D] cursor-pointer"
            />
            <span className="text-sm text-foreground group-hover:text-teal transition-colors">
              Merkitse Pro-skilliksi
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

      {toast && <Toast kind={toast.kind} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}
