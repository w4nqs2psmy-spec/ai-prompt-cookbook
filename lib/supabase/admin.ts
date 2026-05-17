import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client.
 * Bypasses RLS — use ONLY in server actions ('use server' files).
 * NEVER import this in client components or pages.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix — server-only).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
