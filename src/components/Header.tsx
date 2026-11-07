
"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { label: "HOME", href: "/" },
  { label: "COLLECTION", href: "/shop" },
  { label: "OUR STORY", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

function HeaderContent() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user, isLoading } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="site-logo" aria-label="Caviar India home">
        CAVIAR INDIA
        <span>THE ART OF FINE CAVIAR</span>
      </Link>

      <nav className="desktop-navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`header-nav-link${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="header-actions">
        {!isLoading && (
          <Link
            href={user ? "/account" : "/login"}
            className="header-account"
          >
            {user ? "MY ACCOUNT" : "SIGN IN"}
          </Link>
        )}

        <Link
          href="/cart"
          className="header-cart"
          aria-label={`Shopping bag with ${cartCount} ${
            cartCount === 1 ? "item" : "items"
          }`}
        >
          <span>SHOPPING BAG</span>
          <span className="header-cart-count" aria-hidden="true">
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="site-header">
          <Link href="/" className="site-logo">
            CAVIAR INDIA
            <span>THE ART OF FINE CAVIAR</span>
          </Link>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
