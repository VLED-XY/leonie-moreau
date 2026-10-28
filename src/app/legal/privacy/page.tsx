import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "How this website handles personal data and enquiries.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <Link className="back-link" href="/">
          ← Home
        </Link>
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Legal</p>
            <h1>Privacy.</h1>
          </div>
          <div className="detail-intro">
            <p>
              This page explains what happens to the information you share
              through this website.
            </p>
          </div>
        </section>
      </div>

      <section className="section print-info">
        <div>
          <p className="eyebrow">What is collected</p>
          <h2>Only what you send.</h2>
        </div>
        <div>
          <p>
            The booking form asks for your name, email address, the service you
            are interested in, an optional date and location, and your message.
            These details are used to answer your enquiry and for nothing else.
            {" "}Messages are sent securely through Resend to the photographer’s
            inbox. Your email address is used to reply to you.
          </p>
          <p>
            This website sets no analytics and no advertising cookies. It is
            served by Cloudflare, which processes technical connection data such
            as your IP address in order to deliver the pages and protect the
            service.
          </p>
          <p>
            Photographs displayed on this site are served from
            leonie-moreau.designbykiara.com.
          </p>
          <p>
            You can ask for a copy of the information held about you, or ask for
            it to be deleted, by replying to any message exchanged about your
            enquiry.
          </p>
        </div>
      </section>
    </main>
  );
}
