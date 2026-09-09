import { test, expect } from '@playwright/test';

test.describe('Dashboard Page E2E', () => {
    test.beforeEach(async ({ context, page }) => {
        await context.addCookies([
            {
                name: 'e2e-test-auth',
                value: 'true',
                url: 'http://localhost:3000',
            },
        ]);
        await page.goto('/');
    });

    test('renders dashboard header and main title', async ({ page }) => {
        await expect(page).toHaveTitle(/Finance Tracker/i);
        // Header brand
        await expect(page.locator('header')).toBeVisible();
    });

    test('displays stat cards for daily and monthly profit', async ({ page }) => {
        // Look for the stat cards
        await expect(page.getByText('Дневна печалба')).toBeVisible();
        await expect(page.getByText('Месечна печалба')).toBeVisible();
    });

    test('allows toggling between Income and Expense tabs with correct order', async ({ page }) => {
        const incomeTab = page.getByRole('button', { name: /приход/i }).first();
        const expenseTab = page.getByRole('button', { name: /разход/i }).first();

        await expect(incomeTab).toBeVisible();
        await expect(expenseTab).toBeVisible();

        // Check that Income tab is active by default (shows "Спечелена сума" or "Добави приход")
        await expect(page.getByText('Спечелена сума')).toBeVisible();
        await expect(page.getByRole('button', { name: /добави приход/i })).toBeVisible();

        // Switch to Expense tab
        await expenseTab.click();
        await expect(page.getByText('Категория')).toBeVisible();
        await expect(page.getByRole('button', { name: /добави разход/i })).toBeVisible();

        // Switch back to Income tab
        await incomeTab.click();
        await expect(page.getByText('Спечелена сума')).toBeVisible();
    });

    test('allows clicking tag chips in expense form', async ({ page }) => {
        // Switch to expense tab
        const expenseTab = page.getByRole('button', { name: /разход/i }).first();
        await expenseTab.click();

        // Tag buttons
        const workTag = page.getByRole('button', { name: /работни/i });
        const kamiTag = page.getByRole('button', { name: /kami/i });
        const othersTag = page.getByRole('button', { name: /с други/i });

        await expect(workTag).toBeVisible();
        await expect(kamiTag).toBeVisible();
        await expect(othersTag).toBeVisible();

        // Click tags to toggle
        await workTag.click();
        await expect(workTag).toHaveAttribute('aria-pressed', 'true');

        await kamiTag.click();
        await expect(kamiTag).toHaveAttribute('aria-pressed', 'true');

        await othersTag.click();
        await expect(othersTag).toHaveAttribute('aria-pressed', 'true');

        // Toggle off
        await workTag.click();
        await expect(workTag).toHaveAttribute('aria-pressed', 'false');
    });

    test('validates required fields on quick transaction form', async ({ page }) => {
        // In Income tab, submit empty
        const submitIncomeBtn = page.getByRole('button', { name: /добави приход/i });
        await submitIncomeBtn.click();

        // Validation error appears for amount
        await expect(page.getByText(/моля, въведете валидно число|сумата трябва да е по-голяма от 0/i)).toBeVisible();
    });
});
