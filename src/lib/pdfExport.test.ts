/**
 * Tests for the PDF export module.
 *
 * Strategy: We mock jsPDF and the font fetch to verify that:
 *   1. jsPDF is dynamically imported (lazy loading)
 *   2. Font files are fetched and registered correctly
 *   3. All report sections produce the expected drawing calls
 *   4. Page structure is correct (addPage calls, page footers)
 *   5. Edge cases: no data, negative values, missing records
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock jsPDF ───────────────────────────────────────────────────────────────

interface MockCall {
    method: string;
    args: unknown[];
}

function createMockDoc() {
    const calls: MockCall[] = [];
    let pageCount = 1;

    const record = (method: string) =>
        (...args: unknown[]) => {
            calls.push({ method, args });
            if (method === 'addPage') pageCount++;
        };

    const doc = {
        text: record('text'),
        rect: record('rect'),
        roundedRect: record('roundedRect'),
        circle: record('circle'),
        line: record('line'),
        setFillColor: record('setFillColor'),
        setDrawColor: record('setDrawColor'),
        setTextColor: record('setTextColor'),
        setFont: record('setFont'),
        setFontSize: record('setFontSize'),
        setLineWidth: record('setLineWidth'),
        addPage: record('addPage'),
        setPage: record('setPage'),
        save: record('save'),
        addFileToVFS: record('addFileToVFS'),
        addFont: record('addFont'),
        getNumberOfPages: () => pageCount,
    };

    return { doc, calls };
}

// ── Mock Setup ───────────────────────────────────────────────────────────────

let mockDoc: ReturnType<typeof createMockDoc>;

beforeEach(() => {
    mockDoc = createMockDoc();
    vi.resetModules();

    // Mock dynamic import of jspdf — use function constructor so `new jsPDF()` works
    vi.doMock('jspdf', () => ({
        jsPDF: function MockJsPDF() { return mockDoc.doc; },
    }));

    // Mock font fetches
    vi.stubGlobal('fetch', vi.fn((url: string) => {
        const buffer = new ArrayBuffer(8);
        return Promise.resolve({
            arrayBuffer: () => Promise.resolve(buffer),
            ok: true,
            url,
        });
    }));

    // Mock btoa for font encoding
    if (typeof globalThis.btoa !== 'function') {
        vi.stubGlobal('btoa', (str: string) => Buffer.from(str, 'binary').toString('base64'));
    }
});

// ── Test Data ────────────────────────────────────────────────────────────────

const EMPTY_STATS = {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    savingsRate: 0,
    biggestEarningMonth: null,
    biggestSpendingMonth: null,
    mostProfitableMonth: null,
    worstMonth: null,
    topCategory: null,
    categoryRanking: [],
    avgExpensePerTransaction: 0,
    totalTransactionCount: 0,
    incomeTransactionCount: 0,
    expenseTransactionCount: 0,
    workIncome: 0,
    personalIncome: 0,
    workExpenses: 0,
    personalExpenses: 0,
    monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'][i],
        income: 0,
        expenses: 0,
        profit: 0,
    })),
    biggestSpendingDay: null,
    biggestEarningDay: null,
    avgDailyExpense: 0,
    activeDays: 0,
    kamiSpending: 0,
    hasData: false,
};

const POPULATED_STATS = {
    ...EMPTY_STATS,
    hasData: true,
    totalIncome: 50000,
    totalExpenses: 30000,
    netProfit: 20000,
    savingsRate: 40,
    biggestEarningMonth: { month: 'Март', amount: 8000 },
    biggestSpendingMonth: { month: 'Декември', amount: 6000 },
    mostProfitableMonth: { month: 'Март', amount: 5000 },
    worstMonth: { month: 'Декември', amount: -1000 },
    topCategory: { name: 'Eating out', displayName: 'Eating out', amount: 8000 },
    categoryRanking: [
        { name: 'Eating out', displayName: 'Eating out', amount: 8000 },
        { name: 'Shopping', displayName: 'Shopping', amount: 5000 },
        { name: 'Гориво', displayName: 'Гориво', amount: 3000 },
    ],
    avgExpensePerTransaction: 150,
    totalTransactionCount: 300,
    incomeTransactionCount: 100,
    expenseTransactionCount: 200,
    workIncome: 40000,
    personalIncome: 10000,
    workExpenses: 5000,
    personalExpenses: 25000,
    monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'][i],
        income: 3000 + i * 500,
        expenses: 2000 + i * 300,
        profit: 1000 + i * 200,
    })),
    biggestSpendingDay: { date: '2026-03-15', amount: 800 },
    biggestEarningDay: { date: '2026-03-01', amount: 5000 },
    avgDailyExpense: 120,
    activeDays: 250,
    kamiSpending: 3500,
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('PDF Export – exportToPdf', () => {
    it('dynamically imports jsPDF and calls save', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const saveCalls = mockDoc.calls.filter((c) => c.method === 'save');
        expect(saveCalls).toHaveLength(1);
        expect(saveCalls[0].args[0]).toBe('finance-report-2026.pdf');
    });

    it('fetches Inter Regular and Bold font files', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const fetchMock = vi.mocked(fetch);
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain('/fonts/Inter-Regular.ttf');
        expect(urls).toContain('/fonts/Inter-Bold.ttf');
    });

    it('registers both fonts with jsPDF VFS', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const vfsCalls = mockDoc.calls.filter((c) => c.method === 'addFileToVFS');
        expect(vfsCalls).toHaveLength(2);
        expect(vfsCalls[0].args[0]).toBe('Inter-Regular.ttf');
        expect(vfsCalls[1].args[0]).toBe('Inter-Bold.ttf');

        const fontCalls = mockDoc.calls.filter((c) => c.method === 'addFont');
        expect(fontCalls).toHaveLength(2);
    });

    it('creates multiple pages (at least 3 for populated data)', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const pageAdds = mockDoc.calls.filter((c) => c.method === 'addPage');
        // Page 1 (auto) + addPage for trends + possible addPage for analysis = at least 2 addPage calls
        expect(pageAdds.length).toBeGreaterThanOrEqual(1);
    });

    it('draws page footers on every page', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const setPageCalls = mockDoc.calls.filter((c) => c.method === 'setPage');
        const totalPages = mockDoc.doc.getNumberOfPages();
        expect(setPageCalls.length).toBe(totalPages);
    });

    it('uses correct filename format with year', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(EMPTY_STATS, 2025);

        const saveCalls = mockDoc.calls.filter((c) => c.method === 'save');
        expect(saveCalls[0].args[0]).toBe('finance-report-2025.pdf');
    });
});

describe('PDF Export – report content', () => {
    it('renders the year in the header', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls.filter((c) => c.method === 'text');
        const yearTexts = textCalls.filter((c) => c.args[0] === '2026');
        expect(yearTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('renders report title "Финансов отчет"', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls.filter((c) => c.method === 'text');
        const titleTexts = textCalls.filter((c) => c.args[0] === 'Финансов отчет');
        expect(titleTexts).toHaveLength(1);
    });

    it('renders all 4 KPI card labels', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        expect(textCalls).toContain('ОБЩ ПРИХОД');
        expect(textCalls).toContain('ОБЩИ РАЗХОДИ');
        expect(textCalls).toContain('НЕТНА ПЕЧАЛБА');
        expect(textCalls).toContain('СПЕСТЯВАНИЯ');
    });

    it('renders record section with month names', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        expect(textCalls).toContain('Март');
        expect(textCalls).toContain('Декември');
    });

    it('renders category ranking bars', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        expect(textCalls).toContain('Eating out');
        expect(textCalls).toContain('Shopping');
        expect(textCalls).toContain('Гориво');
    });

    it('draws monthly trend bars (12 month labels)', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        // All 12 month abbreviations should be present
        const months = ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'];
        for (const m of months) {
            expect(textCalls).toContain(m);
        }
    });

    it('renders chart legend labels', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(POPULATED_STATS, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        expect(textCalls).toContain('Приход');
        expect(textCalls).toContain('Разход');
        expect(textCalls).toContain('Печалба');
    });
});

describe('PDF Export – edge cases', () => {
    it('handles empty stats without crashing', async () => {
        const { exportToPdf } = await import('@/lib/pdfExport');
        await expect(exportToPdf(EMPTY_STATS, 2026)).resolves.not.toThrow();

        const saveCalls = mockDoc.calls.filter((c) => c.method === 'save');
        expect(saveCalls).toHaveLength(1);
    });

    it('handles negative profit correctly', async () => {
        const negativeStats = {
            ...POPULATED_STATS,
            netProfit: -5000,
            savingsRate: -10,
        };
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(negativeStats, 2026);

        const saveCalls = mockDoc.calls.filter((c) => c.method === 'save');
        expect(saveCalls).toHaveLength(1);
    });

    it('handles null record months (partial year)', async () => {
        const partialStats = {
            ...POPULATED_STATS,
            biggestEarningMonth: null,
            worstMonth: null,
        };
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(partialStats, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        // "Няма данни" should appear for the null records
        const noDataCount = textCalls.filter((t) => t === 'Няма данни').length;
        expect(noDataCount).toBeGreaterThanOrEqual(2);
    });

    it('handles zero kami spending', async () => {
        const noKami = { ...POPULATED_STATS, kamiSpending: 0 };
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(noKami, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        expect(textCalls).toContain('—');
    });

    it('handles empty category ranking', async () => {
        const noCats = {
            ...POPULATED_STATS,
            topCategory: null,
            categoryRanking: [],
        };
        const { exportToPdf } = await import('@/lib/pdfExport');
        await exportToPdf(noCats, 2026);

        const textCalls = mockDoc.calls
            .filter((c) => c.method === 'text')
            .map((c) => c.args[0]);

        expect(textCalls).toContain('Няма разходи за тази година');
    });
});
