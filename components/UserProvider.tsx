'use client';

/**
 * Provides Supabase auth state to the whole component tree via React context.
 * Replaces the per-component supabase.auth.getUser() calls that were firing
 * once per card on every listing page mount (~20+ network requests).
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserCtx = {
  user: User | null;
  isAdmin: boolean;
  /** true while the initial getUser() is in-flight */
  loading: boolean;
};

const UserContext = createContext<UserCtx>({
  user: null,
  isAdmin: false,
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setLoading(false);
    });
  }, []);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail;

  return (
    <UserContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserCtx {
  return useContext(UserContext);
}
