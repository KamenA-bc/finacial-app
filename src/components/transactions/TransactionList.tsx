'use client';

import React, { useState } from 'react';
import {
    ShoppingCart,
    Bus,
    Utensils,
    Film,
    MoreHorizontal,
    TrendingUp,
    Trash2,
    Pill,
    Fuel,
    Briefcase,
    ShoppingBag,
    Plane,
    Receipt,
    Sparkles,
    Gift,
    AlertTriangle,
    X,
} from 'lucide-react';
import { ExpenseCategory, ExpenseEntry, IncomeEntry } from '@/types';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useFinancialStore } from '@/store/transactionStore';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
    CATEGORY_BG_MAP,
} from '@/lib/constants';
import { getExpenseRowColors } from '@/lib/expenseRowColors';

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<ExpenseCategory, React.ReactElement> = {
    'Магазини (Храна/Вода)': <ShoppingCart size={14} />,
    'Eating out': <Utensils size={14} />,
    'Гориво': <Fuel size={14} />,
    'Градски транспорт': <Bus size={14} />,
    'Health/Аптека': <Pill size={14} />,
    'Beauty': <Sparkles size={14} />,
    'Shopping': <ShoppingBag size={14} />,
    'Entertainment': <Film size={14} />,
    'Пътуване': <Plane size={14} />,
    'Сметки/Разходи': <Receipt size={14} />,
    'Фирмени разходи': <Briefcase size={14} />,
    'Подаръци': <Gift size={14} />,
    'Други': <MoreHorizontal size={14} />,
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    'Магазини (Храна/Вода)': 'bg-emerald-50 text-emerald-600',
    'Eating out': 'bg-rose-50 text-rose-500',
    'Гориво': 'bg-orange-50 text-orange-500',
    'Градски транспорт': 'bg-blue-50 text-blue-500',
    'Health/Аптека': 'bg-pink-50 text-pink-500',
    'Beauty': 'bg-fuchsia-50 text-fuchsia-500',
    'Shopping': 'bg-teal-50 text-teal-500',
    'Entertainment': 'bg-purple-50 text-purple-500',
    'Пътуване': 'bg-sky-50 text-sky-500',
    'Сметки/Разходи': 'bg-amber-50 text-amber-600',
    'Фирмени разходи': 'bg-slate-50 text-slate-500',
    'Подаръци': 'bg-red-50 text-red-400',
    'Други': 'bg-gray-100 text-gray-500',
};

const formatAmount = (amount: number, date?: string): string =>
    `${getCurrencySymbol(date)}${amount.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

// ── Delete Confirmation Dialog ───────────────────────────────────────────────

interface DeleteDialogProps {
    description: string;
    amount: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteDialog = ({ description, amount, onConfirm, onCancel }: DeleteDialogProps): React.ReactElement => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel} />
        {/* Dialog */}
        <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-xs p-5 flex flex-col items-center gap-4">
            <button
                onClick={onCancel}
                className="absolute top-3 right-3 p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Затвори"
            >
                <X size={16} />
            </button>
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-50">
                <AlertTriangle size={20} className="text-rose-400" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 mb-1">Изтриване на транзакция</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Сигурни ли сте, че искате да изтриете{' '}
                    <span className="font-medium text-gray-600">&quot;{description}&quot;</span>{' '}
                    ({amount})?
                </p>
            </div>
            <div className="flex gap-2.5 w-full">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    Отказ
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-rose-400 hover:bg-rose-500 active:scale-[0.98] transition-all"
                >
                    Изтрий
                </button>
            </div>
        </div>
    </div>
);

// ── Row Components ────────────────────────────────────────────────────────────

interface ExpenseRowProps {
    expense: ExpenseEntry;
    onDelete: (id: string) => void;
}

const ExpenseRow = ({ expense, onDelete }: ExpenseRowProps): React.ReactElement => {
    const { amountColor, rowBg } = getExpenseRowColors(
        expense.isWorkExpense,
        expense.isWithKami,
        expense.isWithOthers,
    );

    return (
        <div className={`group flex items-center gap-3 py-2.5 px-2.5 -mx-1 rounded-xl border-b border-stone-100 last:border-0 hover:bg-stone-50/90 transition-all ${rowBg}`}>
            <div
                className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${CATEGORY_COLORS[expense.category]}`}
            >
                {CATEGORY_ICONS[expense.category]}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-800 font-medium truncate">
                    {expense.description}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-stone-500 whitespace-nowrap">{CATEGORY_BG_MAP[expense.category] ?? expense.category}</p>
                    {expense.isWorkExpense && (
                        <span className="whitespace-nowrap text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded-md leading-tight">
                            Работни
                        </span>
                    )}
                    {expense.isWithKami && (
                        <span className="whitespace-nowrap text-[10px] font-medium text-pink-700 bg-pink-50 border border-pink-200/80 px-1.5 py-0.2 rounded-md leading-tight">
                            Kami ❤️
                        </span>
                    )}
                    {expense.isWithOthers && (
                        <span className="whitespace-nowrap text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md leading-tight">
                            С Други
                        </span>
                    )}
                </div>
            </div>
            <span className={`text-sm font-semibold tabular-nums flex-shrink-0 ${amountColor}`}>
                -{formatAmount(expense.amount, expense.date)}
            </span>
            <button
                onClick={() => onDelete(expense.id)}
                aria-label={`Delete expense: ${expense.description}`}
                className="ml-1 flex-shrink-0 p-1.5 rounded-lg text-stone-300 opacity-60 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
};

