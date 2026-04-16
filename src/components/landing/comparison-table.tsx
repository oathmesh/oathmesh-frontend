// @file components/landing/comparison-table.tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useRef } from 'react';

const rows = [
  {
    feature: 'Token lifetime',
    apiKey: 'Infinite (manual rotation)',
    jwt: 'Configurable (often hours–days)',
    oathmesh: '≤ 300 seconds (enforced)',
  },
  {
    feature: 'Cryptography',
    apiKey: 'None (bearer secret)',
    jwt: 'HS256 or RS256',
    oathmesh: 'Ed25519 exclusively',
  },
  {
    feature: 'Replay protection',
    apiKey: false,
    jwt: false,
    oathmesh: true,
  },
  {
    feature: 'Policy engine',
    apiKey: false,
    jwt: false,
    oathmesh: true,
  },
  {
    feature: 'Audit logging',
    apiKey: 'Varies',
    jwt: 'Varies',
    oathmesh: 'Built-in NDJSON',
  },
  {
    feature: 'Scoped actions',
    apiKey: false,
    jwt: 'Custom claim only',
    oathmesh: true,
  },
  {
    feature: 'Revocation',
    apiKey: 'Manual (slow)',
    jwt: 'Blocklist (extra infra)',
    oathmesh: 'Expiry by design',
  },
  {
    feature: 'Gateway mode',
    apiKey: false,
    jwt: false,
    oathmesh: true,
  },
  {
    feature: 'SDKs',
    apiKey: 'N/A (HTTP header)',
    jwt: 'Many (varies by impl)',
    oathmesh: 'Go, Node.js, Python',
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <Check
        className="mx-auto h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        aria-label="Yes"
      />
    );
  if (value === false) return <X className="mx-auto h-4 w-4 text-red-400/50" aria-label="No" />;
  return <span className="text-white/60 text-[13px]">{value}</span>;
}

export function ComparisonTable() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-transparent py-32 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-white">
              How OathMesh compares
            </h2>
            <p className="text-[17px] leading-relaxed text-white/50 max-w-xl mx-auto">
              Static keys and vanilla JWTs leave you one incident away from an expensive breach.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[20px] bg-[#050505] border border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,1)]"
        >
          {/* Subtle top border gradient */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" role="table">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-wider text-white/40 bg-[#080808] border-b border-white/[0.06]">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-wider text-white/40 bg-[#080808] border-b border-white/[0.06] text-center">
                    API Keys
                  </th>
                  <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-wider text-white/40 bg-[#080808] border-b border-white/[0.06] text-center">
                    Traditional JWT
                  </th>
                  <th className="px-6 py-4 text-[12px] font-medium uppercase tracking-wider text-white bg-white/[0.04] text-center border-b border-x border-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
                    OathMesh
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {rows.map((row) => (
                  <tr key={row.feature} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-white/80 whitespace-nowrap">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell value={row.apiKey} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell value={row.jwt} />
                    </td>
                    <td className="bg-white/[0.02] border-x border-white/[0.06] px-6 py-4 text-center">
                      <Cell value={row.oathmesh} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
