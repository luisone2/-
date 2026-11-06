import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDockItemScale } from '../utils/portfolioMath';

export interface ToolkitDockItem {
  name: string;
  role: string;
  src: string;
  accent: string;
}

export const DEFAULT_TOOLKIT_ITEMS: ToolkitDockItem[] = [
  {
    name: 'Figma',
    role: 'UI/UX 界面与组件系统',
    src: '/icons/figma.svg',
    accent: '#F24E1E',
  },
  {
    name: 'Photoshop',
    role: '视觉精修与商业合成',
    src: '/icons/ps.svg',
    accent: '#31A8FF',
  },
  {
    name: 'Illustrator',
    role: '品牌 VI 与矢量图形',
    src: '/icons/ai.svg',
    accent: '#FF9A00',
  },
  {
    name: 'After Effects',
    role: '动态视觉与交互动效',
    src: '/icons/ae.svg',
    accent: '#9999FF',
  },
  {
    name: 'Cinema 4D',
    role: '三维建模与材质渲染',
    src: '/icons/c4d.svg',
    accent: '#38BDF8',
  },
  {
    name: 'ComfyUI',
    role: 'AIGC 可控节点工作流',
    src: '/icons/comfyui.svg',
    accent: '#C084FC',
  },
  {
    name: 'Runway',
    role: 'AI 动态视频生成',
    src: '/icons/runway.svg',
    accent: '#34D399',
  },
];

const BASE_TILE_SIZE = 38;
const MAX_SCALE = 1.56;
const INFLUENCE_RADIUS = 132;

