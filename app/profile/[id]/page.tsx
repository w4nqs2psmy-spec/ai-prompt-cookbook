export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProfiles, getProfileById, formatJoinedFi } from '@/lib/profiles';
import { getPrompts } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
  return getProfiles().map((p) => ({ id: p.id }));
}

export default function ProfilePage({ params }: Props) {
  const profile = getProfileById(params.id);
  if (!profile) notFound();

  const prompts = getPrompts().filter((p) => p.submitted_by === profile.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Takaisin yhteisöön
        </Link>

        {/* Profile header */}
        <div className="flex items-start gap-5 mb-10">
          {/* Large avatar */}
          <span
            className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold shrink-0"
            style={{ backgroundColor: profile.avatar_color }}
            aria-hidden="true"
          >
            {profile.avatar_initials}
          </span>

          <div className="pt-1">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-1">
              {profile.display_name}
            </h1>
            <p className="text-sm text-muted mb-3">
              Jäsen {formatJoinedFi(profile.joined)}
            </p>
            {profile.bio && (
              <p className="text-base text-muted leading-relaxed max-w-lg">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Divider with prompt count */}
        <div className="flex items-center gap-4 mb-7">
          <div className="divider-ornament flex-1 my-0" />
          <p className="text-sm text-muted shrink-0">
            <span className="font-serif text-foreground font-semibold text-base">
              {prompts.length}
            </span>{' '}
            {prompts.length === 1 ? 'prompti' : 'promptia'}
          </p>
          <div className="divider-ornament flex-1 my-0" />
        </div>

        {/* Prompts grid */}
        {prompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {prompts.map((prompt, index) => (
              <div
                key={prompt.id}
                className="animate-card-in"
                style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
              >
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🌱</div>
            <p className="font-serif text-lg text-foreground mb-1">Ei vielä prompteja</p>
            <p className="text-sm text-muted">Tämä jäsen ei ole vielä lisännyt prompteja.</p>
          </div>
        )}
      </div>
    </div>
  );
}
