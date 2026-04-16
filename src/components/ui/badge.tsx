// @file components/ui/badge.tsx
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'open'
  | 'planned'
  | 'in-progress'
  | 'shipped'
  | 'declined'
  | 'sdk'
  | 'feature'
  | 'integration'
  | 'docs'
  | 'other';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/8 text-white/70 border-white/10',
  brand: 'bg-brand/15 text-brand-light border-brand/30',
  success: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/12 text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/12 text-red-400 border-red-500/25',
  // Wishlist status
  open: 'bg-blue-500/12 text-blue-400 border-blue-500/25',
  planned: 'bg-purple-500/12 text-purple-400 border-purple-500/25',
  'in-progress': 'bg-amber-500/12 text-amber-400 border-amber-500/25',
  shipped: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
  declined: 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30',
  // Wishlist category
  sdk: 'bg-cyan-500/12 text-cyan-400 border-cyan-500/25',
  feature: 'bg-brand/12 text-brand-light border-brand/25',
  integration: 'bg-violet-500/12 text-violet-400 border-violet-500/25',
  docs: 'bg-orange-500/12 text-orange-400 border-orange-500/25',
  other: 'bg-white/6 text-white/50 border-white/10',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'pill border text-[0.7rem] font-medium tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
