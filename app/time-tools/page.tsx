import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Time Tools",
  description: "Unannoy time tools are planned for timers, stopwatches, and small timing utilities.",
  alternates: { canonical: "/time-tools" },
  robots: { index: false, follow: true },
};

export default function TimeToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Time tools"
      title="Timing tools are warming up."
      description={categoryContent.time.intro}
      categories={["time"]}
      emptyTitle="No published time tools yet."
    />
  );
}
