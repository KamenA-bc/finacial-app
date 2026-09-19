/**
 * Next.js middleware for route protection.
 * Redirects unauthenticated users to /login, allows public routes.
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that do not require authentication. */
const AUTH_ROUTES = ['/login', '/register'];
const RECOVERY_ROUTES = ['/forgot-password', '/update-password'];

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;

    // 1. Password reset/recovery routes are always public
    if (RECOVERY_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some((c) =>
        c.name.startsWith('sb-') && c.name.includes('-auth-token')
    );

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // Allow automated testing with e2e-test-auth cookie in non-production environments
    if (process.env.NODE_ENV !== 'production' && request.cookies.get('e2e-test-auth')?.value === 'true') {
        if (isAuthRoute) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // ── Performance Fast-Path ──────────────────────────────────────────────
    // A. Unauthenticated visitor accessing /login or /register -> allow in 0ms
    if (isAuthRoute && !hasAuthCookie) {
        return NextResponse.next();
    }

    // B. Unauthenticated visitor accessing protected route without cookies -> redirect to /login in 0ms
    if (!isAuthRoute && !hasAuthCookie) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // C. Next.js link prefetch optimization on protected routes:
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

    // If authenticated user visits /login or /register, redirect to dashboard
    if (isAuthRoute) {
        if (user) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return response;
    }

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
