-- ==============================================================================
-- Migration: Add 'Home' category to expense_entries check constraint
-- ==============================================================================

ALTER TABLE public.expense_entries
    DROP CONSTRAINT IF EXISTS expense_entries_category_check;

ALTER TABLE public.expense_entries
    ADD CONSTRAINT expense_entries_category_check CHECK (category IN (
        'Магазини (Храна/Вода)',
        'Eating out',
        'Гориво',
        'Градски транспорт',
        'Health/Аптека',
        'Beauty',
        'Home',
        'Shopping',
        'Entertainment',
        'Пътуване',
        'Сметки/Разходи',
        'Фирмени разходи',
        'Подаръци',
        'Други'
    ));
