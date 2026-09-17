/**
 * Parser for receipt QR codes.
 * Primarily handles the standard Bulgarian NRA (Национална агенция по приходите / Наредба № Н-18)
 * fiscal receipt 2D barcode format:
 *   <FMIN>*<DOC_NUM_OR_UNP>*<YYYY-MM-DD>*<HH:MM:SS>*<TOTAL_AMOUNT>
 * Also provides fallback parsing for digital receipt URLs with query parameters.
 */

export interface ParsedReceiptQr {
    amount: number;
    /** ISO date string: YYYY-MM-DD */
    date: string;
    /** Time string: HH:MM:SS or HH:MM */
    time?: string;
    /** Receipt document number or UNP */
    docNumber?: string;
    /** Fiscal memory identification number */
    fmin?: string;
    /** Raw unparsed QR text */
    rawText: string;
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}(?::\d{2})?$/;

/**
 * Validates whether an ISO date string is a real calendar date.
 */
function isValidDate(dateStr: string): boolean {
    if (!ISO_DATE_REGEX.test(dateStr)) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    if (year < 2000 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const d = new Date(year, month - 1, day);
    return (
        d.getFullYear() === year &&
        d.getMonth() === month - 1 &&
        d.getDate() === day
    );
}

/**
 * Parses numeric amount supporting both dot (.) and comma (,) decimals.
 */
function parseAmount(amountStr: string): number | null {
    if (!amountStr) return null;
    const cleaned = amountStr.trim().replace(',', '.');
    const num = parseFloat(cleaned);
    if (isNaN(num) || num <= 0 || !isFinite(num)) return null;
    return Math.round(num * 100) / 100;
}

/**
 * Attempts to parse standard Bulgarian fiscal cash register QR string.
 * Standard format: FMIN*DOC_NUM*YYYY-MM-DD*HH:MM:SS*AMOUNT (may have extra trailing fields)
 */
function parseBulgarianFiscalQr(rawText: string): ParsedReceiptQr | null {
    const trimmed = rawText.trim();
    if (!trimmed.includes('*')) return null;

    const parts = trimmed.split('*');
    if (parts.length < 5) return null;

    const fmin = parts[0].trim();
    const docNumber = parts[1].trim();
    const dateStr = parts[2].trim();
    const timeStr = parts[3].trim();
    const amountStr = parts[4].trim();

    if (!isValidDate(dateStr)) return null;

    const amount = parseAmount(amountStr);
    if (amount === null) return null;

    return {
        amount,
        date: dateStr,
        time: TIME_REGEX.test(timeStr) ? timeStr : undefined,
        docNumber: docNumber || undefined,
        fmin: fmin || undefined,
        rawText,
    };
}

/**
 * Fallback parser for digital receipt URLs containing query parameters (e.g. ?total=45.89&date=2026-09-17).
 */
function parseUrlReceipt(rawText: string): ParsedReceiptQr | null {
    const trimmed = rawText.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return null;
    }

    try {
        const url = new URL(trimmed);
        const params = url.searchParams;

        const amountParam =
            params.get('total') ||
            params.get('amount') ||
            params.get('sum') ||
            params.get('cena') ||
            params.get('suma');

        if (!amountParam) return null;

        const amount = parseAmount(amountParam);
        if (amount === null) return null;

        let dateStr = params.get('date') || params.get('data');
        if (!dateStr || !isValidDate(dateStr)) {
            // Default to today's date if URL provides amount but not valid date
            dateStr = new Date().toISOString().slice(0, 10);
        }

        return {
            amount,
            date: dateStr,
            rawText,
        };
    } catch {
        return null;
    }
}

/**
 * Main parser entrypoint. Tries Bulgarian fiscal format first, then URL fallback.
 */
export function parseReceiptQr(rawText: string | null | undefined): ParsedReceiptQr | null {
    if (!rawText || typeof rawText !== 'string') return null;

    // 1. Primary: Bulgarian NRA Fiscal format
    const fiscalResult = parseBulgarianFiscalQr(rawText);
    if (fiscalResult) return fiscalResult;

    // 2. Secondary: URL query param format
    const urlResult = parseUrlReceipt(rawText);
    if (urlResult) return urlResult;

    return null;
}
