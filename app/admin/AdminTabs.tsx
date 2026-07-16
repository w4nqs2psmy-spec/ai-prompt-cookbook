'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

type Props = {
  promptCount: number;
  skillCount: number;
  codeCount: number;
  tipCount: number;
  commentCount: number;
  promptsContent: ReactNode;
  skillsContent: ReactNode;
  codesContent: ReactNode;
  tipsContent: ReactNode;
  commentsContent: ReactNode;
};

type Tab = 'prompts' | 'skills' | 'codes' | 'tips' | 'comments';

export default function AdminTabs({
  promptCount,
  skillCount,
  codeCount,
  tipCount,
  commentCount,
  promptsContent,
  skillsContent,
  codesContent,
  tipsContent,
  commentsContent,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('prompts');

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'prompts', label: 'Promptit', count: promptCount },
    { key: 'skills', label: 'Skillit', count: skillCount },
    { key: 'codes', label: 'Koodit', count: codeCount },
    { key: 'tips', label: 'Vinkit', count: tipCount },
    { key: 'comments', label: 'Kommentit', count: commentCount },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-background border border-warm-border rounded-xl p-1 mb-6">
        {tabs.map(({ key, label, count }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-teal text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded-full ${
                    active ? 'bg-white/25 text-white' : 'bg-mustard text-white'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'prompts' && promptsContent}
      {activeTab === 'skills' && skillsContent}
      {activeTab === 'codes' && codesContent}
      {activeTab === 'tips' && tipsContent}
      {activeTab === 'comments' && commentsContent}
    </div>
  );
}
