'use client';

import { useState } from 'react';
import { Prompt, Skill } from '@/lib/types';
import PromptCard from '@/components/PromptCard';
import SkillCard from '@/components/SkillCard';

type Props = {
  prompts: Prompt[];
  skills: Skill[];
};

export default function SuosikitTabs({ prompts, skills }: Props) {
  const [tab, setTab] = useState<'prompts' | 'skills'>('prompts');
  const activeItems = tab === 'prompts' ? prompts : skills;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-3">
          Oma kokoelma
        </p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight">
          Omat suosikit
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-background border border-warm-border rounded-xl p-1 w-fit mb-8">
        <button
          onClick={() => setTab('prompts')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'prompts'
              ? 'bg-teal text-white shadow-sm'
              : 'text-muted hover:text-foreground'
          }`}
        >
          Promptit
          {prompts.length > 0 && (
            <span
              className={`ml-2 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full ${
                tab === 'prompts' ? 'bg-white/20 text-white' : 'bg-warm-border text-muted'
              }`}
            >
              {prompts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('skills')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'skills'
              ? 'bg-teal text-white shadow-sm'
              : 'text-muted hover:text-foreground'
          }`}
        >
          Skillit
          {skills.length > 0 && (
            <span
              className={`ml-2 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full ${
                tab === 'skills' ? 'bg-white/20 text-white' : 'bg-warm-border text-muted'
              }`}
            >
              {skills.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeItems.length === 0 ? (
        <EmptyState type={tab} />
      ) : tab === 'prompts' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {(prompts as Prompt[]).map((prompt, index) => (
            <div
              key={prompt.id}
              className="animate-card-in"
              style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
            >
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {(skills as Skill[]).map((skill, index) => (
            <div
              key={skill.id}
              className="animate-card-in"
              style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
            >
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ type }: { type: 'prompts' | 'skills' }) {
  const isPrompts = type === 'prompts';
  return (
    <div className="text-center py-24 max-w-md mx-auto">
      <div className="text-5xl mb-4">{isPrompts ? '🔖' : '📚'}</div>
      <h2 className="font-serif text-xl text-foreground mb-3">
        Ei tallennettuja {isPrompts ? 'prompteja' : 'skilllejä'}
      </h2>
      <p className="text-sm text-muted leading-relaxed">
        Et ole vielä tallentanut suosikkeja. Selaa{' '}
        {isPrompts ? 'prompteja' : 'skilllejä'} ja klikkaa{' '}
        <svg
          className="inline w-3.5 h-3.5 -mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 4a2 2 0 012-2h10a2 2 0 012 2v18l-7-3.5L5 22V4z"
          />
        </svg>{' '}
        kirjanmerkkiä tallentaaksesi.
      </p>
    </div>
  );
}
