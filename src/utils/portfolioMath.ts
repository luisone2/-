export interface RectBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MagnetResult {
  isActive: boolean;
  x: number;
  y: number;
}

/**
 * Calculates the horizontal scroll offset and row translate values for the Marquee section.
 * Formula: offset = (scrollY - sectionTop + innerHeight) * 0.3
 * Row 1 moves RIGHT: translateX(offset - 200)
 * Row 2 moves LEFT: translateX(-(offset - 200))
 */
export function calculateMarqueeOffset(
  scrollY: number,
  sectionTop: number,
  innerHeight: number
): { offset: number; row1TranslateX: number; row2TranslateX: number } {
  const offset = (scrollY - sectionTop + innerHeight) * 0.3;
  const shifted = offset - 200;
  return {
    offset,
    row1TranslateX: shifted,
    row2TranslateX: -shifted,
  };
}

/**
 * Calculates magnetic mouse-following offset when cursor is within padding distance of element edge.
 */
export function calculateMagnetPosition(
  clientX: number,
  clientY: number,
  rect: RectBounds,
  padding = 150,
  strength = 3
): MagnetResult {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distX = Math.abs(centerX - clientX);
  const distY = Math.abs(centerY - clientY);

  const isWithinX = distX < rect.width / 2 + padding;
  const isWithinY = distY < rect.height / 2 + padding;

  if (isWithinX && isWithinY && strength > 0) {
    return {
      isActive: true,
      x: (clientX - centerX) / strength,
      y: (clientY - centerY) / strength,
    };
  }

  return {
    isActive: false,
    x: 0,
    y: 0,
  };
}

/**
 * Calculates the target scale and sticky top offset for stacked project cards.
 * Formula: targetScale = 1 - (totalCards - 1 - index) * 0.03
 * Top offset: index * 28
 */
export function calculateProjectCardMetrics(
  index: number,
  totalCards: number
): { targetScale: number; topOffsetPx: number; rangeStart: number } {
  const targetScale = Number((1 - (totalCards - 1 - index) * 0.03).toFixed(4));
  const topOffsetPx = index * 28;
  const rangeStart = Number((index * (1 / totalCards)).toFixed(4));
  return {
    targetScale,
    topOffsetPx,
    rangeStart,
  };
}

/**
 * Calculates character scroll progress range [start, end] for character-by-character opacity animation.
 */
export function calculateCharScrollRange(
  charIndex: number,
  totalChars: number
): [number, number] {
  if (totalChars <= 0) return [0, 1];
  const start = charIndex / totalChars;
  const end = (charIndex + 1) / totalChars;
  return [start, end];
}

export interface ContactFormInput {
  name: string;
  email: string;
  service: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

/**
 * Validates contact modal inquiry submission.
 */
export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = '请输入您的姓名（至少 2 个字符）。';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = '请输入有效的电子邮箱地址。';
  }

  if (!input.message || input.message.trim().length < 10) {
    errors.message = '请简要描述您的项目需求（至少 10 个字符）。';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Computes eased count-up string value given normalized progress [0, 1].
 * Uses cubic ease-out: 1 - (1 - t)^3
 */
export function formatCountUpValue(
  progress: number,
  targetValue: number,
  decimals = 0,
  suffix = ''
): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const eased = 1 - Math.pow(1 - clamped, 3);
  const current = targetValue * eased;
  return `${current.toFixed(decimals)}${suffix}`;
}

export interface HrQuickProfile {
  name: string;
  englishName: string;
  graduationYear: string;
  university: string;
  major: string;
  gpa: string;
  targetRoles: string[];
  location: string;
  availability: string;
  phone: string;
  wechat: string;
  email: string;
  coreTools: string[];
}

export const DEFAULT_HR_QUICK_PROFILE: HrQuickProfile = {
  name: '李翰林',
  englishName: 'Luis Li',
  graduationYear: '2027 届本科',
  university: '南京理工大学泰州科技学院',
  major: '数字媒体艺术',
  gpa: '3.65 / 4.0',
  targetRoles: ['UI/UX 视觉设计', 'AI 设计 (AIGC)', '品牌视觉设计'],
  location: '现居武汉（支持全国异地实习 / 校招到岗）',
  availability: '可随时到岗 · 实习 / 校招全职',
  phone: '15852182789',
  wechat: '15852182789',
  email: 'lihanlin_luis@163.com',
  coreTools: ['Figma', 'Cinema 4D', 'After Effects', 'ComfyUI', 'Runway', 'Photoshop', 'Illustrator'],
};

