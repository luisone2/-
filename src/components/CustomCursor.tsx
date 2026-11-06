import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type CursorMode = 'default' | 'interactive' | 'project';

export const CustomCursor: React.FC = () => {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [cursorLabel, setCursorLabel] = useState('查看项目');

  // Exact pointer coordinates for the inner precision dot
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring-physics coordinates for the outer magnetic ring / badge
  const ringX = useSpring(mouseX, { stiffness: 420, damping: 28, mass: 0.45 });
  const ringY = useSpring(mouseY, { stiffness: 420, damping: 28, mass: 0.45 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updatePointerType = () => {
      const fine = mediaQuery.matches;
      setIsFinePointer(fine);
      if (fine) {
        document.documentElement.classList.add('custom-cursor-enabled');
      } else {
        document.documentElement.classList.remove('custom-cursor-enabled');
      }
    };

    updatePointerType();
    mediaQuery.addEventListener('change', updatePointerType);

    return () => {
      mediaQuery.removeEventListener('change', updatePointerType);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) {
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectRegion = target.closest('[data-cursor="project"]') as HTMLElement | null;
      const interactiveEl = target.closest(
        'a, button, [role="button"], input, select, textarea, [data-cursor="interactive"]'
      ) as HTMLElement | null;

      if (interactiveEl) {
        setMode('interactive');
      } else if (projectRegion) {
        setMode('project');
        const customText = projectRegion.getAttribute('data-cursor-label');
        setCursorLabel(customText || '查看项目');
      } else {
        setMode('default');
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isFinePointer, isVisible, mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Outer Spring Follower Ring / Contextual Project Pill */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPressed ? 0.86 : mode === 'interactive' ? 1.35 : 1,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 flex items-center justify-center"
      >
        {mode === 'project' ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0C0C0C]/90 text-[#D7E2EA] border border-[#D7E2EA]/60 backdrop-blur-md shadow-[0_10px_30px_rgba(118,33,176,0.45)] whitespace-nowrap">
            <span className="text-xs font-medium tracking-widest uppercase">
              {cursorLabel}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#D7E2EA]" />
          </div>
        ) : (
          <div
            className={`rounded-full transition-all duration-200 ${
              mode === 'interactive'
                ? 'w-11 h-11 border-2 border-[#D7E2EA] bg-[#B600A8]/15 shadow-[0_0_24px_rgba(182,0,168,0.45)]'
                : 'w-9 h-9 border border-[#D7E2EA]/45 bg-[#D7E2EA]/[0.03] shadow-[0_0_16px_rgba(215,226,234,0.12)]'
            }`}
          />
        )}
      </motion.div>

      {/* Inner Precision Center Dot (mix-blend-difference so it stays visible on both #0C0C0C and #FFFFFF sections) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible && mode !== 'project' ? 1 : 0,
          scale: isPressed ? 1.5 : mode === 'interactive' ? 0.55 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D7E2EA] mix-blend-difference"
      />
    </div>
  );
};
