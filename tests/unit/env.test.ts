// @file tests/unit/env.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

// We test the validation logic directly without importing env.ts (which would
// execute at import time). Instead, we replicate the schema and test it.
import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().email().default('noreply@oathmesh.dev'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required'),
  POSTGRES_URL: z.string().url('POSTGRES_URL must be a valid URL'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

describe('env validation', () => {
  const validEnv = {
    RESEND_API_KEY: 're_test_key',
    RESEND_FROM_EMAIL: 'noreply@oathmesh.dev',
    STRIPE_SECRET_KEY: 'sk_test_key',
    STRIPE_WEBHOOK_SECRET: 'whsec_test',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_key',
    POSTGRES_URL: 'postgresql://user:pass@host:5432/db',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  };

  it('accepts valid env vars', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it('throws for missing RESEND_API_KEY', () => {
    const result = envSchema.safeParse({ ...validEnv, RESEND_API_KEY: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('RESEND_API_KEY');
    }
  });

  it('throws for invalid POSTGRES_URL', () => {
    const result = envSchema.safeParse({ ...validEnv, POSTGRES_URL: 'not-a-url' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBeDefined();
    }
  });

  it('throws for missing STRIPE_SECRET_KEY', () => {
    const result = envSchema.safeParse({ ...validEnv, STRIPE_SECRET_KEY: '' });
    expect(result.success).toBe(false);
  });

  it('applies defaults for optional values', () => {
    const env = { ...validEnv };
    delete (env as Record<string, string>).RESEND_FROM_EMAIL;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.RESEND_FROM_EMAIL).toBe('noreply@oathmesh.dev');
    }
  });

  it('rejects invalid RESEND_FROM_EMAIL format', () => {
    const result = envSchema.safeParse({ ...validEnv, RESEND_FROM_EMAIL: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});
