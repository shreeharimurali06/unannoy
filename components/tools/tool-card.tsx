"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Braces, Clock3, FileText, Hash, Link2, ListChecks, PenLine, Sparkles } from "lucide-react";
import type { ToolCategory, ToolDefinition } from "@/lib/tools/tool-types";

const categoryIcon: Record<ToolCategory, typeof Sparkles> = {
  text: FileText,
  "social-writing": PenLine,
  developer: Braces,
  markdown: Hash,
  links: Link2,
  image: Sparkles,
  pdf: FileText,
  time: Clock3,
  student: ListChecks,
};

const categoryGradient: Record<ToolCategory, string> = {
  text: "from-purple-600 to-fuchsia-500",
  "social-writing": "from-fuchsia-500 to-pink-400",
  developer: "from-violet-700 to-purple-400",
  markdown: "from-purple-500 to-rose-400",
  links: "from-violet-600 to-pink-400",
  image: "from-fuchsia-500 to-violet-500",
  pdf: "from-purple-700 to-fuchsia-400",
  time: "from-purple-500 to-pink-400",
  student: "from-violet-600 to-rose-400",
};

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = categoryIcon[tool.category];

  return (
    <motion.article whileHover={{ y: -5 }} transition={{ duration: 0.18 }} className="h-full">
      <Link
        href={`/${tool.slug}`}
        className="group flex h-full flex-col rounded-[26px] border border-border bg-surface/82 p-5 shadow-sm transition hover:border-primary/50 hover:shadow-[var(--shadow)]"
      >
        <div className="flex items-start justify-between gap-4">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${categoryGradient[tool.category]}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full border border-border bg-surface-soft px-2.5 py-1 text-xs text-muted">
            Local
          </span>
        </div>
        <div className="mt-5 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{tool.category.replace("-", " ")}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{tool.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{tool.description}</p>
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
          Open {tool.shortTitle} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.article>
  );
}
