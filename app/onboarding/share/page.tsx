import type { Metadata } from "next";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { CopyButton } from "./CopyButton";

// Staff-only helper page (also hidden): shows the link and QR code to send
// to a new client.
export const metadata: Metadata = {
  title: "Share the new client declaration | Blondage & Co",
  robots: { index: false, follow: false },
};

export default async function ShareDeclarationPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  const url = `${protocol}://${host}/onboarding`;

  const qr = await QRCode.toDataURL(url, {
    width: 720,
    margin: 2,
    color: { dark: "#241a11", light: "#ffffff" },
  });

  const message = `Hi! Before your first appointment at Blondage & Co, please take a minute to read and sign our new client declaration: ${url}`;

  return (
    <main className="bg-[#f7f1e9] text-[#241a11]">
      <div className="mx-auto w-full max-w-md space-y-6 px-4 py-10 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
            For new clients
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Client Declaration &amp; Consent
          </h1>
          <p className="mt-2 text-sm text-[#6f5a45]">
            Have the client scan this code, or send them the link.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <img
            src={qr}
            alt="QR code for the new client declaration"
            className="mx-auto w-full max-w-xs"
          />
          <p className="mt-3 break-all font-mono text-xs text-[#5a4632]">
            {url}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <CopyButton text={message} label="Copy message to send" />
          <CopyButton text={url} label="Copy link only" secondary />
          <a
            href={qr}
            download="blondage-onboarding-qr.png"
            className="text-xs font-medium text-[#7c6750] underline underline-offset-2"
          >
            Download QR code image
          </a>
        </div>
      </div>
    </main>
  );
}
