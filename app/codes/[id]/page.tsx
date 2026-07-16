import { notFound } from 'next/navigation';
import { getCodeByIdAsync } from '@/lib/codes';
import CodeDetail from '@/components/CodeDetail';

type Props = {
  params: { id: string };
};

export default async function CodeDetailPage({ params }: Props) {
  const code = await getCodeByIdAsync(params.id);

  if (!code) {
    notFound();
  }

  return <CodeDetail code={code} />;
}
