// @file app/docs/page.tsx
import { GitHubEditLink } from '@/components/docs/github-edit-link';
import { ArrowRight, BookOpen, Code2, Cpu } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

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
    <article className="prose-oathmesh mx-auto max-w-3xl px-6 py-16">
      <GitHubEditLink path="docs/index.md" />

      <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        OathMesh Documentation
      </h1>
      <p className="text-[17px] leading-relaxed text-white/60 mb-12">
        OathMesh is a zero-trust machine identity protocol that replaces static API keys with
        short-lived, Ed25519-signed tokens. If a service needs to call another service — and you
        care about who, what, and when — OathMesh is the answer.
      </p>

      <h2 className="text-2xl font-semibold tracking-tight text-white mt-12 mb-6">
        What problem does OathMesh solve?
      </h2>
      <p className="mb-4 text-[16px] leading-relaxed text-white/70">
        Static API keys are the most common form of machine authentication, and also the most
        dangerous. They never expire, they accumulate in dotfiles, they get committed to git, and
        when they leak the blast radius is unbounded. Traditional JWTs improve on this but leave
        replay protection, policy enforcement, and audit logging as exercises for the reader.
      </p>
      <p className="mb-12 text-[16px] leading-relaxed text-white/70">
        OathMesh is opinionated. Every token has a TTL clamped to ≤ 300 seconds. Every token has a
        unique <code>jti</code> that the verifier tracks. Every allow and deny is logged to a
        structured NDJSON stream. There is no way to issue a long-lived token — the spec does not
        allow it.
      </p>

      <h2 className="text-2xl font-semibold tracking-tight text-white mt-12 mb-6">
        When should you use OathMesh?
      </h2>
      <ul className="mb-12 space-y-3 pl-6 list-disc text-[16px] text-white/70">
        <li>Microservices that call each other over HTTP (internal APIs)</li>
        <li>CI/CD pipelines that deploy to Kubernetes or cloud providers</li>
        <li>IoT devices or edge agents that call central APIs</li>
        <li>Multi-tenant SaaS where customer workloads call your API</li>
      </ul>

      <h2 className="text-2xl font-semibold tracking-tight text-white mt-12 mb-6">
        OathMesh vs API key
      </h2>
      <div className="not-prose my-8 overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#050505] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] relative">
        {/* Subtle top glare */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#080808]">
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-white/40">
                Property
              </th>
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-white/40">
                API Key
              </th>
              <th className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-wider text-white bg-white/[0.03]">
                OathMesh
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {comparisonRows.map(([prop, key, oath]) => (
              <tr key={prop} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-white/80">{prop}</td>
                <td className="px-6 py-4 text-white/50">{key}</td>
                <td className="px-6 py-4 font-medium text-emerald-400 bg-white/[0.01]">{oath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-white mt-16 mb-8">
        Choose your path
      </h2>
      <div className="not-prose mt-6 grid gap-6 md:grid-cols-3">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <Link
              key={path.href}
              href={path.href}
              className="group relative block overflow-hidden rounded-[16px] border border-white/[0.06] bg-[#030303] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 shadow-inner group-hover:bg-white/[0.08] group-hover:border-white/20 transition-all duration-500">
                <Icon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
              </div>
              <h3 className="mb-2 text-[16px] font-medium text-white/90">{path.title}</h3>
              <p className="mb-6 text-[13px] leading-relaxed text-white/50">{path.description}</p>
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-white/60 group-hover:text-white transition-colors">
                {path.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
