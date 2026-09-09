import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import { logError } from '@/lib/errorLogger';
import type { AuthError } from '@supabase/supabase-js';

vi.mock('@/lib/errorLogger', () => ({
    logError: vi.fn(),
    extractErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: vi.fn() } },
            }),
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            resetPasswordForEmail: vi.fn(),
            updateUser: vi.fn(),
            refreshSession: vi.fn().mockResolvedValue({ data: {}, error: null }),
        },
    },
}));

describe('AuthProvider – Multi-Level Error Logging & Security', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('logs error and sanitized metadata when signIn fails', async () => {
        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
            data: { user: null, session: null },
            error: { name: 'AuthApiError', message: 'Invalid login credentials', status: 400 } as unknown as AuthError,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        let res: { error: string | null } = { error: null };
        await act(async () => {
            res = await result.current.signIn('victim@example.com', 'SuperSecretPass123!');
        });

        expect(res.error).toBe('Invalid login credentials');
        expect(logError).toHaveBeenCalledWith(
            'AuthProvider:signIn',
            expect.anything(),
            expect.objectContaining({ email: 'victim@example.com' }),
            'warning'
        );
        // Verify password is NEVER passed to logError
        const calls = vi.mocked(logError).mock.calls;
        const loggedJson = JSON.stringify(calls);
        expect(loggedJson).not.toContain('SuperSecretPass123!');
    });

    it('logs error when signUp fails', async () => {
        vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
            data: { user: null, session: null },
            error: { name: 'AuthApiError', message: 'User already registered', status: 400 } as unknown as AuthError,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        let res: { error: string | null } = { error: null };
        await act(async () => {
            res = await result.current.signUp('existing@example.com', 'SecurePass123!');
        });

        expect(res.error).toBe('User already registered');
        expect(logError).toHaveBeenCalledWith(
            'AuthProvider:signUp',
            expect.anything(),
            expect.objectContaining({ email: 'existing@example.com' }),
            'warning'
        );
    });

    it('catches and logs network failure during signOut and continues to redirect', async () => {
        vi.mocked(supabase.auth.signOut).mockRejectedValueOnce(new Error('Network drop on sign out'));

        const mockLocation = { href: '' };
        Object.defineProperty(window, 'location', {
            writable: true,
            value: mockLocation,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.signOut();
        });

        expect(logError).toHaveBeenCalledWith(
            'AuthProvider:signOut',
            expect.anything(),
            expect.anything(),
            'error'
        );
        expect(mockLocation.href).toBe('/login');
    });

    it('logs error when resetPassword fails', async () => {
        vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
            data: null,
            error: { name: 'AuthApiError', message: 'Rate limit exceeded', status: 429 } as unknown as AuthError,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        let res: { error: string | null } = { error: null };
        await act(async () => {
            res = await result.current.resetPassword('rate@example.com');
        });

        expect(res.error).toBe('Rate limit exceeded');
        expect(logError).toHaveBeenCalledWith(
            'AuthProvider:resetPassword',
            expect.anything(),
            expect.objectContaining({ email: 'rate@example.com' }),
            'warning'
        );
    });

    it('logs error when updatePassword fails', async () => {
        vi.mocked(supabase.auth.updateUser).mockResolvedValueOnce({
            data: { user: null },
            error: { name: 'AuthApiError', message: 'Auth session missing', status: 401 } as unknown as AuthError,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        );
        const { result } = renderHook(() => useAuth(), { wrapper });

        let res: { error: string | null } = { error: null };
        await act(async () => {
            res = await result.current.updatePassword('NewSecretPass123!');
        });

        expect(res.error).toBe('Auth session missing');
        expect(logError).toHaveBeenCalledWith(
            'AuthProvider:updatePassword',
            expect.anything(),
            expect.anything(),
            'warning'
        );
    });
});
