// @file lib/rate-limit.ts
/**
 * Sliding-window rate limiter.
 * Primary store: Vercel KV (redis) when KV_REST_API_URL is set.
 * Fallback: in-memory LRU cache (resets on cold start — fine for local dev).
 */
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  /** Unique key for this limiter (e.g. "subscribe", "vote") */
  namespace: string;
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix epoch (seconds)
}

// ---------- In-memory fallback ----------
type CacheEntry = { count: number; resetAt: number };
const memCache = new LRUCache<string, CacheEntry>({ max: 10_000 });

function memoryCheck(
  key: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Math.floor(Date.now() / 1000);
  const entry = memCache.get(key);

  if (!entry || entry.resetAt <= now) {
    memCache.set(key, { count: 1, resetAt: now + windowSeconds });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowSeconds };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  memCache.set(key, entry);
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

// ---------- KV store ----------
let kv: { get: (k: string) => Promise<number | null>; set: (k: string, v: number, opts: { ex: number }) => Promise<void>; incr: (k: string) => Promise<number> } | null = null;

async function getKv() {
  if (kv) return kv;
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    const { kv: vercelKv } = await import('@vercel/kv');
    kv = vercelKv as unknown as typeof kv;
    return kv;
  } catch {
    return null;
  }
}

async function kvCheck(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const store = await getKv();
  if (!store) {
    return memoryCheck(key, limit, windowSeconds);
  }

  const now = Math.floor(Date.now() / 1000);
  const current = await store.incr(key);
  if (current === 1) {
    // New key — set TTL
    await store.set(key, 1, { ex: windowSeconds });
  }

  const resetAt = now + windowSeconds;
  if (current > limit) {
    return { allowed: false, remaining: 0, resetAt };
  }
  return { allowed: true, remaining: limit - current, resetAt };
}

// ---------- Public API ----------

/**
 * Check if an identifier (IP, fingerprint, etc.) is within the rate limit.
 * Uses Vercel KV when available, in-memory LRU as fallback.
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const key = `rl:${options.namespace}:${identifier}`;
  return kvCheck(key, options.limit, options.windowSeconds);
}

/**
 * Helper: extract a best-effort IP from a Next.js Request.
 */
export function getIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}
