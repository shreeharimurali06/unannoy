import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedSurface } from "@/components/animated-surface";
import { RetroWireframeVisual } from "@/components/retro-wireframe-visual";
import { RelatedTools } from "@/components/tools/related-tools";
import { ToolFAQ } from "@/components/tools/tool-faq";
import { ToolPrivacyNote } from "@/components/tools/tool-privacy-note";
import { ToolSEOContent, type ToolContent } from "@/components/tools/tool-seo-content";
import { getPublishedTool } from "@/lib/tools/tool-registry";
import type { ToolDefinition } from "@/lib/tools/tool-types";

export function getToolMetadata(slug: string): Metadata {
  const tool = getPublishedTool(slug);
  if (!tool) return { robots: { index: false, follow: false } };
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `/${tool.slug}`,
      type: "website",
    },
  };
}

export function ToolPageShell({
  slug,
  content,
  children,
}: {
  slug: string;
  content: ToolContent;
  children: React.ReactNode;
}) {
  const tool = getPublishedTool(slug);
  if (!tool) notFound();

  return <ToolPageShellInner tool={tool} content={content}>{children}</ToolPageShellInner>;
}

function ToolPageShellInner({
  tool,
  content,
  children,
}: {
  tool: ToolDefinition;
  content: ToolContent;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{tool.category.replace("-", " ")}</p>
          <h1 className="mt-3 max-w-3xl break-words text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{tool.title}</h1>
          <p className="mt-4 max-w-3xl break-words text-lg leading-8 text-muted">{content.intro}</p>
        </div>
        <div className="hidden lg:block">
          <RetroWireframeVisual />
        </div>
      </div>

      <AnimatedSurface className="mt-8 p-4 md:p-6">{children}</AnimatedSurface>

      <div className="mt-5">
        <ToolPrivacyNote />
      </div>

      <div className="mt-12 grid gap-8">
        <ToolSEOContent content={content} />
        <ToolFAQ items={content.faqs} />
        <RelatedTools tool={tool} />
      </div>
    </div>
  );
}
