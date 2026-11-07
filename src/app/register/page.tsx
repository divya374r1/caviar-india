
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const fields = [
  { label: "Username", field: "username", type: "text", autocomplete: "username" },
  { label: "Email Address", field: "email", type: "email", autocomplete: "email" },
  { label: "First Name", field: "first_name", type: "text", autocomplete: "given-name" },
  { label: "Last Name", field: "last_name", type: "text", autocomplete: "family-name" },
  { label: "Password", field: "password", type: "password", autocomplete: "new-password" },
] as const;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      router.push("/login?registered=true");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-register-card">
        <div className="auth-heading">
          <p className="auth-eyebrow">CAVIAR INDIA</p>
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-description">
            Join us and discover exceptional caviar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {fields.map((item) => (
            <label key={item.field} className="auth-field">
              <span>{item.label}</span>
              <input
                type={item.type}
                value={form[item.field]}
                onChange={(event) =>
                  updateField(item.field, event.target.value)
                }
                placeholder={`Enter your ${item.label.toLowerCase()}`}
                required
                minLength={item.field === "password" ? 8 : undefined}
                autoComplete={item.autocomplete}
              />
            </label>
          ))}

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
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered?{" "}
          <Link href="/login">Sign in</Link>
        </p>

        <div className="auth-back-link">
          <Link href="/shop">Explore the collection</Link>
        </div>
      </section>
    </main>
  );
}
