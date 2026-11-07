'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Mail01Icon,
    Loading03Icon,
    ArrowLeft01Icon,
    Key01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { extractErrorMessage } from '@/lib/errorLogger';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage(): React.ReactElement {
    const { resetPassword } = useAuth();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordValues): Promise<void> => {
        try {
            setStatus('idle');
            setMessage(null);

            const { error } = await resetPassword(data.email);

            if (error) {
                setStatus('error');
                setMessage(error);
            } else {
                setStatus('success');
                setMessage(
                    'If an account exists with that email, a reset link has been sent.'
                );
            }
        } catch (err: unknown) {
            setStatus('error');
            const msg = extractErrorMessage(err);
            setMessage(msg || 'An unexpected client error occurred.');
        }
    };

    const inputClass =
        'w-full px-3 py-2.5 pl-10 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf9f7]">
            <div className="w-full max-w-sm">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-6 transition-colors"
                >
                    <AppIcon icon={ArrowLeft01Icon} size={14} /> Back to Sign In
                </Link>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 shadow-xs mb-4">
                        <AppIcon icon={Key01Icon} size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        We will send you an email with a link to reset it.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] border border-stone-200/70 p-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center py-4">
                            <IconSquircle size="lg" className="bg-emerald-50 text-emerald-600 border-emerald-200/70 mb-4">
                                <AppIcon icon={Mail01Icon} size={20} />
                            </IconSquircle>
                            <p className="text-sm text-stone-800 font-medium">{message}</p>
                            <p className="text-xs text-stone-500 mt-2">
                                Please check your inbox and click the link to continue.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                            noValidate
                        >
                            {status === 'error' && message && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-lg px-3 py-2.5">
                                    {message}
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="reset-email"
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
                                        id="reset-email"
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

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.98] disabled:opacity-60 transition-all mt-1"
                            >
                                {isSubmitting ? (
                                    <AppIcon icon={Loading03Icon} size={16} className="animate-spin" />
                                ) : null}
                                {isSubmitting ? 'Sending link…' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
