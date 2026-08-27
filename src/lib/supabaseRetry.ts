/**
 * Resilient retry wrapper for Supabase operations.
 *
 * Transparently handles the transient "JWT Issued at future" (PGRST303)
 * error caused by clock skew between Supabase Auth and PostgREST.
 *
 * Strategy:
 * 1. Run the operation.
 * 2. If it throws a JWT-future error, wait with exponential back-off,
 *    refresh the auth session to get a fresh token, then retry.
 * 3. Give up after MAX_RETRIES and let the caller handle the error.
 *
 * Only JWT clock-skew errors trigger a retry — all other errors are
 * re-thrown immediately so real failures are never masked.
 */

import { supabase } from '@/lib/supabase';
import { extractErrorMessage } from '@/lib/errorLogger';

// ── Configuration ────────────────────────────────────────────────────────────

/** Maximum number of retry attempts before giving up. */
const MAX_RETRIES = 3;

/** Base delay in ms — doubled on each subsequent attempt (1 s → 2 s → 4 s). */
const BASE_DELAY_MS = 1000;

/** Upper cap so back-off never exceeds a reasonable wait. */
const MAX_DELAY_MS = 5000;

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns `true` when the error message indicates a JWT clock-skew rejection.
 * PostgREST reports this as "JWT Issued at future" (code PGRST303).
 */
function isJwtFutureError(err: unknown): boolean {
    const msg = extractErrorMessage(err).toLowerCase();
    return msg.includes('jwt issued at future');
}

/**
 * Computes exponential back-off delay capped at `MAX_DELAY_MS`.
 */
function getBackoffDelay(attempt: number): number {
    return Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Wraps an async Supabase operation with automatic JWT-future retry logic.
 *
 * @param fn      - The async operation to execute (should throw on error).
 * @param label   - Human-readable label for debug logging (e.g. 'fetchTransactions').
 * @returns       The resolved value of `fn`.
 * @throws        Re-throws the original error if it is not a JWT-future error,
 *                or if all retries are exhausted.
 *
 * @example
 * ```ts
 * const data = await withJwtRetry(async () => {
 *     const { data, error } = await supabase.from('table').select('*');
 *     if (error) throw error;
 *     return data;
 * }, 'fetchData');
 * ```
 */
export async function withJwtRetry<T>(
    fn: () => Promise<T>,
    label?: string,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;

            // Only retry on JWT clock-skew errors — everything else surfaces immediately.
            if (!isJwtFutureError(err) || attempt >= MAX_RETRIES) {
                throw err;
            }

            const delay = getBackoffDelay(attempt);

            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[supabaseRetry] JWT future error in "${label ?? 'unknown'}" — ` +
                    `retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms`,
                );
            }

            await new Promise((resolve) => setTimeout(resolve, delay));

            // Refresh the session to obtain a new JWT with a current `iat` claim.
            await supabase.auth.refreshSession();
        }
    }

    // Unreachable in practice — the loop always either returns or throws.
    throw lastError;
}
