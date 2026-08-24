/**
 * PDF Export – generates a professional multi-page financial report.
 *
 * Architecture:
 *   - jsPDF is dynamically imported (zero impact on initial bundle)
 *   - Inter font (Regular + Bold) fetched from /fonts/ at export time, cached in-memory
 *   - All drawing is vector (text, rectangles, lines) — sharp at any zoom
 *   - Each "section" is a pure function that draws onto the document and advances ctx.y
 *
 * Layout: A4 portrait (210 × 297 mm), 20 mm margins, ~170 mm content width.
 */

import type { StatisticsData } from '@/hooks/useStatisticsData';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
    CHART_COLORS,
} from '@/lib/constants';
import { formatDisplayDate } from '@/lib/dateUtils';

// ── Types ────────────────────────────────────────────────────────────────────

/** Mutable drawing context threaded through every section drawer. */
interface DrawContext {
    doc: InstanceType<typeof import('jspdf').jsPDF>;
    /** Current vertical cursor position (mm from top). */
    y: number;
    year: number;
}

// ── Layout Constants ─────────────────────────────────────────────────────────

const PAGE = {
    width: 210,
    height: 297,
    margin: 20,
    get content() { return this.width - this.margin * 2; },  // 170 mm
    get bottom() { return this.height - this.margin; },       // 277 mm
} as const;

// ── Color Palette ────────────────────────────────────────────────────────────

const C = {
    emerald:  [5, 150, 105]   as const,  // income / positive
    rose:     [225, 29, 72]   as const,  // expenses / negative
    blue:     [37, 99, 235]   as const,  // neutral accent
    amber:    [217, 119, 6]   as const,  // highlights
    pink:     [236, 72, 153]  as const,  // kami
    gray800:  [31, 41, 55]    as const,  // headings
    gray600:  [75, 85, 99]    as const,  // body
    gray400:  [156, 163, 175] as const,  // labels
    gray200:  [229, 231, 235] as const,  // borders
    gray100:  [243, 244, 246] as const,  // card bg
    white:    [255, 255, 255] as const,
    barGreen: [110, 231, 183] as const,  // matches Recharts income bar
    barRed:   [253, 164, 175] as const,  // matches Recharts expense bar
    barBlue:  [147, 197, 253] as const,  // matches Recharts profit bar
    workBlue: [96, 165, 250]  as const,
    persGreen:[52, 211, 153]  as const,
    workAmber:[251, 191, 36]  as const,
    persRose: [251, 113, 133] as const,
} as const;

type RGB = readonly [number, number, number];

// ── Font Cache ───────────────────────────────────────────────────────────────

let fontCache: { regular: string; bold: string } | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function loadFonts(doc: DrawContext['doc']): Promise<void> {
    if (!fontCache) {
        const [regBuf, boldBuf] = await Promise.all([
            fetch('/fonts/Inter-Regular.ttf').then((r) => r.arrayBuffer()),
            fetch('/fonts/Inter-Bold.ttf').then((r) => r.arrayBuffer()),
        ]);
        fontCache = {
            regular: arrayBufferToBase64(regBuf),
            bold: arrayBufferToBase64(boldBuf),
        };
    }

    doc.addFileToVFS('Inter-Regular.ttf', fontCache.regular);
    doc.addFileToVFS('Inter-Bold.ttf', fontCache.bold);
    doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
    doc.addFont('Inter-Bold.ttf', 'Inter', 'bold');
    doc.setFont('Inter', 'normal');
}

// ── Formatting Helpers ───────────────────────────────────────────────────────

