// @file app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { sendEmail, TEAM_EMAIL } from '@/lib/resend';
import { checkRateLimit, getIp } from '@/lib/rate-limit';
import ContactReplyEmail from '@/emails/contact-reply';
import React from 'react';

const bodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message too short').max(2000, 'Message max 2000 chars'),
});

export async function POST(request: NextRequest) {
  // Rate limit: 2 requests per IP per hour
  const ip = getIp(request);
  const limit = await checkRateLimit(ip, {
    namespace: 'contact',
    limit: 2,
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

  const { name, email, subject, message } = parsed.data;

  // Save to database
  try {
    await db.insert(contactMessages).values({ name, email, subject, message });
  } catch (err) {
    console.error(JSON.stringify({ event: 'contact_db_error', err: String(err) }));
    // Non-fatal: still send emails even if DB write fails
  }

  // Send notification to team + auto-reply to submitter (fire and forget)
  void Promise.allSettled([
    sendEmail({
      to: TEAM_EMAIL,
      subject: `New contact: ${subject}`,
      react: React.createElement('div', {}, [
        React.createElement('p', { key: 'from' }, `From: ${name} <${email}>`),
        React.createElement('p', { key: 'subject' }, `Subject: ${subject}`),
        React.createElement('p', { key: 'msg' }, message),
      ]),
    }),
    sendEmail({
      to: email,
      subject: 'We got your message — OathMesh team',
      react: React.createElement(ContactReplyEmail, { name, subject, message }),
    }),
  ]).catch((err) => {
    console.error(JSON.stringify({ event: 'contact_email_error', err: String(err) }));
  });

  return NextResponse.json({ success: true });
}
