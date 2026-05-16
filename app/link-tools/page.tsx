import type { Metadata } from "next";
import { ToolCategoryPage } from "@/components/tools/tool-category-page";
import { categoryContent } from "@/lib/tools/tool-content";

export const metadata: Metadata = {
  title: "Link Tools",
  description: "Published Unannoy link tools for cleaning URLs, removing UTM parameters, generating slugs, and encoding URL text locally.",
  alternates: { canonical: "/link-tools" },
};

export default function LinkToolsPage() {
  return (
    <ToolCategoryPage
      eyebrow="Link tools"
      title="Cleaner links, fewer paste regrets."
      description={categoryContent.link.intro}
      categories={["links"]}
    />
  );
}
