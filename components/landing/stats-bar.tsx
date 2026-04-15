// @file components/landing/stats-bar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const stats = [
  { value: 14, suffix: '-step', label: 'Verification pipeline', prefix: '' },
  { value: 300, suffix: 's', label: 'Maximum token TTL', prefix: '≤\u00a0' },
  { value: 3, suffix: '', label: 'Official SDKs', prefix: '' },
  { value: 0, suffix: '', label: 'Static keys in your codebase', prefix: '' },
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
    <section ref={ref} className="border-y border-white/6 bg-surface-1 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-1 font-mono text-4xl font-bold text-white">
                {stat.prefix}
                <CountUp target={stat.value} active={inView} />
                {stat.suffix}
              </div>
              <div className="text-sm text-white/45">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
