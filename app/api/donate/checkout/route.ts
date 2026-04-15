// @file app/api/donate/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { donations } from '@/db/schema';
import { createDonationCheckout } from '@/lib/stripe';

const bodySchema = z.object({
  amountCents: z
    .number()
    .int()
    .min(100, 'Minimum donation is $1.00')
    .max(1_000_000, 'Maximum donation is $10,000.00'),
  donorName: z.string().max(120).optional(),
  donorEmail: z.string().email().optional().or(z.literal('')),
  message: z.string().max(280).optional(),
  showOnWall: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const { amountCents, donorName, donorEmail, message, showOnWall } = parsed.data;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const session = await createDonationCheckout({
      amountCents,
      donorName,
      donorEmail: donorEmail || undefined,
      message,
      showOnWall,
      successUrl: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/donate/cancel`,
    });

    // Create pending donation record
    await db.insert(donations).values({
      stripeSessionId: session.id,
      amountCents,
      currency: 'usd',
      donorName: donorName || null,
      donorEmail: donorEmail || null,
      showOnWall,
      message: message || null,
      status: 'pending',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(JSON.stringify({ event: 'checkout_error', err: String(err) }));
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
