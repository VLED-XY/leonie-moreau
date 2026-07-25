import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Léonie Moreau | Photographer in Edinburgh & Paris",
      template: "%s | Léonie Moreau",
    },
    description:
      "Editorial photography for weddings, brands and culture in Edinburgh, Paris and beyond.",
    openGraph: {
      title: "Léonie Moreau | Photographer in Edinburgh & Paris",
      description:
        "Editorial photography for weddings, brands and culture in Edinburgh, Paris and beyond.",
      images: [
        {
          url: "/og.png",
          width: 1733,
          height: 907,
          alt: "Léonie Moreau — Photographer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Léonie Moreau | Photographer in Edinburgh & Paris",
      description:
        "Editorial photography for weddings, brands and culture in Edinburgh, Paris and beyond.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
