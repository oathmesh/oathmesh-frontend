// @file components/landing/how-it-works.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Key, Send, ShieldCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Key,
    title: 'Mint',
    summary: 'The calling service requests a short-lived token from the OathMesh issuer.',
    detail:
      'The issuer validates the caller\'s identity (via mTLS, OIDC, or a bootstrap secret), applies the active Pkl policy to determine permitted audience/actions, and signs a token with Ed25519. The token\'s TTL is clamped to ≤ 300 seconds — no exceptions.',
    code: `# Using the OathMesh CLI
$ oathmesh mint \\
    --sub payments-svc \\
    --aud billing-api \\
    --act read,list

# Or via SDK (Go)
token, err := issuer.Mint(ctx, oathmesh.MintParams{
    Subject:  "payments-svc",
    Audience: "billing-api",
    Actions:  []string{"read", "list"},
})`,
  },
  {
    number: '02',
    icon: Send,
    title: 'Present',
    summary: 'The caller attaches the token to the outgoing HTTP request.',
    detail:
      'The token is transmitted in the standard Authorization header as a Bearer token. Because it expires in seconds, intercepting it mid-transit gives an attacker at most a 300-second window — far less than the hours or days needed to exploit it.',
    code: `// Node.js SDK
import { mintToken } from 'oathmesh';

const token = await mintToken({
  subject: 'payments-svc',
  audience: 'billing-api',
  actions: ['read'],
});

// Attach to outgoing request
const res = await fetch('https://billing.internal/invoices', {
  headers: { Authorization: \`Bearer \${token}\` },
});`,
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Verify',
    summary: 'The receiving service runs OathMesh\'s 14-step verification pipeline.',
    detail:
      'The receiver fetches the JWKS from the issuer (cached), verifies the Ed25519 signature, checks expiry + clock skew (±10s), validates the jti against the replay cache, checks audience and action claims against the active Pkl policy, and writes an NDJSON audit entry. The pipeline is fail-closed: any step failure returns a 401.',
    code: `# Python FastAPI example
from oathmesh.fastapi import require_oathmesh

@app.get("/invoices")
async def list_invoices(
    caller=Depends(require_oathmesh(
        audience="billing-api",
        action="read",
    ))
):
    # caller.subject == "payments-svc"
    # Token is verified, not expired, not replayed
    return await db.invoices.list(caller.subject)`,
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="bg-surface-1 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">How it works</h2>
          <p className="mx-auto max-w-lg text-white/50">
            Three steps. Every machine call gets a cryptographic identity that
            expires before an attacker can use it.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: shouldReduce ? 0 : -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.55,
                  delay: shouldReduce ? 0 : i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="card-surface overflow-hidden"
              >
                <div className="grid gap-0 lg:grid-cols-2">
                  {/* Left: explanation */}
                  <div className="p-6 lg:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/12 text-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-mono text-xs text-white/30">{step.number}</span>
                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mb-3 text-sm font-medium text-white/80">
                      {step.summary}
                    </p>
                    <p className="text-sm leading-relaxed text-white/50">
                      {step.detail}
                    </p>
                  </div>

                  {/* Right: code */}
                  <div className="border-t border-white/6 bg-surface-0/60 p-5 lg:border-l lg:border-t-0">
                    <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-white/65">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
