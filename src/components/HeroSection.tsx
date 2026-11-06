import React from 'react';
import { FadeIn } from './FadeIn';
import GradientText from './GradientText';
import PillNav from './PillNav';
import GradientASCII from './GradientASCII';
import { MagneticToolkitDock } from './MagneticToolkitDock';
import logo from './logo.svg';

interface HeroSectionProps {
  onOpenContact: () => void;
  onOpenResume?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenContact,
  onOpenResume,
}) => {
  return (
    <section
      id="hero"
      className="relative h-screen w-full flex flex-col justify-between bg-[#0C0C0C] select-none"
      style={{ overflowX: 'clip' }}
    >
      {/* Opening Screen Gradient ASCII Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <div style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative' }}>
          <GradientASCII
            colors={['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']}
            shape="horizon"
            characters=" =+xX0S8#@"
            cellSize={18}
            density={0.8}
          />
        </div>
      </div>

      {/* Top Header & Heading Wrapper */}
      <div className="w-full relative z-20 pointer-events-none">
        {/* Navbar */}
        <div className="pointer-events-auto">
          <PillNav
            logo={logo}
            logoAlt="Company"
            items={[
              { label: '首页', enLabel: 'Home', href: '/' },
              { label: '关于', enLabel: 'About', href: '/about' },
              { label: '能力', enLabel: 'Journal', href: '/journal' },
              { label: '作品', enLabel: 'Photos', href: '/photos' }
            ]}
            activeHref="/"
            itemStyle="pill"
            hoverEffect="fill"
            indicator="dot"
            size="lg"
            onOpenResume={onOpenResume}
          />
        </div>

        {/* Massive Hero Heading */}
        <div className="overflow-hidden w-full px-2 sm:px-4 pb-2 sm:pb-4 pointer-events-none">
          <FadeIn delay={0.15} y={40} className="w-full">
            <h1
              className="font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[12.5vw] sm:text-[13.2vw] md:text-[13.8vw] lg:text-[14.2vw] mt-16 sm:mt-20 md:mt-24 lg:mt-28"
              style={{
                background: 'none',
                WebkitTextFillColor: 'initial',
              }}
            >
              <GradientText
                colors={["#ffffff", "#dce8f5", "#94a9c4"]}
                animationSpeed={8}
                variant="flow"
                glow={0.4}
              >
                嗨<span className="inline-block -mr-[0.38em]">，</span>我是 Luis
              </GradientText>
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-6 lg:px-[60px] pb-7 sm:pb-8 lg:pb-[36px] relative z-20 pointer-events-none">
        <FadeIn delay={0.35} y={20}>
          <div
            className="flex flex-col items-start text-left select-none whitespace-nowrap"
            style={{ whiteSpace: 'nowrap', lineHeight: 1.4 }}
          >
            {/* First line: Main title */}
            <span
              className="text-white font-semibold tracking-wide whitespace-nowrap text-sm sm:text-base lg:text-[17px]"
              style={{
                fontWeight: 600,
                color: '#FFFFFF',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              UI/UX设计 · 2027届
            </span>
            {/* Second line: Sub title */}
            <span
              className="whitespace-nowrap tracking-wide text-xs sm:text-[13px] lg:text-[14px]"
              style={{
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.55)',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              游戏UI / 网页 / 品牌视觉 / AI辅助设计
            </span>
          </div>
        </FadeIn>

        <div className="pointer-events-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-[34px]">
          <FadeIn delay={0.5} y={20}>
            <MagneticToolkitDock />
          </FadeIn>
        </div>

        <FadeIn delay={0.35} y={20}>
          <div
            className="flex flex-col items-start sm:items-end text-left sm:text-right select-none whitespace-nowrap pointer-events-auto"
            style={{ whiteSpace: 'nowrap', lineHeight: 1.4 }}
          >
            {/* Primary Line: Email (Aligned 1:1 with Left First Line) */}
            <a
              href="mailto:lihanlin_luis@163.com"
              className="font-mono font-semibold tracking-wide whitespace-nowrap text-sm sm:text-base lg:text-[17px] transition-opacity hover:opacity-80"
              style={{
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily:
                  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              lihanlin_luis@163.com
            </a>
            {/* Secondary Line: WeChat (Aligned 1:1 with Left Second Line) */}
            <span
              className="whitespace-nowrap tracking-wide text-xs sm:text-[13px] lg:text-[14px]"
              style={{
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.55)',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
              }}
            >
              微信: 15852182789
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

