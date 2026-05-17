import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Start with a passthrough response so we can mutate cookies on it.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Mirror cookies onto the request for downstream middleware
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Rebuild the response so the new cookies are set in the browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() (local cookie read, no network round-trip) to check
  // whether the user is authenticated. This is safe here because we only
  // need a boolean "is someone logged in?" for the redirect — we are NOT
  // making any privileged DB operations based on this result.
  // getUser() (network call to Supabase Auth) is still used inside
  // individual API routes and server actions where identity must be verified.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!session) {
    if (pathname === '/submit' || pathname.startsWith('/suosikit') || pathname.startsWith('/admin')) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  // Only run middleware on routes that require authentication.
  // Public pages (/, /promptit, /skills, /community, /api/*, etc.) are
  // excluded so we never pay the Supabase client setup cost for them.
  matcher: ['/submit', '/suosikit', '/suosikit/:path*', '/admin', '/admin/:path*'],
};
