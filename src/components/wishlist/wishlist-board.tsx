// @file components/wishlist/wishlist-board.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { WishlistItem } from '@/db/schema';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SubmitWishForm } from './submit-wish-form';
import { WishlistItemCard } from './wishlist-item';

const CATEGORIES = ['all', 'sdk', 'feature', 'integration', 'docs', 'other'];
const STATUSES = ['all', 'open', 'planned', 'in-progress', 'shipped'];
const SORTS = [
  { value: 'votes', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
];

export function WishlistBoard() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('votes');
  const [showForm, setShowForm] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (category !== 'all') params.set('category', category);
    if (status !== 'all') params.set('status', status);

    try {
      const res = await fetch(`/api/wishlist?${params}`);
      const data = (await res.json()) as { items: WishlistItem[] };
      setItems(data.items ?? []);
    } catch {
      // Keep existing items on error
    } finally {
      setLoading(false);
    }
  }, [category, status, sort]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleSuccess = () => {
    setShowForm(false);
    void fetchItems();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Feature Wishlist</h1>
          <p className="mt-2 text-white/50">
            Community-driven feature requests. Vote for what matters to you.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(true)}
          id="submit-wish-open"
        >
          Submit request
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-white/40" />

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                category === cat
                  ? 'bg-brand text-white'
                  : 'bg-white/6 text-white/50 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Status filter */}
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                status === s ? 'bg-brand text-white' : 'bg-white/6 text-white/50 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort wishlist items"
            className="rounded-lg border border-white/10 bg-surface-1 px-3 py-1.5 text-xs text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Item list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-6 w-6 text-white/40" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-white/35">
          <p className="mb-2 text-lg">No results</p>
          <p className="text-sm">Try adjusting your filters or be the first to submit one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Submit modal */}
      {showForm && <SubmitWishForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />}
    </div>
  );
}
