"use client";

import { Check, Clock, Replace, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { MetricCard } from "@/components/tools/metric-card";
import { ToolInputOutputLayout } from "@/components/tools/tool-input-output-layout";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { getWordCountMetrics } from "@/lib/word-count";

type TextToolCategory = "text" | "social-writing";
type SpaceMode = "spaces" | "all-whitespace";
type DiffRow = { type: "same" | "removed" | "added"; text: string };
type SocialLimitKind = "instagram-caption" | "instagram-bio" | "twitter" | "linkedin" | "meta-description";

const samples = {
  spaces: "This   sentence    has extra     spaces.\n\nTabs\t\tand odd spacing   can sneak in too.",
  emptyLines: "First paragraph\n\n\nSecond paragraph\n   \nThird paragraph\n\nFinal line",
  findReplace: "Product launch notes\nProduct launch notes\nLaunch date: Friday\nOwner: Product team",
  diffA: "Plan the intro\nWrite the draft\nSend to review\nPublish Friday",
  diffB: "Plan the intro\nWrite the final draft\nSend to review\nPublish Monday",
  speaking:
    "Welcome everyone. Today we will walk through the launch plan, the customer impact, and the decisions we need before Friday.",
  instagram:
    "New launch notes:\n\nBetter spacing, cleaner captions, and fewer failed pastes.\n\n#writing #tools",
  twitter: "Small browser tools are underrated. Paste the annoying thing, fix it locally, copy the result, move on.",
  linkedin:
    "We shipped a small improvement today.\n\nIt removes a tiny repeated annoyance from the publishing workflow, which is exactly the kind of product polish that compounds over time.",
  whatsapp: "quick update\nthis is *important*\nplease review before friday",
  meta: "Clean messy text, count characters, format social posts, and fix small writing chores locally in your browser.",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function trackOpen(toolSlug: string, category: TextToolCategory) {
  trackEvent("tool_opened", { tool_slug: toolSlug, category });
}

function trackOption(toolSlug: string, optionName: string, action: string, category: TextToolCategory) {
  trackEvent("option_changed", { tool_slug: toolSlug, option_name: optionName, action, category });
}

function trackSample(toolSlug: string, category: TextToolCategory, sample: string) {
  trackEvent("sample_loaded", { tool_slug: toolSlug, category, length_bucket: getLengthBucket(sample.length) });
}

function useTrackedUse(toolSlug: string, category: TextToolCategory, action: string, input: string, resultSignature: string) {
  const trackedSignature = useRef("");

  useEffect(() => {
    if (!input) {
      trackedSignature.current = "";
      return;
    }

    const signature = `${action}:${input.length}:${resultSignature}`;
    const timeout = window.setTimeout(() => {
      if (trackedSignature.current === signature) return;
      trackedSignature.current = signature;
      trackEvent("tool_used", { tool_slug: toolSlug, action, category, length_bucket: getLengthBucket(input.length) });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [action, category, input, resultSignature, toolSlug]);
}

function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  minHeight = "min-h-[300px]",
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
        spellCheck={!readOnly}
        className={cn(
          "w-full resize-y rounded-2xl border border-border bg-surface px-4 py-3 font-mono text-sm leading-6 shadow-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20",
          readOnly && "bg-surface-soft",
          minHeight,
        )}
      />
    </label>
  );
}

function Toolbar({
  children,
  onSample,
  onClear,
  canClear,
  toolSlug,
  sampleLabel = "Load sample",
}: {
  children?: React.ReactNode;
  onSample: () => void;
  onClear: () => void;
  canClear: boolean;
  toolSlug: string;
  sampleLabel?: string;
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
            {sampleLabel}
          </button>
          <ClearButton onClear={onClear} toolSlug={toolSlug} disabled={!canClear} />
        </div>
        {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
      </div>
    </section>
  );
}

function ChipToggle({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-soft",
      )}
    >
      {checked ? <Check className="h-4 w-4" /> : null}
      {label}
    </button>
  );
}

function cleanExtraSpaces(text: string, mode: SpaceMode, trimLines: boolean, removeSpaceBeforePunctuation: boolean) {
  const normalized = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => {
      let next = mode === "all-whitespace" ? line.replace(/[^\S\n]+/g, " ") : line.replace(/ {2,}/g, " ");
      if (removeSpaceBeforePunctuation) next = next.replace(/\s+([,.;:!?])/g, "$1");
      return trimLines ? next.trim() : next;
    })
    .join("\n");

  return normalized;
}

function removeEmptyLines(text: string, trimLines: boolean, collapseToSingleBlank: boolean) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let blankRun = 0;
  let removed = 0;

  for (const line of lines) {
    const next = trimLines ? line.trim() : line;
    if (next.trim().length === 0) {
      blankRun += 1;
      if (collapseToSingleBlank && blankRun === 1) {
        output.push("");
      } else {
        removed += 1;
      }
      continue;
    }
    blankRun = 0;
    output.push(next);
  }

  return { output: output.join("\n"), removed };
}

