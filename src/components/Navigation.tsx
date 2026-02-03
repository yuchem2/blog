'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { Button } from '@/components/Button';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
  ];

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
