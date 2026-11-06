/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection, ProjectItem } from './components/ProjectsSection';
import { FooterSection } from './components/FooterSection';
import { ContactModal, ProjectModal, ResumePdfModal } from './components/Modals';
import { HRQuickCard, WeChatQrModal } from './components/HRQuickCard';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isWeChatQrOpen, setIsWeChatQrOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  return (
    <main
      className="min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA]"
      style={{
        overflowX: 'clip',
        fontFamily:
          "'Kanit', 'PingFang SC', 'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      <CustomCursor />
      <HeroSection
        onOpenContact={() => setIsContactOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />
      <MarqueeSection />
      <AboutSection
        onOpenContact={() => setIsContactOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />
      <ExperienceSection />
      <ServicesSection />
      <ProjectsSection
        onSelectProject={(project) => setActiveProject(project)}
      />
      <FooterSection
        onOpenContact={() => setIsContactOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenWeChatQr={() => setIsWeChatQrOpen(true)}
      />

      <HRQuickCard
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenWeChatQr={() => setIsWeChatQrOpen(true)}
      />

      <WeChatQrModal
        isOpen={isWeChatQrOpen}
        onClose={() => setIsWeChatQrOpen(false)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ResumePdfModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onInquire={() => {
          setActiveProject(null);
          setIsContactOpen(true);
        }}
      />
    </main>
  );
}

