import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Supabase magic-link / OTP callback.
 * Supabase redirects here with ?code=... after the user clicks their email link.
 * We exchange the code for a session and redirect to the intended destination.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Code missing or exchange failed — redirect to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
