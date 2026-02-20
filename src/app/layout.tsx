import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@next/third-parties/google';

import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { NEXT_PUBLIC_GA_ID } from '@/lib/env';
import './globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '400 700 800',
  variable: '--font-system',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yunio.dev'),
  title: {
    template: '%s | yunio.dev',
    default: "yunio's blog",
  },
  description: 'A blog about development, life, and thoughts.',
  openGraph: {
    title: "yunio's blog",
    description: 'A blog about development, life, and thoughts.',
    url: 'https://yunio.dev',
    siteName: "yunio's blog",
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "yunio's blog",
    description: 'A blog about development, life, and thoughts.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
      { url: '/apple-icon-precomposed.png', rel: 'apple-touch-icon-precomposed' },
    ],
    other: [
      { url: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
      { url: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/ms-icon-70x70.png', sizes: '70x70', type: 'image/png' },
      { url: '/ms-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/ms-icon-150x150.png', sizes: '150x150', type: 'image/png' },
      { url: '/ms-icon-310x310.png', sizes: '310x310', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <ScrollToTop />
          <div className="sticky top-0 z-50 bg-bg-main">
            <Header />
          </div>
          <main className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-8 pt-8 pb-16 flex-grow">{children}</main>
          <Footer />
        </Providers>
        {NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
