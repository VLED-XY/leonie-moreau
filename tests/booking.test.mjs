import assert from "node:assert/strict";
import { test } from "node:test";
import { handleBookingRequest } from "../src/lib/booking-handler.ts";
import { services, printEnquiryService } from "../src/data/site.ts";

const valid = {
  name: "Test visitor", email: "visitor@example.com", service: services[0].name,
  date: "Next month", location: "Paris", message: "A portrait session enquiry.",
  website: "", requestId: "a7682c1a-9123-4acf-8450-cbb0a2e61a24",
};
const limiter = { limit: async () => ({ success: true }) };
const env = {
  RESEND_API_KEY: "test-key", BOOKING_FROM_EMAIL: "Website <form@example.com>",
  BOOKING_TO_EMAIL: "owner@example.com", BOOKING_RATE_LIMITER: limiter,
  BOOKING_GLOBAL_LIMITER: limiter,
};
function request(body = valid, headers = {}) {
  return new Request("https://portfolio.example/api/booking", {
    method: "POST", headers: { origin: "https://portfolio.example", "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
const mustNotSend = async () => { assert.fail("Invalid requests must never send email"); };

test("sends plain text only to the configured inbox, with visitor reply-to and stable idempotency", async () => {
  const calls = [];
  const send = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return Response.json({ id: "email-id" });
  };
  const data = { ...valid, to: "attacker@example.com", from: "attacker@example.com", message: "<script>alert(1)</script>" };
  const result = await handleBookingRequest(request(data), env, send);
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { success: true });
  assert.equal(result.headers.get("cache-control"), "no-store");
  await handleBookingRequest(request(data), env, send);
  assert.deepEqual(calls[0].body.to, [env.BOOKING_TO_EMAIL]);
  assert.equal(calls[0].body.from, env.BOOKING_FROM_EMAIL);
  assert.equal(calls[0].body.reply_to, valid.email);
  assert.equal(calls[0].body.html, undefined);
  assert.match(calls[0].body.text, /<script>/);
  assert.equal(calls[0].init.headers["Idempotency-Key"], calls[1].init.headers["Idempotency-Key"]);
});

test("rejects malformed fields, invalid services and header injection", async () => {
  for (const patch of [{ email: "bad" }, { email: "a@b.com\r\nBcc: x@y.com" }, { name: "\n" },
    { name: "a\nb" }, { service: "unknown" }, { message: " " }, { message: "x".repeat(5001) },
    { location: {} }, { date: false }, { requestId: "arbitrary" }]) {
    assert.equal((await handleBookingRequest(request({ ...valid, ...patch }), env, mustNotSend)).status, 400);
  }
});

test("rejects cross-site posts, incorrect media types, invalid JSON and oversized bodies", async () => {
  assert.equal((await handleBookingRequest(request(valid, { origin: "https://other.example" }), env, mustNotSend)).status, 403);
  assert.equal((await handleBookingRequest(request(valid, { "content-type": "text/plain" }), env, mustNotSend)).status, 415);
  assert.equal((await handleBookingRequest(request({ ...valid, message: "x".repeat(17000) }), env, mustNotSend)).status, 413);
  const malformed = new Request("https://portfolio.example/api/booking", {
    method: "POST", headers: { origin: "https://portfolio.example", "content-type": "application/json" }, body: "{",
  });
  assert.equal((await handleBookingRequest(malformed, env, mustNotSend)).status, 400);
  assert.equal((await handleBookingRequest(new Request("https://portfolio.example/api/booking"), env, mustNotSend)).status, 405);
});

test("silently discards honeypot submissions", async () => {
  assert.equal((await handleBookingRequest(request({ ...valid, website: "spam.example" }), env, mustNotSend)).status, 200);
});

test("fails closed if credentials or abuse protection are missing", async () => {
  for (const key of ["RESEND_API_KEY", "BOOKING_FROM_EMAIL", "BOOKING_TO_EMAIL", "BOOKING_RATE_LIMITER", "BOOKING_GLOBAL_LIMITER"]) {
    assert.equal((await handleBookingRequest(request(), { ...env, [key]: undefined }, mustNotSend)).status, 503);
  }
});

test("limits both individual visitors and overall traffic", async () => {
  for (const key of ["BOOKING_RATE_LIMITER", "BOOKING_GLOBAL_LIMITER"]) {
    const response = await handleBookingRequest(request(), {
      ...env, [key]: { limit: async () => ({ success: false }) },
    }, mustNotSend);
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "60");
  }
});

test("never reports success on provider rejection, malformed success or network failure", async () => {
  for (const send of [async () => Response.json({ error: "private details" }, { status: 403 }),
    async () => Response.json({}), async () => { throw new Error("secret failure"); }]) {
    const response = await handleBookingRequest(request(), env, send);
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /private details|secret failure/);
  }
});

test("accepts print enquiries and absent optional fields", async () => {
  const data = { ...valid, service: printEnquiryService };
  delete data.date;
  delete data.location;
  assert.equal((await handleBookingRequest(request(data), env, async () => Response.json({ id: "print-id" }))).status, 200);
});
