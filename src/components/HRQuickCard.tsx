import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Copy,
  Check,
  X,
  FileText,
  Download,
  Sparkles,
  Upload,
  RotateCcw,
  ChevronUp,
  Briefcase,
  MapPin,
  Clock,
  Wrench,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  DEFAULT_HR_QUICK_PROFILE,
  buildHrCandidateSummaryText,
  generateDeterministicQrMatrix,
  shouldShowHrFloatingCard,
} from '../utils/portfolioMath';
import logo from './logo.svg';

const CUSTOM_QR_STORAGE_KEY = 'luis_portfolio_wechat_qr_v1';

interface WeChatQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const WeChatQrModal: React.FC<WeChatQrModalProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  onOpenContact,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customQrUrl, setCustomQrUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_QR_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const qrMatrix = generateDeterministicQrMatrix('wechat:15852182789:LuisLi', 21);

  const triggerCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text)?.catch(() => {});
    setCopiedKey(key);
    try {
      confetti({
        particleCount: 24,
        spread: 52,
        origin: { y: 0.75 },
        colors: ['#B600A8', '#7621B0', '#D7E2EA', '#38BDF8'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore confetti error in restricted canvas environments
    }
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  const handleUploadQr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (result) {
        setCustomQrUrl(result);
        try {
          localStorage.setItem(CUSTOM_QR_STORAGE_KEY, result);
        } catch {
          // Ignore storage quota errors
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetQr = () => {
    setCustomQrUrl(null);
    try {
      localStorage.removeItem(CUSTOM_QR_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const remarkTemplates = [
    'HR-UI视觉设计面试沟通',
    'HR-AI设计岗位沟通',
    '设计负责人-作品集交流',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wechat-qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            'linear-gradient(150deg, rgba(26, 32, 48, 0.62) 0%, rgba(12, 15, 24, 0.52) 100%)',
          backdropFilter: 'blur(38px) saturate(200%)',
          WebkitBackdropFilter: 'blur(38px) saturate(200%)',
          boxShadow:
            '0 36px 96px rgba(0, 0, 0, 0.76), inset 0 1.5px 1px rgba(255, 255, 255, 0.34), inset 0 -1px 1px rgba(255, 255, 255, 0.08), inset 0 0 36px rgba(120, 160, 255, 0.07)',
        }}
        className="relative w-full max-w-[740px] rounded-[36px] sm:rounded-[44px] border border-white/25 p-6 sm:p-8 md:p-10 text-[#D7E2EA] overflow-hidden"
      >
        {/* Top Specular Glass Rim Catchlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
        />

        {/* Subtle Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[220px] bg-gradient-to-b from-[#7621B0]/30 via-[#1e3fd8]/16 to-transparent blur-3xl"
        />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-start justify-between gap-4 pb-5 border-b border-white/15">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/75">
              <span className="whitespace-nowrap">(WECHAT & DIRECT CONTACT)</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-normal whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                微信同号 · 24h 内快速响应
              </span>
            </div>
            <h2
              id="wechat-qr-modal-title"
              className="hero-heading text-2xl sm:text-3xl font-black uppercase tracking-tight whitespace-nowrap"
            >
              微信扫码与求职名片
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭微信二维码弹窗"
            className="p-2.5 rounded-full border border-white/25 bg-white/[0.06] text-[#D7E2EA] hover:bg-white hover:text-[#0C0C0C] transition-colors cursor-pointer shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 2-Column Content */}
        <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: QR Code Frame (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center gap-3">
            <div className="relative w-full max-w-[236px] aspect-square rounded-[28px] border border-white/25 bg-white/[0.07] p-4 flex flex-col items-center justify-center shadow-[0_18px_42px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] group">
              {customQrUrl ? (
                <img
                  src={customQrUrl}
                  alt="李翰林 微信二维码"
                  className="w-full h-full object-contain rounded-2xl bg-white p-2"
                />
              ) : (
                <div className="relative w-full h-full rounded-2xl bg-white p-3.5 flex items-center justify-center shadow-inner">
                  <svg
                    viewBox="0 0 21 21"
                    className="w-full h-full"
                    shapeRendering="crispEdges"
                    role="img"
                    aria-label="李翰林 微信名片二维码"
                  >
                    {qrMatrix.map((row, rIdx) =>
                      row.map((cell, cIdx) =>
                        cell ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width={1}
                            height={1}
                            fill="#0C0C0C"
                            rx={0.12}
                          />
                        ) : null
                      )
                    )}
                  </svg>
                  {/* Center Brand Avatar Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-[#0C0C0C] border-2 border-white shadow-md flex items-center justify-center p-1.5">
                      <img
                        src={logo}
                        alt="Luis Li"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom QR Image Upload Controls */}
            <div className="flex items-center gap-2 text-[11px] text-[#D7E2EA]/75">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadQr}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.14] hover:border-white/40 text-[#D7E2EA]/90 hover:text-white transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
              >
                <Upload className="w-3 h-3" />
                <span>{customQrUrl ? '更换二维码图片' : '上传微信二维码实图'}</span>
              </button>
              {customQrUrl && (
                <button
                  type="button"
                  onClick={handleResetQr}
                  title="恢复默认名片码"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/20 bg-white/[0.06] hover:border-rose-400/60 text-[#D7E2EA]/75 hover:text-rose-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Direct WeChat Info & Quick Actions (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {/* Candidate Identity Block */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-wide text-white whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  李翰林 · Luis Li
                </span>
                <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/80 whitespace-nowrap">
                  (2027 届本科 · GPA 3.65/4.0)
                </span>
              </div>
              <p className="text-xs sm:text-sm font-light text-[#D7E2EA]/85 leading-relaxed">
                南京理工大学泰州科技学院 · 数字媒体艺术 · 现居武汉（支持异地到岗）
              </p>
            </div>

            {/* Primary WeChat ID / Phone Copy Box */}
            <div className="rounded-[24px] border border-white/20 bg-white/[0.07] p-4 flex items-center justify-between gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/70 whitespace-nowrap">
                  微信号 / 手机同号 (WECHAT ID)
                </span>
                <span className="text-lg sm:text-xl font-semibold tracking-wider text-white tabular-nums whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                  158-5218-2789
                </span>
              </div>
              <button
                type="button"
                onClick={() => triggerCopy('wechat-id', '15852182789')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white bg-white text-[#0C0C0C] hover:bg-[#D7E2EA] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 whitespace-nowrap shadow-[0_6px_20px_rgba(255,255,255,0.18)]"
              >
                {copiedKey === 'wechat-id' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已复制微信号</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制微信号</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Friend Request Remark Copy Templates */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/70">
                点击复制好友申请备注（方便第一时间通过）
              </span>
              <div className="flex flex-wrap gap-2">
                {remarkTemplates.map((remark) => {
                  const isCopied = copiedKey === remark;
                  return (
                    <button
                      key={remark}
                      type="button"
                      onClick={() => triggerCopy(remark, remark)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/50 bg-white/[0.06] hover:bg-white/[0.14] text-xs font-light text-[#D7E2EA]/95 hover:text-white transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    >
                      {isCopied ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#D7E2EA]/65" />
                      )}
                      <span>{isCopied ? '已复制备注' : remark}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Modal Action Row */}
            <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  triggerCopy('full-card', buildHrCandidateSummaryText(DEFAULT_HR_QUICK_PROFILE))
                }
                className="inline-flex items-center gap-1.5 text-xs text-[#D7E2EA]/90 hover:text-white underline-offset-4 hover:underline cursor-pointer whitespace-nowrap"
              >
                {copiedKey === 'full-card' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已复制完整求职名片文本</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#D7E2EA]/75" />
                    <span>一键复制完整求职速览（粘贴至飞书/企微）</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenResume();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/25 bg-white/[0.06] hover:bg-white/[0.15] hover:border-white/50 text-xs font-medium text-white transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>在线简历</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/25 bg-white/[0.06] hover:bg-white/[0.15] hover:border-white/50 text-xs font-medium text-white transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>面试邀约</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface HRQuickCardProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
  onOpenWeChatQr: () => void;
}

export const HRQuickCard: React.FC<HRQuickCardProps> = ({
  onOpenResume,
  onOpenContact,
  onOpenWeChatQr,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isHeroInView, setIsHeroInView] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight || 800;
      const inHero = !shouldShowHrFloatingCard(window.scrollY, vh);
      setIsHeroInView(inHero);
      if (inHero) {
        setIsExpanded(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text)?.catch(() => {});
    setCopiedField(key);
    try {
      confetti({
        particleCount: 22,
        spread: 50,
        origin: { x: 0.9, y: 0.85 },
        colors: ['#B600A8', '#7621B0', '#D7E2EA', '#38BDF8'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore confetti errors
    }
    setTimeout(() => {
      setCopiedField((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const isActiveOrHovered = isExpanded || isHovered;

  return (
    <aside
      aria-label="HR 一键求职速览悬浮卡"
      aria-hidden={isHeroInView}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isHeroInView ? 0 : 1,
        transform: isHeroInView
          ? 'translate3d(120px, 20px, 0) scale(0.95)'
          : isActiveOrHovered
          ? 'translate3d(-12px, 0px, 0) scale(1)'
          : 'translate3d(96px, 0px, 0) scale(1)',
        pointerEvents: isHeroInView ? 'none' : 'auto',
        transition:
          'opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1), transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className="fixed right-0 bottom-4 sm:bottom-5 lg:bottom-6 z-40 flex flex-col items-end"
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="hr-quick-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                'linear-gradient(155deg, rgba(26, 33, 48, 0.54) 0%, rgba(12, 15, 24, 0.44) 100%)',
              backdropFilter: 'blur(34px) saturate(200%)',
              WebkitBackdropFilter: 'blur(34px) saturate(200%)',
              boxShadow:
                '0 32px 80px rgba(0, 0, 0, 0.72), inset 0 1.5px 1px rgba(255, 255, 255, 0.34), inset 0 -1px 1px rgba(255, 255, 255, 0.08), inset 0 0 32px rgba(120, 160, 255, 0.07)',
            }}
            className="relative mb-3 w-[340px] sm:w-[396px] rounded-[32px] sm:rounded-[36px] border border-white/25 p-5 sm:p-6 text-[#D7E2EA] overflow-hidden"
          >
            {/* Top Specular Glass Rim Catchlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
            />

            {/* Ambient Top Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[360px] h-[160px] bg-gradient-to-b from-[#7621B0]/30 via-[#1e3fd8]/16 to-transparent blur-2xl"
            />

            {/* 1. Card Top Index & Availability Header */}
            <div className="relative z-10 flex items-center justify-between gap-2 pb-3.5 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-white/90 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  (HR 求职速览 · AVAILABLE NOW)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-label="收起求职速览悬浮卡"
                className="p-1.5 rounded-full border border-white/25 bg-white/[0.06] text-white/80 hover:text-[#0C0C0C] hover:bg-white transition-colors cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Candidate Core Title */}
            <div className="relative z-10 mt-3.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  李翰林 · Luis Li
                </h3>
                <p className="text-xs font-light text-[#D7E2EA]/85 mt-0.5 whitespace-nowrap">
                  南京理工大学泰州科技学院 · 数字媒体艺术 · 2027届
                </p>
              </div>
              <span className="text-xs font-semibold tabular-nums text-white border border-white/25 bg-white/[0.08] rounded-full px-2.5 py-0.5 shrink-0 whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                GPA 3.65/4.0
              </span>
            </div>

            {/* 3. 2x2 Editorial Fact Grid (Translucent Glass Sub-Cells) */}
            <div className="relative z-10 mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-white/18 bg-white/[0.06] hover:bg-white/[0.11] p-3 flex flex-col gap-1 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D7E2EA]/70">
                  <Briefcase className="w-3 h-3" />
                  <span>01 · 意向岗位</span>
                </div>
                <span className="text-xs font-medium text-white leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  UI视觉 / AI设计 / 品牌
                </span>
              </div>

              <div className="rounded-2xl border border-white/18 bg-white/[0.06] hover:bg-white/[0.11] p-3 flex flex-col gap-1 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D7E2EA]/70">
                  <Clock className="w-3 h-3" />
                  <span>02 · 到岗时间</span>
                </div>
                <span className="text-xs font-medium text-white leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  随时到岗 · 实习/校招
                </span>
              </div>

              <div className="rounded-2xl border border-white/18 bg-white/[0.06] hover:bg-white/[0.11] p-3 flex flex-col gap-1 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D7E2EA]/70">
                  <MapPin className="w-3 h-3" />
                  <span>03 · 期望城市</span>
                </div>
                <span className="text-xs font-medium text-white leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  现居武汉 · 支持异地
                </span>
              </div>

              <div className="rounded-2xl border border-white/18 bg-white/[0.06] hover:bg-white/[0.11] p-3 flex flex-col gap-1 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D7E2EA]/70">
                  <Wrench className="w-3 h-3" />
                  <span>04 · 核心工作流</span>
                </div>
                <span className="text-xs font-medium text-white leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  Figma · C4D · ComfyUI
                </span>
              </div>
            </div>

            {/* 4. Direct Contact & WeChat QR Action Row */}
            <div className="relative z-10 mt-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenWeChatQr();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-white text-[#0C0C0C] hover:bg-[#D7E2EA] text-xs font-semibold tracking-wider transition-colors cursor-pointer shadow-[0_6px_20px_rgba(255,255,255,0.18)]"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>微信二维码</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      'summary',
                      buildHrCandidateSummaryText(DEFAULT_HR_QUICK_PROFILE)
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full border border-white/25 bg-white/[0.07] hover:bg-white/[0.15] hover:border-white/50 text-xs font-medium text-white transition-colors cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                >
                  {copiedField === 'summary' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">已复制速览</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制求职名片</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Copy Phone & Email Row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('phone', '15852182789')}
                  className="inline-flex items-center justify-between px-3 py-2 rounded-2xl border border-white/18 bg-white/[0.06] hover:bg-white/[0.14] hover:border-white/40 text-[11px] text-white/90 hover:text-white transition-colors cursor-pointer tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <span>微信/电: 15852182789</span>
                  {copiedField === 'phone' ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/60 shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy('email', 'lihanlin_luis@163.com')}
                  className="inline-flex items-center justify-between px-3 py-2 rounded-2xl border border-white/18 bg-white/[0.06] hover:bg-white/[0.14] hover:border-white/40 text-[11px] text-white/90 hover:text-white transition-colors cursor-pointer truncate shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <span className="truncate">lihanlin_luis@163.com</span>
                  {copiedField === 'email' ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/60 shrink-0 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* 5. Bottom Resume & Interview Trigger Bar */}
            <div className="relative z-10 mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenResume();
                  }}
                  className="inline-flex items-center gap-1 text-white/85 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>在线简历</span>
                </button>

                <a
                  href="/assets/aistudio/___-_____v5_b0c6c281.pdf"
                  download="李翰林_个人简历.pdf"
                  className="inline-flex items-center gap-1 text-white/85 hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 PDF</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  onOpenContact();
                }}
                className="inline-flex items-center gap-1 text-white font-medium hover:text-[#D7E2EA] underline-offset-4 hover:underline cursor-pointer"
              >
                <span>发送面试邀约</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Dock Capsule Trigger (Dark Apple Liquid Frosted Glass) */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(28, 35, 52, 0.56) 0%, rgba(12, 15, 24, 0.46) 100%)',
          backdropFilter: 'blur(28px) saturate(195%)',
          WebkitBackdropFilter: 'blur(28px) saturate(195%)',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.68), inset 0 1.5px 1px rgba(255, 255, 255, 0.32), inset 0 -1px 1px rgba(255, 255, 255, 0.08)',
        }}
        className="flex items-center gap-2 rounded-full border border-white/25 hover:border-white/50 p-1.5 pl-4 transition-colors duration-200"
      >
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label="展开或收起 HR 求职速览卡片"
          className="flex items-center gap-2.5 text-left cursor-pointer pr-1 group"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-white group-hover:text-[#D7E2EA] transition-colors whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              HR 求职速览
            </span>
            <span className="text-[10px] font-light text-[#D7E2EA]/80 whitespace-nowrap hidden sm:inline">
              2027届 · 随时到岗
            </span>
          </div>
          <ChevronUp
            className={`w-3.5 h-3.5 text-white/75 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <button
          type="button"
          onClick={onOpenWeChatQr}
          aria-label="打开微信二维码弹窗"
          title="微信扫码添加"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-[#0C0C0C] hover:bg-[#D7E2EA] text-xs font-semibold tracking-wider transition-colors cursor-pointer shrink-0 shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">微信码</span>
        </button>
      </div>
    </aside>
  );
};
