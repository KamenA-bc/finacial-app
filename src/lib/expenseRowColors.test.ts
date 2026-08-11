/**
 * Tests for getExpenseRowColors – verifies that every combination of the three
 * boolean flags (isWorkExpense, isWithKami, isWithOthers) produces the correct
 * and unique color pair.
 */

import { describe, it, expect } from 'vitest';
import { getExpenseRowColors } from '@/lib/expenseRowColors';

// ── Helpers ──────────────────────────────────────────────────────────────────

const allCombinations: {
    work: boolean;
    kami: boolean;
    others: boolean;
    label: string;
}[] = [
    { work: false, kami: false, others: false, label: 'none' },
    { work: true,  kami: false, others: false, label: 'work' },
    { work: false, kami: true,  others: false, label: 'kami' },
    { work: false, kami: false, others: true,  label: 'others' },
    { work: true,  kami: true,  others: false, label: 'work+kami' },
    { work: true,  kami: false, others: true,  label: 'work+others' },
    { work: false, kami: true,  others: true,  label: 'kami+others' },
    { work: true,  kami: true,  others: true,  label: 'work+kami+others' },
];

// ── Single-flag tests ────────────────────────────────────────────────────────

describe('getExpenseRowColors – single flags', () => {
    it('returns rose for no flags (default expense)', () => {
        const result = getExpenseRowColors(false, false, false);
        expect(result.amountColor).toBe('text-rose-500');
        expect(result.rowBg).toBe('');
    });

    it('returns amber for work-only expense', () => {
        const result = getExpenseRowColors(true, false, false);
        expect(result.amountColor).toBe('text-amber-500');
        expect(result.rowBg).toBe('bg-amber-50/80');
    });

    it('returns pink for kami-only expense', () => {
        const result = getExpenseRowColors(false, true, false);
        expect(result.amountColor).toBe('text-pink-500');
        expect(result.rowBg).toBe('bg-pink-50/80');
    });

    it('returns green for others-only expense', () => {
        const result = getExpenseRowColors(false, false, true);
        expect(result.amountColor).toBe('text-green-500');
        expect(result.rowBg).toBe('bg-green-50/80');
    });
});

// ── Two-flag blended tests ───────────────────────────────────────────────────

describe('getExpenseRowColors – two-flag blends', () => {
    it('returns purple for work + kami blend', () => {
        const result = getExpenseRowColors(true, true, false);
        expect(result.amountColor).toBe('text-purple-500');
        expect(result.rowBg).toBe('bg-purple-50/80');
    });

    it('returns lime for work + others blend', () => {
        const result = getExpenseRowColors(true, false, true);
        expect(result.amountColor).toBe('text-lime-500');
        expect(result.rowBg).toBe('bg-lime-50/80');
    });

    it('returns cyan for kami + others blend', () => {
        const result = getExpenseRowColors(false, true, true);
        expect(result.amountColor).toBe('text-cyan-500');
        expect(result.rowBg).toBe('bg-cyan-50/80');
    });
});

// ── Three-flag blend test ────────────────────────────────────────────────────

describe('getExpenseRowColors – three-flag blend', () => {
    it('returns violet for work + kami + others blend', () => {
        const result = getExpenseRowColors(true, true, true);
        expect(result.amountColor).toBe('text-violet-500');
        expect(result.rowBg).toBe('bg-violet-50/80');
    });
});

// ── Edge case: uniqueness ────────────────────────────────────────────────────

describe('getExpenseRowColors – uniqueness', () => {
    it('every flag combination produces a unique amountColor', () => {
        const colors = allCombinations.map(({ work, kami, others }) =>
            getExpenseRowColors(work, kami, others).amountColor,
        );
        const unique = new Set(colors);
        expect(unique.size).toBe(allCombinations.length);
    });

    it('every non-default flag combination produces a unique non-empty rowBg', () => {
        const withFlags = allCombinations.filter(
            (c) => c.work || c.kami || c.others,
        );
        const bgs = withFlags.map(({ work, kami, others }) =>
            getExpenseRowColors(work, kami, others).rowBg,
        );
        const unique = new Set(bgs);
        expect(unique.size).toBe(withFlags.length);
        bgs.forEach((bg) => expect(bg).not.toBe(''));
    });

    it('default (no flags) has empty rowBg', () => {
        const result = getExpenseRowColors(false, false, false);
        expect(result.rowBg).toBe('');
    });
});

// ── Edge case: return type shape ─────────────────────────────────────────────

describe('getExpenseRowColors – return shape', () => {
    it('always returns an object with amountColor and rowBg strings', () => {
        allCombinations.forEach(({ work, kami, others }) => {
            const result = getExpenseRowColors(work, kami, others);
            expect(result).toHaveProperty('amountColor');
            expect(result).toHaveProperty('rowBg');
            expect(typeof result.amountColor).toBe('string');
            expect(typeof result.rowBg).toBe('string');
            expect(result.amountColor.startsWith('text-')).toBe(true);
            if (result.rowBg) {
                expect(result.rowBg.startsWith('bg-')).toBe(true);
            }
        });
    });
});

// ── Edge case: idempotency ───────────────────────────────────────────────────

describe('getExpenseRowColors – idempotency', () => {
    it('returns the same result for the same inputs on repeated calls', () => {
        allCombinations.forEach(({ work, kami, others }) => {
            const a = getExpenseRowColors(work, kami, others);
            const b = getExpenseRowColors(work, kami, others);
            expect(a).toEqual(b);
        });
    });
});
