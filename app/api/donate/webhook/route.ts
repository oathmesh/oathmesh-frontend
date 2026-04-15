// @file app/api/donate/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { donations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyStripeWebhook } from '@/lib/stripe';
import { sendEmail } from '@/lib/resend';
import DonationReceiptEmail from '@/emails/donation-receipt';
import React from 'react';
import { formatCurrency } from '@/lib/utils';

// Required by vercel.json maxDuration = 30
export const maxDuration = 30;

// Stripe requires the raw body for signature verification
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event;
  try {
    event = verifyStripeWebhook(body, signature);
  } catch (err) {
    console.error(JSON.stringify({ event: 'webhook_signature_error', err: String(err) }));
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Return 200 immediately — process async
  const responsePromise = NextResponse.json({ received: true });

  // Handle events asynchronously
  void (async () => {
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as {
          id: string;
          payment_intent?: string;
          customer_email?: string | null;
          metadata?: Record<string, string>;
          amount_total?: number | null;
        };

        const [donation] = await db
          .update(donations)
          .set({
            status: 'completed',
            stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            completedAt: new Date(),
          })
          .where(eq(donations.stripeSessionId, session.id))
          .returning();

        // Send receipt email
        if (donation?.donorEmail) {
          await sendEmail({
            to: donation.donorEmail,
            subject: 'Thank you for supporting OathMesh — receipt inside',
            react: React.createElement(DonationReceiptEmail, {
              donorName: donation.donorName ?? 'Friend',
              amountFormatted: formatCurrency(donation.amountCents),
              stripeSessionId: session.id,
              paymentIntentId: donation.stripePaymentIntentId ?? '',
              showOnWall: donation.showOnWall,
            }),
          });
        }
      }

      if (event.type === 'payment_intent.payment_failed') {
        const pi = event.data.object as { id: string };
        await db
          .update(donations)
          .set({ status: 'failed' })
          .where(eq(donations.stripePaymentIntentId, pi.id));
      }
    } catch (err) {
      console.error(JSON.stringify({ event: 'webhook_processing_error', err: String(err), type: event.type }));
    }
  })();

  return responsePromise;
}
