"use client";

import { FormEvent, useRef, useState } from "react";
import { printEnquiryService, services } from "@/data/site";

type BookingFormProps = {
  defaultService?: string;
  title?: string;
  intro?: string;
};

export function BookingForm({
  defaultService = "",
  title = "Let’s work together.",
  intro = "Tell me about your project and I’ll get back to you within 48 hours.",
}: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const pending = useRef(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const payload = JSON.stringify(values);
    if (attempt.current?.payload !== payload) {
      attempt.current = { payload, id: crypto.randomUUID() };
    }
    pending.current = true;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestId: attempt.current.id }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(typeof result.error === "string" ? result.error : "Your request could not be sent. Please try again.");
      }
      form.reset();
      attempt.current = null;
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error && cause.name === "Error"
        ? cause.message
        : "Your request could not be sent. Please check your connection and try again.");
      setStatus("error");
    } finally {
      pending.current = false;
    }
  }

  return (
    <section className="booking-section" id="booking">
      <div className="booking-copy">
        <p className="eyebrow">Booking enquiry</p>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit} aria-busy={status === "sending"}>
        <label className="booking-honeypot" aria-hidden="true">
          Website
          <input name="website" type="text" autoComplete="off" tabIndex={-1} />
        </label>
        <div className="field-grid">
          <label>
            <span>Name</span>
            <input name="name" type="text" placeholder="Your name" autoComplete="name" maxLength={100} required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="your@email.com" autoComplete="email" maxLength={254} required />
          </label>
        </div>
        <div className="field-grid">
          <label>
            <span>Service</span>
            <select name="service" defaultValue={defaultService} required>
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service) => (
                <option key={service.slug} value={service.name}>
                  {service.name}
                </option>
              ))}
              <option value={printEnquiryService}>{printEnquiryService}</option>
            </select>
          </label>
          <label>
            <span>Preferred date</span>
            <input name="date" type="text" placeholder="Date or timeframe" maxLength={150} />
          </label>
        </div>
        <label>
          <span>Location</span>
          <input name="location" type="text" placeholder="Edinburgh, Paris or elsewhere" maxLength={200} />
        </label>
        <label>
          <span>Tell me about your project</span>
          <textarea
            name="message"
            rows={5}
            maxLength={5000}
            placeholder="What are you planning? Include any timings, image usage or print details."
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send booking request"} <span aria-hidden="true">↗</span>
        </button>
        <p className={`form-note${status === "error" ? " form-error" : ""}`} role="status" aria-live="polite" aria-atomic="true">
          {status === "success" && "Thank you! Your request has been sent. I’ll get back to you within 48 hours."}
          {status === "error" && error}
        </p>
      </form>
    </section>
  );
}
