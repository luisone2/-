# 01 - Frontend Design Constitution (Anthropics / Universal Standard)

## Core Philosophy: Anti-AI Slop
AI interfaces frequently default to generic, uninspired layouts: centered hero cards with generic purple gradients, identical pill buttons everywhere, and stock typography. This skill mandates bold, intentional, production-grade craftsmanship.

### 1. Typography Hierarchy
- Pick a clear, charismatic aesthetic: modern editorial, technical brutalism, or Swiss precision.
- Use distinct contrast between display headings (large scale, tight tracking, `leading-none` or `leading-tight`) and utilitarian body copy.
- Avoid loose or floating single-word line breaks; use non-breaking spaces or calibrated container widths.

### 2. Palette & Contrast
- Restrained color economy: 1 dominant background neutral, 1 subtle surface layer, 1 high-contrast text color, and 1-2 intentional accent colors.
- Dark theme discipline: Avoid pure pitch `#000000` across whole surfaces; use rich dark neutrals like `#0C0C0C`, `#121418`, paired with translucent borders (`rgba(255,255,255,0.08)` to `0.15`).
- Ensure all text passes minimum WCAG 4.5:1 contrast against its background.

### 3. Spatial Rhythm & Layout
- Layouts must feel grounded in real viewport constraints.
- Avoid repetitive "pill container" nestings. Borders and shadows must have clear hierarchy.
- Use asymmetrical balancing (e.g. bold left-heavy typography with delicate right-aligned metadata tags).
