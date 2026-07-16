export const dynamic = 'force-dynamic';

import { getApprovedSupabaseTips } from '@/lib/tips';
import TipHeroSearch from '@/components/TipHeroSearch';

type Props = {
  searchParams: { search?: string; page?: string };
};

export default async function TipsPage({ searchParams }: Props) {
  const initialQuery = searchParams.search ?? '';
  const initialPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  const tips = await getApprovedSupabaseTips();

  return (
    <TipHeroSearch
      initialTips={tips}
      initialQuery={initialQuery}
      initialPage={initialPage}
    />
  );
}
