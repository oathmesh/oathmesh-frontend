// @file lib/resend.ts
import type React from 'react';
import { Resend } from 'resend';

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@oathmesh.dev';
export const REPLY_TO = process.env.RESEND_REPLY_TO ?? 'team@oathmesh.dev';
export const TEAM_EMAIL = 'team@oathmesh.dev';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}

/**
 * Send a React Email template via Resend.
 * Returns null on success, error message string on failure.
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ error: string | null }> {
  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      react: options.react,
      replyTo: options.replyTo ?? REPLY_TO,
    });
    if (error) {
      console.error(JSON.stringify({ event: 'resend_error', error }));
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ event: 'resend_exception', message }));
    return { error: message };
  }
}

/**
 * Add a contact to a Resend audience list.
 */
export async function addToAudience(email: string, firstName?: string): Promise<void> {
  try {
    const resend = getResend();
    // The audience ID would be stored as an env var in production
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) return;
    await resend.contacts.create({
      email,
      firstName,
      audienceId,
      unsubscribed: false,
    });
  } catch (err) {
    console.error(JSON.stringify({ event: 'resend_audience_error', err: String(err) }));
  }
}
