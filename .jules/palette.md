## 2024-05-22 - Mobile Menu Button Accessibility
**Learning:** In simple HTML/CSS/JS websites without a UI framework, mobile menu toggles are often implemented as generic `<div>` elements, missing native keyboard focus and semantic meaning. Additionally, they often lack ARIA attributes to communicate state to screen readers.
**Action:** When working on generic web projects, always check custom interactive elements (like mobile menu toggles or custom dropdowns) to ensure they use semantic tags like `<button>` and include relevant attributes like `aria-expanded` and `aria-controls`. Ensure JavaScript updates these ARIA attributes when state changes.

## 2024-05-22 - Form Accessibility & UX
**UX/a11y Insight:** Relying purely on `placeholder` attributes for form fields is bad for accessibility because screen readers may not read them reliably, and they disappear once a user starts typing, increasing cognitive load. Additionally, forms without visual disabled states on submission lead to double-clicks and confusion.
**Actionable Rule:** Always explicitly bind `<label>` elements to their corresponding inputs using `for` and `id`. Additionally, ensure form submission buttons have an async loading/disabled state (`disabled = true`, `cursor: not-allowed`) to prevent double submissions.
