// @file app/not-found.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Home, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/[0.03] border border-white/10 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] relative">
            <div className="absolute inset-0 rounded-3xl bg-white/[0.02] blur-xl" />
            <Terminal className="h-10 w-10 text-white/80 relative z-10" />
            <div className="absolute -bottom-2 -right-2 bg-red-500/20 text-red-500 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/30">
              ERR_404
            </div>
          </div>

          <h1 className="mb-4 text-6xl font-bold tracking-tight text-white sm:text-7xl">
            4<span className="text-white/20">0</span>4
          </h1>
          <h2 className="mb-6 text-2xl font-semibold tracking-[-0.02em] text-white/90">
            Path not found in mesh
          </h2>

          <p className="mx-auto mb-10 max-w-md text-[16px] leading-relaxed text-white/50">
            The machine identity or resource you are looking for does not exist, has expired, or is
            blocked by the active policy.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-8 text-[15px] font-medium text-black transition-all hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-8 text-[15px] font-medium text-white/80 transition-all hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
