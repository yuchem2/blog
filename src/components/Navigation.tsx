'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      <Button variant="ghost" className={pathname.startsWith('/blog') ? 'bg-bg-sub text-text-main' : ''} asChild>
        <Link href="/blog">Blog</Link>
      </Button>
      <Button variant="ghost" className={pathname === '/about' ? 'bg-bg-sub text-text-main' : ''} asChild>
        <Link href="/about">About</Link>
      </Button>
      <Button variant="ghost" className={pathname === '/resume' ? 'bg-bg-sub text-text-main' : ''} asChild>
        <Link href="/resume">Resume</Link>
      </Button>
    </nav>
  );
}
