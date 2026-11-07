
"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <button
      type="button"
      className="detail-enquiry-button"
      onClick={handleAddToCart}
    >
      {added ? "ADDED TO YOUR CART ✓" : "ADD TO CART"}
    </button>
  );
}
