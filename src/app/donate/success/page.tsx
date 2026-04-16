import { CheckCircle2 } from 'lucide-react';
// @file app/donate/success/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You!',
  description: 'Thank you for supporting OathMesh.',
};

export default function DonateSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-14 px-4">
      <div className="max-w-md text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">Thank you! 🎉</h1>
        <p className="mb-2 text-white/60">
          Your donation means a lot to the OathMesh team. It directly funds infrastructure,
          documentation, and development time.
        </p>
        <p className="mb-8 text-sm text-white/40">
          A receipt will be emailed to you if you provided your email address.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </div>
  );
}
