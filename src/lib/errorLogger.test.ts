/**
 * Unit tests for the centralized error logging module.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    extractErrorMessage,
    extractErrorStack,
    logError,
    persistToSupabase,
    sanitizeMetadata,
    clearErrorLoggerRateLimit,
} from '@/lib/errorLogger';
import type { ErrorLogEntry } from '@/lib/errorLogger';

// ── Mock Supabase ────────────────────────────────────────────────────────────

const mockInsert = vi.fn().mockResolvedValue({ error: null });

vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: mockInsert,
        })),
    },
}));

// ── extractErrorMessage ──────────────────────────────────────────────────────

describe('extractErrorMessage', () => {
    it('extracts message from a standard Error instance', () => {
        const err = new Error('Something broke');
        expect(extractErrorMessage(err)).toBe('Something broke');
    });

    it('extracts message from a Supabase PostgrestError-shaped object', () => {
        const postgrestError = {
            message: 'column "is_with_others" does not exist',
            details: null,
            hint: null,
            code: '42703',
        };
        expect(extractErrorMessage(postgrestError)).toBe(
            'column "is_with_others" does not exist'
        );
    });

    it('extracts message from a Supabase AuthError-shaped object', () => {
        const authError = {
            message: 'JWT expired',
            status: 401,
            name: 'AuthApiError',
        };
        expect(extractErrorMessage(authError)).toBe('JWT expired');
    });

    it('returns the string directly when a string is thrown', () => {
        expect(extractErrorMessage('network timeout')).toBe('network timeout');
    });

    it('stringifies unknown object shapes', () => {
        const weird = { code: 500, reason: 'unknown' };
        expect(extractErrorMessage(weird)).toBe(
            JSON.stringify(weird)
        );
    });

    it('handles null gracefully', () => {
        expect(extractErrorMessage(null)).toBe('null');
    });

    it('handles undefined gracefully', () => {
        expect(extractErrorMessage(undefined)).toBe('undefined');
    });

    it('handles a number gracefully', () => {
        expect(extractErrorMessage(42)).toBe('42');
    });

    it('ignores empty message strings and falls back', () => {
        const obj = { message: '' };
        expect(extractErrorMessage(obj)).toBe('{"message":""}');
    });
});

// ── extractErrorStack ────────────────────────────────────────────────────────

describe('extractErrorStack', () => {
    it('returns stack from a standard Error', () => {
        const err = new Error('test');
        expect(extractErrorStack(err)).toContain('Error: test');
    });

    it('returns stack from a plain object with stack property', () => {
        const obj = { message: 'fail', stack: 'at line 42' };
        expect(extractErrorStack(obj)).toBe('at line 42');
    });

    it('returns null when no stack is available', () => {
        expect(extractErrorStack('just a string')).toBeNull();
        expect(extractErrorStack({ message: 'no stack' })).toBeNull();
        expect(extractErrorStack(null)).toBeNull();
    });
});

// ── sanitizeMetadata ─────────────────────────────────────────────────────────

describe('sanitizeMetadata', () => {
    it('redacts sensitive keys like email and password', () => {
        const cleaned = sanitizeMetadata({
            userEmail: 'user@example.com',
            password: 'secretpassword',
            token: 'jwt.token.here',
            publicField: 'safe',
        });

        expect(cleaned.userEmail).toBe('[REDACTED]');
        expect(cleaned.password).toBe('[REDACTED]');
        expect(cleaned.token).toBe('[REDACTED]');
        expect(cleaned.publicField).toBe('safe');
    });

    it('redacts full entry transaction payloads', () => {
        const cleaned = sanitizeMetadata({
            entry: { amount: 150, description: 'Private expense' },
        });

        expect(cleaned.entry).toBe('[TRANSACTION_PAYLOAD]');
    });
});

// ── logError ─────────────────────────────────────────────────────────────────

describe('logError', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.clearAllMocks();
        clearErrorLoggerRateLimit();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('logs to console.error in development mode with sanitized metadata', () => {
        logError('testAction', new Error('dev error'), { email: 'user@test.com', extra: 'context' });

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[ErrorLogger] testAction:',
            'dev error',
            expect.objectContaining({ email: '[REDACTED]', extra: 'context' })
        );
    });

    it('debounces identical repeated error signatures', () => {
        logError('repeatAction', new Error('same error'));
        logError('repeatAction', new Error('same error'));
        logError('repeatAction', new Error('same error'));

        // Only the first one should be logged; duplicates within debounce period are dropped
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('does not throw when called with any error shape', () => {
        expect(() => logError('a', new Error('e'))).not.toThrow();
        expect(() => logError('b', 'string error')).not.toThrow();
        expect(() => logError('c', { message: 'obj' })).not.toThrow();
        expect(() => logError('d', null)).not.toThrow();
        expect(() => logError('e', undefined)).not.toThrow();
        expect(() => logError('f', 42)).not.toThrow();
    });
});

// ── persistToSupabase ────────────────────────────────────────────────────────

describe('persistToSupabase', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.clearAllMocks();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('inserts a structured entry into the error_logs table directly', async () => {
        const entry: ErrorLogEntry = {
            action: 'fetchTransactions',
            message: 'JWT expired',
            stack: null,
            severity: 'error',
            metadata: { userId: 'abc-123' },
        };

        await persistToSupabase(entry);

        expect(mockInsert).toHaveBeenCalledWith({
            action: 'fetchTransactions',
            message: 'JWT expired',
            stack: null,
            severity: 'error',
            metadata: { userId: 'abc-123' },
        });
    });

    it('logs to console if Supabase insert fails (does not throw)', async () => {
        mockInsert.mockResolvedValueOnce({
            error: { message: 'RLS policy violation' },
        });

        const entry: ErrorLogEntry = {
            action: 'addExpense',
            message: 'test',
            stack: null,
            severity: 'error',
            metadata: {},
        };

        await expect(persistToSupabase(entry)).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[ErrorLogger] Supabase insert failed:',
            { message: 'RLS policy violation' }
        );
    });
});
