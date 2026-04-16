// @file components/landing/stats-bar.tsx
'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 14, suffix: '-step', label: 'Verification pipeline', prefix: '' },
  { value: 300, suffix: 's', label: 'Maximum token TTL', prefix: '≤ ' },
  { value: 3, suffix: '', label: 'Official SDKs', prefix: '' },
  { value: 0, suffix: '', label: 'Static keys in codebase', prefix: '' },
];

function CountUp({
  target,
  active,
}: {
  target: number;
  active: boolean;
}) {
  const [count, setCount] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!active || shouldReduce) {
      setCount(target);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf: number;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, shouldReduce]);

  return <>{count}</>;
}

export function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section ref={ref} className="relative bg-transparent py-16">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-4 lg:gap-x-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative text-center group">
              {/* Separate divs with subtle vertical lines on desktop */}
              {i !== 0 && (
                <div className="hidden lg:block absolute -left-6 top-1/2 h-8 w-[1px] -translate-y-1/2 bg-white/[0.06]" />
              )}
              <div className="mb-2 font-mono text-[32px] tracking-tight font-medium text-white transition-transform duration-500 group-hover:scale-105 group-hover:text-emerald-400">
                {stat.prefix}
                <CountUp target={stat.value} active={inView} />
                {stat.suffix}
              </div>
              <div className="text-[13px] font-medium text-white/50 tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
