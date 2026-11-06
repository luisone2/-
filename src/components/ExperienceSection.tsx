import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { CountUpNumber } from './CountUpNumber';

interface MetricItem {
  id: string;
  target: number;
  decimals: number;
  suffix: string;
  unitLabel: string;
  title: string;
  subtitle: string;
}

const IMPACT_METRICS: MetricItem[] = [
  {
    id: 'gpa',
    target: 3.65,
    decimals: 2,
    suffix: '',
    unitLabel: '/ 4.0',
    title: '本科专业绩点 (GPA)',
    subtitle: '南京理工大学泰州科技学院 · 数字媒体艺术',
  },
  {
    id: 'reach',
    target: 5000,
    decimals: 0,
    suffix: '+',
    unitLabel: '人次',
    title: '科普视觉市民触达',
    subtitle: '泰州市科技馆展厅改版与系列科普活动传播',
  },
  {
    id: 'vi',
    target: 30,
    decimals: 0,
    suffix: '+',
    unitLabel: '项物料',
    title: '品牌 VI 全场景落地',
    subtitle: '南京粉红塔育儿园 · 园方满意度 9.5 / 10',
  },
  {
    id: 'archive',
    target: 200,
    decimals: 0,
    suffix: '+',
    unitLabel: '份归档',
    title: '学术会议与科研规范',
    subtitle: '3 场校级学术会议全套主视觉与标准化归档',
  },
];

interface ExperienceBadgeMetric {
  target: number;
  decimals?: number;
  suffix: string;
  label: string;
}

interface ExperienceRecord {
  indexNumber: string;
  period: string;
  role: string;
  organization: string;
  category: string;
  highlights: string[];
  outcomeMetric: string;
  badgeMetrics: ExperienceBadgeMetric[];
}

const EXPERIENCE_RECORDS: ExperienceRecord[] = [
  {
    indexNumber: '01',
    period: '2025.03 – 2025.07',
    role: '设计组长',
    organization: '南京粉红塔育儿园品牌形象设计',
    category: '品牌调研 · VI 规范系统 · 全套物料落地',
    outcomeMetric: '获评校级优秀课程作业',
    badgeMetrics: [
      { target: 30, suffix: '+', label: '项落地物料' },
      { target: 9.5, decimals: 1, suffix: '/10', label: '园方满意度' },
    ],
    highlights: [
      '带队完成周边 3 家竞品幼儿园品牌调研，深度访谈园方管理者与家长各 20+ 人，梳理目标用户画像并输出完整品牌定位调研报告。',
      '主导品牌视觉风格推导与 3 稿 Logo 方案提案，确立以“粉红塔”为核心视觉符号的现代简约识别体系。',
      '统筹完成 VI 基础系统（色彩规范、字体系统、辅助图形）及园服、书包、宣传册、园区环境导视等 30+ 项全场景应用物料落地。',
    ],
  },
  {
    indexNumber: '02',
    period: '2024.04 – 2024.10',
    role: '科普视觉设计助理',
    organization: '泰州市科技馆',
    category: '活动主视觉 · 展厅展板改版 · 科普短视频',
    outcomeMetric: '官方公众号与视频号全矩阵发布',
    badgeMetrics: [
      { target: 5000, suffix: '+', label: '市民触达' },
      { target: 12, suffix: '块', label: '展板改版' },
      { target: 20, suffix: '+', label: '件视觉物料' },
    ],
    highlights: [
      '主导暑期 6 场系列科普活动及 3 场“科普进社区”活动的整体视觉设计与物料制作，独立完成主视觉、展架、折页设计与现场布置。',
      '统筹完成 12 块常设展厅展板改版升级，累计设计输出活动海报与科普展板 20+ 件，并独立拍摄剪辑 6 条科普短视频。',
      '设计作品被科技馆官方公众号及视频号采用发布，累计协助科普活动宣传触达市民 5000+ 人次，获馆方运营部门高度认可。',
    ],
  },
  {
    indexNumber: '03',
    period: '2024.01 – 2026.09',
    role: '学生助理',
    organization: '校科研处',
    category: '学术会议全套视觉 · 申报排版规范 · 项目管理',
    outcomeMetric: '建立标准化科研视觉与归档规范',
    badgeMetrics: [
      { target: 200, suffix: '+', label: '份归档文档' },
      { target: 3, suffix: '场', label: '学术会议落地' },
    ],
    highlights: [
      '独立负责 3 场校级学术会议的整体视觉物料体系设计，涵盖会议主视觉、舞台背景板、议程手册、席卡及 PPT 模板并跟进现场落地执行。',
      '参与科研项目申报全流程，负责申报材料初审与视觉排版规范，跟进项目关键节点并负责优秀学生科研成果的图文展示设计。',
      '对接校内多位教师，建立标准化科研文档归档与报表整理流程，累计规范化归档各类科研材料 200+ 份。',
    ],
  },
  {
    indexNumber: '04',
    period: '2023.09 – 2025.10',
    role: '宣传部部长 & 2023 级班长',
    organization: '城建与设计学院团委 & 班级管理',
    category: '新媒体矩阵运营 · 视觉传播 · 团队统筹协调',
    outcomeMetric: '获评校级“优秀班集体”',
    badgeMetrics: [
      { target: 30, suffix: '+', label: '篇原创推文' },
      { target: 2000, suffix: '+', label: '单篇阅读' },
      { target: 1500, suffix: '+', label: '覆盖青年' },
    ],
    highlights: [
      '运营学院团属新媒体宣传矩阵（公众号、视频号），策划产出 30+ 篇青年主题原创图文与活动回顾视频，单条推文最高阅读量破 2000+，覆盖全院 1500+ 名团员青年。',
      '作为学院与学生核心对接人统筹班级运作，策划多场主题活动，带领班级获评校级“优秀班集体”，考勤与奖助学金评定组织零投诉零差错。',
    ],
  },
];

