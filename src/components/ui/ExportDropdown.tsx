/**
 * ExportDropdown – Unified SaaS Export Action Menu.
 * Combines PDF, Excel (.xlsx), and CSV exports into a single non-intrusive,
 * elegant dropdown popover.
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Download,
    FileText,
    Table,
    FileSpreadsheet,
    ChevronDown,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import { useStatisticsData } from '@/hooks/useStatisticsData';
import { exportToCsv } from '@/lib/csvExport';

const SUCCESS_DISPLAY_MS = 2500;

interface ExportDropdownProps {
    /** Optional year override (defaults to current year) */
    year?: number;
}

export const ExportDropdown = ({ year: propYear }: ExportDropdownProps): React.ReactElement => {
    const currentYear = new Date().getFullYear();
    const year = propYear ?? currentYear;

    const [isOpen, setIsOpen] = useState(false);
    const [loadingFormat, setLoadingFormat] = useState<'pdf' | 'excel' | 'csv' | null>(null);
    const [doneFormat, setDoneFormat] = useState<'pdf' | 'excel' | 'csv' | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);
    const stats = useStatisticsData(year);

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
            console.error('PDF export failed:', err);
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
            console.error('Excel export failed:', err);
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
            console.error('CSV export failed:', err);
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm disabled:opacity-50 disabled:cursor-wait"
                aria-label="Експортирай данни"
                aria-expanded={isOpen}
            >
                {loadingFormat ? (
                    <Loader2 size={14} className="animate-spin text-emerald-600" />
                ) : doneFormat ? (
                    <CheckCircle size={14} className="text-emerald-600" />
                ) : (
                    <Download size={14} className="text-gray-500" />
                )}

                <span>
                    {loadingFormat
                        ? 'Генериране…'
                        : doneFormat
                        ? 'Успешно!'
                        : 'Експортирай'}
                </span>

                <ChevronDown
                    size={13}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* ── Popover Menu ────────────────────────────────────────── */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-72 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 animate-[fadeSlideIn_150ms_ease-out]"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Изберете формат
                        </p>
                    </div>

                    {/* PDF Option */}
                    <button
                        onClick={handleExportPdf}
                        className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                    >
                        <div className="p-2 rounded-md bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors mt-0.5">
                            <FileText size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                Годишен PDF отчет
                                <span className="text-[10px] font-normal text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                                    {year} г.
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                Векторни графики, KPI карти и анализи
                            </p>
                        </div>
                    </button>

                    {/* Excel Option */}
                    <button
                        onClick={handleExportExcel}
                        className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                    >
                        <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors mt-0.5">
                            <Table size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                Excel (.xlsx)
                                <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                                    Google Sheets
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                12 месечни раздела с форматирани таблици
                            </p>
                        </div>
                    </button>

                    {/* CSV Option */}
                    <button
                        onClick={handleExportCsv}
                        className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                        role="menuitem"
                    >
                        <div className="p-2 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors mt-0.5">
                            <FileSpreadsheet size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-gray-800">
                                CSV Файл (.csv)
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                Сурови данни за последните 30 дни
                            </p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};