interface IncomeRowProps {
    income: IncomeEntry;
    onDelete: (id: string) => void;
}

const IncomeRow = ({ income, onDelete }: IncomeRowProps): React.ReactElement => {
    const isWork = income.isWorkIncome;
    const amountColor = isWork ? 'text-blue-600' : 'text-emerald-600';
    const iconClass = isWork ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600';

    return (
        <div className="group flex items-center gap-3 py-2.5 px-2.5 -mx-1 rounded-xl border-b border-stone-100 last:border-0 hover:bg-stone-50/90 transition-all">
            <div className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${iconClass}`}>
                {isWork ? <Briefcase size={14} /> : <TrendingUp size={14} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-800 font-medium truncate">
                    {income.description || 'Приход'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-stone-500 whitespace-nowrap">Спечелени пари</p>
                    {isWork && (
                        <span className="whitespace-nowrap text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.2 rounded-md leading-tight">
                            Работен
                        </span>
                    )}
                </div>
            </div>
            <span className={`text-sm font-semibold tabular-nums flex-shrink-0 ${amountColor}`}>
                +{formatAmount(income.amount, income.date)}
            </span>
            <button
                onClick={() => onDelete(income.id)}
                aria-label={`Delete income of ${formatAmount(income.amount, income.date)}`}
                className="ml-1 flex-shrink-0 p-1.5 rounded-lg text-stone-300 opacity-60 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

type FilterMode = 'all' | 'income' | 'expenses';

interface PendingDelete {
    id: string;
    type: 'income' | 'expense';
    description: string;
    amount: string;
}

/** Lists both income and expense entries for the selected day with delete buttons. */
export const TransactionList = (): React.ReactElement => {
    const { dailyExpenseEntries, dailyIncomeEntries } = useFinancialData();
    const deleteIncome = useFinancialStore((s) => s.deleteIncome);
    const deleteExpense = useFinancialStore((s) => s.deleteExpense);
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

    const requestDeleteExpense = (id: string): void => {
        const entry = dailyExpenseEntries.find((e) => e.id === id);
        if (!entry) return;
        setPendingDelete({
            id,
            type: 'expense',
            description: entry.description,
            amount: formatAmount(entry.amount, entry.date),
        });
    };

    const requestDeleteIncome = (id: string): void => {
        const entry = dailyIncomeEntries.find((e) => e.id === id);
        if (!entry) return;
        setPendingDelete({
            id,
            type: 'income',
            description: entry.description || 'Приход',
            amount: formatAmount(entry.amount, entry.date),
        });
    };

    const confirmDelete = (): void => {
        if (!pendingDelete) return;
        if (pendingDelete.type === 'income') deleteIncome(pendingDelete.id);
        if (pendingDelete.type === 'expense') deleteExpense(pendingDelete.id);
        setPendingDelete(null);
    };

    const hasEntries =
        dailyIncomeEntries.length > 0 || dailyExpenseEntries.length > 0;

    if (!hasEntries) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-2">
                    <Receipt size={18} />
                </div>
                <p className="text-xs font-semibold text-stone-600">Няма транзакции за този ден</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Всички добавени приходи и разходи ще се появят тук</p>
            </div>
        );
    }

    const filteredIncome = filterMode === 'expenses' ? [] : dailyIncomeEntries;
    const filteredExpense = filterMode === 'income' ? [] : dailyExpenseEntries;

    const hasFilteredEntries = filteredIncome.length > 0 || filteredExpense.length > 0;

    return (
        <div className="flex flex-col">
            {/* Delete Confirmation Modal */}
            {pendingDelete && (
                <DeleteDialog
                    description={pendingDelete.description}
                    amount={pendingDelete.amount}
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}

            {/* Segmented Control */}
            <div className="flex p-1 bg-stone-100 rounded-xl mb-3">
                <button
                    onClick={() => setFilterMode('all')}
                    className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all cursor-pointer ${
                        filterMode === 'all'
                            ? 'bg-white text-stone-900 shadow-xs ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                    Всички
                </button>
                <button
                    onClick={() => setFilterMode('income')}
                    className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all cursor-pointer ${
                        filterMode === 'income'
                            ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                    Приходи
                </button>
                <button
                    onClick={() => setFilterMode('expenses')}
                    className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all cursor-pointer ${
                        filterMode === 'expenses'
                            ? 'bg-white text-rose-700 shadow-xs ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-800'
                    }`}
                >
                    Разходи
                </button>
            </div>

            {hasFilteredEntries ? (
                <div className="flex flex-col">
                    {[...filteredIncome].reverse().map((income) => (
                        <IncomeRow
                            key={income.id}
                            income={income}
                            onDelete={requestDeleteIncome}
                        />
                    ))}
                    {[...filteredExpense].reverse().map((expense) => (
                        <ExpenseRow
                            key={expense.id}
                            expense={expense}
                            onDelete={requestDeleteExpense}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-6 text-center text-xs text-stone-400">
                    Няма намерени {filterMode === 'income' ? 'приходи' : 'разходи'} за този ден.
                </div>
            )}
        </div>
    );
};
