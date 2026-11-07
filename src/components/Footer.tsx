
import Link from "next/link";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const assistanceLinks = [
  { label: "My Account", href: "/account" },
  { label: "Sign In", href: "/login" },
  { label: "Shopping Bag", href: "/cart" },
  { label: "Customer Support", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            CAVIAR INDIA
          </Link>
          <p>THE ART OF EXCEPTIONAL TASTE</p>
          <span className="footer-brand-description">
            A considered collection of fine caviar,
            tasting experiences and elegant accessories.
          </span>
        </div>

        <nav
          className="footer-navigation"
          aria-label="Explore"
        >
          <h3>EXPLORE</h3>
          {exploreLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav
          className="footer-navigation"
          aria-label="Customer assistance"
        >
          <h3>ASSISTANCE</h3>
          {assistanceLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="footer-contact">
          <h3>GET IN TOUCH</h3>
          <p>Bengaluru, India</p>
          <a href="mailto:info@caviarindia.in">
            info@caviarindia.in
          </a>
          <a href="tel:+919731856924">
            +91 97318 56924
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 CAVIAR INDIA. DESIGN CONCEPT.</p>
        <p>AN EXPRESSION OF EXCELLENCE.</p>
      </div>
    </footer>
  );
}
