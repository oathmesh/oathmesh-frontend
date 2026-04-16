// @file lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Resend
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().email().default('noreply@oathmesh.dev'),
  RESEND_REPLY_TO: z.string().email().default('team@oathmesh.dev'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required'),
  STRIPE_DONATION_PRICE_ID: z.string().optional(),

  // Database
  POSTGRES_URL: z.string().url('POSTGRES_URL must be a valid URL'),
  POSTGRES_URL_NON_POOLING: z.string().url().optional(),

  // KV (optional — falls back to in-memory)
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_GITHUB_URL: z.string().url().default('https://github.com/oathmesh/oathmesh'),

  // Analytics (optional)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  ✗ ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `\n\n❌ Invalid environment variables:\n${formatted}\n\nCheck .env.local.example for required values.\n`,
    );
  }
  return parsed.data;
}

// Only validate on the server side
const env: Env = typeof window === 'undefined' ? validateEnv() : (process.env as unknown as Env);

export { env };
export type { Env };
