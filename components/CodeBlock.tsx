'use client';

import { useEffect, useRef } from 'react';
import { CodeLanguage, CODE_LANGUAGE_LABELS } from '@/lib/types';

/**
 * CodeBlock component with syntax highlighting support
 *
 * Currently renders a simple code block with language indication.
 * Can be enhanced with highlight.js for syntax highlighting:
 * 1. Install: npm install highlight.js
 * 2. Import: import hljs from 'highlight.js'
 * 3. Import CSS: import 'highlight.js/styles/atom-one-dark.css'
 * 4. Add hljs.highlightElement(codeRef.current) in useEffect
 */

type Props = {
  code: string;
  language: CodeLanguage;
  showLanguageBadge?: boolean;
  className?: string;
};

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: '#F7DF1E',
  python: '#3776AB',
  sql: '#E34C26',
  html: '#E34C26',
  css: '#264DE4',
  java: '#007396',
  csharp: '#239120',
  cpp: '#00599C',
  php: '#777BB4',
  ruby: '#CC342D',
  go: '#00ADD8',
  rust: '#CE4833',
  typescript: '#3178C6',
  bash: '#4EAA25',
  other: '#8A8070',
};

export default function CodeBlock({
  code,
  language,
  showLanguageBadge = true,
  className = '',
}: Props) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // When highlight.js is installed, uncomment these lines:
    // if (codeRef.current) {
    //   hljs.highlightElement(codeRef.current);
    // }
  }, [code, language]);

  const langColor = LANGUAGE_COLORS[language] ?? '#8A8070';

  return (
    <div className={className}>
      {showLanguageBadge && (
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: langColor }}
          >
            {CODE_LANGUAGE_LABELS[language]}
          </span>
        </div>
      )}

      <pre className="bg-card border border-warm-border rounded-2xl p-6 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
        <code
          ref={codeRef}
          className={`language-${language}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
