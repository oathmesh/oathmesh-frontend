import { cn } from '@/lib/utils';
// @file components/docs/callout.tsx
import { AlertTriangle, Info, Lightbulb, XOctagon } from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'danger' | 'tip';

const styles: Record<
  CalloutType,
  { border: string; bg: string; icon: React.ReactNode; label: string }
> = {
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/6',
    icon: <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />,
    label: 'Note',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/6',
    icon: <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />,
    label: 'Warning',
  },
  danger: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/6',
    icon: <XOctagon className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />,
    label: 'Caution',
  },
  tip: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/6',
    icon: <Lightbulb className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />,
    label: 'Tip',
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <div
      role="note"
      aria-label={title ?? s.label}
      className={cn('my-5 flex gap-3 rounded-lg border p-4', s.border, s.bg)}
    >
      {s.icon}
      <div className="text-sm leading-relaxed text-white/70">
        {title && <p className="mb-1 font-semibold text-white/90">{title}</p>}
        {children}
      </div>
    </div>
  );
}
