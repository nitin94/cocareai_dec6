import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '../../services/cliniko/utils/rateLimiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      maxRequests: 150,
      timeWindow: 60000 // 1 minute in milliseconds
    });
    vi.useFakeTimers();
  });

  it('should allow requests within rate limit', async () => {
    for (let i = 0; i < 150; i++) {
      expect(await rateLimiter.canMakeRequest()).toBe(true);
    }
  });

  it('should block requests over rate limit', async () => {
    for (let i = 0; i < 150; i++) {
      await rateLimiter.canMakeRequest();
    }
    expect(await rateLimiter.canMakeRequest()).toBe(false);
  });

  it('should reset after time window', async () => {
    for (let i = 0; i < 150; i++) {
      await rateLimiter.canMakeRequest();
    }
    expect(await rateLimiter.canMakeRequest()).toBe(false);

    // Advance time by 1 minute
    vi.advanceTimersByTime(60000);
    expect(await rateLimiter.canMakeRequest()).toBe(true);
  });
});