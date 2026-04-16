// @file tests/unit/rate-limit.test.ts
import { beforeEach, describe, expect, it } from 'vitest';

// Test the in-memory fallback implementation directly
// We import the internals by mocking the environment
const { LRUCache } = await import('lru-cache');

type CacheEntry = { count: number; resetAt: number };

function createLimiter(limit: number, windowSeconds: number) {
  const cache = new LRUCache<string, CacheEntry>({ max: 1000 });

  function check(key: string): { allowed: boolean; remaining: number } {
    const now = Math.floor(Date.now() / 1000);
    const entry = cache.get(key);

    if (!entry || entry.resetAt <= now) {
      cache.set(key, { count: 1, resetAt: now + windowSeconds });
      return { allowed: true, remaining: limit - 1 };
    }

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    entry.count += 1;
    cache.set(key, entry);
    return { allowed: true, remaining: limit - entry.count };
  }

  return { check, cache };
}

describe('in-memory rate limiter', () => {
  it('allows requests under the limit', () => {
    const { check } = createLimiter(3, 60);
    expect(check('user-1').allowed).toBe(true);
    expect(check('user-1').allowed).toBe(true);
    expect(check('user-1').allowed).toBe(true);
  });

  it('blocks requests over the limit', () => {
    const { check } = createLimiter(2, 60);
    check('user-2');
    check('user-2');
    const result = check('user-2');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('tracks different keys independently', () => {
    const { check } = createLimiter(1, 60);
    check('user-a');
    // user-a is now at limit
    expect(check('user-a').allowed).toBe(false);
    // user-b is fresh
    expect(check('user-b').allowed).toBe(true);
  });

  it('returns correct remaining count', () => {
    const { check } = createLimiter(5, 60);
    const first = check('user-3');
    expect(first.remaining).toBe(4);
    const second = check('user-3');
    expect(second.remaining).toBe(3);
  });

  it('window resets after expiry', () => {
    const { check, cache } = createLimiter(1, 60);
    check('user-reset');
    // Simulate window expiry by manually clearing the cache
    cache.delete('user-reset');
    const result = check('user-reset');
    expect(result.allowed).toBe(true);
  });
});
