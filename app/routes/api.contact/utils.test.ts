import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  checkRateLimit,
  incrementRateLimit,
  verifyRecaptcha,
  validateEmail,
} from "./utils";

describe("Rate Limiting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("allows initial requests", () => {
    const result = checkRateLimit("127.0.0.1");
    expect(result.allowed).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("blocks after exceeding limit", () => {
    const ip = "127.0.0.1";

    // Make max allowed requests
    for (let i = 0; i < 3; i++) {
      incrementRateLimit(ip);
    }

    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain("Too many requests");
  });

  test("resets after time window", () => {
    const ip = "127.0.0.1";
    incrementRateLimit(ip);
    incrementRateLimit(ip);
    incrementRateLimit(ip);

    expect(checkRateLimit(ip).allowed).toBe(false);

    // Advance time past the rate limit window
    vi.advanceTimersByTime(3600000 + 1000);

    expect(checkRateLimit(ip).allowed).toBe(true);
  });

  test("always allows requests in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const ip = "127.0.0.1";
    
    for (let i = 0; i < 10; i++) {
      incrementRateLimit(ip);
      const result = checkRateLimit(ip);
      expect(result.allowed).toBe(true);
    }

    process.env.NODE_ENV = originalEnv;
  });
});

describe('verifyRecaptcha', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('verifies valid token successfully', async () => {
    const mockResponse = {
      success: true,
      score: 0.9,
      action: 'submit',
      challenge_ts: '2024-03-19T12:00:00Z',
      hostname: 'yoursite.com'
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    });

    const result = await verifyRecaptcha('valid-token');
    expect(result.success).toBe(true);
    expect(result.score).toBe(0.9);
  });

  test('handles invalid token', async () => {
    const mockResponse = {
      success: false,
      'error-codes': ['invalid-input-response']
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    });

    const result = await verifyRecaptcha('invalid-token');
    expect(result.success).toBe(false);
  });

  test('handles network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(verifyRecaptcha('token')).rejects.toThrow('Network error');
  });
});

describe('validateEmail', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('validates legitimate email successfully', async () => {
    const mockResponse = {
      email: 'test@example.com',
      deliverability: 'DELIVERABLE',
      quality_score: '0.8',
      is_valid_format: { value: true },
      is_disposable_email: { value: false },
      is_smtp_valid: { value: true }
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    });

    const result = await validateEmail('test@example.com');
    expect(result.deliverability).toBe('DELIVERABLE');
    expect(result.is_valid_format.value).toBe(true);
  });

  test('handles invalid email format', async () => {
    const mockResponse = {
      email: 'invalid-email',
      deliverability: 'UNDELIVERABLE',
      quality_score: '0.0',
      is_valid_format: { value: false },
      is_disposable_email: { value: false },
      is_smtp_valid: { value: false }
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    });

    const result = await validateEmail('invalid-email');
    expect(result.deliverability).toBe('UNDELIVERABLE');
    expect(result.is_valid_format.value).toBe(false);
  });

  test('handles API error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('API error'));

    await expect(validateEmail('test@example.com')).rejects.toThrow('API error');
  });
});
