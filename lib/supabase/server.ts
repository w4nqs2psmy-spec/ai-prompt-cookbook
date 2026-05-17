import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for Server Components, Server Actions,
 * and Route Handlers.
 *
 * Next.js 14: cookies() is synchronous (returns ReadonlyRequestCookies directly).
 * The setAll try/catch silences errors thrown from read-only Server Component
 * contexts — the middleware handles session cookie writes on the response.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore.
            // Middleware keeps the session fresh.
          }
        },
      },
    }
  );
}
