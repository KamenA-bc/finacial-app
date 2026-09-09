'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    PlusCircle,
    Receipt,
    TrendingUp,
    Briefcase,
    Heart,
    UsersRound,
    AlertCircle,
} from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import { useToastStore } from '@/store/toastStore';
import {
    EXPENSE_CATEGORIES,
    CATEGORY_BG_MAP,
    getCurrencySymbol,
} from '@/lib/constants';
import { ExpenseCategory } from '@/types';

// ── Validation Schemas ────────────────────────────────────────────────────────

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
    isWithKami: z.boolean(),
    isWithOthers: z.boolean(),
});

const incomeSchema = z.object({
    amount: z
        .number({ error: 'Моля, въведете валидно число' })
        .positive('Сумата трябва да е по-голяма от 0'),
    description: z.string().max(100, 'Описанието е твърде дълго'),
    isWorkIncome: z.boolean(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;
type IncomeFormValues = z.infer<typeof incomeSchema>;

type TabType = 'expense' | 'income';

/**
 * Unified, space-efficient Quick Transaction card.
 * Allows users to toggle seamlessly between logging an Expense or Income,
 * with modern inline toggle chips for flags (Работни, Kami, С Други).
 */
export const QuickTransactionForm = (): React.ReactElement => {
    const [activeTab, setActiveTab] = useState<TabType>('income');

    const addExpense = useFinancialStore((s) => s.addExpense);
    const addIncome = useFinancialStore((s) => s.addIncome);
    const selectedDate = useFinancialStore((s) => s.selectedDate);
    const storeError = useFinancialStore((s) => s.error);
    const showToast = useToastStore((s) => s.showToast);

    // ── Expense Form Setup ────────────────────────────────────────────────────
    const {
        register: registerExpense,
        handleSubmit: handleSubmitExpense,
        reset: resetExpense,
        setValue: setExpenseValue,
        watch: watchExpense,
        formState: { errors: expenseErrors, isSubmitting: isExpenseSubmitting },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            category: EXPENSE_CATEGORIES[0],
            description: '',
            isWorkExpense: false,
            isWithKami: false,
            isWithOthers: false,
        },
    });

    const isWorkExpense = watchExpense('isWorkExpense');
    const isWithKami = watchExpense('isWithKami');
    const isWithOthers = watchExpense('isWithOthers');

    const onExpenseSubmit = async (data: ExpenseFormValues): Promise<void> => {
        await addExpense({
            date: selectedDate,
            amount: data.amount,
            description: data.description,
            category: data.category,
            isWorkExpense: data.isWorkExpense,
            isWithKami: data.isWithKami,
            isWithOthers: data.isWithOthers,
        });

        const currentError = useFinancialStore.getState().error;
        if (!currentError) {
            showToast('Разходът е добавен успешно');
            resetExpense({
                category: EXPENSE_CATEGORIES[0],
                description: '',
                isWorkExpense: false,
                isWithKami: false,
                isWithOthers: false,
            });
        }
    };

    // ── Income Form Setup ─────────────────────────────────────────────────────
    const {
        register: registerIncome,
        handleSubmit: handleSubmitIncome,
        reset: resetIncome,
        setValue: setIncomeValue,
        watch: watchIncome,
        formState: { errors: incomeErrors, isSubmitting: isIncomeSubmitting },
    } = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            description: '',
            isWorkIncome: false,
        },
    });

    const isWorkIncome = watchIncome('isWorkIncome');

    const onIncomeSubmit = async (data: IncomeFormValues): Promise<void> => {
        await addIncome({
            date: selectedDate,
            amount: data.amount,
            description: data.description || '',
            isWorkIncome: data.isWorkIncome,
            isWithKami: false,
        });

        const currentError = useFinancialStore.getState().error;
        if (!currentError) {
            showToast('Приходът е добавен успешно');
            resetIncome({
                description: '',
                isWorkIncome: false,
            });
        }
    };

    const currency = getCurrencySymbol(selectedDate);

    const inputBaseClass =
        'w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all';

    return (
        <div className="flex flex-col">
            {/* Tab Switcher: Income first, Expense second */}
            <div className="flex p-1 bg-stone-100 rounded-xl mb-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('income')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'income'
                            ? 'bg-white text-emerald-600 shadow-xs ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <TrendingUp size={14} />
                    <span>Приход</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('expense')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        activeTab === 'expense'
                            ? 'bg-white text-rose-600 shadow-xs ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Receipt size={14} />
                    <span>Разход</span>
                </button>
            </div>

            {/* ── EXPENSE FORM ────────────────────────────────────────────── */}
            {activeTab === 'expense' && (
                <form
                    onSubmit={handleSubmitExpense(onExpenseSubmit)}
                    className="flex flex-col gap-3"
                    noValidate
                >
                    {/* Amount & Category side-by-side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="quick-expense-amount"
                                className="text-xs font-medium text-stone-600"
                            >
                                Сума
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium select-none">
                                    {currency}
                                </span>
                                <input
                                    id="quick-expense-amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...registerExpense('amount', { valueAsNumber: true })}
                                    className={`${inputBaseClass} ${currency.length > 1 ? 'pl-9' : 'pl-7'} focus:border-rose-400 focus:ring-2 focus:ring-rose-100 font-semibold tabular-nums`}
                                />
                            </div>
                            {expenseErrors.amount && (
                                <p className="text-[11px] text-rose-500 font-medium">
                                    {expenseErrors.amount.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="quick-expense-category"
                                className="text-xs font-medium text-stone-600"
                            >
                                Категория
                            </label>
                            <select
                                id="quick-expense-category"
                                {...registerExpense('category')}
                                className={`${inputBaseClass} focus:border-rose-400 focus:ring-2 focus:ring-rose-100 cursor-pointer`}
                            >
                                {EXPENSE_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {CATEGORY_BG_MAP[cat]}
                                    </option>
                                ))}
                            </select>
                            {expenseErrors.category && (
                                <p className="text-[11px] text-rose-500 font-medium">
                                    {expenseErrors.category.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="quick-expense-desc"
                            className="text-xs font-medium text-stone-600"
                        >
                            Описание
                        </label>
                        <input
                            id="quick-expense-desc"
                            type="text"
                            placeholder="напр. пазаруване в супермаркет..."
                            {...registerExpense('description')}
                            className={`${inputBaseClass} focus:border-rose-400 focus:ring-2 focus:ring-rose-100`}
                        />
                        {expenseErrors.description && (
                            <p className="text-[11px] text-rose-500 font-medium">
                                {expenseErrors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Modern Inline Chips for Flags */}
                    <div className="flex flex-col gap-1.5 pt-0.5">
                        <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                            Маркери (по избор)
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {/* Work tag chip */}
                            <button
                                type="button"
                                onClick={() => setExpenseValue('isWorkExpense', !isWorkExpense)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
                                    isWorkExpense
                                        ? 'bg-amber-500/10 border-amber-400/40 text-amber-800 shadow-xs'
                                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                                aria-pressed={isWorkExpense}
                            >
                                <Briefcase size={12} className={isWorkExpense ? 'text-amber-600' : 'text-stone-400'} />
                                <span>Работни</span>
                            </button>

                            {/* Kami tag chip */}
                            <button
                                type="button"
                                onClick={() => setExpenseValue('isWithKami', !isWithKami)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
                                    isWithKami
                                        ? 'bg-pink-500/10 border-pink-400/40 text-pink-800 shadow-xs'
                                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                                aria-pressed={isWithKami}
                            >
                                <Heart size={12} className={isWithKami ? 'text-pink-600 fill-pink-500' : 'text-stone-400'} />
                                <span>Kami</span>
                            </button>

                            {/* Others tag chip */}
                            <button
                                type="button"
                                onClick={() => setExpenseValue('isWithOthers', !isWithOthers)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
                                    isWithOthers
                                        ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-800 shadow-xs'
                                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                                aria-pressed={isWithOthers}
                            >
                                <UsersRound size={12} className={isWithOthers ? 'text-emerald-600' : 'text-stone-400'} />
                                <span>С Други</span>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isExpenseSubmitting}
                        className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 active:scale-[0.99] disabled:opacity-60 shadow-xs transition-all cursor-pointer"
                    >
                        <PlusCircle size={15} />
                        <span>Добави разход</span>
                    </button>
                </form>
            )}

            {/* ── INCOME FORM ─────────────────────────────────────────────── */}
            {activeTab === 'income' && (
                <form
                    onSubmit={handleSubmitIncome(onIncomeSubmit)}
                    className="flex flex-col gap-3"
                    noValidate
                >
                    {/* Amount */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="quick-income-amount"
                            className="text-xs font-medium text-stone-600"
                        >
                            Спечелена сума
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-medium select-none">
                                {currency}
                            </span>
                            <input
                                id="quick-income-amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...registerIncome('amount', { valueAsNumber: true })}
                                className={`${inputBaseClass} ${currency.length > 1 ? 'pl-9' : 'pl-7'} focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 font-semibold tabular-nums`}
                            />
                        </div>
                        {incomeErrors.amount && (
                            <p className="text-[11px] text-rose-500 font-medium">
                                {incomeErrors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="quick-income-desc"
                            className="text-xs font-medium text-stone-600"
                        >
                            Описание <span className="text-stone-400 font-normal">(по избор)</span>
                        </label>
                        <input
                            id="quick-income-desc"
                            type="text"
                            placeholder="напр. заплата, фрийланс, продажба..."
                            {...registerIncome('description')}
                            className={`${inputBaseClass} focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`}
                        />
                        {incomeErrors.description && (
                            <p className="text-[11px] text-rose-500 font-medium">
                                {incomeErrors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Tag Chip for Work Income */}
                    <div className="flex flex-col gap-1.5 pt-0.5">
                        <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                            Маркери
                        </span>
                        <div>
                            <button
                                type="button"
                                onClick={() => setIncomeValue('isWorkIncome', !isWorkIncome)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
                                    isWorkIncome
                                        ? 'bg-blue-500/10 border-blue-400/40 text-blue-800 shadow-xs'
                                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                                aria-pressed={isWorkIncome}
                            >
                                <Briefcase size={12} className={isWorkIncome ? 'text-blue-600' : 'text-stone-400'} />
                                <span>Работен приход</span>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isIncomeSubmitting}
                        className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 shadow-xs transition-all cursor-pointer"
                    >
                        <PlusCircle size={15} />
                        <span>Добави приход</span>
                    </button>
                </form>
            )}

            {storeError && (
                <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                    <AlertCircle size={14} className="flex-shrink-0 text-rose-500" />
                    <span>
                        Грешка: {storeError.includes('check constraint') ? 'Невалидна категория в базата данни' : storeError}
                    </span>
                </div>
            )}
        </div>
    );
};
