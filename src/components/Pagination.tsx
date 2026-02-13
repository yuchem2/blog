'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

import { Button } from './Button';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    // 페이지 번호가 1보다 작으면 1로, totalPages보다 크면 totalPages로 제한
    const targetPage = Math.max(1, Math.min(Number(pageNumber), totalPages));
    params.set('page', targetPage.toString());
    return `/?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <Button
        variant="ghost"
        size="icon"
        disabled={currentPage <= 1}
        asChild
        className={clsx(currentPage <= 1 && 'pointer-events-none opacity-50')} // 클릭 방지 및 스타일 처리
      >
        <Link href={currentPage <= 1 ? '#' : createPageURL(currentPage - 1)} aria-disabled={currentPage <= 1}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </Button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button key={page} variant={currentPage === page ? 'default' : 'ghost'} size="icon" asChild>
            <Link href={createPageURL(page)}>{page}</Link>
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild
        className={clsx(currentPage >= totalPages && 'pointer-events-none opacity-50')} // 클릭 방지 및 스타일 처리
      >
        <Link href={currentPage >= totalPages ? '#' : createPageURL(currentPage + 1)} aria-disabled={currentPage >= totalPages}>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
