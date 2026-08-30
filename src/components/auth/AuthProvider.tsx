/**
 * AuthProvider – React context for Supabase authentication.
 * Provides user state, loading status, and auth actions to the component tree.
 */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { extractErrorMessage } from '@/lib/errorLogger';

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

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // ── Proactive session refresh on tab resume ──────────────────
        // When the user returns after the tab was hidden for a while,
        // refresh the session immediately so the next Supabase call
        // uses a fresh JWT — avoids "JWT Issued at future" clock-skew
        // errors on the first request after idle.
        let hiddenAt: number | null = null;
        const STALE_THRESHOLD_MS = 30_000; // 30 seconds

        const handleVisibilityChange = (): void => {
            if (document.visibilityState === 'hidden') {
                hiddenAt = Date.now();
            } else if (document.visibilityState === 'visible' && hiddenAt !== null) {
                const elapsed = Date.now() - hiddenAt;
                hiddenAt = null;
                if (elapsed >= STALE_THRESHOLD_MS) {
                    // Fire-and-forget — if it fails the retry wrapper in the
                    // store will handle it on the next data operation.
                    supabase.auth.refreshSession().catch(() => {});
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
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error: error?.message ?? null };
    };

    const signOut = async (): Promise<void> => {
        await supabase.auth.signOut();
        // Force a page reload/redirect to clear state and trigger middleware
        window.location.href = '/login';
    };

    const resetPassword = async (email: string): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            return { error: error?.message ?? null };
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            return { error: msg || 'Failed to initialize password reset' };
        }
    };

    const updatePassword = async (password: string): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.updateUser({ password });
        return { error: error?.message ?? null };
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
