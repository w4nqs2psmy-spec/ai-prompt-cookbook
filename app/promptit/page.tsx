export const dynamic = 'force-dynamic';

import { getPrompts, getApprovedSupabasePrompts } from '@/lib/prompts';
import { getProfiles } from '@/lib/profiles';
import HeroSearch from '@/components/HeroSearch';

type Props = {
  searchParams: { search?: string };
};

export default async function PromptitPage({ searchParams }: Props) {
  const initialQuery = searchParams.search ?? '';

  const [supabasePrompts, profiles] = await Promise.all([
    getApprovedSupabasePrompts(),
    Promise.resolve(getProfiles()),
  ]);

  const jsonPrompts = getPrompts();

  // Supabase prompts (newest first) followed by curated JSON seed data
  const prompts = [...supabasePrompts, ...jsonPrompts];

  const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));

  return (
    <HeroSearch
      initialPrompts={prompts}
      profileMap={profileMap}
      initialQuery={initialQuery}
    />
  );
}