export const MagneticToolkitDock: React.FC<{
  items?: ToolkitDockItem[];
}> = ({ items = DEFAULT_TOOLKIT_ITEMS }) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [failedIcons, setFailedIcons] = useState<Record<string, boolean>>({});
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseX(e.clientX);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setHoveredName(null);
  };

  const scrollToSkills = () => {
    const el = document.getElementById('skills');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      data-testid="hero-toolkit-block"
      className="flex items-end justify-end select-none"
    >
      {/* Apple macOS Frosted Glass Magnetic Dock Tray */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background:
            'linear-gradient(145deg, rgba(28, 35, 52, 0.54) 0%, rgba(12, 15, 24, 0.44) 100%)',
          backdropFilter: 'blur(28px) saturate(195%)',
          WebkitBackdropFilter: 'blur(28px) saturate(195%)',
          boxShadow:
            '0 18px 44px rgba(0, 0, 0, 0.65), inset 0 1.5px 1px rgba(255, 255, 255, 0.30), inset 0 -1px 1px rgba(255, 255, 255, 0.08)',
        }}
        className="relative flex items-center gap-2 sm:gap-2.5 rounded-[22px] border border-white/22 px-3.5 py-2 h-[56px]"
      >
        {/* Top Specular Catchlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        {/* Left Dock Compartment: Toolkit Title + macOS Divider */}
        <div className="hidden sm:flex items-center gap-3 pr-1 h-full">
          <div className="flex flex-col items-end justify-center leading-tight">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/90 font-semibold whitespace-nowrap">
              TOOLKIT
            </span>
            <span className="text-[10px] tracking-[0.08em] text-[#D7E2EA]/65 font-light whitespace-nowrap">
              工具栈
            </span>
          </div>
          <div
            aria-hidden="true"
            className="w-px h-7 bg-gradient-to-b from-transparent via-white/25 to-transparent"
          />
        </div>

        {/* Right Dock Compartment: 7 Magnetic Magnifying App Icons */}
        <div className="flex items-end gap-2 sm:gap-2.5 h-full">
          {items.map((tool, idx) => {
            const el = itemRefs.current[idx];
            let centerX = 0;
            if (el && mouseX !== null) {
              const rect = el.getBoundingClientRect();
              centerX = rect.left + rect.width / 2;
            }

            const { scale, liftY, intensity } =
              mouseX !== null && centerX > 0
                ? calculateDockItemScale(
                    mouseX,
                    centerX,
                    MAX_SCALE,
                    INFLUENCE_RADIUS
                  )
                : { scale: 1, liftY: 0, intensity: 0 };

            const tileSize = Math.round(BASE_TILE_SIZE * scale * 10) / 10;
            const iconSize = Math.round(20 * scale * 10) / 10;
            const isHovered = hoveredName === tool.name;

            return (
              <div
                key={tool.name}
                className="relative flex flex-col items-center justify-end h-full"
              >
                {/* Floating Apple Frosted Glass Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.92 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        bottom: `${tileSize + Math.abs(liftY) + 14}px`,
                        background:
                          'linear-gradient(145deg, rgba(24, 30, 46, 0.82) 0%, rgba(12, 15, 24, 0.72) 100%)',
                        backdropFilter: 'blur(22px) saturate(195%)',
                        WebkitBackdropFilter: 'blur(22px) saturate(195%)',
                        boxShadow:
                          '0 12px 28px rgba(0,0,0,0.68), inset 0 1px 0.5px rgba(255,255,255,0.34)',
                      }}
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1 whitespace-nowrap"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: tool.accent,
                          boxShadow: `0 0 8px ${tool.accent}`,
                        }}
                      />
                      <span className="text-[11px] font-semibold text-white tracking-wide">
                        {tool.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-white/35 text-[10px]"
                      >
                        ·
                      </span>
                      <span className="text-[11px] font-light text-[#D7E2EA]/95">
                        {tool.role}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Magnifying Icon Squircle Tile */}
                <motion.button
                  ref={(node) => {
                    itemRefs.current[idx] = node;
                  }}
                  type="button"
                  onClick={scrollToSkills}
                  onMouseEnter={() => setHoveredName(tool.name)}
                  onFocus={() => setHoveredName(tool.name)}
                  onBlur={() => setHoveredName(null)}
                  aria-label={`${tool.name} — ${tool.role}`}
                  animate={{
                    width: tileSize,
                    height: tileSize,
                    y: liftY,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 26,
                    mass: 0.45,
                  }}
                  style={{
                    background:
                      intensity > 0.15
                        ? `radial-gradient(circle at 50% 25%, ${tool.accent}32 0%, rgba(255, 255, 255, 0.15) 55%, rgba(255, 255, 255, 0.06) 100%)`
                        : 'rgba(255, 255, 255, 0.06)',
                    borderColor:
                      intensity > 0.35
                        ? 'rgba(255, 255, 255, 0.5)'
                        : 'rgba(255, 255, 255, 0.16)',
                    boxShadow:
                      intensity > 0.25
                        ? `0 12px 24px -4px rgba(0, 0, 0, 0.65), 0 0 18px ${tool.accent}42, inset 0 1px 1px rgba(255, 255, 255, 0.44)`
                        : 'inset 0 1px 0.5px rgba(255, 255, 255, 0.18)',
                  }}
                  className="relative flex items-center justify-center rounded-[13px] border cursor-pointer focus:outline-none"
                >
                  {failedIcons[tool.name] ? (
                    <span className="text-[11px] font-semibold text-white px-1">
                      {tool.name.slice(0, 2)}
                    </span>
                  ) : (
                    <img
                      src={tool.src}
                      alt={tool.name}
                      onError={() =>
                        setFailedIcons((prev) => ({
                          ...prev,
                          [tool.name]: true,
                        }))
                      }
                      style={{
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        opacity: 0.72 + intensity * 0.28,
                        filter:
                          intensity > 0.2
                            ? `grayscale(${Math.max(0, 1 - intensity * 1.45)}) drop-shadow(0 2px 6px ${tool.accent}66)`
                            : 'grayscale(0.6)',
                      }}
                      className="object-contain select-none pointer-events-none transition-[filter,opacity] duration-150"
                    />
                  )}
                </motion.button>

                {/* macOS Active Indicator Dot */}
                <span
                  aria-hidden="true"
                  style={{
                    opacity:
                      intensity > 0.15 ? Math.min(1, intensity * 1.2) : 0.24,
                    transform: `scale(${0.75 + intensity * 0.55})`,
                    backgroundColor:
                      intensity > 0.45 ? tool.accent : '#D7E2EA',
                    boxShadow:
                      intensity > 0.45 ? `0 0 6px ${tool.accent}` : 'none',
                  }}
                  className="mt-1 w-1 h-1 rounded-full transition-all duration-150"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
