// @file components/docs/step-list.tsx
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  children: React.ReactNode;
}

interface StepListProps {
  steps: Step[];
  className?: string;
}

export function StepList({ steps, className }: StepListProps) {
  return (
    <ol className={cn('relative space-y-8', className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          {/* Number bubble + connecting line */}
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/12 text-sm font-bold text-brand">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="mt-2 w-px flex-1 bg-white/8" />}
          </div>

          <div className="min-w-0 flex-1 pb-8 last:pb-0">
            <h3 className="mb-3 text-base font-semibold text-white">{step.title}</h3>
            <div className="text-sm leading-relaxed text-white/60">{step.children}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
