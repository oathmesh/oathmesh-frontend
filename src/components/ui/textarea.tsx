import { cn } from '@/lib/utils';
// @file components/ui/textarea.tsx
import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount, maxLength, className, id, value, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="text-sm font-medium text-white/80">
              {label}
              {props.required && <span className="ml-0.5 text-red-400">*</span>}
            </label>
            {showCount && maxLength && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  currentLength >= maxLength ? 'text-red-400' : 'text-muted',
                )}
              >
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          className={cn(
            'min-h-[100px] w-full resize-y rounded-lg border bg-surface-1 px-3 py-2.5 text-sm text-white placeholder:text-white/40',
            'transition-colors duration-150',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            error
              ? 'border-red-500/60 focus-visible:outline-red-500'
              : 'border-white/10 hover:border-white/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export { Textarea };
