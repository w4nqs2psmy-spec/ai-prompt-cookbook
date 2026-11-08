export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getPrompts, getPromptByIdAsync } from '@/lib/prompts';
import PromptDetail from '@/components/PromptDetail';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  // Pre-render JSON seed prompts at build time.
  // Supabase prompts are rendered on-demand (force-dynamic).
  return getPrompts().map((p) => ({ id: p.id }));
}

export default async function PromptPage({ params }: Props) {
  const { id } = await params;
  const prompt = await getPromptByIdAsync(id);
  if (!prompt) notFound();
  return <PromptDetail prompt={prompt} />;
}
