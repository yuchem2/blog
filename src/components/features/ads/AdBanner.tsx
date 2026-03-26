'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

export function AdBanner({ adSlot, adFormat = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    const el = adRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (isLoaded.current) {
        observer.disconnect();
        return;
      }
      if (entries[0]?.isIntersecting) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        } catch (e) {
          console.error('AdSense error:', e);
        }
        observer.disconnect();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!adSlot || adSlot.startsWith('YOUR_')) return null;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5515855617203843"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
