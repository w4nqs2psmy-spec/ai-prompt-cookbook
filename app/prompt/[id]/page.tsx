export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getPrompts, getPromptByIdAsync } from '@/lib/prompts';
import PromptDetail from '@/components/PromptDetail';

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
  // Pre-render JSON seed prompts at build time.
  // Supabase prompts are rendered on-demand (force-dynamic).
  return getPrompts().map((p) => ({ id: p.id }));
}

export default async function PromptPage({ params }: Props) {
  const prompt = await getPromptByIdAsync(params.id);
  if (!prompt) notFound();
  return <PromptDetail prompt={prompt} />;
}
