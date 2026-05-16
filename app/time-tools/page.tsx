import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Time Tools",
  description: "Simple Unannoy time tools for browser timers, stopwatches, laps, reading estimates, and speaking estimates.",
  alternates: { canonical: "/time-tools" },
};

export default function TimeToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Time tools"
      title="Small timers for tiny deadlines."
      description={categoryContent.time.intro}
      categories={["time"]}
    />
  );
}
