/**
 * Next.js middleware for route protection.
 * Redirects unauthenticated users to /login, allows public routes.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that do not require authentication. */
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/update-password'];

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;

    // Allow public routes without auth check
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Allow automated testing with e2e-test-auth cookie in non-production environments
    if (process.env.NODE_ENV !== 'production' && request.cookies.get('e2e-test-auth')?.value === 'true') {
        return NextResponse.next();
    }

    // ── Performance Fast-Path ──────────────────────────────────────────────
    // 1. If request has no Supabase auth token cookies, redirect to /login immediately in 0ms
    //    instead of waiting 600-1000ms for an external Supabase Auth network call to fail.
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some((c) =>
        c.name.startsWith('sb-') && c.name.includes('-auth-token')
    );

    if (!hasAuthCookie) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Next.js link prefetch optimization:
    //    When user hovers or viewport sees a link, Next.js sends a background prefetch request.
    //    Bypass blocking getUser() call on prefetches to prevent network congestion on mobile.
    const isPrefetch =
        request.headers.get('x-purpose') === 'prefetch' ||
        request.headers.get('purpose') === 'prefetch';
    if (isPrefetch) {
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users to login
    if (!user) {
        const loginUrl = new URL('/login', request.url);
        const redirectResponse = NextResponse.redirect(loginUrl);
        response.cookies.getAll().forEach((c) => {
            redirectResponse.cookies.set(c.name, c.value, c);
        });
        return redirectResponse;
    }

    return response;
}

export default proxy;

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - _next/static, _next/image (Next.js internals)
         * - favicon.ico, images, etc.
         * - API routes (they handle their own auth)
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
