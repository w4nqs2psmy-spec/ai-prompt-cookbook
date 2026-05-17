'use client';

/**
 * OpenInAIButtons
 * ─────────────────────────────────────────────────────────────
 * Renders small pill buttons that open the prompt pre-filled in
 * Claude, ChatGPT, Gemini, or Copilot.
 *
 * Uses <button> + window.open instead of <a> so it's safe inside
 * Next.js <Link> wrappers (avoids nested <a> invalid HTML).
 * e.stopPropagation() prevents the parent card link from firing.
 */

import { trackCopy } from '@/lib/track';

const MAX_PROMPT_CHARS = 2000;

function buildUrl(base: string, promptText: string): string {
  const text =
    promptText.length > MAX_PROMPT_CHARS
      ? promptText.slice(0, MAX_PROMPT_CHARS) + '…'
      : promptText;
  return `${base}${encodeURIComponent(text)}`;
}

const PLATFORMS = [
  {
    id: 'claude',
    label: 'Claude',
    base: 'https://claude.ai/new?q=',
    tooltip: 'Avaa prompti suoraan Claude-chatissa',
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    base: 'https://chatgpt.com/?q=',
    tooltip: 'Avaa prompti suoraan ChatGPT-chatissa',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    base: 'https://gemini.google.com/?q=',
    tooltip: 'Avaa prompti suoraan Gemini-chatissa',
  },
  {
    id: 'copilot',
    label: 'Copilot',
    base: 'https://copilot.microsoft.com/?q=',
    tooltip: 'Avaa prompti suoraan Copilot-chatissa',
  },
] as const;

/* External-link arrow icon */
function ExternalArrow() {
  return (
    <svg
      className="w-2.5 h-2.5 opacity-50 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

type Props = {
  prompt_text: string;
  /** Slightly smaller sizing for use inside PromptCard */
  compact?: boolean;
  /** ID of the item to track (skipped if not a UUID) */
  trackId?: string;
  /** Type of item to track */
  trackType?: 'prompt' | 'skill';
};

export default function OpenInAIButtons({ prompt_text, compact = false, trackId, trackType }: Props) {
  const height = compact ? 'h-7' : 'h-8';
  const px = compact ? 'px-2.5' : 'px-3';
  const textSize = compact ? 'text-[11px]' : 'text-xs';

  return (
    <div className="flex flex-wrap gap-1.5">
      {PLATFORMS.map((platform) => {
        const url = buildUrl(platform.base, prompt_text);
        return (
          <button
            key={platform.id}
            type="button"
            title={platform.tooltip}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (trackId && trackType) trackCopy(trackType, trackId);
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            className={`
              inline-flex items-center gap-1.5 ${height} ${px} ${textSize}
              rounded-full border border-warm-border
              bg-[#F0EDE8] hover:bg-[#E8E3DC] hover:border-teal/40
              text-muted hover:text-foreground
              font-medium transition-colors duration-150
              cursor-pointer select-none
            `}
          >
            {platform.label}
            <ExternalArrow />
          </button>
        );
      })}
    </div>
  );
}
