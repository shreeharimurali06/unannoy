"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolGrid } from "@/components/tools/tool-grid";
import { toolCategories } from "@/lib/tools/categories";
import type { ToolCategory, ToolDefinition } from "@/lib/tools/tool-types";
import { cn } from "@/lib/utils";

export function ToolDirectory({ tools }: { tools: ToolDefinition[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const publishedCategoryIds = useMemo(() => new Set(tools.map((tool) => tool.category)), [tools]);
  const availableCategories = useMemo(
    () => toolCategories.filter((category) => publishedCategoryIds.has(category.id)),
    [publishedCategoryIds],
  );
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (activeCategory !== "all" && tool.category !== activeCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = `${tool.title} ${tool.description} ${tool.keywords.join(" ")}`.toLocaleLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, normalizedQuery, tools]);

  const categories = toolCategories
    .map((category) => ({
      category,
      tools: filteredTools.filter((tool) => tool.category === category.id),
    }))
    .filter((group) => group.tools.length > 0);

  return (
    <div className="rounded-[30px] border border-border bg-surface/68 p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <label className="relative block">
          <span className="sr-only">Search tools</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by task, tool, or tiny annoyance..."
            className="w-full rounded-full border border-border bg-surface/85 py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          />
        </label>
        <p className="text-sm text-muted">
          Showing <span className="font-semibold text-foreground">{filteredTools.length}</span> of{" "}
          <span className="font-semibold text-foreground">{tools.length}</span> published tools
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
            activeCategory === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-soft",
          )}
        >
          All
        </button>
        {availableCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
              activeCategory === category.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface hover:bg-surface-soft",
            )}
          >
            {category.shortTitle}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-12">
        {categories.length ? (
          categories.map((group) => (
            <section key={group.category.id}>
              <div className="mb-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                      {group.category.shortTitle}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{group.category.title}</h2>
                  </div>
                  <span className="rounded-full border border-border bg-surface-soft px-3 py-1 text-xs font-medium text-muted">
                    {group.tools.length} {group.tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{group.category.description}</p>
              </div>
              <ToolGrid tools={group.tools} />
            </section>
          ))
        ) : (
          <div className="rounded-[28px] border border-border bg-surface/75 p-8 text-muted">
            Nothing matched. The tool may still be in the workshop, wearing little safety goggles.
          </div>
        )}
      </div>
    </div>
  );
}
