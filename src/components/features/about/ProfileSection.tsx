'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GithubIcon } from '@/components/icons/GithubIcon';

export function ProfileSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('yuchem2@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-bg-sub shadow-xl flex-shrink-0">
        <Image src="/profile.jpg" alt="Profile" fill className="object-cover" priority />
      </div>
      <div className="space-y-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Yunio (Jaehyun Yoon)</h1>
          <p className="text-xl text-primary font-medium mt-1">Full Stack Developer</p>
        </div>
        <p className="text-text-main leading-relaxed text-lg">
          호기심을 기술로 실체화하며, 필요한 도구를 신속하게 습득하여 결과를 만드는 개발자입니다.
          <br className="hidden md:block" />
          실행 중심의 학습을 통해 낯선 기술도 빠르게 내재화하며, 지식 공유를 통한 동반 성장을 지향합니다.
        </p>
        <div className="flex justify-center md:justify-start gap-3">
          <Button variant="outline" size="icon" asChild className="rounded-full hover:text-primary hover:border-primary transition-colors">
            <a href="https://github.com/yuchem2" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon className="w-5 h-5" />
            </a>
          </Button>

          <div className="relative group">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-primary hover:border-primary transition-colors"
              onClick={handleCopyEmail}
              aria-label="Copy Email"
            >
              {copied ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </Button>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-text-main text-bg-main text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {copied ? 'Copied!' : 'Copy Email'}
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-main" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
