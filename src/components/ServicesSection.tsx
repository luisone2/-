import React from 'react';
import { FadeIn } from './FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: '01',
    name: '品牌视觉设计',
    description: '从 Logo、VI 规范到全场景物料落地',
  },
  {
    number: '02',
    name: 'UI/UX 界面设计',
    description: 'Figma 高保真原型、组件系统，覆盖 App / Web / 游戏 UI',
  },
  {
    number: '03',
    name: '三维与动效',
    description: 'Cinema 4D 产品渲染、三渲二、After Effects 动态短片',
  },
  {
    number: '04',
    name: '生成式 AI 视觉',
    description: 'ComfyUI 可控管线、Runway 动态视频、AI 概念探索',
  },
  {
    number: '05',
    name: '平面与海报',
    description: '活动主视觉、学术会议物料、科普展板',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="skills"
      aria-label="能力"
      className="w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="text-[#0C0C0C] font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          能力
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto flex flex-col">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.1}
            y={30}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-10 py-8 sm:py-10 md:py-12"
            style={{
              borderTop:
                i === 0 ? '1px solid rgba(12, 12, 12, 0.15)' : undefined,
              borderBottom: '1px solid rgba(12, 12, 12, 0.15)',
            }}
          >
            {/* Left: Huge Number */}
            <span
              className="font-black text-[#0C0C0C] leading-none shrink-0 sm:w-[220px] md:w-[260px]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {service.number}
            </span>

            {/* Right: Service Name + Description stacked vertically */}
            <div className="flex flex-col gap-2 sm:gap-3 flex-1 max-w-2xl">
              <h3
                className="font-medium uppercase text-[#0C0C0C] tracking-wide"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {service.name}
              </h3>
              <p
                className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] opacity-60"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
