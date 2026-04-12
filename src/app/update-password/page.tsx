'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, KeyRound, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const updatePasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage(): React.ReactElement {
    const { updatePassword } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const onSubmit = async (data: UpdatePasswordValues): Promise<void> => {
        setStatus('idle');
        setMessage(null);

        const { error } = await updatePassword(data.password);

        if (error) {
            setStatus('error');
            setMessage(error);
        } else {
            setStatus('success');
            setMessage('Your password has been successfully updated.');
            // Automatically redirect to the dashboard after 2 seconds
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    };

    const inputClass =
        'w-full px-3 py-2.5 pl-10 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-4">
                        <KeyRound size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Set New Password
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Please type your new password below.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center py-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                <CheckCircle className="text-emerald-500" size={24} />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Redirecting you to the dashboard...
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

                            {/* New Password */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="new-password"
                                    className="text-xs text-gray-500 font-medium"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                                    />
                                    <input
                                        id="new-password"
                                        type="password"
                                        placeholder="••••••••"
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
                                    htmlFor="confirm-password"
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
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
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
                                ) : null}
                                {isSubmitting ? 'Updating…' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
