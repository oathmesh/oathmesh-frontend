// @file components/wishlist/vote-button.tsx
'use client';

import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';
import { useState, useTransition } from 'react';

interface VoteButtonProps {
  itemId: string;
  initialVotes: number;
  initialVoted?: boolean;
}

export function VoteButton({ itemId, initialVotes, initialVoted = false }: VoteButtonProps) {
  // Check localStorage for persisted voted state
  const getStoredVote = () => {
    if (typeof window === 'undefined') return initialVoted;
    return localStorage.getItem(`voted:${itemId}`) === '1' || initialVoted;
  };

  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(getStoredVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = () => {
    if (voted) return;

    // Optimistic update
    setVotes((v) => v + 1);
    setVoted(true);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/wishlist/${itemId}/vote`, { method: 'POST' });
        const data = (await res.json()) as { votes: number; alreadyVoted: boolean; error?: string };

        if (!res.ok) {
          // Roll back
          setVotes((v) => v - 1);
          setVoted(false);
          toast.error('Vote failed', data.error ?? 'Please try again.');
          return;
        }

        // Sync with server state
        setVotes(data.votes);
        if (data.alreadyVoted) {
          setVoted(true);
        }

        // Persist to localStorage
        localStorage.setItem(`voted:${itemId}`, '1');
      } catch {
        // Roll back
        setVotes((v) => v - 1);
        setVoted(false);
        toast.error('Network error', 'Could not submit vote.');
      }
    });
  };

  return (
    <button
      onClick={handleVote}
      disabled={voted || isPending}
      aria-label={voted ? `You voted (${votes} votes)` : `Upvote (${votes} votes)`}
      aria-live="polite"
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all',
        voted
          ? 'border-brand/30 bg-brand/10 text-brand-light cursor-default'
          : 'border-white/10 text-white/50 hover:border-brand/30 hover:bg-brand/8 hover:text-brand-light',
        isPending && 'opacity-70',
      )}
    >
      <ChevronUp className={cn('h-4 w-4', voted && 'text-brand')} />
      <span className="tabular-nums">{votes}</span>
    </button>
  );
}
