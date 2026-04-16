// @file components/landing/how-it-works.tsx
'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Code2, Key, Send, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    icon: Key,
    title: 'Mint',
    summary: 'The calling service requests a short-lived token from the OathMesh issuer.',
    detail:
      "The issuer validates the caller's identity (via mTLS, OIDC, or a bootstrap secret), applies the active Pkl policy to determine permitted audience/actions, and signs a token with Ed25519. The token's TTL is clamped to ≤ 300 seconds — no exceptions.",
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
    summary: "The receiving service runs OathMesh's 14-step verification pipeline.",
    detail:
      'The receiver fetches the JWKS from the issuer, verifies the signature, checks expiry, validates the jti against the replay cache, checks audience/action claims, and writes an NDJSON audit entry. Fail closed: any step failure returns a 401.',
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
    <section ref={ref} className="relative bg-transparent py-32 overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent ml-[calc(50%-max(600px,50vw))] hidden lg:block" />
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent mr-[calc(50%-max(600px,50vw))] hidden lg:block" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Three steps to Zero-Trust
            </h2>
            <p className="mx-auto max-w-2xl text-[17px] leading-relaxed text-white/50">
              Every machine call gets a cryptographic identity that expires before an attacker can
              use it.
            </p>
          </motion.div>
        </div>

        <div className="space-y-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: shouldReduce ? 0 : i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex overflow-hidden rounded-[20px] bg-[#050505] shadow-[0_4px_40px_-10px_rgba(0,0,0,0.8)] border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-500"
              >
                {/* Subtle top-left glare */}
                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/[0.03] blur-3xl transition-opacity group-hover:opacity-100" />

                <div className="grid w-full lg:grid-cols-[1fr,1.2fr]">
                  {/* Left: explanation */}
                  <div className="relative p-8 lg:p-12 z-10">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
                        <Icon className="h-5 w-5 text-white/80" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase block mb-1">
                          {step.number}
                        </span>
                        <h3 className="text-xl font-medium tracking-tight text-white/90">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mb-4 text-[16px] font-medium leading-relaxed text-white/80">
                      {step.summary}
                    </p>
                    <p className="text-[15px] leading-relaxed text-white/40">{step.detail}</p>
                  </div>

                  {/* Right: code */}
                  <div className="relative border-t border-white/[0.04] bg-[#020202] p-8 lg:border-l lg:border-t-0 z-10 flex flex-col justify-center">
                    <div className="absolute top-4 right-4 text-white/20">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div className="code-block p-6">
                      <pre className="overflow-x-auto font-mono text-[13px] leading-loose text-white/60">
                        <code>{step.code}</code>
                      </pre>
                    </div>
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
