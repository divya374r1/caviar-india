
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product, ProductCategory } from "@/data/products";
import { getProductImage } from "@/data/product-images";

type CategoryFilter = "All" | ProductCategory;
type SortOption = "featured" | "low-high" | "high-low" | "name";

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  category: ProductCategory;
  description: string;
  image: string | null;
  featured: boolean;
  price_needs_verification: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sort, setSort] = useState<SortOption>("featured");

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
          throw new Error("Unable to load the product collection.");
        }

        const data: ApiProduct[] = await response.json();

        const formattedProducts: Product[] = data.map((product) => ({
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
          priceNeedsVerification: product.price_needs_verification,
        }));

        if (active) {
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Shop product loading error:", err);

        if (active) {
          setError(
            "The collection is temporarily unavailable. Please try again."
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

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else {
      result = [...result].sort(
        (a, b) =>
          Number(Boolean(b.featured)) -
          Number(Boolean(a.featured))
      );
    }

    return result;
  }, [products, search, category, sort]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("featured");
  };

  return (
    <main className="shop-page">
      <section className="shop-heading">
        <p className="shop-eyebrow">
          THE CAVIAR INDIA COLLECTION
        </p>

        <h1>Discover the Art of Caviar</h1>

        <p>
          Explore a curated collection of premium caviar,
          tasting experiences and timeless serving accessories.
        </p>
      </section>

      <section className="shop-content">
        <div className="shop-toolbar">
          <div className="shop-count" aria-live="polite">
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} products`}
          </div>

          <input
            className="shop-search"
            type="search"
            placeholder="Search the collection..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />

          <select
            className="shop-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
            aria-label="Sort products"
          >
            <option value="featured">Featured first</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <div
          className="shop-categories"
          aria-label="Product categories"
        >
          {(
            [
              "All",
              "Caviar",
              "Tasting Sets",
              "Accessories",
            ] as CategoryFilter[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              className={`category-button ${
                category === item ? "active" : ""
              }`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && (
          <p className="shop-status">
            Loading our collection...
          </p>
        )}

        {!loading && error && (
          <div className="shop-empty" role="alert">
            <h2>Unable to load products</h2>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article
                className="shop-product-card"
                key={product.id}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="product-image-placeholder"
                  aria-label={`Discover ${product.name}`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        const fallback =
                          event.currentTarget.nextElementSibling;

                        if (fallback instanceof HTMLElement) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}

                  <span
                    className="product-image-fallback"
                    style={{
                      display: product.image ? "none" : "flex",
                    }}
                  >
                    IMAGE COMING SOON
                  </span>

                  {product.featured && (
                    <span className="product-featured">
                      FEATURED
                    </span>
                  )}
                </Link>

                <div className="shop-product-info">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <h2>{product.name}</h2>

                  <p className="product-price">
                    {formatPrice(product.price)}
                  </p>

                  <p className="product-price-note">
                    Indicative price — confirmation required
                  </p>

                  <Link
                    className="product-view-link"
                    href={`/products/${product.slug}`}
                  >
                    DISCOVER PRODUCT 
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="shop-empty">
              <h2>No products found</h2>

              <p>
                Try another search or choose a different category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          )}
      </section>
    </main>
  );
}
