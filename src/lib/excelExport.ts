/**
 * Excel (.xlsx) export utility for Google Sheets & Microsoft Excel.
 * Generates a full-year financial workbook containing:
 *   - Tab 0: "Общ преглед" (Annual overview & monthly breakdown)
 *   - Tabs 1–12: "1. Януари", "2. Февруари", ... "12. Декември"
 *
 * Row styling:
 *   - Soft green background (#F0FDF4) for income rows
 *   - Soft red/rose background (#FFF1F2) for expense rows
 *   - Dark header bar (#1F2937) with bold white text
 *   - Bold total row at the bottom of each monthly tab
 *   - Clean 5 columns (removed "Да/Не" boolean flags for clutter-free table)
 */

import type { IncomeEntry, ExpenseEntry } from '@/types';
import { MONTH_NAMES_BG, CATEGORY_BG_MAP, getCurrencySymbol } from '@/lib/constants';
import { getMonthRange } from '@/lib/dateUtils';

// ── Color Constants (Soft / Subtle Tints) ────────────────────────────────────

const EXCEL_COLORS = {
    headerBg:     '1F2937', // Dark Slate
    headerText:   'FFFFFF', // White
    incomeBg:     'F0FDF4', // Soft mint green fill
    incomeText:   '166534', // Dark green text
    expenseBg:    'FFF1F2', // Soft rose red fill
    expenseText:  '991B1B', // Dark red text
    summaryBg:    'F9FAFB', // Light gray fill for total rows
    summaryText:  '1F2937', // Dark gray font
    borderGray:   'E5E7EB', // Light gray border
    totalBorder:  '9CA3AF', // Medium gray for total line
} as const;

export interface ExcelRow {
    date: string;
    type: 'Приход' | 'Приход (Работен)' | 'Разход';
    description: string;
    category: string;
    amount: number;
    rawType: 'income' | 'expense';
}

const COLUMNS_HEADERS = ['Дата', 'Тип', 'Описание', 'Категория', 'Сума'] as const;

/**
 * Filter transactions for a given year and return them organized by month index (0..11).
 */
export function getMonthlyTransactions(
    incomeEntries: IncomeEntry[],
    expenseEntries: ExpenseEntry[],
    year: number
): Record<number, ExcelRow[]> {
    const result: Record<number, ExcelRow[]> = {};

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const { start, end } = getMonthRange(year, monthIdx);

        const mIncome: ExcelRow[] = incomeEntries
            .filter((e) => e.date >= start && e.date <= end)
            .map((e) => ({
                date: e.date,
                type: e.isWorkIncome ? 'Приход (Работен)' : 'Приход',
                description: e.description || 'Приход',
                category: '—',
                amount: e.amount,
                rawType: 'income',
            }));

        const mExpense: ExcelRow[] = expenseEntries
            .filter((e) => e.date >= start && e.date <= end)
            .map((e) => ({
                date: e.date,
                type: 'Разход',
                description: e.description || 'Разход',
                category: CATEGORY_BG_MAP[e.category] ?? e.category,
                amount: e.amount,
                rawType: 'expense',
            }));

        // Sort ascending by date
        result[monthIdx] = [...mIncome, ...mExpense].sort((a, b) => a.date.localeCompare(b.date));
    }

    return result;
}

/**
 * Pure function that builds an ExcelJS Workbook instance with all styling applied.
 * Separated from browser download logic to enable clean unit testing.
 */
