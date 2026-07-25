"use client";

import { FormEvent, useState } from "react";
import { services } from "@/data/site";

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
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="booking-section" id="booking">
      <div className="booking-copy">
        <p className="eyebrow">Booking enquiry</p>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label>
            <span>Name</span>
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="your@email.com" required />
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
              <option value="Print order">Print order</option>
            </select>
          </label>
          <label>
            <span>Preferred date</span>
            <input name="date" type="text" placeholder="Date or timeframe" />
          </label>
        </div>
        <label>
          <span>Location</span>
          <input name="location" type="text" placeholder="Edinburgh, Paris or elsewhere" />
        </label>
        <label>
          <span>Tell me about your project</span>
          <textarea
            name="message"
            rows={5}
            placeholder="What are you planning? Include any timings, image usage or print details."
            required
          />
        </label>
        <button className="primary-button" type="submit">
          Send booking request <span aria-hidden="true">↗</span>
        </button>
        {submitted && (
          <p className="form-note" role="status">
            Your request is ready. Connect this form to your preferred inbox before publishing to receive enquiries.
          </p>
        )}
      </form>
    </section>
  );
}
