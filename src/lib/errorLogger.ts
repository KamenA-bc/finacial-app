/**
 * Centralized error logging utility.
 *
 * - In development: logs to console with structured context.
 * - In production: persists errors to a Supabase `error_logs` table
 *   for post-mortem debugging, then falls back to console if the
 *   DB write itself fails (avoids cascading failures).
 *
 * Design decisions:
 * - Fire-and-forget: logging never throws or blocks the caller.
 * - Extracts messages from plain objects (Supabase PostgrestError),
 *   standard Error instances, and unknown throw values.
 * - Captures lightweight client metadata (URL, user-agent) without PII.
 */

import { supabase } from '@/lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────

/** Severity levels for categorizing errors in the logs table. */
export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ErrorLogEntry {
    /** The store action or component operation that failed. */
    action: string;
    /** Human-readable error message extracted from the thrown value. */
    message: string;
    /** Raw stack trace when available. */
    stack: string | null;
    /** Severity level for filtering in the dashboard. */
    severity: ErrorSeverity;
    /** Arbitrary structured context (userId, entryId, format, etc.). */
    metadata: Record<string, unknown>;
}

// ── Error Message Extraction ─────────────────────────────────────────────────

/**
 * Robustly extracts a human-readable message from any thrown value.
 *
 * Supabase PostgrestError objects have a `message` property but are NOT
 * instances of the native `Error` class, which is why `err instanceof Error`
 * alone swallows the real message. This function handles all shapes:
 *   - Standard Error instances
 *   - Supabase PostgrestError / AuthError objects ({ message: string })
 *   - Primitive strings
 *   - Completely unknown values (stringified)
 */
export function extractErrorMessage(err: unknown): string {
    if (err == null) return String(err);
    if (typeof err === 'string') return err;

    if (typeof err === 'object' && 'message' in err) {
        const msg = (err as { message: unknown }).message;
        if (typeof msg === 'string' && msg.length > 0) return msg;
    }

    if (err instanceof Error) return err.message;

    try {
        const json = JSON.stringify(err);
        return json !== undefined ? json : String(err);
    } catch {
        return String(err);
    }
}

/**
 * Extracts a stack trace string when available.
 */
export function extractErrorStack(err: unknown): string | null {
    if (err instanceof Error && err.stack) return err.stack;
    if (err !== null && typeof err === 'object' && 'stack' in err) {
        const stack = (err as { stack: unknown }).stack;
        if (typeof stack === 'string') return stack;
    }
    return null;
}

// ── Client Metadata ──────────────────────────────────────────────────────────

function getClientMetadata(): Record<string, string> {
    if (typeof window === 'undefined') return { env: 'server' };

    return {
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenWidth: String(window.screen.width),
        screenHeight: String(window.screen.height),
        language: navigator.language,
    };
}

// ── Core Logger ──────────────────────────────────────────────────────────────

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Log an error with structured context. Fire-and-forget — never throws.
 *
 * @param action   - The operation that failed (e.g. 'fetchTransactions', 'exportPdf').
 * @param err      - The thrown value (Error, PostgrestError, string, unknown).
 * @param metadata - Optional extra context (userId, entryId, year, etc.).
 * @param severity - Defaults to 'error'.
 */
export function logError(
    action: string,
    err: unknown,
    metadata: Record<string, unknown> = {},
    severity: ErrorSeverity = 'error',
): void {
    const entry: ErrorLogEntry = {
        action,
        message: extractErrorMessage(err),
        stack: extractErrorStack(err),
        severity,
        metadata: { ...metadata, ...getClientMetadata() },
    };

    // Always log to console for dev visibility
    if (!IS_PRODUCTION) {
        console.error(`[ErrorLogger] ${entry.action}:`, entry.message, entry.metadata);
        return;
    }

    // In production: persist to Supabase, fire-and-forget
    persistToSupabase(entry).catch((persistErr) => {
        // Last resort: if DB write fails, at least console.error so
        // Vercel runtime logs capture it.
        console.error('[ErrorLogger] Failed to persist error log:', persistErr);
        console.error('[ErrorLogger] Original error:', entry);
    });
}

/**
 * Writes an error log entry to the Supabase `error_logs` table.
 * Separated for testability.
 */
export async function persistToSupabase(entry: ErrorLogEntry): Promise<void> {
    const { error } = await supabase.from('error_logs').insert({
        action: entry.action,
        message: entry.message,
        stack: entry.stack,
        severity: entry.severity,
        metadata: entry.metadata,
    });

    if (error) {
        // Don't throw — this is a best-effort logging mechanism.
        // Log to console so Vercel runtime logs still capture it.
        console.error('[ErrorLogger] Supabase insert failed:', error.message);
    }
}
