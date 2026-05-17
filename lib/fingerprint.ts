/**
 * Anonymous user fingerprint — stored in localStorage.
 * Generated once on first visit; read on every subsequent visit.
 * Enables anonymous liking without login, one like per browser per item.
 */

const STORAGE_KEY = 'user_fingerprint';

function generateUUID(): string {
  // crypto.randomUUID is available in all modern browsers
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for very old environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getFingerprint(): string {
  if (typeof window === 'undefined') return '';

  let fp = localStorage.getItem(STORAGE_KEY);
  if (!fp) {
    fp = generateUUID();
    localStorage.setItem(STORAGE_KEY, fp);
  }
  return fp;
}
