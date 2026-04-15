// @file components/landing/email-signup.tsx
'use client';

import { useState, useTransition } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

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
        const data = await res.json() as { error?: string };
        if (!res.ok) {
          toast.error('Subscription failed', data.error ?? 'Please try again.');
        } else {
          toast.success('You\'re subscribed!', 'We\'ll notify you of new releases.');
          setEmail('');
        }
      } catch {
        toast.error('Network error', 'Please check your connection and try again.');
      }
    });
  };

  return (
    <section className="border-t border-white/6 bg-surface-0 py-16">
      <div className="mx-auto max-w-xl px-4 text-center">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/12">
          <Mail className="h-5 w-5 text-brand" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Stay in the loop
        </h2>
        <p className="mb-6 text-white/50">
          Get notified of new releases, SDK updates, and security advisories.
          No spam, ever.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
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
            className="flex-1 rounded-lg border border-white/10 bg-surface-1 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand hover:border-white/20 transition-colors"
            aria-label="Your email address"
          />
          <Button
            type="submit"
            variant="primary"
            loading={isPending}
            id="email-signup-submit"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
