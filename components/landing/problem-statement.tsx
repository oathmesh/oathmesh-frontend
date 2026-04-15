// @file components/landing/problem-statement.tsx
'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const columns = [
  {
    label: 'The Old Way',
    color: 'border-red-500/30 bg-red-500/5',
    labelColor: 'text-red-400',
    dot: 'bg-red-500',
    problem: 'Static API keys with no expiry',
    code: `// billing-service/client.ts
const apiKey = process.env.PAYMENTS_KEY;
// Created 2 years ago. Never rotated.
// Stored in 4 different .env files.
// Zero idea who has a copy.

await fetch('https://api.payments.internal', {
  headers: { 'X-API-Key': apiKey }
});`,
    issues: [
      '⚠️ Keys never expire — leaked = permanent access',
      '⚠️ No audit trail — who called what?',
      '⚠️ No scope limits — one key, full access',
    ],
  },
  {
    label: 'The Risk',
    color: 'border-amber-500/30 bg-amber-500/5',
    labelColor: 'text-amber-400',
    dot: 'bg-amber-500',
    problem: 'Leaked key → infinite blast radius',
    code: `// Attacker's script, running since Jan 2023
// Your logs show nothing unusual.

while (true) {
  const data = await exfiltrate(
    'https://api.payments.internal/all',
    { 'X-API-Key': LEAKED_KEY }
  );
  await sendToDropbox(data);
}`,
    issues: [
      '🔴 Mean time to detect credential leaks: 197 days',
      '🔴 $4.45M average cost per breach (IBM, 2024)',
      '🔴 No replay protection — every call is valid',
    ],
  },
  {
    label: 'The OathMesh Way',
    color: 'border-emerald-500/30 bg-emerald-500/5',
    labelColor: 'text-emerald-400',
    dot: 'bg-emerald-500',
    problem: 'Short-lived, scoped, audited tokens',
    code: `// payments-svc authenticates every request
import { verifyOathMesh } from 'oathmesh/express';

app.use('/invoices', verifyOathMesh({
  audience: 'billing-api',
  actions: ['read'],  // Only read — nothing else
}));

// Token expires in ≤ 300 seconds.
// jti prevents exact replay.
// Every allow/deny written to audit log.`,
    issues: [
      '✅ Token expires in ≤ 300s automatically',
      '✅ Ed25519 signature — unforgeable without key',
      '✅ Full NDJSON audit: caller, action, result',
    ],
  },
];

export function ProblemStatement() {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-surface-0 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">
            The problem with API keys
          </h2>
          <p className="mx-auto max-w-xl text-white/50">
            Every week, a new company discovers API keys in a public repo or
            Slack history. The blast radius is always the same: unbounded.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((col, i) => (
            <motion.div
              key={col.label}
              initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: shouldReduce ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-xl border p-5 ${col.color}`}
            >
              <div className="mb-4 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <span className={`text-xs font-semibold uppercase tracking-wider ${col.labelColor}`}>
                  {col.label}
                </span>
              </div>

              <p className="mb-4 text-sm font-medium text-white/80">{col.problem}</p>

              <pre className="code-block mb-5 overflow-x-auto p-4 text-[11px] leading-relaxed text-white/65">
                <code>{col.code}</code>
              </pre>

              <ul className="space-y-1.5">
                {col.issues.map((issue) => (
                  <li key={issue} className="text-xs text-white/55">
                    {issue}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
