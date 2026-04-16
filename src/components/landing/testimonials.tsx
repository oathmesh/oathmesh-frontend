// @file components/landing/testimonials.tsx
'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    quote:
      "We had an API key incident last year that cost us a week of incident response. OathMesh's 300-second TTL means a leaked token is worthless by the time an attacker reads it.",
    name: 'Priya Kapoor',
    role: 'Staff Security Engineer',
    company: 'FinLayer',
  },
  {
    quote:
      'The gateway mode let us add OathMesh to three existing internal services in a day — zero SDK changes. The X-OathMesh-Subject header is now the authoritative caller identity across our entire mesh.',
    name: 'Lars Eriksson',
    role: 'Platform Lead',
    company: 'InfraEdge Systems',
  },
  {
    quote:
      'Apple Pkl for policy is a genuinely good call. We write type-safe policy files, push them to the issuer, and they hot-reload in seconds. No restart, no downtime.',
    name: 'Amara Osei',
    role: 'Backend Architect',
    company: 'CloudBridge',
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-transparent py-32 relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-white">
              Trusted by engineering teams
            </h2>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.96, y: shouldReduce ? 0 : 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: shouldReduce ? 0 : i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[#050505] p-8 border border-white/[0.06] hover:bg-white/[0.02] hover:border-white/[0.12] transition-colors duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <blockquote className="mb-8 text-[15px] leading-relaxed text-white/60">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-[13px] font-medium text-white/80">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-[14px] font-medium text-white/90">{t.name}</div>
                  <div className="text-[12px] text-white/40">
                    {t.role} <span className="mx-1 opacity-50">·</span> {t.company}
                  </div>
                </div>
              </figcaption>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
