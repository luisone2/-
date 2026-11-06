import React, { useEffect, useRef, useState } from 'react';
import { calculateMagnetPosition } from '../utils/portfolioMath';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const magnetRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ isActive: false, x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;
      const rect = magnetRef.current.getBoundingClientRect();
      const next = calculateMagnetPosition(
        e.clientX,
        e.clientY,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        padding,
        strength
      );

      setState((prev) => {
        if (
          prev.isActive === next.isActive &&
          Math.abs(prev.x - next.x) < 0.1 &&
          Math.abs(prev.y - next.y) < 0.1
        ) {
          return prev;
        }
        return next;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength]);

  return (
    <div ref={magnetRef} className={`inline-block ${className}`}>
      <div
        style={{
          transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
          transition: state.isActive ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
