/**
 * AuthProvider – React context for Supabase authentication.
 * Provides user state, loading status, and auth actions to the component tree.
 */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
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

        return () => subscription.unsubscribe();
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
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
