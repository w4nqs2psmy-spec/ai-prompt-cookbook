import { readFileSync } from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { Skill, Subject, Level, Tool, UseCase } from './types';
import { createAdminClient } from './supabase/admin';

const DATA_FILE = path.join(process.cwd(), 'data/skills-mock.json');

/* ── JSON (mock) skills ──────────────────────────────────────── */

export function getSkills(): Skill[] {
  const raw = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Skill[];
}

export function getSkillById(id: string): Skill | undefined {
  return getSkills().find((s) => s.id === id);
}

/* ── Supabase skills ─────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Skill {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject as Subject,
    level: row.level as Level,
    tool: row.tool as Tool,
    use_case: row.use_case as UseCase,
    tags: row.tags ?? [],
    steps: row.steps ?? [],
    tips: row.tips ?? undefined,
    is_pro: row.is_pro ?? false,
    is_approved: row.is_approved ?? false,
    submitted_by: row.submitted_by ?? null,
    created_at: row.created_at,
    view_count: row.view_count ?? 0,
    copy_count: row.copy_count ?? 0,
    like_count: row.like_count ?? 0,
    comment_count: row.comment_count ?? 0,
  };
}

/**
 * Fetch all approved skills from Supabase.
 * Cached for 60 seconds via Next.js unstable_cache so repeated page renders
 * within the same minute don't each hit the database cold.
 * Returns [] if Supabase isn't configured or on error.
 */
export const getApprovedSupabaseSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return [];
    }

    try {
      console.time('[skills] supabase query');
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('skills')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      console.timeEnd('[skills] supabase query');

      if (error || !data) return [];
      return data.map(mapRow);
    } catch {
      return [];
    }
  },
  ['approved-skills'],
  { revalidate: 60, tags: ['skills'] }
);

/**
 * Look up a single skill by id — JSON first, then Supabase.
 */
export async function getSkillByIdAsync(id: string): Promise<Skill | undefined> {
  const jsonSkill = getSkillById(id);
  if (jsonSkill) return jsonSkill;

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return undefined;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('skills')
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
