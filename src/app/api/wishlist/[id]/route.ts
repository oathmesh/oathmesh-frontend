import { db } from '@/db';
import { wishlistItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
// @file app/api/wishlist/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db.select().from(wishlistItems).where(eq(wishlistItems.id, id));

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Simple admin check via shared secret header
  const adminKey = request.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  return NextResponse.json({ success: true });
}
