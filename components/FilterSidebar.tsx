'use client';

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

export type Filters = {
  subjects: Subject[];
  levels: Level[];
  tools: Tool[];
  useCases: UseCase[];
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const SUBJECTS: Subject[] = ['math', 'science', 'languages', 'history', 'arts', 'entrepreneurship', 'computer_science', 'general'];
const LEVELS: Level[] = ['primary', 'lower_secondary', 'upper_secondary', 'higher_education', 'adult_education'];
const TOOLS: Tool[] = ['chatgpt', 'claude', 'gemini', 'copilot', 'any'];
const USE_CASES: UseCase[] = ['lesson_planning', 'assessment', 'differentiation', 'feedback', 'group_work', 'creative_tasks', 'research', 'admin'];

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function activeCount(filters: Filters): number {
  return filters.subjects.length + filters.levels.length + filters.tools.length + filters.useCases.length;
}

type CheckboxGroupProps<T extends string> = {
  title: string;
  items: T[];
  labels: Record<T, string>;
  selected: T[];
  onToggle: (item: T) => void;
};

function CheckboxGroup<T extends string>({ title, items, labels, selected, onToggle }: CheckboxGroupProps<T>) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">{title}</h3>
      <div className="space-y-1.5">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 rounded border-warm-border text-teal focus:ring-teal cursor-pointer accent-[#1A7A6D]"
            />
            <span className="text-sm text-foreground group-hover:text-teal transition-colors">
              {labels[item]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const count = activeCount(filters);

  const clearAll = () =>
    onChange({ subjects: [], levels: [], tools: [], useCases: [] });

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-foreground">
          Suodata
          {count > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-teal text-white rounded-full">
              {count}
            </span>
          )}
        </h2>
        {count > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-teal hover:text-teal-dark font-medium transition-colors"
          >
            Tyhjennä suodattimet
          </button>
        )}
      </div>

      <div className="space-y-6">
        <CheckboxGroup
          title="Oppiaine"
          items={SUBJECTS}
          labels={SUBJECT_LABELS}
          selected={filters.subjects}
          onToggle={(item) => onChange({ ...filters, subjects: toggle(filters.subjects, item) })}
        />
        <div className="border-t border-warm-border" />
        <CheckboxGroup
          title="Luokka-aste"
          items={LEVELS}
          labels={LEVEL_LABELS}
          selected={filters.levels}
          onToggle={(item) => onChange({ ...filters, levels: toggle(filters.levels, item) })}
        />
        <div className="border-t border-warm-border" />
        <CheckboxGroup
          title="Työkalu"
          items={TOOLS}
          labels={TOOL_LABELS}
          selected={filters.tools}
          onToggle={(item) => onChange({ ...filters, tools: toggle(filters.tools, item) })}
        />
        <div className="border-t border-warm-border" />
        <CheckboxGroup
          title="Käyttötarkoitus"
          items={USE_CASES}
          labels={USE_CASE_LABELS}
          selected={filters.useCases}
          onToggle={(item) => onChange({ ...filters, useCases: toggle(filters.useCases, item) })}
        />
      </div>
    </aside>
  );
}
