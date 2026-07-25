import Link from "next/link";
import { services } from "@/data/site";

export function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="section-label">
        <span>02</span>
        <i />
        <span>Services</span>
      </div>

      <div className="service-list">
        {services.map((service, index) => (
          <Link
            className="service-row"
            href={`/services/${service.slug}`}
            key={service.slug}
          >
            <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="service-name">{service.name}</span>
            <span className="service-description">{service.shortDescription}</span>
            <span className="service-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
