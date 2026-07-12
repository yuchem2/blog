'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask } from 'pdfjs-dist';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PDF_URL = '/portfolio.pdf';

// PDF 좌표를 뷰포트 좌표로 변환 (아핀 행렬 [a,b,c,d,e,f] 적용)
function applyTransform(x: number, y: number, t: number[]): [number, number] {
  return [t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5]];
}

export function PortfolioViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [numPages, setNumPages] = useState(0);
  const [loadedPages, setLoadedPages] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    const container = containerRef.current;

    async function render() {
      if (!container) return;

      const pdfjs = await import('pdfjs-dist');
      // 설치된 패키지에서 워커를 직접 참조 (버전 불일치 방지)
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

      loadingTask = pdfjs.getDocument({ url: PDF_URL });
      const pdfDoc = await loadingTask.promise;
      if (cancelled) return;
      setNumPages(pdfDoc.numPages);

      container.replaceChildren();

      const displayWidth = container.clientWidth || 800;
      // 최소 2배 슈퍼샘플링으로 A4 텍스트를 또렷하게 렌더링 (dpr=1 화면에서도 선명)
      const outputScale = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
      // 14페이지 canvas 메모리 폭주 방지용 백킹 해상도 상한
      const MAX_BACKING_WIDTH = 1700;

      // 페이지 래퍼 목록 (내부 링크로 페이지 이동할 때 사용)
      const pageWrappers: HTMLDivElement[] = [];

      for (let n = 1; n <= pdfDoc.numPages; n++) {
        const page = await pdfDoc.getPage(n);
        if (cancelled) return;

        const base = page.getViewport({ scale: 1 });
        const cssScale = displayWidth / base.width;
        let renderScale = cssScale * outputScale;
        if (base.width * renderScale > MAX_BACKING_WIDTH) {
          renderScale = MAX_BACKING_WIDTH / base.width;
        }
        const viewport = page.getViewport({ scale: renderScale });

        const wrapper = document.createElement('div');
        wrapper.className = 'relative w-full';

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.className = 'block w-full rounded-lg bg-white shadow-md';
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        wrapper.appendChild(canvas);
        container.appendChild(wrapper);
        pageWrappers.push(wrapper);

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        if (cancelled) return;

        // 링크 어노테이션을 클릭 가능한 오버레이로 렌더링
        const annotations = await page.getAnnotations();
        if (cancelled) return;
        const links = annotations.filter((a) => a.subtype === 'Link' && (a.url || a.dest));
        if (links.length > 0) {
          const overlay = document.createElement('div');
          overlay.className = 'absolute inset-0';
          for (const ann of links) {
            const [x1, y1, x2, y2] = ann.rect as [number, number, number, number];
            const [px1, py1] = applyTransform(x1, y1, base.transform);
            const [px2, py2] = applyTransform(x2, y2, base.transform);
            const left = Math.min(px1, px2);
            const top = Math.min(py1, py2);
            const width = Math.abs(px2 - px1);
            const height = Math.abs(py2 - py1);

            const link = document.createElement('a');
            link.className = 'absolute rounded-sm transition-colors hover:bg-primary/10 cursor-pointer';
            link.style.left = `${(left / base.width) * 100}%`;
            link.style.top = `${(top / base.height) * 100}%`;
            link.style.width = `${(width / base.width) * 100}%`;
            link.style.height = `${(height / base.height) * 100}%`;

            if (ann.url) {
              link.href = ann.url;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
            } else {
              // PDF 내부 목적지로 스크롤 이동
              link.href = '#';
              const dest = ann.dest;
              link.addEventListener('click', async (ev) => {
                ev.preventDefault();
                try {
                  const resolved = typeof dest === 'string' ? await pdfDoc.getDestination(dest) : dest;
                  if (!resolved) return;
                  const pageIndex = await pdfDoc.getPageIndex(resolved[0]);
                  pageWrappers[pageIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch {
                  // 목적지 해석 실패 시 무시
                }
              });
            }
            overlay.appendChild(link);
          }
          wrapper.appendChild(overlay);
        }

        setLoadedPages(n);
      }

      if (!cancelled) setStatus('ready');
    }

    render().catch((err) => {
      if (cancelled) return;
      console.error('[PortfolioViewer] failed to render PDF', err);
      setStatus('error');
    });

    return () => {
      cancelled = true;
      container?.replaceChildren();
      loadingTask?.destroy();
    };
  }, []);

  return (
    <div className="space-y-4">
      {status === 'loading' && (
        <div className="flex items-center justify-center gap-3 py-16 text-text-sub">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>포트폴리오 불러오는 중{numPages > 0 ? ` (${loadedPages}/${numPages})` : ''}…</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-text-sub">포트폴리오를 표시하지 못했습니다.</p>
          <Button asChild className="rounded-full">
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              PDF 열기
            </a>
          </Button>
        </div>
      )}

      <div ref={containerRef} className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5" />
    </div>
  );
}
