"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { ClearButton } from "@/components/clear-button";
import { MetricCard } from "@/components/metric-card";
import { ResultPanel } from "@/components/result-panel";
import { TextAreaPanel } from "@/components/text-area-panel";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { cleanText, type TextCleanerOptions } from "@/lib/text-cleaner";
import { cn } from "@/lib/utils";

type CleanerToggle = {
  key: keyof CleanerOptions;
  label: string;
  description: string;
};

type CleanerOptions = {
  trimLines: boolean;
  collapseSpaces: boolean;
  removeEmptyLines: boolean;
  normalizeLineEndings: boolean;
  removeTabs: boolean;
  removeDuplicateLines: boolean;
  removeInvisibleCharacters: boolean;
};

const initialOptions: CleanerOptions = {
  trimLines: true,
  collapseSpaces: true,
  removeEmptyLines: false,
  normalizeLineEndings: true,
  removeTabs: true,
  removeDuplicateLines: false,
  removeInvisibleCharacters: true,
};

const toggles: CleanerToggle[] = [
  {
    key: "trimLines",
    label: "Trim lines",
    description: "Remove leading and trailing space from each line.",
  },
  {
    key: "collapseSpaces",
    label: "Remove extra spaces",
    description: "Collapse repeated regular spaces inside each line.",
  },
  {
    key: "removeEmptyLines",
    label: "Remove empty lines",
    description: "Delete blank rows instead of leaving them in place.",
  },
  {
    key: "normalizeLineEndings",
    label: "Normalize line breaks",
    description: "Convert Windows and old Mac line endings to standard breaks.",
  },
  {
    key: "removeTabs",
    label: "Remove tabs",
    description: "Replace tab characters with spaces.",
  },
  {
    key: "removeDuplicateLines",
    label: "Remove duplicate lines",
    description: "Keep the first copy and remove repeated lines.",
  },
  {
    key: "removeInvisibleCharacters",
    label: "Remove invisible characters",
    description: "Strip zero-width and hidden control characters.",
  },
];

function toCleanerOptions(options: CleanerOptions): TextCleanerOptions {
  return {
    normalizeLineEndings: options.normalizeLineEndings,
    trimText: options.trimLines,
    trimLines: options.trimLines,
    collapseSpaces: options.collapseSpaces,
    removeTabs: options.removeTabs,
    tabReplacement: " ",
    removeEmptyLines: options.removeEmptyLines,
    collapseBlankLines: false,
    removeDuplicateLines: options.removeDuplicateLines,
    duplicateLineComparison: "trimmed",
    stripZeroWidthCharacters: options.removeInvisibleCharacters,
    stripControlCharacters: options.removeInvisibleCharacters,
  };
}

export function TextCleanerTool({ tool }: { tool: string }) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<CleanerOptions>(initialOptions);
  const trackedUseSignature = useRef("");

  const result = useMemo(() => cleanText(input, toCleanerOptions(options)), [input, options]);
  const linesRemoved = Math.max(0, result.summary.linesBefore - result.summary.linesAfter);

  useEffect(() => {
    trackEvent("tool_opened", { tool_slug: tool, category: "text" });
  }, [tool]);

  useEffect(() => {
    if (!input) {
      trackedUseSignature.current = "";
      return;
    }

    const enabledOptions = Object.values(options).filter(Boolean).length;
    const signature = `${input.length}:${result.cleaned.length}:${enabledOptions}`;
    const timeout = window.setTimeout(() => {
      if (trackedUseSignature.current === signature) {
        return;
      }

      trackedUseSignature.current = signature;
      trackEvent("tool_used", {
        tool_slug: tool,
        action: result.summary.changed ? "cleaned" : "unchanged",
        length_bucket: getLengthBucket(input.length),
        category: "text",
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [input, options, result.cleaned.length, result.summary.changed, tool]);

  function updateOption(key: keyof CleanerOptions, checked: boolean) {
    setOptions((current) => ({ ...current, [key]: checked }));
    trackEvent("option_changed", {
      tool_slug: tool,
      option_name: key,
      action: checked ? "enable" : "disable",
      category: "text",
    });
  }

  function clear() {
    setInput("");
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4">
        <TextAreaPanel
          label="Input"
          value={input}
          onChange={setInput}
          placeholder="Paste messy text, copied rows, notes, or export data here."
          minHeight="min-h-[420px]"
        />

        <section className="rounded-[24px] border border-border bg-surface-soft/55 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Cleanup options</h2>
              <p className="mt-1 text-sm text-muted">Tap a chip. The output updates immediately.</p>
            </div>
            <ClearButton onClear={clear} tool={tool} disabled={!input} />
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {toggles.map((toggle) => {
              const checked = options[toggle.key];

              return (
                <button
                  key={toggle.key}
                  type="button"
                  aria-pressed={checked}
                  title={toggle.description}
                  onClick={() => updateOption(toggle.key, !checked)}
                  className={cn(
                    "group flex min-h-16 items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition focus:outline-2 focus:outline-offset-2 focus:outline-primary",
                    checked
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-surface/80 text-foreground hover:border-primary/60 hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition",
                      checked
                        ? "border-primary-foreground/45 bg-primary-foreground/18"
                        : "border-border bg-surface-soft text-transparent group-hover:text-muted",
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block font-medium leading-5">{toggle.label}</span>
                    <span className={cn("mt-0.5 block text-xs leading-4", checked ? "text-primary-foreground/78" : "text-muted")}>
                      {toggle.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Characters removed" value={result.summary.charactersRemoved} />
        <MetricCard label="Lines removed" value={linesRemoved} />
        <MetricCard label="Duplicate lines removed" value={result.summary.duplicateLinesRemoved} />
        <MetricCard label="Empty lines removed" value={result.summary.emptyLinesRemoved} />
      </div>

      <ResultPanel
        title="Cleaned text"
        text={result.cleaned}
        tool={tool}
        empty="Cleaned text will appear here as soon as you paste something."
        className="min-w-0"
      />
    </div>
  );
}
