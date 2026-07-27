import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export function Hero() {
  return (
    <section className="hero" id="top">
      <SiteHeader />

      <div className="hero-grid">
        <div className="hero-title-wrap">
          <p className="eyebrow">Photographer — Paris · Edinburgh</p>
          <h1>
            Léonie
            <span>Moreau</span>
          </h1>
        </div>

        <div className="hero-aside">
          <p className="hero-index">Editorial · Weddings · Events</p>
          <p className="hero-intro">
            Honest, artful photography for people, celebrations and culture.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#contact">
              Book a shoot <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="#services">
              Explore services
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-rule" />
    </section>
  );
}
