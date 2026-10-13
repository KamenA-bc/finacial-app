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
 * - Circular-dependency safe: does NOT invoke `withJwtRetry` to prevent
 *   cascading storms during authentication outages.
 * - Extracts messages from plain objects (Supabase PostgrestError),
 *   standard Error instances, and unknown throw values.
 * - PII-safe: captures lightweight path (no query/hash credentials) and redacts emails/entries.
 * - Client-side rate-limited and debounced against error loops.
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

// ── Client Metadata & Sanitization ───────────────────────────────────────────

function getClientMetadata(): Record<string, string> {
    if (typeof window === 'undefined') return { env: 'server' };

    return {
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        screenWidth: String(window.screen.width),
        screenHeight: String(window.screen.height),
        language: navigator.language,
    };
}

export function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(metadata)) {
        const lowerKey = key.toLowerCase();
        if (
            lowerKey.includes('email') ||
            lowerKey.includes('password') ||
            lowerKey.includes('token') ||
            lowerKey.includes('secret')
        ) {
            clean[key] = '[REDACTED]';
        } else if (lowerKey === 'entry' && typeof value === 'object' && value !== null) {
            clean[key] = '[TRANSACTION_PAYLOAD]';
        } else {
            clean[key] = value;
        }
    }
    return clean;
}

// ── Rate Limiting & Debouncing ───────────────────────────────────────────────

const recentErrors = new Map<string, number>();
let logCountInWindow = 0;
let windowStartTime = Date.now();
const MAX_LOGS_PER_MINUTE = 20;
const DEBOUNCE_MS = 10_000;

export function clearErrorLoggerRateLimit(): void {
    recentErrors.clear();
    logCountInWindow = 0;
    windowStartTime = Date.now();
}

function shouldThrottle(signature: string): boolean {
    const now = Date.now();

    // 1. Reset rolling window
    if (now - windowStartTime > 60_000) {
        logCountInWindow = 0;
        windowStartTime = now;
        recentErrors.clear();
    }

    // 2. Check window capacity
    if (logCountInWindow >= MAX_LOGS_PER_MINUTE) {
        return true;
    }

    // 3. Debounce identical error signatures
    const lastSeen = recentErrors.get(signature);
    if (lastSeen !== undefined && now - lastSeen < DEBOUNCE_MS) {
        return true;
    }

    recentErrors.set(signature, now);
    logCountInWindow++;
    return false;
}

// ── Core Logger ──────────────────────────────────────────────────────────────

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
    const rawMessage = extractErrorMessage(err);
    const signature = `${action}:${rawMessage}`;

    if (shouldThrottle(signature)) {
        return;
    }

    const entry: ErrorLogEntry = {
        action,
        message: rawMessage,
        stack: extractErrorStack(err),
        severity,
        metadata: { ...sanitizeMetadata(metadata), ...getClientMetadata() },
    };

    // Always log to console for dev visibility
    console.error(`[ErrorLogger] ${entry.action}:`, entry.message, entry.metadata);

    // Persist to Supabase, fire-and-forget
    persistToSupabase(entry).catch((persistErr) => {
        console.error('[ErrorLogger] Failed to persist error log:', persistErr);
        console.error('[ErrorLogger] Original error:', entry);
    });
}

/**
 * Writes an error log entry to the Supabase `error_logs` table directly
 * without invoking retry loops.
 */
export async function persistToSupabase(entry: ErrorLogEntry): Promise<void> {
    try {
        const { error } = await supabase.from('error_logs').insert({
            action: entry.action,
            message: entry.message,
            stack: entry.stack,
            severity: entry.severity,
            metadata: entry.metadata,
        });
        if (error) throw error;
    } catch (persistErr) {
        // Fallback: in browser environments, post to /api/log-error server endpoint
        if (typeof window !== 'undefined' && typeof fetch === 'function') {
            try {
                await fetch('/api/log-error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entry),
                });
                return;
            } catch {
                // Suppress API fallback error
            }
        }
        console.error('[ErrorLogger] Supabase insert failed:', persistErr);
    }
}
