import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Image Tools",
  description: "Browser-first Unannoy image tools for compression, resizing, WebP conversion, JPG and PNG conversion, and metadata cleanup.",
  alternates: { canonical: "/image-tools" },
};

export default function ImageToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Image tools"
      title="Tiny image chores, handled locally."
      description={categoryContent.image.intro}
      categories={["image"]}
    />
  );
}
