import type { MetadataRoute } from "next";
import { services } from "@/data/site";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/prints`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/legal/privacy`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
