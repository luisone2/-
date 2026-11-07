import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowUp,
  Copy,
  Check,
  Download,
  QrCode,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FadeIn } from './FadeIn';
import { ContactButton, LiveProjectButton } from './Buttons';

interface FooterSectionProps {
  onOpenContact: () => void;
  onOpenResume: () => void;
  onOpenWeChatQr?: () => void;
}

interface SpotlightCardProps {
  indexNumber: string;
  category: string;
  title: string;
  valueText: string;
  href?: string;
  description: string;
  actionNode: React.ReactNode;
  delay: number;
}

const SpotlightContactCard: React.FC<SpotlightCardProps> = ({
  indexNumber,
  category,
  title,
  valueText,
  href,
  description,
  actionNode,
  delay,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <FadeIn delay={delay} y={30} className="h-full">
      <motion.article
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full rounded-[36px] sm:rounded-[44px] border-2 border-[#D7E2EA]/25 hover:border-[#D7E2EA] bg-[#0C0C0C] p-6 sm:p-8 md:p-9 flex flex-col justify-between gap-8 overflow-hidden transition-colors duration-200 shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
      >
        {/* Interactive Mouse-Following Radial Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(480px circle at ${mousePos.x}px ${mousePos.y}px, rgba(215, 226, 234, 0.11), rgba(118, 33, 176, 0.08) 45%, transparent 75%)`,
          }}
        />

        {/* Top Row: Editorial Index Number + Action Button */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span
              className="font-bold text-[#D7E2EA] leading-[1.08] tracking-[0.06em] px-0.5 select-none transition-transform duration-200 group-hover:translate-x-1"
              style={{ fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)' }}
            >
              {indexNumber}
            </span>
            <div className="shrink-0">{actionNode}</div>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[#D7E2EA]/55 font-light uppercase tracking-widest text-xs sm:text-sm">
              ({category})
            </span>
            <span aria-hidden="true" className="text-[#D7E2EA]/30">
              ·
            </span>
            <h3 className="text-[#D7E2EA] font-medium uppercase tracking-wide text-base sm:text-lg">
              {title}
            </h3>
          </div>
        </div>

        {/* Middle Divider Hairline */}
        <div
          aria-hidden="true"
          className="relative z-10 w-full h-px bg-[#D7E2EA]/15 group-hover:bg-[#D7E2EA]/35 transition-colors duration-200"
        />

        {/* Bottom Row: Primary Value & Context Description */}
        <div className="relative z-10 flex flex-col gap-2">
          {href ? (
            <a
              href={href}
              className="inline-flex items-center gap-2 text-lg sm:text-xl xl:text-2xl font-medium tracking-wide text-[#D7E2EA] hover:text-white transition-colors whitespace-nowrap tabular-nums group/link"
            >
              <span>{valueText}</span>
              <ArrowUpRight className="w-5 h-5 shrink-0 text-[#D7E2EA]/50 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
            </a>
          ) : (
            <div className="text-lg sm:text-xl xl:text-2xl font-medium tracking-wide text-[#D7E2EA] whitespace-nowrap tabular-nums">
              {valueText}
            </div>
          )}
          <p className="text-xs sm:text-sm font-light leading-relaxed text-[#D7E2EA]/60">
            {description}
          </p>
        </div>
      </motion.article>
    </FadeIn>
  );
};

export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenContact,
  onOpenResume,
  onOpenWeChatQr,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text)?.catch(() => {});
    setCopiedKey(key);
    try {
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.85 },
        colors: ['#B600A8', '#7621B0', '#D7E2EA', '#38BDF8'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore if environment blocks canvas confetti
    }
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="contact"
      aria-label="全局页脚与联系方式"
      className="relative z-20 w-full bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] border-t-2 border-[#D7E2EA]/25 -mt-8 sm:-mt-10 pt-14 sm:pt-20 md:pt-24 pb-10 sm:pb-12 px-5 sm:px-8 md:px-12 overflow-hidden shadow-[0_-24px_60px_rgba(0,0,0,0.85)]"
    >

      {/* Subtle Horizon Ambient Glow matching Hero & Brand Buttons */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[680px] sm:w-[1000px] h-[360px] bg-gradient-to-b from-[#7621B0]/18 via-[#1e3fd8]/10 to-transparent blur-3xl opacity-80"
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-10 sm:gap-12 md:gap-14">
        {/* 1. Top Editorial Header & Primary CTA Split */}
        <div className="flex flex-col gap-5 sm:gap-6 pb-8 sm:pb-10 border-b border-[#D7E2EA]/15">
          <FadeIn delay={0} y={24}>
            {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/65">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-normal">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                武汉 · 可随时到岗
              </span>
              <span aria-hidden="true">·</span>
              <span>2027 届数字媒体艺术本科 · GPA 3.65/4.0</span>
              <span aria-hidden="true">·</span>
              <span>求职意向：UI视觉设计</span>
              <span aria-hidden="true">·</span>
              <span>AI 设计</span>
              <span aria-hidden="true">·</span>
              <span>品牌视觉设计</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={32}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
              <div className="flex flex-col gap-3">
                <h2
                  className="hero-heading font-black uppercase leading-none tracking-tight whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(2.5rem, 7vw, 104px)',
                  }}
                >
                  期待加入您的团队
                </h2>
                <p
                  className="text-[#D7E2EA]/75 font-light leading-relaxed max-w-2xl"
                  style={{ fontSize: 'clamp(0.9rem, 1.35vw, 1.125rem)' }}
                >
                  正在寻找 UI/UX 界面、品牌视觉与 AIGC 设计方向的实习或校招全职机会。具备从
                  Figma 规范化设计系统、Cinema 4D 三维渲染到 ComfyUI 可控工作流的完整落地能力，诚邀 HR 与设计负责人审阅简历或发送面试邀约。
                </p>
              </div>

              {/* Signature Portfolio CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <ContactButton
                  label="发送面试邀约"
                  onClick={onOpenContact}
                />
                <LiveProjectButton
                  label="在线预览简历"
                  onClick={onOpenResume}
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 2. Interactive 3-Column Editorial Contact Matrix (01 / 02 / 03) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 01: Phone & WeChat */}
          <SpotlightContactCard
            indexNumber="01"
            category="即时联系"
            title="电话与微信"
            valueText="+86 158-5218-2789"
            href="tel:15852182789"
            description="工作日与周末均保持畅通，支持点击右上角扫码添加微信或直接致电沟通面试安排。"
            delay={0.15}
            actionNode={
              <div className="flex items-center gap-2">
                {onOpenWeChatQr && (
                  <button
                    type="button"
                    onClick={onOpenWeChatQr}
                    aria-label="打开微信二维码弹窗"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C] hover:bg-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>微信码</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCopy('phone', '15852182789')}
                  aria-label="复制电话号码"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D7E2EA]/35 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#D7E2EA]"
                >
                  {copiedKey === 'phone' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制号码</span>
                    </>
                  )}
                </button>
              </div>
            }
          />

          {/* Card 02: Email */}
          <SpotlightContactCard
            indexNumber="02"
            category="投递与邀约"
            title="求职邮箱"
            valueText="lihanlin_luis@163.com"
            href="mailto:lihanlin_luis@163.com"
            description="接收 HR 面试通知、笔试考核题目及岗位沟通邮件，工作日 24 小时内快速回复。"
            delay={0.22}
            actionNode={
              <button
                type="button"
                onClick={() => handleCopy('email', 'lihanlin_luis@163.com')}
                aria-label="复制邮箱地址"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D7E2EA]/35 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#D7E2EA]"
              >
                {copiedKey === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制邮箱</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制邮箱</span>
                  </>
                )}
              </button>
            }
          />

          {/* Card 03: Location, Education & Direct PDF Resume */}
          <SpotlightContactCard
            indexNumber="03"
            category="求职档案"
            title="院校与到岗状态"
            valueText="武汉 · 可随时到岗"
            description="南京理工大学泰州科技学院 · 数字媒体艺术（2027 届本科 · GPA 3.65/4.0 · 支持异地到岗）"
            delay={0.29}
            actionNode={
              <a
                href="/assets/aistudio/___-_____v5_b0c6c281.pdf"
                download="李翰林_个人简历.pdf"
                aria-label="下载 PDF 简历原件"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D7E2EA]/35 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#D7E2EA]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载简历</span>
              </a>
            }
          />
        </div>

        {/* 3. Bottom Editorial Sub-Footer Bar */}
        <div className="pt-8 border-t border-[#D7E2EA]/15 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#D7E2EA]/60 font-light">
          {/* Left: Brand Identity */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="whitespace-nowrap leading-none">
              <span
                style={{
                  fontWeight: 600,
                  color: '#FFFFFF',
                  fontSize: '15px',
                }}
              >
                李翰林
              </span>
              {' '}
              <span
                style={{
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                }}
              >
                Li Hanlin
              </span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-[#D7E2EA]/30">
              ·
            </span>
            <span className="hidden sm:inline uppercase tracking-wider text-xs text-[#D7E2EA]/65">
              UI视觉设计师 · AI 设计师 · 品牌设计师
            </span>
          </div>

          {/* Center: Clean Typography Navigation Links */}
          <nav
            aria-label="页脚快速导航"
            className="flex items-center gap-6 sm:gap-8 text-xs uppercase tracking-widest"
          >
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[#D7E2EA]/70 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              首页
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="text-[#D7E2EA]/70 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              关于我
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('skills')}
              className="text-[#D7E2EA]/70 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              能力
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('projects')}
              className="text-[#D7E2EA]/70 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              作品
            </button>
          </nav>

          {/* Right: Copyright & Tactile Back to Top */}
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-wider tabular-nums whitespace-nowrap">
              © 2026 Luis Li. All rights reserved.
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="回到顶部"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] hover:text-[#0C0C0C] hover:bg-[#D7E2EA] hover:border-[#D7E2EA] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="text-xs font-medium">顶部</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
