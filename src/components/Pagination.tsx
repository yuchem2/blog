import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

// Notion API는 cursor 기반이므로, 전통적인 페이지 번호네이션은 어렵습니다.
// "Next" 버튼만 있는 간단한 페이지네이션을 구현합니다.
export function Pagination({ nextCursor, hasMore }: { nextCursor: string | null; hasMore: boolean }) {
  if (!hasMore || !nextCursor) {
    return null;
  }

  return (
    <div className="flex justify-center mt-12">
      <Button asChild>
        <Link href={`/?cursor=${nextCursor}`}>
          Next Page <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
