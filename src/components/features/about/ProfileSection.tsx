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
        <div className="space-y-2">
          <p className="text-lg font-semibold text-text-main">반복은 구조로, 모호함은 기준으로 바꿉니다.</p>
          <p className="text-text-main leading-relaxed">
            같은 문제를 매번 새로 풀지 않기 위해, 반복되는 것은 한 번 제대로 풀어 구조로 남깁니다. 매번 새로 풀면 같은 코드가 여기저기 쌓이고, 하나를
            고치려면 전부 열어봐야 합니다. 모호한 요구는 측정할 수 있는 기준으로 바꾼 뒤에야 설계를 시작합니다. &ldquo;빠르게&rdquo;라는 말은 아무것도
            결정해 주지 않습니다. 문제가 막히면 우회하지 않고 내부가 실제로 어떻게 동작하는지 끝까지 파고듭니다. 겉으로 동작하는 코드는 예외 상황에서
            반드시 흔들립니다.
          </p>
        </div>
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
