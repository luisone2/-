import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ArrowUpRight,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Upload,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  RotateCcw,
  ArrowRight,
  Code2,
  Film,
  Play,
  Monitor,
  Smartphone,
  RefreshCw,
  Star,
} from 'lucide-react';
import { ProjectItem, PROJECTS } from './ProjectsSection';
import {
  validateContactForm,
  ContactFormInput,
  selectGalleryCoverItem,
  ProjectCardCovers,
  ProjectCoverSlot,
  deriveProjectCardCovers,
  assignGalleryCoverSlot,
  buildGeneratedMediaCoverSvg,
} from '../utils/portfolioMath';
import {
  PersistedGalleryMediaItem,
  saveGalleryToIndexedDb,
  loadGalleryFromIndexedDb,
  clearGalleryFromIndexedDb,
  reviveGalleryItems,
  extractVideoFrameDataUrl,
} from '../utils/mediaStorage';
import { ContactButton } from './Buttons';
import { CountUpNumber } from './CountUpNumber';

export { memoryMediaCache };

type GalleryMediaItem = PersistedGalleryMediaItem;

const buildDefaultProjectHtml = (project: ProjectItem): string => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name} — 在线交互原型演示</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
      background: #0C0C0C;
      color: #D7E2EA;
      min-height: 100vh;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #D7E2EA;
      background: rgba(215, 226, 234, 0.08);
      border: 1px solid rgba(215, 226, 234, 0.22);
      padding: 6px 14px;
      border-radius: 999px;
      width: fit-content;
    }
    .header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      border-bottom: 1px solid rgba(215, 226, 234, 0.15);
      padding-bottom: 18px;
    }
    h1 { font-size: clamp(22px, 3.5vw, 34px); font-weight: 800; color: #FFFFFF; }
    .sub { font-size: 13px; color: rgba(215, 226, 234, 0.68); margin-top: 6px; }
    .tabs { display: flex; gap: 10px; flex-wrap: wrap; }
    .tab-btn {
      background: rgba(255, 255, 255, 0.06);
      color: #D7E2EA;
      border: 1px solid rgba(215, 226, 234, 0.22);
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn.active, .tab-btn:hover {
      background: #D7E2EA;
      color: #0C0C0C;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .card {
      background: #111318;
      border: 1px solid rgba(215, 226, 234, 0.16);
      border-radius: 22px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-3px);
      border-color: rgba(215, 226, 234, 0.45);
    }
    .card-title { font-size: 15px; font-weight: 600; color: #FFF; }
    .card-desc { font-size: 13px; line-height: 1.6; color: rgba(215, 226, 234, 0.75); }
    .preview-stage {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(215, 226, 234, 0.2);
      background: #111318;
      min-height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .preview-stage img {
      width: 100%;
      max-height: 340px;
      object-fit: cover;
      display: block;
    }
  </style>
</head>
<body>
  <div class="badge">HTML LIVE PREVIEW · ${project.number} ${project.category}</div>
  <div class="header">
    <div>
      <h1>${project.name}</h1>
      <p class="sub">${project.role} · ${project.period} · 交付物：${project.deliverables}</p>
    </div>
    <div class="tabs">
      <button class="tab-btn active" onclick="switchView(0, this)">主视觉视图</button>
      <button class="tab-btn" onclick="switchView(1, this)">细节规范视图</button>
      <button class="tab-btn" onclick="switchView(2, this)">场景落地视图</button>
    </div>
  </div>
  <div class="preview-stage">
    <img id="stage-img" src="${project.col2Img}" alt="${project.name}" />
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-title">01 · 项目概述</div>
      <div class="card-desc">${project.summary}</div>
    </div>
    <div class="card">
      <div class="card-title">02 · 核心推导</div>
      <div class="card-desc">${project.process[0] || ''}</div>
    </div>
    <div class="card">
      <div class="card-title">03 · 量化成果</div>
      <div class="card-desc">${project.outcomes[0] || ''}</div>
    </div>
  </div>
  <script>
    const imgs = [
      ${JSON.stringify(project.col2Img)},
      ${JSON.stringify(project.col1Img1)},
      ${JSON.stringify(project.col1Img2)}
    ];
    function switchView(index, btn) {
      document.getElementById('stage-img').src = imgs[index] || imgs[0];
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  </script>
</body>
</html>`;

// In-memory store per project so large videos and HTML files persist across modal re-opens without hitting sessionStorage quota
const memoryMediaCache = new Map<string, GalleryMediaItem[]>();

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
  onSelectProjectNumber?: (projectNumber: string) => void;
  onUpdateProjectCover?: (
    projectNumber: string,
    covers: ProjectCardCovers | null
  ) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquire,
  onSelectProjectNumber,
  onUpdateProjectCover,
}) => {
  if (!project) return null;
  return (
    <ProjectModalContent
      project={project}
      onClose={onClose}
      onInquire={onInquire}
      onSelectProjectNumber={onSelectProjectNumber}
      onUpdateProjectCover={onUpdateProjectCover}
    />
  );
};

const ProjectModalContent: React.FC<{
  project: ProjectItem;
  onClose: () => void;
  onInquire: (projectName: string) => void;
  onSelectProjectNumber?: (projectNumber: string) => void;
  onUpdateProjectCover?: (
    projectNumber: string,
    covers: ProjectCardCovers | null
  ) => void;
}> = ({
  project,
  onClose,
  onSelectProjectNumber,
  onUpdateProjectCover,
}) => {
  const baseProject =
    PROJECTS.find((p) => p.number === project.number) || project;
  const defaultHtmlContent = buildDefaultProjectHtml(project);

  // Build initial media items list for current project (mapped to the 3 card cover slots)
  const initialImages: GalleryMediaItem[] = [
    {
      id: '1',
      type: 'image',
      url: project.col1Img1 || baseProject.col1Img1,
      alt: `${project.name} 左上封面图`,
      isCover: false,
      isCustom: project.col1Img1 !== baseProject.col1Img1,
      coverSlot: 'col1Img1',
    },
    {
      id: '2',
      type: 'image',
      url: project.col1Img2 || baseProject.col1Img2,
      alt: `${project.name} 左下封面图`,
      isCover: false,
      isCustom: project.col1Img2 !== baseProject.col1Img2,
      coverSlot: 'col1Img2',
    },
    {
      id: '3',
      type: 'image',
      url: project.col2Img || baseProject.col2Img,
      alt: `${project.name} 右侧主封面图`,
      isCover: true,
      isCustom: project.col2Img !== baseProject.col2Img,
      coverSlot: 'col2Img',
    },
  ];

  const storageKey = `project_gallery_state_${project.number}`;

  const persistGallery = (items: GalleryMediaItem[], syncCovers = true) => {
    memoryMediaCache.set(storageKey, items);
    void saveGalleryToIndexedDb(storageKey, items);
    if (syncCovers) {
      const derived = deriveProjectCardCovers(
        items,
        {
          col1Img1: baseProject.col1Img1,
          col1Img2: baseProject.col1Img2,
          col2Img: baseProject.col2Img,
        },
        project.name
      );
      onUpdateProjectCover?.(project.number, derived);
    }
  };

  const loadSavedImages = (): GalleryMediaItem[] => {
    const cached = memoryMediaCache.get(storageKey);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    try {
      const stored =
        localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return reviveGalleryItems(parsed, project.col2Img);
        }
      }
    } catch {
      // fallback
    }
    return initialImages;
  };

  const [galleryImages, setGalleryImages] = useState<GalleryMediaItem[]>(loadSavedImages);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeHtmlViewer, setActiveHtmlViewer] = useState<{
    title: string;
    fileName: string;
    htmlContent: string;
    blobUrl: string;
    isFullscreen: boolean;
    viewport: 'desktop' | 'mobile';
    refreshKey: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [playingVideoIds, setPlayingVideoIds] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const htmlInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const coverTargetIdRef = useRef<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Sync state when switching to a different project and hydrate persisted Blobs (videos/HTML/images) from IndexedDB
  useEffect(() => {
    let mounted = true;
    const currentKey = `project_gallery_state_${project.number}`;
    setGalleryImages(loadSavedImages());
    setLightboxIndex(null);
    setActiveHtmlViewer(null);
    setPlayingVideoIds({});

    loadGalleryFromIndexedDb(currentKey, project.col2Img).then((idbItems) => {
      if (mounted && idbItems && idbItems.length > 0) {
        memoryMediaCache.set(currentKey, idbItems);
        setGalleryImages(idbItems);
      }
    });

    return () => {
      mounted = false;
    };
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

  const handleSetAsCover = (targetId: string) => {
    setGalleryImages((prev) => {
      const updated = assignGalleryCoverSlot(prev, targetId, 'col2Img');
      persistGallery(updated);
      return updated;
    });
  };

  const handleAssignCoverSlot = (targetId: string, slot: ProjectCoverSlot) => {
    setGalleryImages((prev) => {
      const updated = assignGalleryCoverSlot(prev, targetId, slot);
      persistGallery(updated);
      return updated;
    });
  };

  const triggerCoverUpload = (targetId: string | null = null) => {
    coverTargetIdRef.current = targetId;
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
      coverInputRef.current.click();
    }
  };

  const handleCoverFileSelected = (
    file: File,
    explicitTargetId?: string | null
  ) => {
    const isImageFile =
      file.type.startsWith('image/') ||
      /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i.test(file.name);
    if (!isImageFile) return;

    const targetId =
      explicitTargetId !== undefined ? explicitTargetId : coverTargetIdRef.current;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      if (targetId) {
        // Pause target video if playing so its new cover image is immediately visible
        const videoEl = videoRefs.current[targetId];
        if (videoEl) {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
        setPlayingVideoIds((prev) => ({ ...prev, [targetId]: false }));

        // Set or replace cover image for a specific gallery card (image, video, or HTML) and sync its slot
        setGalleryImages((prev) => {
          const targetItem = prev.find((i) => i.id === targetId);
          const preserveSecondarySlot =
            targetItem &&
            !targetItem.isCover &&
            (targetItem.coverSlot === 'col1Img1' ||
              targetItem.coverSlot === 'col1Img2' ||
              targetItem.id === '1' ||
              targetItem.id === '2');

          const assignedSlot: ProjectCoverSlot = preserveSecondarySlot
            ? targetItem?.coverSlot === 'col1Img2' || targetItem?.id === '2'
              ? 'col1Img2'
              : 'col1Img1'
            : 'col2Img';

          const updated = prev.map((item) => {
            if (item.id === targetId) {
              return {
                ...item,
                url: item.type === 'image' ? result : item.url,
                coverUrl: result,
                isCover: assignedSlot === 'col2Img' ? true : Boolean(item.isCover),
                coverSlot: assignedSlot,
                isCustom: true,
                fileBlob: file,
              };
            }
            return {
              ...item,
              isCover: assignedSlot === 'col2Img' ? false : item.isCover,
              coverSlot:
                item.coverSlot === assignedSlot ? undefined : item.coverSlot,
            };
          });
          persistGallery(updated);
          return updated;
        });
      } else {
        // Uploaded via top toolbar "设置封面": create a new cover image card and set it as primary project cover
        const newCoverItem: GalleryMediaItem = {
          id: `cover-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: 'image',
          url: result,
          coverUrl: result,
          alt: `${project.name} 自定义封面`,
          fileName: file.name,
          isCover: true,
          coverSlot: 'col2Img',
          isCustom: true,
          fileBlob: file,
        };
        setGalleryImages((prev) => {
          const cleared = prev.map((item) => ({
            ...item,
            isCover: false,
            coverSlot:
              item.coverSlot === 'col2Img' ? undefined : item.coverSlot,
          }));
          const updated = [newCoverItem, ...cleared];
          persistGallery(updated);
          return updated;
        });
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
        }, 80);
      }
    };
    reader.readAsDataURL(file);
  };

  const openHtmlPreview = (title: string, fileName: string, htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    setActiveHtmlViewer({
      title,
      fileName,
      htmlContent,
      blobUrl,
      isFullscreen: false,
      viewport: 'desktop',
      refreshKey: Date.now(),
    });
  };

  const handleOpenDefaultOrLatestHtml = () => {
    const latestCustomHtml = [...galleryImages]
      .reverse()
      .find((item) => item.type === 'html' && item.htmlContent);
    if (latestCustomHtml && latestCustomHtml.htmlContent) {
      openHtmlPreview(
        latestCustomHtml.alt,
        latestCustomHtml.fileName || 'index.html',
        latestCustomHtml.htmlContent
      );
    } else {
      openHtmlPreview(
        `${project.name} — 在线交互 HTML`,
        `${project.number}_interactive_demo.html`,
        defaultHtmlContent
      );
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const isHtml =
        file.type === 'text/html' ||
        file.name.toLowerCase().endsWith('.html') ||
        file.name.toLowerCase().endsWith('.htm');
      const isVideo =
        file.type.startsWith('video/') ||
        /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
      const isImage = file.type.startsWith('image/');

      if (isHtml) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const htmlText = e.target?.result as string;
          if (typeof htmlText === 'string') {
            const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            const cleanTitle = file.name.replace(/\.(html|htm)$/i, '');
            const autoCover = buildGeneratedMediaCoverSvg(
              'html',
              cleanTitle,
              project.name,
              htmlText
            );
            const newItem: GalleryMediaItem = {
              id: `html-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type: 'html',
              url: blobUrl,
              alt: cleanTitle,
              fileName: file.name,
              htmlContent: htmlText,
              coverUrl: autoCover,
              isCover: true,
              coverSlot: 'col2Img',
              isCustom: true,
            };
            setGalleryImages((prev) => {
              const cleared = prev.map((item) => ({
                ...item,
                isCover: false,
                coverSlot:
                  item.coverSlot === 'col2Img' ? undefined : item.coverSlot,
              }));
              const updated = [...cleared, newItem];
              persistGallery(updated);
              return updated;
            });
            openHtmlPreview(newItem.alt, file.name, htmlText);
            scrollToEnd();
          }
        };
        reader.readAsText(file, 'utf-8');
      } else if (isVideo) {
        const videoObjectUrl = URL.createObjectURL(file);
        const cleanTitle =
          file.name.replace(/\.[^.]+$/, '') || `${project.name} 演示视频`;
        const fallbackSvgCover = buildGeneratedMediaCoverSvg(
          'video',
          cleanTitle,
          project.name
        );
        const videoId = `video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newItem: GalleryMediaItem = {
          id: videoId,
          type: 'video',
          url: videoObjectUrl,
          alt: cleanTitle,
          fileName: file.name,
          coverUrl: fallbackSvgCover,
          isCover: true,
          coverSlot: 'col2Img',
          isCustom: true,
          fileBlob: file,
        };
        setGalleryImages((prev) => {
          const cleared = prev.map((item) => ({
            ...item,
            isCover: false,
            coverSlot:
              item.coverSlot === 'col2Img' ? undefined : item.coverSlot,
          }));
          const updated = [...cleared, newItem];
          persistGallery(updated);
          return updated;
        });
        scrollToEnd();

        // Automatically capture real frame from the uploaded video to upgrade its cover
        extractVideoFrameDataUrl(file).then((frameDataUrl) => {
          if (frameDataUrl) {
            setGalleryImages((prev) => {
              const updated = prev.map((item) =>
                item.id === videoId && item.coverUrl === fallbackSvgCover
                  ? { ...item, coverUrl: frameDataUrl }
                  : item
              );
              persistGallery(updated);
              return updated;
            });
          }
        });
      } else if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            const newImage: GalleryMediaItem = {
              id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type: 'image',
              url: result,
              coverUrl: result,
              alt: `${project.name} 用户上传作品图`,
              fileName: file.name,
              isCover: true,
              coverSlot: 'col2Img',
              isCustom: true,
              fileBlob: file,
            };
            setGalleryImages((prev) => {
              const cleared = prev.map((item) => ({
                ...item,
                isCover: false,
                coverSlot:
                  item.coverSlot === 'col2Img' ? undefined : item.coverSlot,
              }));
              const updated = [...cleared, newImage];
              persistGallery(updated);
              return updated;
            });
            scrollToEnd();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDeleteImage = (id: string) => {
    setGalleryImages((prev) => {
      const deletedItem = prev.find((img) => img.id === id);
      let updated = prev.filter((img) => img.id !== id);

      if (deletedItem?.isCover && updated.length > 0) {
        const fallbackCandidate =
          updated.find((item) => item.isCustom || item.coverUrl) ||
          updated[updated.length - 1];
        if (fallbackCandidate) {
          updated = updated.map((item) => ({
            ...item,
            isCover: item.id === fallbackCandidate.id,
            coverSlot:
              item.id === fallbackCandidate.id ? 'col2Img' : item.coverSlot,
          }));
        }
      }

      if (updated.length === 0) {
        persistGallery(updated, false);
        onUpdateProjectCover?.(project.number, null);
      } else {
        persistGallery(updated, true);
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
    const resetItems: GalleryMediaItem[] = [
      {
        id: '1',
        type: 'image',
        url: baseProject.col1Img1,
        alt: `${project.name} 左上封面图`,
        isCover: false,
        isCustom: false,
        coverSlot: 'col1Img1',
      },
      {
        id: '2',
        type: 'image',
        url: baseProject.col1Img2,
        alt: `${project.name} 左下封面图`,
        isCover: false,
        isCustom: false,
        coverSlot: 'col1Img2',
      },
      {
        id: '3',
        type: 'image',
        url: baseProject.col2Img,
        alt: `${project.name} 右侧主封面图`,
        isCover: true,
        isCustom: false,
        coverSlot: 'col2Img',
      },
    ];
    setGalleryImages(resetItems);
    memoryMediaCache.delete(storageKey);
    void clearGalleryFromIndexedDb(storageKey);
    onUpdateProjectCover?.(project.number, null);
  };

  const isModified =
    project.col1Img1 !== baseProject.col1Img1 ||
    project.col1Img2 !== baseProject.col1Img2 ||
    project.col2Img !== baseProject.col2Img ||
    galleryImages.length !== initialImages.length ||
    galleryImages.some(
      (img, i) =>
        !initialImages[i] ||
        img.url !== initialImages[i].url ||
        Boolean(img.coverUrl) ||
        Boolean(img.isCustom)
    );

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
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto resume-scrollbar rounded-[36px] sm:rounded-[44px] border border-[#D7E2EA]/35 bg-[#0C0C0C] p-6 sm:p-8 md:p-10 text-[#D7E2EA] shadow-[0_25px_70px_rgba(0,0,0,0.92)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — L1 Display Scale */}
          <div className="flex items-start justify-between gap-4 pb-6 mb-7 border-b border-[#D7E2EA]/12">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <span
                className="font-bold text-[#D7E2EA] leading-[1.08] tracking-[0.06em] px-1 select-none shrink-0"
                style={{ fontSize: 'clamp(2.35rem, 4.5vw, 4rem)' }}
              >
                {project.number}
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#D7E2EA]/55">
                  <span className="text-[#D7E2EA]/90 font-semibold">
                    {project.category}
                  </span>
                  <span className="opacity-30">/</span>
                  <span className="text-[#D7E2EA]/75">{project.role}</span>
                  <span className="opacity-30">/</span>
                  <span className="text-[#D7E2EA]/50 font-mono">
                    {project.period}
                  </span>
                </div>
                <h2
                  id="project-modal-title"
                  className="font-bold uppercase tracking-wide text-[#D7E2EA] leading-snug"
                  style={{ fontSize: 'clamp(1.5rem, 3.1vw, 2.75rem)' }}
                >
                  {project.name}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭项目预览"
              className="w-10 h-10 rounded-full border border-[#D7E2EA]/20 bg-[#12151C] text-[#D7E2EA]/80 hover:bg-[#D7E2EA] hover:text-[#0C0C0C] hover:border-[#D7E2EA] flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Overview, Specification Metadata & Quantitative Metrics Row — L2 Lead & Display Metrics */}
          <div className="flex flex-col gap-6 pb-7 mb-8 border-b border-[#D7E2EA]/12">
            <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-6">
              <div className="flex flex-col justify-between gap-5 max-w-2xl">
                <p className="text-base sm:text-lg md:text-[20px] font-normal text-[#D7E2EA] leading-[1.65] tracking-normal">
                  {project.summary}
                </p>

                <div className="flex flex-col gap-2.5 pt-4 border-t border-[#D7E2EA]/10">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#D7E2EA]/45 font-medium shrink-0">
                      交付标准
                    </span>
                    <span className="text-xs sm:text-[13px] text-[#D7E2EA]/90 font-normal">
                      {project.deliverables}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#D7E2EA]/45 font-medium shrink-0">
                      技术工具
                    </span>
                    <span className="text-xs sm:text-[13px] text-[#D7E2EA]/70 font-light">
                      {(project.tools || baseProject.tools || []).join(' · ')}
                    </span>
                  </div>
                </div>
              </div>

              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                  {project.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded-[22px] border border-[#D7E2EA]/16 bg-[#111318] px-4 sm:px-5 py-4 flex flex-col justify-between gap-2"
                    >
                      <CountUpNumber
                        target={metric.value}
                        decimals={metric.decimals ?? 0}
                        suffix={metric.suffix}
                        triggerOnMount={true}
                        className="text-2xl sm:text-3xl md:text-[36px] font-extrabold leading-tight tracking-normal text-[#D7E2EA] whitespace-nowrap"
                      />
                      <span className="text-[11px] sm:text-xs font-light text-[#D7E2EA]/55 leading-snug">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STAR Case Study 3-Column Breakdown: 「项目背景与痛点」→「设计推导与执行」→「最终量化成果」 */}
          <div className="mb-9">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5 px-0.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D7E2EA]/45">
                  CASE STUDY BREAKDOWN
                </span>
                <h3 className="text-lg sm:text-xl md:text-[22px] font-bold tracking-normal text-[#D7E2EA] leading-tight">
                  STAR 案例深度拆解
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-light tracking-wider text-[#D7E2EA]/55">
                <span className="font-mono text-[#D7E2EA]/80">01</span>
                <span>背景与痛点</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] text-[#D7E2EA]/35" />
                <span className="font-mono text-[#D7E2EA]/80">02</span>
                <span>推导与执行</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] text-[#D7E2EA]/35" />
                <span className="font-mono text-[#D7E2EA]/80">03</span>
                <span>量化成果</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {/* Column 1: 项目背景与痛点 (Situation & Task) */}
              <div className="rounded-[24px] border border-[#D7E2EA]/16 hover:border-[#D7E2EA]/40 bg-[#111318] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-2 pb-3.5 border-b border-[#D7E2EA]/12">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-[28px] font-bold text-[#D7E2EA] leading-[1.08] tracking-[0.06em] shrink-0">
                        01
                      </span>
                      <h4 className="text-base sm:text-[17px] md:text-lg font-bold text-[#D7E2EA] tracking-normal">
                        项目背景与痛点
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D7E2EA]/40">
                      S / T
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3 text-xs sm:text-[13px] font-light leading-[1.75] text-[#D7E2EA]/72">
                    {project.background.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[#D7E2EA]/45 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2: 设计推导与执行 (Action) */}
              <div className="rounded-[24px] border border-[#D7E2EA]/16 hover:border-[#D7E2EA]/40 bg-[#111318] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-2 pb-3.5 border-b border-[#D7E2EA]/12">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-[28px] font-bold text-[#D7E2EA] leading-[1.08] tracking-[0.06em] shrink-0">
                        02
                      </span>
                      <h4 className="text-base sm:text-[17px] md:text-lg font-bold text-[#D7E2EA] tracking-normal">
                        设计推导与执行
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D7E2EA]/40">
                      ACTION
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3 text-xs sm:text-[13px] font-light leading-[1.75] text-[#D7E2EA]/72">
                    {project.process.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[#D7E2EA]/65 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: 最终量化成果 (Result) */}
              <div className="rounded-[24px] border border-[#D7E2EA]/16 hover:border-[#D7E2EA]/40 bg-[#111318] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-2 pb-3.5 border-b border-[#D7E2EA]/12">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-[28px] font-bold text-[#D7E2EA] leading-[1.08] tracking-[0.06em] shrink-0">
                        03
                      </span>
                      <h4 className="text-base sm:text-[17px] md:text-lg font-bold text-[#D7E2EA] tracking-normal">
                        最终量化成果
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#D7E2EA]/40">
                      RESULT
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3 text-xs sm:text-[13px] font-light leading-[1.75] text-[#D7E2EA]/85">
                    {project.outcomes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1 h-1 rounded-full bg-[#D7E2EA] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Design Decision & Trade-off Callout — L3 Highlight Statement vs L4 Kicker */}
            {(project.keyDecision || baseProject.keyDecision) && (
              <div className="mt-4 rounded-[24px] border border-[#D7E2EA]/20 bg-[#111318] px-5 sm:px-6 py-4 sm:py-5 flex flex-col gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D7E2EA]/50 font-medium">
                  核心突破与设计决策 · KEY DESIGN DECISION
                </span>
                <p className="text-sm sm:text-base md:text-[17px] text-[#D7E2EA] font-medium leading-[1.65] tracking-normal">
                  {project.keyDecision || baseProject.keyDecision}
                </p>
              </div>
            )}
          </div>

          {/* Horizontal Scroll Media Gallery + Online HTML Viewer & Video Upload Section */}
          <div className="relative mb-6">
            {/* Hidden Specialized File Inputs */}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleCoverFileSelected(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <input
              ref={htmlInputRef}
              type="file"
              accept=".html,.htm,text/html"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.html,.htm,text/html"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />

            <div className="flex flex-wrap items-end justify-between text-xs text-[#D7E2EA]/60 mb-5 px-0.5 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#D7E2EA]/45">
                  MEDIA & INTERACTIVE GALLERY
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg sm:text-xl md:text-[22px] font-bold tracking-tight text-[#D7E2EA] leading-tight">
                    作品图集与多媒体
                  </h3>
                  <span className="text-sm sm:text-base font-mono font-semibold text-[#D7E2EA]/55 tabular-nums">
                    ({galleryImages.length})
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#14171F] border border-[#D7E2EA]/16 text-[11px] font-light text-[#D7E2EA]/65">
                    <CheckCircle2 className="w-3 h-3 stroke-[1.5] text-[#D7E2EA]/75" />
                    <span>本地持久保存 · 刷新不丢失</span>
                  </span>
                </div>
              </div>

              {/* Action Toolbar: Unified Monochromatic Silver-Obsidian Styling */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerCoverUpload(null)}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[#D7E2EA]/35 bg-[#D7E2EA]/10 hover:bg-[#D7E2EA] text-xs font-medium text-[#D7E2EA] hover:text-[#0C0C0C] transition-all duration-200 cursor-pointer"
                  title="上传并设置当前项目封面图"
                >
                  <Star className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>设置封面</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenDefaultOrLatestHtml}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[#D7E2EA]/25 bg-[#14171F] hover:bg-[#D7E2EA] hover:border-[#D7E2EA] text-xs font-medium text-[#D7E2EA] hover:text-[#0C0C0C] transition-all duration-200 cursor-pointer"
                  title="直接在线打开并预览 HTML 交互页面"
                >
                  <Code2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>在线查看 HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => htmlInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[#D7E2EA]/18 bg-[#111318] hover:border-[#D7E2EA]/45 hover:bg-[#161922] text-xs font-normal text-[#D7E2EA]/80 hover:text-[#D7E2EA] transition-all duration-200 cursor-pointer"
                  title="上传本地 .html / .htm 文件并直接在线打开"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>上传 HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[#D7E2EA]/18 bg-[#111318] hover:border-[#D7E2EA]/45 hover:bg-[#161922] text-xs font-normal text-[#D7E2EA]/80 hover:text-[#D7E2EA] transition-all duration-200 cursor-pointer"
                  title="上传本地视频文件 (MP4 / WebM / MOV)"
                >
                  <Film className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>上传视频</span>
                </button>

                {isModified && (
                  <button
                    type="button"
                    onClick={handleResetGallery}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#D7E2EA]/18 bg-[#111318] hover:border-[#D7E2EA]/45 hover:bg-[#161922] text-xs font-normal text-[#D7E2EA]/75 hover:text-[#D7E2EA] transition-all duration-200 cursor-pointer"
                    title="恢复为项目原始默认图集与封面"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>恢复默认</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 pl-1">
                  <button
                    type="button"
                    onClick={handleScrollLeft}
                    aria-label="向左滑动"
                    className="w-8 h-8 rounded-full border border-[#D7E2EA]/18 bg-[#111318] hover:border-[#D7E2EA]/45 hover:bg-[#D7E2EA] text-[#D7E2EA] hover:text-[#0C0C0C] flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleScrollRight}
                    aria-label="向右滑动"
                    className="w-8 h-8 rounded-full border border-[#D7E2EA]/18 bg-[#111318] hover:border-[#D7E2EA]/45 hover:bg-[#D7E2EA] text-[#D7E2EA] hover:text-[#0C0C0C] flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Container with Custom Horizontal Scrollbar */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 px-0.5 resume-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {galleryImages.map((img, idx) => {
                if (img.type === 'video') {
                  const isVideoPlaying = Boolean(playingVideoIds[img.id]);
                  return (
                    <div
                      key={img.id}
                      className={`group relative shrink-0 w-[280px] sm:w-[340px] md:w-[380px] h-64 sm:h-72 rounded-[24px] overflow-hidden border bg-[#111318] snap-start transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] flex flex-col ${
                        img.isCover
                          ? 'border-[#D7E2EA]/75 ring-1 ring-[#D7E2EA]/20'
                          : 'border-[#D7E2EA]/16 hover:border-[#D7E2EA]/40'
                      }`}
                    >
                      {/* Unobstructed Video & Cover Area */}
                      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-black">
                        <video
                          key={`${img.id}-${img.coverUrl ? img.coverUrl.slice(-24) : 'default'}`}
                          ref={(el) => {
                            videoRefs.current[img.id] = el;
                          }}
                          src={img.url}
                          poster={img.coverUrl}
                          controls
                          playsInline
                          preload={img.coverUrl ? 'none' : 'metadata'}
                          onPlay={() =>
                            setPlayingVideoIds((prev) => ({ ...prev, [img.id]: true }))
                          }
                          onEnded={() =>
                            setPlayingVideoIds((prev) => ({ ...prev, [img.id]: false }))
                          }
                          className="absolute inset-0 w-full h-full object-cover bg-black"
                        />

                        {/* Explicit Cover Image Overlay when coverUrl is set and video is not actively playing */}
                        {img.coverUrl && !isVideoPlaying && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingVideoIds((prev) => ({ ...prev, [img.id]: true }));
                              setTimeout(() => {
                                videoRefs.current[img.id]?.play().catch(() => {});
                              }, 30);
                            }}
                            className="absolute inset-0 z-10 w-full h-full cursor-pointer group/vc"
                            title="点击播放视频"
                          >
                            <img
                              src={img.coverUrl}
                              alt={`${img.alt} 视频封面`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/vc:scale-105 block"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vc:bg-black/35 transition-colors">
                              <span className="w-11 h-11 rounded-full bg-[#0C0C0C]/80 border border-[#D7E2EA]/35 backdrop-blur-md flex items-center justify-center text-[#D7E2EA] shadow-xl group-hover/vc:scale-105 transition-transform">
                                <Play className="w-4 h-4 fill-current ml-0.5 stroke-[1.5]" />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dedicated Bottom Control Bar (Does Not Obscure Cover) */}
                      <div
                        className="shrink-0 h-11 px-3 bg-[#0E1015] border-t border-[#D7E2EA]/12 flex items-center justify-between gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {img.isCover ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-[11px] font-semibold border border-[#D7E2EA] shrink-0">
                              <Star className="w-3 h-3 fill-current stroke-[1.5]" />
                              <span>主封面</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(img.id)}
                              title="将此视频封面设为项目主封面"
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/80 hover:text-[#0C0C0C] border border-[#D7E2EA]/18 hover:border-[#D7E2EA] text-[11px] font-normal transition-colors cursor-pointer shrink-0"
                            >
                              <Star className="w-3 h-3 stroke-[1.5]" />
                              <span>设为封面</span>
                            </button>
                          )}

                          <select
                            aria-label={`选择 ${img.alt} 同步封面位置`}
                            value={
                              img.isCover
                                ? 'col2Img'
                                : img.coverSlot || ''
                            }
                            onChange={(e) => {
                              const val = e.target.value as ProjectCoverSlot;
                              if (val) {
                                handleAssignCoverSlot(img.id, val);
                              }
                            }}
                            className="px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-[#D7E2EA]/85 border border-[#D7E2EA]/18 focus:outline-none cursor-pointer shrink-0"
                            title="同步修改外层项目卡片对应位置的封面图"
                          >
                            <option value="" className="bg-[#0E1015]">同步位置…</option>
                            <option value="col2Img" className="bg-[#0E1015]">右侧主封面</option>
                            <option value="col1Img1" className="bg-[#0E1015]">左上封面图</option>
                            <option value="col1Img2" className="bg-[#0E1015]">左下封面图</option>
                          </select>

                          <label
                            title="上传本地图片设置或更换此视频封面"
                            aria-label={`为视频 ${img.alt} ${img.coverUrl ? '更换封面' : '设置封面'}`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.12] text-[#D7E2EA]/80 hover:text-[#D7E2EA] border border-[#D7E2EA]/18 text-[11px] font-normal transition-colors cursor-pointer shrink-0"
                          >
                            <Upload className="w-3 h-3 stroke-[1.5]" />
                            <span>{img.coverUrl ? '更换封面' : '设置封面'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleCoverFileSelected(file, img.id);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          {img.coverUrl && isVideoPlaying && (
                            <button
                              type="button"
                              onClick={() => {
                                videoRefs.current[img.id]?.pause();
                                setPlayingVideoIds((prev) => ({ ...prev, [img.id]: false }));
                              }}
                              title="暂停视频并显示封面"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.12] text-[#D7E2EA]/75 hover:text-[#D7E2EA] border border-[#D7E2EA]/18 text-[11px] font-normal transition-colors cursor-pointer shrink-0"
                            >
                              <span>显示封面</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setLightboxIndex(idx)}
                            title="全屏播放视频"
                            aria-label={`全屏播放视频 ${img.alt}`}
                            className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/75 hover:text-[#0C0C0C] flex items-center justify-center transition-colors cursor-pointer border border-[#D7E2EA]/15"
                          >
                            <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            title="移除此视频"
                            aria-label={`移除视频 ${img.alt}`}
                            className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/75 hover:text-[#0C0C0C] flex items-center justify-center transition-colors cursor-pointer border border-[#D7E2EA]/15"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (img.type === 'html') {
                  return (
                    <div
                      key={img.id}
                      onClick={() =>
                        openHtmlPreview(
                          img.alt,
                          img.fileName || 'index.html',
                          img.htmlContent || defaultHtmlContent
                        )
                      }
                      className={`group relative shrink-0 w-[260px] sm:w-[320px] md:w-[360px] h-64 sm:h-72 rounded-[24px] overflow-hidden border bg-[#111318] flex flex-col cursor-pointer snap-start transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] ${
                        img.isCover
                          ? 'border-[#D7E2EA]/75 ring-1 ring-[#D7E2EA]/20'
                          : 'border-[#D7E2EA]/16 hover:border-[#D7E2EA]/40'
                      }`}
                    >
                      {/* Top Cover Viewport: 100% Unobstructed Cover Image when set */}
                      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#12151C]">
                        {img.coverUrl ? (
                          <img
                            src={img.coverUrl}
                            alt={`${img.alt} 封面`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block"
                          />
                        ) : (
                          <div className="w-full h-full p-5 flex flex-col justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-[#D7E2EA]/20 text-[11px] font-medium text-[#D7E2EA]/85 w-fit">
                              <Code2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              <span>HTML 交互文档</span>
                            </span>
                            <div className="flex flex-col gap-1 my-auto">
                              <h4 className="text-base font-semibold text-[#D7E2EA] truncate">
                                {img.fileName || `${img.alt}.html`}
                              </h4>
                              <p className="text-xs text-[#D7E2EA]/60 font-light line-clamp-2">
                                点击卡片在下方展开交互预览，或点击底部「设置封面」上传专属封面图。
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dedicated Bottom Control Bar (Below Cover Image — Never Obscures Cover) */}
                      <div
                        className="shrink-0 h-11 px-3 bg-[#0E1015] border-t border-[#D7E2EA]/12 flex items-center justify-between gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <select
                            aria-label={`选择 ${img.alt} 同步封面位置`}
                            value={
                              img.isCover
                                ? 'col2Img'
                                : img.coverSlot || ''
                            }
                            onChange={(e) => {
                              const val = e.target.value as ProjectCoverSlot;
                              if (val) {
                                handleAssignCoverSlot(img.id, val);
                              }
                            }}
                            className="px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-[#D7E2EA]/85 border border-[#D7E2EA]/18 focus:outline-none cursor-pointer shrink-0"
                            title="同步修改外层项目卡片对应位置的封面图"
                          >
                            <option value="" className="bg-[#0E1015]">同步位置…</option>
                            <option value="col2Img" className="bg-[#0E1015]">右侧主封面</option>
                            <option value="col1Img1" className="bg-[#0E1015]">左上封面图</option>
                            <option value="col1Img2" className="bg-[#0E1015]">左下封面图</option>
                          </select>

                          <label
                            title="上传并设置此 HTML 卡片的封面图"
                            aria-label={`为 HTML ${img.alt} ${img.coverUrl ? '更换封面' : '设置封面'}`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.12] text-[#D7E2EA]/80 hover:text-[#D7E2EA] border border-[#D7E2EA]/18 text-[11px] font-normal transition-colors cursor-pointer shrink-0"
                          >
                            <Star className="w-3 h-3 stroke-[1.5]" />
                            <span>{img.coverUrl ? '更换封面' : '设置封面'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleCoverFileSelected(file, img.id);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="新窗口打开 HTML"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[11px] text-[#D7E2EA]/80 hover:text-[#0C0C0C] border border-[#D7E2EA]/15 transition-colors"
                          >
                            <span>新窗口</span>
                            <ExternalLink className="w-3 h-3 stroke-[1.5]" />
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(img.id);
                            }}
                            title="移除此 HTML 文件"
                            aria-label={`移除 HTML ${img.alt}`}
                            className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/75 hover:text-[#0C0C0C] flex items-center justify-center transition-colors cursor-pointer border border-[#D7E2EA]/15"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={img.id}
                    onClick={() => setLightboxIndex(idx)}
                    className={`group relative shrink-0 w-[260px] sm:w-[320px] md:w-[360px] h-64 sm:h-72 rounded-[24px] overflow-hidden border bg-[#111318] cursor-pointer snap-start transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.65)] flex flex-col ${
                      img.isCover
                        ? 'border-[#D7E2EA]/75 ring-1 ring-[#D7E2EA]/20'
                        : 'border-[#D7E2EA]/16 hover:border-[#D7E2EA]/40'
                    }`}
                  >
                    {/* Pure Unobstructed Cover Image Area */}
                    <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#14171E]">
                      <img
                        src={img.url}
                        alt={img.alt}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block"
                      />
                    </div>

                    {/* Dedicated Bottom Control Bar (Below Cover Image — Never Obscures Cover) */}
                    <div
                      className="shrink-0 h-11 px-3 bg-[#0E1015] border-t border-[#D7E2EA]/12 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {img.isCover ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-[11px] font-semibold border border-[#D7E2EA] shrink-0">
                            <Star className="w-3 h-3 fill-current stroke-[1.5]" />
                            <span>主封面</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetAsCover(img.id)}
                            title="将此图片设为项目主封面"
                            aria-label={`将 ${img.alt} 设为封面`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/80 hover:text-[#0C0C0C] border border-[#D7E2EA]/18 hover:border-[#D7E2EA] text-[11px] font-normal transition-colors cursor-pointer shrink-0"
                          >
                            <Star className="w-3 h-3 stroke-[1.5]" />
                            <span>设为封面</span>
                          </button>
                        )}

                        <select
                          aria-label={`选择 ${img.alt} 同步封面位置`}
                          value={
                            img.isCover
                              ? 'col2Img'
                              : img.coverSlot || ''
                          }
                          onChange={(e) => {
                            const val = e.target.value as ProjectCoverSlot;
                            if (val) {
                              handleAssignCoverSlot(img.id, val);
                            }
                          }}
                          className="px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-[#D7E2EA]/85 border border-[#D7E2EA]/18 focus:outline-none cursor-pointer shrink-0"
                          title="同步修改外层项目卡片对应位置的封面图"
                        >
                          <option value="" className="bg-[#0E1015]">同步位置…</option>
                          <option value="col2Img" className="bg-[#0E1015]">右侧主封面</option>
                          <option value="col1Img1" className="bg-[#0E1015]">左上封面图</option>
                          <option value="col1Img2" className="bg-[#0E1015]">左下封面图</option>
                        </select>

                        <label
                          title="上传新图片替换并设为封面"
                          aria-label={`为 ${img.alt} 更换封面图`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.12] text-[#D7E2EA]/80 hover:text-[#D7E2EA] border border-[#D7E2EA]/18 text-[11px] font-normal transition-colors cursor-pointer shrink-0"
                        >
                          <Upload className="w-3 h-3 stroke-[1.5]" />
                          <span>更换封面</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleCoverFileSelected(file, img.id);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(idx)}
                          title="点击放大预览"
                          aria-label={`放大预览 ${img.alt}`}
                          className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/75 hover:text-[#0C0C0C] flex items-center justify-center transition-colors cursor-pointer border border-[#D7E2EA]/15"
                        >
                          <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          title="移除此图片"
                          aria-label={`移除图片 ${img.alt}`}
                          className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/75 hover:text-[#0C0C0C] flex items-center justify-center transition-colors cursor-pointer border border-[#D7E2EA]/15"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Unified Multi-Type Upload Card (Images, Videos, HTML) at the end of the scroll list */}
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
                className={`group relative shrink-0 w-[250px] sm:w-[280px] h-64 sm:h-72 rounded-[24px] border border-dashed flex flex-col items-center justify-center gap-3 p-5 text-center cursor-pointer snap-start transition-all duration-200 ${
                  isDragging
                    ? 'border-[#D7E2EA] bg-[#D7E2EA]/10 scale-[1.01]'
                    : 'border-[#D7E2EA]/22 bg-[#111318]/70 hover:border-[#D7E2EA]/55 hover:bg-[#14171F]'
                }`}
              >
                <div className="w-10 h-10 rounded-full border border-[#D7E2EA]/20 bg-[#161922] flex items-center justify-center text-[#D7E2EA]/80 group-hover:bg-[#D7E2EA] group-hover:text-[#0C0C0C] transition-all duration-200">
                  <Upload className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs sm:text-sm font-medium text-[#D7E2EA]/90 group-hover:text-[#D7E2EA] transition-colors">
                    上传 HTML / 视频 / 图片
                  </span>
                  <span className="text-[11px] text-[#D7E2EA]/50 font-light">
                    点击选择或拖拽文件至此
                  </span>
                  <span className="text-[10px] text-[#D7E2EA]/40 mt-0.5 uppercase tracking-widest font-mono">
                    HTML · MP4/WebM · PNG/JPG
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => htmlInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] border border-[#D7E2EA]/20 text-[11px] text-[#D7E2EA]/80 hover:text-[#0C0C0C] font-normal transition-colors cursor-pointer"
                  >
                    + HTML文件
                  </button>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#D7E2EA] border border-[#D7E2EA]/20 text-[11px] text-[#D7E2EA]/80 hover:text-[#0C0C0C] font-normal transition-colors cursor-pointer"
                  >
                    + 视频文件
                  </button>
                </div>
              </div>
            </div>

            {/* Inline / Fullscreen Live HTML Viewer Panel (Positioned Below Preview Images) */}
            {activeHtmlViewer && (
              <div
                className={
                  activeHtmlViewer.isFullscreen
                    ? 'fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl p-3 sm:p-6 flex flex-col'
                    : 'mt-5 rounded-[24px] border border-[#D7E2EA]/30 bg-[#0E1015] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.75)] flex flex-col'
                }
                onClick={(e) => e.stopPropagation()}
              >
                {/* HTML Viewer Top Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#13161E] border-b border-[#D7E2EA]/12">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-[#D7E2EA]/20 text-[11px] font-medium text-[#D7E2EA]">
                      <Code2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>HTML 在线预览</span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#D7E2EA]/90 truncate max-w-[200px] sm:max-w-[320px]">
                      {activeHtmlViewer.fileName}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Viewport Switcher */}
                    <div className="hidden sm:inline-flex items-center rounded-full border border-[#D7E2EA]/18 bg-[#0C0E13] p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveHtmlViewer((prev) =>
                            prev ? { ...prev, viewport: 'desktop' } : null
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                          activeHtmlViewer.viewport === 'desktop'
                            ? 'bg-[#D7E2EA] text-[#0C0C0C] font-semibold'
                            : 'text-[#D7E2EA]/65 hover:text-[#D7E2EA]'
                        }`}
                      >
                        <Monitor className="w-3 h-3 stroke-[1.5]" />
                        <span>桌面</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveHtmlViewer((prev) =>
                            prev ? { ...prev, viewport: 'mobile' } : null
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                          activeHtmlViewer.viewport === 'mobile'
                            ? 'bg-[#D7E2EA] text-[#0C0C0C] font-semibold'
                            : 'text-[#D7E2EA]/65 hover:text-[#D7E2EA]'
                        }`}
                      >
                        <Smartphone className="w-3 h-3 stroke-[1.5]" />
                        <span>手机</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => htmlInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D7E2EA]/18 bg-white/[0.04] hover:bg-white/[0.1] text-xs text-[#D7E2EA]/85 hover:text-[#D7E2EA] transition-colors cursor-pointer"
                      title="打开另一个本地 HTML 文件"
                    >
                      <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>切换 HTML 文件</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveHtmlViewer((prev) =>
                          prev ? { ...prev, refreshKey: Date.now() } : null
                        )
                      }
                      className="w-7 h-7 rounded-full border border-[#D7E2EA]/18 bg-white/[0.04] hover:bg-white/[0.1] text-[#D7E2EA]/80 hover:text-[#D7E2EA] flex items-center justify-center transition-colors cursor-pointer"
                      title="重新加载 HTML 预览"
                      aria-label="重新加载 HTML 预览"
                    >
                      <RefreshCw className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>

                    <a
                      href={activeHtmlViewer.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D7E2EA]/25 bg-white/[0.06] hover:bg-[#D7E2EA] text-xs text-[#D7E2EA] hover:text-[#0C0C0C] transition-colors cursor-pointer"
                      title="在浏览器新标签页直接打开此 HTML 文件"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>直接新窗口打开</span>
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveHtmlViewer((prev) =>
                          prev ? { ...prev, isFullscreen: !prev.isFullscreen } : null
                        )
                      }
                      className="w-7 h-7 rounded-full border border-[#D7E2EA]/18 bg-white/[0.04] hover:bg-white/[0.1] text-[#D7E2EA]/80 hover:text-[#D7E2EA] flex items-center justify-center transition-colors cursor-pointer"
                      title={activeHtmlViewer.isFullscreen ? '退出全屏' : '全屏查看 HTML'}
                      aria-label={activeHtmlViewer.isFullscreen ? '退出全屏' : '全屏查看 HTML'}
                    >
                      {activeHtmlViewer.isFullscreen ? (
                        <Minimize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveHtmlViewer(null)}
                      className="w-7 h-7 rounded-full border border-[#D7E2EA]/18 bg-white/[0.04] hover:bg-[#D7E2EA] text-[#D7E2EA]/80 hover:text-[#0C0C0C] flex items-center justify-center transition-colors cursor-pointer"
                      title="关闭 HTML 在线预览"
                      aria-label="关闭 HTML 在线预览"
                    >
                      <X className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>

                {/* Live Sandbox Iframe Stage */}
                <div
                  className={`w-full bg-[#090A0F] flex items-center justify-center overflow-hidden ${
                    activeHtmlViewer.isFullscreen ? 'flex-1' : 'h-[420px] sm:h-[480px]'
                  }`}
                >
                  <iframe
                    key={activeHtmlViewer.refreshKey}
                    title={activeHtmlViewer.title}
                    srcDoc={activeHtmlViewer.htmlContent}
                    sandbox="allow-scripts allow-forms allow-popups allow-modals"
                    style={{
                      width:
                        activeHtmlViewer.viewport === 'mobile' ? '390px' : '100%',
                      height: '100%',
                    }}
                    className="border-0 bg-white transition-all duration-200 shadow-2xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Bar + Seamless Previous / Next Project Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D7E2EA]/12">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const el = document.getElementById('projects');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/40 bg-[#12151C] hover:bg-[#D7E2EA] hover:border-[#D7E2EA] px-5 py-2 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] hover:text-[#0C0C0C] transition-all duration-200 cursor-pointer"
              >
                <span>查看全部项目</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>

              {onSelectProjectNumber && (
                <div className="inline-flex items-center gap-2">
                  {(() => {
                    const currentIdx = PROJECTS.findIndex(
                      (p) => p.number === project.number
                    );
                    const prevProj =
                      PROJECTS[
                        (currentIdx - 1 + PROJECTS.length) % PROJECTS.length
                      ];
                    const nextProj =
                      PROJECTS[(currentIdx + 1) % PROJECTS.length];
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => onSelectProjectNumber(prevProj.number)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/20 bg-[#111318] hover:border-[#D7E2EA]/55 hover:bg-[#161922] px-4 py-2 text-xs text-[#D7E2EA]/80 hover:text-[#D7E2EA] transition-colors cursor-pointer"
                          title={`切换到上一篇：${prevProj.number} ${prevProj.name}`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                          <span>上一篇 · {prevProj.number}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectProjectNumber(nextProj.number)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/20 bg-[#111318] hover:border-[#D7E2EA]/55 hover:bg-[#161922] px-4 py-2 text-xs text-[#D7E2EA]/80 hover:text-[#D7E2EA] transition-colors cursor-pointer"
                          title={`切换到下一篇：${nextProj.number} ${nextProj.name}`}
                        >
                          <span>下一篇 · {nextProj.number}</span>
                          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-widest text-[#D7E2EA]/55 hover:text-[#D7E2EA] transition-colors cursor-pointer"
            >
              关闭预览
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal when an image or video is clicked */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="高清大图与视频全屏预览"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar Controls */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-1.5 rounded-full bg-[#12151C]/90 backdrop-blur-md border border-[#D7E2EA]/20 text-xs text-[#D7E2EA] font-medium tracking-wider">
              <span>{project.name}</span>
              <span className="mx-2 opacity-35">/</span>
              <span className="tabular-nums">
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(galleryImages[lightboxIndex].type === 'image' ||
                Boolean(galleryImages[lightboxIndex].coverUrl)) &&
                (galleryImages[lightboxIndex].isCover ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-xs font-semibold border border-[#D7E2EA]">
                    <Star className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
                    <span>当前封面</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetAsCover(galleryImages[lightboxIndex].id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12151C]/90 hover:bg-[#D7E2EA] border border-[#D7E2EA]/20 hover:border-[#D7E2EA] text-xs font-medium text-[#D7E2EA] hover:text-[#0C0C0C] transition-colors cursor-pointer"
                    title="设为项目封面"
                  >
                    <Star className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>设为封面</span>
                  </button>
                ))}
              <label
                title="上传本地图片设置或更换封面"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12151C]/90 hover:bg-[#D7E2EA] border border-[#D7E2EA]/20 hover:border-[#D7E2EA] text-xs font-medium text-[#D7E2EA] hover:text-[#0C0C0C] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>
                  {galleryImages[lightboxIndex].coverUrl ? '更换封面' : '设置封面'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    const currentItem = galleryImages[lightboxIndex];
                    if (file && currentItem) {
                      handleCoverFileSelected(file, currentItem.id);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentImg = galleryImages[lightboxIndex];
                  if (currentImg) {
                    handleDeleteImage(currentImg.id);
                  }
                }}
                className="p-2.5 rounded-full bg-[#12151C]/90 hover:bg-[#D7E2EA] border border-[#D7E2EA]/20 text-[#D7E2EA] hover:text-[#0C0C0C] transition-colors cursor-pointer"
                title="删除当前媒体"
                aria-label="删除当前媒体"
              >
                <Trash2 className="w-4 h-4 stroke-[1.5]" />
              </button>
              <a
                href={galleryImages[lightboxIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#12151C]/90 hover:bg-[#D7E2EA] border border-[#D7E2EA]/20 text-[#D7E2EA] hover:text-[#0C0C0C] transition-colors cursor-pointer"
                title="新窗口查看原文件"
              >
                <ExternalLink className="w-4 h-4 stroke-[1.5]" />
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
            aria-label="查看上一项"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#D7E2EA] hover:text-white backdrop-blur-md transition-all cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Fullscreen Media (Video, HTML, or Image) */}
          <div
            className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages[lightboxIndex].type === 'video' ? (
              <video
                src={galleryImages[lightboxIndex].url}
                poster={galleryImages[lightboxIndex].coverUrl}
                controls
                autoPlay
                playsInline
                className="max-w-[92vw] max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black"
              />
            ) : galleryImages[lightboxIndex].type === 'html' ? (
              <iframe
                title={galleryImages[lightboxIndex].alt}
                srcDoc={galleryImages[lightboxIndex].htmlContent || defaultHtmlContent}
                sandbox="allow-scripts allow-forms allow-popups allow-modals"
                className="w-[88vw] h-[80vh] rounded-2xl bg-white border-0 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
              />
            ) : (
              <img
                src={galleryImages[lightboxIndex].url}
                alt={galleryImages[lightboxIndex].alt}
                referrerPolicy="no-referrer"
                className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] select-none"
              />
            )}
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
            aria-label="查看下一项"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#D7E2EA] hover:text-white backdrop-blur-md transition-all cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Hint */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#D7E2EA]/50 font-light tracking-widest hidden sm:block pointer-events-none"
          >
            支持键盘 ← → 键切换媒体 · ESC 键退出全屏
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
