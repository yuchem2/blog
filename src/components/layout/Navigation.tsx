'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '../ui/Button';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
];

interface NavigationProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Navigation({ className, onLinkClick }: NavigationProps) {
  const pathname = usePathname();
  const isMobile = className?.includes('flex-col');

  return (
    <nav className={clsx('flex items-center', className)}>
      <ul className={clsx('flex gap-2', isMobile ? 'flex-col items-start w-full' : 'items-center')}>
        {navLinks.map(({ href, label }) => (
          <li key={href} className={isMobile ? 'w-full' : ''}>
            <Button
              asChild
              variant="ghost"
              className={clsx(
                'justify-start',
                isMobile ? 'w-full py-4 text-lg' : 'text-sm',
                pathname === href ? 'bg-bg-sub text-primary' : 'text-text-main hover:bg-bg-sub hover:text-text-main',
              )}
              onClick={onLinkClick}
            >
              <Link href={href}>{label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
