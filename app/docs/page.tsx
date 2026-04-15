// @file app/docs/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Cpu, Code2 } from 'lucide-react';
import { GitHubEditLink } from '@/components/docs/github-edit-link';

export const metadata: Metadata = {
  title: 'Documentation Overview',
  description:
    'OathMesh documentation — understand the protocol, integrate SDKs, and secure your service mesh.',
};

const paths = [
  {
    icon: BookOpen,
    title: 'Quick Start',
    description:
      'Install the CLI, generate a key pair, mint your first token, and add the Express middleware — in under 10 minutes.',
    href: '/docs/quickstart',
    cta: 'Start here',
  },
  {
    icon: Cpu,
    title: 'Protocol Deep Dive',
    description:
      'Understand the Caller → Issuer → Token → Receiver flow, the 14-step verification pipeline, and the Pkl policy engine.',
    href: '/docs/how-it-works',
    cta: 'Read the protocol',
  },
  {
    icon: Code2,
    title: 'SDK Reference',
    description:
      'Drop-in middleware for Go (chi), Node.js (Express + Next.js App Router), and Python (FastAPI, Flask, Django).',
    href: '/docs/sdks',
    cta: 'Browse SDKs',
  },
];

const comparisonRows = [
  ['Mechanism', 'Shared secret (bearer)', 'OathMesh token'],
  ['Expiry', 'Never (manual rotation)', '≤ 300 seconds'],
  ['Cryptography', 'None', 'Ed25519'],
  ['Replay protection', 'None', 'Built-in (jti)'],
  ['Policy engine', 'None', 'Apple Pkl (hot-reload)'],
  ['Audit trail', 'Depends on service', 'NDJSON (every request)'],
];

export default function DocsPage() {
  return (
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-10">
      <GitHubEditLink path="docs/index.md" />

      <h1>OathMesh Documentation</h1>
      <p className="text-lg text-white/55">
        OathMesh is a zero-trust machine identity protocol that replaces static
        API keys with short-lived, Ed25519-signed tokens. If a service needs to
        call another service — and you care about who, what, and when — OathMesh
        is the answer.
      </p>

      <h2>What problem does OathMesh solve?</h2>
      <p>
        Static API keys are the most common form of machine authentication, and
        also the most dangerous. They never expire, they accumulate in
        dotfiles, they get committed to git, and when they leak the blast radius
        is unbounded. Traditional JWTs improve on this but leave replay
        protection, policy enforcement, and audit logging as exercises for the
        reader.
      </p>
      <p>
        OathMesh is opinionated. Every token has a TTL clamped to ≤ 300
        seconds. Every token has a unique <code>jti</code> that the verifier
        tracks. Every allow and deny is logged to a structured NDJSON stream.
        There is no way to issue a long-lived token — the spec does not allow it.
      </p>

      <h2>When should you use OathMesh?</h2>
      <ul>
        <li>Microservices that call each other over HTTP (internal APIs)</li>
        <li>CI/CD pipelines that deploy to Kubernetes or cloud providers</li>
        <li>IoT devices or edge agents that call central APIs</li>
        <li>Multi-tenant SaaS where customer workloads call your API</li>
      </ul>

      <h2>OathMesh vs API key</h2>
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/35">
                Property
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/35">
                API Key
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand/80">
                OathMesh
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {comparisonRows.map(([prop, key, oath]) => (
              <tr key={prop}>
                <td className="px-4 py-2.5 font-medium text-white/70">{prop}</td>
                <td className="px-4 py-2.5 text-white/45">{key}</td>
                <td className="px-4 py-2.5 text-emerald-400/80">{oath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Choose your path</h2>
      <div className="not-prose mt-5 grid gap-4 md:grid-cols-3">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <Link
              key={path.href}
              href={path.href}
              className="card-surface card-surface-hover block p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">
                {path.title}
              </h3>
              <p className="mb-3 text-xs leading-relaxed text-white/45">
                {path.description}
              </p>
              <span className="flex items-center gap-1 text-xs font-medium text-brand-light">
                {path.cta}
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
