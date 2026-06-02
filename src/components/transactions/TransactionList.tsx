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

// ── Delete Confirmation ───────────────────────────────────────────────────────

interface DeleteConfirmProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirm = ({ onConfirm, onCancel }: DeleteConfirmProps): React.ReactElement => (
    <div className="flex items-center gap-1.5 ml-1 flex-shrink-0 animate-in fade-in">
        <span className="text-[10px] text-gray-400 font-medium">Изтрий?</span>
        <button
            onClick={onConfirm}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white bg-rose-400 hover:bg-rose-500 transition-colors"
        >
            Да
        </button>
        <button
            onClick={onCancel}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
            Не
        </button>
    </div>
);

// ── Row Components ────────────────────────────────────────────────────────────

interface ExpenseRowProps {
    expense: ExpenseEntry;
    onRequestDelete: (id: string) => void;
    isPendingDelete: boolean;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
}

const ExpenseRow = ({
    expense,
    onRequestDelete,
    isPendingDelete,
    onConfirmDelete,
    onCancelDelete,
}: ExpenseRowProps): React.ReactElement => {
    const amountColor = expense.isWithKami
        ? 'text-pink-500'
        : expense.isWorkExpense
            ? 'text-amber-500'
            : 'text-rose-500';

    const rowBg = expense.isWithKami
        ? 'bg-pink-50/60'
        : expense.isWorkExpense
            ? 'bg-amber-50/60'
            : '';

    return (
        <div className={`flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-lg border-b border-gray-50 last:border-0 ${rowBg}`}>
            <div
                className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${CATEGORY_COLORS[expense.category]}`}
            >
                {CATEGORY_ICONS[expense.category]}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate">
                    {expense.description}
                </p>
                <div className="flex items-center gap-1.5">
                    <p className="text-xs text-gray-400">{CATEGORY_BG_MAP[expense.category] ?? expense.category}</p>
                    {expense.isWorkExpense && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full leading-none">
                            Работни
                        </span>
                    )}
                    {expense.isWithKami && (
                        <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 border border-pink-200 px-1.5 py-0.5 rounded-full leading-none">
                            С Ками
                        </span>
                    )}
                </div>
            </div>
            <span className={`text-sm font-semibold tabular-nums flex-shrink-0 ${amountColor}`}>
                -{formatAmount(expense.amount, expense.date)}
            </span>
            {isPendingDelete ? (
                <DeleteConfirm onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
            ) : (
                <button
                    onClick={() => onRequestDelete(expense.id)}
                    aria-label={`Delete expense: ${expense.description}`}
                    className="ml-1 flex-shrink-0 p-1 rounded text-gray-300 hover:text-rose-400 hover:bg-rose-50 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            )}
        </div>
    );
};

interface IncomeRowProps {
    income: IncomeEntry;
    onRequestDelete: (id: string) => void;
    isPendingDelete: boolean;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
}

const IncomeRow = ({ income, onRequestDelete, isPendingDelete, onConfirmDelete, onCancelDelete }: IncomeRowProps): React.ReactElement => (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 bg-emerald-50 text-emerald-500">
            <TrendingUp size={14} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 font-medium truncate">
                {income.description || 'Приход'}
            </p>
            <p className="text-xs text-gray-400">Спечелени пари</p>
        </div>
        <span className="text-sm font-semibold tabular-nums flex-shrink-0 text-emerald-600">
            +{formatAmount(income.amount, income.date)}
        </span>
        {isPendingDelete ? (
            <DeleteConfirm onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
        ) : (
            <button
                onClick={() => onRequestDelete(income.id)}
                aria-label={`Delete income of ${formatAmount(income.amount, income.date)}`}
                className="ml-1 flex-shrink-0 p-1 rounded text-gray-300 hover:text-rose-400 hover:bg-rose-50 transition-colors"
            >
                <Trash2 size={13} />
            </button>
        )}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

type FilterMode = 'all' | 'personal' | 'work' | 'kami';

/** Lists both income and expense entries for the selected day with delete buttons. */
export const TransactionList = (): React.ReactElement => {
    const { dailyExpenseEntries, dailyIncomeEntries } = useFinancialData();
    const deleteIncome = useFinancialStore((s) => s.deleteIncome);
    const deleteExpense = useFinancialStore((s) => s.deleteExpense);
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [pendingDeleteType, setPendingDeleteType] = useState<'income' | 'expense' | null>(null);

    const requestDelete = (id: string, type: 'income' | 'expense'): void => {
        setPendingDeleteId(id);
        setPendingDeleteType(type);
    };

    const confirmDelete = (): void => {
        if (pendingDeleteId && pendingDeleteType === 'income') deleteIncome(pendingDeleteId);
        if (pendingDeleteId && pendingDeleteType === 'expense') deleteExpense(pendingDeleteId);
        setPendingDeleteId(null);
        setPendingDeleteType(null);
    };

    const cancelDelete = (): void => {
        setPendingDeleteId(null);
        setPendingDeleteType(null);
    };

    const hasEntries =
        dailyIncomeEntries.length > 0 || dailyExpenseEntries.length > 0;

    if (!hasEntries) {
        return (
            <p className="text-sm text-gray-300 text-center py-6">
                Няма транзакции за този ден
            </p>
        );
    }

    const filteredIncome = dailyIncomeEntries.filter(entry => {
        if (filterMode === 'all') return true;
        if (filterMode === 'work') return entry.isWorkIncome;
        if (filterMode === 'kami') return entry.isWithKami;
        return !entry.isWorkIncome; // personal
    });

    const filteredExpense = dailyExpenseEntries.filter(entry => {
        if (filterMode === 'all') return true;
        if (filterMode === 'work') return entry.isWorkExpense;
        if (filterMode === 'kami') return entry.isWithKami;
        return !entry.isWorkExpense; // personal
    });

    const hasFilteredEntries = filteredIncome.length > 0 || filteredExpense.length > 0;

    return (
        <div className="flex flex-col">
            {/* Segmented Control */}
            <div className="flex p-0.5 bg-gray-100/80 rounded-md mb-3">
                <button
                    onClick={() => setFilterMode('all')}
                    className={`flex-1 text-[11px] font-medium py-1 rounded transition-all ${filterMode === 'all' ? 'bg-white text-gray-800 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                    Всички
                </button>
                <button
                    onClick={() => setFilterMode('personal')}
                    className={`flex-1 text-[11px] font-medium py-1 rounded transition-all ${filterMode === 'personal' ? 'bg-white text-gray-800 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                    Лични
                </button>
                <button
                    onClick={() => setFilterMode('work')}
                    className={`flex-1 text-[11px] font-medium py-1 rounded transition-all ${filterMode === 'work' ? 'bg-white text-gray-800 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                    Работни
                </button>
                <button
                    onClick={() => setFilterMode('kami')}
                    className={`flex-1 text-[11px] font-medium py-1 rounded transition-all ${filterMode === 'kami' ? 'bg-white text-gray-800 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                    С Ками
                </button>
            </div>

            {hasFilteredEntries ? (
                <>
                    {[...filteredIncome].reverse().map((income) => (
                        <IncomeRow
                            key={income.id}
                            income={income}
                            onRequestDelete={(id) => requestDelete(id, 'income')}
                            isPendingDelete={pendingDeleteId === income.id}
                            onConfirmDelete={confirmDelete}
                            onCancelDelete={cancelDelete}
                        />
                    ))}
                    {[...filteredExpense].reverse().map((expense) => (
                        <ExpenseRow
                            key={expense.id}
                            expense={expense}
                            onRequestDelete={(id) => requestDelete(id, 'expense')}
                            isPendingDelete={pendingDeleteId === expense.id}
                            onConfirmDelete={confirmDelete}
                            onCancelDelete={cancelDelete}
                        />
                    ))}
                </>
            ) : (
                <p className="text-xs text-gray-300 text-center py-4">
                    Няма {filterMode === 'work' ? 'работни' : filterMode === 'kami' ? '"С Ками"' : 'лични'} транзакции.
                </p>
            )}
        </div>
    );
};
