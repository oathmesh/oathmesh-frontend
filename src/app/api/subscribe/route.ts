import { db } from '@/db';
import { subscribers } from '@/db/schema';
import WelcomeEmail from '@/emails/welcome';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import { addToAudience, sendEmail } from '@/lib/resend';
// @file app/api/subscribe/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('landing'),
});

export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per IP per hour
  const ip = getIp(request);
  const limit = await checkRateLimit(ip, {
    namespace: 'subscribe',
    limit: 3,
    windowSeconds: 3600,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const { email, source } = parsed.data;

  // Insert into DB (ignore duplicate)
  try {
    await db.insert(subscribers).values({ email, source }).onConflictDoNothing();
  } catch (err) {
    console.error(JSON.stringify({ event: 'subscribe_db_error', err: String(err), email }));
  }

  // Add to Resend audience + send welcome email (fire and forget)
  void Promise.allSettled([
    addToAudience(email),
    sendEmail({
      to: email,
      subject: 'Welcome to the OathMesh community',
      react: React.createElement(WelcomeEmail, { email }),
    }),
  ]).catch((err) => {
    console.error(JSON.stringify({ event: 'subscribe_email_error', err: String(err) }));
  });

  return NextResponse.json({ success: true });
}
