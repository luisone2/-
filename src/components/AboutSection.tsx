import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './Buttons';

interface AboutSectionProps {
  onOpenContact: () => void;
  onOpenResume: () => void;
}

const ABOUT_TEXT =
  '我是 Luis（李翰林），南京理工大学泰州科技学院数字媒体艺术本科在读（2027 届，GPA 3.65/4.0）。在校期间主导过完整品牌 VI 项目（南京粉红塔育儿园），做过科技馆科普视觉与学术会议物料，也在用 Figma、C4D 和 ComfyUI 搭建自己的视觉工作流。\n\n我相信好的设计是理性网格加感性叙事的结合。';

const CORNER_IMAGES = {
  topLeftMoon:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
  bottomLeftObject:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
  topRightLego:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
  bottomRightGroup:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenContact: _onOpenContact,
  onOpenResume,
}) => {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Top-Left: Moon Icon */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-0"
      >
        <img
          src={CORNER_IMAGES.topLeftMoon}
          alt="3D 月亮雕塑"
          referrerPolicy="no-referrer"
          className="w-full h-auto object-contain block"
        />
      </FadeIn>

      {/* Bottom-Left: 3D Object */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none select-none z-0"
      >
        <img
          src={CORNER_IMAGES.bottomLeftObject}
          alt="3D 抽象雕塑"
          referrerPolicy="no-referrer"
          className="w-full h-auto object-contain block"
        />
      </FadeIn>

      {/* Top-Right: Lego Icon */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-0"
      >
        <img
          src={CORNER_IMAGES.topRightLego}
          alt="3D 积木图标"
          referrerPolicy="no-referrer"
          className="w-full h-auto object-contain block"
        />
      </FadeIn>

      {/* Bottom-Right: 3D Group */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none select-none z-0"
      >
        <img
          src={CORNER_IMAGES.bottomRightGroup}
          alt="3D 几何组件"
          referrerPolicy="no-referrer"
          className="w-full h-auto object-contain block"
        />
      </FadeIn>

      {/* Center Content Column */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Heading + Text Block with gap-10 sm:gap-14 md:gap-16 */}
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              关于我
            </h2>
          </FadeIn>

          <AnimatedText
            text={ABOUT_TEXT}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        {/* Resume Button below text block with gap-16 sm:gap-20 md:gap-24 */}
        <div className="mt-16 sm:mt-20 md:mt-24">
          <FadeIn delay={0.2} y={20}>
            <ContactButton
              label="查看简历"
              onClick={onOpenResume}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
