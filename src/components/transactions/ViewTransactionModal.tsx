'use client';

import React, { useEffect } from 'react';
import {
    Cancel01Icon,
    Calendar01Icon,
    Briefcase01Icon,
    TrendingUpIcon,
    Note01Icon,
    Tag01Icon,
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
    GiftIcon,
    MoreHorizontalIcon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { ExpenseCategory, ExpenseEntry, IncomeEntry } from '@/types';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
    CATEGORY_BG_MAP,
} from '@/lib/constants';

// Category icon mapping
const CATEGORY_ICONS: Record<ExpenseCategory, React.ReactElement> = {
    'Магазини (Храна/Вода)': <AppIcon icon={ShoppingBasket01Icon} size={16} />,
    'Eating out': <AppIcon icon={Restaurant01Icon} size={16} />,
    'Гориво': <AppIcon icon={Fuel01Icon} size={16} />,
    'Градски транспорт': <AppIcon icon={Bus01Icon} size={16} />,
    'Health/Аптека': <AppIcon icon={Medicine02Icon} size={16} />,
    'Beauty': <AppIcon icon={SparklesIcon} size={16} />,
    'Home': <AppIcon icon={Home01Icon} size={16} />,
    'Shopping': <AppIcon icon={ShoppingBag01Icon} size={16} />,
    'Entertainment': <AppIcon icon={Film01Icon} size={16} />,
    'Пътуване': <AppIcon icon={Airplane01Icon} size={16} />,
    'Сметки/Разходи': <AppIcon icon={Invoice01Icon} size={16} />,
    'Фирмени разходи': <AppIcon icon={Briefcase01Icon} size={15} />,
    'Подаръци': <AppIcon icon={GiftIcon} size={16} />,
    'Други': <AppIcon icon={MoreHorizontalIcon} size={16} />,
};

// Category squircle color classes (strictly light-mode)
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

export interface ViewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction:
        | { type: 'expense'; entry: ExpenseEntry }
        | { type: 'income'; entry: IncomeEntry }
        | null;
}

const formatFullDate = (dateStr: string): string => {
    try {
        const d = new Date(`${dateStr}T00:00:00`);
        return d.toLocaleDateString('bg-BG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export const ViewTransactionModal = ({
    isOpen,
    onClose,
    transaction,
}: ViewTransactionModalProps): React.ReactElement | null => {
    // Escape key dismiss
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
    const currency = getCurrencySymbol(entry.date);
    const formattedAmount = `${entry.amount.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}\u00A0${currency}`;

    let iconElement = <AppIcon icon={TrendingUpIcon} size={16} />;
    let iconSquircleClass = 'bg-emerald-50 text-emerald-600 border-emerald-200/70';
    let categoryTitle = 'Приход';
    let amountColor = 'text-emerald-600';
    let isWork = false;
    let isKami = false;
    let isOthers = false;

    if (isExpense) {
        const exp = entry as ExpenseEntry;
        iconElement = CATEGORY_ICONS[exp.category] ?? <AppIcon icon={MoreHorizontalIcon} size={16} />;
        iconSquircleClass = CATEGORY_COLORS[exp.category] ?? 'bg-stone-100 text-stone-600 border-stone-200/70';
        categoryTitle = CATEGORY_BG_MAP[exp.category] ?? exp.category;
        isWork = Boolean(exp.isWorkExpense);
        isKami = Boolean(exp.isWithKami);
        isOthers = Boolean(exp.isWithOthers);
        amountColor = isWork ? 'text-amber-600' : 'text-rose-600';
    } else {
        const inc = entry as IncomeEntry;
        isWork = Boolean(inc.isWorkIncome);
        isKami = Boolean(inc.isWithKami);
        categoryTitle = 'Спечелени пари';
        if (isWork) {
            iconElement = <AppIcon icon={Briefcase01Icon} size={16} />;
            iconSquircleClass = 'bg-blue-50 text-blue-600 border-blue-200/70';
            amountColor = 'text-blue-600';
        }
    }

    const hasTags = isWork || isKami || isOthers;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-transaction-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className="relative bg-white rounded-2xl shadow-xl border border-stone-200/80 w-full max-w-sm p-5 flex flex-col gap-4 overflow-hidden transition-all transform duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <IconSquircle className={iconSquircleClass}>
                            {iconElement}
                        </IconSquircle>
                        <div className="min-w-0">
                            <h2
                                id="view-transaction-title"
                                className="text-sm font-semibold text-stone-800 truncate"
                            >
                                {categoryTitle}
                            </h2>
                            <p className="text-xs text-stone-400 capitalize">
                                {isExpense ? 'Разход' : 'Приход'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Затвори детайли"
                        className="p-2 -mr-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                    >
                        <AppIcon icon={Cancel01Icon} size={18} />
                    </button>
                </div>

                {/* Amount Hero */}
                <div className="flex flex-col items-center justify-center py-2.5 px-3 bg-stone-50/70 rounded-xl border border-stone-100">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                        Сума
                    </span>
                    <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${amountColor}`}>
                        {isExpense ? `-${formattedAmount}` : `+${formattedAmount}`}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-1">
                        <AppIcon icon={Calendar01Icon} size={13} className="text-stone-400" />
                        <span>{formatFullDate(entry.date)}</span>
                    </div>
                </div>

                {/* Full Description Section */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 px-0.5">
                        <AppIcon icon={Note01Icon} size={13} />
                        <span>Пълно описание</span>
                    </div>
                    <div className="bg-stone-50/80 border border-stone-200/70 rounded-xl p-3 min-h-[56px] max-h-[160px] overflow-y-auto">
                        <p className="text-sm text-stone-800 font-medium leading-relaxed break-words whitespace-pre-wrap select-text">
                            {entry.description && entry.description.trim().length > 0
                                ? entry.description
                                : <span className="text-stone-400 font-normal italic">Няма въведено описание</span>}
                        </p>
                    </div>
                </div>

                {/* Tags section (if any) */}
                {hasTags && (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400 px-0.5">
                            <AppIcon icon={Tag01Icon} size={13} />
                            <span>Етикети</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {isWork && (
                                <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                                    {isExpense ? 'Работен разход' : 'Работен приход'}
                                </span>
                            )}
                            {isKami && (
                                <span className="inline-flex items-center text-[10px] font-semibold text-pink-700 bg-pink-50 border border-pink-200/80 px-2 py-0.5 rounded-full">
                                    Kami ❤️
                                </span>
                            )}
                            {isOthers && (
                                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                                    С Други
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
