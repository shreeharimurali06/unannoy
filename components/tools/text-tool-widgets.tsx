"use client";

import { ArrowDownAZ, ArrowUpZA, Check, ClipboardList, FileText, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { MetricCard } from "@/components/tools/metric-card";
import { ToolInputOutputLayout } from "@/components/tools/tool-input-output-layout";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { cleanList, getLineMetrics, removeDuplicateLines, sortLines } from "@/lib/text";
import type { DuplicateLineComparison, SortLineDirection } from "@/lib/text";
import { getWordCountMetrics } from "@/lib/word-count";
import { cn } from "@/lib/utils";

type ToggleOption = {
  key: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

type OutputFormat = "plain" | "bullets" | "numbers" | "quoted";

const samples = {
  duplicateLines: "Alpha\nBeta\nalpha\nGamma\nBeta\n\n  Gamma  \nDelta",
  sortLines: "invoice-12\ninvoice-2\nBeta\nalpha\nGamma\nbeta\n\nDelta",
  lineCounter: "First line\nSecond line\n\nRepeated\nRepeated\n  \nFinal line",
  listCleaner: "1. Apples, 2. Bananas\n- apples\n* Carrots\n\n3) Dates, Bananas",
  readingTime:
    "Small tools should stay close to the work. Paste a draft, check the estimate, and decide whether the piece reads like a quick note or a longer article before it reaches anyone else.",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function createToolTracker(toolSlug: string) {
  trackEvent("tool_opened", { tool_slug: toolSlug, category: "text" });
}

function useTrackedToolUse(toolSlug: string, action: string, text: string, resultSignature: string) {
  const trackedSignature = useRef("");

  useEffect(() => {
    if (!text) {
      trackedSignature.current = "";
      return;
    }

    const signature = `${text.length}:${resultSignature}`;
    const timeout = window.setTimeout(() => {
      if (trackedSignature.current === signature) return;
      trackedSignature.current = signature;
      trackEvent("tool_used", {
        tool_slug: toolSlug,
        action,
        length_bucket: getLengthBucket(text.length),
        category: "text",
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [action, resultSignature, text, toolSlug]);
}

function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  minHeight = "min-h-[340px]",
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  minHeight?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          "w-full resize-y rounded-2xl border border-border bg-surface px-4 py-3 font-mono text-sm leading-6 shadow-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20",
          readOnly && "bg-surface-soft",
          minHeight,
        )}
      />
    </label>
  );
}

function ToggleGrid({ options }: { options: ToggleOption[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={option.checked}
          onClick={() => option.onChange(!option.checked)}
          className={cn(
            "flex min-h-16 items-start gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition",
            option.checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface/80 hover:border-primary/60 hover:bg-surface",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
              option.checked ? "border-primary-foreground/50 bg-primary-foreground/20" : "border-border",
            )}
          >
            {option.checked ? <Check className="h-3.5 w-3.5" /> : null}
          </span>
          <span>
            <span className="block font-medium">{option.label}</span>
            <span className={cn("mt-1 block text-xs leading-4", option.checked ? "text-primary-foreground/75" : "text-muted")}>
              {option.description}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function Toolbar({
  children,
  onSample,
  onClear,
  canClear,
  toolSlug,
}: {
  children?: React.ReactNode;
  onSample: () => void;
  onClear: () => void;
  canClear: boolean;
  toolSlug: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSample}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
          >
            <Sparkles className="h-4 w-4" />
            Load sample
          </button>
          <ClearButton onClear={onClear} toolSlug={toolSlug} disabled={!canClear} />
        </div>
        {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
      </div>
    </section>
  );
}

function trackOption(toolSlug: string, optionName: string, action: string) {
  trackEvent("option_changed", { tool_slug: toolSlug, option_name: optionName, action, category: "text" });
}

function trackSample(toolSlug: string, sample: string) {
  trackEvent("sample_loaded", {
    tool_slug: toolSlug,
    action: "sample",
    length_bucket: getLengthBucket(sample.length),
    category: "text",
  });
}

export function RemoveDuplicateLinesTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [comparison, setComparison] = useState<DuplicateLineComparison>("trimmed-case-insensitive");
  const [removeEmptyLinesOption, setRemoveEmptyLinesOption] = useState(true);
  const [keepFirst, setKeepFirst] = useState(true);

  useEffect(() => createToolTracker(toolSlug), [toolSlug]);

  const result = useMemo(
    () => removeDuplicateLines(text, { comparison, removeEmptyLines: removeEmptyLinesOption, keepFirst }),
    [comparison, keepFirst, removeEmptyLinesOption, text],
  );
  useTrackedToolUse(toolSlug, "dedupe", text, `${result.output.length}:${result.duplicatesRemoved}:${result.emptyLinesRemoved}`);

  function loadSample() {
    setText(samples.duplicateLines);
    trackSample(toolSlug, samples.duplicateLines);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={
          <TextPanel
            label="Original lines"
            value={text}
            onChange={setText}
            placeholder="Paste one item per line. Repeated rows will be removed."
          />
        }
        output={<TextPanel label="Unique lines" value={result.output} placeholder="Deduplicated lines will appear here." readOnly />}
      />

      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={result.output} toolSlug={toolSlug} label="Copy unique lines" />
      </Toolbar>

      <section className="rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Match duplicates by</span>
            <select
              value={comparison}
              onChange={(event) => {
                const next = event.target.value as DuplicateLineComparison;
                setComparison(next);
                trackOption(toolSlug, "comparison", next);
              }}
              className="w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm"
            >
              <option value="exact">Exact line</option>
              <option value="trimmed">Trimmed line</option>
              <option value="case-insensitive">Case-insensitive</option>
              <option value="trimmed-case-insensitive">Trimmed and case-insensitive</option>
            </select>
          </label>
          <ToggleGrid
            options={[
              {
                key: "remove-empty",
                label: "Remove blank lines",
                description: "Drop rows that contain only whitespace.",
                checked: removeEmptyLinesOption,
                onChange: (checked) => {
                  setRemoveEmptyLinesOption(checked);
                  trackOption(toolSlug, "remove_empty_lines", checked ? "enable" : "disable");
                },
              },
              {
                key: "keep-first",
                label: "Keep first copy",
                description: "Turn off to keep the last copy instead.",
                checked: keepFirst,
                onChange: (checked) => {
                  setKeepFirst(checked);
                  trackOption(toolSlug, "keep_first", checked ? "enable" : "disable");
                },
              },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Lines before" value={formatNumber(result.linesBefore)} />
        <MetricCard label="Lines after" value={formatNumber(result.linesAfter)} />
        <MetricCard label="Duplicates removed" value={formatNumber(result.duplicatesRemoved)} />
        <MetricCard label="Blank lines removed" value={formatNumber(result.emptyLinesRemoved)} />
      </section>
    </div>
  );
}

export function SortLinesTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<SortLineDirection>("ascending");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [numeric, setNumeric] = useState(true);
  const [trimBeforeCompare, setTrimBeforeCompare] = useState(true);
  const [removeEmptyLinesOption, setRemoveEmptyLinesOption] = useState(true);
  const [removeDuplicatesOption, setRemoveDuplicatesOption] = useState(false);

  useEffect(() => createToolTracker(toolSlug), [toolSlug]);

  const deduped = useMemo(
    () =>
      removeDuplicatesOption
        ? removeDuplicateLines(text, {
            comparison: caseSensitive ? "trimmed" : "trimmed-case-insensitive",
            removeEmptyLines: false,
            keepFirst: true,
          }).output
        : text,
    [caseSensitive, removeDuplicatesOption, text],
  );
  const result = useMemo(
    () => sortLines(deduped, { direction, caseSensitive, numeric, trimBeforeCompare, removeEmptyLines: removeEmptyLinesOption }),
    [caseSensitive, deduped, direction, numeric, removeEmptyLinesOption, trimBeforeCompare],
  );
  useTrackedToolUse(toolSlug, "sort", text, `${result.output.length}:${direction}:${removeDuplicatesOption}`);

  function loadSample() {
    setText(samples.sortLines);
    trackSample(toolSlug, samples.sortLines);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Lines to sort" value={text} onChange={setText} placeholder="Paste unsorted lines here." />}
        output={<TextPanel label="Sorted lines" value={result.output} placeholder="Sorted lines will appear here." readOnly />}
      />

      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={result.output} toolSlug={toolSlug} label="Copy sorted lines" />
      </Toolbar>

      <section className="grid gap-4 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm lg:grid-cols-[240px_minmax(0,1fr)]">
        <div>
          <p className="mb-2 text-sm font-semibold">Sort direction</p>
          <div className="grid gap-2">
            {[
              { value: "ascending" as const, label: "A to Z", icon: ArrowDownAZ },
              { value: "descending" as const, label: "Z to A", icon: ArrowUpZA },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setDirection(item.value);
                    trackOption(toolSlug, "direction", item.value);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                    direction === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-soft",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <ToggleGrid
          options={[
            {
              key: "numeric",
              label: "Numeric sorting",
              description: "Keep item 2 before item 12.",
              checked: numeric,
              onChange: (checked) => {
                setNumeric(checked);
                trackOption(toolSlug, "numeric", checked ? "enable" : "disable");
              },
            },
            {
              key: "case",
              label: "Case-sensitive",
              description: "Treat uppercase and lowercase as different.",
              checked: caseSensitive,
              onChange: (checked) => {
                setCaseSensitive(checked);
                trackOption(toolSlug, "case_sensitive", checked ? "enable" : "disable");
              },
            },
            {
              key: "trim",
              label: "Trim before comparing",
              description: "Ignore leading spaces when deciding order.",
              checked: trimBeforeCompare,
              onChange: (checked) => {
                setTrimBeforeCompare(checked);
                trackOption(toolSlug, "trim_before_compare", checked ? "enable" : "disable");
              },
            },
            {
              key: "empty",
              label: "Remove blank lines",
              description: "Drop whitespace-only rows while sorting.",
              checked: removeEmptyLinesOption,
              onChange: (checked) => {
                setRemoveEmptyLinesOption(checked);
                trackOption(toolSlug, "remove_empty_lines", checked ? "enable" : "disable");
              },
            },
            {
              key: "dedupe",
              label: "Remove duplicates",
              description: "Keep one copy before the sorted result is shown.",
              checked: removeDuplicatesOption,
              onChange: (checked) => {
                setRemoveDuplicatesOption(checked);
                trackOption(toolSlug, "remove_duplicates", checked ? "enable" : "disable");
              },
            },
          ]}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Lines before" value={formatNumber(text ? text.split(/\r\n|\r|\n/).length : 0)} />
        <MetricCard label="Lines after" value={formatNumber(result.linesAfter)} />
        <MetricCard label="Changed" value={result.changed ? "Yes" : "No"} />
      </section>
    </div>
  );
}

export function LineCounterTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const metrics = useMemo(() => getLineMetrics(text), [text]);

  useEffect(() => createToolTracker(toolSlug), [toolSlug]);
  useTrackedToolUse(toolSlug, "count", text, `${metrics.totalLines}:${metrics.duplicateLines}`);

  function loadSample() {
    setText(samples.lineCounter);
    trackSample(toolSlug, samples.lineCounter);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4">
        <TextPanel
          label="Text to count"
          value={text}
          onChange={setText}
          placeholder="Paste rows, bullets, logs, records, or any line-based text."
          minHeight="min-h-[420px]"
        />
        <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug} />
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <MetricCard label="Total lines" value={formatNumber(metrics.totalLines)} />
        <MetricCard label="Non-empty lines" value={formatNumber(metrics.nonEmptyLines)} />
        <MetricCard label="Blank lines" value={formatNumber(metrics.blankLines)} />
        <MetricCard label="Duplicate lines" value={formatNumber(metrics.duplicateLines)} />
        <MetricCard label="Shortest line" value={formatNumber(metrics.shortestLineLength)} />
        <MetricCard label="Longest line" value={formatNumber(metrics.longestLineLength)} />
        <MetricCard label="Average line" value={formatNumber(metrics.averageLineLength)} />
        <MetricCard label="Characters" value={formatNumber(metrics.totalCharacters)} />
      </section>
    </div>
  );
}

function stripListMarkers(item: string) {
  return item.replace(/^\s*(?:[-*+]|[0-9]+[.)]|[A-Za-z][.)])\s+/, "");
}

function formatItems(items: string[], outputFormat: OutputFormat) {
  switch (outputFormat) {
    case "bullets":
      return items.map((item) => `- ${item}`).join("\n");
    case "numbers":
      return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
    case "quoted":
      return items.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(", ");
    case "plain":
      return items.join("\n");
  }
}

export function ListCleanerTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [splitMode, setSplitMode] = useState<"lines-commas" | "lines" | "commas">("lines-commas");
  const [trimItems, setTrimItems] = useState(true);
  const [removeEmptyItems, setRemoveEmptyItems] = useState(true);
  const [removeDuplicatesOption, setRemoveDuplicatesOption] = useState(true);
  const [caseInsensitiveDuplicates, setCaseInsensitiveDuplicates] = useState(true);
  const [stripMarkers, setStripMarkers] = useState(true);
  const [sort, setSort] = useState<"none" | "ascending" | "descending">("none");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("plain");

  useEffect(() => createToolTracker(toolSlug), [toolSlug]);

  const delimiter = useMemo(
    () => (splitMode === "lines" ? /\r\n|\r|\n/ : splitMode === "commas" ? "," : /\r\n|\r|\n|,/),
    [splitMode],
  );
  const preparedInput = useMemo(() => {
    if (!stripMarkers) return text;
    return text
      .split(/\r\n|\r|\n/)
      .map(stripListMarkers)
      .join("\n");
  }, [stripMarkers, text]);
  const result = useMemo(
    () =>
      cleanList(preparedInput, {
        delimiter,
        outputDelimiter: "\n",
        trimItems,
        removeEmptyItems,
        removeDuplicates: removeDuplicatesOption,
        caseInsensitiveDuplicates,
        sort,
        caseSensitiveSort: false,
      }),
    [caseInsensitiveDuplicates, delimiter, preparedInput, removeDuplicatesOption, removeEmptyItems, sort, trimItems],
  );
  const output = useMemo(() => formatItems(result.output ? result.output.split("\n") : [], outputFormat), [outputFormat, result.output]);
  useTrackedToolUse(toolSlug, "clean_list", text, `${output.length}:${result.itemsAfter}:${outputFormat}`);

  function loadSample() {
    setText(samples.listCleaner);
    trackSample(toolSlug, samples.listCleaner);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Messy list" value={text} onChange={setText} placeholder="Paste bullets, numbered items, comma-separated values, or copied list rows." />}
        output={<TextPanel label="Clean list" value={output} placeholder="Cleaned list will appear here." readOnly />}
      />

      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={output} toolSlug={toolSlug} label="Copy clean list" />
      </Toolbar>

      <section className="grid gap-4 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Split input by</span>
          <select
            value={splitMode}
            onChange={(event) => {
              const next = event.target.value as typeof splitMode;
              setSplitMode(next);
              trackOption(toolSlug, "split_mode", next);
            }}
            className="w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="lines-commas">Lines and commas</option>
            <option value="lines">Lines only</option>
            <option value="commas">Commas only</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Sort cleaned items</span>
          <select
            value={sort}
            onChange={(event) => {
              const next = event.target.value as typeof sort;
              setSort(next);
              trackOption(toolSlug, "sort", next);
            }}
            className="w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="none">Do not sort</option>
            <option value="ascending">A to Z</option>
            <option value="descending">Z to A</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Output format</span>
          <select
            value={outputFormat}
            onChange={(event) => {
              const next = event.target.value as OutputFormat;
              setOutputFormat(next);
              trackOption(toolSlug, "output_format", next);
            }}
            className="w-full rounded-2xl border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="plain">Plain lines</option>
            <option value="bullets">Bullets</option>
            <option value="numbers">Numbered list</option>
            <option value="quoted">Quoted comma list</option>
          </select>
        </label>
      </section>

      <section className="rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        <ToggleGrid
          options={[
            {
              key: "trim",
              label: "Trim items",
              description: "Remove leading and trailing spaces.",
              checked: trimItems,
              onChange: (checked) => {
                setTrimItems(checked);
                trackOption(toolSlug, "trim_items", checked ? "enable" : "disable");
              },
            },
            {
              key: "empty",
              label: "Remove empty items",
              description: "Drop blank entries from the result.",
              checked: removeEmptyItems,
              onChange: (checked) => {
                setRemoveEmptyItems(checked);
                trackOption(toolSlug, "remove_empty_items", checked ? "enable" : "disable");
              },
            },
            {
              key: "dedupe",
              label: "Remove duplicates",
              description: "Keep one copy of repeated items.",
              checked: removeDuplicatesOption,
              onChange: (checked) => {
                setRemoveDuplicatesOption(checked);
                trackOption(toolSlug, "remove_duplicates", checked ? "enable" : "disable");
              },
            },
            {
              key: "case",
              label: "Ignore case for duplicates",
              description: "Treat Apples and apples as the same item.",
              checked: caseInsensitiveDuplicates,
              onChange: (checked) => {
                setCaseInsensitiveDuplicates(checked);
                trackOption(toolSlug, "case_insensitive_duplicates", checked ? "enable" : "disable");
              },
            },
            {
              key: "markers",
              label: "Strip bullets and numbering",
              description: "Remove markers like -, *, 1., and a).",
              checked: stripMarkers,
              onChange: (checked) => {
                setStripMarkers(checked);
                trackOption(toolSlug, "strip_markers", checked ? "enable" : "disable");
              },
            },
          ]}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Items before" value={formatNumber(result.itemsBefore)} />
        <MetricCard label="Items after" value={formatNumber(result.itemsAfter)} />
        <MetricCard label="Empty removed" value={formatNumber(result.emptyItemsRemoved)} />
        <MetricCard label="Duplicates removed" value={formatNumber(result.duplicatesRemoved)} />
      </section>
    </div>
  );
}

export function ReadingTimeCalculatorTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [readingWpm, setReadingWpm] = useState(200);
  const [speakingWpm, setSpeakingWpm] = useState(130);
  const metrics = useMemo(
    () => getWordCountMetrics(text, { readingWordsPerMinute: readingWpm, speakingWordsPerMinute: speakingWpm }),
    [readingWpm, speakingWpm, text],
  );

  useEffect(() => createToolTracker(toolSlug), [toolSlug]);
  useTrackedToolUse(toolSlug, "estimate_time", text, `${metrics.words}:${readingWpm}:${speakingWpm}`);

  function loadSample() {
    setText(samples.readingTime);
    trackSample(toolSlug, samples.readingTime);
  }

  function updateSpeed(kind: "reading" | "speaking", value: number) {
    const normalized = Math.min(600, Math.max(50, Math.round(value || 0)));
    if (kind === "reading") {
      setReadingWpm(normalized);
      trackOption(toolSlug, "reading_wpm", "change");
    } else {
      setSpeakingWpm(normalized);
      trackOption(toolSlug, "speaking_wpm", "change");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-4">
        <TextPanel
          label="Text to time"
          value={text}
          onChange={setText}
          placeholder="Paste an article, script, newsletter, or post."
          minHeight="min-h-[420px]"
        />
        <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
          <CopyButton
            text={`Reading time: ${metrics.readingTimeLabel}\nSpeaking time: ${metrics.speakingTimeLabel}\nWords: ${metrics.words}`}
            toolSlug={toolSlug}
            label="Copy estimate"
            disabled={!text}
          />
        </Toolbar>
      </div>

      <div className="grid gap-4">
        <section className="rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Speed assumptions</h2>
          </div>
          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
              Reading speed <span className="text-muted">{readingWpm} wpm</span>
            </span>
            <input
              type="range"
              min={100}
              max={400}
              step={10}
              value={readingWpm}
              onChange={(event) => updateSpeed("reading", Number(event.target.value))}
              className="w-full accent-primary"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
              Speaking speed <span className="text-muted">{speakingWpm} wpm</span>
            </span>
            <input
              type="range"
              min={80}
              max={220}
              step={5}
              value={speakingWpm}
              onChange={(event) => updateSpeed("speaking", Number(event.target.value))}
              className="w-full accent-primary"
            />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Reading time" value={metrics.readingTimeLabel} />
          <MetricCard label="Speaking time" value={metrics.speakingTimeLabel} />
          <MetricCard label="Words" value={formatNumber(metrics.words)} />
          <MetricCard label="Sentences" value={formatNumber(metrics.sentences)} />
          <MetricCard label="Paragraphs" value={formatNumber(metrics.paragraphs)} />
          <MetricCard label="Characters" value={formatNumber(metrics.characters)} />
        </section>

        <section className="rounded-2xl border border-border bg-surface/80 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Estimate summary</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {text
                  ? `${formatNumber(metrics.words)} words at ${readingWpm} wpm is about ${metrics.readingTimeLabel}. At ${speakingWpm} wpm, it is about ${metrics.speakingTimeLabel}.`
                  : "Paste text to calculate reading and speaking time."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
