// @file lib/stripe.ts
import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }
  return _stripe;
}

export interface CreateCheckoutOptions {
  amountCents: number;
  currency?: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  showOnWall?: boolean;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe Checkout Session for a one-time donation.
 */
export async function createDonationCheckout(
  opts: CreateCheckoutOptions,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: opts.currency ?? 'usd',
          product_data: {
            name: 'OathMesh Donation',
            description: 'Support open-source machine identity security',
          },
          unit_amount: opts.amountCents,
        },
        quantity: 1,
      },
    ],
    customer_email: opts.donorEmail,
    metadata: {
      donorName: opts.donorName ?? '',
      message: opts.message ?? '',
      showOnWall: opts.showOnWall ? 'true' : 'false',
    },
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
  });

  return session;
}

/**
 * Verify a Stripe webhook signature and return the event.
 * Throws if the signature is invalid.
 */
export function verifyStripeWebhook(
  body: string,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  return stripe.webhooks.constructEvent(body, signature, secret);
}
