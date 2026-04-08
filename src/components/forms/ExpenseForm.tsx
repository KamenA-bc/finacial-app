'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Receipt, Briefcase } from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import { EXPENSE_CATEGORIES, CATEGORY_BG_MAP } from '@/lib/constants';
import { ExpenseCategory } from '@/types';

const expenseSchema = z.object({
    description: z
        .string()
        .min(1, 'Описанието е задължително')
        .max(80, 'Описанието е твърде дълго'),
    amount: z
        .number({ error: 'Моля, въведете валидно число' })
        .positive('Сумата трябва да е по-голяма от 0'),
    category: z.enum(
        EXPENSE_CATEGORIES as [ExpenseCategory, ...ExpenseCategory[]]
    ),
    isWorkExpense: z.boolean(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

/** Form to log an expense entry for the currently selected day. */
export const ExpenseForm = (): React.ReactElement => {
    const addExpense = useFinancialStore((s) => s.addExpense);
    const selectedDate = useFinancialStore((s) => s.selectedDate);
    const storeError = useFinancialStore((s) => s.error);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: { category: EXPENSE_CATEGORIES[0], isWorkExpense: false },
    });

    const isWorkExpense = watch('isWorkExpense');

    const onSubmit = async (data: ExpenseFormValues): Promise<void> => {
        await addExpense({
            date: selectedDate,
            amount: data.amount,
            description: data.description,
            category: data.category,
            isWorkExpense: data.isWorkExpense,
        });
        reset({ category: EXPENSE_CATEGORIES[0], isWorkExpense: false });
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
                    Добави разход
                </h3>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="expense-description"
                    className="text-xs text-gray-500 font-medium"
                >
                    Описание
                </label>
                <input
                    id="expense-description"
                    type="text"
                    placeholder="напр. сутрешно кафе"
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
                    Сума
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
                    Категория
                </label>
                <select
                    id="expense-category"
                    {...register('category')}
                    className={inputClass}
                >
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {CATEGORY_BG_MAP[cat]}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-xs text-rose-500">{errors.category.message}</p>
                )}
            </div>

            {/* Work Expense Checkbox */}
            <label
                htmlFor="expense-work"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border cursor-pointer transition-all ${
                    isWorkExpense
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
                <input
                    id="expense-work"
                    type="checkbox"
                    {...register('isWorkExpense')}
                    className="sr-only peer"
                />
                <div
                    className={`flex items-center justify-center w-4 h-4 rounded border-2 transition-all flex-shrink-0 ${
                        isWorkExpense
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-gray-300 bg-white'
                    }`}
                >
                    {isWorkExpense && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
                <Briefcase
                    size={14}
                    className={`flex-shrink-0 transition-colors ${
                        isWorkExpense ? 'text-amber-600' : 'text-gray-400'
                    }`}
                />
                <span
                    className={`text-sm font-medium transition-colors ${
                        isWorkExpense ? 'text-amber-700' : 'text-gray-600'
                    }`}
                >
                    Работни разходи
                </span>
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-rose-400 text-white text-sm font-medium hover:bg-rose-500 active:scale-[0.98] disabled:opacity-60 transition-all"
            >
                <PlusCircle size={16} />
                Добави разход
            </button>

            {storeError && (
                <p className="text-xs text-center text-rose-500 font-medium">
                    Грешка: {storeError.includes('check constraint') ? 'Невалидна категория в базата данни (вижте инструкциите)' : storeError}
                </p>
            )}
        </form>
    );
};
