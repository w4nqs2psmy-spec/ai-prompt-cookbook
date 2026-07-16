'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUser } from './UserProvider';

/* ── Types ──────────────────────────────────────────────────────── */

type Comment = {
  id: string;
  user_id: string;
  user_display_name: string;
  content: string;
  created_at: string;
};

/* ── Helpers ────────────────────────────────────────────────────── */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const AVATAR_COLORS = [
  '#1A7A6D', '#C4725A', '#8B7355', '#5B8A9E',
  '#7A6D8A', '#6A8A5B', '#B87A5A', '#5A6A8A',
];

function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function nameToInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function timeAgoFi(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'juuri äsken';
  if (diffMin < 60) return `${diffMin} minuutti${diffMin === 1 ? '' : 'a'} sitten`;
  if (diffHour < 24) return `${diffHour} tunti${diffHour === 1 ? '' : 'a'} sitten`;
  if (diffDay < 7) return `${diffDay} päivä${diffDay === 1 ? '' : 'ä'} sitten`;
  if (diffWeek < 5) return `${diffWeek} viikko${diffWeek === 1 ? '' : 'a'} sitten`;
  if (diffMonth < 12) return `${diffMonth} kuukausi${diffMonth === 1 ? '' : 'a'} sitten`;
  return `${diffYear} vuosi${diffYear === 1 ? '' : 'a'} sitten`;
}

/* ── CommentItem ────────────────────────────────────────────────── */

function CommentItem({
  comment,
  currentUserId,
  isAdmin,
  onDelete,
}: {
  comment: Comment;
  currentUserId: string | null;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const avatarColor = nameToColor(comment.user_display_name);
  const initials = nameToInitials(comment.user_display_name);
  const canDelete = isAdmin || comment.user_id === currentUserId;

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
        style={{ backgroundColor: avatarColor }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {comment.user_display_name}
          </span>
          <span className="text-xs text-muted/60">{timeAgoFi(comment.created_at)}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        {/* Delete */}
        {canDelete && (
          <div className="mt-1.5">
            {confirming ? (
              <span className="inline-flex items-center gap-2 text-xs">
                <span className="text-muted">Poistetaanko?</span>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Poista
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Peruuta
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="text-xs text-muted/50 hover:text-muted transition-colors"
              >
                Poista
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CommentSection ─────────────────────────────────────────────── */

type Props = {
  item_type: 'prompt' | 'skill' | 'code' | 'tip';
  item_id: string;
  initial_comment_count?: number;
};

export default function CommentSection({ item_type, item_id, initial_comment_count }: Props) {
  // Auth comes from context — no per-component getUser() call
  const { user, isAdmin, loading: userLoading } = useUser();
  const loggedIn = !!user;
  const currentUserId = user?.id ?? null;

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const isUUID = UUID_RE.test(item_id);

  // Fetch comments once auth is resolved
  useEffect(() => {
    if (!isUUID || userLoading) {
      if (!isUUID) setLoading(false);
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const res = await fetch(
          `/api/comments?item_type=${item_type}&item_id=${encodeURIComponent(item_id)}`
        );
        if (!cancelled && res.ok) {
          const json = await res.json();
          setComments(json.comments ?? []);
        }
      } catch { /* ignore */ }

      if (!cancelled) setLoading(false);
    };

    init();
    return () => { cancelled = true; };
  }, [item_type, item_id, isUUID, userLoading]);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);

    // Optimistic: prepend a temporary comment using auth from context
    const tempId = `temp-${Date.now()}`;
    const displayName =
      (user?.user_metadata?.display_name as string) ||
      (user?.user_metadata?.full_name as string) ||
      (user?.user_metadata?.name as string) ||
      (user?.email ? user.email.split('@')[0] : 'Sinä');

    const optimistic: Comment = {
      id: tempId,
      user_id: currentUserId ?? '',
      user_display_name: displayName,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [optimistic, ...prev]);
    const savedContent = content;
    setContent('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type, item_id, content: savedContent }),
      });

      if (res.ok) {
        const json = await res.json();
        // Replace the temp comment with the real one from the server
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? json.comment : c))
        );
        showToast('Kommentti lisätty');
      } else {
        // Revert optimistic
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        setContent(savedContent);
        showToast('Virhe: kommenttia ei voitu lisätä');
      }
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setContent(savedContent);
      showToast('Virhe: kommenttia ei voitu lisätä');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic removal
    const prev = comments;
    setComments((c) => c.filter((x) => x.id !== id));

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setComments(prev); // revert
        showToast('Virhe: kommenttia ei voitu poistaa');
      }
    } catch {
      setComments(prev);
      showToast('Virhe: kommenttia ei voitu poistaa');
    }
  };

  // Non-UUID seed items don't support comments yet
  if (!isUUID) return null;

  const count = loading ? (initial_comment_count ?? 0) : comments.length;

  return (
    <section className="mt-12 pt-8 border-t border-warm-border">

      {/* Section header */}
      <h2 className="font-serif text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        Kommentit
        <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full text-xs font-bold bg-warm-border text-muted">
          {count}
        </span>
      </h2>

      {/* Toast notification */}
      {toast && (
        <div
          className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium transition-opacity duration-300 ${
            toast.startsWith('Virhe')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-teal-light border border-teal/30 text-teal'
          }`}
        >
          {toast}
        </div>
      )}

      {/* Input area */}
      <div className="mb-8">
        {loggedIn ? (
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Jaa kokemuksesi tai vinkkisi..."
                maxLength={1000}
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-warm-border bg-card focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent placeholder-muted text-foreground resize-none leading-relaxed"
              />
              {/* Character count */}
              <span
                className={`absolute bottom-3 right-4 text-xs transition-colors ${
                  content.length > 900 ? 'text-terracotta' : 'text-muted/50'
                }`}
              >
                {content.length}/1000
              </span>
            </div>

            {/* Guidelines */}
            <p className="mt-2 mb-3 text-xs text-muted/70 leading-relaxed">
              Jaa kokemuksiasi ja vinkkejäsi muille opettajille. Älä kirjoita oppilaiden
              henkilötietoja kommentteihin.
            </p>

            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-5 py-2 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Lähetetään...' : 'Kommentoi'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-muted">
            <Link href="/login" className="text-teal hover:text-teal-dark font-medium transition-colors">
              Kirjaudu sisään
            </Link>{' '}
            kommentoidaksesi
          </p>
        )}
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-warm-border shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-warm-border rounded w-32" />
                <div className="h-3 bg-warm-border rounded w-full" />
                <div className="h-3 bg-warm-border rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted/70 italic">
          Ei vielä kommentteja. Ole ensimmäinen!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
