import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { SiteHeader } from "@/components/SiteHeader";
import { services } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {};
  }

  return pageMetadata({
    title: service.name,
    description: service.introduction,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <Link className="back-link" href="/#services">
          ← All services
        </Link>
        <section className="detail-hero">
          <div>
            <p className="eyebrow">{service.eyebrow}</p>
            <h1>{service.name}</h1>
          </div>
          <div className="detail-intro">
            <p>{service.introduction}</p>
            <a className="primary-button" href="#booking">
              Book this service <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </div>

      <section className="detail-gallery" aria-label={`${service.name} gallery`}>
        {service.images.map((image, index) => (
          <figure key={image}>
            <img
              src={image}
              alt={`${service.name} photography by Léonie Moreau — ${index + 1}`}
            />
          </figure>
        ))}
      </section>

      <section className="section service-inclusions">
        <div>
          <p className="eyebrow">What’s included</p>
          <h2>A considered experience, from first conversation to final gallery.</h2>
        </div>
        <ol>
          {service.details.map((detail, index) => (
            <li key={detail}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {detail}
            </li>
          ))}
        </ol>
      </section>

      <section className="section price-panel">
        <p className="eyebrow">Investment</p>
        <p className="price">{service.price}</p>
        <p>{service.priceNote}</p>
      </section>

      <div className="section detail-booking">
        <BookingForm
          defaultService={service.name}
          title={`Book ${service.name.toLowerCase()}.`}
          intro="Share the details below and I’ll come back to you with availability and a tailored quote."
        />
      </div>
    </main>
  );
}
