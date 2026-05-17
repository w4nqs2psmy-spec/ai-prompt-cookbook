'use client';

/**
 * Renders the favorites count badge in the nav link.
 * Reads from FavoritesContext — no server-side DB query needed.
 */
import { useFavorites } from './FavoritesProvider';

export default function FavoritesNavCount() {
  const { savedIds, loading } = useFavorites();
  if (loading || savedIds.size === 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full text-[10px] font-bold bg-teal text-white leading-none">
      {savedIds.size}
    </span>
  );
}
