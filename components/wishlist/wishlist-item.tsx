// @file components/wishlist/wishlist-item.tsx
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { VoteButton } from './vote-button';
import type { WishlistItem } from '@/db/schema';
import { formatDate } from '@/lib/utils';

interface WishlistItemCardProps {
  item: WishlistItem;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  return (
    <div className="card-surface flex gap-4 p-5">
      {/* Vote button */}
      <div className="shrink-0">
        <VoteButton itemId={item.id} initialVotes={item.votes} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-white text-sm">{item.title}</h3>
          <Badge variant={item.category as BadgeVariant}>{item.category}</Badge>
          <Badge variant={item.status as BadgeVariant}>{item.status}</Badge>
        </div>

        <p className="mb-2 text-sm leading-relaxed text-white/55 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-white/35">
          {item.authorName && <span>by {item.authorName}</span>}
          <span>{formatDate(item.createdAt)}</span>
          {item.githubIssueUrl && (
            <a
              href={item.githubIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-brand-light/70 hover:text-brand-light transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View discussion
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
