import React, { useRef, useState } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { Upload, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './Buttons';
import {
  calculateProjectCardMetrics,
  ProjectCoverSlot,
} from '../utils/portfolioMath';

export interface ProjectMetricItem {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
}

export interface ProjectColorToken {
  name: string;
  hex: string;
}

export interface ProjectItem {
  number: string;
  name: string;
  category: string;
  role: string;
  period: string;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
  summary: string;
  deliverables: string;
  tools: string[];
  palette: ProjectColorToken[];
  keyDecision: string;
  metrics: ProjectMetricItem[];
  background: string[];
  process: string[];
  outcomes: string[];
}

export const PROJECTS: ProjectItem[] = [
  {
    number: '01',
    name: 'Aura 品牌视觉识别系统',
    category: '品牌视觉设计',
    role: '设计组长 · 品牌主创',
    period: '2025.03 – 2025.07',
    col1Img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1Img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2Img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    summary:
      '从品牌核心内核推导超级符号，制定完备的 VI 视觉规范、字体排版体系与 30+ 项线下全场景物料落地体系。',
    deliverables: 'Logo 与符号系统 · VI 视觉规范手册 · 30+ 项包装与导视物料落地',
    tools: ['Illustrator', 'Photoshop', 'InDesign', 'Cinema 4D', '印前色彩管理'],
    palette: [
      { name: '极光紫 Aura Violet', hex: '#B600A8' },
      { name: '深空黑 Obsidian', hex: '#0C0C0C' },
      { name: '冰川银 Glacial Mist', hex: '#D7E2EA' },
    ],
    keyDecision:
      '摒弃传统复杂的图形堆砌，采用模块化几何网格推导品牌超级符号，并同步建立潘通专色（Pantone）与 CMYK/RGB 跨介质映射表，确保从 16px 数字图标到 3 米空间导视牌的零色差高辨识度落地。',
    metrics: [
      { value: 30, suffix: '+', label: '项全场景落地物料' },
      { value: 9.5, decimals: 1, suffix: '/10', label: '客户与园方满意度' },
      { value: 40, suffix: '+', label: '深度访谈调研样本' },
    ],
    background: [
      '区域内竞品视觉同质化严重，缺乏兼具现代审美温度与高辨识度的品牌核心超级符号。',
      '带队完成周边 3 家竞品机构实地调研，深度访谈管理方与目标受众各 20+ 人，精准提炼品牌信任痛点。',
      '原有线下导视、宣传物料及周边延展缺乏统一规范，跨媒介印刷与数字传播视觉一致性不足。',
    ],
    process: [
      '输出完整用户画像与品牌定位调研报告，主导视觉风格推导并完成 3 稿差异化 Logo 方案比稿提案。',
      '构建完备的 VI 基础规范系统，涵盖标准色彩矩阵、中西文字体排印层级与模块化几何辅助图形。',
      '统筹推进服装、礼盒包装、宣传册及空间环境导视系统等 30+ 项全场景应用物料的设计打样与落地。',
    ],
    outcomes: [
      '30+ 项全场景品牌应用物料高质量交付落地，建立可长期复用的标准化《VI 视觉识别管理手册》。',
      '最终提案获得合作方与园方 9.5 / 10 的高度满意度评价，显著提升品牌线下空间与传播辨识度。',
      '凭借完整的商业调研闭环与高完成度视觉执行，该项目获评校级优秀课程设计作业。',
    ],
  },
  {
    number: '02',
    name: 'Solaris 智慧交互体验',
    category: 'UI/UX 界面设计',
    role: '独立 UI/UX 设计师',
    period: '2024.11 – 2025.04',
    col1Img1:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=85',
    col1Img2:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1280&q=85',
    col2Img:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=85',
    summary:
      '基于 Figma 深度搭建模块化设计系统与 Design Token 规范，覆盖多端响应式 Web 控制台、车载 HUD 与高保真交互原型。',
    deliverables: 'Design System 组件库 · 多端响应式 UI · 交互原型与微动效',
    tools: ['Figma', 'Auto-Layout', 'Design Tokens', 'After Effects', '可用性走查'],
    palette: [
      { name: '电光青 Cyber Cyan', hex: '#38BDF8' },
      { name: '深邃碳板 Carbon UI', hex: '#111318' },
      { name: '星云紫 Nebula Purple', hex: '#7621B0' },
    ],
    keyDecision:
      '针对多终端高密度数据的视觉过载问题，引入三级语义化 Design Token 与 Bento 响应式栅格，将次要参数折叠至渐进式披露（Progressive Disclosure）浮层中，使首屏核心指标识别速度提升 42%。',
    metrics: [
      { value: 60, suffix: '+', label: 'Figma 原子化组件' },
      { value: 3, suffix: '端', label: '响应式多端协同' },
      { value: 42, suffix: '%', label: '高频任务路径提效' },
    ],
    background: [
      '复杂数据中台与智能终端信息密度过高，用户在高频监控与跨层级操作中面临较大认知负荷。',
      '桌面 Web 控制台、移动端与智能 HUD 终端之间缺乏统一的视觉语言与组件复用机制。',
      '深色模式（Dark Mode）下传统高饱和色块易引发视觉疲劳，信息呼吸感与对比度亟待系统重构。',
    ],
    process: [
      '基于 Figma 搭建原子化 Design System 与全局 Design Token 规范，统一间距、圆角与色彩语义变量。',
      '重构核心业务信息架构（IA），采用 Bento 模块化网格布局将关键指标卡片与交互热区清晰分层。',
      '输出高保真可交互原型，并为状态切换、数据加载与微交互设计细腻的弹簧物理动效曲线。',
    ],
    outcomes: [
      '沉淀 60+ 个高复用性 Figma Auto-Layout 变体组件，覆盖 Web 端、平板端与车载 HUD 三端一致体验。',
      '可用性测试走查显示，高频任务检索与跨层级操作步骤精简 42%，深色界面可读性大幅跃升。',
      '输出完备的交互说明文档与动效参数标注，助力设计与前端开发实现零误差高保真还原。',
    ],
  },
  {
    number: '03',
    name: 'Nextlevel 三维与动态短片',
    category: '三维与动效',
    role: '三维视觉 & 动态设计师',
    period: '2024.09 – 2025.02',
    col1Img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2Img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    summary:
      '运用 Cinema 4D 结合专业材质与定制灯光渲染，制作精细的工业级产品三维透视、三渲二风格化画面与 After Effects 节奏动态短片。',
    deliverables: 'C4D 产品三维渲染 · 三渲二风格化视觉 · AE 动态短片包装',
    tools: ['Cinema 4D', 'After Effects', 'Premiere Pro', 'AOV 多通道合成', 'PBR 材质'],
    palette: [
      { name: '钛金属灰 Titanium', hex: '#94A3B8' },
      { name: '霓虹洋红 Neon Magenta', hex: '#F472B6' },
      { name: '暗夜基底 Void Black', hex: '#090A0F' },
    ],
    keyDecision:
      '采用 AOV 多通道分层渲染替代传统单通道直出，在 After Effects 中独立调控高光、折射与 Z-Depth 景深通道，在保留工业级金属与玻璃色散质感的同时将单镜头返工耗时降低 35%。',
    metrics: [
      { value: 18, suffix: '+', label: '高精度三维资产' },
      { value: 60, suffix: 'fps', label: '高帧率动态成片' },
      { value: 35, suffix: '%', label: '后期合成效率提升' },
    ],
    background: [
      '传统静态平面海报难以立体呈现先锋概念产品的精密工业结构、内部透视关系与 PBR 材质张力。',
      '新媒体数字传播亟需具备强烈视觉冲击力的三维动态短片（Motion Graphics）以抓住受众前 3 秒注意力。',
      '写实硬表面渲染与“三渲二”风格化视觉之间需要建立兼顾艺术表现力与渲染效率的标准化流程。',
    ],
    process: [
      '运用 Cinema 4D 进行高精度硬表面建模与拓扑优化，定制阳极氧化铝、半透明磨砂与色散玻璃材质。',
      '搭建演播室级 HDRI 与多光源戏剧化布光方案，采用多通道（AOV）分层渲染精准把控反射与景深质感。',
      '导入 After Effects 与 Premiere Pro 进行分镜剪辑、关键帧弹性曲线调校、粒子视效合成与卡点音效包装。',
    ],
    outcomes: [
      '高质量输出 18+ 组超清工业级产品三维主视觉（KV）渲染图及多支 60fps 概念动态短片。',
      '跑通成熟的“写实光影 + 三渲二风格化”双轨渲染合成管线，单镜头后期迭代效率提升 35%。',
      '相关三维视觉与动态包装方案应用于多项校园数字媒体展映与视觉传播项目，获专业导师高度评价。',
    ],
  },
  {
    number: '04',
    name: 'Synthetix 生成式 AI 视觉实验室',
    category: '生成式 AI 视觉',
    role: 'AIGC 视觉工作流主创',
    period: '2025.01 – 2025.08',
    col1Img1:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1280&q=85',
    col1Img2:
      'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?auto=format&fit=crop&w=1280&q=85',
    col2Img:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1280&q=85',
    summary:
      '搭建 ComfyUI 可控生成管线（ControlNet + IP-Adapter），结合 Runway Gen-3 视频生成模型，输出电影质感概念场景与高张力视觉叙事。',
    deliverables: 'ComfyUI 定制控图工作流 · Runway 动态视频生成 · AI 概念视效',
    tools: ['ComfyUI', 'ControlNet', 'IP-Adapter', 'Midjourney', 'Runway Gen-3'],
    palette: [
      { name: '赛博紫红 Synth Magenta', hex: '#D946EF' },
      { name: '量子蓝 Quantum Blue', hex: '#3B82F6' },
      { name: '矩阵深灰 Matrix Slate', hex: '#14171F' },
    ],
    keyDecision:
      '告别不可控的“随机抽卡”模式，通过 C4D 白模提供精准空间透视（Depth/Canny ControlNet），叠加 IP-Adapter 锁定品牌材质与色调，再由 Runway 首尾帧关键帧锚定生成连贯运镜，实现商业级可控交付。',
    metrics: [
      { value: 12, suffix: '+', label: 'ComfyUI 定制工作流' },
      { value: 300, suffix: '%', label: '概念提案效率提升' },
      { value: 25, suffix: '+', label: '商业级 AI 视觉成片' },
    ],
    background: [
      '商业视觉前期概念探索（Moodboard 与分镜设定）周期漫长，传统手绘或三维搭建的试错成本高昂。',
      '普通文生图工具依赖随机抽卡，存在构图不可控、主体结构漂移与品牌色调难以统一等核心痛点。',
      '静态 AI 概念图向动态视频延展时，容易出现画面闪烁、镜头运动失真与材质细节崩坏。',
    ],
    process: [
      '基于 ComfyUI 搭建节点式可控生成管线，深度串联 ControlNet（线稿/深度/姿态控制）与 IP-Adapter 风格迁移。',
      '结合 Midjourney 与 NanoBanana 进行高精度材质与先锋构图探索，建立结构化光影与镜头语言提示词库。',
      '引入 Runway Gen-3 与 Photoshop 后期精修，通过首尾帧锚定与运动笔刷控制，输出电影级运镜动态短片。',
    ],
    outcomes: [
      '沉淀 12+ 套可复用的 ComfyUI 商业级控图工作流，覆盖产品合成、先锋海报与概念场景快速生成。',
      '将前期视觉提案与多风格方案比稿周期压缩 70% 以上，整体创意探索与出图效率提升 300%。',
      '累计产出 25+ 组高张力 AIGC 概念视觉与动态叙事短片，实现 AI 生成力与专业美术指导的深度融合。',
    ],
  },
  {
    number: '05',
    name: '泰州科技馆 · 学术会议平面矩阵',
    category: '平面与海报',
    role: '科普视觉设计助理 & 科研处助理',
    period: '2024.01 – 2025.10',
    col1Img1:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1280&q=85',
    col1Img2:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1280&q=85',
    col2Img:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1280&q=85',
    summary:
      '为泰州市科技馆及校级学术研讨会议量身打造的平面物料矩阵，涵盖 20+ 件主视觉海报、12 块展厅导视展板改版及 3 场学术会议全套视觉。',
    deliverables: '活动主视觉海报 · 学术研讨会议全套物料 · 科普展板与导视系统',
    tools: ['Illustrator', 'Photoshop', 'InDesign', '信息可视化', '印前完稿规范'],
    palette: [
      { name: '科技馆蓝 Museum Cobalt', hex: '#2563EB' },
      { name: '学术暖金 Academic Amber', hex: '#F59E0B' },
      { name: '展陈亮白 Gallery White', hex: '#F8FAFC' },
    ],
    keyDecision:
      '针对科普展板文字密集与多规格会议物料并行痛点，建立瑞士国际主义网格模版与信息图表（Infographic）转译体系，将复杂科学原理转化为青少年3秒可读的视觉动线，并实现多尺寸零差错印前交付。',
    metrics: [
      { value: 5000, suffix: '+', label: '市民科普触达人次' },
      { value: 200, suffix: '+', label: '份科研文档标准化归档' },
      { value: 12, suffix: '块', label: '常设展厅展板改版' },
    ],
    background: [
      '泰州市科技馆常设展厅部分展板存在图文陈旧、高密度科普信息层级混乱、青少年阅读兴趣偏低等痛点。',
      '暑期 6 场系列科普活动、3 场“科普进社区”与校科研处学术会议并行，需在紧凑周期内完成多规格物料交付。',
      '跨部门对接与大型喷绘印刷落地流程中，亟需建立统一的版式网格、印前色彩规范与文档归档标准。',
    ],
    process: [
      '主导科技馆暑期系列科普活动全套视觉设计，统筹完成 12 块常设展厅展板的信息可视化重构与版式升级。',
      '独立负责校科研处 3 场校级学术会议整体视觉系统（主视觉海报、舞台背景板、议程手册、席卡及 PPT 模板）。',
      '运用模块化网格系统梳理高密度文字与图表，跟进现场物料布置，并独立拍摄剪辑 6 条配套科普短视频。',
    ],
    outcomes: [
      '累计设计输出 20+ 件大型科普展板与活动主视觉海报，被科技馆官方公众号及视频号发布，触达市民 5000+ 人次。',
      '圆满保障 3 场校级学术会议零差错视觉落地，并建立标准化流程完成 200+ 份科研申报与成果材料规范归档。',
      '凭借高效的多线程抗压交付能力与严谨的印前完稿质量，获得泰州市科技馆运营部门与校科研处高度认可。',
    ],
  },
];

interface StickyProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
  onSelectProject: (project: ProjectItem) => void;
  onCustomSlotCover?: (
    project: ProjectItem,
    slot: ProjectCoverSlot,
    file: File
  ) => void;
}

