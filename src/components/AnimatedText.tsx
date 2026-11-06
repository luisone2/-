import React, { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { calculateCharScrollRange } from '../utils/portfolioMath';

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none" aria-hidden="true">
        {char === ' ' ? '\u00A0' : char}
      </span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = Array.from(text);
  const totalChars = chars.length;

  return (
    <p
      ref={containerRef}
      aria-label={text}
      className={`flex flex-wrap justify-center ${className}`}
      style={style}
    >
      {chars.map((char, idx) => {
        if (char === '\n') {
          return <span key={idx} className="basis-full h-3" aria-hidden="true" />;
        }
        const range = calculateCharScrollRange(idx, totalChars);
        return (
          <AnimatedChar
            key={idx}
            char={char}
            progress={scrollYProgress}
            range={range}
          />
        );
      })}
    </p>
  );
};
