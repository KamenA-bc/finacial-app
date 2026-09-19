---
name: web-design-guidelines
description: Vercel's Web Interface Guidelines for production-grade design, typography, accessibility, and high-performance UI engineering.
license: Apache-2.0
---

# Web Interface Guidelines (Vercel Standards)

Production-grade rules for web application interfaces, ensuring precision, accessibility, and zero visual jank.

---

## 1. Typography & Financial Data Display

- **Tabular Figures:** Always apply `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`) to financial amounts, balances, currency displays, tables, counters, and dates. This prevents jitter during balance animations and ensures clean vertical column alignment.
- **Heading Text Balancing:** Use `text-wrap: balance` or `text-wrap: pretty` (Tailwind: `text-balance` / `text-pretty`) on titles and modal headlines to eliminate orphan words.
- **Punctuation & Ellipses:** Use proper Unicode ellipsis `…` (`&hellip;`), never three raw dots `...`. Loading indicators must read `"Зареждане…"`, `"Запазване…"`.
- **Non-Breaking Spaces:** Use `&nbsp;` between numbers and units/currencies (e.g. `10&nbsp;лв.`, `5&nbsp;MB`, `⌘&nbsp;K`).

---

## 2. Interactive Controls & Focus Accessibility

- **Keyboard Focus Replacement:** Never remove outlines (`outline-none` or `outline: none`) without supplying an explicit, visible `:focus-visible` replacement (e.g. `focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none`).
- **Semantic HTML First:** Use `<button>` for actions and `<a>` / `<Link>` for navigation. Avoid `<div onClick>`.
- **Hit Target Minimums:** Interactive controls must have at least `44x44px` touch hit area on mobile, or padded wrapper zones.
- **Icon Buttons:** Every icon-only button must include an explicit `aria-label` or visually hidden screen reader text (`sr-only`). Decorative icons must have `aria-hidden="true"`.
- **Form Labels:** Every `<input>` or `<select>` must be associated with a clickable `<label htmlFor="...">` or carry `aria-label`.

---

## 3. Compositing & Layout Stability

- **Hardware Compositing:** Animate only `transform` and `opacity`. Never animate `width`, `height`, `margin`, `padding`, or `top`/`left` directly as they trigger costly layout recalculations and cause frame drops.
- **Preventing Layout Shift (CLS):** Provide explicit aspect ratios or bounding containers for images, charts, and lazy-loaded modules (`CategoryChart`, scanner viewfinder).
- **Text Truncation in Flex Containers:** Flex child elements containing truncated text must declare `min-w-0` to allow ellipsis truncation to work correctly without blowing out the container width.

---

## 4. Reduced Motion

- Always respect user system preferences:
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
In Tailwind: utilize `motion-reduce:transition-none` or `motion-reduce:animate-none`.
