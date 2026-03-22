'use client';

import { AdBanner } from './AdBanner';

export function AdLayout() {
  return (
    <>
      {/* 데스크탑: 좌측 사이드 광고 — 화면 좌측 끝 */}
      <div className="ad-side fixed top-1/2 -translate-y-1/2 z-10 w-[160px] left-4">
        <AdBanner adSlot="YOUR_LEFT_SLOT" adFormat="vertical" className="min-h-[600px]" />
      </div>

      {/* 데스크탑: 우측 사이드 광고 — 화면 우측 끝 */}
      <div className="ad-side fixed top-1/2 -translate-y-1/2 z-10 w-[160px] right-4">
        <AdBanner adSlot="YOUR_RIGHT_SLOT" adFormat="vertical" className="min-h-[600px]" />
      </div>

      {/* 하단 배너 — Footer 아래 일반 흐름 */}
      <div className="ad-bottom w-full">
        <AdBanner adSlot="YOUR_BOTTOM_SLOT" adFormat="horizontal" className="min-h-[90px]" />
      </div>
    </>
  );
}