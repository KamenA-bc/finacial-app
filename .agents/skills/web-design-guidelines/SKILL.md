---
name: web-design-guidelines
description: Vercel's Web Interface Guidelines for production-grade design, typography, accessibility, and high-performance UI engineering.
license: Apache-2.0
---

# Web Interface Guidelines (Vercel Standards)

Detail reference. Short, non-negotiable rules (tabular-nums, `…`, `&nbsp;`, focus rings, 44px targets, `aria-label` on icon buttons) live in **AGENTS.md §5** and are not repeated here.

---

## 1. Typography & Financial Data

- `tabular-nums` prevents jitter during balance changes and keeps columns aligned (amounts, counters, dates).
- `text-balance` for short titles, `text-pretty` for body copy and modal headlines.
- Loading labels read `Зареждане…` / `Запазване…`. Join number and currency with `&nbsp;` (`24.50&nbsp;€`); currency symbol comes from `getCurrencySymbol(date)`.

## 2. Interactive Controls & Accessibility

- Semantic HTML first: `<button>` for actions, `<a>`/`<Link>` for navigation, never `<div onClick>`.
- Never remove an outline without a visible `:focus-visible` replacement.
- Every `<input>`/`<select>` has a `<label htmlFor>` or `aria-label`. Decorative icons get `aria-hidden="true"`.
- If a control is visually smaller than 44px, pad it or wrap it in a 44px hit zone.

## 3. Compositing & Layout Stability

- Animate only `transform` and `opacity`; never `width`, `height`, `margin`, `padding`, `top`, `left`.
- Reserve space for lazy content (`CategoryChart`, `MonthlyTrendsChart`, scanner viewfinder) with a same-size skeleton to avoid CLS.
- Flex children with truncated text need `min-w-0`.

## 4. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Tailwind: `motion-reduce:transition-none`, `motion-reduce:animate-none`.
