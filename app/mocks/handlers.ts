import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      firstName: "John",
    });
  }),
  http.get("https://emailvalidation.abstractapi.com/v1/", ({ request }) => {
    const { searchParams } = new URL(request.url);

    return HttpResponse.json({
      email: searchParams.get("email"),
      is_valid_format: { value: true },
      is_disposable_email: { value: false },
      is_catchall_email: { value: false },
      quality_score: 0.8,
    });
  }),
  http.post(
    "https://www.google.com/recaptcha/api/siteverify",
    async ({ request }) => {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const response = params.get("response");

      return HttpResponse.json({
        success: true,
        score: response === "valid" ? 0.9 : 0.9,
        // action: "submit",
        // challenge_ts: new Date().toISOString(),
        // hostname: "localhost",
      });
    }
  ),
  http.post("https://api.resend.com/emails", () => {
    return HttpResponse.json({
      data: { id: 1 },
      error: null,
    });
  }),
];
