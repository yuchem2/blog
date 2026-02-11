'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from './Button';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <Button variant="ghost" size="icon" disabled={currentPage <= 1} asChild>
        <Link href={createPageURL(currentPage - 1)}>
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

      <Button variant="ghost" size="icon" disabled={currentPage >= totalPages} asChild>
        <Link href={createPageURL(currentPage + 1)}>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
