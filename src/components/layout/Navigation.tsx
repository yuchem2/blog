'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import { Button } from '../ui/Button';

const navLinks = [
  { href: '/', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex items-center gap-4">
      <ul className="flex items-center gap-2">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === href ? 'bg-bg-sub text-text-main' : 'text-text-sub hover:bg-bg-sub hover:text-text-main',
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </nav>
  );
}
