
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product, ProductCategory } from "@/data/products";
import { getProductImage } from "@/data/product-images";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

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
  process.env.NEXT_PUBLIC_DJANGO_API_URL ??
  "http://127.0.0.1:8000";

function ProductLoading() {
  return (
    <main className="detail-page">
      <div className="detail-container">
        <p>Loading product details...</p>
      </div>
    </main>
  );
}

async function ProductDetails({ params }: ProductPageProps) {
  const { slug } = await params;

  let data: ApiProduct[];

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/?slug=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Unable to fetch product details.");
    }

    data = await response.json();
  } catch (error) {
    console.error("Product detail API error:", error);

    return (
      <main className="detail-page">
        <div className="detail-container">
          <Link href="/shop" className="detail-back-link">
            &larr; BACK TO COLLECTION
          </Link>

          <p>
            Unable to load this product. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const apiProduct = data.find((item) => item.slug === slug);

  if (!apiProduct) {
    notFound();
  }

  const product: Product = {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    price: Number(apiProduct.price),
    category: apiProduct.category,
    description: apiProduct.description || undefined,
    image:
      getProductImage(apiProduct.slug) ||
      apiProduct.image ||
      undefined,
    featured: apiProduct.featured,
    priceNeedsVerification:
      apiProduct.price_needs_verification,
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="detail-page">
      <div className="detail-container">
        <Link href="/shop" className="detail-back-link">
          &larr; BACK TO COLLECTION
        </Link>

        <div className="detail-layout">
          <div className="detail-image">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="detail-product-image"
              />
            ) : (
              <div className="detail-image-placeholder">
                PRODUCT PHOTOGRAPHY
                <span>
                  Approved product imagery to be added
                </span>
              </div>
            )}
          </div>

          <div className="detail-information">
            <p className="product-category">
              {product.category}
            </p>

            <h1>{product.name}</h1>

            <p className="detail-price">
              {formatPrice(product.price)}
            </p>

            <p className="detail-description">
              {product.description ||
                "Discover this selection from the Caviar India collection."}
            </p>

            <div className="detail-note">
              Product specifications, packaging and availability
              will be confirmed before purchase.
            </div>

            <p className="detail-price-note">
              Indicative catalogue price. Final pricing and
              availability require business confirmation.
            </p>

            <div className="detail-actions">
              <AddToCartButton product={product} />

              <a
                href={`mailto:info@caviarindia.in?subject=${encodeURIComponent(
                  `Product enquiry: ${product.name}`
                )}`}
                className="detail-enquiry-link"
              >
                ENQUIRE ABOUT THIS PRODUCT
              </a>

              <Link
                href="/cart"
                className="detail-cart-link"
              >
                VIEW SHOPPING CART
              </Link>
            </div>

            <Link
              href="/shop"
              className="detail-continue-link"
            >
              CONTINUE EXPLORING THE COLLECTION
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage({
  params,
}: ProductPageProps) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
