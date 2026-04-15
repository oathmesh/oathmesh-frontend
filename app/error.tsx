// @file app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(JSON.stringify({ event: 'root_error', message: error.message, digest: error.digest }));
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-white">Something went wrong</h1>
      <p className="mb-6 max-w-md text-muted">
        An unexpected error occurred. If this keeps happening, please{' '}
        <a href="mailto:team@oathmesh.dev" className="text-brand underline underline-offset-2">
          let us know
        </a>
        .
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-xs text-subtle">Error ID: {error.digest}</p>
      )}
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
