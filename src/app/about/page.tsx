
import Link from "next/link";

export const metadata = {
  title: "Our Story | Caviar India",
  description:
    "Discover the Caviar India collection of caviar, tasting experiences and serving accessories.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">THE WORLD OF CAVIAR INDIA</p>

        <h1>
          An appreciation
          <br />
          of the exceptional.
        </h1>

        <p className="about-hero-description">
          Discover a considered collection of caviar,
          tasting experiences and elegant serving accessories.
        </p>

        <Link href="/shop" className="about-primary-button">
          EXPLORE THE COLLECTION
        </Link>
      </section>

      <section className="about-introduction">
        <div className="about-section-label">
          <span>01</span>
          <span>THE COLLECTION</span>
        </div>

        <div className="about-introduction-content">
          <h2>
            A collection designed
            <br />
            for memorable moments.
          </h2>

          <p>
            Caviar India brings together a selection of caviar,
            tasting sets and serving accessories for those who
            appreciate refined food experiences.
          </p>

          <p>
            From exploring individual selections to discovering
            curated tasting experiences, the collection invites
            customers to find an experience suited to their
            occasion.
          </p>
        </div>
      </section>

      <section className="about-pillars">
        <div className="about-section-label">
          <span>02</span>
          <span>EXPLORE THE EXPERIENCE</span>
        </div>

        <div className="about-pillar-grid">
          <article className="about-pillar">
            <span className="about-pillar-number">01</span>
            <h3>Caviar Selection</h3>
            <p>
              Explore a range of caviar selections presented
              in the Caviar India collection.
            </p>
            <Link href="/shop">DISCOVER CAVIAR </Link>
          </article>

          <article className="about-pillar">
            <span className="about-pillar-number">02</span>
            <h3>Tasting Experiences</h3>
            <p>
              Discover tasting sets that bring different
              selections together for exploration and sharing.
            </p>
            <Link href="/shop">EXPLORE TASTING SETS </Link>
          </article>

          <article className="about-pillar">
            <span className="about-pillar-number">03</span>
            <h3>Serving Accessories</h3>
            <p>
              Explore serving accessories designed to
              complement the caviar experience.
            </p>
            <Link href="/shop">VIEW ACCESSORIES </Link>
          </article>
        </div>
      </section>

      <section className="about-experience">
        <p className="about-eyebrow">THE CAVIAR INDIA EXPERIENCE</p>

        <h2>
          Discover. Savour.
          <br />
          Make it memorable.
        </h2>

        <p>
          Whether you are discovering caviar for the first time
          or selecting something for a special occasion,
          explore the collection at your own pace.
        </p>

        <div className="about-experience-actions">
          <Link href="/shop" className="about-primary-button">
            SHOP THE COLLECTION
          </Link>

          <a
            href="mailto:info@caviarindia.in?subject=Caviar%20India%20Enquiry"
            className="about-secondary-button"
          >
            CONTACT OUR TEAM
          </a>
        </div>
      </section>
    </main>
  );
}