export function buildWorkbook(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ExcelJS: any,
    incomeEntries: IncomeEntry[],
    expenseEntries: ExpenseEntry[],
    year: number
) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Finance App';
    workbook.created = new Date();

    const currencySymbol = getCurrencySymbol(`${year}-01-01`);
    const numFormat = `#,##0.00 "${currencySymbol}"`;
    const monthlyData = getMonthlyTransactions(incomeEntries, expenseEntries, year);

    // ── Tab 0: Общ преглед (Overview) ───────────────────────────────────────
    const summarySheet = workbook.addWorksheet('Общ преглед', {
        views: [{ showGridLines: true }],
    });

    // Title Banner
    summarySheet.mergeCells('A1:D1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = `Годишен финансов отчет — ${year} г.`;
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: EXCEL_COLORS.headerText } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.headerBg } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    summarySheet.getRow(1).height = 32;

    // Monthly summary header row
    summarySheet.getRow(3).values = ['Месец', 'Общо приходи', 'Общо разходи', 'Печалба'];
    const summaryHeaderRow = summarySheet.getRow(3);
    summaryHeaderRow.height = 24;
    summaryHeaderRow.eachCell((cell: any) => {
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: EXCEL_COLORS.headerText } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    let totalYearIncome = 0;
    let totalYearExpense = 0;

    // Populate monthly summary rows
    for (let i = 0; i < 12; i++) {
        const rows = monthlyData[i] || [];
        const monthInc = rows.filter((r) => r.rawType === 'income').reduce((s, r) => s + r.amount, 0);
        const monthExp = rows.filter((r) => r.rawType === 'expense').reduce((s, r) => s + r.amount, 0);
        const monthProfit = monthInc - monthExp;

        totalYearIncome += monthInc;
        totalYearExpense += monthExp;

        const rowNum = 4 + i;
        const row = summarySheet.getRow(rowNum);
        row.values = [MONTH_NAMES_BG[i], monthInc, monthExp, monthProfit];

        // Format cells
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

        [2, 3, 4].forEach((colIdx) => {
            const cell = row.getCell(colIdx);
            cell.numFmt = numFormat;
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
        });

        // Profit font color
        row.getCell(4).font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: monthProfit >= 0 ? EXCEL_COLORS.incomeText : EXCEL_COLORS.expenseText },
        };

        // Alternating row background
        if (i % 2 === 1) {
            [1, 2, 3, 4].forEach((colIdx) => {
                const cell = row.getCell(colIdx);
                if (colIdx !== 4) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F9FAFB' } };
                }
            });
        }
    }

    // Annual Total Row
    const totalRowNum = 16;
    const totalRow = summarySheet.getRow(totalRowNum);
    const totalProfit = totalYearIncome - totalYearExpense;
    totalRow.values = ['ОБЩО ЗА ГОДИНАТА', totalYearIncome, totalYearExpense, totalProfit];
    totalRow.height = 24;

    totalRow.eachCell((cell: any, colIdx: number) => {
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: EXCEL_COLORS.summaryText } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.summaryBg } };
        cell.border = {
            top: { style: 'thin', color: { argb: EXCEL_COLORS.totalBorder } },
            bottom: { style: 'double', color: { argb: EXCEL_COLORS.totalBorder } },
        };
        if (colIdx > 1) {
            cell.numFmt = numFormat;
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
        }
    });

    summarySheet.columns = [
        { width: 20 }, // Month
        { width: 18 }, // Income
        { width: 18 }, // Expense
        { width: 18 }, // Profit
    ];

    // ── Tabs 1–12: Monthly Sheets ───────────────────────────────────────────
    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const monthName = MONTH_NAMES_BG[monthIdx];
        const sheetName = `${monthIdx + 1}. ${monthName}`;
        const sheet = workbook.addWorksheet(sheetName, {
            views: [{ showGridLines: true }],
        });

        // Header Row
        sheet.getRow(1).values = [...COLUMNS_HEADERS];
        sheet.getRow(1).height = 26;

        sheet.getRow(1).eachCell((cell: any, colIdx: number) => {
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: EXCEL_COLORS.headerText } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.headerBg } };
            cell.alignment = { vertical: 'middle', horizontal: colIdx === 5 ? 'right' : 'left' };
        });

        const rows = monthlyData[monthIdx] || [];
        let monthTotalInc = 0;
        let monthTotalExp = 0;

        rows.forEach((r, idx) => {
            const rowNumber = idx + 2;
            const excelRow = sheet.getRow(rowNumber);
            excelRow.values = [r.date, r.type, r.description, r.category, r.amount];
            excelRow.height = 20;

            const isIncome = r.rawType === 'income';
            if (isIncome) monthTotalInc += r.amount;
            else monthTotalExp += r.amount;

            const rowBg = isIncome ? EXCEL_COLORS.incomeBg : EXCEL_COLORS.expenseBg;
            const textColor = isIncome ? EXCEL_COLORS.incomeText : EXCEL_COLORS.expenseText;

            // Apply soft pastel row fill to all 5 cells
            for (let c = 1; c <= 5; c++) {
                const cell = excelRow.getCell(c);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                cell.border = {
                    bottom: { style: 'thin', color: { argb: EXCEL_COLORS.borderGray } },
                };
            }

            // Alignments & Fonts
            excelRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
            excelRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
            excelRow.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
            excelRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'left' };

            // Amount Cell
            const amountCell = excelRow.getCell(5);
            amountCell.numFmt = numFormat;
            amountCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: textColor } };
            amountCell.alignment = { vertical: 'middle', horizontal: 'right' };
        });

        // Summary Row at bottom of month
        if (rows.length > 0) {
            const lastRowIndex = rows.length + 2;
            const monthProfit = monthTotalInc - monthTotalExp;

            const subtotalRow = sheet.getRow(lastRowIndex);
            subtotalRow.values = ['ОБЩО ЗА МЕСЕЦА', '', `Приходи: +${monthTotalInc.toFixed(2)}`, `Разходи: −${monthTotalExp.toFixed(2)}`, monthProfit];
            subtotalRow.height = 24;

            subtotalRow.eachCell((cell: any, colIdx: number) => {
                cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: EXCEL_COLORS.summaryText } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.summaryBg } };
                cell.border = {
                    top: { style: 'thin', color: { argb: EXCEL_COLORS.totalBorder } },
                    bottom: { style: 'double', color: { argb: EXCEL_COLORS.totalBorder } },
                };
            });

            subtotalRow.getCell(5).numFmt = numFormat;
            subtotalRow.getCell(5).font = {
                name: 'Arial',
                size: 10,
                bold: true,
                color: { argb: monthProfit >= 0 ? EXCEL_COLORS.incomeText : EXCEL_COLORS.expenseText },
            };
            subtotalRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
        }

        // Auto-fit column widths
        sheet.columns = [
            { width: 14 }, // Date
            { width: 20 }, // Type
            { width: 32 }, // Description
            { width: 24 }, // Category
            { width: 18 }, // Amount
        ];
    }

    return workbook;
}

/**
 * Dynamically imports ExcelJS and triggers client-side download of `.xlsx` file.
 */
export async function exportToExcel(
    incomeEntries: IncomeEntry[],
    expenseEntries: ExpenseEntry[],
    year: number
): Promise<void> {
    const ExcelJS = await import('exceljs');
    const workbook = buildWorkbook(ExcelJS, incomeEntries, expenseEntries, year);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-export-${year}.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
}
