// @file components/landing/hero.tsx
'use client';

import { GithubIcon } from '@/components/ui/icons';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, Lock, Shield, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const TERMINAL_LINES = [
  { text: '$ oathmesh mint --sub payments-svc --aud billing-api', delay: 0 },
  { text: 'minting token via ed25519...', delay: 1200, color: 'text-white/40' },
  { text: '✓ Token minted (TTL: 300s)', delay: 1800, color: 'text-white/90' },
  {
    text: 'eyJhbGciOiJFZERTQSIsInR5cCI6Im9tK2p3dCJ9...',
    delay: 1950,
    color: 'text-white/40 text-[11px]',
  },
  { text: '', delay: 2400 },
  { text: '$ curl -H "Authorization: Bearer $TOKEN" \\', delay: 2800 },
  { text: '       https://billing.internal/invoices', delay: 3200 },
  { text: '', delay: 3500 },
  { text: '< HTTP/2 200 OK', delay: 3700, color: 'text-emerald-400 font-medium' },
  { text: '< X-OathMesh-Subject: payments-svc', delay: 3850, color: 'text-white/60' },
  { text: '< X-OathMesh-Verify: Passed', delay: 4000, color: 'text-emerald-400/80' },
];

const badges = [
  { label: 'Ed25519 Native', icon: Lock },
  { label: 'Zero-Trust', icon: Shield },
  { label: 'Bounded TTL', icon: Clock },
];

function TerminalLine({
  text,
  color = 'text-white/80',
  visible,
  isTyping = false,
}: {
  text: string;
  color?: string;
  visible: boolean;
  isTyping?: boolean;
}) {
  if (!visible && !isTyping) return null;
  if (!text) return <div className="h-[22px]" />;
  return (
    <div className={`font-mono text-[13px] leading-relaxed tracking-tight ${color}`}>
      {text}
      {isTyping && (
        <span className="ml-[1px] inline-block h-[14px] w-[6px] animate-pulse bg-white/70 align-middle" />
      )}
    </div>
  );
}

function TerminalAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(shouldReduceMotion ? TERMINAL_LINES.length : 0);
  const [typingIndex, setTypingIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Simulate natural typing delays
    TERMINAL_LINES.forEach((line, i) => {
      const isCommand = line.text.startsWith('$');

      if (isCommand) {
        const t1 = setTimeout(() => setTypingIndex(i), line.delay - 400); // Start typing before full reveal
        timerRef.current.push(t1);
      }

      const t2 = setTimeout(() => {
        setVisibleCount((c) => Math.max(c, i + 1));
        setTypingIndex(-1);
      }, line.delay);
      timerRef.current.push(t2);
    });
    return () => timerRef.current.forEach(clearTimeout);
  }, [shouldReduceMotion]);

  return (
    <div className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-transparent shadow-[0_0_80px_-20px_rgba(255,255,255,0.12)] transition-shadow hover:shadow-[0_0_80px_-20px_rgba(255,255,255,0.2)]">
      {/* Top subtle glare */}
      <div className="absolute inset-x-0 top-0 h-[100px] w-full bg-white/[0.02] bg-gradient-to-b from-white/[0.04] to-transparent" />

      {/* Mac Window Header */}
      <div className="relative flex items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20 transition-colors group-hover:bg-[#FF5F56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20 transition-colors group-hover:bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20 transition-colors group-hover:bg-[#27C93F]" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/40">
          <Terminal className="h-3.5 w-3.5" />
          <span>oathmesh-cli</span>
        </div>
        <div className="w-[42px]" /> {/* Spacer for centering */}
      </div>

      <div className="relative p-6 pt-5">
        <div className="flex flex-col gap-0.5">
          {TERMINAL_LINES.map((line, i) => (
            <TerminalLine
              key={i}
              text={line.text}
              color={line.color}
              visible={i < visibleCount}
              isTyping={typingIndex === i}
            />
          ))}
          {visibleCount < TERMINAL_LINES.length && typingIndex === -1 && (
            <div className="h-[22px]">
              <span className="inline-block h-[14px] w-[6px] animate-blink bg-white/40 align-middle" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-32"
    >
      {/* Precision background styling */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_100%)]" />

      <div className="relative w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">
          {/* Left / Typography Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.div variants={itemVariants} className="mb-6 flex">
              <Link
                href="/docs"
                className="group flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-1 pl-3 pr-2 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                <span>OathMesh v1.0.8 Released</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 max-w-2xl text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
            >
              Every machine call, <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">
                a signed identity.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-8 max-w-[500px] text-[17px] leading-relaxed text-white/50"
            >
              Replace static API keys with extremely short-lived, Ed25519-signed tokens. Built-in
              replay protection and an absolute zero-trust verification engine.
            </motion.p>

            <motion.div variants={itemVariants} className="mb-10 flex flex-wrap items-center gap-4">
              <Link
                href="/docs"
                className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-md bg-white px-5 text-sm font-medium text-black transition-all hover:bg-white/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#interactive-demo"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-5 text-sm font-medium text-white/80 transition-all hover:bg-white/[0.05] hover:text-white"
              >
                Try the Demo
              </Link>
            </motion.div>

            {/* Badge row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 text-[13px] text-white/40"
            >
              {badges.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 opacity-70" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right / Terminal Reveal */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 1,
              delay: shouldReduceMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative lg:ml-auto w-full max-w-xl"
          >
            <TerminalAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
