
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000";

interface Order {
  id: number;
  full_name: string;
  subtotal: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
}

type PageState =
  | "loading"
  | "success"
  | "not-found"
  | "unauthenticated"
  | "error";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const { user, accessToken, isLoading } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isLoading) return;

    if (!user || !accessToken) {
      setPageState("unauthenticated");
      return;
    }

    if (!orderId || !/^\d+$/.test(orderId)) {
      setPageState("not-found");
      return;
    }

    let cancelled = false;

    async function verifyOrder() {
      try {
        setPageState("loading");
        setErrorMessage("");

        const response = await fetch(`${API_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        if (!response.ok) {
          throw new Error("Unable to verify your order right now.");
        }

        const data: Order[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from the order service.");
        }

        // Django returns only orders belonging to this authenticated user.
        const matchingOrder = data.find(
          (item) => String(item.id) === orderId
        );

        if (!cancelled) {
          if (matchingOrder) {
            setOrder(matchingOrder);
            setPageState("success");
          } else {
            setPageState("not-found");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to verify your order."
          );
          setPageState("error");
        }
      }
    }

    verifyOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, user, accessToken, isLoading]);

  const paymentPending =
    order?.payment_status?.toLowerCase() !== "paid";

  if (isLoading || pageState === "loading") {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-5">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#38342d]">
            Caviar India
          </p>
          <p className="mt-4 text-sm text-[#777168]">
            Verifying your order...
          </p>
        </div>
      </main>
    );
  }

  if (pageState === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-5">
        <div className="max-w-lg w-full bg-white border border-[#e9dfcf] p-10 text-center">
          <p className="text-xs tracking-[0.3em] text-[#a88b55]">
            CAVIAR INDIA
          </p>

          <h1 className="font-serif text-3xl text-[#38342d] mt-7">
            Sign In Required
          </h1>

          <p className="text-sm text-[#777168] mt-4">
            Please sign in to verify and view your order details.
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="/login"
              className="bg-[#a88b55] text-white py-3 text-sm"
            >
              SIGN IN
            </Link>

            <Link
              href="/shop"
              className="text-[#967744] underline text-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (pageState === "not-found") {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-5">
        <div className="max-w-lg w-full bg-white border border-[#e9dfcf] p-10 text-center">
          <p className="text-xs tracking-[0.3em] text-[#a88b55]">
            CAVIAR INDIA
          </p>

          <h1 className="font-serif text-3xl text-[#38342d] mt-7">
            No Order Found
          </h1>

          <p className="text-sm text-[#777168] mt-4">
            We could not find this order in your account.
            Please check your order reference or visit your account.
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="/account"
              className="bg-[#a88b55] text-white py-3 text-sm"
            >
              VIEW MY ORDERS
            </Link>

            <Link
              href="/shop"
              className="text-[#967744] underline text-sm"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (pageState === "error") {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-5">
        <div className="max-w-lg w-full bg-white border border-[#e9dfcf] p-10 text-center">
          <p className="text-xs tracking-[0.3em] text-[#a88b55]">
            CAVIAR INDIA
          </p>

          <h1 className="font-serif text-3xl text-[#38342d] mt-7">
            Unable to Verify Order
          </h1>

          <p role="alert" className="text-sm text-[#777168] mt-4">
            {errorMessage}
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="/account"
              className="bg-[#a88b55] text-white py-3 text-sm"
            >
              VIEW MY ACCOUNT
            </Link>

            <Link
              href="/shop"
              className="text-[#967744] underline text-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (pageState === "success" && order) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-5 py-12">
        <div className="max-w-lg w-full bg-white border border-[#e9dfcf] p-8 sm:p-10 text-center">

          <p className="text-xs tracking-[0.3em] text-[#a88b55]">
            CAVIAR INDIA
          </p>

          <div className="text-4xl text-[#a88b55] my-6">
            ✓
          </div>

          <h1 className="font-serif text-3xl text-[#38342d]">
            Order Created
          </h1>

          <p className="text-sm text-[#777168] mt-4">
            Your order has been successfully retrieved from your account.
          </p>

          <div className="mt-7 border border-[#e9dfcf] bg-[#faf8f4] p-5 text-left space-y-3">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[#777168]">Order reference</span>
              <strong className="text-[#38342d]">
                #{order.id}
              </strong>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[#777168]">Order status</span>
              <strong className="text-[#38342d] capitalize">
                {order.status}
              </strong>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-[#777168]">Payment status</span>
              <strong className="text-[#92734b] capitalize">
                {order.payment_status}
              </strong>
            </div>
          </div>

          <div className="mt-6 border border-[#e9dfcf] bg-[#f8f5ef] p-4">
            <p className="text-sm text-[#514b40]">
              {paymentPending
                ? "Your order is recorded, but payment is still pending. This page does not confirm a successful payment."
                : "Your payment is marked as paid by the order service."}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Link
              href="/account"
              className="bg-[#a88b55] text-white py-3 text-sm"
            >
              VIEW MY ORDERS
            </Link>

            <Link
              href="/shop"
              className="text-[#967744] underline text-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f5ef] flex items-center justify-center">
          Loading order details...
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
