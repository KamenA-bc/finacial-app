/**
 * AuthProvider – React context for Supabase authentication.
 * Provides user state, loading status, and auth actions to the component tree.
 */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { extractErrorMessage, logError } from '@/lib/errorLogger';
import { useFinancialStore } from '@/store/transactionStore';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({
    children,
}: AuthProviderProps): React.ReactElement => {
    // In E2E tests, initialize with mock user if cookie is present
    const [user, setUser] = useState<User | null>(() => {
        if (typeof document !== 'undefined' && document.cookie.includes('playwright_test_user=true')) {
            return {
                id: '00000000-0000-0000-0000-000000000001',
                email: 'e2e@test.local',
                app_metadata: {},
                user_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            } as User;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth state changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Stale-session detector: when tab returns to foreground after >= 5 min,
        // refresh the auth token to avoid clock-skew or expired-JWT rejections.
        let hiddenAt: number | null = null;
        const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

        const handleVisibilityChange = (): void => {
            if (document.visibilityState === 'hidden') {
                hiddenAt = Date.now();
            } else if (document.visibilityState === 'visible' && hiddenAt !== null) {
                const elapsed = Date.now() - hiddenAt;
                hiddenAt = null;
                if (elapsed >= STALE_THRESHOLD_MS) {
                    supabase.auth.refreshSession().catch((err) => {
                        logError('AuthProvider:staleSessionRefresh', err, {}, 'warning');
                    });
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const signUp = async (
        email: string,
        password: string
    ): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                logError('AuthProvider:signUp', error, { email }, 'warning');
                return { error: error.message };
            }
            return { error: null };
        } catch (err) {
            logError('AuthProvider:signUp', err, { email }, 'warning');
            return { error: extractErrorMessage(err) };
        }
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                logError('AuthProvider:signIn', error, { email }, 'warning');
                return { error: error.message };
            }
            return { error: null };
        } catch (err) {
            logError('AuthProvider:signIn', err, { email }, 'warning');
            return { error: extractErrorMessage(err) };
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            useFinancialStore.getState().clearStoreCache();
        } catch (err) {
            logError('AuthProvider:clearStoreCache', err, {}, 'warning');
        }

        try {
            await supabase.auth.signOut();
        } catch (err) {
            logError('AuthProvider:signOut', err, {}, 'error');
        } finally {
            // Force a page reload/redirect to clear state and trigger middleware
            window.location.href = '/login';
        }
    };

    const resetPassword = async (email: string): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) {
                logError('AuthProvider:resetPassword', error, { email }, 'warning');
                return { error: error.message };
            }
            return { error: null };
        } catch (err: unknown) {
            logError('AuthProvider:resetPassword', err, { email }, 'warning');
            const msg = extractErrorMessage(err);
            return { error: msg || 'Failed to initialize password reset' };
        }
    };

    const updatePassword = async (password: string): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                logError('AuthProvider:updatePassword', error, {}, 'warning');
                return { error: error.message };
            }
            return { error: null };
        } catch (err: unknown) {
            logError('AuthProvider:updatePassword', err, {}, 'warning');
            const msg = extractErrorMessage(err);
            return { error: msg || 'Failed to update password' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
