// @file components/layout/navbar.tsx
import { GithubIcon } from '@/components/ui/icons';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function getGitHubStars(): Promise<number | null> {
  try {
    const res = await fetch('https://api.github.com/repos/oathmesh/oathmesh', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export async function Navbar() {
  const stars = await getGitHubStars();

  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <nav
        className="pointer-events-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 shadow-[0_0_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold text-white/90 transition-colors hover:text-white"
          aria-label="OathMesh home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-colors group-hover:border-white/20">
            <Image
              src="/logo.png"
              alt="OathMesh logo"
              width={16}
              height={16}
              className="invert"
              priority
            />
          </div>
          <span className="tracking-tight text-sm">OathMesh</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/docs"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white/90"
          >
            Docs
          </Link>
          <Link
            href="/wishlist"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white/90"
          >
            Wishlist
          </Link>
          <Link
            href="/donate"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white/90"
          >
            Donate
          </Link>
        </div>

        {/* Action / GitHub CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="hidden items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:flex"
          >
            Start Building
          </Link>
          <Link
            href="https://github.com/oathmesh/oathmesh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            aria-label="View OathMesh on GitHub"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
            {stars !== null && (
              <span className="ml-1 flex items-center gap-1 font-mono text-[11px] text-white/40">
                <Star className="h-3 w-3" />
                {stars.toLocaleString()}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
