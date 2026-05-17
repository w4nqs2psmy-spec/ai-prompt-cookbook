'use client';

import { useState } from 'react';
import Link from 'next/link';

export type AdminComment = {
  id: string;
  item_type: 'prompt' | 'skill';
  item_id: string;
  user_id: string;
  user_display_name: string;
  content: string;
  created_at: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  initialComments: AdminComment[];
};

export default function AdminCommentList({ initialComments }: Props) {
  const [comments, setComments] = useState<AdminComment[]>(initialComments);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [fading, setFading] = useState<Set<string>>(new Set());

  const handleDelete = async (comment: AdminComment) => {
    if (
      !confirm(
        `Poistetaanko kommentti?\n\n"${comment.content.slice(0, 100)}${comment.content.length > 100 ? '...' : ''}"\n\n— ${comment.user_display_name}`
      )
    ) return;

    setDeleting((prev) => new Set(prev).add(comment.id));

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id }),
      });

      if (res.ok) {
        // Fade out then remove
        setFading((prev) => new Set(prev).add(comment.id));
        setTimeout(() => {
          setComments((prev) => prev.filter((c) => c.id !== comment.id));
          setFading((prev) => {
            const next = new Set(prev);
            next.delete(comment.id);
            return next;
          });
        }, 350);
      } else {
        const json = await res.json();
        alert('Virhe: ' + (json.error ?? 'Tuntematon virhe'));
      }
    } catch {
      alert('Virhe: verkkovirhe');
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(comment.id);
        return next;
      });
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">💬</div>
        <p className="text-lg font-semibold text-foreground mb-2">Ei kommentteja</p>
        <p className="text-sm text-muted">Käyttäjät eivät ole vielä kommentoineet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isFading = fading.has(comment.id);
        const isDeleting = deleting.has(comment.id);
        const itemPath =
          comment.item_type === 'prompt'
            ? `/prompt/${comment.item_id}`
            : `/skills/${comment.item_id}`;
        const itemLabel = comment.item_type === 'prompt' ? 'Prompti' : 'Skill';

        return (
          <div
            key={comment.id}
            className="bg-card border border-gray-100 rounded-2xl p-5"
            style={{
              transition: 'opacity 350ms ease, transform 350ms ease',
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(-6px)' : 'none',
            }}
          >
            {/* Meta row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {comment.user_display_name}
                  </span>
                  <span className="text-xs text-muted/60">{formatDate(comment.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-light text-teal font-medium">
                    {itemLabel}
                  </span>
                  <Link
                    href={itemPath}
                    target="_blank"
                    className="text-xs text-teal hover:text-teal-dark transition-colors underline underline-offset-2"
                  >
                    Avaa →
                  </Link>
                </div>
              </div>
              <button
                onClick={() => handleDelete(comment)}
                disabled={isDeleting}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? '...' : 'Poista'}
              </button>
            </div>

            {/* Comment text */}
            <p className="text-sm text-foreground leading-relaxed bg-background border border-warm-border rounded-xl px-4 py-3 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
