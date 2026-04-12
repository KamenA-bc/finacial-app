'use client';

import React from 'react';
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
    CURRENCY_SYMBOL,
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

const formatAmount = (amount: number): string =>
    `${CURRENCY_SYMBOL}${amount.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

// ── Row Components ────────────────────────────────────────────────────────────

interface ExpenseRowProps {
    expense: ExpenseEntry;
    onDelete: (id: string) => void;
}

const ExpenseRow = ({
    expense,
    onDelete,
}: ExpenseRowProps): React.ReactElement => {
    const amountColor = expense.isWorkExpense
        ? 'text-amber-500'
        : 'text-rose-500';

    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group">
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
                </div>
            </div>
            <span className={`text-sm font-semibold tabular-nums flex-shrink-0 ${amountColor}`}>
                -{formatAmount(expense.amount)}
            </span>
            <button
                onClick={() => onDelete(expense.id)}
                aria-label={`Delete expense: ${expense.description}`}
                className="ml-1 flex-shrink-0 p-1 rounded text-gray-300 hover:text-rose-400 hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
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
    const iconWrapperClass = isWork 
        ? 'bg-blue-50 text-blue-500' 
        : 'bg-emerald-50 text-emerald-500';

    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 group">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${iconWrapperClass}`}>
                {isWork ? <Briefcase size={14} /> : <TrendingUp size={14} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate">
                    {income.description || 'Приход'}
                </p>
                <div className="flex items-center gap-1.5">
                    <p className="text-xs text-gray-400">Спечелени пари</p>
                    {isWork && (
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full leading-none">
                            Работен
                        </span>
                    )}
                </div>
            </div>
            <span className={`text-sm font-semibold tabular-nums flex-shrink-0 ${amountColor}`}>
                +{formatAmount(income.amount)}
            </span>
            <button
                onClick={() => onDelete(income.id)}
                aria-label={`Delete income of ${formatAmount(income.amount)}`}
                className="ml-1 flex-shrink-0 p-1 rounded text-gray-300 hover:text-rose-400 hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

type FilterMode = 'all' | 'personal' | 'work';

/** Lists both income and expense entries for the selected day with delete buttons. */
export const TransactionList = (): React.ReactElement => {
    const { dailyExpenseEntries, dailyIncomeEntries } = useFinancialData();
    const deleteIncome = useFinancialStore((s) => s.deleteIncome);
    const deleteExpense = useFinancialStore((s) => s.deleteExpense);
    const [filterMode, setFilterMode] = React.useState<FilterMode>('all');

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
        return !entry.isWorkIncome; // personal
    });

    const filteredExpense = dailyExpenseEntries.filter(entry => {
        if (filterMode === 'all') return true;
        if (filterMode === 'work') return entry.isWorkExpense;
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
            </div>

            {hasFilteredEntries ? (
                <>
                    {[...filteredIncome].reverse().map((income) => (
                        <IncomeRow
                            key={income.id}
                            income={income}
                            onDelete={deleteIncome}
                        />
                    ))}
                    {[...filteredExpense].reverse().map((expense) => (
                        <ExpenseRow
                            key={expense.id}
                            expense={expense}
                            onDelete={deleteExpense}
                        />
                    ))}
                </>
            ) : (
                <p className="text-xs text-gray-300 text-center py-4">
                    Няма {filterMode === 'work' ? 'работни' : 'лични'} транзакции.
                </p>
            )}
        </div>
    );
};
