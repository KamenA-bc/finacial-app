import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── Constants ────────────────────────────────────────────────────────────────

/** Expected value of the Authorization header: "Bearer <CRON_SECRET>" */
const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
    // 1. Validate the secret token so only Vercel Cron can trigger this.
    const authHeader = request.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate env vars are present.
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return NextResponse.json(
            { error: 'Missing Supabase environment variables' },
            { status: 500 }
        );
    }

    try {
        // 3. Perform a minimal, read-only query just to register activity.
        //    This prevents the free-tier Supabase project from pausing.
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { error } = await supabase
            .from('_keepalive') // replace with any real table name in your project
            .select('id')
            .limit(1);

        // A "table not found" error still counts as DB activity – that's fine.
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
            throw error;
        }

        return NextResponse.json({
            ok: true,
            pingedAt: new Date().toISOString(),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