function countLines(text: string) {
  return text ? text.replace(/\r\n?/g, "\n").split("\n").length : 0;
}

function countOccurrences(text: string, query: string, caseSensitive: boolean, wholeWord: boolean) {
  if (!query) return 0;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const source = wholeWord ? `\\b${escaped}\\b` : escaped;
  const flags = caseSensitive ? "g" : "gi";
  return text.match(new RegExp(source, flags))?.length ?? 0;
}

function findAndReplace(text: string, find: string, replacement: string, caseSensitive: boolean, wholeWord: boolean, useRegex: boolean) {
  if (!find) return { output: text, count: 0, error: "" };

  try {
    const source = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = wholeWord ? `\\b(?:${source})\\b` : source;
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(pattern, flags);
    let count = 0;
    const output = text.replace(regex, () => {
      count += 1;
      return replacement;
    });
    return { output, count, error: "" };
  } catch (error) {
    return { output: text, count: 0, error: error instanceof Error ? error.message : "The regular expression could not be used." };
  }
}

function buildDiff(left: string, right: string): DiffRow[] {
  const a = left.replace(/\r\n?/g, "\n").split("\n");
  const b = right.replace(/\r\n?/g, "\n").split("\n");
  if (!left && !right) return [];

  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j] ?? 0, dp[i][j + 1] ?? 0);
    }
  }

  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      rows.push({ type: "same", text: a[i] ?? "" });
      i += 1;
      j += 1;
    } else if (j >= b.length || (i < a.length && (dp[i + 1]?.[j] ?? 0) >= (dp[i]?.[j + 1] ?? 0))) {
      rows.push({ type: "removed", text: a[i] ?? "" });
      i += 1;
    } else {
      rows.push({ type: "added", text: b[j] ?? "" });
      j += 1;
    }
  }

  return rows;
}

function formatDuration(minutes: number) {
  if (minutes <= 0) return "0 sec";
  const totalSeconds = Math.max(1, Math.round(minutes * 60));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs} sec`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
}

function formatInstagramLineBreaks(text: string, trimLines: boolean, dotSpacer: boolean) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  return lines
    .map((line) => {
      const next = trimLines ? line.trim() : line;
      return next.length === 0 && dotSpacer ? "." : next;
    })
    .join("\n");
}

function formatLinkedInPost(text: string, trimLines: boolean, collapseBlanks: boolean, addFirstLineBreak: boolean) {
  let lines = text.replace(/\r\n?/g, "\n").split("\n").map((line) => (trimLines ? line.trim() : line));
  if (collapseBlanks) {
    const compact: string[] = [];
    let blank = false;
    for (const line of lines) {
      if (line.trim().length === 0) {
        if (!blank) compact.push("");
        blank = true;
      } else {
        compact.push(line);
        blank = false;
      }
    }
    lines = compact;
  }
  if (addFirstLineBreak && lines[0]?.trim()) lines.splice(1, 0, "");
  return lines.join("\n").trim();
}

function formatWhatsappText(text: string, mode: "none" | "bold" | "italic" | "mono", trimLines: boolean) {
  const wrap = mode === "bold" ? "*" : mode === "italic" ? "_" : mode === "mono" ? "```" : "";
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => {
      const next = trimLines ? line.trim() : line;
      return wrap && next ? `${wrap}${next}${wrap}` : next;
    })
    .join("\n");
}

