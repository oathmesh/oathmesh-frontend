import { GitHubEditLink } from '@/components/docs/github-edit-link';
import { ArrowRight } from 'lucide-react';
// @file app/docs/sdks/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SDK Overview',
  description: 'OathMesh official SDKs for Go, Node.js/TypeScript, and Python.',
};

const sdks = [
  {
    lang: 'Go',
    install: 'go get github.com/oathmesh/oathmesh-go',
    frameworks: ['net/http', 'chi', 'gin', 'echo'],
    edgeReady: false,
    href: '/docs/sdks/go',
  },
  {
    lang: 'Node.js / TypeScript',
    install: 'npm install oathmesh',
    frameworks: ['Express', 'Next.js App Router', 'Hono', 'Fastify'],
    edgeReady: true,
    href: '/docs/sdks/nodejs',
  },
  {
    lang: 'Python',
    install: 'pip install oathmesh',
    frameworks: ['FastAPI', 'Flask', 'Django'],
    edgeReady: false,
    href: '/docs/sdks/python',
  },
];

export default function SdksPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="sdks/index.md" />
      <h1>SDK Overview</h1>
      <p>
        OathMesh provides official SDKs for the three most common backend ecosystems. Each SDK
        implements the full 14-step verification pipeline and writes to the NDJSON audit log.
      </p>

      <div className="not-prose mt-6 grid gap-4">
        {sdks.map((sdk) => (
          <Link
            key={sdk.lang}
            href={sdk.href}
            className="card-surface card-surface-hover flex items-start justify-between gap-4 p-5"
          >
            <div className="flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <h3 className="font-semibold text-white">{sdk.lang}</h3>
                {sdk.edgeReady && (
                  <span className="pill border border-emerald-500/25 bg-emerald-500/10 text-[10px] text-emerald-400">
                    Edge Runtime
                  </span>
                )}
              </div>
              <code className="mb-2 block text-xs text-white/40">{sdk.install}</code>
              <p className="text-xs text-white/45">Frameworks: {sdk.frameworks.join(', ')}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-white/40 mt-1" />
          </Link>
        ))}
      </div>

      <h2>Community SDKs</h2>
      <p>
        The following SDKs are maintained by the community and are not officially supported by the
        OathMesh team:
      </p>
      <ul>
        <li>
          <strong>Rust</strong> — <code>oathmesh-rs</code> (planned, see{' '}
          <Link href="/wishlist">wishlist</Link>)
        </li>
        <li>
          <strong>Java/Spring Boot</strong> — <code>oathmesh-spring</code> (planned, see{' '}
          <Link href="/wishlist">wishlist</Link>)
        </li>
      </ul>
    </article>
  );
}
