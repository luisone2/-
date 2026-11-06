# 02 - Better UI, Typography & Colors (Jakub Krehel Standards)

## Better UI Principles
1. **Optical Alignment**:
   - Icons within buttons must be optically centered with text (accounting for font cap-height vs icon glyph height).
   - Monospace numerals for tabular data, counters, and project index numbers (`01`, `02`, `03`).
2. **Spacing Grid (4px / 8px Scale)**:
   - Micro spacing: `gap-1` (4px), `gap-2` (8px), `gap-3` (12px).
   - Component spacing: `p-4` (16px), `p-6` (24px), `p-8` (32px).
   - Section macro rhythm: `py-16` (64px), `py-24` (96px), `py-32` (128px).

## Better Colors
- Never use raw saturation (e.g. `rgb(255, 0, 0)`). Soften functional colors:
  - Error/Delete: `#EF4444` / `#F87171`
  - Success: `#10B981` / `#34D399`
  - Accent/Focus: Violet `#8B5CF6`, Indigo `#6366F1`, or Electric Blue `#38BDF8`
- Subtle glow over heavy dropshadow: `box-shadow: 0 0 25px rgba(139, 92, 246, 0.15)`.

## Better Typography
- Font sizes should jump by clear ratios (e.g., Major Third 1.25 or Perfect Fourth 1.33).
- Display: 48px - 96px+
- Section Heading: 28px - 36px
- Card Heading: 20px - 24px
- Body: 14px - 16px
- Micro/Label/Badge: 11px - 13px with tracking `0.05em` to `0.1em`.
