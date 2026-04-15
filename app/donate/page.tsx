// @file app/donate/page.tsx
'use client';

import { useState, useTransition, Suspense } from 'react';
import { Shield, Lock } from 'lucide-react';
import { DonationTiers, TIERS, type Tier } from '@/components/donate/donation-tiers';
import { CustomAmountInput } from '@/components/donate/custom-amount-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DonorWall } from '@/components/donate/donor-wall';
import { ToastProvider, toast } from '@/components/ui/toast';

export default function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(TIERS[1]!);
  const [customAmount, setCustomAmount] = useState('');
  const [customActive, setCustomActive] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showOnWall, setShowOnWall] = useState(true);
  const [isPending, startTransition] = useTransition();

  const getAmountCents = () => {
    if (customActive && customAmount) {
      return Math.round(parseFloat(customAmount) * 100);
    }
    return selectedTier?.amountCents ?? 0;
  };

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setCustomActive(false);
    setCustomAmount('');
  };

  const handleCustomFocus = () => {
    setCustomActive(true);
    setSelectedTier(null);
  };

  const handleDonate = () => {
    const amountCents = getAmountCents();
    if (amountCents < 100) {
      toast.error('Minimum $1.00', 'Please enter at least $1.00 to donate.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/donate/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountCents,
            donorName: donorName || undefined,
            donorEmail: donorEmail || undefined,
            message: message || undefined,
            showOnWall,
          }),
        });
        const data = await res.json() as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          toast.error('Checkout failed', data.error ?? 'Please try again.');
          return;
        }
        window.location.href = data.url;
      } catch {
        toast.error('Network error', 'Could not start checkout. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
            <Shield className="h-6 w-6 text-brand" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Support OathMesh</h1>
          <p className="text-white/50">
            OathMesh is free, open-source, and MIT licensed. Donations fund
            infrastructure costs, documentation, and development time for new
            SDKs and features.
          </p>
        </div>

        {/* Tier picker */}
        <section aria-label="Donation tiers" className="mb-5">
          <DonationTiers selectedTierId={selectedTier?.id ?? null} onSelect={handleTierSelect} />
        </section>

        {/* Custom amount */}
        <div className="mb-6">
          <CustomAmountInput
            value={customAmount}
            onChange={setCustomAmount}
            active={customActive}
            onFocus={handleCustomFocus}
          />
        </div>

        {/* Donor info */}
        <div className="card-surface mb-6 space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Name (optional)"
              placeholder="Your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              id="donor-name"
            />
            <Input
              label="Email (optional)"
              type="email"
              placeholder="For your receipt"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              id="donor-email"
            />
          </div>
          <Textarea
            label="Message (optional)"
            placeholder="Leave a note for the team…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={280}
            showCount
            id="donor-message"
          />
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={showOnWall}
              onChange={(e) => setShowOnWall(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-surface-1 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              id="show-on-wall"
            />
            <span className="text-sm text-white/70">Show my name on the donor wall</span>
          </label>
        </div>

        {/* Donate button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={isPending}
          onClick={handleDonate}
          id="donate-submit"
        >
          Donate with Stripe →
        </Button>

        {/* Security note */}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/30">
          <Lock className="h-3 w-3" />
          Payments processed securely by Stripe. OathMesh never stores card details.
        </p>

        {/* Donor wall */}
        <div className="mt-14">
          <h2 className="mb-5 text-xl font-bold text-white">Supporters</h2>
          <Suspense fallback={<p className="text-center text-sm text-white/30 py-8">Loading…</p>}>
            <DonorWall />
          </Suspense>
        </div>
      </div>
      <ToastProvider />
    </div>
  );
}
