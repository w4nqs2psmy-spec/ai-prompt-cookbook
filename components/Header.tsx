import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import AuthButton from './AuthButton';
import FavoritesNavCount from './FavoritesNavCount';

/**
 * Global app header — server component so it can read the Supabase session
 * server-side and pass user/isAdmin to the client AuthButton.
 *
 * The favorites count badge is handled client-side via FavoritesNavCount
 * (reads from FavoritesContext) to avoid an extra DB query on every page render.
 */
const NAV_LINK =
  'px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-warm-border/40 rounded-lg transition-colors inline-flex items-center';

export default async function Header() {
  const supabase = createClient();
  // getSession() reads from the local cookie — no network round-trip.
  // This is safe for display-only auth checks (nav links, AuthButton).
  // Individual API routes and server actions still call getUser() where
  // actual identity verification is required.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;

  return (
    <header className="border-b border-warm-border bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.svg"
              alt="AI Prompt Cookbook"
              height={32}
              width={32}
              className="h-8 w-auto"
              priority
            />
            <span className="font-bold text-xl text-foreground">AI Prompt Cookbook</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/promptit" className={NAV_LINK}>
              Promptit
            </Link>
            <Link href="/skills" className={NAV_LINK}>
              Skillit
            </Link>
            <Link href="/codes" className={NAV_LINK}>
              Koodit
            </Link>
            <Link href="/tips" className={NAV_LINK}>
              Vinkit
            </Link>
            <Link href="/community" className={NAV_LINK}>
              Yhteisö
            </Link>
            {user && (
              <Link href="/suosikit" className={NAV_LINK}>
                Suosikit
                {/* Count badge from client context — no server DB query */}
                <FavoritesNavCount />
              </Link>
            )}
          </nav>
        </div>
        <AuthButton user={user} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
