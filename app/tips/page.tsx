export const dynamic = 'force-dynamic';

import { getApprovedSupabaseTips } from '@/lib/tips';
import TipHeroSearch from '@/components/TipHeroSearch';

type Props = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

export default async function TipsPage({ searchParams }: Props) {
  const { search, page } = await searchParams;
  const initialQuery = search ?? '';
  const initialPage = Math.max(1, parseInt(page ?? '1', 10) || 1);

  const tips = await getApprovedSupabaseTips();

  return (
    <TipHeroSearch
      initialTips={tips}
      initialQuery={initialQuery}
      initialPage={initialPage}
    />
  );
}
