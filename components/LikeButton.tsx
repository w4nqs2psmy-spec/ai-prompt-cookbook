'use client';

/**
 * Like/heart button with localStorage-backed state.
 *
 * Previous version fired GET /api/like on every card mount to restore liked state,
 * causing N concurrent network requests on listing pages (N = card count).
 *
 * Now: liked state is read from localStorage synchronously on mount (no fetch),
 * and written back to localStorage optimistically on toggle. The API is only
 * called when the user actually clicks, not on every mount.
 */

import { useState, useEffect, useCallback } from 'react';
import { getFingerprint } from '@/lib/fingerprint';
import { getCachedLiked, setCachedLiked } from '@/lib/likeCache';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  item_type: 'prompt' | 'skill';
  item_id: string;
  initial_like_count: number;
  size?: 'card' | 'detail';
};

export default function LikeButton({
  item_type,
  item_id,
  initial_like_count,
  size = 'card',
}: Props) {
  const isLikeable = UUID_RE.test(item_id);

  // Read initial liked state from localStorage synchronously (no flash, no fetch)
  const [liked, setLiked] = useState(() =>
    isLikeable ? getCachedLiked(item_type, item_id) : false
  );
  const [likeCount, setLikeCount] = useState(initial_like_count);
  const [animating, setAnimating] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Sync liked count with initial prop if it changes (e.g. staggered card renders)
  useEffect(() => {
    setLikeCount(initial_like_count);
  }, [initial_like_count]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLikeable || disabled) return;

      const fp = getFingerprint();
      if (!fp) return;

      const newLiked = !liked;

      // Optimistic UI + localStorage cache update (synchronous, instant)
      setLiked(newLiked);
      setLikeCount((c) => (newLiked ? c + 1 : Math.max(c - 1, 0)));
      setCachedLiked(item_type, item_id, newLiked);

      // Pulse animation
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);

      // Debounce
      setDisabled(true);
      setTimeout(() => setDisabled(false), 500);

      // Fire API (best-effort — don't block UI)
      fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type, item_id, user_fingerprint: fp }),
      })
        .then((r) => r.json())
        .then((data: { liked?: boolean; like_count?: number }) => {
          // Reconcile with server truth
          if (typeof data.liked === 'boolean') {
            setLiked(data.liked);
            setCachedLiked(item_type, item_id, data.liked);
          }
          if (typeof data.like_count === 'number') setLikeCount(data.like_count);
        })
        .catch(() => {
          // Revert both UI and cache on failure
          setLiked(liked);
          setLikeCount((c) => (newLiked ? Math.max(c - 1, 0) : c + 1));
          setCachedLiked(item_type, item_id, liked);
        });
    },
    [liked, disabled, isLikeable, item_type, item_id]
  );

  if (size === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !isLikeable}
        title={liked ? 'Poista tykkäys' : 'Tykkää'}
        className={`
          inline-flex items-center gap-1 text-[11px] transition-colors select-none
          ${isLikeable ? 'cursor-pointer' : 'cursor-default'}
          ${liked ? 'text-red-500' : 'text-muted/60 hover:text-red-400'}
        `}
        style={{
          transform: animating ? 'scale(1.25)' : 'scale(1)',
          transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), color 150ms',
        }}
      >
        <HeartIcon filled={liked} size={12} />
        {likeCount > 0 && <span>{likeCount}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !isLikeable}
      title={liked ? 'Poista tykkäys' : 'Tykkää'}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all select-none
        ${isLikeable ? 'cursor-pointer' : 'cursor-default'}
        ${
          liked
            ? 'border-red-200 bg-red-50 text-red-500'
            : 'border-warm-border bg-card text-muted hover:border-red-200 hover:text-red-400'
        }
      `}
      style={{
        transform: animating ? 'scale(1.15)' : 'scale(1)',
        transition:
          'transform 300ms cubic-bezier(0.34,1.56,0.64,1), color 150ms, background-color 150ms, border-color 150ms',
      }}
    >
      <HeartIcon filled={liked} size={16} />
      <span className="text-sm font-medium tabular-nums">
        {likeCount > 0 ? likeCount : liked ? '1' : 'Tykkää'}
      </span>
    </button>
  );
}

function HeartIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
