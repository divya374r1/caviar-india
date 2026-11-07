
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username.trim(), password);

      const requestedPath = new URLSearchParams(
        window.location.search
      ).get("next");

      const destination =
        requestedPath &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/account";

      router.push(destination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <p className="auth-eyebrow">CAVIAR INDIA</p>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-description">
            Sign in to access your customer account and order history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-primary-button"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="auth-switch">
          New to Caviar India?{" "}
          <Link href="/register">Create an account</Link>
        </p>

        <div className="auth-back-link">
          <Link href="/shop">Continue shopping</Link>
        </div>
      </section>
    </main>
  );
}
