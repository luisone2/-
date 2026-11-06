import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { formatCountUpValue } from '../utils/portfolioMath';

export interface CountUpNumberProps {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  triggerOnMount?: boolean;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  target,
  decimals = 0,
  suffix = '',
  prefix = '',
  durationMs = 1350,
  triggerOnMount = false,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const shouldAnimate = triggerOnMount || isInView;

  const finalFormatted = formatCountUpValue(1, target, decimals, suffix);
  const zeroFormatted = formatCountUpValue(0, target, decimals, suffix);

  const [displayValue, setDisplayValue] = useState<string>(zeroFormatted);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayValue(zeroFormatted);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setDisplayValue(formatCountUpValue(progress, target, decimals, suffix));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [shouldAnimate, target, decimals, suffix, durationMs, zeroFormatted]);

  return (
    <span
      ref={ref}
      data-target={`${prefix}${finalFormatted}`}
      aria-label={`${prefix}${finalFormatted}`}
      className={`tabular-nums ${className}`}
    >
      {prefix}
      {displayValue}
    </span>
  );
};
