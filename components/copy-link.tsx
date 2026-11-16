"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons";

export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-soft px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-hairline"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Tautan tersalin" : "Salin tautan"}
    </button>
  );
}
