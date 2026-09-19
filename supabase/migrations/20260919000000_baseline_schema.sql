-- ==============================================================================
-- Schema Baseline Migration: Finance Tracker
-- Tables: income_entries, expense_entries, error_logs
-- Includes: Constraints, Category Checks, Composite Indexes, Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Table: income_entries
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.income_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    description TEXT DEFAULT '' NOT NULL,
    is_work_income BOOLEAN DEFAULT FALSE NOT NULL,
    is_with_kami BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance index: Year/Month date range queries filtered by user
CREATE INDEX IF NOT EXISTS idx_income_entries_user_date
    ON public.income_entries (user_id, date ASC);

-- Row Level Security (RLS)
ALTER TABLE public.income_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own income entries"
    ON public.income_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income entries"
    ON public.income_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income entries"
    ON public.income_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income entries"
    ON public.income_entries FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 2. Table: expense_entries
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expense_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    description TEXT DEFAULT '' NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Магазини (Храна/Вода)',
        'Eating out',
        'Гориво',
        'Градски транспорт',
        'Health/Аптека',
        'Beauty',
        'Shopping',
        'Entertainment',
        'Пътуване',
        'Сметки/Разходи',
        'Фирмени разходи',
        'Подаръци',
        'Други'
    )),
    is_work_expense BOOLEAN DEFAULT FALSE NOT NULL,
    is_with_kami BOOLEAN DEFAULT FALSE NOT NULL,
    is_with_others BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance indexes: Date range & Category breakdown queries
CREATE INDEX IF NOT EXISTS idx_expense_entries_user_date
    ON public.expense_entries (user_id, date ASC);

CREATE INDEX IF NOT EXISTS idx_expense_entries_user_category
    ON public.expense_entries (user_id, category);

-- Row Level Security (RLS)
ALTER TABLE public.expense_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expense entries"
    ON public.expense_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expense entries"
    ON public.expense_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expense entries"
    ON public.expense_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expense entries"
    ON public.expense_entries FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. Table: error_logs (Client & API Error Telemetry)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.error_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action VARCHAR(150) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    stack TEXT,
    severity VARCHAR(20) DEFAULT 'error' NOT NULL CHECK (severity IN ('error', 'warning', 'info')),
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created_at
    ON public.error_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_action
    ON public.error_logs (action);

-- Row Level Security (RLS)
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated clients to report telemetry errors via API route
CREATE POLICY "Allow insert for client error telemetry"
    ON public.error_logs FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only service role can read raw error logs by default
CREATE POLICY "Service role can view error logs"
    ON public.error_logs FOR SELECT
    TO service_role
    USING (true);
