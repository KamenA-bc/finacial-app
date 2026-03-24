'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, TrendingUp } from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';

const incomeSchema = z.object({
    amount: z
        .number({ error: 'Please enter a valid number' })
        .positive('Amount must be greater than 0'),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

/** Form to log money earned for the currently selected day. */
export const IncomeForm = (): React.ReactElement => {
    const addIncome = useFinancialStore((s) => s.addIncome);
    const selectedDate = useFinancialStore((s) => s.selectedDate);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeSchema),
    });

    const onSubmit = async (data: IncomeFormValues): Promise<void> => {
        await addIncome({ date: selectedDate, amount: data.amount });
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
            noValidate
        >
            <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-emerald-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Log Income
                </h3>
            </div>

            <div className="flex flex-col gap-1">
                <label
                    htmlFor="income-amount"
                    className="text-xs text-gray-500 font-medium"
                >
                    Amount earned
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        €
                    </span>
                    <input
                        id="income-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register('amount', { valueAsNumber: true })}
                        className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                    />
                </div>
                {errors.amount && (
                    <p className="text-xs text-rose-500 mt-0.5">
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 transition-all"
            >
                <PlusCircle size={16} />
                Add Income
            </button>
        </form>
    );
};
