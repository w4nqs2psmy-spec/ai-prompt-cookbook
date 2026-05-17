import { readFileSync } from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { Prompt, Subject, Level, Tool, UseCase } from './types';
import { createAdminClient } from './supabase/admin';

const DATA_FILE = path.join(process.cwd(), 'data/prompts.json');

/* ── JSON (seed) prompts ─────────────────────────────────────── */

export function getPrompts(): Prompt[] {
  const raw = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Prompt[];
}

export function getPromptById(id: string): Prompt | undefined {
  return getPrompts().find((p) => p.id === id);
}

/* ── Supabase prompts ────────────────────────────────────────── */

/** Map a raw Supabase row to the Prompt type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Prompt {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    prompt_text: row.prompt_text,
    subject: row.subject as Subject,
    level: row.level as Level,
    tool: row.tool as Tool,
    use_case: row.use_case as UseCase,
    tags: row.tags ?? [],
    example_output: row.example_output ?? undefined,
    tips: row.tips ?? undefined,
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
 * Fetch all approved prompts from Supabase.
 * Cached for 60 seconds via Next.js unstable_cache so repeated page renders
 * within the same minute don't each hit the database cold.
 * Returns [] if Supabase isn't configured (env vars missing) or on error,
 * so the app continues to work with just the JSON seed data.
 */
export const getApprovedSupabasePrompts = unstable_cache(
  async (): Promise<Prompt[]> => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return [];
    }

    try {
      console.time('[prompts] supabase query');
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('prompts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      console.timeEnd('[prompts] supabase query');

      if (error || !data) return [];

      return data.map(mapRow);
    } catch {
      return [];
    }
  },
  ['approved-prompts'],
  { revalidate: 60, tags: ['prompts'] }
);

/**
 * Look up a single prompt by id — checks JSON first, then Supabase.
 * Returns undefined if not found in either source.
 */
export async function getPromptByIdAsync(id: string): Promise<Prompt | undefined> {
  // Check JSON seed data first (fast, sync)
  const jsonPrompt = getPromptById(id);
  if (jsonPrompt) return jsonPrompt;

  // Fall back to Supabase
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return undefined;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('prompts')
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
