import { test, expect } from '@playwright/test';

test.describe('Export Dropdown E2E', () => {
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

    test('opens export dropdown and shows all export formats (Excel, CSV, PDF)', async ({ page }) => {
        // Find the export dropdown trigger button
        const exportTrigger = page.getByRole('button', { name: /експорт|експортиране/i });
        await expect(exportTrigger).toBeVisible();

        // Click to open dropdown
        await exportTrigger.click();

        // Verify dropdown menu options are visible
        const excelOption = page.getByRole('menuitem', { name: /excel/i });
        const csvOption = page.getByRole('menuitem', { name: /csv/i });
        const pdfOption = page.getByRole('menuitem', { name: /pdf/i });

        await expect(excelOption).toBeVisible();
        await expect(csvOption).toBeVisible();
        await expect(pdfOption).toBeVisible();

        // Click outside or press Escape to close
        await page.keyboard.press('Escape');
        await expect(excelOption).not.toBeVisible();
    });
});
