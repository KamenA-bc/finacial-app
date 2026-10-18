/**
 * Pure transaction filtering engine for TransactionList.
 * Supports Cyrillic/Latin case-insensitive text search, semantic type/category/flag synonyms
 * (e.g. "Приход", "Доход", "Спечелени пари", "Разход", "Харч", "Плащане"),
 * dot/comma amount matching, AND-combined boolean flag chips (Работни, Kami ❤️, С Други),
 * and category filtering (including Pareto 'Останали' remainder resolution).
 */

import { CATEGORY_BG_MAP } from '@/lib/constants';
import { ExpenseCategory, ExpenseEntry, IncomeEntry, TransactionFilters } from '@/types';

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
    searchQuery: '',
    type: 'all',
    scope: 'day',
    category: null,
    isWork: false,
    isKami: false,
    isShared: false,
};

export interface FilteredTransactionsResult {
    readonly filteredIncome: IncomeEntry[];
    readonly filteredExpense: ExpenseEntry[];
    readonly filteredIncomeTotal: number;
    readonly filteredExpenseTotal: number;
    readonly totalMatchingCount: number;
    readonly hasActiveFilters: boolean;
}

const normalizeText = (value: string): string =>
    value.trim().toLocaleLowerCase('bg');

/** Universal terms that refer to any Income transaction. */
const INCOME_TYPE_KEYWORDS: readonly string[] = [
    'приход',
    'приходи',
    'спечелени пари',
    'спечелени',
    'доход',
    'доходи',
    'постъпление',
    'постъпления',
    'печалба',
    'income',
    'incomes',
    'earnings',
    'revenue',
];

/** Universal terms that refer to any Expense transaction. */
const EXPENSE_TYPE_KEYWORDS: readonly string[] = [
    'разход',
    'разходи',
    'харч',
    'харчове',
    'изхарчени',
    'похарчени',
    'плащане',
    'плащания',
    'покупка',
    'покупки',
    'expense',
    'expenses',
    'spending',
    'spent',
    'payment',
    'cost',
];

/** Bilingual & semantic synonyms per expense category. */
const CATEGORY_SEARCH_SYNONYMS: Record<ExpenseCategory, readonly string[]> = {
    'Магазини (Храна/Вода)': [
        'магазин',
        'магазини',
        'храна',
        'вода',
        'супермаркет',
        'пазар',
        'хранителни',
        'groceries',
        'food',
        'supermarket',
        'market',
    ],
    'Eating out': [
        'ресторант',
        'ресторанти',
        'заведение',
        'заведения',
        'кафе',
        'вечеря',
        'обяд',
        'закуска',
        'хранене навън',
        'доставка',
        'бар',
        'eating out',
        'restaurant',
        'dining',
        'cafe',
        'coffee',
    ],
    'Гориво': [
        'гориво',
        'бензин',
        'дизел',
        'газ',
        'бензиностанция',
        'кола',
        'автомобил',
        'fuel',
        'gas',
        'petrol',
        'diesel',
        'car',
    ],
    'Градски транспорт': [
        'градски транспорт',
        'транспорт',
        'метро',
        'автобус',
        'трамвай',
        'тролей',
        'билет',
        'такси',
        'transport',
        'transit',
        'bus',
        'metro',
        'subway',
        'taxi',
    ],
    'Health/Аптека': [
        'здраве',
        'аптека',
        'лекарства',
        'лекар',
        'доктор',
        'болница',
        'медицина',
        'зъболекар',
        'health',
        'pharmacy',
        'medicine',
        'doctor',
        'medical',
    ],
    'Beauty': [
        'красота',
        'козметика',
        'фризьор',
        'маникюр',
        'бръснар',
        'парфюм',
        'грижа',
        'beauty',
        'cosmetics',
        'hair',
        'salon',
        'barber',
    ],
    'Home': [
        'дом',
        'вкъщи',
        'жилище',
        'апартамент',
        'къща',
        'наем',
        'мебели',
        'ремонт',
        'домакинство',
        'home',
        'house',
        'rent',
        'furniture',
        'household',
    ],
    'Shopping': [
        'пазаруване',
        'шопинг',
        'дрехи',
        'обувки',
        'мол',
        'техника',
        'shopping',
        'clothes',
        'shoes',
        'mall',
    ],
    'Entertainment': [
        'забавление',
        'забавления',
        'развлечения',
        'кино',
        'театър',
        'концерт',
        'игри',
        'хоби',
        'абонамент',
        'entertainment',
        'movies',
        'cinema',
        'fun',
        'games',
    ],
    'Пътуване': [
        'пътуване',
        'пътувания',
        'екскурзия',
        'почивка',
        'хотел',
        'самолет',
        'полет',
        'ваканция',
        'travel',
        'trip',
        'vacation',
        'hotel',
        'flight',
    ],
    'Сметки/Разходи': [
        'сметки',
        'сметка',
        'ток',
        'парно',
        'интернет',
        'телефон',
        'данък',
        'такса',
        'комунални',
        'bills',
        'utilities',
        'electricity',
        'internet',
        'phone',
    ],
    'Фирмени разходи': [
        'фирмени',
        'фирма',
        'бизнес',
        'офис',
        'служебни',
        'company',
        'business',
        'office',
        'corporate',
    ],
    'Подаръци': [
        'подарък',
        'подаръци',
        'рожден ден',
        'празник',
        'почерпка',
        'gift',
        'gifts',
        'present',
        'birthday',
    ],
    'Други': [
        'други',
        'друго',
        'разни',
        'other',
        'misc',
        'miscellaneous',
    ],
};

