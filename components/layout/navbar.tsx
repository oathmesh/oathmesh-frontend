// @file components/layout/navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

async function getGitHubStars(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/oathmesh/oathmesh',
      {
        next: { revalidate: 3600 }, // ISR: revalidate every hour
        headers: { Accept: 'application/vnd.github.v3+json' },
      },
    );
    if (!res.ok) return null;
    const data = await res.json() as { stargazers_count?: number };
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export async function Navbar() {
  const stars = await getGitHubStars();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/6 bg-surface-0/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-white"
          aria-label="OathMesh home"
        >
          <Image
            src="/logo.png"
            alt="OathMesh logo"
            width={28}
            height={28}
            className="invert"
            priority
          />
          <span>OathMesh</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link
            href="/docs"
            className="transition-colors hover:text-white"
          >
            Docs
          </Link>
          <Link
            href="/wishlist"
            className="transition-colors hover:text-white"
          >
            Wishlist
          </Link>
          <Link
            href="/donate"
            className="transition-colors hover:text-white"
          >
            Donate
          </Link>
        </div>

        {/* GitHub CTA */}
        <Link
          href="https://github.com/oathmesh/oathmesh"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:text-white"
          aria-label="View OathMesh on GitHub"
        >
          <GithubIcon className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
          {stars !== null && (
            <span className="flex items-center gap-1 font-mono text-xs text-white/50">
              <Star className="h-3 w-3" />
              {stars.toLocaleString()}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
