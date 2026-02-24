import { NextRequest, NextResponse } from 'next/server';

// ── Constants ────────────────────────────────────────────────────────────────

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

    // 2. If Supabase isn't configured, just return ok (keeps the route working).
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return NextResponse.json({
            ok: true,
            note: 'No Supabase configured – route is alive.',
            pingedAt: new Date().toISOString(),
        });
    }

    // 3. Ping Supabase via native fetch – no SDK package required.
    //    A lightweight REST call to the health endpoint registers activity.
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/?limit=1`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            cache: 'no-store',
        });

        return NextResponse.json({
            ok: true,
            supabaseStatus: res.status,
            pingedAt: new Date().toISOString(),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
