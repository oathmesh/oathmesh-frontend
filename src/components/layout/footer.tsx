// @file components/layout/footer.tsx
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Docs', href: '/docs' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Donate', href: '/donate' },
  { label: 'GitHub', href: 'https://github.com/oathmesh/oathmesh', external: true },
  { label: 'npm', href: 'https://npmjs.com/package/oathmesh', external: true },
  { label: 'PyPI', href: 'https://pypi.org/project/oathmesh/', external: true },
];

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto mb-8 mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-black/40 backdrop-blur-md shadow-2xl">
        {/* Subtle bottom glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-white/[0.02] blur-[120px]" />

        <div className="relative px-6 py-12 sm:px-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Image
                  src="/logo.png"
                  alt="OathMesh logo"
                  width={18}
                  height={18}
                  className="invert"
                />
              </div>
              <span className="font-semibold tracking-tight text-white/90">OathMesh</span>
            </Link>
            <p className="max-w-xs text-center text-sm leading-relaxed text-white/40 md:text-left">
              Every machine call, a signed identity. Zero-trust architecture open-sourced under the
              MIT License.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/50">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} OathMesh Team. All rights reserved.</p>
          <p>
            Built with dedication · Available on{' '}
            <a
              href="https://github.com/oathmesh/oathmesh/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white hover:underline transition-all"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
