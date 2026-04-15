// @file components/landing/cta-section.tsx
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="bg-surface-0 py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div
          className="rounded-2xl border border-brand/20 p-12"
          style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.07) 0%, rgba(0,68,204,0.04) 100%)' }}
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Start securing your service mesh today
          </h2>
          <p className="mb-8 text-white/50">
            OathMesh is open source, MIT licensed, and takes less than 10
            minutes to add to an existing service. No vendor lock-in.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/docs/quickstart"
              id="cta-quickstart"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Get started in 5 minutes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/donate"
              id="cta-donate"
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-6 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/22 hover:text-white"
            >
              <Heart className="h-4 w-4 text-red-400" />
              Support the project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
