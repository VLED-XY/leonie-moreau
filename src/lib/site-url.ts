/**
 * Production origin, without a trailing slash.
 *
 * Overridable through NEXT_PUBLIC_SITE_URL so preview deployments do not
 * advertise the production canonical. Inlined at build time, which keeps the
 * root layout static — see
 * docs/superpowers/specs/2026-07-27-remediation-audit-design.md
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leoniemoreau.com";
