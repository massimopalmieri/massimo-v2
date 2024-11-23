import { data } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import { Resend } from "resend";
import {
  checkRateLimit,
  incrementRateLimit,
  validateEmail,
  verifyRecaptcha,
} from "./utils";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification failed"),
});

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return data(
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
    return data(
      { success: false, error: rateLimitCheck.error },
      { status: 429 }
    );
  }

  try {
    const formData = Object.fromEntries(await request.formData());
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      return data(
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
      return data({ error: "Spam detection triggered" }, { status: 400 });
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
      return data({ error: "Invalid email address" }, { status: 400 });
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

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return data(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 }
    );
  }
};
