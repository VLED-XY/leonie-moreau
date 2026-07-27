import { services } from "@/data/site";
import { SITE_URL } from "@/lib/site-url";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/metadata";

/**
 * schema.org graph describing the photographer, the business and each service.
 *
 * Generated from src/data/site.ts, so adding a service keeps the structured
 * data correct without a second edit.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        jobTitle: "Photographer",
        url: SITE_URL,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: `${SITE_NAME} Photography`,
        description: DEFAULT_DESCRIPTION,
        url: SITE_URL,
        image: `${SITE_URL}/og.png`,
        founder: { "@id": `${SITE_URL}/#person` },
        areaServed: [
          { "@type": "City", name: "Edinburgh" },
          { "@type": "City", name: "Paris" },
        ],
      },
      ...services.map((service) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/services/${service.slug}#service`,
        name: service.name,
        description: service.shortDescription,
        url: `${SITE_URL}/services/${service.slug}`,
        provider: { "@id": `${SITE_URL}/#business` },
        offers: {
          "@type": "Offer",
          price: service.priceFrom,
          priceCurrency: "GBP",
          url: `${SITE_URL}/services/${service.slug}`,
        },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escaping `<` prevents a `</script>` sequence in the data from closing
      // the tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
