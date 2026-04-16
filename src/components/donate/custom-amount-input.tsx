// @file components/donate/custom-amount-input.tsx
'use client';

import { cn } from '@/lib/utils';

interface CustomAmountInputProps {
  value: string;
  onChange: (v: string) => void;
  active: boolean;
  onFocus: () => void;
}

export function CustomAmountInput({ value, onChange, active, onFocus }: CustomAmountInputProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border p-4 transition-all',
        active ? 'border-brand/40 bg-brand/6 ring-1 ring-brand/25' : 'border-white/10 bg-surface-1',
      )}
    >
      <span className="text-lg font-semibold text-white/40">$</span>
      <label htmlFor="custom-amount" className="sr-only">
        Custom donation amount in dollars
      </label>
      <input
        id="custom-amount"
        type="number"
        min="1"
        step="1"
        placeholder="Custom amount"
        value={value}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-xl font-semibold text-white placeholder:text-white/25 focus:outline-none"
        aria-label="Custom donation amount in dollars"
      />
      <span className="text-sm text-white/40">USD</span>
    </div>
  );
}
