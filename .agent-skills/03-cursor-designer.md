# 03 - Cursor Designer (Spencer Goldade Standards)

## Design-First Engineering
Every interface component must solve a genuine user goal with clarity, speed, and visual balance.

### 1. Information Architecture
- The eye scans in an F-pattern or Z-pattern:
  - Top-Left: Identity, branding, logo.
  - Center/Top-Right: Navigation, key calls-to-action (e.g. "查看简历").
  - Center: High-impact hero narrative.
  - Downwards: Progressive disclosure from overview to project details.

### 2. State Feedback
- Every interactive element MUST have:
  - Default state
  - Hover state (`hover:scale-105`, `hover:border-white/30`, `hover:text-white`)
  - Active/Pressed state (`active:scale-95`)
  - Focus-visible outline for keyboard navigation
  - Disabled state with reduced opacity and `cursor-not-allowed`

### 3. Progressive Disclosure
- Don't overwhelm the user on first glance.
- High-level overview first (Cards with preview thumbnails and short summaries).
- Full details revealed through contextual modals or drawers without losing page context.