const fmtCurrency = (amount: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${Math.abs(amount).toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

const fmtSign = (amount: number, year: number): string =>
    `${amount >= 0 ? '+' : '−'}${fmtCurrency(amount, year)}`;

const fmtPercent = (value: number): string =>
    `${value >= 0 ? '' : '−'}${Math.abs(value).toFixed(1)}%`;

function hexToRgb(hex: string): RGB {
    const h = hex.replace('#', '');
    return [
        parseInt(h.substring(0, 2), 16),
        parseInt(h.substring(2, 4), 16),
        parseInt(h.substring(4, 6), 16),
    ];
}

// ── Drawing Primitives ───────────────────────────────────────────────────────

function setFill(ctx: DrawContext, color: RGB): void {
    ctx.doc.setFillColor(color[0], color[1], color[2]);
}

function setDraw(ctx: DrawContext, color: RGB): void {
    ctx.doc.setDrawColor(color[0], color[1], color[2]);
}

function setTextColor(ctx: DrawContext, color: RGB): void {
    ctx.doc.setTextColor(color[0], color[1], color[2]);
}

function setBold(ctx: DrawContext, size: number): void {
    ctx.doc.setFont('Inter', 'bold');
    ctx.doc.setFontSize(size);
}

function setNormal(ctx: DrawContext, size: number): void {
    ctx.doc.setFont('Inter', 'normal');
    ctx.doc.setFontSize(size);
}

/** Ensure enough vertical space; add a new page if not. Returns true if page was added. */
function ensureSpace(ctx: DrawContext, needed: number): boolean {
    if (ctx.y + needed > PAGE.bottom) {
        ctx.doc.addPage();
        ctx.y = PAGE.margin;
        return true;
    }
    return false;
}

/** Draw a rounded rectangle (filled). */
function roundedRect(
    ctx: DrawContext,
    x: number, y: number, w: number, h: number,
    r: number, fill: RGB
): void {
    setFill(ctx, fill);
    ctx.doc.roundedRect(x, y, w, h, r, r, 'F');
}

/** Draw a horizontal rule line. */
function hRule(ctx: DrawContext, y: number): void {
    setDraw(ctx, C.gray200);
    ctx.doc.setLineWidth(0.3);
    ctx.doc.line(PAGE.margin, y, PAGE.margin + PAGE.content, y);
}

// ── Section: Header ──────────────────────────────────────────────────────────

function drawHeader(ctx: DrawContext): void {
    const x = PAGE.margin;

    // Title
    setBold(ctx, 22);
    setTextColor(ctx, C.gray800);
    ctx.doc.text('Финансов отчет', x, ctx.y);
    ctx.y += 8;

    // Year badge
    setBold(ctx, 28);
    setTextColor(ctx, C.blue);
    ctx.doc.text(String(ctx.year), x, ctx.y);

    // Generation date (right-aligned)
    setNormal(ctx, 9);
    setTextColor(ctx, C.gray400);
    const dateStr = `Генериран: ${new Date().toLocaleDateString('bg-BG', {
        day: 'numeric', month: 'long', year: 'numeric',
    })}`;
    ctx.doc.text(dateStr, PAGE.margin + PAGE.content, ctx.y, { align: 'right' });

    ctx.y += 5;
    hRule(ctx, ctx.y);
    ctx.y += 8;
}

// ── Section: Overview KPIs ───────────────────────────────────────────────────

function drawOverviewKPIs(ctx: DrawContext, stats: StatisticsData): void {
    // Section title
    drawSectionTitle(ctx, 'ОБЩ ПРЕГЛЕД');

    const cardW = (PAGE.content - 6) / 2;    // 2 columns, 6mm gap
    const cardH = 26;
    const x = PAGE.margin;

    const cards = [
        { label: 'Общ приход',   value: `+${fmtCurrency(stats.totalIncome, ctx.year)}`,   color: C.emerald },
        { label: 'Общи разходи', value: `−${fmtCurrency(stats.totalExpenses, ctx.year)}`,  color: C.rose },
        { label: 'Нетна печалба', value: fmtSign(stats.netProfit, ctx.year),                 color: stats.netProfit >= 0 ? C.emerald : C.rose },
        { label: 'Спестявания',   value: fmtPercent(stats.savingsRate),                       color: stats.savingsRate >= 0 ? C.emerald : C.rose },
    ];

    for (let i = 0; i < cards.length; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = x + col * (cardW + 6);
        const cy = ctx.y + row * (cardH + 4);

        // Card background
        roundedRect(ctx, cx, cy, cardW, cardH, 2, C.gray100);

        // Accent bar (left edge)
        setFill(ctx, cards[i].color);
        ctx.doc.roundedRect(cx, cy, 2.5, cardH, 1.2, 1.2, 'F');

        // Label
        setNormal(ctx, 8);
        setTextColor(ctx, C.gray400);
        ctx.doc.text(cards[i].label.toUpperCase(), cx + 7, cy + 9);

        // Value
        setBold(ctx, 16);
        setTextColor(ctx, cards[i].color);
        ctx.doc.text(cards[i].value, cx + 7, cy + 20);
    }

    ctx.y += 2 * (cardH + 4) + 6;
}

// ── Section: Record Highlights ───────────────────────────────────────────────

function drawRecordHighlights(ctx: DrawContext, stats: StatisticsData): void {
    ensureSpace(ctx, 60);
    drawSectionTitle(ctx, 'РЕКОРДИ');

    const records = [
        { label: 'Най-печеливш месец', month: stats.biggestEarningMonth?.month, amount: stats.biggestEarningMonth?.amount, sign: '+', color: C.emerald },
        { label: 'Най-разходен месец', month: stats.biggestSpendingMonth?.month, amount: stats.biggestSpendingMonth?.amount, sign: '−', color: C.rose },
        { label: 'Най-добър месец',    month: stats.mostProfitableMonth?.month, amount: stats.mostProfitableMonth?.amount, sign: null, color: C.amber },
        { label: 'Най-лош месец',      month: stats.worstMonth?.month, amount: stats.worstMonth?.amount, sign: null, color: C.gray600 },
    ];

    const colW = (PAGE.content - 6) / 2;
    const rowH = 22;

    for (let i = 0; i < records.length; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const rx = PAGE.margin + col * (colW + 6);
        const ry = ctx.y + row * (rowH + 3);
        const r = records[i];

        roundedRect(ctx, rx, ry, colW, rowH, 2, C.gray100);

        // Label
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray400);
        ctx.doc.text(r.label.toUpperCase(), rx + 5, ry + 7);

        if (r.month && r.amount !== undefined) {
            // Month name
            setBold(ctx, 9);
            setTextColor(ctx, C.gray800);
            ctx.doc.text(r.month, rx + 5, ry + 13.5);

            // Amount
            setBold(ctx, 11);
            const amtColor = r.sign === '+' ? C.emerald : r.sign === '−' ? C.rose : (r.amount >= 0 ? C.emerald : C.rose);
            setTextColor(ctx, amtColor);
            const prefix = r.sign ?? (r.amount >= 0 ? '+' : '−');
            ctx.doc.text(`${prefix}${fmtCurrency(r.amount, ctx.year)}`, rx + 5, ry + 19);
        } else {
            setNormal(ctx, 8);
            setTextColor(ctx, C.gray400);
            ctx.doc.text('Няма данни', rx + 5, ry + 15);
        }
    }

    ctx.y += 2 * (rowH + 3) + 6;
}

// ── Section: Monthly Trends Bar Chart ────────────────────────────────────────

function drawMonthlyTrends(ctx: DrawContext, stats: StatisticsData): void {
    ctx.doc.addPage();
    ctx.y = PAGE.margin;
    drawSectionTitle(ctx, 'МЕСЕЧНИ ТЕНДЕНЦИИ');

    const data = stats.monthlyTrends;
    const chartX = PAGE.margin + 15;  // leave room for Y-axis labels
    const chartW = PAGE.content - 15;
    const chartH = 100;
    const chartBottom = ctx.y + chartH;

    // Find max value for scaling
    const allValues = data.flatMap((d) => [d.income, d.expenses, Math.abs(d.profit)]);
    const maxVal = Math.max(...allValues, 1);

    // Y-axis gridlines + labels
    const gridSteps = 5;
    setNormal(ctx, 7);
    for (let i = 0; i <= gridSteps; i++) {
        const gy = ctx.y + (chartH / gridSteps) * i;
        const val = maxVal - (maxVal / gridSteps) * i;

        // Gridline
        setDraw(ctx, C.gray200);
        ctx.doc.setLineWidth(0.15);
        ctx.doc.line(chartX, gy, chartX + chartW, gy);

        // Label
        setTextColor(ctx, C.gray400);
        const label = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0);
        ctx.doc.text(label, chartX - 2, gy + 1, { align: 'right' });
    }

    // Bars
    const groupW = chartW / 12;
    const barW = groupW * 0.22;
    const barGap = 1;
    const colors: RGB[] = [C.barGreen, C.barRed, C.barBlue];

    for (let m = 0; m < 12; m++) {
        const point = data[m];
        const values = [point.income, point.expenses, Math.abs(point.profit)];
        const groupX = chartX + m * groupW;

        // Month label below
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray400);
        ctx.doc.text(point.month, groupX + groupW / 2, chartBottom + 5, { align: 'center' });

        for (let b = 0; b < 3; b++) {
            const barH = maxVal > 0 ? (values[b] / maxVal) * chartH : 0;
            if (barH < 0.5) continue;

            const bx = groupX + (groupW - 3 * barW - 2 * barGap) / 2 + b * (barW + barGap);
            const by = chartBottom - barH;

            setFill(ctx, colors[b]);
            ctx.doc.rect(bx, by, barW, barH, 'F');
        }
    }

    ctx.y = chartBottom + 10;

    // Legend
    const legendItems = [
        { label: 'Приход', color: C.barGreen },
        { label: 'Разход', color: C.barRed },
        { label: 'Печалба', color: C.barBlue },
    ];
    const legendX = PAGE.margin + PAGE.content / 2 - 30;
    legendItems.forEach((item, i) => {
        const lx = legendX + i * 28;
        setFill(ctx, item.color);
        ctx.doc.circle(lx, ctx.y, 1.5, 'F');
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray600);
        ctx.doc.text(item.label, lx + 3, ctx.y + 1);
    });

    ctx.y += 12;
}

