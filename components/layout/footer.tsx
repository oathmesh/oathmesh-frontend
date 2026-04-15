// @file components/layout/footer.tsx
import Link from 'next/link';
import { Shield } from 'lucide-react';

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
    <footer className="border-t border-white/6 bg-surface-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Shield className="h-4 w-4 text-brand" />
            <span className="font-medium text-white/80">OathMesh</span>
            <span>— MIT License</span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/50">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="transition-colors hover:text-white/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-white/30">
          Built with ❤️ by the OathMesh team · Open source under the{' '}
          <a
            href="https://github.com/oathmesh/oathmesh/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/50"
          >
            MIT License
          </a>
        </div>
      </div>
    </footer>
  );
}
