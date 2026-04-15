// @file components/wishlist/submit-wish-form.tsx
'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

interface SubmitWishFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitWishForm({ onClose, onSuccess }: SubmitWishFormProps) {
  const [isPending, startTransition] = useTransition();
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    startTransition(async () => {
      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json() as { error?: string };
        if (!res.ok) {
          toast.error('Submission failed', json.error ?? 'Please try again.');
          return;
        }
        toast.success('Request submitted!', 'Thank you — the team will review it.');
        onSuccess();
      } catch {
        toast.error('Network error', 'Could not submit your request.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Submit feature request">
      <div className="card-surface w-full max-w-lg p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Submit a feature request</h2>
          <button onClick={onClose} aria-label="Close" className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            label="Title"
            placeholder="e.g. Rust SDK"
            required
            maxLength={120}
          />

          <Textarea
            name="description"
            label="Description"
            placeholder="What do you need and why? The more detail, the better."
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            maxLength={500}
            showCount
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-select" className="text-sm font-medium text-white/80">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category-select"
              name="category"
              required
              className="h-10 rounded-lg border border-white/10 bg-surface-1 px-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand hover:border-white/20 transition-colors"
            >
              <option value="">Select a category…</option>
              <option value="sdk">SDK</option>
              <option value="feature">Feature</option>
              <option value="integration">Integration</option>
              <option value="docs">Documentation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input name="authorName" label="Your name (optional)" placeholder="Anonymous" />
            <Input name="authorEmail" label="Your email (optional)" type="email" placeholder="for confirmation" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isPending} id="submit-wish-btn">Submit request</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
