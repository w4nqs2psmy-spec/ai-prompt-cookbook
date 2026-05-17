'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitPromptAction } from '@/app/actions/submitPrompt';
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

// ── Constants ──────────────────────────────────────────────

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

const LIMITS = {
  title: 100,
  description: 300,
  prompt_text: 2000,
  example_output: 1000,
  tips: 500,
} as const;

const INITIAL_FORM = {
  title: '',
  description: '',
  prompt_text: '',
  subject: 'general' as Subject,
  level: 'primary' as Level,
  tool: 'any' as Tool,
  use_case: 'lesson_planning' as UseCase,
  tags: '',
  example_output: '',
  tips: '',
};

// ── Sub-components ─────────────────────────────────────────

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs tabular-nums ${over ? 'text-red-500 font-medium' : 'text-muted'}`}>
      {value.length}/{max}
    </span>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition';

const selectClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 text-foreground text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition appearance-none';

// ── Main component ─────────────────────────────────────────

export default function SubmitForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Generic field setter
  const set =
    (field: keyof typeof INITIAL_FORM) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Validate before allowing submit
  const isValid =
    form.title.trim() &&
    form.description.trim() &&
    form.prompt_text.trim() &&
    form.title.length <= LIMITS.title &&
    form.description.length <= LIMITS.description &&
    form.prompt_text.length <= LIMITS.prompt_text &&
    form.example_output.length <= LIMITS.example_output &&
    form.tips.length <= LIMITS.tips;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    startTransition(async () => {
      try {
        await submitPromptAction(form);
        setSuccess(true);
        // Redirect home after 3 seconds
        setTimeout(() => router.push('/'), 3000);
      } catch (err: unknown) {
        setSubmitError(
          err instanceof Error ? err.message : 'Jokin meni pieleen. Yritä uudelleen.'
        );
      }
    });
  };

  /* ── Success state ───────────────────────────────────── */
  if (success) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-5">✅</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Kiitos!</h2>
        <p className="text-base text-foreground font-medium mb-2">
          Promptisi on lähetetty tarkistettavaksi.
        </p>
        <p className="text-sm text-muted">
          Se julkaistaan kun ylläpitäjä on hyväksynyt sen.
          <br />
          Sinut ohjataan etusivulle hetken kuluttua...
        </p>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">
            Otsikko <span className="text-red-500">*</span>
          </label>
          <CharCount value={form.title} max={LIMITS.title} />
        </div>
        <input
          type="text"
          required
          value={form.title}
          onChange={set('title')}
          placeholder="Esim. Eriyttävä tehtäväsarja lukion matematiikkaan"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-muted">Lyhyt ja kuvaava – näkyy kortilla kirjastossa.</p>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">
            Kuvaus <span className="text-red-500">*</span>
          </label>
          <CharCount value={form.description} max={LIMITS.description} />
        </div>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={set('description')}
          placeholder="Mitä tämä prompti tekee? Miten se auttaa opettajaa?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Prompt text */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">
            Promptiteksti <span className="text-red-500">*</span>
          </label>
          <CharCount value={form.prompt_text} max={LIMITS.prompt_text} />
        </div>
        <textarea
          required
          rows={10}
          value={form.prompt_text}
          onChange={set('prompt_text')}
          placeholder="Kirjoita tai liitä promptisi tähän. Merkitse muokattavat kohdat [HAKASULKEISIIN]."
          className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
        />
        <p className="mt-1.5 text-xs text-muted">
          Käytä <code className="bg-gray-100 px-1 rounded">[HAKASULKEITA]</code> muokattaville kohdille, esim. <code className="bg-gray-100 px-1 rounded">[LUOKKA-ASTE]</code>.
        </p>
      </div>

      {/* Dropdowns 2×2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Oppiaine <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.subject} onChange={set('subject')} className={selectClass}>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{SUBJECT_LABELS[s]}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Luokka-aste <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.level} onChange={set('level')} className={selectClass}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            AI-työkalu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.tool} onChange={set('tool')} className={selectClass}>
              {TOOLS.map((t) => (
                <option key={t} value={t}>{TOOL_LABELS[t]}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Käyttötarkoitus <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={form.use_case} onChange={set('use_case')} className={selectClass}>
              {USE_CASES.map((u) => (
                <option key={u} value={u}>{USE_CASE_LABELS[u]}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Avainsanat{' '}
          <span className="text-muted font-normal text-xs">(valinnainen)</span>
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={set('tags')}
          placeholder="esim. eriyttäminen, kertaus, ryhmätyö"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-muted">Erota pilkulla. Helpottaa hakua.</p>
      </div>

      {/* Example output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">
            Esimerkkivastaus{' '}
            <span className="text-muted font-normal text-xs">(valinnainen)</span>
          </label>
          <CharCount value={form.example_output} max={LIMITS.example_output} />
        </div>
        <textarea
          rows={5}
          value={form.example_output}
          onChange={set('example_output')}
          placeholder="Liitä tähän esimerkki siitä, mitä AI tuotti kun käytit tätä promptia."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Tips */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">
            Vinkit{' '}
            <span className="text-muted font-normal text-xs">(valinnainen)</span>
          </label>
          <CharCount value={form.tips} max={LIMITS.tips} />
        </div>
        <textarea
          rows={3}
          value={form.tips}
          onChange={set('tips')}
          placeholder="Miten saat parhaan tuloksen? Mitä kannattaa muokata? Mihin AI-työkaluun sopii erityisen hyvin?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error */}
      {submitError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {submitError}
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full py-4 rounded-xl bg-teal text-white font-semibold text-base hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Lähetetään...' : 'Lähetä prompti tarkistettavaksi'}
        </button>
        <p className="mt-3 text-xs text-muted text-center">
          Promptisi tarkistetaan ennen julkaisua. Olet vastuussa lähettämästäsi sisällöstä.
        </p>
      </div>
    </form>
  );
}
