// @file app/layout.tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { LiveBackground } from '@/components/layout/live-background';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://oathmesh.dev'),
  title: {
    default: 'OathMesh — Every machine call, a signed identity.',
    template: '%s | OathMesh',
  },
  description:
    'OathMesh is an open-source zero-trust authentication protocol. Replace static API keys with short-lived Ed25519-signed tokens, replay protection, and a policy engine.',
  keywords: [
    'machine identity',
    'zero trust',
    'api authentication',
    'Ed25519',
    'short-lived tokens',
    'open source security',
  ],
  authors: [{ name: 'OathMesh Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'OathMesh',
    title: 'OathMesh — Every machine call, a signed identity.',
    description:
      'Replace static API keys with cryptographically signed tokens. 14-step verification, ≤300s TTL, Ed25519 only.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OathMesh — Every machine call, a signed identity.',
    description: 'Replace static API keys with cryptographically signed tokens.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="bg-transparent text-white antialiased relative">
        <LiveBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
