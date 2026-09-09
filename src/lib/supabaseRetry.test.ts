import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withJwtRetry } from './supabaseRetry';
import { supabase } from '@/lib/supabase';
import { logError } from '@/lib/errorLogger';

vi.mock('@/lib/errorLogger', () => ({
    logError: vi.fn(),
    extractErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            refreshSession: vi.fn().mockResolvedValue({ data: {}, error: null }),
        },
    },
}));

describe('withJwtRetry – Telemetry & Multi-Level Error Logging', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('executes successfully on first attempt without logging errors', async () => {
        const mockOp = vi.fn().mockResolvedValue('success');

        const result = await withJwtRetry(mockOp, 'fetchUser');

        expect(result).toBe('success');
        expect(mockOp).toHaveBeenCalledTimes(1);
        expect(logError).not.toHaveBeenCalled();
    });

    it('logs a warning on transient JWT clock-skew error before retrying', async () => {
        const jwtError = new Error('PGRST303: JWT Issued at future');
        const mockOp = vi
            .fn()
            .mockRejectedValueOnce(jwtError)
            .mockResolvedValueOnce('recovered after skew');

        const result = await withJwtRetry(mockOp, 'testOperation');

        expect(result).toBe('recovered after skew');
        expect(mockOp).toHaveBeenCalledTimes(2);
        expect(logError).toHaveBeenCalledWith(
            'supabaseRetry:jwtFuture',
            jwtError,
            expect.objectContaining({
                label: 'testOperation',
                attempt: 1,
            }),
            'warning'
        );
    });

    it('logs an error when all retries are exhausted and re-throws', async () => {
        const jwtError = new Error('PGRST303: JWT Issued at future');
        const mockOp = vi.fn().mockRejectedValue(jwtError);

        await expect(withJwtRetry(mockOp, 'exhaustedOp')).rejects.toThrow(jwtError);

        expect(logError).toHaveBeenCalledWith(
            'supabaseRetry:exhausted',
            jwtError,
            expect.objectContaining({
                label: 'exhaustedOp',
                maxRetries: 3,
            }),
            'error'
        );
    });

    it('logs session refresh failure during retry and continues back-off', async () => {
        const jwtError = new Error('PGRST303: JWT Issued at future');
        const refreshErr = new Error('Network error during session refresh');
        vi.mocked(supabase.auth.refreshSession).mockRejectedValueOnce(refreshErr);

        const mockOp = vi
            .fn()
            .mockRejectedValueOnce(jwtError)
            .mockResolvedValueOnce('recovered');

        const result = await withJwtRetry(mockOp, 'refreshFailTest');

        expect(result).toBe('recovered');
        expect(logError).toHaveBeenCalledWith(
            'supabaseRetry:refreshSessionError',
            refreshErr,
            expect.objectContaining({ label: 'refreshFailTest' }),
            'warning'
        );
    });
});
