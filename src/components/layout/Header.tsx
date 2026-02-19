'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

import { Navigation } from './Navigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full border-b border-border-main bg-bg-main/80 backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 flex justify-between items-center py-4 md:py-6">
        <Link href="/" className="flex items-center gap-4 group" onClick={closeMenu}>
          <Image src="/logo.png" alt="Yunio's Blog Logo" width={40} height={40} className="transition-transform group-hover:scale-105" priority />
          <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            Yunio&apos;s <span className="text-primary">blog</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Navigation />
          <div className="w-px h-5 bg-border-main" />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border-main bg-bg-main absolute w-full left-0 shadow-lg h-screen">
          <div className="p-4 flex flex-col gap-4">
            <Navigation className="flex-col items-start gap-2" onLinkClick={closeMenu} />
            <div className="border-t border-border-main pt-4 flex justify-between items-center px-4">
              <span className="text-lg font-medium text-text-sub">Theme</span> {/* text-lg로 변경 */}
              <ThemeToggle size="default" /> {/* size="default"로 변경하여 크기 키움 (기본 icon 사이즈보다 큼) */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
