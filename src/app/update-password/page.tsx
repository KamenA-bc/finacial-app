'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    LockPasswordIcon,
    Loading03Icon,
    Key01Icon,
    CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

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
        'w-full px-3 py-2.5 pl-10 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors bg-white';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf9f7]">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 shadow-xs mb-4">
                        <AppIcon icon={Key01Icon} size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                        Set New Password
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Please type your new password below.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] border border-stone-200/70 p-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center py-4">
                            <IconSquircle size="lg" className="bg-emerald-50 text-emerald-600 border-emerald-200/70 mb-4">
                                <AppIcon icon={CheckmarkCircle02Icon} size={20} />
                            </IconSquircle>
                            <p className="text-sm text-stone-800 font-medium">{message}</p>
                            <p className="text-xs text-stone-500 mt-2">
                                Redirecting you to the dashboard…
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

                            {/* New Password */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="new-password"
                                    className="text-xs text-stone-600 font-medium"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <AppIcon
                                        icon={LockPasswordIcon}
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
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
                                    className="text-xs text-stone-600 font-medium"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <AppIcon
                                        icon={LockPasswordIcon}
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
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
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.98] disabled:opacity-60 transition-all mt-1"
                            >
                                {isSubmitting ? (
                                    <AppIcon icon={Loading03Icon} size={16} className="animate-spin" />
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
