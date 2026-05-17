export const dynamic = 'force-dynamic';

import { getSkills, getApprovedSupabaseSkills } from '@/lib/skills';
import SkillsHeroSearch from '@/components/SkillsHeroSearch';

export default async function SkillsPage() {
  const [supabaseSkills] = await Promise.all([getApprovedSupabaseSkills()]);
  const mockSkills = getSkills();
  const skills = [...supabaseSkills, ...mockSkills];
  return <SkillsHeroSearch initialSkills={skills} />;
}
