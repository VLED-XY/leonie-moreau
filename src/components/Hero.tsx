import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { homeHeroImage } from "@/data/site";

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
          <figure className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element -- static public asset follows the gallery's existing image handling */}
            <img
              src={homeHeroImage}
              alt="Front of a blue vintage car with yellow headlights"
              width={1600}
              height={1063}
              fetchPriority="high"
            />
          </figure>
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
