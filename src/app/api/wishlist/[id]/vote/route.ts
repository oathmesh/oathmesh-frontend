import { db } from '@/db';
import { wishlistItems, wishlistVotes } from '@/db/schema';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { sha256 } from '@/lib/utils';
import { eq, sql } from 'drizzle-orm';
// @file app/api/wishlist/[id]/vote/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Broad rate limit: 20 vote actions per IP per hour
  const ip = getIp(request);
  const limit = await checkRateLimit(ip, {
    namespace: 'vote',
    limit: 20,
    windowSeconds: 3600,
  });

  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many votes. Try again later.' }, { status: 429 });
  }

  // Compute voter fingerprint: SHA-256 of IP + User-Agent
  const ua = request.headers.get('user-agent') ?? '';
  const fingerprint = await sha256(`${ip}:${ua}`);

  // Check item exists
  const [item] = await db
    .select({ id: wishlistItems.id, votes: wishlistItems.votes })
    .from(wishlistItems)
    .where(eq(wishlistItems.id, id));

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  // Attempt to insert vote (unique constraint prevents double-voting)
  try {
    await db.insert(wishlistVotes).values({ itemId: id, voterFingerprint: fingerprint });
  } catch {
    // Unique constraint violation = already voted
    return NextResponse.json({ votes: item.votes, alreadyVoted: true });
  }

  // Increment vote count
  const [updated] = await db
    .update(wishlistItems)
    .set({
      votes: sql`${wishlistItems.votes} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(wishlistItems.id, id))
    .returning({ votes: wishlistItems.votes });

  return NextResponse.json({ votes: updated?.votes ?? item.votes + 1, alreadyVoted: false });
}
