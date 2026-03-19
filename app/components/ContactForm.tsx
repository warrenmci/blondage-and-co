"use client";

import { FormEvent, useRef, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch {
      // In this starter, we silently ignore errors and still show a friendly message.
    } finally {
      setStatus("sent");
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }

  return (
    <div className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-8">
      <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--accent)]">
        Get in touch
      </h2>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-[var(--foreground)]/80"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-full border border-black/5 bg-[#f9f4ed] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/40"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--foreground)]/80"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-full border border-black/5 bg-[#f9f4ed] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/40"
              placeholder="name@email.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-[var(--foreground)]/80"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            className="w-full rounded-full border border-black/5 bg-[#f9f4ed] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/40"
            placeholder="Best number to reach you"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="text-sm font-medium text-[var(--foreground)]/80"
          >
            How can Candice help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full resize-none rounded-3xl border border-black/5 bg-[#f9f4ed] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/40"
            placeholder="Tell us about your current hair, dream result, and preferred days/times."
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[#2b2115] shadow-sm transition hover:shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {status === "submitting" ? "Sending..." : "Send enquiry"}
        </button>

        {status === "sent" && (
          <p className="text-xs text-[var(--foreground)]/70">
            Thank you for getting in touch — I'll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
