/**
 * ExportDropdown – Unified SaaS Export Action Menu.
 * Combines PDF, Excel (.xlsx), and CSV exports into a single non-intrusive,
 * elegant dropdown popover.
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Download01Icon,
    File01Icon,
    GridTableIcon,
    Csv01Icon,
    ArrowDown01Icon,
    CheckmarkCircle02Icon,
    Loading03Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { useFinancialStore } from '@/store/transactionStore';
import { useStatisticsData } from '@/hooks/useStatisticsData';
import { exportToCsv } from '@/lib/csvExport';
import { logError } from '@/lib/errorLogger';
import { useToastStore } from '@/store/toastStore';

const SUCCESS_DISPLAY_MS = 2500;

type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ExportDropdownProps {
    /** Optional year override (defaults to current year) */
    year?: number;
}

export const ExportDropdown = ({ year: propYear }: ExportDropdownProps): React.ReactElement => {
    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);
    const selectedDate = useFinancialStore((s) => s.selectedDate);

    const year = propYear ?? (selectedDate ? parseInt(selectedDate.slice(0, 4), 10) : new Date().getFullYear());
    const stats = useStatisticsData(year);

    const [isOpen, setIsOpen] = useState(false);
    const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);
    const [doneFormat, setDoneFormat] = useState<ExportFormat | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent): void => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const handleExportPdf = async (): Promise<void> => {
        if (loadingFormat) return;
        setLoadingFormat('pdf');
        setIsOpen(false);

        try {
            const { exportToPdf } = await import('@/lib/pdfExport');
            await exportToPdf(stats, year);
            setDoneFormat('pdf');
            setTimeout(() => setDoneFormat(null), SUCCESS_DISPLAY_MS);
        } catch (err) {
            logError('exportPdf', err, { year });
            useToastStore.getState().showToast('Възникна грешка при генериране на PDF файл', 'error');
        } finally {
            setLoadingFormat(null);
        }
    };

    const handleExportExcel = async (): Promise<void> => {
        if (loadingFormat) return;
        setLoadingFormat('excel');
        setIsOpen(false);

        try {
            const { exportToExcel } = await import('@/lib/excelExport');
            await exportToExcel(incomeEntries, expenseEntries, year);
            setDoneFormat('excel');
            setTimeout(() => setDoneFormat(null), SUCCESS_DISPLAY_MS);
        } catch (err) {
            logError('exportExcel', err, { year });
            useToastStore.getState().showToast('Възникна грешка при генериране на Excel файл', 'error');
        } finally {
            setLoadingFormat(null);
        }
    };

    const handleExportCsv = (): void => {
        if (loadingFormat) return;
        setLoadingFormat('csv');
        setIsOpen(false);

        try {
            exportToCsv(incomeEntries, expenseEntries);
            setDoneFormat('csv');
            setTimeout(() => setDoneFormat(null), SUCCESS_DISPLAY_MS);
        } catch (err) {
            logError('exportCsv', err);
            useToastStore.getState().showToast('Възникна грешка при експортиране на CSV файл', 'error');
        } finally {
            setLoadingFormat(null);
        }
    };

    return (
        <div className="relative inline-block text-left">
            {/* ── Main Trigger Button ──────────────────────────────────── */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={loadingFormat !== null}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border border-stone-200/80 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 transition-transform duration-150 active:scale-[0.97] shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                aria-label="Експортирай данни"
                aria-expanded={isOpen}
            >
                {loadingFormat ? (
                    <AppIcon icon={Loading03Icon} size={14} className="animate-spin text-emerald-600" />
                ) : doneFormat ? (
                    <AppIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-600" />
                ) : (
                    <AppIcon icon={Download01Icon} size={14} className="text-stone-500" />
                )}

                <span>
                    {loadingFormat
                        ? 'Генериране…'
                        : doneFormat
                        ? 'Успешно!'
                        : 'Експортирай'}
                </span>

                <AppIcon
                    icon={ArrowDown01Icon}
                    size={13}
                    className={`text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* ── Popover Menu ────────────────────────────────────────── */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-72 z-50 origin-top-right bg-white rounded-2xl shadow-xl border border-stone-200/80 p-1.5 animate-[fadeSlideIn_150ms_cubic-bezier(0.23,1,0.32,1)]"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                            Изберете формат
                        </p>
                    </div>

                    {/* PDF Option */}
                    <button
                        onClick={handleExportPdf}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-transform duration-150 active:scale-[0.98] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                        role="menuitem"
                    >
                        <IconSquircle
                            size="md"
                            className="bg-rose-50 text-rose-600 border-rose-200/70 group-hover:bg-rose-100/80 mt-0.5"
                        >
                            <AppIcon icon={File01Icon} size={15} />
                        </IconSquircle>
                        <div>
                            <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                                Годишен PDF отчет
                                <span className="text-[10px] font-medium text-rose-600 bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded-md tabular-nums">
                                    {year}&nbsp;г.
                                </span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                                Векторни графики, KPI карти и анализи
                            </p>
                        </div>
                    </button>

                    {/* Excel Option */}
                    <button
                        onClick={handleExportExcel}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-transform duration-150 active:scale-[0.98] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                        role="menuitem"
                    >
                        <IconSquircle
                            size="md"
                            className="bg-emerald-50 text-emerald-600 border-emerald-200/70 group-hover:bg-emerald-100/80 mt-0.5"
                        >
                            <AppIcon icon={GridTableIcon} size={15} />
                        </IconSquircle>
                        <div>
                            <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                                Excel (.xlsx)
                                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                                    Google Sheets
                                </span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                                12 месечни раздела с форматирани таблици
                            </p>
                        </div>
                    </button>

                    {/* CSV Option */}
                    <button
                        onClick={handleExportCsv}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-transform duration-150 active:scale-[0.98] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                        role="menuitem"
                    >
                        <IconSquircle
                            size="md"
                            className="bg-blue-50 text-blue-600 border-blue-200/70 group-hover:bg-blue-100/80 mt-0.5"
                        >
                            <AppIcon icon={Csv01Icon} size={15} />
                        </IconSquircle>
                        <div>
                            <div className="text-xs font-semibold text-stone-800">
                                CSV Файл (.csv)
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                                Сурови данни за последните 30 дни
                            </p>
                        </div>
                    </button>

                    {/* Google Sheets Import Hint Footer */}
                    <div className="mt-1.5 pt-2 border-t border-stone-100 px-2.5 py-2 bg-stone-50/80 rounded-b-xl">
                        <p className="text-[10px] font-semibold text-stone-600 flex items-center gap-1 mb-1">
                            💡 Как да импортирате в Google Sheets:
                        </p>
                        <ol className="text-[10px] text-stone-400 leading-relaxed list-decimal list-inside space-y-0.5">
                            <li>Отворете <span className="font-medium text-stone-600">drive.google.com</span> или <span className="font-medium text-stone-600">Google Sheets</span></li>
                            <li>Натиснете <span className="font-medium text-stone-600">File › Import</span> (Файл › Импортиране)</li>
                            <li>Качете изтегления <span className="font-medium text-emerald-600">.xlsx</span> или <span className="font-medium text-blue-600">.csv</span> файл</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};
