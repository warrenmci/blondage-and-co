"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label: string;
  secondary?: boolean;
}

export function CopyButton({ text, label, secondary }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the link is shown on the page to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        secondary
          ? "rounded-full border border-[#cab69c]/70 bg-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a4632] shadow-sm transition hover:bg-[#f3e5d5]"
          : "rounded-full bg-[#cab69c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2115] shadow-sm transition hover:shadow-md hover:brightness-105"
      }
    >
      {copied ? "Copied" : label}
    </button>
  );
}
