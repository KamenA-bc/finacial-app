/**
 * Tests for the CSV export utility.
 * Validates correct handling of the isWithOthers field for expense entries
 * and verifies income entries omit it (empty string).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { IncomeEntry, ExpenseEntry } from '@/types';

let capturedCsvContent = '';

beforeEach(() => {
    capturedCsvContent = '';

    const OrigBlob = globalThis.Blob;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (vi.spyOn(globalThis, 'Blob' as any) as any).mockImplementation(
        function MockBlob(parts: string[]) {
            capturedCsvContent = parts.join('');
            return new OrigBlob(parts, { type: 'text/csv;charset=utf-8;' });
        },
    );

    const mockLink = { href: '', download: '', click: vi.fn() };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
});

afterEach(() => {
    vi.restoreAllMocks();
});

const today = new Date().toISOString().slice(0, 10);

const makeIncome = (overrides: Partial<IncomeEntry> = {}): IncomeEntry => ({
    id: 'inc-1',
    date: today,
    amount: 100,
    description: 'Test income',
    isWorkIncome: false,
    isWithKami: false,
    ...overrides,
});

const makeExpense = (overrides: Partial<ExpenseEntry> = {}): ExpenseEntry => ({
    id: 'exp-1',
    date: today,
    amount: 50,
    description: 'Test expense',
    category: 'Други',
    isWorkExpense: false,
    isWithKami: false,
    isWithOthers: false,
    ...overrides,
});

import { exportToCsv } from '@/lib/csvExport';

describe('CSV export – isWithOthers column', () => {
    it('includes "С Други" header in CSV', () => {
        exportToCsv([], [makeExpense()]);
        const headerLine = capturedCsvContent.split('\n')[0];
        expect(headerLine).toContain('С Други');
    });

    it('marks "Да" when expense isWithOthers is true', () => {
        exportToCsv([], [makeExpense({ isWithOthers: true })]);
        const dataLine = capturedCsvContent.split('\n')[1];
        const fields = dataLine.split(',');
        expect(fields[fields.length - 1]).toBe('Да');
    });

    it('marks "Не" when expense isWithOthers is false', () => {
        exportToCsv([], [makeExpense({ isWithOthers: false })]);
        const dataLine = capturedCsvContent.split('\n')[1];
        const fields = dataLine.split(',');
        expect(fields[fields.length - 1]).toBe('Не');
    });

    it('income rows have empty string for isWithOthers column', () => {
        exportToCsv([makeIncome()], []);
        const dataLine = capturedCsvContent.split('\n')[1];
        const fields = dataLine.split(',');
        expect(fields[fields.length - 1]).toBe('');
    });

    it('correctly exports all flag combinations for expenses', () => {
        const expenses = [
            makeExpense({ id: 'e1', isWorkExpense: false, isWithKami: false, isWithOthers: false }),
            makeExpense({ id: 'e2', isWorkExpense: true,  isWithKami: false, isWithOthers: false }),
            makeExpense({ id: 'e3', isWorkExpense: false, isWithKami: true,  isWithOthers: false }),
            makeExpense({ id: 'e4', isWorkExpense: false, isWithKami: false, isWithOthers: true }),
            makeExpense({ id: 'e5', isWorkExpense: true,  isWithKami: true,  isWithOthers: true }),
        ];
        exportToCsv([], expenses);

        const lines = capturedCsvContent.split('\n');
        expect(lines.length).toBe(6);
        expect(lines[1]).toContain('Не,Не,Не');
        expect(lines[2]).toContain('Да,Не,Не');
        expect(lines[3]).toContain('Не,Да,Не');
        expect(lines[4]).toContain('Не,Не,Да');
        expect(lines[5]).toContain('Да,Да,Да');
    });
});

describe('CSV export – escaping edge cases', () => {
    it('escapes descriptions containing commas', () => {
        exportToCsv([], [makeExpense({ description: 'food, drinks' })]);
        const dataLine = capturedCsvContent.split('\n')[1];
        expect(dataLine).toContain('"food, drinks"');
    });

    it('escapes descriptions containing quotes', () => {
        exportToCsv([], [makeExpense({ description: 'a "special" item' })]);
        const dataLine = capturedCsvContent.split('\n')[1];
        expect(dataLine).toContain('"a ""special"" item"');
    });

    it('handles empty expense and income arrays', () => {
        exportToCsv([], []);
        const lines = capturedCsvContent.split('\n');
        expect(lines.length).toBe(1);
        expect(lines[0]).toContain('Дата');
    });
});

describe('CSV export – mixed income and expenses', () => {
    it('includes both income and expense rows', () => {
        exportToCsv([makeIncome()], [makeExpense()]);
        const lines = capturedCsvContent.split('\n');
        expect(lines.length).toBe(3);
    });

    it('includes both ❤️ and С Други columns', () => {
        exportToCsv([makeIncome()], [makeExpense()]);
        const header = capturedCsvContent.split('\n')[0];
        expect(header).toContain('❤️');
        expect(header).toContain('С Други');
    });
});