const StickyProjectCard: React.FC<StickyProjectCardProps> = ({
  project,
  index,
  totalCards,
  progress,
  onSelectProject,
  onCustomSlotCover,
}) => {
  const { targetScale, topOffsetPx, rangeStart } = calculateProjectCardMetrics(
    index,
    totalCards
  );
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);
  const compactTopOffsetPx = Math.round(topOffsetPx * 0.36);

  return (
    <div
      id={`project-card-${project.number}`}
      className="min-h-[82vh] sticky top-6 md:top-8 flex items-start justify-center mb-16 md:mb-24"
    >
      <motion.article
        style={{
          scale,
          top: `${compactTopOffsetPx}px`,
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
        className="relative w-full max-w-6xl rounded-[36px] sm:rounded-[44px] md:rounded-[48px] border-2 border-[#D7E2EA] bg-[#0C0C0C] pt-6 sm:pt-7 md:pt-8 px-5 sm:px-7 md:px-8 pb-5 sm:pb-6 flex flex-col gap-3.5 md:gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.82)]"
      >
        {/* Top Row: Number, Category + Project Name + Role/Timeline, Live Project Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-2 sm:px-3">
          <div className="flex items-center gap-5 sm:gap-7 md:gap-9">
            <span
              className="font-bold text-[#D7E2EA] leading-[1.08] tracking-[0.06em] px-1.5 py-0.5 shrink-0 select-none"
              style={{ fontSize: 'clamp(2.5rem, 5.2vw, 76px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#D7E2EA]/65 font-normal uppercase tracking-[0.14em]">
                <span className="text-[#D7E2EA]/90 font-semibold">
                  {project.category}
                </span>
                <span className="opacity-30">/</span>
                <span className="text-[#D7E2EA]/75">{project.role}</span>
                <span className="opacity-30 hidden sm:inline">/</span>
                <span className="hidden sm:inline text-[#D7E2EA]/50 font-mono">
                  {project.period}
                </span>
              </div>
              <h3
                className="text-[#D7E2EA] font-bold uppercase tracking-wide leading-snug"
                style={{ fontSize: 'clamp(1.25rem, 2.3vw, 2.05rem)' }}
              >
                {project.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light line-clamp-1 max-w-2xl hidden md:block">
                {project.summary}
              </p>
            </div>
          </div>

          <LiveProjectButton onClick={() => onSelectProject(project)} />
        </div>

        {/* Middle Row: Two-Column Image Grid (40% Left with 2 stacked images, 60% Right with 1 tall image) */}
        <div
          data-cursor="project"
          data-cursor-label="查看项目"
          onClick={() => onSelectProject(project)}
          className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full cursor-pointer"
        >
          {/* Left Column (40%) */}
          <div className="w-full md:w-[40%] flex flex-col gap-3 sm:gap-4">
            <div
              className="group/slot1 relative w-full overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] bg-[#16181D]"
              style={{ height: 'clamp(105px, 11.5vw, 155px)' }}
            >
              <img
                src={project.col1Img1}
                alt={`${project.name} showcase detail 1`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[28px] sm:rounded-[36px] md:rounded-[40px] block transition-transform duration-300 group-hover/slot1:scale-[1.03]"
              />
              {onCustomSlotCover && (
                <label
                  onClick={(e) => e.stopPropagation()}
                  title="上传自定义左上封面图"
                  aria-label={`自定义 ${project.name} 左上封面`}
                  className="absolute bottom-3 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C0C0C]/80 hover:bg-[#D7E2EA] text-[#D7E2EA] hover:text-[#0C0C0C] border border-[#D7E2EA]/30 hover:border-[#D7E2EA] text-xs font-medium backdrop-blur-md opacity-0 group-hover/slot1:opacity-100 focus-within:opacity-100 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>自定义封面</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onCustomSlotCover(project, 'col1Img1', file);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div
              className="group/slot2 relative w-full overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] bg-[#16181D]"
              style={{ height: 'clamp(125px, 14.5vw, 205px)' }}
            >
              <img
                src={project.col1Img2}
                alt={`${project.name} showcase detail 2`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[28px] sm:rounded-[36px] md:rounded-[40px] block transition-transform duration-300 group-hover/slot2:scale-[1.03]"
              />
              {onCustomSlotCover && (
                <label
                  onClick={(e) => e.stopPropagation()}
                  title="上传自定义左下封面图"
                  aria-label={`自定义 ${project.name} 左下封面`}
                  className="absolute bottom-3 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C0C0C]/80 hover:bg-[#D7E2EA] text-[#D7E2EA] hover:text-[#0C0C0C] border border-[#D7E2EA]/30 hover:border-[#D7E2EA] text-xs font-medium backdrop-blur-md opacity-0 group-hover/slot2:opacity-100 focus-within:opacity-100 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>自定义封面</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onCustomSlotCover(project, 'col1Img2', file);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Right Column (60%) */}
          <div className="w-full md:w-[60%] flex">
            <div
              className="group/slot3 relative w-full overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] bg-[#16181D] flex-1"
              style={{
                height:
                  'calc(clamp(105px, 11.5vw, 155px) + clamp(125px, 14.5vw, 205px) + 1rem)',
              }}
            >
              <img
                src={project.col2Img}
                alt={`${project.name} primary 3D render`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[28px] sm:rounded-[36px] md:rounded-[40px] block transition-transform duration-300 group-hover/slot3:scale-[1.03]"
              />
              {onCustomSlotCover && (
                <label
                  onClick={(e) => e.stopPropagation()}
                  title="上传自定义右侧主封面图"
                  aria-label={`自定义 ${project.name} 右侧主封面`}
                  className="absolute bottom-4 right-5 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0C0C0C]/85 hover:bg-[#D7E2EA] text-[#D7E2EA] hover:text-[#0C0C0C] border border-[#D7E2EA]/35 hover:border-[#D7E2EA] text-xs font-semibold backdrop-blur-md opacity-0 group-hover/slot3:opacity-100 focus-within:opacity-100 transition-all duration-200 cursor-pointer shadow-xl"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>自定义主封面</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onCustomSlotCover(project, 'col2Img', file);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Executive Case Study Footer Bar: Core Quantitative Outcomes + Tool Stack & Deliverables */}
        <footer
          onClick={() => onSelectProject(project)}
          className="pt-3.5 sm:pt-4 px-2 sm:px-4 border-t border-[#D7E2EA]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-3 cursor-pointer"
        >
          {/* Quantitative Impact Highlights */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#D7E2EA] leading-tight tracking-normal">
                  {metric.decimals
                    ? metric.value.toFixed(metric.decimals)
                    : metric.value}
                  {metric.suffix}
                </span>
                <span className="text-xs text-[#D7E2EA]/60 font-light">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tool Stack & Interactive Case Study Trigger */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 text-xs text-[#D7E2EA]/65">
            <div className="flex flex-wrap items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 stroke-[1.5] text-[#D7E2EA]/55 shrink-0" />
              <span className="font-light">{project.tools.join(' · ')}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#D7E2EA] font-semibold hover:text-white transition-colors">
              <span>STAR 案例拆解与在线演示</span>
              <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
            </span>
          </div>
        </footer>
      </motion.article>
    </div>
  );
};

interface ProjectsSectionProps {
  projects?: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onCustomSlotCover?: (
    project: ProjectItem,
    slot: ProjectCoverSlot,
    file: File
  ) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = PROJECTS,
  onSelectProject,
  onCustomSlotCover,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const categories = ['全部', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filteredProjects =
    selectedCategory === '全部'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="projects"
      aria-label="作品"
      className="relative z-10 w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-28 sm:pb-36"
    >
      <FadeIn delay={0} y={40}>
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-6 sm:mb-8"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            作品
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#D7E2EA]/75 font-light text-center max-w-3xl mb-7 leading-relaxed">
            精选 5 个商业与学术闭环代表作，涵盖品牌 VI 全案、多端 UI/UX 设计系统、C4D 三维动效与 ComfyUI 可控生成视觉。支持按专业方向筛选、自定义三栏封面、在线预览 HTML 原型及播放高清视频。
          </p>

          {/* Category Filter Bar */}
          <div
            role="tablist"
            aria-label="作品专业方向筛选"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-7"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === '全部'
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wider transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-[#D7E2EA] text-[#0C0C0C] border-[#D7E2EA]'
                      : 'bg-[#12151C] text-[#D7E2EA]/75 border-[#D7E2EA]/18 hover:border-[#D7E2EA]/50 hover:text-[#D7E2EA]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1.5 opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick-Jump & Instant Case Study Index Bar for Recruiters */}
          <div className="w-full rounded-[26px] border border-[#D7E2EA]/18 bg-[#111318] p-4 sm:p-5 flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] uppercase tracking-[0.16em] text-[#D7E2EA]/55">
              <span className="inline-flex items-center gap-1.5 text-[#D7E2EA]/85 font-semibold">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5] text-[#D7E2EA]/70" />
                <span>HR / 面试官快速导览索引（点击直达案例详情与交互演示）</span>
              </span>
              <span className="font-mono text-[#D7E2EA]/50">共 {projects.length} 组完整 STAR 案例</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {projects.map((proj) => (
                <button
                  key={proj.number}
                  type="button"
                  onClick={() => onSelectProject(proj)}
                  className="group text-left rounded-[20px] border border-[#D7E2EA]/14 hover:border-[#D7E2EA]/50 bg-[#151820] hover:bg-[#191D26] p-3.5 transition-all duration-200 flex flex-col justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-bold text-[#D7E2EA] leading-none tracking-[0.06em]">
                        {proj.number}
                      </span>
                      <span className="text-[11px] font-normal text-[#D7E2EA]/55 group-hover:text-[#D7E2EA]/80 tracking-wider">
                        {proj.category}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5] text-[#D7E2EA]/40 group-hover:text-[#D7E2EA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                  <div className="text-sm sm:text-[15px] font-bold text-[#D7E2EA] truncate tracking-normal">
                    {proj.name}
                  </div>
                  <div className="text-xs text-[#D7E2EA]/65 font-light truncate">
                    <span className="font-bold text-[#D7E2EA] tracking-normal mr-1">
                      {proj.metrics[0]?.value}
                      {proj.metrics[0]?.suffix}
                    </span>
                    <span>{proj.metrics[0]?.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <div ref={containerRef} className="relative w-full max-w-6xl mx-auto pb-20 md:pb-28">
        {filteredProjects.map((project, index) => (
          <StickyProjectCard
            key={project.number}
            project={project}
            index={index}
            totalCards={filteredProjects.length}
            progress={scrollYProgress}
            onSelectProject={onSelectProject}
            onCustomSlotCover={onCustomSlotCover}
          />
        ))}
      </div>
    </section>
  );
};

