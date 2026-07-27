"use client";

import { SiteHeader } from "@/components/SiteHeader";

/**
 * Only `reset` is destructured: pulling in an unused `error` binding would
 * trip noUnusedLocals.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <div className="page-shell">
        <SiteHeader />
        <section className="detail-hero prints-hero">
          <div>
            <p className="eyebrow">Something went wrong</p>
            <h1>An error occurred.</h1>
          </div>
          <div className="detail-intro">
            <p>This page failed to load. Trying again usually resolves it.</p>
            <button className="primary-button" type="button" onClick={reset}>
              Try again <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
