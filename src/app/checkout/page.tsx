
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cartItems, subtotal } = useCart();
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: user
      ? `${user.first_name} ${user.last_name}`.trim()
      : "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function goToLogin() {
    router.push("/login?next=/checkout");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!user || !accessToken) {
      goToLogin();
      return;
    }

    if (cartItems.length === 0) {
      setError("Your shopping cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create the order in Django.
      const orderResponse = await fetch(`${API_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...form,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        const message =
          orderData.error ||
          orderData.detail ||
          Object.values(orderData).flat().join(" ") ||
          "Unable to create your order.";

        throw new Error(String(message));
      }

      // Step 2: Request a Razorpay payment order.
      const paymentResponse = await fetch(
        `${API_URL}/api/orders/${orderData.id}/payment/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.error ||
          paymentData.detail ||
          "Unable to initiate payment."
        );
      }

      // Step 3: Load Razorpay Checkout.
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout. Please try again.");
      }

      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Caviar India",
        description: "Premium Caviar Collection",
        order_id: paymentData.razorpay_order_id,
        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#a88b55",
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Step 4: Verify payment on the Django backend.
            const verifyResponse = await fetch(
              `${API_URL}/api/orders/${orderData.id}/payment/verify/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(response),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.error ||
                verifyData.detail ||
                "Payment verification failed."
              );
            }

            router.push(`/order-confirmation?id=${orderData.id}`);
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed. Contact support before retrying."
            );
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError(
              "Payment window closed. Your order may still be pending. Check your account before retrying."
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (failure: unknown) => {
        console.error("Razorpay payment failed:", failure);
        setError(
          "Payment was unsuccessful. Your order remains pending. Please check your account before retrying."
        );
        setSubmitting(false);
      });

      razorpay.open();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <main className="p-10">Loading checkout...</main>;
  }

  if (!user || !accessToken) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center p-6">
        <div className="bg-white border border-[#e9dfcf] p-10 text-center">
          <h1 className="font-serif text-3xl">Sign in to continue</h1>
          <p className="text-sm text-[#777168] my-5">
            Please sign in before placing your order.
          </p>
          <Link
            href="/login?next=/checkout"
            className="inline-block bg-[#a88b55] text-white px-8 py-3"
          >
            SIGN IN
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl">Your cart is empty</h1>
          <Link href="/shop" className="inline-block mt-5 underline">
            Explore the collection
          </Link>
        </div>
      </main>
    );
  }

  const fields = [
    { name: "full_name", label: "Full Name" },
    { name: "email", label: "Email Address" },
    { name: "phone", label: "Phone Number" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
    { name: "postal_code", label: "PIN Code" },
  ] as const;

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-5 py-12 md:px-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-[#a88b55] mb-3">
          CAVIAR INDIA
        </p>

        <h1 className="font-serif text-4xl text-[#38342d]">
          Checkout
        </h1>

        <p className="text-[#777168] mt-3 mb-10">
          Complete your delivery information to proceed.
        </p>

        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#e9dfcf] p-6 md:p-8"
          >
            <h2 className="font-serif text-2xl mb-6">
              Delivery Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {fields.map((field) => (
                <label
                  key={field.name}
                  className="flex flex-col gap-2 text-sm text-[#514b40]"
                >
                  {field.label}
                  <input
                    name={field.name}
                    type={
                      field.name === "email"
                        ? "email"
                        : field.name === "phone"
                          ? "tel"
                          : "text"
                    }
                    value={form[field.name]}
                    onChange={updateField}
                    required
                    className="border border-[#ded5c7] bg-[#fdfcf9] px-4 py-3 outline-none focus:border-[#a88b55]"
                  />
                </label>
              ))}
            </div>

            <label className="flex flex-col gap-2 text-sm text-[#514b40] mt-5">
              Complete Delivery Address
              <textarea
                name="address"
                value={form.address}
                onChange={updateField}
                required
                rows={4}
                className="border border-[#ded5c7] bg-[#fdfcf9] px-4 py-3 outline-none focus:border-[#a88b55]"
              />
            </label>

            {error && (
              <p role="alert" className="text-red-700 text-sm mt-5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled
              className="w-full mt-8 bg-[#b8aa8e] text-white py-4 text-sm tracking-widest opacity-60 cursor-not-allowed"
            >
              PAYMENT TEMPORARILY UNAVAILABLE
            </button>

            <p className="text-xs text-[#777168] mt-4">
              Payments are temporarily unavailable until catalogue prices
              are verified and authorised Razorpay test credentials are
              configured. No payment will be collected.
            </p>
          </form>

          <aside className="bg-white border border-[#e9dfcf] p-6 md:p-8 h-fit">
            <h2 className="font-serif text-2xl mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="text-[#38342d]">{item.name}</p>
                    <p className="text-[#777168] mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="text-[#514b40]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#eee7dc] mt-6 pt-5 flex justify-between font-medium">
              <span>Indicative subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <p className="text-xs text-[#8a8174] mt-5 leading-5">
              Catalogue prices require verification. Final price, applicable
              taxes and delivery charges must be confirmed before payment.
            </p>

            <Link
              href="/cart"
              className="block text-center text-sm text-[#967744] underline mt-6"
            >
              RETURN TO CART
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
