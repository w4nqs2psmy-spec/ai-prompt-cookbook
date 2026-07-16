'use client';

/**
 * Bookmark button — reads auth and saved-state from context.
 * Zero individual API calls on mount; all state comes from UserProvider
 * and FavoritesProvider which each fire exactly once per page load.
 */

import { useState, useRef } from 'react';
import { useUser } from './UserProvider';
import { useFavorites } from './FavoritesProvider';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  item_type: 'prompt' | 'skill' | 'code' | 'tip';
  item_id: string;
  size?: 'card' | 'detail';
};

export default function BookmarkButton({ item_type, item_id, size = 'card' }: Props) {
  const { user, loading: userLoading } = useUser();
  const { savedIds, toggle, loading: favLoading } = useFavorites();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>();

  // JSON seed items (non-UUID ids) don't support favorites
  if (!UUID_RE.test(item_id)) return null;

  // Don't render the button until auth is resolved (avoids flash)
  if (userLoading || favLoading) {
    return <span className={size === 'card' ? 'w-7 h-7 inline-block' : 'w-20 h-8 inline-block'} />;
  }

  const loggedIn = !!user;
  const saved = savedIds.has(item_id);
  const isDetail = size === 'detail';

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loggedIn) {
      setShowTooltip(true);
      clearTimeout(tooltipTimer.current);
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 2500);
      return;
    }

    await toggle(item_type, item_id);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleClick}
        aria-label={saved ? 'Poista suosikeista' : 'Tallenna suosikiksi'}
        className={`inline-flex items-center gap-1.5 rounded-lg transition-colors
          ${isDetail ? 'px-3 py-1.5 text-sm font-medium border' : 'w-7 h-7 justify-center'}
          ${
            saved
              ? isDetail
                ? 'text-teal border-teal/40 bg-teal-light hover:bg-teal/10'
                : 'text-teal hover:text-teal-dark'
              : isDetail
              ? 'text-muted border-warm-border bg-card hover:text-foreground hover:border-teal/40'
              : 'text-muted/50 hover:text-muted'
          }`}
      >
        <svg
          className={isDetail ? 'w-4 h-4 shrink-0' : 'w-4 h-4'}
          viewBox="0 0 24 24"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={saved ? 0 : 1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 4a2 2 0 012-2h10a2 2 0 012 2v18l-7-3.5L5 22V4z"
          />
        </svg>
        {isDetail && (saved ? 'Tallennettu' : 'Tallenna')}
      </button>

      {showTooltip && (
        <div
          className={`absolute z-30 whitespace-nowrap px-3 py-2 text-xs text-white bg-foreground rounded-lg shadow-lg pointer-events-none
            ${isDetail ? 'left-0 top-10' : 'right-0 top-8'}`}
        >
          Kirjaudu sisään tallentaaksesi suosikkeja
          <span
            className={`absolute -top-1 w-2 h-2 bg-foreground rotate-45 ${isDetail ? 'left-3' : 'right-2'}`}
          />
        </div>
      )}
    </div>
  );
}
