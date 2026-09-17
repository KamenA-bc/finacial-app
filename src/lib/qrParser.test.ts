import { describe, it, expect } from 'vitest';
import { parseReceiptQr } from './qrParser';

describe('qrParser', () => {
    describe('Bulgarian NRA Fiscal Receipts (Наредба Н-18)', () => {
        it('correctly parses standard 5-part fiscal QR string', () => {
            const raw = '01234567*0000000123456789*2026-09-17*14:32:10*45.89';
            const result = parseReceiptQr(raw);

            expect(result).not.toBeNull();
            expect(result?.amount).toBe(45.89);
            expect(result?.date).toBe('2026-09-17');
            expect(result?.time).toBe('14:32:10');
            expect(result?.docNumber).toBe('0000000123456789');
            expect(result?.fmin).toBe('01234567');
        });

        it('handles Bulgarian UNP strings with hyphens in the document number', () => {
            const raw = 'DT512943*12345678-0001-0000001*2026-04-12*09:15:00*120.50';
            const result = parseReceiptQr(raw);

            expect(result).not.toBeNull();
            expect(result?.amount).toBe(120.5);
            expect(result?.date).toBe('2026-04-12');
            expect(result?.docNumber).toBe('12345678-0001-0000001');
            expect(result?.fmin).toBe('DT512943');
        });

        it('handles comma as decimal separator', () => {
            const raw = '01234567*123*2026-01-05*18:00:00*45,99';
            const result = parseReceiptQr(raw);

            expect(result).not.toBeNull();
            expect(result?.amount).toBe(45.99);
            expect(result?.date).toBe('2026-01-05');
        });

        it('handles fiscal strings with extra trailing fields (e.g. VAT breakdown or hash)', () => {
            const raw = '01234567*123*2026-03-20*11:22:33*89.00*20*XYZHASH';
            const result = parseReceiptQr(raw);

            expect(result).not.toBeNull();
            expect(result?.amount).toBe(89);
            expect(result?.date).toBe('2026-03-20');
            expect(result?.time).toBe('11:22:33');
        });

        it('rejects strings with invalid calendar dates', () => {
            const raw = '01234567*123*2026-02-31*12:00:00*50.00';
            expect(parseReceiptQr(raw)).toBeNull();
        });

        it('rejects strings with negative or zero amounts', () => {
            expect(parseReceiptQr('01234567*123*2026-09-17*12:00:00*0.00')).toBeNull();
            expect(parseReceiptQr('01234567*123*2026-09-17*12:00:00*-15.00')).toBeNull();
            expect(parseReceiptQr('01234567*123*2026-09-17*12:00:00*invalid')).toBeNull();
        });
    });

    describe('URL fallback format', () => {
        it('parses URLs with total and date query parameters', () => {
            const raw = 'https://receipts.example.com/check?total=18.40&date=2026-08-01';
            const result = parseReceiptQr(raw);

            expect(result).not.toBeNull();
            expect(result?.amount).toBe(18.4);
            expect(result?.date).toBe('2026-08-01');
        });

        it('parses URLs with amount query parameter and comma decimal', () => {
            const raw = 'https://store.bg/receipt?amount=99,90';
            const result = parseReceiptQr(raw);

            expect(result).not.toBeNull();
            expect(result?.amount).toBe(99.9);
            expect(result?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('Invalid inputs', () => {
        it('returns null for empty, undefined, or random text', () => {
            expect(parseReceiptQr('')).toBeNull();
            expect(parseReceiptQr(null)).toBeNull();
            expect(parseReceiptQr(undefined)).toBeNull();
            expect(parseReceiptQr('Hello world')).toBeNull();
            expect(parseReceiptQr('WIFI:S:MyNetwork;T:WPA;P:secret;;')).toBeNull();
        });
    });
});
