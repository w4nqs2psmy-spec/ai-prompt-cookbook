import { notFound } from 'next/navigation';
import { getTipByIdAsync } from '@/lib/tips';
import TipDetail from '@/components/TipDetail';

type Props = {
  params: { id: string };
};

export default async function TipDetailPage({ params }: Props) {
  const tip = await getTipByIdAsync(params.id);

  if (!tip) {
    notFound();
  }

  return <TipDetail tip={tip} />;
}
