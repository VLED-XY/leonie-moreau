import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { SiteHeader } from "@/components/SiteHeader";
import { prints } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Prints",
  description:
    "Limited photographic prints by Léonie Moreau, produced to order on archival paper.",
  path: "/prints",
});

export default function PrintsPage() {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <Link className="back-link" href="/">
          ← Home
        </Link>
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Prints · Made to order</p>
            <h1>Photographs for your walls.</h1>
          </div>
          <div className="detail-intro">
            <p>
              A rotating collection of Léonie’s photographs, printed to order
              on archival fine-art paper. Choose your image and preferred size,
              then enquire for availability.
            </p>
            <a className="primary-button" href="#order">
              Order a print <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </div>

      <section className="print-grid" aria-label="Prints available to order">
        {prints.map((print, index) => (
          <article className="print-card" key={print.title}>
            <div className="print-image">
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image is deferred pending a Cloudflare Images decision; see docs/superpowers/specs/2026-07-27-remediation-audit-design.md */}
              <img
                src={print.image}
                alt={`${print.title} photographic print`}
                width={1200}
                height={1500}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </div>
            <div className="print-meta">
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{print.title}</h2>
              </div>
              <p>{print.price}</p>
            </div>
            <a className="text-link" href="#order">
              Enquire about this print
            </a>
          </article>
        ))}
      </section>

      <section className="section print-info">
        <div>
          <p className="eyebrow">Made for you</p>
          <h2>Printed on request.</h2>
        </div>
        <div>
          <p>
            Available in 20 × 30 cm, 30 × 45 cm and 40 × 60 cm. Larger sizes
            can be quoted on request.
          </p>
          <p>
            Every print is produced after ordering, carefully checked and sent
            unframed. Framing recommendations are available for Edinburgh and
            Paris.
          </p>
        </div>
      </section>

      <div className="section detail-booking" id="order">
        <BookingForm
          defaultService="Print order"
          title="Order a print."
          intro="Tell me which photograph and size you would like. I’ll confirm availability, production time and delivery."
        />
      </div>
    </main>
  );
}
