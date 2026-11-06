import React, { useState, useEffect, useRef } from 'react';

export interface NavItem {
  label: string;
  enLabel?: string;
  href: string;
}

export interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  activeHref?: string;
  itemStyle?: 'pill' | 'default' | 'underline';
  hoverEffect?: 'fill' | 'glow' | 'lift';
  indicator?: 'dot' | 'line' | 'pill' | 'none';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onItemClick?: (item: NavItem, e: React.MouseEvent) => void;
  onOpenResume?: () => void;
}

export const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Company',
  items,
  activeHref = '/',
  itemStyle = 'pill',
  hoverEffect = 'fill',
  indicator = 'dot',
  size = 'lg',
  className = '',
  onItemClick,
  onOpenResume,
}) => {
  const [currentActive, setCurrentActive] = useState<string>(activeHref);
  const manualClickLockRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(0);

  // Sync active button state when scrolling back to main page (#hero) or across sections
  useEffect(() => {
    const resolveHrefForSection = (sectionId: string): string | null => {
      if (sectionId === 'hero') {
        const homeItem = items.find((i) => i.href === '/' || i.href === '#hero');
        return homeItem ? homeItem.href : '/';
      }
      if (sectionId === 'about' || sectionId === 'experience') {
        const aboutItem = items.find((i) => i.href === '/about' || i.href === '#about');
        return aboutItem ? aboutItem.href : null;
      }
      if (sectionId === 'skills') {
        const skillItem = items.find(
          (i) => i.href === '/journal' || i.href === '/skills' || i.href === '#skills'
        );
        return skillItem ? skillItem.href : null;
      }
      if (sectionId === 'projects') {
        const projectItem = items.find(
          (i) => i.href === '/photos' || i.href === '/projects' || i.href === '#projects'
        );
        return projectItem ? projectItem.href : null;
      }
      return null;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight || 800;
      const isScrollingUp = scrollY < lastScrollYRef.current - 2;
      lastScrollYRef.current = scrollY;

      // If user starts scrolling upward, release any programmatic click lock immediately
      if (isScrollingUp && manualClickLockRef.current !== null) {
        window.clearTimeout(manualClickLockRef.current);
        manualClickLockRef.current = null;
      }

      // Skip intermediate section updates while smooth-scrolling down from a navbar click
      if (manualClickLockRef.current !== null) {
        return;
      }

      // Whenever the user returns to the main Hero screen, always activate Home ('/')
      if (scrollY < vh * 0.45) {
        const homeHref = resolveHrefForSection('hero');
        if (homeHref) {
          setCurrentActive(homeHref);
        }
        return;
      }

      const sectionIds = ['projects', 'skills', 'about', 'hero'];
      const probeY = scrollY + vh * 0.35;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (probeY >= top && probeY < top + height) {
            const matchedHref = resolveHrefForSection(id);
            if (matchedHref) {
              setCurrentActive(matchedHref);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (manualClickLockRef.current !== null) {
        window.clearTimeout(manualClickLockRef.current);
      }
    };
  }, [items]);

  const handleLinkClick = (item: NavItem, e: React.MouseEvent<HTMLAnchorElement>) => {
    setCurrentActive(item.href);
    lastScrollYRef.current = window.scrollY;

    if (manualClickLockRef.current !== null) {
      window.clearTimeout(manualClickLockRef.current);
    }
    manualClickLockRef.current = window.setTimeout(() => {
      manualClickLockRef.current = null;
    }, 1000);

    if (onItemClick) {
      onItemClick(item, e);
      return;
    }

    // Smooth scroll integration for in-page sections
    if (item.href === '/' || item.href === '#hero') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.href === '/about' || item.href === '#about') {
      e.preventDefault();
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.href === '/experience' || item.href === '#experience') {
      e.preventDefault();
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.href === '/photos' || item.href === '/projects' || item.href === '#projects') {
      e.preventDefault();
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.href === '/journal' || item.href === '/skills' || item.href === '#skills') {
      e.preventDefault();
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Size styling variants
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm md:text-base px-5 py-2.5 gap-2.5',
  }[size] || 'text-base px-5 py-2.5';

  return (
    <nav
      className={`w-full flex items-center justify-between px-6 lg:px-[60px] pt-6 md:pt-8 relative z-30 select-none ${className}`}
      aria-label="主要导航"
    >
      {/* Left Frosted Glass Badge: 李翰林 Li Hanlin (Clean Static Border, No Animation) */}
      <div className="flex items-center">
        <a
          href="/"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setCurrentActive('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="李翰林 Li Hanlin"
          style={{
            width: '148px',
            height: '42px',
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(24px) saturate(185%)',
            WebkitBackdropFilter: 'blur(24px) saturate(185%)',
            boxShadow:
              'inset 0 1px 1.5px rgba(255, 255, 255, 0.6), 0 12px 32px -4px rgba(0, 0, 0, 0.4)',
          }}
          className="w-[148px] h-[42px] px-3 rounded-full border border-white/40 hover:border-white/60 inline-flex items-center justify-center text-white hover:text-white cursor-pointer transition-all duration-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.65)] whitespace-nowrap select-none"
        >
          <span className="whitespace-nowrap leading-none flex items-center justify-center">
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
        </a>
      </div>

      {/* Pill Navigation Container — Unified Light Frosted Apple Glass Background */}
      <div
        style={{
          backgroundColor: 'rgba(240, 242, 246, 0.88)',
          backdropFilter: 'blur(30px) saturate(190%)',
          WebkitBackdropFilter: 'blur(30px) saturate(190%)',
          boxShadow:
            'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1px 0 rgba(255, 255, 255, 0.4), 0 12px 32px -4px rgba(0, 0, 0, 0.45)',
        }}
        className={`relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 inline-flex items-center p-1.5 border border-white/60 transition-all duration-300 ${
          itemStyle === 'pill' ? 'rounded-full' : 'rounded-2xl'
        }`}
      >
        {/* Top Specular Glass Rim Reflection */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
        />

        {items.map((item) => {
          const isActive = currentActive === item.href;

          // Hover effect styling
          const hoverClass =
            hoverEffect === 'fill'
              ? 'hover:bg-black/[0.05] hover:text-[#0C0C0C]'
              : hoverEffect === 'glow'
              ? 'hover:shadow-[0_0_12px_rgba(0,0,0,0.12)] hover:text-[#0C0C0C]'
              : 'hover:-translate-y-0.5 hover:text-[#0C0C0C]';

          // Active pill styling (Clicked: black text on white lens, Unclicked: gray text)
          const activeClass = isActive
            ? 'bg-white text-[#0C0C0C] font-semibold border border-white shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)]'
            : 'border border-transparent text-[#646A73] hover:text-[#0C0C0C] font-medium';

          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(item, e)}
              className={`group relative inline-flex items-center justify-center transition-all duration-200 rounded-full ${sizeStyles} ${hoverClass} ${activeClass}`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={
                    isActive
                      ? 'font-bold text-[#0C0C0C] tracking-wide'
                      : 'font-medium text-[#646A73] group-hover:text-[#0C0C0C] tracking-wide transition-colors'
                  }
                >
                  {item.label}
                </span>
                {item.enLabel && (
                  <span
                    className={`text-[10px] md:text-xs uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'text-[#0C0C0C] font-semibold'
                        : 'text-[#858C96] group-hover:text-[#0C0C0C] font-medium'
                    }`}
                  >
                    {item.enLabel}
                  </span>
                )}
              </span>

              {/* Indicator Line */}
              {indicator === 'line' && isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#0C0C0C]"
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Right Action: View Resume (Unified & Symmetrical with Left Badge, Clean Static Border, No Animation) */}
      <div className="hidden sm:flex items-center">
        <a
          href="#resume"
          role="button"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (onOpenResume) {
              onOpenResume();
            }
          }}
          style={{
            width: '148px',
            height: '42px',
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(24px) saturate(185%)',
            WebkitBackdropFilter: 'blur(24px) saturate(185%)',
            boxShadow:
              'inset 0 1px 1.5px rgba(255, 255, 255, 0.6), 0 12px 32px -4px rgba(0, 0, 0, 0.4)',
            fontWeight: 600,
            color: '#FFFFFF',
            fontSize: '15px',
          }}
          className="w-[148px] h-[42px] px-4 rounded-full border border-white/40 hover:border-white/60 inline-flex items-center justify-center tracking-wider text-white hover:text-white cursor-pointer transition-all duration-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.65)] whitespace-nowrap select-none"
        >
          查看简历
        </a>
      </div>
    </nav>
  );
};

export default PillNav;
