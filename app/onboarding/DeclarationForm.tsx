"use client";

import { FormEvent, useState } from "react";
import {
  DECLARATION_AGREE_LABEL,
  DECLARATION_FOOTNOTE,
  DECLARATION_POINTS,
  SOCIAL_MEDIA_CONSENT_LABEL,
} from "@/lib/declaration";
import { SignaturePad } from "./SignaturePad";

const INPUT_CLASSES =
  "w-full rounded-full border border-black/5 bg-[#f9f4ed] px-4 py-2.5 text-base outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/40 sm:text-sm";
const LABEL_CLASSES = "text-sm font-medium text-[var(--foreground)]/80";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; message: string }
  | { state: "signed"; reference: string; copySent: boolean };

export function DeclarationForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [signature, setSignature] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signature) {
      setStatus({
        state: "error",
        message: "Please sign in the signature box before submitting.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/declaration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          service: formData.get("service"),
          appointmentDate: formData.get("appointmentDate"),
          hairHistory: formData.get("hairHistory"),
          website: formData.get("website"),
          agreed: formData.get("agreed") === "on",
          sendCopy: formData.get("sendCopy") === "on",
          socialMedia: formData.get("socialMedia") === "on",
          signature,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.reference) {
        throw new Error(
          result.error ||
            "Sorry, something went wrong and your declaration was not sent. Please try again.",
        );
      }
      setStatus({
        state: "signed",
        reference: result.reference,
        copySent: Boolean(result.copySent),
      });
      window.scrollTo({ top: 0 });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Sorry, something went wrong. Please try again.",
      });
    }
  }

  if (status.state === "signed") {
    return (
      <div className="rounded-3xl bg-white/80 p-6 text-center shadow-sm ring-1 ring-black/5 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
          All done
        </p>
        <p className="mt-3 text-2xl font-semibold tracking-tight">
          Thank you, your declaration has been signed.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#6f5a45]">
          {status.copySent && "A copy has been sent to your email. "}
          We look forward to seeing you at your appointment.
        </p>
        <p className="mt-5 text-xs text-[#8a7157]">
          Reference: <span className="font-mono">{status.reference}</span>
        </p>
      </div>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Your details */}
      <section className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[#a48663]">
          Your details
        </h2>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className={LABEL_CLASSES}>
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              maxLength={120}
              autoComplete="name"
              className={INPUT_CLASSES}
              placeholder="Your full name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="email" className={LABEL_CLASSES}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                className={INPUT_CLASSES}
                placeholder="name@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className={LABEL_CLASSES}>
                Mobile
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={40}
                autoComplete="tel"
                className={INPUT_CLASSES}
                placeholder="Your mobile number"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="service" className={LABEL_CLASSES}>
                Service booked{" "}
                <span className="font-normal text-[#8a7157]">(optional)</span>
              </label>
              <input
                id="service"
                name="service"
                maxLength={200}
                className={INPUT_CLASSES}
                placeholder="e.g. Balayage and toner"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="appointmentDate" className={LABEL_CLASSES}>
                Appointment date{" "}
                <span className="font-normal text-[#8a7157]">(optional)</span>
              </label>
              <input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                className={INPUT_CLASSES}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="hairHistory" className={LABEL_CLASSES}>
              Your hair history
            </label>
            <textarea
              id="hairHistory"
              name="hairHistory"
              rows={4}
              required
              maxLength={2000}
              className="w-full resize-none rounded-3xl border border-black/5 bg-[#f9f4ed] px-4 py-3 text-base outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/40 sm:text-sm"
              placeholder="When was your last colour or service? Was it done at a salon or at home and with which products? Any allergies or scalp sensitivity?"
            />
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      {/* Declaration */}
      <section className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[#a48663]">
          Declaration
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[#5a4632] marker:text-[#cab69c]">
          {DECLARATION_POINTS.map((point) => (
            <li key={point.title}>
              <span className="font-semibold text-[#3c2617]">
                {point.title}:
              </span>{" "}
              {point.text}
            </li>
          ))}
        </ul>

        <label
          htmlFor="agreed"
          className="mt-5 flex cursor-pointer items-center gap-4 rounded-2xl border border-black/5 bg-[#f9f4ed] p-4 transition has-[:checked]:border-[#cab69c] has-[:checked]:bg-[#f3e5d5]"
        >
          <input
            id="agreed"
            type="checkbox"
            name="agreed"
            required
            className="h-5 w-5 shrink-0 accent-[#8a6f4e]"
          />
          <span className="text-sm font-semibold text-[#3c2617]">
            {DECLARATION_AGREE_LABEL}
          </span>
        </label>

        <label
          htmlFor="socialMedia"
          className="mt-3 flex cursor-pointer items-center gap-4 px-4 text-sm text-[#5a4632]"
        >
          <input
            id="socialMedia"
            type="checkbox"
            name="socialMedia"
            className="h-5 w-5 shrink-0 accent-[#8a6f4e]"
          />
          {SOCIAL_MEDIA_CONSENT_LABEL}
        </label>

        <p className="mt-4 text-xs text-[#8a7157]">{DECLARATION_FOOTNOTE}</p>
      </section>

      {/* Signature */}
      <section className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-[#a48663]">
          Signature
        </h2>
        <div className="mt-5">
          <SignaturePad onChange={setSignature} />
        </div>

        <label
          htmlFor="sendCopy"
          className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-[#5a4632]"
        >
          <input
            id="sendCopy"
            type="checkbox"
            name="sendCopy"
            className="h-5 w-5 shrink-0 accent-[#8a6f4e]"
          />
          Email me a copy of my signed declaration
        </label>

        {status.state === "error" && (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-[#fbe9e7] px-4 py-3 text-sm text-[#8c2f22]"
          >
            {status.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-[#2b2115] shadow-sm transition hover:shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Sign and submit"}
        </button>
        <p className="mt-3 text-center text-xs text-[#8a7157]">
          The date and time of signing are recorded with your declaration.
        </p>
      </section>
    </form>
  );
}
