"use client";

import { Download } from "lucide-react";
import { getLengthBucket, trackEvent } from "@/lib/analytics";

export function DownloadButton({
  content,
  filename,
  mimeType = "text/plain",
  toolSlug,
}: {
  content: string;
  filename: string;
  mimeType?: string;
  toolSlug: string;
}) {
  function download() {
    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    trackEvent("tool_used", { tool_slug: toolSlug, action: "download", length_bucket: getLengthBucket(content.length) });
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={!content}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      Download
    </button>
  );
}
