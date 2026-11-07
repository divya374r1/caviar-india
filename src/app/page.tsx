
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getProductImage } from "@/data/product-images";
import AddToCartButton from "@/components/AddToCartButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ??
  "http://127.0.0.1:8000";

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  category: Product["category"];
  description: string;
  image: string | null;
  featured: boolean;
  price_needs_verification: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const categories = [
  {
    title: "CAVIAR",
    subtitle: "Explore exceptional selections",
    image: getProductImage("calvisius-beluga-caviar"),
    href: "/shop",
  },
  {
    title: "TASTING SETS",
    subtitle: "Discover curated collections",
    image: getProductImage("imperial-caviar-taster-set"),
    href: "/shop",
  },
  {
    title: "ACCESSORIES",
    subtitle: "The finer details of presentation",
    image: getProductImage("mother-of-pearl-spoon"),
    href: "/shop",
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/products/`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data: ApiProduct[] = await response.json();

        const products = data
          .filter((product) => product.featured)
          .map(
            (product): Product => ({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
              category: product.category,
              description: product.description || undefined,
              image:
                getProductImage(product.slug) ||
                product.image ||
                undefined,
              featured: product.featured,
              priceNeedsVerification:
                product.price_needs_verification,
            })
          );

        if (active) {
          setFeaturedProducts(products.slice(0, 4));
        }
      } catch (err) {
        console.error("Homepage product loading error:", err);

        if (active) {
          setError(
            "Our collection is temporarily unavailable. Please explore the full collection."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="overflow-hidden bg-[#f7f2e9] text-[#392b22]">

      {/* Announcement */}
      <div className="bg-[#392b22] px-4 py-2.5 text-center text-[9px] tracking-[0.22em] text-[#e8d5b2] sm:text-[10px] sm:tracking-[0.32em]">
        CAVIAR INDIA · THE ART OF FINE CAVIAR
      </div>

      {/* Hero */}
      <section className="relative isolate min-h-[570px] overflow-hidden bg-[#30251d] sm:min-h-[640px] lg:min-h-[650px]">
        <img
          src="/images/caviar-hero.jpeg"
          alt="An elegant presentation of fine caviar"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1d1712]/90 via-[#2a2018]/65 to-[#241b14]/15" />

        <div className="mx-auto flex min-h-[570px] max-w-[1500px] items-center px-6 py-20 sm:min-h-[640px] sm:px-12 lg:min-h-[650px] lg:px-20">
          <div className="max-w-2xl">

            <div className="mb-7 flex items-center gap-5">
              <span className="text-[10px] tracking-[0.34em] text-[#d7bd8e]">
                THE ART OF FINE CAVIAR
              </span>
              <span className="h-px w-16 bg-[#c9a76d]" />
            </div>

            <h1 className="!text-white font-serif text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-[76px]">
              A world of
              <br />
              exceptional
              <br />
              <em className="!text-[#d8bd8d] font-normal">
                caviar.
              </em>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-[#eee4d5] sm:text-base sm:leading-8">
              Discover a considered collection of fine caviar,
              tasting sets and accessories for memorable dining
              experiences.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center border border-[#d1b47f] bg-[#b18a4e] px-8 py-4 !text-white text-[10px] tracking-[0.2em] transition hover:bg-[#96703b]"
              >
                EXPLORE THE COLLECTION
                <span className="ml-4 text-base">â†’</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center border border-white/70 px-8 py-4 !text-white text-[10px] tracking-[0.2em] transition hover:bg-white/10"
              >
                OUR STORY
              </Link>
            </div>

            <p className="mt-12 text-[9px] tracking-[0.25em] text-[#e4d6c1]">
              DISCOVER THE CAVIAR INDIA COLLECTION
            </p>
          </div>
        </div>

        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[9px] tracking-[0.2em] text-white/80 sm:flex">
          <span className="h-px w-10 bg-[#c9a76d]" />
          CAVIAR INDIA
        </div>
      </section>

      {/* Brand values */}
      <section className="border-b border-[#dfd1bd] bg-[#eee5d8]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-[#d5c4aa] md:grid-cols-4 md:divide-y-0">
          {[
            {
              icon: "",
              title: "CURATED SELECTION",
              text: "Explore our collection",
            },
            {
              icon: "",
              title: "FINE PRESENTATION",
              text: "Details that matter",
            },
            {
              icon: "",
              title: "PERSONAL ASSISTANCE",
              text: "Product enquiries welcome",
            },
            {
              icon: "",
              title: "THOUGHTFUL SERVICE",
              text: "Connect with our team",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 px-5 py-7 sm:px-8"
            >
              <span className="font-serif text-3xl text-[#a17b43]">
                {item.icon}
              </span>

              <div>
                <p className="text-[9px] font-medium tracking-[0.13em] text-[#493a2d]">
                  {item.title}
                </p>

                <p className="mt-1 text-[10px] text-[#837667]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection categories */}
      <section className="bg-[#f7f2e9] px-5 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-10 text-center">
            <p className="text-[10px] tracking-[0.3em] text-[#a17b43]">
              DISCOVER OUR WORLD
            </p>

            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Explore Our Collection
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#827568]">
              Discover fine caviar, tasting sets and carefully
              selected accessories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                href={category.href}
                key={category.title}
                className="group relative block overflow-hidden border border-[#e2d6c5] bg-[#e9dfd1]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#e5d9c8] font-serif text-3xl text-[#8e7654]">
                      CI
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#211912]/75 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="font-serif text-2xl">
                      {category.title}
                      <span className="ml-3 text-base">â†’</span>
                    </p>

                    <p className="mt-2 text-[10px] tracking-wide text-white/85">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-[#e2d5c4] bg-[#eee6da] px-5 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-[#a17b43]">
                SELECTED FOR YOU
              </p>

              <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                Signature Selections
              </h2>
            </div>

            <Link
              href="/shop"
              className="border-b border-[#a17b43] pb-2 text-[10px] tracking-[0.17em] text-[#82643b] transition hover:text-[#392b22]"
            >
              VIEW ALL PRODUCTS â†’
            </Link>
          </div>

          {loading && (
            <div className="py-16 text-center text-sm text-[#827568]">
              Preparing our featured collection...
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="border border-[#dfcfc0] bg-[#f7f2e9] px-6 py-10 text-center text-sm text-[#8b5144]"
            >
              {error}

              <div className="mt-5">
                <Link
                  href="/shop"
                  className="border-b border-[#a17b43] pb-1 text-[10px] tracking-widest text-[#80683f]"
                >
                  EXPLORE THE FULL COLLECTION
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="py-12 text-center text-sm text-[#827568]">
              Explore our full collection of products.

              <div className="mt-5">
                <Link
                  href="/shop"
                  className="border-b border-[#a17b43] pb-1 text-[10px] tracking-widest"
                >
                  VIEW COLLECTION
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group flex min-w-0 flex-col border border-[#e0d4c4] bg-[#f8f5ef] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative block aspect-square overflow-hidden bg-[#eee6da]"
                    aria-label={`View ${product.name}`}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-4xl text-[#a17b43]">
                        CI
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                    <p className="text-[9px] tracking-[0.2em] text-[#a17b43]">
                      {product.category.toUpperCase()}
                    </p>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="mt-3 min-h-[52px] font-serif text-lg leading-snug text-[#392b22] transition hover:text-[#98794b]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-3 border-t border-[#e2d5c4] pt-4">
                      <p className="text-sm font-medium text-[#493a2d]">
                        {formatPrice(product.price)}
                      </p>

                      {product.priceNeedsVerification && (
                        <p className="mt-1 text-[10px] text-[#92734b]">
                          Indicative price · Confirmation required
                        </p>
                      )}
                    </div>

                    <div className="mt-5">
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="mt-9 text-center text-[10px] leading-6 text-[#887c6e]">
            Catalogue prices are indicative and require business
            confirmation before purchase.
          </p>

          <div className="mt-9 text-center">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center border border-[#a17b43] px-9 py-4 text-[10px] tracking-[0.2em] text-[#80683f] transition hover:bg-[#a17b43] hover:text-white"
            >
              EXPLORE THE FULL COLLECTION
              <span className="ml-4">â†’</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="grid lg:grid-cols-2">

        <div className="flex flex-col justify-center bg-[#392b22] px-7 py-20 sm:px-14 lg:px-20 lg:py-28">

          <p className="text-[10px] tracking-[0.3em] text-[#d2b783]">
            THE CAVIAR INDIA STORY
          </p>

          <h2 className="mt-6 !text-[#f7f2e9] font-serif text-4xl leading-tight sm:text-5xl">
            An appreciation
            <br />
            of the finer
            <br />
            <em className="!text-[#d2b783] font-normal">
              things in life.
            </em>
          </h2>

          <p className="mt-7 max-w-lg text-sm leading-8 text-[#ddd2c2]">
            Explore the world of fine caviar through a considered
            collection of distinctive selections, tasting sets and
            accessories. Discover the details behind a memorable
            dining experience.
          </p>

          <div>
            <Link
              href="/about"
              className="mt-9 inline-flex min-h-12 items-center border border-[#c8a875] px-8 py-4 !text-[#ead9b9] text-[10px] tracking-[0.2em] transition hover:bg-[#c8a875] hover:!text-[#392b22]"
            >
              DISCOVER OUR STORY
              <span className="ml-4">â†’</span>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[380px] overflow-hidden bg-[#e5d8c5] lg:min-h-[540px]">
          <img
            src="/images/caviar-story.png"
            alt="An elegant caviar dining presentation with champagne and mother-of-pearl serving accessories"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-[#30251b]/20" />

          <div className="absolute bottom-8 left-8 border-l border-[#e5c994] pl-5 text-white sm:bottom-12 sm:left-12">
            <p className="!text-white font-serif text-3xl leading-tight sm:text-4xl">
              The art of
              <br />
              presentation.
            </p>

            <p className="mt-3 text-[9px] tracking-[0.25em] text-white">
              CAVIAR INDIA
            </p>
          </div>
        </div>
      </section>

      {/* Contact invitation */}
      <section className="bg-[#f7f2e9] px-6 py-20 text-center sm:px-12 lg:py-28">

        <p className="text-[10px] tracking-[0.3em] text-[#a17b43]">
          A PERSONAL INVITATION
        </p>

        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
          Discover your next
          <br />
          <em className="font-normal text-[#a17b43]">
            exceptional experience.
          </em>
        </h2>

        <p className="mx-auto mt-7 max-w-lg text-sm leading-8 text-[#827568]">
          Have a question about our collection? Connect with
          the Caviar India team for product enquiries and
          personalised assistance.
        </p>

        <Link
          href="/contact"
          className="mt-9 inline-flex min-h-12 items-center bg-[#a17b43] px-9 py-4 text-[10px] tracking-[0.2em] text-white transition hover:bg-[#80683f]"
        >
          CONTACT OUR TEAM
          <span className="ml-4">â†’</span>
        </Link>
      </section>

    </main>
  );
}
