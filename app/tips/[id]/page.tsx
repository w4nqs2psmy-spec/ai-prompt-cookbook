import { notFound } from 'next/navigation';
import { getTipByIdAsync } from '@/lib/tips';
import TipDetail from '@/components/TipDetail';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TipDetailPage({ params }: Props) {
  const { id } = await params;
  const tip = await getTipByIdAsync(id);

  if (!tip) {
    notFound();
  }

  return <TipDetail tip={tip} />;
}
