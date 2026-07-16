import { unstable_cache } from 'next/cache';
import { Tip, Subject, Level, Tool, UseCase } from './types';
import { createAdminClient } from './supabase/admin';

/* ── Supabase tips ───────────────────────────────────────────── */

/** Map a raw Supabase row to the Tip type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Tip {
  return {
    id: row.id,
    title: row.title,
    tip_text: row.tip_text,
    description: row.description,
    subject: row.subject as Subject,
    level: row.level as Level,
    tool: row.tool as Tool,
    use_case: row.use_case as UseCase,
    tags: row.tags ?? [],
    is_pro: row.is_pro ?? false,
    created_at: row.created_at,
    submitted_by: row.submitted_by ?? null,
    view_count: row.view_count ?? 0,
    copy_count: row.copy_count ?? 0,
    like_count: row.like_count ?? 0,
    comment_count: row.comment_count ?? 0,
  };
}

/**
 * Fetch all approved tips from Supabase.
 * Cached for 60 seconds via Next.js unstable_cache so repeated page renders
 * within the same minute don't each hit the database cold.
 * Returns [] if Supabase isn't configured (env vars missing) or on error,
 * so the app continues to work gracefully.
 */
export const getApprovedSupabaseTips = unstable_cache(
  async (): Promise<Tip[]> => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return [];
    }

    try {
      console.time('[tips] supabase query');
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('tips')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      console.timeEnd('[tips] supabase query');

      if (error || !data) return [];

      return data.map(mapRow);
    } catch {
      return [];
    }
  },
  ['approved-tips'],
  { revalidate: 60, tags: ['tips'] }
);

/**
 * Look up a single tip by id from Supabase.
 * Returns undefined if not found.
 */
export async function getTipByIdAsync(id: string): Promise<Tip | undefined> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return undefined;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('tips')
      .select('*')
      .eq('id', id)
      .eq('is_approved', true)
      .single();

    if (error || !data) return undefined;
    return mapRow(data);
  } catch {
    return undefined;
  }
}