const WORK_KEYWORDS: readonly string[] = ['работни', 'работен', 'работа', 'служебни', 'служебен', 'work'];
const KAMI_KEYWORDS: readonly string[] = ['ками', 'камелия', 'kami', 'kamelia'];
const SHARED_KEYWORDS: readonly string[] = ['с други', 'споделени', 'споделен', 'shared', 'others'];

const matchesAnyKeyword = (keywords: readonly string[], normalizedQuery: string): boolean => {
    if (normalizedQuery.length < 2) return false;
    return keywords.some(
        (kw) =>
            kw.startsWith(normalizedQuery) ||
            kw.split(/\s+/).some((word) => word.startsWith(normalizedQuery))
    );
};

const matchesAmountQuery = (amount: number, normalizedQuery: string): boolean => {
    const dotQuery = normalizedQuery.replace(',', '.');
    const fixed2 = amount.toFixed(2);
    const plain = String(amount);
    return fixed2.includes(dotQuery) || plain.includes(dotQuery);
};

const matchesIncomeQuery = (entry: IncomeEntry, normalizedQuery: string): boolean => {
    if (!normalizedQuery) return true;
    const desc = normalizeText(entry.description || 'Приход');

    if (desc.includes(normalizedQuery)) return true;
    if (matchesAnyKeyword(INCOME_TYPE_KEYWORDS, normalizedQuery)) return true;
    if (entry.isWorkIncome && matchesAnyKeyword(WORK_KEYWORDS, normalizedQuery)) return true;
    if (entry.isWithKami && matchesAnyKeyword(KAMI_KEYWORDS, normalizedQuery)) return true;

    return matchesAmountQuery(entry.amount, normalizedQuery);
};

const matchesExpenseQuery = (entry: ExpenseEntry, normalizedQuery: string): boolean => {
    if (!normalizedQuery) return true;
    const desc = normalizeText(entry.description);
    const rawCat = normalizeText(entry.category);
    const displayCat = normalizeText(CATEGORY_BG_MAP[entry.category] ?? entry.category);
    const categorySynonyms = CATEGORY_SEARCH_SYNONYMS[entry.category] ?? [];

    if (desc.includes(normalizedQuery)) return true;
    if (rawCat.includes(normalizedQuery) || displayCat.includes(normalizedQuery)) return true;
    if (matchesAnyKeyword(EXPENSE_TYPE_KEYWORDS, normalizedQuery)) return true;
    if (matchesAnyKeyword(categorySynonyms, normalizedQuery)) return true;
    if (entry.isWorkExpense && matchesAnyKeyword(WORK_KEYWORDS, normalizedQuery)) return true;
    if (entry.isWithKami && matchesAnyKeyword(KAMI_KEYWORDS, normalizedQuery)) return true;
    if (entry.isWithOthers && matchesAnyKeyword(SHARED_KEYWORDS, normalizedQuery)) return true;

    return matchesAmountQuery(entry.amount, normalizedQuery);
};

/**
 * Filter income and expense entries according to active TransactionFilters.
 *
 * @param incomeEntries - Income entries for the currently selected time scope
 * @param expenseEntries - Expense entries for the currently selected time scope
 * @param filters - Active search, type, category, and boolean flag filters
 * @param otherCategories - Optional list of remainder categories when `filters.category === 'Останали'`
 */
export const filterTransactions = (
    incomeEntries: readonly IncomeEntry[],
    expenseEntries: readonly ExpenseEntry[],
    filters: TransactionFilters,
    otherCategories: readonly ExpenseCategory[] = []
): FilteredTransactionsResult => {
    const normalizedQuery = normalizeText(filters.searchQuery);
    const hasCategoryFilter = filters.category !== null;
    const otherCategorySet =
        filters.category === 'Останали' ? new Set<ExpenseCategory>(otherCategories) : null;

    // Income entries do not have categories or `isWithOthers` (`isShared`).
    // If a category filter or `isShared` chip is active, or type is 'expenses', no income matches.
    const includeIncome =
        filters.type !== 'expenses' &&
        !hasCategoryFilter &&
        !filters.isShared;

    const filteredIncome = includeIncome
        ? incomeEntries.filter((entry) => {
              if (filters.isWork && !entry.isWorkIncome) return false;
              if (filters.isKami && !entry.isWithKami) return false;
              return matchesIncomeQuery(entry, normalizedQuery);
          })
        : [];

    const includeExpenses = filters.type !== 'income';

    const filteredExpense = includeExpenses
        ? expenseEntries.filter((entry) => {
              if (filters.isWork && !entry.isWorkExpense) return false;
              if (filters.isKami && !entry.isWithKami) return false;
              if (filters.isShared && !entry.isWithOthers) return false;

              if (filters.category !== null) {
                  if (filters.category === 'Останали') {
                      if (!otherCategorySet?.has(entry.category)) return false;
                  } else if (entry.category !== filters.category) {
                      return false;
                  }
              }

              return matchesExpenseQuery(entry, normalizedQuery);
          })
        : [];

    const filteredIncomeTotal = filteredIncome.reduce((sum, e) => sum + e.amount, 0);
    const filteredExpenseTotal = filteredExpense.reduce((sum, e) => sum + e.amount, 0);

    const hasActiveFilters =
        normalizedQuery.length > 0 ||
        filters.category !== null ||
        filters.isWork ||
        filters.isKami ||
        filters.isShared;

    return {
        filteredIncome,
        filteredExpense,
        filteredIncomeTotal,
        filteredExpenseTotal,
        totalMatchingCount: filteredIncome.length + filteredExpense.length,
        hasActiveFilters,
    };
};
