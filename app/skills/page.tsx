export const dynamic = 'force-dynamic';

import { getSkills, getApprovedSupabaseSkills } from '@/lib/skills';
import SkillsHeroSearch from '@/components/SkillsHeroSearch';

type Props = {
  searchParams: { page?: string };
};

export default async function SkillsPage({ searchParams }: Props) {
  const initialPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  const [supabaseSkills] = await Promise.all([getApprovedSupabaseSkills()]);
  const mockSkills = getSkills();
  const skills = [...supabaseSkills, ...mockSkills];
  return <SkillsHeroSearch initialSkills={skills} initialPage={initialPage} />;
}
