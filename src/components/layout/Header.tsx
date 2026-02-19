import Link from 'next/link';
import Image from 'next/image';

import { ThemeToggle } from '../ui/ThemeToggle';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="w-full border-b border-border-main">
      <div className="px-6 flex justify-between items-center py-6">
        <Link href="/" className="flex items-center gap-4 group">
          <Image src="/logo.png" alt="Yunio's Blog Logo" width={40} height={40} className="transition-transform group-hover:scale-105" priority />
          <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            Yunio&apos;s <span className="text-primary">blog</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Navigation />
          <div className="w-px h-5 bg-border-main" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
