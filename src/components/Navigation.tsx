'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from './Button';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      <Button variant={pathname === '/about' ? 'secondary' : 'ghost'} asChild>
        <Link href="/about">About</Link>
      </Button>
      <Button variant={pathname === '/resume' ? 'secondary' : 'ghost'} asChild>
        <Link href="/resume">Resume</Link>
      </Button>
    </nav>
  );
}
