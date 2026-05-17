export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getProfiles, formatJoinedFi, Profile } from '@/lib/profiles';

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link href={`/profile/${profile.id}`} className="block group">
      <article className="card-accent bg-card rounded-xl border border-warm-border p-5 flex gap-4">
        {/* Avatar */}
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-base shrink-0"
          style={{ backgroundColor: profile.avatar_color }}
          aria-hidden="true"
        >
          {profile.avatar_initials}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-serif font-semibold text-foreground group-hover:text-teal transition-colors leading-tight">
              {profile.display_name}
            </p>
            <span className="text-xs text-muted shrink-0">
              {profile.prompts_count} {profile.prompts_count === 1 ? 'prompti' : 'promptia'}
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-1">
            {profile.bio}
          </p>
          <p className="text-xs text-muted/70">
            Jäsen {formatJoinedFi(profile.joined)}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function CommunityPage() {
  const profiles = getProfiles().sort((a, b) => b.prompts_count - a.prompts_count);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-14 px-4 border-b border-warm-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-4">
              Yhteisö
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-5 leading-none">
              Opettajat jakavat
              <br />
              <span className="keyword-highlight text-teal">parhaita promptejaan</span>
            </h1>
            <p className="text-lg text-muted mb-2 leading-relaxed max-w-lg">
              Jokainen prompti on kirjoitettu oikeassa luokkahuoneessa – tai kahvihuoneessa.
            </p>
            <p className="text-sm text-muted/70">
              Voit esiintyä omalla nimelläsi, nimimerkillä tai nickillä — ihan miten haluat.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ornament divider ─────────────────────────────────────────── */}
      <div className="divider-ornament max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* ── Profile grid ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-sm text-muted mb-7">
          <span className="font-serif text-foreground text-base font-semibold">
            {profiles.length} jäsentä
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className="animate-card-in"
              style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
            >
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-warm-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted">Tehty opettajille ❤️</p>
          <a href="/submit" className="text-xs text-muted/60 hover:text-muted transition-colors">
            + Jaa prompti
          </a>
        </div>
      </footer>
    </div>
  );
}
