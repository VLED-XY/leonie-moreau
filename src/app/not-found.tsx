import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Error 404</p>
            <h1>Page not found.</h1>
          </div>
          <div className="detail-intro">
            <p>
              This page has moved or never existed. The work, services and
              prints are all still here.
            </p>
            <Link className="primary-button" href="/">
              Back to home <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
