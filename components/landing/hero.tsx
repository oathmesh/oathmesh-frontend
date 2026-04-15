// @file components/landing/hero.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Lock, FileText } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';

const TERMINAL_LINES = [
  { text: '$ oathmesh mint --sub payments-svc --aud billing-api --act read', delay: 0 },
  { text: '', delay: 900 },
  { text: '✓ Token minted (TTL: 300s)', delay: 1000, color: 'text-emerald-400' },
  { text: 'eyJhbGciOiJFZERTQSIsInR5cCI6Im9tK2p3dCJ9...', delay: 1100, color: 'text-white/40 text-xs' },
  { text: '', delay: 1600 },
  { text: '$ curl -H "Authorization: Bearer $TOKEN" \\', delay: 1700 },
  { text: '       https://billing.internal/invoices', delay: 2000 },
  { text: '', delay: 2400 },
  { text: '< HTTP/2 200', delay: 2500, color: 'text-emerald-400' },
  { text: '< X-OathMesh-Subject: payments-svc', delay: 2650, color: 'text-blue-400/80' },
  { text: '< X-OathMesh-Action: read', delay: 2800, color: 'text-blue-400/80' },
  { text: '< X-OathMesh-Token-ID: jti_01HXYZ...', delay: 2950, color: 'text-blue-400/80' },
];

const badges = [
  { label: 'Ed25519', icon: Lock },
  { label: '≤ 300s TTL', icon: Clock },
  { label: 'Zero-Trust', icon: Shield },
  { label: 'MIT License', icon: FileText },
];

function TerminalLine({ text, color = 'text-white/80', visible }: {
  text: string;
  color?: string;
  visible: boolean;
}) {
  if (!visible) return null;
  if (!text) return <div className="h-3" />;
  return (
    <div className={`font-mono text-[13px] leading-relaxed ${color}`}>
      {text}
    </div>
  );
}

function TerminalAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(
    shouldReduceMotion ? TERMINAL_LINES.length : 0,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    TERMINAL_LINES.forEach((_, i) => {
      const t = setTimeout(
        () => setVisibleCount((c) => Math.max(c, i + 1)),
        TERMINAL_LINES[i]!.delay,
      );
      timerRef.current.push(t);
    });
    return () => timerRef.current.forEach(clearTimeout);
  }, [shouldReduceMotion]);

  return (
    <div className="code-block overflow-hidden rounded-xl p-5">
      {/* Terminal header */}
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-500/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs text-white/30">oathmesh — bash</span>
      </div>
      <div className="space-y-0.5">
        {TERMINAL_LINES.map((line, i) => (
          <TerminalLine
            key={i}
            text={line.text}
            color={line.color}
            visible={i < visibleCount}
          />
        ))}
        {visibleCount < TERMINAL_LINES.length && (
          <span className="inline-block h-4 w-2 animate-blink bg-white/70" />
        )}
      </div>
    </div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-screen items-center pt-14"
      style={{ background: '#0a0a0a' }}
    >
      {/* Grid + radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(0,102,255,0.16) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left – copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-5">
              <span className="pill border border-brand/30 bg-brand/10 text-brand-light text-xs">
                Open Source · Zero-Trust · Ed25519
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Every machine call,{' '}
              <span className="text-brand">a signed identity.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-3 text-lg text-white/55 sm:text-xl"
            >
              API keys don&apos;t expire. Your blast radius shouldn&apos;t be infinite.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mb-8 max-w-lg text-base text-white/45"
            >
              OathMesh replaces static API keys with Ed25519-signed tokens
              expiring in ≤ 300 seconds — with replay protection, a policy
              engine, and a full NDJSON audit trail.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/docs"
                id="hero-docs-cta"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/oathmesh/oathmesh"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-github-cta"
                className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/22 hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
                View on GitHub
              </Link>
            </motion.div>

            {/* Badge row */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-2"
            >
              {badges.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs font-medium text-white/60"
                >
                  <Icon className="h-3 w-3 text-white/40" />
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right – terminal */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <TerminalAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
