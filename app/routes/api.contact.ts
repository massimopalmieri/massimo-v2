import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Production Improvements Needed:
 *
 * 1. Replace in-memory Map with Redis or similar:
 *    - Current implementation loses data on server restart
 *    - Memory leaks possible with large number of IPs
 *    - Not suitable for multiple server instances
 *
 * 2. Use a rate-limiting service/middleware:
 *    - Consider using Upstash, Redis Enterprise, or similar
 *    - Look into packages like rate-limiter-flexible
 *    - Implement retry-after headers properly
 *
 * 3. Improve IP detection:
 *    - Handle proxy chains properly
 *    - Consider using CF-Connecting-IP if behind Cloudflare
 *    - Validate and sanitize IP addresses
 *
 * 4. Add graduated rate limits:
 *    - 3 requests per hour
 *    - 10 requests per day
 *    - 30 requests per week
 *    - Different limits for verified users
 *
 * 5. Add monitoring and security:
 *    - Log rate limit hits for monitoring
 *    - Add alerts for abuse patterns
 *    - Consider adding CAPTCHA for repeated attempts
 *    - Implement IP allowlist/blocklist
 */

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT = {
  MAX_REQUESTS: 3, // Maximum 3 requests
  WINDOW: 3600000, // per hour (in milliseconds)
  BLOCK_DURATION: 3600000 * 24, // Block for 24 hours if exceeded
};

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

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

function incrementRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
  } else {
    record.count += 1;
  }
}

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
}

interface EmailValidationResponse {
  email: string;
  autocorrect: string;
  deliverability: string;
  quality_score: string;
  is_disposable_email: { value: boolean };
  is_role_email: { value: boolean };
  is_catchall_email: { value: boolean };
  is_free_email: { value: boolean };
  is_valid_format: { value: boolean };
}

async function verifyRecaptcha(token: string) {
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

async function validateEmail(email: string) {
  const response = await fetch(
    `https://emailvalidation.abstractapi.com/v1/?api_key=${
      process.env.ABSTRACT_API_KEY
    }&email=${encodeURIComponent(email)}`
  );

  const data = (await response.json()) as EmailValidationResponse;
  return data;
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification failed"),
});

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  // Get IP address from request headers
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  const rateLimitCheck = checkRateLimit(ip);
  if (!rateLimitCheck.allowed) {
    return json(
      { success: false, error: rateLimitCheck.error },
      { status: 429 }
    );
  }

  try {
    const formData = Object.fromEntries(await request.formData());
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      return json(
        {
          success: false,
          error: result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", "),
        },
        { status: 400 }
      );
    }
    const { recaptchaToken, email, name, message } = result.data;

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return json({ error: "Spam detection triggered" }, { status: 400 });
    }

    // Validate email
    const emailValidation = await validateEmail(email);
    console.error("Email validation:", emailValidation);

    if (
      !emailValidation.is_valid_format.value ||
      emailValidation.is_disposable_email.value ||
      emailValidation.is_catchall_email.value ||
      Number(emailValidation.quality_score) < 0.7
    ) {
      return json({ error: "Invalid email address" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "massimopalmieri@gmail.com",
      subject: `New Contact Form Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Email Quality Score: ${emailValidation.quality_score}
reCAPTCHA Score: ${recaptchaResult.score}

Message:
${message}
      `,
    });

    // Increment rate limit counter after successful submission
    incrementRateLimit(ip);

    return json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return json(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 }
    );
  }
};
