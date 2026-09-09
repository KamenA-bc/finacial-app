import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

const mockInsert = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            insert: mockInsert,
        })),
    })),
}));

describe('API Route - /api/log-error', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
    });

    it('returns 400 when required fields action or message are missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/log-error', {
            method: 'POST',
            body: JSON.stringify({ severity: 'error' }),
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toContain('Missing required fields');
    });

    it('persists valid error log and returns 201 Created', async () => {
        mockInsert.mockResolvedValueOnce({ error: null });

        const req = new NextRequest('http://localhost:3000/api/log-error', {
            method: 'POST',
            body: JSON.stringify({
                action: 'exportPdf',
                message: 'Failed to generate PDF bundle',
                severity: 'error',
                metadata: { year: 2026 },
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.success).toBe(true);

        expect(mockInsert).toHaveBeenCalledWith(
            expect.objectContaining({
                action: 'exportPdf',
                message: 'Failed to generate PDF bundle',
                severity: 'error',
                metadata: { year: 2026 },
            })
        );
    });

    it('returns 500 if Supabase insert returns an error', async () => {
        mockInsert.mockResolvedValueOnce({ error: { message: 'Database connection error' } });

        const req = new NextRequest('http://localhost:3000/api/log-error', {
            method: 'POST',
            body: JSON.stringify({
                action: 'fetchTransactions',
                message: 'Connection failed',
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBe('Database connection error');
    });
});
