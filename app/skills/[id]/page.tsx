export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getSkills, getSkillByIdAsync } from '@/lib/skills';
import SkillDetail from '@/components/SkillDetail';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getSkills().map((s) => ({ id: s.id }));
}

export default async function SkillPage({ params }: Props) {
  const { id } = await params;
  const skill = await getSkillByIdAsync(id);
  if (!skill) notFound();
  return <SkillDetail skill={skill} />;
}
