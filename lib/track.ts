/**
 * Fire-and-forget helpers for view/copy tracking.
 * Safe to call from any client component — errors are swallowed silently.
 */

function post(type: 'prompt' | 'skill' | 'code' | 'tip', id: string, action: 'view' | 'copy') {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id, action }),
  }).catch(() => {
    // Swallow errors — tracking is best-effort
  });
}

/**
 * Track a page view. Deduplicates per session using sessionStorage.
 * Safe to call on every render — will only fire once per session per item.
 */
export function trackView(type: 'prompt' | 'skill' | 'code' | 'tip', id: string): void {
  if (typeof window === 'undefined') return;
  const key = `viewed_${type}_${id}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  post(type, id, 'view');
}

/**
 * Track a copy/open-in-AI button click. Fires on every click (no dedup).
 */
export function trackCopy(type: 'prompt' | 'skill' | 'code' | 'tip', id: string): void {
  if (typeof window === 'undefined') return;
  post(type, id, 'copy');
}