// ── Section: Category Ranking ────────────────────────────────────────────────

function drawCategoryRanking(ctx: DrawContext, stats: StatisticsData): void {
    ensureSpace(ctx, 80);
    drawSectionTitle(ctx, 'НАВИЦИ ЗА ХАРЧЕНЕ');

    if (stats.categoryRanking.length === 0) {
        setNormal(ctx, 10);
        setTextColor(ctx, C.gray400);
        ctx.doc.text('Няма разходи за тази година', PAGE.margin, ctx.y);
        ctx.y += 10;
        return;
    }

    const maxAmt = stats.categoryRanking[0].amount;
    const barMaxW = 85;  // max width for the horizontal bar
    const rowH = 7;

    // Top category highlight
    if (stats.topCategory) {
        roundedRect(ctx, PAGE.margin, ctx.y, PAGE.content, 18, 2, C.gray100);
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray400);
        ctx.doc.text('ТОП КАТЕГОРИЯ', PAGE.margin + 5, ctx.y + 6);
        setBold(ctx, 10);
        setTextColor(ctx, C.gray800);
        ctx.doc.text(stats.topCategory.displayName, PAGE.margin + 5, ctx.y + 13);
        setBold(ctx, 12);
        setTextColor(ctx, C.rose);
        ctx.doc.text(`−${fmtCurrency(stats.topCategory.amount, ctx.year)}`, PAGE.margin + PAGE.content - 5, ctx.y + 13, { align: 'right' });
        ctx.y += 22;
    }

    // Horizontal bars
    for (let i = 0; i < stats.categoryRanking.length; i++) {
        ensureSpace(ctx, rowH + 2);
        const cat = stats.categoryRanking[i];
        const barW = maxAmt > 0 ? (cat.amount / maxAmt) * barMaxW : 0;

        // Category name
        setNormal(ctx, 8);
        setTextColor(ctx, C.gray600);
        ctx.doc.text(cat.displayName, PAGE.margin, ctx.y + 4.5);

        // Bar
        const barX = PAGE.margin + 55;
        setFill(ctx, hexToRgb(CHART_COLORS[i % CHART_COLORS.length]));
        ctx.doc.roundedRect(barX, ctx.y, Math.max(barW, 1), 5, 1, 1, 'F');

        // Amount
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray600);
        ctx.doc.text(
            fmtCurrency(cat.amount, ctx.year),
            PAGE.margin + PAGE.content,
            ctx.y + 4.5,
            { align: 'right' }
        );

        ctx.y += rowH;
    }

    ctx.y += 5;

    // Metrics row
    hRule(ctx, ctx.y);
    ctx.y += 5;

    const metrics = [
        { label: 'Ср. разход', value: fmtCurrency(stats.avgExpensePerTransaction, ctx.year) },
        { label: 'Всички', value: String(stats.totalTransactionCount) },
        { label: 'Приходи', value: String(stats.incomeTransactionCount), color: C.emerald },
        { label: 'Разходи', value: String(stats.expenseTransactionCount), color: C.rose },
    ];

    const metricW = PAGE.content / 4;
    metrics.forEach((m, i) => {
        const mx = PAGE.margin + i * metricW;
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray400);
        ctx.doc.text(m.label, mx, ctx.y);
        setBold(ctx, 10);
        setTextColor(ctx, m.color ?? C.gray800);
        ctx.doc.text(m.value, mx, ctx.y + 6);
    });

    ctx.y += 14;
}

