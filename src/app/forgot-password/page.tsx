'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

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
    };

    const inputClass =
        'w-full px-3 py-2.5 pl-10 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Sign In
                </Link>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-4">
                        <KeyRound size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        We will send you an email with a link to reset it.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center py-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                <Mail className="text-emerald-500" size={24} />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{message}</p>
                            <p className="text-xs text-gray-400 mt-2">
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
                                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-md px-3 py-2.5">
                                    {message}
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="reset-email"
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
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 transition-all mt-1"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
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
