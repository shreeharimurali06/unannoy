"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  tool,
  className,
  disabled,
}: {
  text: string;
  tool: string;
  className?: string;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyText() {
    if (!text || disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      trackEvent("copy_clicked", { tool_slug: tool, length_bucket: getLengthBucket(text.length) });
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      disabled={disabled || !text}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface-soft px-4 py-2 text-sm font-medium transition hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-50",
        status === "copied" && "border-accent text-accent",
        status === "failed" && "border-primary text-primary",
        className,
      )}
    >
      {status === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {status === "copied" ? "Copied. One less tiny problem." : status === "failed" ? "Could not copy. Browser said no." : "Copy"}
    </button>
  );
}