interface SpotlightPanelProps {
  children: React.ReactNode;
  className?: string;
  hoverLift?: number;
}

const SpotlightPanel: React.FC<SpotlightPanelProps> = ({
  children,
  className = '',
  hoverLift = -5,
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
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: hoverLift }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-[36px] sm:rounded-[44px] border-2 border-[#D7E2EA]/25 hover:border-[#D7E2EA] bg-[#0C0C0C] transition-colors duration-200 shadow-[0_20px_50px_rgba(0,0,0,0.65)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(540px circle at ${mousePos.x}px ${mousePos.y}px, rgba(215, 226, 234, 0.10), rgba(118, 33, 176, 0.08) 45%, transparent 75%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

export const ExperienceSection: React.FC = () => {
  return (
    <section
      id="experience"
      aria-label="实践履历与教育背景"
      className="relative z-10 w-full bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] border-t-2 border-[#D7E2EA]/20 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-28 sm:pb-36 overflow-hidden"
    >
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[720px] sm:w-[1050px] h-[360px] bg-gradient-to-b from-[#7621B0]/14 via-[#1e3fd8]/8 to-transparent blur-3xl opacity-75"
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-14 sm:gap-16 md:gap-20">
        {/* Section Heading */}
        <FadeIn delay={0} y={40}>
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/60">
              EDUCATION & HONORS · CAMPUS & INDUSTRY EXPERIENCE
            </span>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              简历
            </h2>
          </div>
        </FadeIn>

        {/* Part 1: Architectural Bento Grid (Education & Honors + 2x2 Impact Metrics) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Bento Card: Education, Honors & Core Curriculum (No Course Scores) */}
          <FadeIn delay={0.1} y={30} className="lg:col-span-7 h-full">
            <SpotlightPanel className="h-full p-6 sm:p-8 md:p-10">
              <div className="h-full flex flex-col justify-between gap-8">
                {/* Top Header */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/60">
                    <span>(教育背景 · EDUCATION)</span>
                    <span className="tabular-nums">2023.09 – 2027.06 · 2027 届本科</span>
                  </div>
                  <h3
                    className="font-bold uppercase tracking-wide text-[#D7E2EA] leading-tight"
                    style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2.1rem)' }}
                  >
                    南京理工大学泰州科技学院
                  </h3>
                  <p className="text-sm sm:text-base font-normal text-[#D7E2EA]/85 tracking-wide">
                    数字媒体艺术 · 全日制本科在读 · 现居武汉（支持异地实习 / 全职到岗）
                  </p>
                </div>

                {/* Middle Divider */}
                <div
                  aria-hidden="true"
                  className="w-full h-px bg-[#D7E2EA]/15 group-hover:bg-[#D7E2EA]/35 transition-colors duration-200"
                />

                {/* Honors & Core Courses Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Sub-column: Campus & Provincial Honors */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/55">
                      (所获荣誉 · HONORS)
                    </span>
                    <ul className="flex flex-col gap-2 text-sm sm:text-base font-medium text-[#D7E2EA]">
                      <li className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] shrink-0" />
                        <span>江苏省大学生创新创业奖项</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7621B0] shrink-0" />
                        <span>校级优秀学生干部</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                        <span>带领班级获评校级“优秀班集体”</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D7E2EA]/70 shrink-0" />
                        <span>学院团委宣传部部长 & 学生会骨干</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right Sub-column: Core Major Curriculum (Strictly without scores) */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/55">
                      (主修方向 · CORE CURRICULUM)
                    </span>
                    <ul className="flex flex-col gap-2 text-sm sm:text-base font-light text-[#D7E2EA]/85">
                      <li className="flex items-center justify-between gap-3 border-b border-[#D7E2EA]/10 pb-1.5 whitespace-nowrap">
                        <span>交互界面与用户体验设计</span>
                        <span className="text-xs uppercase tracking-wider text-[#D7E2EA]/45 shrink-0">UI / UX</span>
                      </li>
                      <li className="flex items-center justify-between gap-3 border-b border-[#D7E2EA]/10 pb-1.5 whitespace-nowrap">
                        <span>字体与版式设计</span>
                        <span className="text-xs uppercase tracking-wider text-[#D7E2EA]/45 shrink-0">Typography</span>
                      </li>
                      <li className="flex items-center justify-between gap-3 border-b border-[#D7E2EA]/10 pb-1.5 whitespace-nowrap">
                        <span>VR 虚拟现实技术</span>
                        <span className="text-xs uppercase tracking-wider text-[#D7E2EA]/45 shrink-0">3D & Spatial</span>
                      </li>
                      <li className="flex items-center justify-between gap-3 pb-0.5 whitespace-nowrap">
                        <span>数字绘本与插画设计</span>
                        <span className="text-xs uppercase tracking-wider text-[#D7E2EA]/45 shrink-0">Illustration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </SpotlightPanel>
          </FadeIn>

          {/* Right Bento Matrix: 2x2 Key Quantitative Metrics */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {IMPACT_METRICS.map((item, idx) => (
              <FadeIn key={item.id} delay={0.15 + idx * 0.06} y={30} className="h-full">
                <SpotlightPanel className="h-full p-6 sm:p-7">
                  <div className="h-full flex flex-col justify-between gap-5">
                    <div className="flex items-baseline gap-2 whitespace-nowrap">
                      <span style={{ fontSize: 'clamp(2rem, 3.1vw, 2.85rem)' }} className="leading-none">
                        <CountUpNumber
                          target={item.target}
                          decimals={item.decimals}
                          suffix={item.suffix}
                          className="hero-heading font-black leading-none tracking-tight"
                        />
                      </span>
                      <span className="text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/60 shrink-0">
                        {item.unitLabel}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-3 border-t border-[#D7E2EA]/15">
                      <h4 className="text-sm sm:text-base font-medium text-[#D7E2EA] tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-xs font-light leading-relaxed text-[#D7E2EA]/60">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </SpotlightPanel>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Part 2: Practice & Project Experience Matrix (01 / 02 / 03 / 04) */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <FadeIn delay={0.15} y={20}>
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 border-b border-[#D7E2EA]/15 text-xs sm:text-sm font-light uppercase tracking-widest text-[#D7E2EA]/60">
              <span>(实践与项目经历 · SELECTED EXPERIENCE)</span>
              <span>01 — 04 · 真实项目与校园履历</span>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {EXPERIENCE_RECORDS.map((exp, idx) => (
              <FadeIn key={exp.indexNumber} delay={0.18 + idx * 0.08} y={32} className="h-full">
                <SpotlightPanel className="h-full p-6 sm:p-8 md:p-9">
                  <article className="h-full flex flex-col justify-between gap-6">
                    {/* Top Row: Index Number + Period & Role */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className="font-black text-[#D7E2EA] leading-none tabular-nums select-none transition-transform duration-200 group-hover:translate-x-1"
                          style={{ fontSize: 'clamp(2.75rem, 4.5vw, 4.25rem)' }}
                        >
                          {exp.indexNumber}
                        </span>
                        <div className="flex flex-col items-end text-right gap-1">
                          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#D7E2EA] tabular-nums">
                            {exp.period}
                          </span>
                          <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60">
                            ({exp.role})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/55">
                          {exp.category}
                        </span>
                        <h3
                          className="text-[#D7E2EA] font-medium uppercase tracking-wide leading-snug"
                          style={{ fontSize: 'clamp(1.15rem, 2vw, 1.65rem)' }}
                        >
                          {exp.organization}
                        </h3>
                      </div>
                    </div>

                    {/* Hairline Divider */}
                    <div
                      aria-hidden="true"
                      className="w-full h-px bg-[#D7E2EA]/15 group-hover:bg-[#D7E2EA]/35 transition-colors duration-200"
                    />

                    {/* Bullet Highlights */}
                    <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-light leading-relaxed text-[#D7E2EA]/75 flex-1">
                      {exp.highlights.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D7E2EA]/45 group-hover:bg-[#D7E2EA] transition-colors shrink-0"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Bottom Quantified Outcome Line */}
                    <div className="pt-3.5 border-t border-[#D7E2EA]/12 flex flex-wrap items-center justify-between gap-2 text-xs font-medium tracking-wider text-[#D7E2EA]/90">
                      <div className="flex flex-wrap items-center gap-3">
                        {exp.badgeMetrics.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="inline-flex items-baseline gap-1 text-[#D7E2EA]"
                          >
                            <CountUpNumber
                              target={m.target}
                              decimals={m.decimals ?? 0}
                              suffix={m.suffix}
                              className="font-bold text-sm text-white"
                            />
                            <span className="text-[#D7E2EA]/65 font-light text-xs">
                              {m.label}
                            </span>
                          </span>
                        ))}
                      </div>
                      <span className="text-right text-[#D7E2EA]/75 font-light">
                        {exp.outcomeMetric}
                      </span>
                    </div>
                  </article>
                </SpotlightPanel>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
