import { notFound } from 'next/navigation';
import { getCodeByIdAsync } from '@/lib/codes';
import CodeDetail from '@/components/CodeDetail';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CodeDetailPage({ params }: Props) {
  const { id } = await params;
  const code = await getCodeByIdAsync(id);

  if (!code) {
    notFound();
  }

  return <CodeDetail code={code} />;
}
