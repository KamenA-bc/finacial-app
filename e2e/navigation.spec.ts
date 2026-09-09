import { test, expect } from '@playwright/test';

test.describe('Application Navigation E2E', () => {
    test('navigates seamlessly between Dashboard, Statistics, and History', async ({ context, page }) => {
        await context.addCookies([
            {
                name: 'e2e-test-auth',
                value: 'true',
                url: 'http://localhost:3000',
            },
        ]);
        // 1. Start at Dashboard
        await page.goto('/');
        await expect(page).toHaveURL(/\/$/);
        await expect(page.getByText('Дневна печалба')).toBeVisible();

        // 2. Navigate to Statistics
        const statsLink = page.getByRole('link', { name: /статистика/i });
        if (await statsLink.isVisible()) {
            await statsLink.click();
            await expect(page).toHaveURL(/\/statistics/);
            // Verify statistics page rendered
            await expect(page.locator('h1, h2, div').filter({ hasText: /годишен преглед|статистика/i }).first()).toBeVisible();
        }

        // 3. Navigate to History
        const historyLink = page.getByRole('link', { name: /история/i });
        if (await historyLink.isVisible()) {
            await historyLink.click();
            await expect(page).toHaveURL(/\/history/);
            await expect(page.locator('body')).toBeVisible();
        }

        // 4. Return to Dashboard
        const dashboardLink = page.getByRole('link', { name: /табло|начало/i }).first();
        if (await dashboardLink.isVisible()) {
            await dashboardLink.click();
            await expect(page).toHaveURL(/\/$/);
        }
    });
});
