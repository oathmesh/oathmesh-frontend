'use client';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 pt-14 text-center">
      <AlertTriangle className="h-8 w-8 text-amber-400" />
      <h2 className="text-xl font-semibold text-white">Wishlist failed to load</h2>
      <p className="max-w-sm text-sm text-muted">{error.message}</p>
      <Button variant="secondary" size="sm" onClick={reset}>Try again</Button>
    </div>
  );
}
