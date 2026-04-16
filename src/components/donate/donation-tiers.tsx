// @file components/donate/donation-tiers.tsx
'use client';

import { cn } from '@/lib/utils';

export interface Tier {
  id: string;
  emoji: string;
  name: string;
  amountCents: number;
  description: string;
  perks?: string;
}

export const TIERS: Tier[] = [
  {
    id: 'coffee',
    emoji: '☕',
    name: 'Coffee',
    amountCents: 500,
    description: 'Buy the team a coffee',
  },
  {
    id: 'supporter',
    emoji: '🌱',
    name: 'Supporter',
    amountCents: 2000,
    description: 'Keep the servers running',
  },
  {
    id: 'sponsor',
    emoji: '🚀',
    name: 'Sponsor',
    amountCents: 10000,
    description: 'Your name on the donor wall',
    perks: 'Donor wall listing',
  },
  {
    id: 'enterprise',
    emoji: '🏢',
    name: 'Enterprise Sponsor',
    amountCents: 50000,
    description: 'Logo on README + donor wall + email shoutout',
    perks: 'README logo · Donor wall · Email shoutout',
  },
];

interface DonationTiersProps {
  selectedTierId: string | null;
  onSelect: (tier: Tier) => void;
}

export function DonationTiers({ selectedTierId, onSelect }: DonationTiersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {TIERS.map((tier) => (
        <button
          key={tier.id}
          id={`tier-${tier.id}`}
          onClick={() => onSelect(tier)}
          className={cn(
            'card-surface flex flex-col items-center p-5 text-center transition-all',
            selectedTierId === tier.id
              ? 'border-brand/40 bg-brand/8 ring-1 ring-brand/30'
              : 'hover:border-white/16',
          )}
          aria-pressed={selectedTierId === tier.id}
        >
          <span className="mb-2 text-2xl">{tier.emoji}</span>
          <span className="mb-0.5 font-semibold text-white text-sm">{tier.name}</span>
          <span className="mb-2 font-mono text-lg font-bold text-brand">
            ${(tier.amountCents / 100).toFixed(0)}
          </span>
          <span className="text-xs text-white/45">{tier.description}</span>
          {tier.perks && <span className="mt-2 text-[10px] text-brand-light/70">{tier.perks}</span>}
        </button>
      ))}
    </div>
  );
}
