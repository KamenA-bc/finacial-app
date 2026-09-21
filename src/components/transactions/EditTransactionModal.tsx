'use client';

import React, { useState, useEffect } from 'react';
import {
    Cancel01Icon,
    Briefcase01Icon,
    FavouriteIcon,
    User02Icon,
    CheckmarkBadge01Icon,
    Loading03Icon,
    Invoice01Icon,
    TrendingUpIcon,
    Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { ExpenseCategory, ExpenseEntry, IncomeEntry } from '@/types';
import { useFinancialStore } from '@/store/transactionStore';
import { useToastStore } from '@/store/toastStore';
import {
    EXPENSE_CATEGORIES,
    CATEGORY_BG_MAP,
    getCurrencySymbol,
} from '@/lib/constants';

export interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction:
        | { type: 'expense'; entry: ExpenseEntry }
        | { type: 'income'; entry: IncomeEntry }
        | null;
}

export const EditTransactionModal = ({
    isOpen,
    onClose,
    transaction,
}: EditTransactionModalProps): React.ReactElement | null => {
    const updateExpense = useFinancialStore((s) => s.updateExpense);
    const updateIncome = useFinancialStore((s) => s.updateIncome);
    const showToast = useToastStore((s) => s.showToast);

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0]);
    const [isWorkExpense, setIsWorkExpense] = useState(false);
    const [isWithKami, setIsWithKami] = useState(false);
    const [isWithOthers, setIsWithOthers] = useState(false);
    const [isWorkIncome, setIsWorkIncome] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const isExpense = transaction?.type === 'expense';

    useEffect(() => {
        if (!isOpen || !transaction) return;

        const currentEntry = transaction.entry;
        setAmount(String(currentEntry.amount));
        setDate(currentEntry.date);
        setDescription(currentEntry.description || '');
        setValidationError(null);

        if (transaction.type === 'expense') {
            const exp = transaction.entry as ExpenseEntry;
            setCategory(exp.category);
            setIsWorkExpense(Boolean(exp.isWorkExpense));
            setIsWithKami(Boolean(exp.isWithKami));
            setIsWithOthers(Boolean(exp.isWithOthers));
        } else {
            const inc = transaction.entry as IncomeEntry;
            setIsWorkIncome(Boolean(inc.isWorkIncome));
            setIsWithKami(Boolean(inc.isWithKami));
        }
    }, [isOpen, transaction]);

    // Handle Escape key to close modal
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !transaction) return null;

    const currency = getCurrencySymbol(date || transaction.entry.date);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const numAmount = parseFloat(amount.replace(',', '.'));

        if (isNaN(numAmount) || numAmount <= 0) {
            setValidationError('Моля, въведете валидна сума по-голяма от 0');
            return;
        }

        if (isExpense && !description.trim()) {
            setValidationError('Описанието е задължително за разход');
            return;
        }

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            setValidationError('Моля, изберете валидна дата');
            return;
        }

        setValidationError(null);
        setIsSubmitting(true);

        try {
            if (isExpense) {
                await updateExpense(transaction.entry.id, {
                    amount: Math.round(numAmount * 100) / 100,
                    date,
                    description: description.trim(),
                    category,
                    isWorkExpense,
                    isWithKami,
                    isWithOthers,
                });
            } else {
                await updateIncome(transaction.entry.id, {
                    amount: Math.round(numAmount * 100) / 100,
                    date,
                    description: description.trim(),
                    isWorkIncome,
                    isWithKami,
                });
            }

            const storeError = useFinancialStore.getState().error;
            if (storeError) {
                showToast(storeError, 'error');
                return;
            }

            showToast('Промените са запазени успешно');
            onClose();
        } catch {
            showToast('Възникна грешка при запазване на транзакцията', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClass =
        'w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-transaction-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-stone-200/80 w-full max-w-md p-5 sm:p-6 flex flex-col gap-4 z-10 animate-toast-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                        <IconSquircle
                            className={
                                isExpense
                                    ? 'bg-rose-50 text-rose-600 border-rose-200/70'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200/70'
                            }
                        >
                            {isExpense ? (
                                <AppIcon icon={Invoice01Icon} size={15} />
                            ) : (
                                <AppIcon icon={TrendingUpIcon} size={15} />
                            )}
                        </IconSquircle>
                        <div>
                            <h2
                                id="edit-transaction-title"
                                className="text-sm font-semibold text-stone-900 tracking-tight"
                            >
                                {isExpense ? 'Редактиране на разход' : 'Редактиране на приход'}
                            </h2>
                            <p className="text-[11px] text-stone-400">
                                Променете стойностите и запазете
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 active:scale-[0.97] transition-all cursor-pointer"
                        aria-label="Затвори"
                    >
                        <AppIcon icon={Cancel01Icon} size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
                    {/* Amount & Date side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="edit-amount"
                                className="text-xs font-medium text-stone-600"
                            >
                                Сума
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-stone-400 text-xs font-medium select-none pointer-events-none">
                                    {currency}
                                </span>
                                <input
                                    id="edit-amount"
                                    type="text"
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className={`${inputBaseClass} ${currency.length > 1 ? 'pl-9' : 'pl-7'} font-semibold tabular-nums focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="edit-date"
                                className="text-xs font-medium text-stone-600 flex items-center gap-1"
                            >
                                <AppIcon icon={Calendar01Icon} size={12} className="text-stone-400" />
                                <span>Дата</span>
                            </label>
                            <input
                                id="edit-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`${inputBaseClass} text-xs font-medium tabular-nums focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50`}
                            />
                        </div>
                    </div>

                    {/* Category (Expense only) */}
                    {isExpense && (
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="edit-category"
                                className="text-xs font-medium text-stone-600"
                            >
                                Категория
                            </label>
                            <select
                                id="edit-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                                className={`${inputBaseClass} text-xs font-medium focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 cursor-pointer`}
                            >
                                {EXPENSE_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {CATEGORY_BG_MAP[cat] ?? cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="edit-description"
                            className="text-xs font-medium text-stone-600"
                        >
                            Описание
                        </label>
                        <input
                            id="edit-description"
                            type="text"
                            maxLength={isExpense ? 80 : 100}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isExpense ? 'напр. Хранителни стоки' : 'напр. Заплата / Бонус'}
                            className={`${inputBaseClass} focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50`}
                        />
                    </div>

                    {/* Tag Chips */}
                    <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-[11px] font-medium text-stone-500">
                            Маркери и споделяне
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {isExpense ? (
                                <>
                                    <button
                                        type="button"
                                        aria-pressed={isWorkExpense}
                                        onClick={() => setIsWorkExpense(!isWorkExpense)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
                                            isWorkExpense
                                                ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/30'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        <AppIcon icon={Briefcase01Icon} size={13} className={isWorkExpense ? 'text-amber-700' : 'text-stone-400'} />
                                        <span>Работни</span>
                                    </button>

                                    <button
                                        type="button"
                                        aria-pressed={isWithKami}
                                        onClick={() => setIsWithKami(!isWithKami)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
                                            isWithKami
                                                ? 'bg-pink-50 text-pink-700 border-pink-300 ring-1 ring-pink-400/30'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        <AppIcon icon={FavouriteIcon} size={13} className={isWithKami ? 'text-pink-600' : 'text-stone-400'} />
                                        <span>Kami ❤️</span>
                                    </button>

                                    <button
                                        type="button"
                                        aria-pressed={isWithOthers}
                                        onClick={() => setIsWithOthers(!isWithOthers)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
                                            isWithOthers
                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/30'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        <AppIcon icon={User02Icon} size={13} className={isWithOthers ? 'text-emerald-700' : 'text-stone-400'} />
                                        <span>С Други</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        aria-pressed={isWorkIncome}
                                        onClick={() => setIsWorkIncome(!isWorkIncome)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
                                            isWorkIncome
                                                ? 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400/30'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        <AppIcon icon={Briefcase01Icon} size={13} className={isWorkIncome ? 'text-blue-600' : 'text-stone-400'} />
                                        <span>Работен</span>
                                    </button>

                                    <button
                                        type="button"
                                        aria-pressed={isWithKami}
                                        onClick={() => setIsWithKami(!isWithKami)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer active:scale-[0.97] ${
                                            isWithKami
                                                ? 'bg-pink-50 text-pink-700 border-pink-300 ring-1 ring-pink-400/30'
                                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                                        }`}
                                    >
                                        <AppIcon icon={FavouriteIcon} size={13} className={isWithKami ? 'text-pink-600' : 'text-stone-400'} />
                                        <span>Kami ❤️</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Validation Error Banner */}
                    {validationError && (
                        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium leading-relaxed">
                            {validationError}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 active:scale-[0.97] transition-all cursor-pointer"
                        >
                            Отказ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <AppIcon icon={Loading03Icon} size={13} className="animate-spin" />
                                    <span>Запазване…</span>
                                </>
                            ) : (
                                <>
                                    <AppIcon icon={CheckmarkBadge01Icon} size={13} />
                                    <span>Запази промените</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
