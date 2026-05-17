'use client';

/**
 * Provides the current user's saved items as a Set<string> of item IDs.
 * One fetch per page-load (GET /api/favorites) instead of one fetch per card.
 *
 * BookmarkButton reads `savedIds.has(item_id)` and calls `toggle()` on click —
 * no individual mount-time fetches needed.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useUser } from './UserProvider';

type FavCtx = {
  /** Set of saved item_ids (for both prompts and skills) */
  savedIds: Set<string>;
  /** Optimistically toggle an item in/out of favorites */
  toggle: (item_type: 'prompt' | 'skill', item_id: string) => Promise<void>;
  /** true while initial fetch is in-flight */
  loading: boolean;
};

const FavoritesContext = createContext<FavCtx>({
  savedIds: new Set(),
  toggle: async () => {},
  loading: true,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch all favorites in a single request once auth is resolved
  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      setSavedIds(new Set());
      setLoading(false);
      return;
    }

    fetch('/api/favorites')
      .then((r) => {
        if (!r.ok) return { prompts: [], skills: [] };
        return r.json() as Promise<{
          prompts?: { id: string }[];
          skills?: { id: string }[];
        }>;
      })
      .then(({ prompts = [], skills = [] }) => {
        setSavedIds(
          new Set([
            ...prompts.map((p) => p.id),
            ...skills.map((s) => s.id),
          ])
        );
      })
      .catch(() => {
        /* ignore — stays empty */
      })
      .finally(() => setLoading(false));
  }, [user, userLoading]);

  const toggle = useCallback(
    async (item_type: 'prompt' | 'skill', item_id: string) => {
      const wasSaved = savedIds.has(item_id);

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(item_id);
        else next.add(item_id);
        return next;
      });

      try {
        const res = await fetch('/api/favorites', {
          method: wasSaved ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_type, item_id }),
        });
        if (!res.ok) throw new Error('API error');
      } catch {
        // Revert on failure
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(item_id);
          else next.delete(item_id);
          return next;
        });
      }
    },
    [savedIds]
  );

  return (
    <FavoritesContext.Provider value={{ savedIds, toggle, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavCtx {
  return useContext(FavoritesContext);
}
