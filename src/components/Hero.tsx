"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";

export function Hero() {
  return (
    <section className="hero" id="top">
      <SiteHeader />

      <div className="hero-grid">
        <motion.div
          className="hero-title-wrap"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Photographer — Paris · Edinburgh</p>
          <h1>
            Léonie
            <span>Moreau</span>
          </h1>
        </motion.div>

        <motion.div
          className="hero-aside"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
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
        </motion.div>
      </div>
      <div className="hero-rule" />
    </section>
  );
}
