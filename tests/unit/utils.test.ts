// @file tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn, formatDate, truncate, formatCurrency, slugify } from '../../lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('removes conflicting tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'not-included', 'included')).toBe('base included');
  });
});

describe('truncate', () => {
  it('does not truncate short strings', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates long strings', () => {
    const result = truncate('This is a long string', 10);
    expect(result.length).toBe(10);
    expect(result.endsWith('…')).toBe(true);
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('formatCurrency', () => {
  it('converts cents to dollar string', () => {
    expect(formatCurrency(500)).toBe('$5.00');
    expect(formatCurrency(2000)).toBe('$20.00');
    expect(formatCurrency(10000)).toBe('$100.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Rust SDK!')).toBe('rust-sdk');
  });

  it('collapses multiple dashes', () => {
    expect(slugify('a  b')).toBe('a-b');
  });
});

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2025-01-15');
    expect(result).toContain('January');
    expect(result).toContain('2025');
  });
});
