'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { Button } from '../ui/Button';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant="ghost"
            className={clsx({
              'bg-primary/10 text-primary dark:bg-primary/20': isActive,
            })}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