function getSocialLimit(kind: SocialLimitKind) {
  switch (kind) {
    case "instagram-caption":
      return { limit: 2200, warning: 2000, label: "Instagram caption" };
    case "instagram-bio":
      return { limit: 150, warning: 140, label: "Instagram bio" };
    case "twitter":
      return { limit: 280, warning: 260, label: "X/Twitter post" };
    case "linkedin":
      return { limit: 3000, warning: 2800, label: "LinkedIn post" };
    case "meta-description":
      return { limit: 160, warning: 150, label: "Meta description" };
  }
}

function getLimitStatus(length: number, kind: SocialLimitKind) {
  const config = getSocialLimit(kind);
  if (length === 0) return { label: "Ready", hint: config.label };
  if (length > config.limit) return { label: "Too long", hint: `${formatNumber(length - config.limit)} over` };
  if (length >= config.warning) return { label: "Close", hint: `${formatNumber(config.limit - length)} left` };
  return { label: "Fits", hint: `${formatNumber(config.limit - length)} left` };
}

function MetricGrid({ children, columns = "sm:grid-cols-3" }: { children: React.ReactNode; columns?: string }) {
  return <section className={cn("grid gap-3", columns)}>{children}</section>;
}

export function RemoveExtraSpacesTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<SpaceMode>("all-whitespace");
  const [trimLines, setTrimLines] = useState(true);
  const [removePunctuationSpaces, setRemovePunctuationSpaces] = useState(true);

  useEffect(() => trackOpen(toolSlug, "text"), [toolSlug]);
  const output = useMemo(() => cleanExtraSpaces(text, mode, trimLines, removePunctuationSpaces), [mode, removePunctuationSpaces, text, trimLines]);
  useTrackedUse(toolSlug, "text", "remove_spaces", text, `${output.length}:${mode}:${trimLines}:${removePunctuationSpaces}`);

  function loadSample() {
    setText(samples.spaces);
    trackSample(toolSlug, "text", samples.spaces);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Messy spacing" value={text} onChange={setText} placeholder="Paste text with double spaces, tabs, or uneven line spacing." />}
        output={<TextPanel label="Clean spacing" value={output} placeholder="Cleaned spacing will appear here." readOnly />}
      />
      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={output} toolSlug={toolSlug} label="Copy cleaned text" disabled={!output} />
      </Toolbar>
      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        <ChipToggle checked={mode === "all-whitespace"} label="Collapse tabs and spaces" onClick={() => {
          const next = mode === "all-whitespace" ? "spaces" : "all-whitespace";
          setMode(next);
          trackOption(toolSlug, "space_mode", next, "text");
        }} />
        <ChipToggle checked={trimLines} label="Trim each line" onClick={() => {
          setTrimLines(!trimLines);
          trackOption(toolSlug, "trim_lines", !trimLines ? "enable" : "disable", "text");
        }} />
        <ChipToggle checked={removePunctuationSpaces} label="Fix punctuation spacing" onClick={() => {
          setRemovePunctuationSpaces(!removePunctuationSpaces);
          trackOption(toolSlug, "punctuation_spacing", !removePunctuationSpaces ? "enable" : "disable", "text");
        }} />
      </section>
      <MetricGrid>
        <MetricCard label="Before" value={formatNumber(text.length)} hint="characters" />
        <MetricCard label="After" value={formatNumber(output.length)} hint="characters" />
        <MetricCard label="Removed" value={formatNumber(Math.max(0, text.length - output.length))} hint="characters" />
      </MetricGrid>
    </div>
  );
}

