import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Upload,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { ProjectItem } from './ProjectsSection';
import { validateContactForm, ContactFormInput } from '../utils/portfolioMath';
import { ContactButton } from './Buttons';
import { CountUpNumber } from './CountUpNumber';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialService = 'UI/UX 视觉设计师',
}) => {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    service: initialService,
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={handleResetAndClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[32px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-6 sm:p-8 text-[#D7E2EA] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="contact-modal-title"
            className="hero-heading text-2xl sm:text-3xl font-black uppercase tracking-tight"
          >
            发送面试 / 沟通邀约
          </h2>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="关闭联系弹窗"
            className="p-2 rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-[#BBCCD7]" />
            <h3 className="text-xl font-semibold uppercase tracking-wide">
              已收到您的面试邀约
            </h3>
            <p className="text-sm text-[#D7E2EA]/80 font-light max-w-sm leading-relaxed">
              感谢您，{form.name}！Luis（李翰林）已收到您关于「{form.service}」岗位的沟通信息，将在 24 小时内通过 {form.email} 与您回复确认。
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-4 rounded-full border-2 border-[#D7E2EA] px-8 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer"
            >
              完成
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs uppercase tracking-widest text-[#D7E2EA]/70 mb-1.5"
              >
                您的姓名 / 称呼
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例如：张女士（XX 科技 HR / 设计负责人）"
                className="w-full rounded-2xl border border-[#D7E2EA]/30 bg-[#141414] px-4 py-3 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 focus:border-[#D7E2EA] focus:outline-none"
              />
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs uppercase tracking-widest text-[#D7E2EA]/70 mb-1.5"
              >
                联系邮箱
              </label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="hr@company.com"
                className="w-full rounded-2xl border border-[#D7E2EA]/30 bg-[#141414] px-4 py-3 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 focus:border-[#D7E2EA] focus:outline-none"
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-service"
                className="block text-xs uppercase tracking-widest text-[#D7E2EA]/70 mb-1.5"
              >
                意向招聘岗位方向
              </label>
              <select
                id="contact-service"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full rounded-2xl border border-[#D7E2EA]/30 bg-[#141414] px-4 py-3 text-sm text-[#D7E2EA] focus:border-[#D7E2EA] focus:outline-none"
              >
                <option value="UI/UX 视觉设计师">01 — UI/UX 视觉设计师</option>
                <option value="AI 设计师 / AIGC 视觉">02 — AI 设计师 / AIGC 视觉</option>
                <option value="品牌视觉设计师">03 — 品牌视觉设计师</option>
                <option value="三维与动效设计师">04 — 三维与动效设计师</option>
                <option value="综合视觉设计（实习 / 校招）">05 — 综合视觉设计（实习 / 校招）</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs uppercase tracking-widest text-[#D7E2EA]/70 mb-1.5"
              >
                面试时间或岗位说明
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="请简要说明意向面试时间、办公城市或岗位职责概述..."
                className="w-full rounded-2xl border border-[#D7E2EA]/30 bg-[#141414] px-4 py-3 text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/30 focus:border-[#D7E2EA] focus:outline-none resize-none"
              />
              {errors.message && (
                <p className="text-xs text-rose-400 mt-1">{errors.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <ContactButton type="submit" label="发送邀约" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquire,
}) => {
  if (!project) return null;
  return (
    <ProjectModalContent
      project={project}
      onClose={onClose}
      onInquire={onInquire}
    />
  );
};

const ProjectModalContent: React.FC<{
  project: ProjectItem;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}> = ({ project, onClose, onInquire }) => {
  // Build initial images list for current project
  const initialImages = [
    { id: '1', url: project.col1Img1, alt: `${project.name} 渲染图 1`, isCustom: false },
    { id: '2', url: project.col1Img2, alt: `${project.name} 渲染图 2`, isCustom: false },
    { id: '3', url: project.col2Img, alt: `${project.name} 渲染图 3`, isCustom: false },
  ];

  const storageKey = `project_gallery_state_${project.number}`;

  const loadSavedImages = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return initialImages;
  };

  const [galleryImages, setGalleryImages] = useState<
    Array<{ id: string; url: string; alt: string; isCustom?: boolean }>
  >(loadSavedImages);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state on project change
  useEffect(() => {
    setGalleryImages(loadSavedImages());
    setLightboxIndex(null);
  }, [project.number, project.col1Img1, project.col1Img2, project.col2Img]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : galleryImages.length - 1) : null
        );
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev < galleryImages.length - 1 ? prev + 1 : 0) : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryImages.length]);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const newImage = {
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            url: result,
            alt: `${project.name} 用户上传作品图`,
            isCustom: true,
          };
          setGalleryImages((prev) => {
            const updated = [...prev, newImage];
            try {
              sessionStorage.setItem(storageKey, JSON.stringify(updated));
            } catch {
              // ignore quota
            }
            return updated;
          });

          // Scroll to end of carousel smoothly
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({
                left: scrollContainerRef.current.scrollWidth,
                behavior: 'smooth',
              });
            }
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (id: string) => {
    setGalleryImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => {
        if (prev === null) return null;
        const remainingCount = galleryImages.length - 1;
        if (remainingCount <= 0) return null;
        if (prev >= remainingCount) return remainingCount - 1;
        return prev;
      });
    }
  };

  const handleResetGallery = () => {
    setGalleryImages(initialImages);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const isModified =
    galleryImages.length !== initialImages.length ||
    galleryImages.some((img, i) => !initialImages[i] || img.url !== initialImages[i].url);

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -340, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 340, behavior: 'smooth' });
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto resume-scrollbar rounded-[36px] sm:rounded-[44px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-6 sm:p-8 md:p-10 text-[#D7E2EA] shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#D7E2EA]/60">
                <span>
                  {project.number} · {project.category}
                </span>
                <span className="opacity-40">|</span>
                <span className="text-[#D7E2EA]/85 font-medium">{project.role}</span>
                <span className="opacity-40">|</span>
                <span className="tabular-nums">{project.period}</span>
              </div>
              <h2
                id="project-modal-title"
                className="hero-heading text-2xl sm:text-4xl font-black uppercase tracking-tight mt-0.5"
              >
                {project.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭项目预览"
              className="p-2.5 rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overview & Quantitative Metrics Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 mb-6 border-b border-[#D7E2EA]/15">
            <div className="flex flex-col gap-2 max-w-2xl">
              <p className="text-sm sm:text-base font-light text-[#D7E2EA]/85 leading-relaxed">
                {project.summary}
              </p>
              <p className="text-xs uppercase tracking-widest text-[#BBCCD7] font-medium">
                交付物：{project.deliverables}
              </p>
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="rounded-[22px] border border-[#D7E2EA]/20 bg-[#121418] px-3.5 py-3 flex flex-col justify-between gap-1"
                  >
                    <CountUpNumber
                      target={metric.value}
                      decimals={metric.decimals ?? 0}
                      suffix={metric.suffix}
                      triggerOnMount={true}
                      className="hero-heading text-xl sm:text-2xl font-black leading-none tracking-tight whitespace-nowrap"
                    />
                    <span className="text-[11px] font-light text-[#D7E2EA]/65 leading-snug">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STAR Case Study 3-Column Breakdown: 「项目背景与痛点」→「设计推导与执行」→「最终量化成果」 */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 px-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D7E2EA]/70">
                <span className="font-semibold text-[#D7E2EA]">
                  (STAR 案例深度拆解 · CASE STUDY BREAKDOWN)
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-light tracking-wider text-[#D7E2EA]/60">
                <span>项目背景与痛点</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B600A8]" />
                <span>设计推导与执行</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7621B0]" />
                <span>最终量化成果</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {/* Column 1: 项目背景与痛点 (Situation & Task) */}
              <div className="rounded-[28px] border border-[#D7E2EA]/25 hover:border-[#D7E2EA]/70 bg-[#111318] p-5 flex flex-col justify-between gap-4 transition-colors duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#D7E2EA]/12">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-black text-[#D7E2EA] tabular-nums leading-none">
                        01
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-[#D7E2EA] tracking-wide">
                        项目背景与痛点
                      </h3>
                    </div>
                    <span className="text-[11px] font-light uppercase tracking-widest text-[#D7E2EA]/50">
                      STAR · S/T
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5 text-xs sm:text-[13px] font-light leading-relaxed text-[#D7E2EA]/80">
                    {project.background.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B600A8] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2: 设计推导与执行 (Action) */}
              <div className="rounded-[28px] border border-[#D7E2EA]/25 hover:border-[#D7E2EA]/70 bg-[#111318] p-5 flex flex-col justify-between gap-4 transition-colors duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#D7E2EA]/12">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-black text-[#D7E2EA] tabular-nums leading-none">
                        02
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-[#D7E2EA] tracking-wide">
                        设计推导与执行
                      </h3>
                    </div>
                    <span className="text-[11px] font-light uppercase tracking-widest text-[#D7E2EA]/50">
                      STAR · A
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5 text-xs sm:text-[13px] font-light leading-relaxed text-[#D7E2EA]/80">
                    {project.process.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7621B0] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: 最终量化成果 (Result) */}
              <div className="rounded-[28px] border border-[#D7E2EA]/25 hover:border-[#D7E2EA]/70 bg-[#111318] p-5 flex flex-col justify-between gap-4 transition-colors duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#D7E2EA]/12">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-black text-[#D7E2EA] tabular-nums leading-none">
                        03
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-[#D7E2EA] tracking-wide">
                        最终量化成果
                      </h3>
                    </div>
                    <span className="text-[11px] font-light uppercase tracking-widest text-[#D7E2EA]/50">
                      STAR · R
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5 text-xs sm:text-[13px] font-light leading-relaxed text-[#D7E2EA]/85">
                    {project.outcomes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Scroll Image Gallery Section */}
          <div className="relative mb-6">
            <div className="flex flex-wrap items-center justify-between text-xs text-[#D7E2EA]/60 uppercase tracking-widest mb-3 px-1 gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-[#D7E2EA]">
                  作品图集 ({galleryImages.length})
                </span>
                <span className="text-white/40">· 点击放大预览 / 支持删除与上传</span>
              </div>
              <div className="flex items-center gap-3">
                {isModified && (
                  <button
                    type="button"
                    onClick={handleResetGallery}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5 hover:border-purple-400 text-xs text-[#D7E2EA] hover:text-white transition-colors cursor-pointer"
                    title="恢复为项目原始默认图集"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                    <span>恢复默认图集</span>
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleScrollLeft}
                    aria-label="向左滑动"
                    className="p-1.5 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10 text-[#D7E2EA] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleScrollRight}
                    aria-label="向右滑动"
                    className="p-1.5 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/10 text-[#D7E2EA] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Container with Custom Horizontal Scrollbar */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 resume-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {galleryImages.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative shrink-0 w-[260px] sm:w-[320px] md:w-[360px] h-56 sm:h-64 rounded-[28px] overflow-hidden border border-white/10 bg-[#16181D] cursor-pointer snap-start transition-all duration-200 hover:border-purple-400/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-white tracking-wider bg-black/70 px-3 py-1 rounded-full backdrop-blur-md border border-white/15">
                      点击放大预览
                    </span>
                  </div>

                  {/* Delete button for any image (original or uploaded) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.id);
                    }}
                    title="移除此图片"
                    aria-label={`移除图片 ${img.alt}`}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/75 hover:bg-red-500 text-white/90 hover:text-white backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg border border-white/10 hover:scale-110 z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Upload Card at the end of the scroll list */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) {
                    handleFiles(e.dataTransfer.files);
                  }
                }}
                className={`group relative shrink-0 w-[220px] sm:w-[260px] h-56 sm:h-64 rounded-[28px] border-2 border-dashed flex flex-col items-center justify-center gap-3 p-5 text-center cursor-pointer snap-start transition-all duration-200 ${
                  isDragging
                    ? 'border-purple-400 bg-purple-500/20 scale-[1.02]'
                    : 'border-white/20 bg-white/5 hover:border-purple-400/80 hover:bg-white/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFiles(e.target.files);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center text-[#D7E2EA] group-hover:text-purple-300 group-hover:scale-110 group-hover:border-purple-400/50 transition-all">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#D7E2EA] group-hover:text-white transition-colors">
                    上传更多作品图
                  </span>
                  <span className="text-xs text-[#D7E2EA]/50 font-light">
                    点击选择或拖拽至此
                  </span>
                  <span className="text-[10px] text-purple-300/80 mt-1 uppercase tracking-wider font-mono">
                    PNG · JPG · WebP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#D7E2EA]/15">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const el = document.getElementById('projects');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10 transition-colors cursor-pointer"
              >
                <span>查看全部项目</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onInquire(project.name)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/80 hover:text-white hover:border-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer"
              >
                <span>预约面试沟通</span>
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA] transition-colors cursor-pointer"
            >
              关闭预览
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal when an image is clicked */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="高清大图全屏预览"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar Controls */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#D7E2EA] font-medium tracking-wider">
              <span>{project.name}</span>
              <span className="mx-2 opacity-40">|</span>
              <span>
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const currentImg = galleryImages[lightboxIndex];
                  if (currentImg) {
                    handleDeleteImage(currentImg.id);
                  }
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-500 border border-white/15 text-[#D7E2EA] hover:text-white transition-colors cursor-pointer"
                title="删除当前图片"
                aria-label="删除当前图片"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <a
                href={galleryImages[lightboxIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[#D7E2EA] hover:text-white transition-colors cursor-pointer"
                title="新窗口查看原图"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[#D7E2EA] hover:text-white transition-colors cursor-pointer"
                title="关闭全屏预览 (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null ? (prev > 0 ? prev - 1 : galleryImages.length - 1) : 0
              );
            }}
            aria-label="查看上一张图片"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#D7E2EA] hover:text-white backdrop-blur-md transition-all cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Fullscreen Image */}
          <div
            className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex].url}
              alt={galleryImages[lightboxIndex].alt}
              referrerPolicy="no-referrer"
              className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] select-none"
            />
          </div>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null ? (prev < galleryImages.length - 1 ? prev + 1 : 0) : 0
              );
            }}
            aria-label="查看下一张图片"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#D7E2EA] hover:text-white backdrop-blur-md transition-all cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Hint */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#D7E2EA]/50 font-light tracking-widest hidden sm:block pointer-events-none"
          >
            支持键盘 ← → 键切换图片 · ESC 键退出全屏
          </div>
        </div>
      )}
    </>
  );
};

const RESUME_IMAGE_PATH = '/assets/aistudio/___-_____v5_p1_0fe8e943.png';
const BASE_WIDTH = 760;

interface ResumePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumePdfModal: React.FC<ResumePdfModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFitWidth, setIsFitWidth] = useState(false);

  const handleZoomIn = () => {
    setIsFitWidth(false);
    setZoom((z) => Math.min(2.5, Math.round((z + 0.2) * 10) / 10));
  };

  const handleZoomOut = () => {
    setIsFitWidth(false);
    setZoom((z) => Math.max(0.4, Math.round((z - 0.2) * 10) / 10));
  };

  const handleResetZoom = () => {
    setIsFitWidth(false);
    setZoom(1);
  };

  const handleToggleFit = () => {
    setIsFitWidth((prev) => !prev);
    setZoom(1);
  };

  const calculatedWidth = Math.round(BASE_WIDTH * zoom);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] flex flex-col rounded-[24px] sm:rounded-[32px] border-2 border-[#D7E2EA]/40 bg-[#121418] text-[#D7E2EA] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-[#181B22] border-b border-[#D7E2EA]/15 shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span id="resume-modal-title" className="text-sm font-semibold tracking-wide text-white">
                李翰林 · 个人简历
              </span>
              <span className="text-[11px] text-[#D7E2EA]/60">高清大图预览 · 支持上下滑动浏览</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-[#121418] border border-[#D7E2EA]/15 rounded-full px-2.5 py-1">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.4}
                title="缩小"
                aria-label="缩小简历图片"
                className="p-1 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="点击重置缩放为 100%"
                aria-label="重置缩放"
                className="text-xs px-1.5 py-0.5 rounded font-mono font-medium text-[#D7E2EA]/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isFitWidth ? '适应' : `${Math.round(zoom * 100)}%`}
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 2.5}
                title="放大"
                aria-label="放大简历图片"
                className="p-1 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleFit}
              title={isFitWidth ? '切换为原始比例' : '适应屏幕宽度'}
              className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-[#D7E2EA]/20 bg-[#D7E2EA]/5 hover:bg-[#D7E2EA]/15 text-[#D7E2EA] transition-colors cursor-pointer"
            >
              {isFitWidth ? '原始宽度' : '适应宽度'}
            </button>

            <a
              href={RESUME_IMAGE_PATH}
              download="李翰林_Luis_Li_个人简历.png"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#D7E2EA]/10 hover:bg-[#D7E2EA]/20 text-[#D7E2EA] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">下载图片</span>
            </a>

            <a
              href={RESUME_IMAGE_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#D7E2EA]/10 hover:bg-[#D7E2EA]/20 text-[#D7E2EA] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">新窗口原图</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer"
              aria-label="关闭预览"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Resume Image Viewport with vertical and horizontal scrollbars */}
        <div className="relative flex-1 w-full bg-[#0E1015] overflow-auto resume-scrollbar p-3 sm:p-6 md:p-8">
          <div
            className="mx-auto block transition-all duration-200 ease-out"
            style={{
              width: isFitWidth ? '100%' : `${calculatedWidth}px`,
              maxWidth: isFitWidth ? '100%' : 'none',
            }}
          >
            <img
              src={RESUME_IMAGE_PATH}
              alt="李翰林 (Luis Li) 个人简历图片"
              className="w-full h-auto object-contain block rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-[#D7E2EA]/20 bg-white select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
