// @file app/donate/cancel/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Donation Cancelled',
  description: 'Your donation was cancelled.',
};

export default function DonateCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-14 px-4">
      <div className="max-w-md text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/6">
          <XCircle className="h-8 w-8 text-white/30" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-white">Donation cancelled</h1>
        <p className="mb-8 text-white/50">
          No problem — your donation was cancelled and you were not charged. If
          you change your mind, we&apos;d love your support!
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/donate"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