export function RemoveEmptyLinesTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [trimLines, setTrimLines] = useState(false);
  const [collapseToSingleBlank, setCollapseToSingleBlank] = useState(false);
  const result = useMemo(() => removeEmptyLines(text, trimLines, collapseToSingleBlank), [collapseToSingleBlank, text, trimLines]);

  useEffect(() => trackOpen(toolSlug, "text"), [toolSlug]);
  useTrackedUse(toolSlug, "text", "remove_empty_lines", text, `${result.output.length}:${result.removed}:${trimLines}:${collapseToSingleBlank}`);

  function loadSample() {
    setText(samples.emptyLines);
    trackSample(toolSlug, "text", samples.emptyLines);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Text with empty lines" value={text} onChange={setText} placeholder="Paste text with blank rows or whitespace-only lines." />}
        output={<TextPanel label="Cleaned text" value={result.output} placeholder="Text without empty lines will appear here." readOnly />}
      />
      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={result.output} toolSlug={toolSlug} label="Copy cleaned text" disabled={!result.output} />
      </Toolbar>
      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        <ChipToggle checked={collapseToSingleBlank} label="Keep one blank between blocks" onClick={() => {
          setCollapseToSingleBlank(!collapseToSingleBlank);
          trackOption(toolSlug, "collapse_blank_lines", !collapseToSingleBlank ? "enable" : "disable", "text");
        }} />
        <ChipToggle checked={trimLines} label="Trim non-empty lines" onClick={() => {
          setTrimLines(!trimLines);
          trackOption(toolSlug, "trim_lines", !trimLines ? "enable" : "disable", "text");
        }} />
      </section>
      <MetricGrid>
        <MetricCard label="Lines before" value={formatNumber(countLines(text))} />
        <MetricCard label="Lines after" value={formatNumber(countLines(result.output))} />
        <MetricCard label="Blank lines removed" value={formatNumber(result.removed)} />
      </MetricGrid>
    </div>
  );
}

export function FindAndReplaceTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replacement, setReplacement] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const result = useMemo(() => findAndReplace(text, find, replacement, caseSensitive, wholeWord, useRegex), [caseSensitive, find, replacement, text, useRegex, wholeWord]);
  const previewCount = useMemo(() => (useRegex ? result.count : countOccurrences(text, find, caseSensitive, wholeWord)), [caseSensitive, find, result.count, text, useRegex, wholeWord]);

  useEffect(() => trackOpen(toolSlug, "text"), [toolSlug]);
  useTrackedUse(toolSlug, "text", "find_replace", text, `${result.output.length}:${result.count}:${Boolean(result.error)}`);

  function loadSample() {
    setText(samples.findReplace);
    setFind("Product");
    setReplacement("Marketing");
    trackSample(toolSlug, "text", samples.findReplace);
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm md:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4 text-primary" />Find</span>
          <input value={find} onChange={(event) => setFind(event.target.value)} placeholder={useRegex ? "Regex pattern" : "Text to find"} className="w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Replace className="h-4 w-4 text-primary" />Replace with</span>
          <input value={replacement} onChange={(event) => setReplacement(event.target.value)} placeholder="Replacement text" className="w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
      </section>
      <ToolInputOutputLayout
        input={<TextPanel label="Original text" value={text} onChange={setText} placeholder="Paste text, then enter what to find and replace." />}
        output={<TextPanel label="Replaced text" value={result.output} placeholder="Updated text will appear here." readOnly />}
      />
      {result.error ? <p className="rounded-2xl border border-accent/45 bg-accent/10 p-3 text-sm leading-6">{result.error}</p> : null}
      <Toolbar onSample={loadSample} onClear={() => {
        setText("");
        setFind("");
        setReplacement("");
      }} canClear={Boolean(text || find || replacement)} toolSlug={toolSlug}>
        <CopyButton text={result.output} toolSlug={toolSlug} label="Copy replaced text" disabled={!result.output || Boolean(result.error)} />
      </Toolbar>
      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        {[
          ["case_sensitive", "Case-sensitive", caseSensitive, setCaseSensitive],
          ["whole_word", "Whole word", wholeWord, setWholeWord],
          ["regex", "Use regex", useRegex, setUseRegex],
        ].map(([key, label, checked, setter]) => (
          <ChipToggle key={key as string} checked={checked as boolean} label={label as string} onClick={() => {
            (setter as (value: boolean) => void)(!(checked as boolean));
            trackOption(toolSlug, key as string, !(checked as boolean) ? "enable" : "disable", "text");
          }} />
        ))}
      </section>
      <MetricGrid>
        <MetricCard label="Matches" value={formatNumber(previewCount)} />
        <MetricCard label="Replacements" value={formatNumber(result.count)} />
        <MetricCard label="Status" value={result.error ? "Needs fix" : find ? "Ready" : "Waiting"} />
      </MetricGrid>
    </div>
  );
}

