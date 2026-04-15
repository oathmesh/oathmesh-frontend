// @file app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { wishlistItems } from '@/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/resend';
import WishlistSubmittedEmail from '@/emails/wishlist-submitted';
import React from 'react';

const newWishSchema = z.object({
  title: z.string().min(5, 'Title too short').max(120, 'Title max 120 chars'),
  description: z.string().min(10, 'Description too short').max(500, 'Description max 500 chars'),
  category: z.enum(['sdk', 'feature', 'integration', 'docs', 'other']),
  authorName: z.string().max(80).optional(),
  authorEmail: z.string().email().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const sort = searchParams.get('sort') ?? 'votes';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    if (category) conditions.push(eq(wishlistItems.category, category));
    if (status) conditions.push(eq(wishlistItems.status, status));

    const items = await db
      .select()
      .from(wishlistItems)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sort === 'votes' ? desc(wishlistItems.votes) : desc(wishlistItems.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ items, page, limit }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
    });
  } catch (err) {
    console.error(JSON.stringify({ event: 'wishlist_get_error', err: String(err) }));
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limit: 5 new wishes per IP per day
  const ip = getIp(request);
  const limit = await checkRateLimit(ip, {
    namespace: 'wishlist-submit',
    limit: 5,
    windowSeconds: 86400,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Try again tomorrow.' },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = newWishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const { title, description, category, authorName, authorEmail } = parsed.data;

  const [item] = await db
    .insert(wishlistItems)
    .values({
      title: title.trim(),
      description: description.trim(),
      category,
      authorName: authorName?.trim() || null,
      authorEmail: authorEmail || null,
      updatedAt: new Date(),
    })
    .returning();

  if (!item) {
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }

  // Send confirmation email (fire and forget)
  if (authorEmail) {
    void sendEmail({
      to: authorEmail,
      subject: 'Your OathMesh feature request was received',
      react: React.createElement(WishlistSubmittedEmail, {
        name: authorName,
        title,
        description,
      }),
    });
  }

  return NextResponse.json({ item }, { status: 201 });
}
