/**
 * Login page – email/password sign-in with Supabase Auth.
 * Matches existing form styling (clean white cards, Inter font, muted colors).
 */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Login01Icon,
    Mail01Icon,
    LockPasswordIcon,
    Loading03Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '@/components/ui/AppIcon';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage(): React.ReactElement {
    const { signIn } = useAuth();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues): Promise<void> => {
        setServerError(null);
        const { error } = await signIn(data.email, data.password);
        if (error) {
            setServerError(error);
        } else {
            router.push('/');
        }
    };

    const inputClass =
        'w-full px-3 py-2.5 pl-10 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf9f7]">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 shadow-xs mb-4">
                        <AppIcon icon={Login01Icon} size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Sign in to your Finance Tracker
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] border border-stone-200/70 p-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                        noValidate
                    >
                        {serverError && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-lg px-3 py-2.5">
                                {serverError}
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="login-email"
                                className="text-xs text-stone-600 font-medium"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <AppIcon
                                    icon={Mail01Icon}
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={inputClass}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-rose-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="login-password"
                                    className="text-xs text-stone-600 font-medium"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[11px] text-stone-500 hover:text-stone-900 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <AppIcon
                                    icon={LockPasswordIcon}
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    {...register('password')}
                                    className={inputClass}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.98] disabled:opacity-60 transition-all mt-1"
                        >
                            {isSubmitting ? (
                                <AppIcon icon={Loading03Icon} size={16} className="animate-spin" />
                            ) : (
                                <AppIcon icon={Login01Icon} size={16} />
                            )}
                            {isSubmitting ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-stone-500 mt-5">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-stone-800 font-semibold hover:text-stone-950 transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
