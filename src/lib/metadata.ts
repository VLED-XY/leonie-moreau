import type { Metadata } from "next";

export const SITE_NAME = "Léonie Moreau";
export const DEFAULT_TITLE =
  "Léonie Moreau | Photographer in Edinburgh & Paris";
export const DEFAULT_DESCRIPTION =
  "Editorial photography for weddings, brands and culture in Edinburgh, Paris and beyond.";

const OG_IMAGE = {
  url: "/og.png",
  width: 1734,
  height: 907,
  alt: "Léonie Moreau — Photographer",
};

type PageMetadataInput = {
  /** Page title without the site suffix. Omit on the home page. */
  title?: string;
  description: string;
  /** Root-relative path, e.g. "/prints". Resolved against metadataBase. */
  path: string;
};

/**
 * Builds the metadata for one page.
 *
 * Next merges metadata shallowly: a page that declares `openGraph` replaces
 * the layout's entirely rather than extending it. Building the complete object
 * here avoids repeating every Open Graph field on every page.
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const socialTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: SITE_NAME,
      url: path,
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
