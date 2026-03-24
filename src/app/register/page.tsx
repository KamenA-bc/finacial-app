/**
 * Register page – email/password sign-up with Supabase Auth.
 * Matches existing form styling (clean white cards, Inter font, muted colors).
 */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z
    .object({
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage(): React.ReactElement {
    const { signUp } = useAuth();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues): Promise<void> => {
        setServerError(null);
        const { error } = await signUp(data.email, data.password);
        if (error) {
            setServerError(error);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2000);
        }
    };

    const inputClass =
        'w-full px-3 py-2.5 pl-10 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-4">
                        <UserPlus size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Start tracking your finances
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 mb-3">
                                <UserPlus size={18} className="text-emerald-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                Account created!
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Redirecting to login…
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                            noValidate
                        >
                            {serverError && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-md px-3 py-2.5">
                                    {serverError}
                                </div>
                            )}

                            {/* Email */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="register-email"
                                    className="text-xs text-gray-500 font-medium"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                                    />
                                    <input
                                        id="register-email"
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
                                <label
                                    htmlFor="register-password"
                                    className="text-xs text-gray-500 font-medium"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                                    />
                                    <input
                                        id="register-password"
                                        type="password"
                                        placeholder="At least 6 characters"
                                        autoComplete="new-password"
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

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="register-confirm"
                                    className="text-xs text-gray-500 font-medium"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                                    />
                                    <input
                                        id="register-confirm"
                                        type="password"
                                        placeholder="Repeat your password"
                                        autoComplete="new-password"
                                        {...register('confirmPassword')}
                                        className={inputClass}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-rose-500">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 transition-all mt-1"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <UserPlus size={16} />
                                )}
                                {isSubmitting ? 'Creating account…' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-5">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
