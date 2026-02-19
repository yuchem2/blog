'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, List } from 'lucide-react';
import clsx from 'clsx';
import { TocItem } from '@/lib/utils';

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false); // 초기값 false로 변경
  const [activeId, setActiveId] = useState<string>('');
  const isClickedRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 화면 크기에 따라 초기 상태 설정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // xl breakpoint
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // 초기 실행
    handleResize();

    // 리사이즈 이벤트 리스너 (선택 사항, 화면 크기 변경 시 반응하게 하려면 추가)
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []);

  const findActiveHeading = useCallback(() => {
    if (isClickedRef.current) return;

    const topOffset = 150;
    let bestCandidateId = '';

    for (const item of toc) {
      const element = document.getElementById(item.id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top <= topOffset) {
        bestCandidateId = item.id;
      } else {
        break;
      }
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      if (toc.length > 0) {
        bestCandidateId = toc[toc.length - 1].id;
      }
    }

    if (bestCandidateId) {
      setActiveId(bestCandidateId);
    } else if (toc.length > 0) {
      setActiveId(toc[0].id);
    }
  }, [toc]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        findActiveHeading();
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    requestAnimationFrame(() => {
      findActiveHeading();
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [findActiveHeading]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        isClickedRef.current = true;
        setActiveId(hash);

        setTimeout(() => {
          isClickedRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    requestAnimationFrame(() => {
      handleHashChange();
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (activeId && isOpen && !isClickedRef.current) {
      const activeLink = document.getElementById(`toc-${activeId}`);
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeId, isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    isClickedRef.current = true;
    setActiveId(id);

    window.history.pushState(null, '', `#${id}`);

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      isClickedRef.current = false;
    }, 1000);
  };

  if (toc.length === 0) return null;

  return (
    <>
      <aside
        className={clsx(
          'fixed top-32 right-4 w-64 transition-all duration-300 z-40',
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none',
        )}
      >
        <div className="p-4 bg-bg-sub border border-border-main rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-text-main uppercase tracking-wider">On This Page</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-bg-main rounded-md transition-colors text-text-sub"
              aria-label="Hide Table of Contents"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <nav className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-3">
            <ul className="space-y-2 text-sm pl-0">
              {toc.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
                  <a
                    id={`toc-${item.id}`}
                    href={`#${item.id}`}
                    className={clsx(
                      'block py-1 transition-colors border-l-2 pl-3',
                      activeId === item.id
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-text-main hover:text-primary hover:border-border-main',
                    )}
                    onClick={(e) => handleClick(e, item.id)}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex fixed top-32 right-4 z-40 p-2 bg-bg-sub border border-border-main rounded-lg shadow-sm hover:bg-bg-main transition-colors items-center gap-2 text-sm text-text-main"
        >
          <List className="w-4 h-4" />
          <span>TOC</span>
        </button>
      )}
    </>
  );
}
