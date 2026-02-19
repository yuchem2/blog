import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-bg-sub p-4 rounded-full mb-6">
        <SearchX className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-text-sub mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다. 입력하신 주소가 정확한지 다시 한번 확인해 주세요.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
