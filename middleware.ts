import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { generateNonce } from './app/lib/utils/security';

export async function middleware(request: NextRequest) {
  // Generate cryptographically secure nonce for CSP
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  
  // Build comprehensive CSP header
  // - nonce: for inline scripts we control (theme script)
  // - strict-dynamic: allows scripts loaded by nonced scripts to execute
  // - wasm-unsafe-eval: required for Shiki syntax highlighting (WebAssembly)
  // - unsafe-eval: only in development for React debugging
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-inline'" : ''};
    img-src 'self' https://*.githubusercontent.com data:;
    connect-src 'self' https://*.supabase.co;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    wasm-unsafe-eval;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Add security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Nonce', nonce); // Pass nonce to components
  
  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // HSTS - only in production (handled by Vercel/Next.js in dev)
  if (!isDev) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect create route
  if (request.nextUrl.pathname.startsWith('/create') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Protect settings route
  if (request.nextUrl.pathname.startsWith('/settings') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Add pathname to headers for route detection in server components
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
