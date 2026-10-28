import { printEnquiryService, services } from "../data/site.ts";

type RateLimiter = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

export type BookingEnv = {
  RESEND_API_KEY?: string;
  BOOKING_FROM_EMAIL?: string;
  BOOKING_TO_EMAIL?: string;
  BOOKING_RATE_LIMITER?: RateLimiter;
  BOOKING_GLOBAL_LIMITER?: RateLimiter;
};

const MAX_BODY_BYTES = 16_384;
const failureMessage = "Your request could not be sent. Please try again in a moment.";

function json(status: number, body: object, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    throw new RangeError("Body too large");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("Body too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } finally {
    reader.releaseLock();
  }
}

export async function handleBookingRequest(
  request: Request,
  env: BookingEnv,
  send: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed." }, { Allow: "POST" });
  }
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json(403, { error: "Please send your request from the website." });
  }
  if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return json(415, { error: "Please use the booking form." });
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return json(error instanceof RangeError ? 413 : 400, { error: "Please check your request." });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json(400, { error: "Please check your request." });
  }
  const data = body as Record<string, unknown>;
  if (typeof data.website === "string" && data.website.trim()) {
    return json(200, { success: true });
  }
  const field = (name: string, max: number, required = false) => {
    const raw = data[name];
    if (raw === undefined && !required) return "";
    if (typeof raw !== "string" || raw.length > max) return null;
    const value = raw.trim();
    if ((required && !value) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return null;
    return value;
  };
  const name = field("name", 100, true);
  const email = field("email", 254, true);
  const service = field("service", 100, true);
  const date = field("date", 150);
  const location = field("location", 200);
  const message = field("message", 5000, true);
  const requestId = field("requestId", 36, true);
  if (
    !name || /[\r\n]/.test(name) ||
    !email || !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(email) ||
    !service || ![...services.map((item) => item.name), printEnquiryService].includes(service) ||
    date === null || location === null || !message ||
    !requestId || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)
  ) {
    return json(400, { error: "Please check your name, email, service and message." });
  }

  if (!env.RESEND_API_KEY || !env.BOOKING_FROM_EMAIL || !env.BOOKING_TO_EMAIL ||
      !env.BOOKING_RATE_LIMITER || !env.BOOKING_GLOBAL_LIMITER) {
    console.error("Booking delivery is not configured.");
    return json(503, { error: failureMessage });
  }

  try {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const perVisitor = await env.BOOKING_RATE_LIMITER.limit({ key: ip });
    const global = perVisitor.success && await env.BOOKING_GLOBAL_LIMITER.limit({ key: "booking" });
    if (!global || !global.success) {
      return json(429, { error: "Too many requests. Please wait a minute and try again." }, { "Retry-After": "60" });
    }
    // A stable key makes retries safe if Resend accepted a timed-out request.
    const response = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `booking/${requestId}`,
      },
      body: JSON.stringify({
        from: env.BOOKING_FROM_EMAIL,
        to: [env.BOOKING_TO_EMAIL],
        reply_to: email,
        subject: `Booking enquiry — ${service}`,
        text: [
          "New booking enquiry", "",
          `Name: ${name}`, `Email: ${email}`, `Service: ${service}`,
          `Preferred date: ${date || "Not specified"}`,
          `Location: ${location || "Not specified"}`, "Message:", message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      console.error("Booking delivery rejected by provider:", response.status);
      return json(502, { error: failureMessage });
    }
    const result = await response.json() as { id?: unknown };
    if (typeof result.id !== "string" || !result.id) {
      return json(502, { error: failureMessage });
    }
    return json(200, { success: true });
  } catch {
    console.error("Booking delivery unavailable.");
    return json(502, { error: failureMessage });
  }
}
