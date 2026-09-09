import { test, expect } from '@playwright/test';

test.describe('Authentication & Route Protection E2E', () => {
    test('redirects unauthenticated visitors from protected route to /login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('renders login page with email and password fields', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByPlaceholder(/you@example\.com|email/i)).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('displays client validation errors when submitting empty login credentials', async ({ page }) => {
        await page.goto('/login');
        const submitBtn = page.getByRole('button', { name: /sign in/i });
        await submitBtn.click();

        await expect(page.getByText('Please enter a valid email')).toBeVisible();
        await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('navigates from login to registration page', async ({ page }) => {
        await page.goto('/login');
        const registerLink = page.getByRole('link', { name: /sign up|create one/i });
        await expect(registerLink).toBeVisible();
        await registerLink.click();
        await expect(page).toHaveURL(/\/register/);
    });

    test('navigates from login to forgot password page', async ({ page }) => {
        await page.goto('/login');
        const forgotLink = page.getByRole('link', { name: /forgot password/i });
        await expect(forgotLink).toBeVisible();
        await forgotLink.click();
        await expect(page).toHaveURL(/\/forgot-password/);
    });
});
