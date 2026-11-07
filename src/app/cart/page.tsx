
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/data/product-images";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-container">
        <p className="shop-eyebrow">YOUR SELECTION</p>

        <h1>Your Shopping Cart</h1>

        <p className="cart-intro">
          Review your selection before proceeding.
        </p>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is waiting to be discovered.</h2>

            <p>
              Explore our collection and add something
              exceptional to your selection.
            </p>

            <Link href="/shop" className="cart-primary-button">
              EXPLORE THE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items">
              {cartItems.map((item) => {
                const image = getProductImage(item.slug);

                return (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-image">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback =
                              event.currentTarget.nextElementSibling;

                            if (fallback instanceof HTMLElement) {
                              fallback.style.display = "flex";
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      ) : null}

                      <span
                        style={{
                          display: image ? "none" : "flex",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          letterSpacing: "2px",
                          color: "#796d60",
                        }}
                      >
                        PRODUCT
                      </span>
                    </div>

                    <div className="cart-item-details">
                      <p className="product-category">
                        {item.category}
                      </p>

                      <h2>{item.name}</h2>

                      <p>{formatPrice(item.price)}</p>

                      <div className="cart-quantity">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        REMOVE
                      </button>
                    </div>

                    <p className="cart-item-total">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </article>
                );
              })}

              <button
                type="button"
                className="cart-clear"
                onClick={clearCart}
              >
                CLEAR CART
              </button>
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <p className="cart-price-note">
                Indicative catalogue pricing. Final price,
                taxes and delivery charges require confirmation.
              </p>

              <Link
                href="/checkout"
                className="cart-primary-button"
              >
                PROCEED TO CHECKOUT
              </Link>

              <Link href="/shop" className="cart-continue">
                CONTINUE SHOPPING
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
