
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000";

interface OrderItem {
  product_name: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

interface Order {
  id: number;
  full_name: string;
  subtotal: string;
  total_amount: string;
  status: string;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
}

const formatPrice = (value: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));

const formatStatus = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AccountPage() {
  const { user, accessToken, isLoading, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!user || !accessToken) return;

    let cancelled = false;

    async function loadOrders() {
      setOrdersLoading(true);
      setOrderError("");

      try {
        const response = await fetch(`${API_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Your session has expired. Please sign in again."
              : "Unable to load your orders."
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setOrders(data);
        }
      } catch (error) {
        if (!cancelled) {
          setOrderError(
            error instanceof Error
              ? error.message
              : "Unable to load orders."
          );
        }
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user, accessToken]);

  if (isLoading) {
    return (
      <main className="account-loading">
        <p>Loading your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card text-center">
          <p className="auth-eyebrow">CAVIAR INDIA</p>
          <h1 className="auth-title">Sign In Required</h1>
          <p className="auth-description">
            Please sign in to view your account and order history.
          </p>
          <Link href="/login" className="auth-primary-link">
            SIGN IN
          </Link>
        </section>
      </main>
    );
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <main className="account-page">
      <div className="account-container">
        <header className="account-heading">
          <p className="auth-eyebrow">CAVIAR INDIA</p>
          <h1>My Account</h1>
          <p>
            Welcome back, {user.first_name || user.username}.
            Your personal space for purchases and account details.
          </p>
        </header>

        <section className="account-profile">
          <div className="account-section-heading">
            <div>
              <p className="account-eyebrow">YOUR DETAILS</p>
              <h2>Personal Information</h2>
            </div>
          </div>

          <div className="account-details-grid">
            <div className="account-detail">
              <span>Username</span>
              <strong>{user.username}</strong>
            </div>

            <div className="account-detail">
              <span>Email Address</span>
              <strong>{user.email}</strong>
            </div>

            <div className="account-detail">
              <span>First Name</span>
              <strong>{user.first_name || "Not provided"}</strong>
            </div>

            <div className="account-detail">
              <span>Last Name</span>
              <strong>{user.last_name || "Not provided"}</strong>
            </div>
          </div>

          <div className="account-actions">
            <Link href="/shop" className="account-primary-button">
              EXPLORE COLLECTION
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="account-secondary-button"
            >
              SIGN OUT
            </button>
          </div>
        </section>

        <section className="account-orders">
          <div className="account-section-heading">
            <div>
              <p className="account-eyebrow">YOUR PURCHASES</p>
              <h2>Order History</h2>
            </div>

            <span className="account-order-count">
              {orders.length} {orders.length === 1 ? "ORDER" : "ORDERS"}
            </span>
          </div>

          {ordersLoading && (
            <div className="account-message">
              Loading your orders...
            </div>
          )}

          {orderError && (
            <div className="account-message account-error" role="alert">
              {orderError}
            </div>
          )}

          {!ordersLoading && !orderError && orders.length === 0 && (
            <div className="account-empty">
              <h3>No orders yet</h3>
              <p>
                Your Caviar India purchases will appear here.
              </p>
              <Link href="/shop">EXPLORE THE COLLECTION</Link>
            </div>
          )}

          <div className="account-order-list">
            {orders.map((order) => (
              <article key={order.id} className="account-order-card">
                <div className="account-order-header">
                  <div>
                    <p className="account-order-label">
                      ORDER #{order.id}
                    </p>
                    <p className="account-order-date">
                      {new Date(order.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="account-order-statuses">
                    <span>
                      ORDER: {formatStatus(order.status)}
                    </span>
                    <span>
                      PAYMENT: {formatStatus(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="account-order-items">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="account-order-item"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                <div className="account-order-total">
                  <span>Order Total</span>
                  <strong>{formatPrice(order.total_amount)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
