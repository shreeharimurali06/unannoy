"use client";

import { RotateCcw, Type } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/clear-button";
import { MetricCard } from "@/components/metric-card";
import { ResultPanel } from "@/components/result-panel";
import { TextAreaPanel } from "@/components/text-area-panel";
import { convertCase, type CaseConversion } from "@/lib/case-converter";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const toolSlug = "case-converter";

const conversions: {
  value: CaseConversion;
  label: string;
  description: string;
}[] = [
  { value: "uppercase", label: "UPPERCASE", description: "Make every letter loud." },
  { value: "lowercase", label: "lowercase", description: "Make every letter quiet." },
  { value: "sentence", label: "Sentence case", description: "Capitalize sentence starts." },
  { value: "title", label: "Title Case", description: "Format headings and names." },
  { value: "camel", label: "camelCase", description: "Compact JavaScript-style names." },
  { value: "pascal", label: "PascalCase", description: "Class and component names." },
  { value: "snake", label: "snake_case", description: "Underscore-separated words." },
  { value: "kebab", label: "kebab-case", description: "Hyphen-separated words." },
  { value: "slug", label: "slug-case", description: "Clean URL-friendly text." },
];

export function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [conversion, setConversion] = useState<CaseConversion>("title");
  const openedTracked = useRef(false);
  const lastUsedSignature = useRef("");

  const result = useMemo(() => convertCase(input, conversion), [input, conversion]);
  const selectedConversion = conversions.find((option) => option.value === conversion) ?? conversions[0];

  useEffect(() => {
    if (openedTracked.current) return;
    openedTracked.current = true;
    trackEvent("tool_opened", { tool_slug: toolSlug, category: "text" });
  }, []);

  useEffect(() => {
    if (!input) {
      lastUsedSignature.current = "";
      return;
    }

    const signature = `${conversion}:${input.length}:${result.output.length}:${result.changed}`;
    const timeout = window.setTimeout(() => {
      if (lastUsedSignature.current === signature) return;
      lastUsedSignature.current = signature;
      trackEvent("tool_used", {
        tool_slug: toolSlug,
        option_name: "conversion",
        action: conversion,
        length_bucket: getLengthBucket(input.length),
        category: "text",
      });
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [conversion, input, result.changed, result.output.length]);

  function changeConversion(nextConversion: CaseConversion) {
    setConversion(nextConversion);
    trackEvent("option_changed", {
      tool_slug: toolSlug,
      option_name: "conversion",
      action: nextConversion,
      category: "text",
    });
  }

  function clearText() {
    setInput("");
    lastUsedSignature.current = "";
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Choose a case</h2>
            <p className="mt-1 text-sm text-muted">Switch formats without changing the original text.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-2 text-sm text-muted">
            <Type className="h-4 w-4 text-primary" />
            {selectedConversion.label}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {conversions.map((option) => {
            const isSelected = option.value === conversion;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => changeConversion(option.value)}
                aria-pressed={isSelected}
                className={cn(
                  "min-h-24 rounded-2xl border p-4 text-left shadow-sm transition focus:outline-2 focus:outline-offset-2 focus:outline-primary",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface/80 hover:-translate-y-0.5 hover:bg-surface-soft",
                )}
              >
                <span className="block font-mono text-sm font-semibold">{option.label}</span>
                <span className={cn("mt-2 block text-xs leading-5", isSelected ? "text-primary-foreground/80" : "text-muted")}>
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Input</h2>
            <ClearButton onClear={clearText} tool={toolSlug} disabled={!input} />
          </div>
          <TextAreaPanel
            label="Original text"
            value={input}
            onChange={setInput}
            placeholder="Paste headings, filenames, labels, notes, or identifiers here."
            minHeight="min-h-[300px]"
          />
        </section>

        <ResultPanel
          title={`${selectedConversion.label} output`}
          text={result.output}
          tool={toolSlug}
          empty="Converted text will appear here as you type."
          className="h-full"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters preserved" />
        <MetricCard label="Output" value={result.output.length} hint="characters converted" />
        <MetricCard label="Status" value={result.changed ? "Changed" : input ? "Same" : "Ready"} hint="live preview" />
      </div>

      {input ? (
        <button
          type="button"
          onClick={() => changeConversion("title")}
          disabled={conversion === "title"}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Title Case
        </button>
      ) : null}
    </div>
  );
}
