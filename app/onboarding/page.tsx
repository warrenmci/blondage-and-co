import type { Metadata } from "next";
import {
  BUSINESS_NAME,
  DECLARATION_INTRO,
  DECLARATION_TITLE,
} from "@/lib/declaration";
import { DeclarationForm } from "./DeclarationForm";

// Hidden page: not linked from the site and excluded from search engines.
// Clients reach it only via the link / QR code we send them.
export const metadata: Metadata = {
  title: `${DECLARATION_TITLE} | ${BUSINESS_NAME}`,
  description: "New client declaration for Blondage & Co.",
  robots: { index: false, follow: false },
};

export default function NewClientPage() {
  return (
    <main className="bg-[#f7f1e9] text-[#241a11]">
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 sm:px-6">
        <div className="flex justify-center pt-4">
          <img
            src="/blondage_logo.png"
            alt="Blondage & Co"
            className="h-40 w-auto"
          />
        </div>

        <header className="mb-8 space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {DECLARATION_TITLE}
          </h1>
          <p className="mx-auto max-w-xl text-sm text-[#6f5a45] sm:text-base">
            {DECLARATION_INTRO}
          </p>
        </header>

        <DeclarationForm />
      </div>
    </main>
  );
}
