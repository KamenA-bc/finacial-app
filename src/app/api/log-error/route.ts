import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-side API endpoint for ingesting client and application error logs.
 * Bypasses browser CORS/JWT quirks and reliably writes to the `error_logs` table.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { action, message, stack, severity, metadata } = body ?? {};

        if (!action || !message) {
            return NextResponse.json({ error: 'Missing required fields: action and message' }, { status: 400 });
        }

        const supabase = createClient(url, key, {
            auth: { persistSession: false },
        });

        const { error } = await supabase.from('error_logs').insert({
            action: String(action).slice(0, 150),
            message: String(message).slice(0, 2000),
            stack: stack ? String(stack).slice(0, 4000) : null,
            severity: severity === 'warning' || severity === 'info' ? severity : 'error',
            metadata: typeof metadata === 'object' && metadata !== null ? metadata : {},
        });

        if (error) {
            console.error('[API /api/log-error] Supabase insert failed:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
        console.error('[API /api/log-error] Unexpected handler exception:', errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
