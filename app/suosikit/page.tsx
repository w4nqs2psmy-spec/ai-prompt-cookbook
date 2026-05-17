import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Prompt, Skill, Subject, Level, Tool, UseCase } from '@/lib/types';
import SuosikitTabs from './SuosikitTabs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Omat suosikit — AI Prompt Cookbook',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPrompt(row: any): Prompt {
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
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSkill(row: any): Skill {
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
  };
}

export default async function SuosikitPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch this user's favorites (RLS ensures they only see their own)
  const { data: favs } = await supabase
    .from('favorites')
    .select('item_type, item_id')
    .order('created_at', { ascending: false });

  const promptIds = (favs ?? [])
    .filter((f) => f.item_type === 'prompt')
    .map((f) => f.item_id as string);
  const skillIds = (favs ?? [])
    .filter((f) => f.item_type === 'skill')
    .map((f) => f.item_id as string);

  const admin = createAdminClient();

  const [promptsRes, skillsRes] = await Promise.all([
    promptIds.length > 0
      ? admin.from('prompts').select('*').in('id', promptIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    skillIds.length > 0
      ? admin.from('skills').select('*').in('id', skillIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
  ]);

  // Preserve the favorites order (most recently saved first)
  const promptMap = new Map(
    (promptsRes.data ?? []).map((p) => [p.id as string, p])
  );
  const skillMap = new Map(
    (skillsRes.data ?? []).map((s) => [s.id as string, s])
  );

  const prompts = promptIds
    .map((id) => promptMap.get(id))
    .filter(Boolean)
    .map(mapPrompt);

  const skills = skillIds
    .map((id) => skillMap.get(id))
    .filter(Boolean)
    .map(mapSkill);

  return <SuosikitTabs prompts={prompts} skills={skills} />;
}
