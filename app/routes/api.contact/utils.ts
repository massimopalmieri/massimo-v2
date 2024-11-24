type EmailValidationResponse = {
  email: string;
  autocorrect: string;
  deliverability: string;
  quality_score: string;
  is_valid_format: Value;
  is_free_email: Value;
  is_disposable_email: Value;
  is_role_email: Value;
  is_catchall_email: Value;
  is_mx_found: Value;
  is_smtp_valid: Value;
};

type Value = {
  value: boolean;
  text: string;
};

type RecaptchaResponse = {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
};

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = {
  MAX_REQUESTS: 3, // Maximum 3 requests
  WINDOW: 3600000, // per hour (in milliseconds)
  BLOCK_DURATION: 3600000 * 24, // Block for 24 hours if exceeded
};

export function checkRateLimit(ip: string): {
  allowed: boolean;
  error?: string;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Allow all requests in test environment
  if (process.env.NODE_ENV === "development") {
    return { allowed: true };
  }

  // Clean up old records
  if (record && now - record.timestamp > RATE_LIMIT.WINDOW) {
    rateLimitStore.delete(ip);
    return { allowed: true };
  }

  // Check if blocked
  if (record && record.count >= RATE_LIMIT.MAX_REQUESTS) {
    const blockedFor = record.timestamp + RATE_LIMIT.BLOCK_DURATION - now;
    if (blockedFor > 0) {
      const hoursRemaining = Math.ceil(blockedFor / 3600000);
      return {
        allowed: false,
        error: `Too many requests. Please try again in ${hoursRemaining} hours.`,
      };
    }
    rateLimitStore.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function incrementRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
  } else {
    record.count += 1;
  }
}

export async function verifyRecaptcha(token: string) {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    }
  );

  const data = (await response.json()) as RecaptchaResponse;
  return data;
}

export async function validateEmail(email: string) {
  const response = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${
      process.env.ABSTRACT_API_KEY
    }&email=${encodeURIComponent(email)}`
  );

  const data = (await response.json()) as EmailValidationResponse;
  return data;
}