// ── Section: Income Breakdown ────────────────────────────────────────────────

function drawIncomeBreakdown(ctx: DrawContext, stats: StatisticsData): void {
    ensureSpace(ctx, 50);
    drawSectionTitle(ctx, 'РАБОТНИ / ЛИЧНИ');

    const splits = [
        {
            label: 'Приходи',
            work: stats.workIncome,
            personal: stats.personalIncome,
            workColor: C.workBlue,
            persColor: C.persGreen,
        },
        {
            label: 'Разходи',
            work: stats.workExpenses,
            personal: stats.personalExpenses,
            workColor: C.workAmber,
            persColor: C.persRose,
        },
    ];

    for (const split of splits) {
        const total = split.work + split.personal;
        const workPct = total > 0 ? (split.work / total) * 100 : 0;
        const persPct = total > 0 ? (split.personal / total) * 100 : 0;

        setNormal(ctx, 8);
        setTextColor(ctx, C.gray600);
        ctx.doc.text(split.label.toUpperCase(), PAGE.margin, ctx.y);
        ctx.y += 4;

        if (total === 0) {
            setNormal(ctx, 8);
            setTextColor(ctx, C.gray400);
            ctx.doc.text('Няма данни', PAGE.margin, ctx.y + 3);
            ctx.y += 10;
            continue;
        }

        // Progress bar background
        const barH = 5;
        roundedRect(ctx, PAGE.margin, ctx.y, PAGE.content, barH, 2, C.gray200);

        // Work segment
        if (workPct > 0) {
            const wW = (workPct / 100) * PAGE.content;
            setFill(ctx, split.workColor);
            ctx.doc.roundedRect(PAGE.margin, ctx.y, Math.max(wW, 2), barH, 2, 2, 'F');
        }
        // Personal segment (drawn from right)
        if (persPct > 0 && workPct < 100) {
            const pW = (persPct / 100) * PAGE.content;
            setFill(ctx, split.persColor);
            ctx.doc.roundedRect(PAGE.margin + PAGE.content - pW, ctx.y, pW, barH, 2, 2, 'F');
        }

        ctx.y += barH + 3;

        // Labels below the bar
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray600);
        ctx.doc.text(`Работни: ${fmtCurrency(split.work, ctx.year)} (${workPct.toFixed(0)}%)`, PAGE.margin, ctx.y + 1);
        ctx.doc.text(`Лични: ${fmtCurrency(split.personal, ctx.year)} (${persPct.toFixed(0)}%)`, PAGE.margin + PAGE.content, ctx.y + 1, { align: 'right' });

        ctx.y += 8;
    }

    ctx.y += 4;
}

