// @file app/not-found.tsx
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
        <FileQuestion className="h-7 w-7 text-muted" />
      </div>
      <p className="mb-2 font-mono text-sm text-brand">404</p>
      <h1 className="mb-3 text-3xl font-bold text-white">Page not found</h1>
      <p className="mb-8 max-w-sm text-muted">
        This page doesn&apos;t exist. It may have moved or been removed.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Back to home
        </Link>
        <Link
          href="/docs"
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/20 hover:text-white"
        >
          Read the docs
        </Link>
      </div>
    </div>
  );
}
