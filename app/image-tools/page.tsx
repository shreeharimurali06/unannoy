import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Image Tools",
  description: "Unannoy image tools are planned for browser-first resizing, compression, conversion, and metadata cleanup.",
  alternates: { canonical: "/image-tools" },
  robots: { index: false, follow: true },
};

export default function ImageToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Image tools"
      title="Tiny image chores, soon."
      description={categoryContent.image.intro}
      categories={["image"]}
      emptyTitle="No published image tools yet."
    />
  );
}