// ── Section: Fun Facts ───────────────────────────────────────────────────────

function drawFunFacts(ctx: DrawContext, stats: StatisticsData): void {
    ensureSpace(ctx, 45);
    drawSectionTitle(ctx, 'ИНТЕРЕСНИ ФАКТИ');

    const facts = [
        {
            label: '❤️',
            value: stats.kamiSpending > 0 ? `−${fmtCurrency(stats.kamiSpending, ctx.year)}` : '—',
            sub: stats.kamiSpending > 0 ? 'общо за годината' : 'Няма маркирани',
            color: stats.kamiSpending > 0 ? C.pink : C.gray400,
        },
        {
            label: 'Най-скъп ден',
            value: stats.biggestSpendingDay ? `−${fmtCurrency(stats.biggestSpendingDay.amount, ctx.year)}` : '—',
            sub: stats.biggestSpendingDay ? formatDisplayDate(stats.biggestSpendingDay.date) : undefined,
            color: C.rose,
        },
        {
            label: 'Среден дневен разход',
            value: fmtCurrency(stats.avgDailyExpense, ctx.year),
            sub: `${stats.activeDays} активни дни`,
            color: C.blue,
        },
    ];

    const colW = (PAGE.content - 8) / 3;

    for (let i = 0; i < facts.length; i++) {
        const fx = PAGE.margin + i * (colW + 4);
        const f = facts[i];

        roundedRect(ctx, fx, ctx.y, colW, 28, 2, C.gray100);

        // Label
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray400);
        ctx.doc.text(f.label.toUpperCase(), fx + 4, ctx.y + 7);

        // Value
        setBold(ctx, 12);
        setTextColor(ctx, f.color);
        ctx.doc.text(f.value, fx + 4, ctx.y + 16);

        // Subtext
        if (f.sub) {
            setNormal(ctx, 6.5);
            setTextColor(ctx, C.gray400);
            ctx.doc.text(f.sub, fx + 4, ctx.y + 22);
        }
    }

    ctx.y += 34;
}

