'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useFavorites } from './FavoritesProvider';
import type { User } from '@supabase/supabase-js';

type Props = {
  user: User | null;
  isAdmin: boolean;
};

export default function AuthButton({ user, isAdmin }: Props) {
  const router = useRouter();
  const { savedIds } = useFavorites();
  const favCount = savedIds.size;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors"
      >
        Kirjaudu
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/suosikit"
        className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-teal hover:text-teal-dark transition-colors"
      >
        Suosikit
        {favCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full text-[10px] font-bold bg-teal text-white leading-none">
            {favCount}
          </span>
        )}
      </Link>
      <Link
        href="/submit"
        className="hidden sm:inline text-sm font-medium text-teal hover:text-teal-dark transition-colors"
      >
        Lähetä prompti
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="hidden sm:inline text-sm font-medium text-teal hover:text-teal-dark transition-colors"
        >
          Hallinta
        </Link>
      )}
      <span className="hidden md:block text-sm text-muted truncate max-w-[160px]">
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        className="px-3 py-1.5 rounded-xl border border-warm-border text-sm font-medium text-foreground hover:border-teal transition-colors"
      >
        Kirjaudu ulos
      </button>
    </div>
  );
}
