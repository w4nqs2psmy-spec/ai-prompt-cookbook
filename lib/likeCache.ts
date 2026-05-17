/**
 * Thin localStorage cache for liked items.
 * Eliminates per-card GET /api/like calls on mount — we read the cache synchronously
 * and only hit the server when the user actually clicks like/unlike.
 *
 * Cache key: "ai-cookbook-likes"
 * Cache value: { "prompt:uuid": 1, "skill:uuid": 1 }
 */

const CACHE_KEY = 'ai-cookbook-likes';

type LikeCache = Record<string, 1>;

function readCache(): LikeCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as LikeCache) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: LikeCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function getCachedLiked(item_type: string, item_id: string): boolean {
  if (typeof window === 'undefined') return false;
  return !!readCache()[`${item_type}:${item_id}`];
}

export function setCachedLiked(
  item_type: string,
  item_id: string,
  liked: boolean
): void {
  if (typeof window === 'undefined') return;
  const cache = readCache();
  const key = `${item_type}:${item_id}`;
  if (liked) {
    cache[key] = 1;
  } else {
    delete cache[key];
  }
  writeCache(cache);
}