// ── Section Title Helper ─────────────────────────────────────────────────────

function drawSectionTitle(ctx: DrawContext, title: string): void {
    setBold(ctx, 9);
    setTextColor(ctx, C.gray400);
    ctx.doc.text(title, PAGE.margin, ctx.y);
    ctx.y += 6;
}

// ── Page Footer ──────────────────────────────────────────────────────────────

function drawPageFooters(ctx: DrawContext): void {
    const totalPages = ctx.doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        ctx.doc.setPage(p);
        setNormal(ctx, 7);
        setTextColor(ctx, C.gray400);
        ctx.doc.text(
            `Страница ${p} от ${totalPages}`,
            PAGE.width / 2,
            PAGE.height - 10,
            { align: 'center' }
        );
    }
}

// ── Main Export Function ─────────────────────────────────────────────────────

/**
 * Generate and download a full-year financial report PDF.
 * jsPDF is dynamically imported — zero impact on initial bundle.
 */
export async function exportToPdf(
    stats: StatisticsData,
    year: number
): Promise<void> {
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const ctx: DrawContext = { doc, y: PAGE.margin, year };

    await loadFonts(doc);

    // Page 1: Header + KPIs + Records
    drawHeader(ctx);
    drawOverviewKPIs(ctx, stats);
    drawRecordHighlights(ctx, stats);

    // Page 2: Monthly Trends (always starts on new page for chart clarity)
    drawMonthlyTrends(ctx, stats);

    // Page 3: Spending Habits + Income Breakdown + Fun Facts
    drawCategoryRanking(ctx, stats);
    drawIncomeBreakdown(ctx, stats);
    drawFunFacts(ctx, stats);

    // Footers on every page
    drawPageFooters(ctx);

    const fileName = `finance-report-${year}.pdf`;
    doc.save(fileName);
}