export function TextDiffCheckerTool({ toolSlug }: { toolSlug: string }) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const rows = useMemo(() => buildDiff(left, right), [left, right]);
  const added = rows.filter((row) => row.type === "added").length;
  const removed = rows.filter((row) => row.type === "removed").length;
  const same = rows.filter((row) => row.type === "same").length;

  useEffect(() => trackOpen(toolSlug, "text"), [toolSlug]);
  useTrackedUse(toolSlug, "text", "diff", `${left}\n${right}`, `${added}:${removed}:${same}`);

  function loadSample() {
    setLeft(samples.diffA);
    setRight(samples.diffB);
    trackSample(toolSlug, "text", `${samples.diffA}\n${samples.diffB}`);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Original text" value={left} onChange={setLeft} placeholder="Paste the first version here." minHeight="min-h-[260px]" />}
        output={<TextPanel label="Changed text" value={right} onChange={setRight} placeholder="Paste the second version here." minHeight="min-h-[260px]" />}
      />
      <Toolbar onSample={loadSample} onClear={() => {
        setLeft("");
        setRight("");
      }} canClear={Boolean(left || right)} toolSlug={toolSlug}>
        <CopyButton text={rows.map((row) => `${row.type === "added" ? "+" : row.type === "removed" ? "-" : " "} ${row.text}`).join("\n")} toolSlug={toolSlug} label="Copy diff" disabled={!rows.length} />
      </Toolbar>
      <section className="rounded-2xl border border-border bg-surface/90 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Line diff</h2>
        <div className="max-h-[460px] overflow-auto rounded-2xl bg-surface-soft p-3 font-mono text-sm leading-6">
          {rows.length ? rows.map((row, index) => (
            <div key={`${row.type}-${index}-${row.text}`} className={cn("grid grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded px-2 py-1", row.type === "added" && "bg-accent/15", row.type === "removed" && "bg-primary/10")}>
              <span className="select-none text-muted">{row.type === "added" ? "+" : row.type === "removed" ? "-" : ""}</span>
              <span className="whitespace-pre-wrap break-words">{row.text || " "}</span>
            </div>
          )) : <p className="font-sans text-muted">Paste two versions to compare line changes.</p>}
        </div>
      </section>
      <MetricGrid>
        <MetricCard label="Same lines" value={formatNumber(same)} />
        <MetricCard label="Added lines" value={formatNumber(added)} />
        <MetricCard label="Removed lines" value={formatNumber(removed)} />
      </MetricGrid>
    </div>
  );
}

export function SpeakingTimeCalculatorTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(130);
  const metrics = useMemo(() => getWordCountMetrics(text, { speakingWordsPerMinute: wpm }), [text, wpm]);
  const minutes = metrics.words / wpm;

  useEffect(() => trackOpen(toolSlug, "text"), [toolSlug]);
  useTrackedUse(toolSlug, "text", "speaking_time", text, `${metrics.words}:${wpm}`);

  function loadSample() {
    setText(samples.speaking);
    trackSample(toolSlug, "text", samples.speaking);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4">
        <TextPanel label="Script or talking points" value={text} onChange={setText} placeholder="Paste a script, intro, pitch, voiceover, or meeting notes." minHeight="min-h-[420px]" />
        <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
          <CopyButton text={`Speaking time: ${formatDuration(minutes)}\nWords: ${metrics.words}\nSpeed: ${wpm} wpm`} toolSlug={toolSlug} label="Copy estimate" disabled={!text} />
        </Toolbar>
      </div>
      <div className="grid gap-4">
        <section className="rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Speaking speed</h2>
          </div>
          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">Words per minute <span className="text-muted">{wpm} wpm</span></span>
            <input type="range" min={80} max={220} step={5} value={wpm} onChange={(event) => {
              setWpm(Number(event.target.value));
              trackOption(toolSlug, "speaking_wpm", "change", "text");
            }} className="w-full accent-primary" />
          </label>
        </section>
        <MetricGrid columns="sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Speaking time" value={formatDuration(minutes)} />
          <MetricCard label="Words" value={formatNumber(metrics.words)} />
          <MetricCard label="Sentences" value={formatNumber(metrics.sentences)} />
          <MetricCard label="Characters" value={formatNumber(metrics.characters)} />
        </MetricGrid>
      </div>
    </div>
  );
}

