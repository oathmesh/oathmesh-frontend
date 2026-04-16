// @file components/landing/email-signup.tsx
'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useState, useTransition } from 'react';

export function EmailSignup() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          toast.error('Subscription failed', data.error ?? 'Please try again.');
        } else {
          toast.success("You're subscribed!", "We'll notify you of new releases.");
          setEmail('');
        }
      } catch {
        toast.error('Network error', 'Please check your connection and try again.');
      }
    });
  };

  return (
    <section className="relative overflow-hidden bg-transparent py-32 border-t border-white/[0.04]">
      {/* Background glow lines */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]">
            <Mail className="h-5 w-5 text-white/80" />
          </div>
          <h2 className="mb-3 text-3xl font-semibold tracking-[-0.03em] text-white">
            Stay in the loop
          </h2>
          <p className="mb-8 text-[16px] leading-relaxed text-white/50">
            Get notified of new releases, SDK updates, and security advisories. No spam, ever.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="Newsletter signup"
          >
            <label htmlFor="email-signup-input" className="sr-only">
              Email address
            </label>
            <input
              id="email-signup-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-[10px] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors"
              aria-label="Your email address"
            />
            <Button
              type="submit"
              loading={isPending}
              id="email-signup-submit"
              className="h-[46px] sm:w-[120px] rounded-[10px] bg-white text-black hover:bg-white/90 font-medium transition-colors"
            >
              Subscribe
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
