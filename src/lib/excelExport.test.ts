/**
 * Unit tests for Excel (.xlsx) export module.
 */

import { describe, it, expect, vi } from 'vitest';
import ExcelJS from 'exceljs';
import { buildWorkbook, getMonthlyTransactions } from '@/lib/excelExport';
import type { IncomeEntry, ExpenseEntry } from '@/types';

// ── Test Data ────────────────────────────────────────────────────────────────

const MOCK_INCOMES: IncomeEntry[] = [
    {
        id: 'inc-1',
        amount: 3000,
        date: '2026-01-15',
        description: 'Заплата',
        isWorkIncome: true,
        isWithKami: false,
    },
    {
        id: 'inc-2',
        amount: 500,
        date: '2026-03-10',
        description: 'Фриланс',
        isWorkIncome: false,
        isWithKami: true,
    },
];

const MOCK_EXPENSES: ExpenseEntry[] = [
    {
        id: 'exp-1',
        amount: 150,
        date: '2026-01-20',
        description: 'Ресторант',
        category: 'Eating out',
        isWorkExpense: false,
        isWithKami: true,
        isWithOthers: false,
    },
    {
        id: 'exp-2',
        amount: 200,
        date: '2026-01-25',
        description: 'Бензин',
        category: 'Гориво',
        isWorkExpense: true,
        isWithKami: false,
        isWithOthers: true,
    },
    {
        id: 'exp-3',
        amount: 80,
        date: '2026-02-14',
        description: 'Подарък',
        category: 'Shopping',
        isWorkExpense: false,
        isWithKami: true,
        isWithOthers: false,
    },
];

// ── Tests ────────────────────────────────────────────────────────────────────

describe('excelExport – getMonthlyTransactions', () => {
    it('groups income and expense entries correctly by month index for specified year', () => {
        const result = getMonthlyTransactions(MOCK_INCOMES, MOCK_EXPENSES, 2026);

        // January (month 0) should have 1 income + 2 expenses = 3 rows
        expect(result[0]).toHaveLength(3);
        expect(result[0][0].date).toBe('2026-01-15');
        expect(result[0][0].rawType).toBe('income');
        expect(result[0][0].type).toBe('Приход (Работен)');

        // February (month 1) should have 1 expense
        expect(result[1]).toHaveLength(1);
        expect(result[1][0].description).toBe('Подарък');

        // March (month 2) should have 1 income
        expect(result[2]).toHaveLength(1);
        expect(result[2][0].type).toBe('Приход');

        // Other months should be empty arrays
        expect(result[3]).toHaveLength(0); // April
    });

    it('ignores transactions from different years', () => {
        const result2025 = getMonthlyTransactions(MOCK_INCOMES, MOCK_EXPENSES, 2025);
        for (let i = 0; i < 12; i++) {
            expect(result2025[i]).toHaveLength(0);
        }
    });

    it('maps English category names to Bulgarian display names', () => {
        const result = getMonthlyTransactions(MOCK_INCOMES, MOCK_EXPENSES, 2026);

        const janExpense1 = result[0].find((r) => r.description === 'Ресторант');
        expect(janExpense1?.category).toBe('Eating out');
    });
});

describe('excelExport – buildWorkbook', () => {
    it('creates 13 worksheets (1 overview + 12 monthly tabs)', () => {
        const workbook = buildWorkbook(ExcelJS, MOCK_INCOMES, MOCK_EXPENSES, 2026);
        expect(workbook.worksheets).toHaveLength(13);

        const names = workbook.worksheets.map((ws: ExcelJS.Worksheet) => ws.name);
        expect(names[0]).toBe('Общ преглед');
        expect(names[1]).toBe('1. Януари');
        expect(names[12]).toBe('12. Декември');
    });

    it('populates 5 clean columns in monthly tabs (no boolean Yes/No columns)', () => {
        const workbook = buildWorkbook(ExcelJS, MOCK_INCOMES, MOCK_EXPENSES, 2026);
        const janSheet = workbook.getWorksheet('1. Януари');
        expect(janSheet).toBeDefined();

        const headerValues = janSheet!.getRow(1).values as string[];
        // Index 0 is empty in ExcelJS, indices 1..5 contain column names
        const columns = headerValues.slice(1, 6);
        expect(columns).toEqual(['Дата', 'Тип', 'Описание', 'Категория', 'Сума']);
        expect(columns).not.toContain('Работни разходи');
        expect(columns).not.toContain('❤️');
        expect(columns).not.toContain('С Други');
    });

    it('applies soft pastel green fill to income rows and soft rose fill to expense rows', () => {
        const workbook = buildWorkbook(ExcelJS, MOCK_INCOMES, MOCK_EXPENSES, 2026);
        const janSheet = workbook.getWorksheet('1. Януари')!;

        // Row 2 is Income (2026-01-15)
        const incomeRow = janSheet.getRow(2);
        const incomeCellFill = incomeRow.getCell(1).fill as ExcelJS.FillPattern;
        expect(incomeCellFill.fgColor?.argb).toBe('F0FDF4');

        // Row 3 is Expense (2026-01-20)
        const expenseRow = janSheet.getRow(3);
        const expenseCellFill = expenseRow.getCell(1).fill as ExcelJS.FillPattern;
        expect(expenseCellFill.fgColor?.argb).toBe('FFF1F2');
    });

    it('calculates monthly subtotals and annual totals correctly', () => {
        const workbook = buildWorkbook(ExcelJS, MOCK_INCOMES, MOCK_EXPENSES, 2026);

        // Check Overview Sheet totals
        const summarySheet = workbook.getWorksheet('Общ преглед')!;

        // Row 4 is January: Income 3000, Expense 350, Profit 2650
        const janSummary = summarySheet.getRow(4).values as (string | number)[];
        expect(janSummary[1]).toBe('Януари');
        expect(janSummary[2]).toBe(3000);
        expect(janSummary[3]).toBe(350);
        expect(janSummary[4]).toBe(2650);

        // Row 16 is Annual Total: Total Income 3500, Total Expense 430, Profit 3070
        const annualTotalRow = summarySheet.getRow(16).values as (string | number)[];
        expect(annualTotalRow[1]).toBe('ОБЩО ЗА ГОДИНАТА');
        expect(annualTotalRow[2]).toBe(3500);
        expect(annualTotalRow[3]).toBe(430);
        expect(annualTotalRow[4]).toBe(3070);
    });

    it('handles an empty year gracefully without crashing', () => {
        const workbook = buildWorkbook(ExcelJS, [], [], 2026);
        expect(workbook.worksheets).toHaveLength(13);

        const summarySheet = workbook.getWorksheet('Общ преглед')!;
        const annualTotalRow = summarySheet.getRow(16).values as (string | number)[];
        expect(annualTotalRow[2]).toBe(0);
        expect(annualTotalRow[3]).toBe(0);
        expect(annualTotalRow[4]).toBe(0);
    });
});
