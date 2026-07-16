export const dynamic = 'force-dynamic';

import { getApprovedSupabaseCodes } from '@/lib/codes';
import CodeHeroSearch from '@/components/CodeHeroSearch';

type Props = {
  searchParams: { search?: string; page?: string };
};

export default async function CodesPage({ searchParams }: Props) {
  const initialQuery = searchParams.search ?? '';
  const initialPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  const codes = await getApprovedSupabaseCodes();

  return (
    <CodeHeroSearch
      initialCodes={codes}
      initialQuery={initialQuery}
      initialPage={initialPage}
    />
  );
}
