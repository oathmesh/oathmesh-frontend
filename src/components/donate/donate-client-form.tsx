// @file components/donate/donate-client-form.tsx
'use client';

import { CustomAmountInput } from '@/components/donate/custom-amount-input';
import { DonationTiers, TIERS, type Tier } from '@/components/donate/donation-tiers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import { useState, useTransition } from 'react';

export function DonateClientForm() {
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
      return Math.round(Number.parseFloat(customAmount) * 100);
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
        const data = (await res.json()) as { url?: string; error?: string };
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
    <>
      {/* Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-6 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]">
          <Shield className="h-8 w-8 text-white/80" />
        </div>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white">Support OathMesh</h1>
        <p className="text-[16px] leading-relaxed text-white/50 max-w-lg mx-auto">
          OathMesh is free, open-source, and MIT licensed. Donations fund infrastructure costs,
          documentation, and development time for new SDKs and features.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Tier picker */}
        <section aria-label="Donation tiers" className="mb-6">
          <DonationTiers selectedTierId={selectedTier?.id ?? null} onSelect={handleTierSelect} />
        </section>

        {/* Custom amount */}
        <div className="mb-8">
          <CustomAmountInput
            value={customAmount}
            onChange={setCustomAmount}
            active={customActive}
            onFocus={handleCustomFocus}
          />
        </div>

        {/* Donor info */}
        <div className="relative overflow-hidden rounded-[16px] bg-[#030303] border border-white/[0.06] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] mb-8 p-6 space-y-5">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name (optional)"
              placeholder="Your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              id="donor-name"
              className="bg-[#050505] border-white/10 text-white focus-visible:ring-white/20"
            />
            <Input
              label="Email (optional)"
              type="email"
              placeholder="For your receipt"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              id="donor-email"
              className="bg-[#050505] border-white/10 text-white focus-visible:ring-white/20"
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
            className="bg-[#050505] border-white/10 text-white focus-visible:ring-white/20 min-h-[100px]"
          />
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={showOnWall}
              onChange={(e) => setShowOnWall(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-[#050505] text-white focus-visible:outline-none focus:ring-2 focus:ring-white/20"
              id="show-on-wall"
            />
            <span className="text-[14px] text-white/70 tracking-wide">
              Show my name on the donor wall
            </span>
          </label>
        </div>

        {/* Donate button */}
        <Button
          size="lg"
          className="w-full h-14 rounded-[12px] bg-white text-black font-semibold text-[16px] hover:bg-white/90 transition-all focus:ring-4 focus:ring-white/20 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
          loading={isPending}
          onClick={handleDonate}
          id="donate-submit"
        >
          Donate with Stripe →
        </Button>

        {/* Security note */}
        <p className="mt-6 flex items-center justify-center gap-2 text-[12px] font-medium text-white/40">
          <Lock className="h-3.5 w-3.5" />
          Payments processed securely by Stripe. OathMesh never stores card details.
        </p>
      </motion.div>
    </>
  );
}
