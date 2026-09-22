'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingBasket01Icon,
    Restaurant01Icon,
    Fuel01Icon,
    Bus01Icon,
    Medicine02Icon,
    SparklesIcon,
    Home01Icon,
    ShoppingBag01Icon,
    Film01Icon,
    Airplane01Icon,
    Invoice01Icon,
    Briefcase01Icon,
    GiftIcon,
    MoreHorizontalIcon,
    TrendingUpIcon,
    PencilEdit02Icon,
    Delete02Icon,
    Cancel01Icon,
    AlertDiamondIcon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
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
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { EditTransactionModal } from './EditTransactionModal';
import { ViewTransactionModal } from './ViewTransactionModal';

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<ExpenseCategory, React.ReactElement> = {
    'Магазини (Храна/Вода)': <AppIcon icon={ShoppingBasket01Icon} size={15} />,
    'Eating out': <AppIcon icon={Restaurant01Icon} size={15} />,
    'Гориво': <AppIcon icon={Fuel01Icon} size={15} />,
    'Градски транспорт': <AppIcon icon={Bus01Icon} size={15} />,
    'Health/Аптека': <AppIcon icon={Medicine02Icon} size={15} />,
    'Beauty': <AppIcon icon={SparklesIcon} size={15} />,
    'Home': <AppIcon icon={Home01Icon} size={15} />,
    'Shopping': <AppIcon icon={ShoppingBag01Icon} size={15} />,
    'Entertainment': <AppIcon icon={Film01Icon} size={15} />,
    'Пътуване': <AppIcon icon={Airplane01Icon} size={15} />,
    'Сметки/Разходи': <AppIcon icon={Invoice01Icon} size={15} />,
    'Фирмени разходи': <AppIcon icon={Briefcase01Icon} size={15} />,
    'Подаръци': <AppIcon icon={GiftIcon} size={15} />,
    'Други': <AppIcon icon={MoreHorizontalIcon} size={15} />,
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    'Магазини (Храна/Вода)': 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    'Eating out': 'bg-rose-50 text-rose-500 border-rose-200/70',
    'Гориво': 'bg-orange-50 text-orange-500 border-orange-200/70',
    'Градски транспорт': 'bg-blue-50 text-blue-500 border-blue-200/70',
    'Health/Аптека': 'bg-pink-50 text-pink-500 border-pink-200/70',
    'Beauty': 'bg-fuchsia-50 text-fuchsia-500 border-fuchsia-200/70',
    'Home': 'bg-indigo-50 text-indigo-500 border-indigo-200/70',
    'Shopping': 'bg-teal-50 text-teal-500 border-teal-200/70',
    'Entertainment': 'bg-purple-50 text-purple-500 border-purple-200/70',
    'Пътуване': 'bg-sky-50 text-sky-500 border-sky-200/70',
    'Сметки/Разходи': 'bg-amber-50 text-amber-600 border-amber-200/70',
    'Фирмени разходи': 'bg-slate-50 text-slate-600 border-slate-200/70',
    'Подаръци': 'bg-red-50 text-red-400 border-red-200/70',
    'Други': 'bg-stone-100 text-stone-600 border-stone-200/70',
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

const DeleteDialog = ({ description, amount, onConfirm, onCancel }: DeleteDialogProps): React.ReactElement => {
    useBodyScrollLock(true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Изтриване на транзакция"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overscroll-contain"
            onClick={onCancel}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden="true" />
            {/* Dialog */}
            <div
                className="relative bg-white rounded-2xl shadow-xl border border-stone-200/80 w-full max-w-xs p-5 flex flex-col items-center gap-4 z-10 animate-toast-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    aria-label="Затвори"
                >
                    <AppIcon icon={Cancel01Icon} size={16} />
                </button>
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-50 border border-rose-100">
                    <AppIcon icon={AlertDiamondIcon} size={20} className="text-rose-400" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-stone-800 mb-1">Изтриване на транзакция</p>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Сигурни ли сте, че искате да изтриете{' '}
                        <span className="font-semibold text-stone-700">&quot;{description}&quot;</span>{' '}
                        ({amount})?
                    </p>
                </div>
                <div className="flex gap-2.5 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 rounded-lg text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                    >
                        Отказ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Изтрий
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Action Sheet Menu ─────────────────────────────────────────────────────────

interface TransactionActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    transaction:
        | { type: 'expense'; entry: ExpenseEntry }
        | { type: 'income'; entry: IncomeEntry }
        | null;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const TransactionActionMenu = ({
    isOpen,
    onClose,
    transaction,
    onView,
    onEdit,
    onDelete,
}: TransactionActionMenuProps): React.ReactElement | null => {
    useBodyScrollLock(isOpen && Boolean(transaction));

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !transaction) return null;

    const isExpense = transaction.type === 'expense';
    const entry = transaction.entry;
    const title = entry.description || (isExpense ? 'Разход' : 'Приход');
    const amount = formatAmount(entry.amount, entry.date);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Опции за транзакцията"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overscroll-contain"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                aria-hidden="true"
            />

            {/* Menu Sheet Card */}
            <div
                className="relative bg-white rounded-2xl shadow-xl border border-stone-200/80 w-full max-w-xs p-4 flex flex-col gap-2.5 z-10 animate-toast-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Preview */}
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                    <div className="min-w-0 flex-1 pr-2">
                        <p className="text-xs font-semibold text-stone-800 truncate">
                            {title}
                        </p>
                        <p className="text-[11px] text-stone-400 capitalize">
                            {isExpense ? 'Разход' : 'Приход'}
                        </p>
                    </div>
                    <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${isExpense ? 'text-stone-800' : 'text-emerald-600'}`}>
                        {isExpense ? `-${amount}` : `+${amount}`}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onView();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
                    >
                        <AppIcon icon={Invoice01Icon} size={16} className="text-stone-500" />
                        <span>Виж детайли</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onEdit();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
                    >
                        <AppIcon icon={PencilEdit02Icon} size={16} className="text-stone-500" />
                        <span>Редактирай</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onDelete();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 bg-rose-50/60 hover:bg-rose-100 active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
                    >
                        <AppIcon icon={Delete02Icon} size={16} className="text-rose-500" />
                        <span>Изтрий</span>
                    </button>
                </div>

                {/* Cancel */}
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-600 active:scale-[0.98] transition-all cursor-pointer text-center mt-0.5"
                >
                    Отказ
                </button>
            </div>
        </div>
    );
};

// ── Row Components ────────────────────────────────────────────────────────────

interface ExpenseRowProps {
    expense: ExpenseEntry;
    onView: (expense: ExpenseEntry) => void;
    onOpenMenu: (expense: ExpenseEntry) => void;
}

const ExpenseRow = ({ expense, onView, onOpenMenu }: ExpenseRowProps): React.ReactElement => {
    const { amountColor, rowBg } = getExpenseRowColors(
        expense.isWorkExpense,
        expense.isWithKami,
        expense.isWithOthers,
    );

    return (
        <div className={`group flex items-center justify-between gap-2.5 py-2.5 px-3 -mx-1 rounded-xl border-b border-stone-100 last:border-0 hover:bg-stone-50/80 transition-all ${rowBg}`}>
            {/* Card Body: Tap to View Details */}
            <button
                type="button"
                onClick={() => onView(expense)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer active:scale-[0.99] transition-transform select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg p-0.5"
                aria-label={`Виж детайли за ${expense.description}`}
            >
                <IconSquircle className={CATEGORY_COLORS[expense.category]}>
                    {CATEGORY_ICONS[expense.category]}
                </IconSquircle>
                <div className="flex-1 min-w-0 pr-1">
                    <p className="text-sm text-stone-800 font-semibold truncate leading-snug">
                        {expense.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-stone-500 whitespace-nowrap font-medium">
                            {CATEGORY_BG_MAP[expense.category] ?? expense.category}
                        </p>
                        {expense.isWorkExpense && (
                            <span className="whitespace-nowrap text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-full leading-none">
                                Работни
                            </span>
                        )}
                        {expense.isWithKami && (
                            <span className="whitespace-nowrap text-[9px] font-semibold text-pink-700 bg-pink-50 border border-pink-200/80 px-1.5 py-0.5 rounded-full leading-none">
                                Kami ❤️
                            </span>
                        )}
                        {expense.isWithOthers && (
                            <span className="whitespace-nowrap text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-full leading-none">
                                С Други
                            </span>
                        )}
                    </div>
                </div>
            </button>

            {/* Right Zone: Amount + Quick Menu Button */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                    type="button"
                    onClick={() => onView(expense)}
                    className="text-right cursor-pointer active:scale-[0.98] transition-transform select-none focus:outline-none"
                    aria-label={`Сума: ${formatAmount(expense.amount, expense.date)}`}
                >
                    <span className={`text-sm font-bold tabular-nums ${amountColor}`}>
                        -{formatAmount(expense.amount, expense.date)}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenMenu(expense);
                    }}
                    aria-label={`Опции за ${expense.description}`}
                    className="p-2 -mr-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-[0.95] transition-all cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
                >
                    <AppIcon icon={MoreHorizontalIcon} size={16} />
                </button>
            </div>
        </div>
    );
};

interface IncomeRowProps {
    income: IncomeEntry;
    onView: (income: IncomeEntry) => void;
    onOpenMenu: (income: IncomeEntry) => void;
}

const IncomeRow = ({ income, onView, onOpenMenu }: IncomeRowProps): React.ReactElement => {
    const isWork = income.isWorkIncome;
    const amountColor = isWork ? 'text-blue-600' : 'text-emerald-600';
    const iconClass = isWork
        ? 'bg-blue-50 text-blue-600 border-blue-200/70'
        : 'bg-emerald-50 text-emerald-600 border-emerald-200/70';

    return (
        <div className="group flex items-center justify-between gap-2.5 py-2.5 px-3 -mx-1 rounded-xl border-b border-stone-100 last:border-0 hover:bg-stone-50/80 transition-all">
            {/* Card Body: Tap to View Details */}
            <button
                type="button"
                onClick={() => onView(income)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer active:scale-[0.99] transition-transform select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg p-0.5"
                aria-label={`Виж детайли за ${income.description || 'Приход'}`}
            >
                <IconSquircle className={iconClass}>
                    {isWork ? (
                        <AppIcon icon={Briefcase01Icon} size={15} />
                    ) : (
                        <AppIcon icon={TrendingUpIcon} size={15} />
                    )}
                </IconSquircle>
                <div className="flex-1 min-w-0 pr-1">
                    <p className="text-sm text-stone-800 font-semibold truncate leading-snug">
                        {income.description || 'Приход'}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-stone-500 whitespace-nowrap font-medium">Спечелени пари</p>
                        {isWork && (
                            <span className="whitespace-nowrap text-[9px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-full leading-none">
                                Работен
                            </span>
                        )}
                        {income.isWithKami && (
                            <span className="whitespace-nowrap text-[9px] font-semibold text-pink-700 bg-pink-50 border border-pink-200/80 px-1.5 py-0.5 rounded-full leading-none">
                                Kami ❤️
                            </span>
                        )}
                    </div>
                </div>
            </button>

            {/* Right Zone: Amount + Quick Menu Button */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                    type="button"
                    onClick={() => onView(income)}
                    className="text-right cursor-pointer active:scale-[0.98] transition-transform select-none focus:outline-none"
                    aria-label={`Сума: ${formatAmount(income.amount, income.date)}`}
                >
                    <span className={`text-sm font-bold tabular-nums ${amountColor}`}>
                        +{formatAmount(income.amount, income.date)}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenMenu(income);
                    }}
                    aria-label={`Опции за ${income.description || 'Приход'}`}
                    className="p-2 -mr-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-[0.95] transition-all cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
                >
                    <AppIcon icon={MoreHorizontalIcon} size={16} />
                </button>
            </div>
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
    const [viewingTransaction, setViewingTransaction] = useState<
        | { type: 'expense'; entry: ExpenseEntry }
        | { type: 'income'; entry: IncomeEntry }
        | null
    >(null);
    const [editingTransaction, setEditingTransaction] = useState<
        | { type: 'expense'; entry: ExpenseEntry }
        | { type: 'income'; entry: IncomeEntry }
        | null
    >(null);
    const [menuTransaction, setMenuTransaction] = useState<
        | { type: 'expense'; entry: ExpenseEntry }
        | { type: 'income'; entry: IncomeEntry }
        | null
    >(null);

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
                    <AppIcon icon={Invoice01Icon} size={18} />
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
            {/* View Transaction Modal */}
            <ViewTransactionModal
                isOpen={Boolean(viewingTransaction)}
                transaction={viewingTransaction}
                onClose={() => setViewingTransaction(null)}
            />

            {/* Edit Transaction Modal */}
            <EditTransactionModal
                isOpen={Boolean(editingTransaction)}
                transaction={editingTransaction}
                onClose={() => setEditingTransaction(null)}
            />

            {/* Delete Confirmation Modal */}
            {pendingDelete && (
                <DeleteDialog
                    description={pendingDelete.description}
                    amount={pendingDelete.amount}
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}

            {/* Quick Action Menu Sheet */}
            <TransactionActionMenu
                isOpen={Boolean(menuTransaction)}
                transaction={menuTransaction}
                onClose={() => setMenuTransaction(null)}
                onView={() => {
                    if (menuTransaction) {
                        setViewingTransaction(menuTransaction);
                    }
                }}
                onEdit={() => {
                    if (menuTransaction) {
                        setEditingTransaction(menuTransaction);
                    }
                }}
                onDelete={() => {
                    if (menuTransaction) {
                        if (menuTransaction.type === 'expense') {
                            requestDeleteExpense(menuTransaction.entry.id);
                        } else {
                            requestDeleteIncome(menuTransaction.entry.id);
                        }
                    }
                }}
            />

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
                            onView={(inc) => setViewingTransaction({ type: 'income', entry: inc })}
                            onOpenMenu={(inc) => setMenuTransaction({ type: 'income', entry: inc })}
                        />
                    ))}
                    {[...filteredExpense].reverse().map((expense) => (
                        <ExpenseRow
                            key={expense.id}
                            expense={expense}
                            onView={(exp) => setViewingTransaction({ type: 'expense', entry: exp })}
                            onOpenMenu={(exp) => setMenuTransaction({ type: 'expense', entry: exp })}
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
