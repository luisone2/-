# 05 - Modern React 19 + TypeScript + Tailwind (PatrickJS Standard)

## Engineering Standards
1. **Strict TypeScript**:
   - Zero `any` types.
   - Comprehensive component interface definitions for props and state.
2. **Tailwind CSS v4 & Class Merging**:
   - Use `cn()` helper (`src/utils/cn.ts`) for dynamic classes:
     ```tsx
     import { cn } from '../utils/cn';
     <button className={cn("base-class", isActive && "active-class", className)} />
     ```
   - Avoid inline CSS style tags where Tailwind utility classes exist.
3. **Component Boundaries**:
   - Keep components modular and single-responsibility.
   - Separate pure utility logic into `/src/utils/` and unit test pure functions.
   - Ensure modals trap focus and dismiss gracefully on `Escape` key and outside click.
