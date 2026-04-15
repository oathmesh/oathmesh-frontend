// @file components/ui/toast.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps extends ToastMessage {
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
  info: <Info className="h-4 w-4 text-brand-light" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-emerald-500/25',
  error: 'border-red-500/25',
  info: 'border-brand/25',
};

function Toast({ id, type, title, description, onDismiss }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(id), 4500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-xl border bg-surface-2 p-4 shadow-xl animate-fadeIn',
        borderColors[type],
      )}
    >
      <span className="mt-0.5 shrink-0">{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-white/30 transition-colors hover:text-white/70"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Toast state management (simple without external lib) ────────────────────

type ToastStore = {
  toasts: ToastMessage[];
  add: (toast: Omit<ToastMessage, 'id'>) => void;
  remove: (id: string) => void;
};

let _listeners: Array<(store: ToastMessage[]) => void> = [];
let _toasts: ToastMessage[] = [];

function notify(update: ToastMessage[]) {
  _toasts = update;
  _listeners.forEach((l) => l(update));
}

export const toast = {
  success: (title: string, description?: string) =>
    notify([
      ..._toasts,
      { id: crypto.randomUUID(), type: 'success', title, description },
    ]),
  error: (title: string, description?: string) =>
    notify([
      ..._toasts,
      { id: crypto.randomUUID(), type: 'error', title, description },
    ]),
  info: (title: string, description?: string) =>
    notify([
      ..._toasts,
      { id: crypto.randomUUID(), type: 'info', title, description },
    ]),
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    _listeners.push(setToasts);
    return () => {
      _listeners = _listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const dismiss = (id: string) => {
    notify(_toasts.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
