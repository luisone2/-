# Project AI Agent Skills & Design Rules
# 个人作品集与前端设计高星 Skill 规范集

本目录整合了 GitHub 上最受欢迎的前端与 UI/UX 设计相关的 AI Agent Skills 与 Cursor Rules，作为本项目开发与 AI 交互的标准规范：

---

## 包含的 Skills 规范索引

1. **[01-frontend-design.md](./01-frontend-design.md)**
   - **来源**: Anthropics Skills / Universal Frontend Design Constitution
   - **核心理念**: 拒绝 AI 模板味（Anti-AI Slop），强调个性化审美、极简排版层级、严谨的色彩系统与视口沉浸感。

2. **[02-better-ui-typography-colors.md](./02-better-ui-typography-colors.md)**
   - **来源**: Jakub Krehel's `better-ui`, `better-typography`, `better-colors`
   - **核心理念**: 视觉微调（Optical Alignment）、4/8px 间距阶梯、WCAG AA 对比度、现代字体字阶混排规则。

3. **[03-cursor-designer.md](./03-cursor-designer.md)**
   - **来源**: Spencer Goldade's `cursor-designer`
   - **核心理念**: 设计优先（Design-First）、以用户信息视线流（Visual Hierarchy）与渐进式展示（Progressive Disclosure）为核心的界面构建标准。

4. **[04-premium-frontend-motion.md](./04-premium-frontend-motion.md)**
   - **来源**: GitHub Awesome Copilot `premium-frontend-ui`
   - **核心理念**: 叙事性动效（Kinetic Typography / Scroll Storytelling）、物理缓动曲线、毛玻璃质感与微交互细腻反馈。

5. **[05-awesome-cursorrules-modern-stack.md](./05-awesome-cursorrules-modern-stack.md)**
   - **来源**: PatrickJS `awesome-cursorrules`
   - **核心理念**: 现代 React 19 + TypeScript + Tailwind CSS 生产级代码架构、组件自洽性、无无用副作用。

---

## 依赖支持
项目已安装配套支持库：
- `clsx` & `tailwind-merge`: 动态类名智能合并 (`src/utils/cn.ts`)
- `canvas-confetti`: 微交互庆祝微动效
- `gsap`: 电影级/高阶动画时间轴
- `framer-motion`: 声明式平滑物理缓动动画
- `lucide-react`: 精细几何无衬线线性图标
