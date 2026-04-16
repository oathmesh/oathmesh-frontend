// @file components/landing/cta-section.tsx
import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-transparent py-32">
      {/* Background glow lines */}
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#030303] p-12 sm:p-20 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)]">
          {/* Subtle inside gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-50" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.02] rounded-[24px]" />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="mb-6 max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              Start securing your service mesh today
            </h2>
            <p className="mb-10 max-w-xl text-[17px] leading-relaxed text-white/50">
              OathMesh is open source, MIT licensed, and takes less than 10 minutes to add to an
              existing service. Zero vendor lock-in.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center w-full">
              <Link
                href="/docs"
                id="cta-quickstart"
                className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-white px-8 text-[15px] font-medium text-black transition-all hover:bg-white/90"
              >
                Get started in 5 minutes
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/donate"
                id="cta-donate"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-8 text-[15px] font-medium text-white/80 transition-all hover:bg-white/[0.06] hover:text-white"
              >
                <Heart className="h-4 w-4 text-red-400" />
                Support the project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
