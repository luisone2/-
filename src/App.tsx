/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection, ProjectItem, PROJECTS } from './components/ProjectsSection';
import { FooterSection } from './components/FooterSection';
import {
  ContactModal,
  ProjectModal,
  ResumePdfModal,
  memoryMediaCache,
} from './components/Modals';
import { HRQuickCard, WeChatQrModal } from './components/HRQuickCard';
import { CustomCursor } from './components/CustomCursor';
import {
  loadProjectCoversFromStorage,
  saveProjectCoversToStorage,
  normalizeStoredCoversMap,
  StoredProjectCoversMap,
  loadGalleryFromIndexedDb,
  saveGalleryToIndexedDb,
  PersistedGalleryMediaItem,
} from './utils/mediaStorage';
import {
  ProjectCardCovers,
  ProjectCoverSlot,
  deriveProjectCardCovers,
} from './utils/portfolioMath';

const COVERS_STORAGE_KEY = 'portfolio_custom_project_covers';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isWeChatQrOpen, setIsWeChatQrOpen] = useState(false);
  const [activeProjectNumber, setActiveProjectNumber] = useState<string | null>(null);
  const [customCovers, setCustomCovers] = useState<StoredProjectCoversMap>(() => {
    try {
      const saved =
        localStorage.getItem(COVERS_STORAGE_KEY) ||
        sessionStorage.getItem(COVERS_STORAGE_KEY);
      return saved ? normalizeStoredCoversMap(JSON.parse(saved), PROJECTS) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    let mounted = true;
    loadProjectCoversFromStorage(PROJECTS).then((storedCovers) => {
      if (mounted && Object.keys(storedCovers).length > 0) {
        setCustomCovers(storedCovers);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdateProjectCover = (
    projectNumber: string,
    covers: ProjectCardCovers | null
  ) => {
    setCustomCovers((prev) => {
      const next = { ...prev };
      if (covers) {
        next[projectNumber] = covers;
      } else {
        delete next[projectNumber];
      }
      void saveProjectCoversToStorage(next);
      return next;
    });
  };

  const handleCustomSlotCover = (
    project: ProjectItem,
    slot: ProjectCoverSlot,
    file: File
  ) => {
    const isImageFile =
      file.type.startsWith('image/') ||
      /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i.test(file.name);
    if (!isImageFile) return;

    const baseProject =
      PROJECTS.find((p) => p.number === project.number) || project;
    const storageKey = `project_gallery_state_${project.number}`;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // 1. Immediately update the targeted cover slot on the project card
      setCustomCovers((prev) => {
        const current = prev[project.number] || {
          col1Img1: project.col1Img1,
          col1Img2: project.col1Img2,
          col2Img: project.col2Img,
        };
        const updatedSlotCovers: ProjectCardCovers = {
          ...current,
          [slot]: result,
        };
        const next = {
          ...prev,
          [project.number]: updatedSlotCovers,
        };
        void saveProjectCoversToStorage(next);
        return next;
      });

      // 2. Sync the uploaded slot cover into the project's persisted gallery in IndexedDB & memory cache
      const existingGallery =
        memoryMediaCache.get(storageKey) ||
        (await loadGalleryFromIndexedDb(storageKey, baseProject.col2Img)) || [
          {
            id: '1',
            type: 'image',
            url: baseProject.col1Img1,
            alt: `${baseProject.name} 左上封面图`,
            isCover: false,
            isCustom: false,
            coverSlot: 'col1Img1',
          },
          {
            id: '2',
            type: 'image',
            url: baseProject.col1Img2,
            alt: `${baseProject.name} 左下封面图`,
            isCover: false,
            isCustom: false,
            coverSlot: 'col1Img2',
          },
          {
            id: '3',
            type: 'image',
            url: baseProject.col2Img,
            alt: `${baseProject.name} 右侧主封面图`,
            isCover: true,
            isCustom: false,
            coverSlot: 'col2Img',
          },
        ];

      const defaultSlotId =
        slot === 'col1Img1' ? '1' : slot === 'col1Img2' ? '2' : '3';
      let matched = false;
      const updatedGallery: PersistedGalleryMediaItem[] = existingGallery.map(
        (item) => {
          if (
            !matched &&
            (item.coverSlot === slot || item.id === defaultSlotId)
          ) {
            matched = true;
            return {
              ...item,
              url: item.type === 'image' ? result : item.url,
              coverUrl: result,
              isCover: slot === 'col2Img' ? true : Boolean(item.isCover),
              coverSlot: slot,
              isCustom: true,
              fileBlob: file,
            };
          }
          return {
            ...item,
            isCover: slot === 'col2Img' ? false : item.isCover,
            coverSlot: item.coverSlot === slot ? undefined : item.coverSlot,
          };
        }
      );

      if (!matched) {
        updatedGallery.unshift({
          id: `slot-${slot}-${Date.now()}`,
          type: 'image',
          url: result,
          coverUrl: result,
          alt: `${baseProject.name} 自定义封面`,
          fileName: file.name,
          isCover: slot === 'col2Img',
          coverSlot: slot,
          isCustom: true,
          fileBlob: file,
        });
      }

      memoryMediaCache.set(storageKey, updatedGallery);
      await saveGalleryToIndexedDb(storageKey, updatedGallery);

      const derived = deriveProjectCardCovers(
        updatedGallery,
        {
          col1Img1: baseProject.col1Img1,
          col1Img2: baseProject.col1Img2,
          col2Img: baseProject.col2Img,
        },
        baseProject.name
      );
      handleUpdateProjectCover(project.number, derived);
    };
    reader.readAsDataURL(file);
  };

  const projectsWithCovers: ProjectItem[] = PROJECTS.map((p) => {
    const custom = customCovers[p.number];
    if (!custom) return p;
    return {
      ...p,
      col1Img1: custom.col1Img1 || p.col1Img1,
      col1Img2: custom.col1Img2 || p.col1Img2,
      col2Img: custom.col2Img || p.col2Img,
    };
  });

  const activeProject =
    activeProjectNumber !== null
      ? projectsWithCovers.find((p) => p.number === activeProjectNumber) || null
      : null;

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
        projects={projectsWithCovers}
        onSelectProject={(project) => setActiveProjectNumber(project.number)}
        onCustomSlotCover={handleCustomSlotCover}
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
        onClose={() => setActiveProjectNumber(null)}
        onInquire={() => {
          setActiveProjectNumber(null);
          setIsContactOpen(true);
        }}
        onSelectProjectNumber={setActiveProjectNumber}
        onUpdateProjectCover={handleUpdateProjectCover}
      />
    </main>
  );
}
