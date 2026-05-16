"use client";

import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ClearButton({ onClear, toolSlug, disabled }: { onClear: () => void; toolSlug: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClear();
        trackEvent("clear_clicked", { tool_slug: toolSlug });
      }}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
    >
      <X className="h-4 w-4" />
      Clear the mess.
    </button>
  );
}
