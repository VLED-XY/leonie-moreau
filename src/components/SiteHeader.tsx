import Link from "next/link";
import { instagramUrl } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Léonie Moreau — home">
        Léonie Moreau
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/#services">Services</Link>
        <Link href="/prints">Prints</Link>
        <a
          className="nav-instagram"
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <Link className="nav-book" href="/#contact">
          Book
        </Link>
      </nav>
    </header>
  );
}