function SocialCounterTool({ toolSlug, kind, sample, title }: { toolSlug: string; kind: SocialLimitKind; sample: string; title: string }) {
  const [text, setText] = useState("");
  const words = useMemo(() => getWordCountMetrics(text).words, [text]);
  const config = getSocialLimit(kind);
  const status = getLimitStatus(text.length, kind);
  const hashtags = text.match(/(^|\s)#[\p{L}\p{N}_]+/gu)?.length ?? 0;

  useEffect(() => trackOpen(toolSlug, "social-writing"), [toolSlug]);
  useTrackedUse(toolSlug, "social-writing", "count_limit", text, `${text.length}:${kind}`);

  function loadSample() {
    setText(sample);
    trackSample(toolSlug, "social-writing", sample);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4">
        <TextPanel label={title} value={text} onChange={setText} placeholder={`Paste a ${config.label.toLowerCase()} to check its length.`} minHeight="min-h-[420px]" />
        <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
          <CopyButton text={text} toolSlug={toolSlug} label="Copy text" disabled={!text} />
        </Toolbar>
      </div>
      <MetricGrid columns="sm:grid-cols-2 xl:grid-cols-1">
        <MetricCard label="Characters" value={formatNumber(text.length)} hint={`${formatNumber(config.limit)} limit`} />
        <MetricCard label="Remaining" value={formatNumber(config.limit - text.length)} hint={config.label} />
        <MetricCard label="Status" value={status.label} hint={status.hint} />
        <MetricCard label="Words" value={formatNumber(words)} />
        <MetricCard label="Lines" value={formatNumber(countLines(text))} />
        <MetricCard label="Hashtags" value={formatNumber(hashtags)} />
      </MetricGrid>
    </div>
  );
}

export function InstagramCharacterCounterTool({ toolSlug }: { toolSlug: string }) {
  return <SocialCounterTool toolSlug={toolSlug} kind="instagram-caption" sample={samples.instagram} title="Instagram caption" />;
}

export function TwitterCharacterCounterTool({ toolSlug }: { toolSlug: string }) {
  return <SocialCounterTool toolSlug={toolSlug} kind="twitter" sample={samples.twitter} title="X/Twitter post" />;
}

export function MetaDescriptionCheckerTool({ toolSlug }: { toolSlug: string }) {
  return <SocialCounterTool toolSlug={toolSlug} kind="meta-description" sample={samples.meta} title="Meta description" />;
}

export function InstagramLineBreaksTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [dotSpacer, setDotSpacer] = useState(true);
  const output = useMemo(() => formatInstagramLineBreaks(text, trimLines, dotSpacer), [dotSpacer, text, trimLines]);

  useEffect(() => trackOpen(toolSlug, "social-writing"), [toolSlug]);
  useTrackedUse(toolSlug, "social-writing", "format_instagram_breaks", text, `${output.length}:${trimLines}:${dotSpacer}`);

  function loadSample() {
    setText(samples.instagram);
    trackSample(toolSlug, "social-writing", samples.instagram);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Original caption" value={text} onChange={setText} placeholder="Paste an Instagram caption with line breaks to preserve." />}
        output={<TextPanel label="Formatted caption" value={output} placeholder="Instagram-safe line breaks will appear here." readOnly />}
      />
      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={output} toolSlug={toolSlug} label="Copy caption" disabled={!output} />
      </Toolbar>
      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        <ChipToggle checked={dotSpacer} label="Use dot spacer on blank lines" onClick={() => {
          setDotSpacer(!dotSpacer);
          trackOption(toolSlug, "dot_spacer", !dotSpacer ? "enable" : "disable", "social-writing");
        }} />
        <ChipToggle checked={trimLines} label="Trim each line" onClick={() => {
          setTrimLines(!trimLines);
          trackOption(toolSlug, "trim_lines", !trimLines ? "enable" : "disable", "social-writing");
        }} />
      </section>
      <MetricGrid>
        <MetricCard label="Characters" value={formatNumber(output.length)} hint="2200 caption limit" />
        <MetricCard label="Lines" value={formatNumber(countLines(output))} />
        <MetricCard label="Status" value={output.length > 2200 ? "Too long" : output ? "Ready" : "Waiting"} />
      </MetricGrid>
    </div>
  );
}

