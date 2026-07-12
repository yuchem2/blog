import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PortfolioViewer } from '@/components/features/portfolio/PortfolioViewer';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio of Jaehyun Yoon (Yunio)',
  // URL을 아는 사람만 접근: 검색엔진 색인 제외
  robots: { index: false, follow: false },
};

export default function PortfolioPage() {
  return (
    <div className="-mx-6 py-6 space-y-3 sm:mx-0">
      <div className="mx-auto flex w-full max-w-[820px] items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Portfolio</h1>
        </div>
        <Button variant="outline" size="icon" asChild className="rounded-full hover:text-primary hover:border-primary transition-colors">
          <a href="/portfolio.pdf" download="Yunio_Portfolio.pdf" aria-label="Download portfolio PDF" title="Download PDF">
            <Download className="w-4 h-4" />
          </a>
        </Button>
      </div>

      <PortfolioViewer />
    </div>
  );
}
