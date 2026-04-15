// @file app/api/health/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();
  const version = process.env.npm_package_version ?? '0.0.0';

  // Lightweight DB ping
  let dbStatus: 'ok' | 'error' = 'error';
  try {
    const { sql } = await import('@vercel/postgres');
    await sql`SELECT 1`;
    dbStatus = 'ok';
  } catch {
    dbStatus = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    version,
    db: dbStatus,
    timestamp,
  });
}
