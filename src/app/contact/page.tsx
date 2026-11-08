
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ?? "http://127.0.0.1:8000";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");
    setEmailSent(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/customers/contact/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data
          ? Object.entries(data)
              .map(([key, value]) => {
                const message = Array.isArray(value)
                  ? value.join(" ")
                  : String(value);
                return `${key}: ${message}`;
              })
              .join(" ")
          : "Unable to submit your enquiry.";

        throw new Error(validationErrors);
      }

      setSuccess(true);
      setFeedback(data.message || "Your enquiry has been saved.");
      setEmailSent(Boolean(data.email_sent));
      setForm(initialForm);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-none border border-[#d7c7b1] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#302219] outline-none transition placeholder:text-[#a49686] focus:border-[#a8752e] focus:ring-2 focus:ring-[#c49a52]/20";

  return (
    <main className="overflow-hidden bg-[#f5f0e7] text-[#302219]">

      {/* Hero */}
      <section className="bg-[#261b15] px-6 py-20 text-center text-white sm:py-24 lg:py-28">
        <p className="text-[10px] tracking-[0.3em] text-[#e0c38d]">
          WE WOULD LOVE TO HEAR FROM YOU
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-tight !text-[#fffdf9] sm:text-6xl lg:text-7xl">
          Let's start
          <br />
          <em className="!text-[#e0c38d] font-normal">
            a conversation.
          </em>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#e5d9ca] sm:text-base">
          Questions about our collection or looking for
          assistance with a selection? Get in touch with
          the Caviar India team.
        </p>
      </section>

      {/* Contact information and enquiry form */}
      <section className="mx-auto grid max-w-[1250px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-24">

        {/* Contact information */}
        <div>
          <p className="text-[10px] tracking-[0.28em] text-[#a8752e]">
            GET IN TOUCH
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight !text-[#35251c] sm:text-5xl">
            Personal assistance
            <br />
            for every enquiry.
          </h2>

          <p className="mt-6 max-w-md text-sm leading-8 text-[#75675a]">
            Reach out to us for product information, collection
            enquiries or assistance. Our team can help you
            with your questions.
          </p>

          <div className="mt-10 space-y-8">
            <article className="border-b border-[#d7c7b1] pb-6">
              <p className="text-[10px] tracking-[0.2em] text-[#a8752e]">
                01 · EMAIL
              </p>
              <h3 className="mt-2 font-serif text-2xl">
                Write to us
              </h3>
              <a
                href="mailto:info@caviarindia.in"
                className="mt-2 inline-block text-sm text-[#75675a] underline decoration-[#c49a52] underline-offset-4"
              >
                info@caviarindia.in
              </a>
            </article>

            <article className="border-b border-[#d7c7b1] pb-6">
              <p className="text-[10px] tracking-[0.2em] text-[#a8752e]">
                02 · TELEPHONE
              </p>
              <h3 className="mt-2 font-serif text-2xl">
                Speak with us
              </h3>
              <a
                href="tel:+919731856924"
                className="mt-2 inline-block text-sm text-[#75675a] underline decoration-[#c49a52] underline-offset-4"
              >
                +91 97318 56924
              </a>
            </article>

            <article>
              <p className="text-[10px] tracking-[0.2em] text-[#a8752e]">
                03 · VISIT US
              </p>
              <h3 className="mt-2 font-serif text-2xl">
                Find our location
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#75675a]">
                No. 1632, 17th A Main, 30th A Cross,
                HBR Layout, 5th Block, Kalyan Nagar,
                Bengaluru, Karnataka 560043.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=No+1632+17th+A+Main+30th+A+Cross+HBR+Layout+5th+Block+Kalyan+Nagar+Bengaluru+560043"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[10px] tracking-[0.16em] text-[#a8752e] underline underline-offset-4"
              >
                VIEW LOCATION 
              </a>
            </article>
          </div>
        </div>

        {/* Enquiry form */}
        <div className="border border-[#dfd1bd] bg-[#fffdf9] p-6 shadow-[0_15px_45px_rgba(48,35,22,0.06)] sm:p-9 lg:p-11">
          <p className="text-[10px] tracking-[0.25em] text-[#a8752e]">
            SEND AN ENQUIRY
          </p>

          <h2 className="mt-3 font-serif text-3xl !text-[#35251c] sm:text-4xl">
            How may we assist you?
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#75675a]">
            Complete the form below and send your enquiry
            to our team.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-xs font-medium tracking-wide text-[#59402f]">
                Full name *
                <input
                  className={inputClass}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  maxLength={120}
                  required
                />
              </label>

              <label className="block text-xs font-medium tracking-wide text-[#59402f]">
                Email address *
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="block text-xs font-medium tracking-wide text-[#59402f]">
              Phone number
              <input
                className={inputClass}
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+91"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                maxLength={20}
              />
            </label>

            <label className="block text-xs font-medium tracking-wide text-[#59402f]">
              Subject *
              <select
                className={inputClass}
                name="subject"
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                required
              >
                <option value="">Select your enquiry</option>
                <option value="Product enquiry">Product enquiry</option>
                <option value="Caviar collection">Caviar collection</option>
                <option value="Tasting sets">Tasting sets</option>
                <option value="Corporate or bulk enquiry">
                  Corporate or bulk enquiry
                </option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="block text-xs font-medium tracking-wide text-[#59402f]">
              Your message *
              <textarea
                className={`${inputClass} min-h-[145px] resize-y`}
                name="message"
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                minLength={10}
                maxLength={5000}
                required
              />
            </label>

            {feedback && (
              <div
                role="status"
                aria-live="polite"
                className={`border p-4 text-sm leading-6 ${
                  success
                    ? "border-[#b9c8a9] bg-[#f0f4e9] text-[#405536]"
                    : "border-[#d9b9aa] bg-[#fbf0eb] text-[#873f32]"
                }`}
              >
                {feedback}
                {success && emailSent === false && (
                  <p className="mt-1 text-xs">
                    Your enquiry is saved. Email notification
                    still requires configuration.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-14 w-full items-center justify-center bg-[#35251c] px-7 py-4 text-[10px] tracking-[0.22em] text-white transition hover:bg-[#a8752e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "SENDING ENQUIRY..." : "SUBMIT ENQUIRY "}
            </button>

            <p className="text-center text-[11px] leading-6 text-[#897c6d]">
              Your enquiry will be securely submitted to
              Caviar India for review.
            </p>
          </form>
        </div>
      </section>

      {/* Collection invitation */}
      <section className="bg-[#35251c] px-6 py-20 text-center text-white sm:py-24">
        <p className="text-[10px] tracking-[0.3em] text-[#e0c38d]">
          THE CAVIAR INDIA COLLECTION
        </p>

        <h2 className="mt-5 font-serif text-4xl !text-[#fffdf9] sm:text-5xl">
          Find something
          <br />
          <em className="!text-[#e0c38d] font-normal">
            exceptional.
          </em>
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-[#e5d9ca]">
          Explore caviar selections, tasting experiences
          and serving accessories.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-12 items-center border border-[#d0ad72] bg-[#a8752e] px-8 py-4 text-[10px] tracking-[0.2em] text-white transition hover:bg-[#c49a52]"
        >
          DISCOVER THE COLLECTION 
        </Link>
      </section>
    </main>
  );
}
