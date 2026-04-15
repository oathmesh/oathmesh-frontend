// @file components/landing/features-grid.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  KeyRound,
  Timer,
  RefreshCcwDot,
  Settings2,
  ScrollText,
  Network,
} from 'lucide-react';

const features = [
  {
    icon: KeyRound,
    title: 'Zero Static API Keys',
    description:
      'OathMesh issues cryptographically signed tokens, not API keys. There\'s no long-lived secret to leak, rotate, or revoke — the token expires before you need to think about it.',
  },
  {
    icon: Timer,
    title: 'Short-Lived Tokens',
    description:
      'Every token has a TTL clamped to ≤ 300 seconds, enforceable via policy. Even if a token is intercepted in transit, an attacker has a 5-minute window at most.',
  },
  {
    icon: RefreshCcwDot,
    title: 'Replay Protection',
    description:
      'Each token carries a unique jti claim. The verifier tracks seen jti values in a fast cache (Redis or in-memory). Replaying a valid token gets you an immediate 401.',
  },
  {
    icon: Settings2,
    title: 'Hot-Reload Policy Engine',
    description:
      'Policies are written in Apple Pkl and hot-reloaded without restarting the issuer. Define allow/deny rules by subject prefix, audience, action, time-of-day, or any combination.',
  },
  {
    icon: ScrollText,
    title: 'Full NDJSON Audit Trail',
    description:
      'Every allow and every deny is written to a structured NDJSON log stream in real time. Ship to Datadog, Grafana Loki, or CloudWatch. Zero guesswork during incident response.',
  },
  {
    icon: Network,
    title: 'Gateway Mode',
    description:
      'Run OathMesh as a reverse proxy in front of any HTTP service. It verifies tokens, injects X-OathMesh-* headers, and forwards clean requests — no SDK changes to existing services.',
  },
];

export function FeaturesGrid() {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-surface-0 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">
            Built for zero-trust by default
          </h2>
          <p className="mx-auto max-w-lg text-white/50">
            Every component of OathMesh is designed with the assumption that
            the network is hostile and credentials will eventually leak.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: shouldReduce ? 0 : i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="card-surface card-surface-hover group p-6"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand/18">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
