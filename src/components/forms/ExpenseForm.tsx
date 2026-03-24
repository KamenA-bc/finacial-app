'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Receipt } from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { ExpenseCategory } from '@/types';

const expenseSchema = z.object({
    description: z
        .string()
        .min(1, 'Description is required')
        .max(80, 'Description too long'),
    amount: z
        .number({ error: 'Please enter a valid number' })
        .positive('Amount must be greater than 0'),
    category: z.enum(
        EXPENSE_CATEGORIES as [ExpenseCategory, ...ExpenseCategory[]]
    ),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

/** Form to log an expense entry for the currently selected day. */
export const ExpenseForm = (): React.ReactElement => {
    const addExpense = useFinancialStore((s) => s.addExpense);
    const selectedDate = useFinancialStore((s) => s.selectedDate);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: { category: EXPENSE_CATEGORIES[0] },
    });

    const onSubmit = async (data: ExpenseFormValues): Promise<void> => {
        await addExpense({
            date: selectedDate,
            amount: data.amount,
            description: data.description,
            category: data.category,
        });
        reset({ category: EXPENSE_CATEGORIES[0] });
    };

    const inputClass =
        'w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors bg-white';

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
            noValidate
        >
            <div className="flex items-center gap-2 mb-1">
                <Receipt size={16} className="text-rose-400" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Log Expense
                </h3>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="expense-description"
                    className="text-xs text-gray-500 font-medium"
                >
                    Description
                </label>
                <input
                    id="expense-description"
                    type="text"
                    placeholder="e.g. Morning coffee"
                    {...register('description')}
                    className={inputClass}
                />
                {errors.description && (
                    <p className="text-xs text-rose-500">{errors.description.message}</p>
                )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="expense-amount"
                    className="text-xs text-gray-500 font-medium"
                >
                    Amount
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        €
                    </span>
                    <input
                        id="expense-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register('amount', { valueAsNumber: true })}
                        className={`${inputClass} pl-7`}
                    />
                </div>
                {errors.amount && (
                    <p className="text-xs text-rose-500">{errors.amount.message}</p>
                )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="expense-category"
                    className="text-xs text-gray-500 font-medium"
                >
                    Category
                </label>
                <select
                    id="expense-category"
                    {...register('category')}
                    className={inputClass}
                >
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-xs text-rose-500">{errors.category.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-rose-400 text-white text-sm font-medium hover:bg-rose-500 active:scale-[0.98] disabled:opacity-60 transition-all"
            >
                <PlusCircle size={16} />
                Add Expense
            </button>
        </form>
    );
};
