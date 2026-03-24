/**
 * Supabase client singleton for browser-side usage.
 * Uses @supabase/ssr for proper Next.js cookie-based session handling.
 * Lazily initialized to avoid build-time errors when env vars are placeholders.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
    if (_client) return _client;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error(
            'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
            'Please set these in .env.local.'
        );
    }

    _client = createBrowserClient(url, key);
    return _client;
};

/**
 * Convenience export for use in client components.
 * Will throw if called before env vars are set.
 */
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return Reflect.get(getSupabaseClient(), prop);
    },
});
