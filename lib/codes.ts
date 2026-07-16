import { unstable_cache } from 'next/cache';
import { Code, CodeLanguage, Subject, Level, Tool, UseCase } from './types';
import { createAdminClient } from './supabase/admin';

/* ── Supabase codes ──────────────────────────────────────────── */

/** Map a raw Supabase row to the Code type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Code {
  return {
    id: row.id,
    title: row.title,
    code_text: row.code_text,
    code_language: row.code_language as CodeLanguage,
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
 * Fetch all approved codes from Supabase.
 * Cached for 60 seconds via Next.js unstable_cache so repeated page renders
 * within the same minute don't each hit the database cold.
 * Returns [] if Supabase isn't configured (env vars missing) or on error,
 * so the app continues to work gracefully.
 */
export const getApprovedSupabaseCodes = unstable_cache(
  async (): Promise<Code[]> => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return [];
    }

    try {
      console.time('[codes] supabase query');
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('codes')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      console.timeEnd('[codes] supabase query');

      if (error || !data) return [];

      return data.map(mapRow);
    } catch {
      return [];
    }
  },
  ['approved-codes'],
  { revalidate: 60, tags: ['codes'] }
);

/**
 * Look up a single code by id from Supabase.
 * Returns undefined if not found.
 */
export async function getCodeByIdAsync(id: string): Promise<Code | undefined> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return undefined;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('codes')
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
