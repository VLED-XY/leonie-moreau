import Link from "next/link";

export function Impressions() {
  return (
    <section className="section prints-teaser" id="prints">
      <div className="section-label section-label-light">
        <span>03</span>
        <i />
        <span>Prints</span>
      </div>

      <div className="prints-teaser-grid">
        <h2>
          Photographs,
          <br />
          made tangible.
        </h2>
        <div>
          <p>
            A selection of Léonie’s photographs, printed to order on archival
            paper in a choice of formats.
          </p>
          <Link className="light-button" href="/prints">
            View available prints <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
