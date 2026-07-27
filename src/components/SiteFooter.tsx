import Link from "next/link";
import { SITE_NAME } from "@/lib/metadata";

export function SiteFooter() {
  // Evaluated at build time — every page is statically prerendered.
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <span>
        © {year} {SITE_NAME}
      </span>
      <nav aria-label="Footer navigation">
        <Link href="/#services">Services</Link>
        <Link href="/prints">Prints</Link>
        <Link href="/legal/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
