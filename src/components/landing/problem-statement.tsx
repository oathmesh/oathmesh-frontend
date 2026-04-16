// @file components/landing/problem-statement.tsx
'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';

const columns = [
  {
    label: 'The Old Way',
    icon: AlertTriangle,
    color: 'border-white/10 hover:border-white/20',
    headerBg: 'bg-white/[0.02]',
    labelColor: 'text-white/60',
    dot: 'bg-white/40',
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
      'Keys never expire — leaked = permanent access',
      'No audit trail — who called what?',
      'No scope limits — one key, full access',
    ],
  },
  {
    label: 'The Risk',
    icon: ShieldAlert,
    color:
      'border-red-500/20 hover:border-red-500/40 shadow-[0_0_30px_-10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]',
    headerBg: 'bg-red-500/10',
    labelColor: 'text-red-400',
    dot: 'bg-red-500 animate-pulse',
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
      'Mean time to detect leaks: 197 days',
      '$4.45M average cost per breach',
      'No replay protection — every call is valid',
    ],
  },
  {
    label: 'The OathMesh Way',
    icon: ShieldCheck,
    color:
      'border-emerald-500/30 hover:border-emerald-400/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]',
    headerBg: 'bg-emerald-500/10',
    labelColor: 'text-emerald-400',
    dot: 'bg-emerald-400',
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
      'Token expires in ≤ 300s automatically',
      'Ed25519 signature — unforgeable',
      'Full NDJSON audit: caller, action, result',
    ],
  },
];

export function ProblemStatement() {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-transparent py-32 relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              The problem with API keys
            </h2>
            <p className="mx-auto max-w-2xl text-[17px] leading-relaxed text-white/50">
              Every week, a new company discovers API keys in a public repo or Slack history. The
              blast radius is always the same: unbounded.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {columns.map((col, i) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.label}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: shouldReduce ? 0 : i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl bg-[#030303] border transition-all duration-500 ${col.color}`}
              >
                <div
                  className={`flex items-center gap-3 border-b border-white/[0.04] px-6 py-4 ${col.headerBg}`}
                >
                  <Icon className={`h-4 w-4 ${col.labelColor}`} />
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-widest ${col.labelColor}`}
                  >
                    {col.label}
                  </span>
                  <div className="ml-auto flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] ${col.dot}`}
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-4 text-[16px] font-medium text-white/90">{col.problem}</h3>

                  <div className="code-block mb-6 flex-1 overflow-x-auto p-4 bg-[#010101] border-white/5">
                    <pre className="text-[12px] leading-[1.6] text-white/60">
                      <code>{col.code}</code>
                    </pre>
                  </div>

                  <ul className="space-y-2 mt-auto">
                    {col.issues.map((issue) => (
                      <li
                        key={issue}
                        className="flex items-start gap-2 text-[13px] text-white/50 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
