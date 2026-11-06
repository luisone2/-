import React from 'react';

export interface GradientTextProps {
  children?: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  variant?: 'flow' | 'linear' | 'radial' | 'pulse' | string;
  glow?: number;
  style?: React.CSSProperties;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children = 'Add a splash of color!',
  className = '',
  colors = ['#ffffff', '#bcc6cf', '#3b4147'],
  animationSpeed = 8,
  showBorder = false,
  variant: _variant = 'flow',
  glow = 0.4,
  style = {},
}) => {
  const gradientColors = colors.join(', ');

  const glowFilter = glow > 0
    ? `drop-shadow(0 0 ${glow * 24}px rgba(188, 198, 207, ${Math.min(glow, 0.75)}))`
    : 'none';

  return (
    <>
      <style>{`
        @keyframes gradient-flow-anim {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <span
        className={`gradient-text-container relative inline-block ${className}`}
        style={{
          filter: glowFilter,
          ...style,
        }}
      >
        <span
          className="gradient-text-inner inline-block"
          style={{
            backgroundImage: `linear-gradient(90deg, ${gradientColors}, ${colors[0]})`,
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            animation: `gradient-flow-anim ${animationSpeed}s ease-in-out infinite`,
          }}
        >
          {children}
        </span>
        {showBorder && (
          <span className="pointer-events-none absolute inset-0 rounded-lg border border-white/20" />
        )}
      </span>
    </>
  );
};

export default GradientText;
