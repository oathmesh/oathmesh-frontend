// @file components/donate/donor-wall.tsx
import { db } from '@/db';
import { donations } from '@/db/schema';
import { formatCurrency, formatDate } from '@/lib/utils';
import { and, desc, eq } from 'drizzle-orm';
import { Heart } from 'lucide-react';

async function getDonors() {
  try {
    return await db
      .select({
        id: donations.id,
        donorName: donations.donorName,
        amountCents: donations.amountCents,
        message: donations.message,
        completedAt: donations.completedAt,
      })
      .from(donations)
      .where(and(eq(donations.status, 'completed'), eq(donations.showOnWall, true)))
      .orderBy(desc(donations.completedAt))
      .limit(20);
  } catch {
    return [];
  }
}

export async function DonorWall() {
  const donors = await getDonors();

  if (donors.length === 0) {
    return (
      <p className="text-center text-sm text-white/35 py-8">Be the first to support OathMesh!</p>
    );
  }

  return (
    <div className="space-y-3">
      {donors.map((donor) => (
        <div key={donor.id} className="card-surface flex items-start gap-4 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <Heart className="h-4 w-4 text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-white text-sm">
                {donor.donorName ?? 'Anonymous'}
              </span>
              <span className="shrink-0 font-mono text-xs text-brand-light">
                {formatCurrency(donor.amountCents)}
              </span>
            </div>
            {donor.message && (
              <p className="mt-1 text-xs text-white/50 italic">&ldquo;{donor.message}&rdquo;</p>
            )}
            {donor.completedAt && (
              <p className="mt-1 text-xs text-white/25">{formatDate(donor.completedAt)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