/**
 * Formats a clean, structured HR quick-glance summary string for pasting into IM/ATS tools.
 */
export function buildHrCandidateSummaryText(
  profile: HrQuickProfile = DEFAULT_HR_QUICK_PROFILE
): string {
  return [
    `【候选人求职速览】${profile.name} (${profile.englishName})`,
    `· 教育背景：${profile.university} · ${profile.major}（${profile.graduationYear} · GPA ${profile.gpa}）`,
    `· 意向岗位：${profile.targetRoles.join(' / ')}`,
    `· 到岗状态：${profile.availability} | ${profile.location}`,
    `· 核心工具：${profile.coreTools.join(' · ')}`,
    `· 电话/微信：${profile.phone}（微信同号）`,
    `· 求职邮箱：${profile.email}`,
  ].join('\n');
}

/**
 * Generates a deterministic 21x21 QR matrix with standard 7x7 finder patterns,
 * timing lines, center logo reserve area, and seeded data modules.
 */
export function generateDeterministicQrMatrix(
  seed = 'wechat:15852182789:LuisLi',
  size = 21
): boolean[][] {
  const n = Math.max(21, size);
  const matrix: boolean[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => false)
  );
  const reserved: boolean[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => false)
  );

  const placeFinder = (rowOffset: number, colOffset: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = rowOffset + r;
        const cc = colOffset + c;
        if (rr < 0 || rr >= n || cc < 0 || cc >= n) continue;
        reserved[rr][cc] = true;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[rr][cc] = isOuterBorder || isInnerCore;
        } else {
          matrix[rr][cc] = false;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, n - 7);
  placeFinder(n - 7, 0);

  // Timing patterns
  for (let i = 8; i < n - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Center 5x5 reserve for avatar/logo badge
  const mid = Math.floor(n / 2);
  for (let r = mid - 2; r <= mid + 2; r++) {
    for (let c = mid - 2; c <= mid + 2; c++) {
      reserved[r][c] = true;
      matrix[r][c] = false;
    }
  }

  // Deterministic hash from seed
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (reserved[r][c]) continue;
      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      matrix[r][c] = (Math.abs(hash) % 10) < 5;
    }
  }

  return matrix;
}

export interface DockItemMetrics {
  scale: number;
  liftY: number;
  intensity: number;
}

/**
 * Calculates smooth raised-cosine magnification scale and vertical lift
 * for an Apple macOS style magnetic dock item given cursor X position.
 */
export function calculateDockItemScale(
  mouseX: number | null,
  itemCenterX: number,
  maxScale = 1.65,
  influenceRadius = 128
): DockItemMetrics {
  if (mouseX === null || influenceRadius <= 0) {
    return { scale: 1, liftY: 0, intensity: 0 };
  }
  const dist = Math.abs(mouseX - itemCenterX);
  if (dist >= influenceRadius) {
    return { scale: 1, liftY: 0, intensity: 0 };
  }
  // Raised cosine bell curve: 1 at dist=0, 0 at dist=influenceRadius
  const intensity = (1 + Math.cos((dist / influenceRadius) * Math.PI)) / 2;
  const scale = Number((1 + (maxScale - 1) * intensity).toFixed(4));
  const liftY = Number((-12 * intensity).toFixed(2));
  return {
    scale,
    liftY,
    intensity: Number(intensity.toFixed(4)),
  };
}

/**
 * Determines whether the bottom-right HR floating quick card should be visible
 * based on current vertical scroll position and viewport height.
 * Hidden while in the Hero section (scrollY < viewportHeight * 0.38) to avoid
 * visual competition with the top-right Resume CTA; smoothly revealed upon scrolling down.
 */
export function shouldShowHrFloatingCard(
  scrollY: number,
  viewportHeight = 800
): boolean {
  const safeVh = viewportHeight > 0 ? viewportHeight : 800;
  return scrollY >= safeVh * 0.38;
}




