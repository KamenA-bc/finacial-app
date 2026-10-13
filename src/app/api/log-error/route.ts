import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-side API endpoint for ingesting client and application error logs.
 * Caps payload size to prevent storage DoS and supports server-side credentials.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { action, message, stack, severity, metadata } = body ?? {};

        if (!action || !message) {
            return NextResponse.json({ error: 'Missing required fields: action and message' }, { status: 400 });
        }

        // Cap metadata size to max 2KB to prevent payload flooding
        let safeMetadata: Record<string, unknown> = {};
        if (typeof metadata === 'object' && metadata !== null) {
            try {
                const serialized = JSON.stringify(metadata);
                safeMetadata = serialized.length > 2048
                    ? { truncated: true, preview: serialized.slice(0, 2000) }
                    : metadata;
            } catch {
                safeMetadata = { serializationError: true };
            }
        }

        const supabase = createClient(url, key, {
            auth: { persistSession: false },
        });

        const { error } = await supabase.from('error_logs').insert({
            action: String(action).slice(0, 150),
            message: String(message).slice(0, 2000),
            stack: stack ? String(stack).slice(0, 4000) : null,
            severity: severity === 'warning' || severity === 'info' ? severity : 'error',
            metadata: safeMetadata,
        });

        if (error) {
            console.error('[API /api/log-error] Supabase insert failed:', error.message);
            return NextResponse.json({ error: 'Failed to record error log' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
        console.error('[API /api/log-error] Unexpected handler exception:', errorMsg);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
