/**
 * Expense row color utility.
 * Determines amount text color and row background based on the combination
 * of boolean flags: isWorkExpense, isWithKami, isWithOthers.
 *
 * Each single flag has a primary color. Combinations use blended colors
 * derived from a color-wheel midpoint approach:
 *
 *   Work   = amber   (~45°)
 *   Kami   = pink    (~330°)
 *   Others = green   (~120°)
 *
 * Blends:
 *   Work + Kami           = purple  (existing convention from repo)
 *   Work + Others         = lime    (amber↔green midpoint)
 *   Kami + Others         = cyan    (pink↔green midpoint)
 *   Work + Kami + Others  = violet  (three-way midpoint)
 *   None                  = rose    (default expense)
 */

export interface ExpenseRowColors {
    /** Tailwind text color class for the amount. */
    readonly amountColor: string;
    /** Tailwind background class for the row (empty string = no highlight). */
    readonly rowBg: string;
}

/**
 * Build a 3-bit key from the three boolean flags for easy switch matching.
 * Bit layout: [isWorkExpense][isWithKami][isWithOthers]
 */
const flagKey = (work: boolean, kami: boolean, others: boolean): number =>
    (work ? 4 : 0) | (kami ? 2 : 0) | (others ? 1 : 0);

/**
 * Return the amount color and row background classes for an expense entry
 * based on its boolean flags.
 */
export const getExpenseRowColors = (
    isWorkExpense: boolean,
    isWithKami: boolean,
    isWithOthers: boolean,
): ExpenseRowColors => {
    switch (flagKey(isWorkExpense, isWithKami, isWithOthers)) {
        // ── Single flags ──────────────────────────────────────────────
        case 4: // Work only
            return { amountColor: 'text-amber-500', rowBg: 'bg-amber-50/60' };
        case 2: // Kami only
            return { amountColor: 'text-pink-500', rowBg: 'bg-pink-50/60' };
        case 1: // Others only
            return { amountColor: 'text-green-500', rowBg: 'bg-green-50/60' };

        // ── Two-flag blends ───────────────────────────────────────────
        case 6: // Work + Kami  →  purple (matches existing repo convention)
            return { amountColor: 'text-purple-500', rowBg: 'bg-purple-50/60' };
        case 5: // Work + Others  →  lime (amber↔green blend)
            return { amountColor: 'text-lime-500', rowBg: 'bg-lime-50/60' };
        case 3: // Kami + Others  →  cyan (pink↔green blend)
            return { amountColor: 'text-cyan-500', rowBg: 'bg-cyan-50/60' };

        // ── Three-flag blend ──────────────────────────────────────────
        case 7: // Work + Kami + Others  →  violet (three-way blend)
            return { amountColor: 'text-violet-500', rowBg: 'bg-violet-50/60' };

        // ── No flags ──────────────────────────────────────────────────
        default: // 0 — plain expense
            return { amountColor: 'text-rose-500', rowBg: '' };
    }
};
