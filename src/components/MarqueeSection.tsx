import React, { useEffect, useRef, useState } from 'react';
import { calculateMarqueeOffset } from '../utils/portfolioMath';

const MARQUEE_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const ROW_1_BASE = MARQUEE_IMAGES.slice(0, 11);
const ROW_2_BASE = MARQUEE_IMAGES.slice(11, 21);

const ROW_1_TRIPLED = [...ROW_1_BASE, ...ROW_1_BASE, ...ROW_1_BASE];
const ROW_2_TRIPLED = [...ROW_2_BASE, ...ROW_2_BASE, ...ROW_2_BASE];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [transforms, setTransforms] = useState({
    row1TranslateX: -200,
    row2TranslateX: 200,
  });

  useEffect(() => {
    const updateScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const { row1TranslateX, row2TranslateX } = calculateMarqueeOffset(
        window.scrollY,
        sectionTop,
        window.innerHeight
      );
      setTransforms({ row1TranslateX, row2TranslateX });
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="marquee"
      aria-label="Motion Showreel Marquee"
      className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col items-center gap-3 overflow-hidden"
    >
      {/* Row 1: Moves RIGHT on scroll */}
      <div
        className="flex gap-3 w-max"
        style={{
          transform: `translateX(${transforms.row1TranslateX}px)`,
          willChange: 'transform',
        }}
      >
        {ROW_1_TRIPLED.map((src, idx) => (
          <div
            key={`row1-${idx}`}
            className="w-[420px] h-[270px] shrink-0 rounded-2xl overflow-hidden bg-[#16181D]"
          >
            <img
              src={src}
              alt={`Motion showcase preview ${(idx % 11) + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-[420px] h-[270px] rounded-2xl object-cover block"
            />
          </div>
        ))}
      </div>

      {/* Row 2: Moves LEFT on scroll */}
      <div
        className="flex gap-3 w-max"
        style={{
          transform: `translateX(${transforms.row2TranslateX}px)`,
          willChange: 'transform',
        }}
      >
        {ROW_2_TRIPLED.map((src, idx) => (
          <div
            key={`row2-${idx}`}
            className="w-[420px] h-[270px] shrink-0 rounded-2xl overflow-hidden bg-[#16181D]"
          >
            <img
              src={src}
              alt={`Interactive 3D showcase preview ${(idx % 10) + 12}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-[420px] h-[270px] rounded-2xl object-cover block"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