export function LinkedInPostFormatterTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseBlanks, setCollapseBlanks] = useState(true);
  const [addFirstLineBreak, setAddFirstLineBreak] = useState(true);
  const output = useMemo(() => formatLinkedInPost(text, trimLines, collapseBlanks, addFirstLineBreak), [addFirstLineBreak, collapseBlanks, text, trimLines]);

  useEffect(() => trackOpen(toolSlug, "social-writing"), [toolSlug]);
  useTrackedUse(toolSlug, "social-writing", "format_linkedin", text, `${output.length}:${trimLines}:${collapseBlanks}:${addFirstLineBreak}`);

  function loadSample() {
    setText(samples.linkedin);
    trackSample(toolSlug, "social-writing", samples.linkedin);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Draft post" value={text} onChange={setText} placeholder="Paste a LinkedIn draft that needs cleaner spacing." />}
        output={<TextPanel label="Formatted post" value={output} placeholder="A cleaner LinkedIn post will appear here." readOnly />}
      />
      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={output} toolSlug={toolSlug} label="Copy post" disabled={!output} />
      </Toolbar>
      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        <ChipToggle checked={addFirstLineBreak} label="Separate hook line" onClick={() => {
          setAddFirstLineBreak(!addFirstLineBreak);
          trackOption(toolSlug, "hook_break", !addFirstLineBreak ? "enable" : "disable", "social-writing");
        }} />
        <ChipToggle checked={collapseBlanks} label="Collapse repeated blanks" onClick={() => {
          setCollapseBlanks(!collapseBlanks);
          trackOption(toolSlug, "collapse_blanks", !collapseBlanks ? "enable" : "disable", "social-writing");
        }} />
        <ChipToggle checked={trimLines} label="Trim each line" onClick={() => {
          setTrimLines(!trimLines);
          trackOption(toolSlug, "trim_lines", !trimLines ? "enable" : "disable", "social-writing");
        }} />
      </section>
      <MetricGrid>
        <MetricCard label="Characters" value={formatNumber(output.length)} hint="3000 limit" />
        <MetricCard label="Words" value={formatNumber(getWordCountMetrics(output).words)} />
        <MetricCard label="Status" value={output.length > 3000 ? "Too long" : output ? "Ready" : "Waiting"} />
      </MetricGrid>
    </div>
  );
}

export function WhatsappTextFormatterTool({ toolSlug }: { toolSlug: string }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"none" | "bold" | "italic" | "mono">("bold");
  const [trimLines, setTrimLines] = useState(true);
  const output = useMemo(() => formatWhatsappText(text, mode, trimLines), [mode, text, trimLines]);

  useEffect(() => trackOpen(toolSlug, "social-writing"), [toolSlug]);
  useTrackedUse(toolSlug, "social-writing", "format_whatsapp", text, `${output.length}:${mode}:${trimLines}`);

  function loadSample() {
    setText(samples.whatsapp);
    trackSample(toolSlug, "social-writing", samples.whatsapp);
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Message text" value={text} onChange={setText} placeholder="Paste message lines to wrap with WhatsApp formatting markers." />}
        output={<TextPanel label="Formatted message" value={output} placeholder="WhatsApp-formatted text will appear here." readOnly />}
      />
      <Toolbar onSample={loadSample} onClear={() => setText("")} canClear={Boolean(text)} toolSlug={toolSlug}>
        <CopyButton text={output} toolSlug={toolSlug} label="Copy message" disabled={!output} />
      </Toolbar>
      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-soft/65 p-4 shadow-sm">
        {[
          ["none", "No wrapper"],
          ["bold", "Bold"],
          ["italic", "Italic"],
          ["mono", "Monospace"],
        ].map(([value, label]) => (
          <ChipToggle key={value} checked={mode === value} label={label} onClick={() => {
            setMode(value as typeof mode);
            trackOption(toolSlug, "format_mode", value, "social-writing");
          }} />
        ))}
        <ChipToggle checked={trimLines} label="Trim each line" onClick={() => {
          setTrimLines(!trimLines);
          trackOption(toolSlug, "trim_lines", !trimLines ? "enable" : "disable", "social-writing");
        }} />
      </section>
      <MetricGrid>
        <MetricCard label="Characters" value={formatNumber(output.length)} />
        <MetricCard label="Lines" value={formatNumber(countLines(output))} />
        <MetricCard label="Mode" value={mode === "mono" ? "Monospace" : mode === "none" ? "Plain" : mode} />
      </MetricGrid>
    </div>
  );
}
