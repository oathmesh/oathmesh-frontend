// @file components/landing/features-grid.tsx
'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { KeyRound, RefreshCcwDot, Timer } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

const features = [
  {
    icon: KeyRound,
    title: 'Zero Static API Keys',
    description:
      "OathMesh issues cryptographically signed tokens, not API keys. There's no long-lived secret to leak, rotate, or revoke — the token expires automatically.",
  },
  {
    icon: Timer,
    title: 'Short-Lived Tokens',
    description:
      'Every token has a TTL clamped to ≤ 300 seconds, enforceable via policy. Even if intercepted, your window of exposure is incredibly small.',
  },
  {
    icon: RefreshCcwDot,
    title: 'Replay Protection',
    description:
      'Each token carries a unique jti claim tracked in a fast cache. Replaying a valid token results in an immediate 401 Unauthorized.',
  },
  // Use public asset for policy engine
  {
    svgIcon: '/window.svg',
    title: 'Hot-Reload Policy Engine',
    description:
      'Policies are written in Apple Pkl and hot-reloaded without restarting the issuer. Define allow/deny rules by subject prefix, audience, and time.',
  },
  // Use public asset for Audit trace
  {
    svgIcon: '/file.svg',
    title: 'Full NDJSON Audit Trail',
    description:
      'Every allow and every deny is written to a structured NDJSON log stream in real time. Perfect for Datadog or Grafana Loki tracing.',
  },
  // Use public asset for Gateway mode
  {
    svgIcon: '/globe.svg',
    title: 'Gateway Mode',
    description:
      'Run OathMesh as a reverse proxy in front of any HTTP service. It verifies tokens, injects headers, and forwards clean requests easily.',
  },
];

export function FeaturesGrid() {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-transparent py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Built for zero-trust by default
            </h2>
            <p className="mx-auto max-w-2xl text-[17px] leading-relaxed text-white/50">
              Every component of OathMesh is designed with the assumption that the network is
              hostile and credentials will eventually leak. Your infrastructure deserves better.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: shouldReduce ? 0 : i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#050505] p-8 shadow-2xl transition-all hover:bg-white/[0.02]"
              >
                {/* Subtle top border for card and inner gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06] group-hover:ring-white/[0.12] transition-all duration-500" />

                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/10">
                    {feature.svgIcon ? (
                      <Image
                        src={feature.svgIcon}
                        alt={feature.title}
                        width={20}
                        height={20}
                        className="opacity-80 group-hover:opacity-100 transition-opacity invert"
                      />
                    ) : (
                      Icon && (
                        <Icon className="h-5 w-5 text-white/80 transition-colors group-hover:text-white" />
                      )
                    )}
                  </div>
                  <h3 className="mb-3 text-[17px] font-medium text-white/90">{feature.title}</h3>
                  <p className="text-[15px] leading-relaxed text-white/40">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
