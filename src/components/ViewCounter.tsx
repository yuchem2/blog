'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  increment?: boolean;
  showIcon?: boolean;
}

export function ViewCounter({ slug, increment = false, showIcon = true }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        // 조회수만 가져오기
        const res = await fetch(`/api/view?slug=${slug}`);
        const data = await res.json();
        setViews(data.views);
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    };

    const incrementView = async () => {
      try {
        // localStorage를 사용하여 이미 조회했는지 확인
        const viewedKey = `viewed-post-${slug}`;
        const hasViewed = localStorage.getItem(viewedKey);

        if (!hasViewed) {
          // 조회수 증가 API 호출
          const res = await fetch('/api/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug }),
          });
          const data = await res.json();
          setViews(data.views);

          // 조회 기록 저장
          localStorage.setItem(viewedKey, 'true');
        } else {
          // 이미 조회했다면 조회수만 가져옴
          fetchViews();
        }
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    if (increment) {
      incrementView();
    } else {
      fetchViews();
    }
  }, [slug, increment]);

  if (views === null) {
    return <span className="animate-pulse bg-bg-sub w-8 h-4 rounded inline-block align-middle" />;
  }

  return (
    <span className="flex items-center gap-1 text-sm text-text-sub tabular-nums">
      {showIcon && <Eye className="w-4 h-4" />}
      {views.toLocaleString()}
    </span>
  );
}
