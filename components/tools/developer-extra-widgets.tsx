"use client";

import { CheckCircle2, Code2, FileJson2, FileText, Minimize2, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { MetricCard } from "@/components/tools/metric-card";
import { ToolInputOutputLayout } from "@/components/tools/tool-input-output-layout";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { formatJson, minifyJson, transformBase64, validateJson } from "@/lib/developer";
import type { Base64Action } from "@/lib/developer";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { cn } from "@/lib/utils";

const jsonSample = `{
  "name": "Unannoy",
  "localOnly": true,
  "tools": ["json-validator", "json-minifier"],
  "tinyProblemsFixed": 12
}`;

const markdownEditorSample = `# Tiny Launch Checklist

Draft the thing. Preview the thing. Ship the thing.

| Task | Status |
| --- | --- |
| Copy check | Done |
| Mobile glance | Needed |

> If it saves one tab, it counts.

- Keep it readable
- Keep it local
- Keep it slightly cheerful
`;

function friendlyJsonError(error: ReturnType<typeof validateJson>["error"]) {
  if (!error) return "";
  const location = error.line && error.column ? ` Line ${error.line}, column ${error.column}.` : "";
  return `${error.message}.${location}`;
}

function trackOpen(toolSlug: string, category: string) {
  trackEvent("tool_opened", { tool_slug: toolSlug, category });
}

function trackOption(toolSlug: string, optionName: string, action: string, category: string) {
  trackEvent("option_changed", { tool_slug: toolSlug, option_name: optionName, action, category });
}

function useTrackedUse(toolSlug: string, action: string, category: string, input: string, signaturePart: string) {
  const lastSignature = useRef("");

  useEffect(() => {
    if (!input.trim()) {
      lastSignature.current = "";
      return;
    }

    const signature = `${action}:${input.length}:${signaturePart}`;
    const timeout = window.setTimeout(() => {
      if (lastSignature.current === signature) return;
      lastSignature.current = signature;
      trackEvent("tool_used", {
        tool_slug: toolSlug,
        action,
        category,
        length_bucket: getLengthBucket(input.length),
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [action, category, input, signaturePart, toolSlug]);
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
          "w-full resize-y rounded-[20px] border border-border bg-surface/90 p-4 font-mono text-sm leading-6 text-foreground shadow-sm transition placeholder:text-muted/75 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary",
          readOnly && "bg-surface-soft",
          minHeight,
        )}
      />
    </label>
  );
}

function OutputBox({
  title,
  text,
  empty,
  error,
  toolSlug,
  copyLabel,
}: {
  title: string;
  text: string;
  empty: string;
  error?: string;
  toolSlug: string;
  copyLabel?: string;
}) {
  return (
    <section className="rounded-[20px] border border-border bg-surface/90 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <CopyButton text={text} toolSlug={toolSlug} label={copyLabel} disabled={!text} />
      </div>
      {error ? (
        <div className="mb-3 rounded-2xl border border-accent/45 bg-accent/10 p-3 text-sm leading-6 text-foreground">
          {error}
        </div>
      ) : null}
      <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface-soft p-4 font-mono text-sm leading-6">
        {text || <span className="font-sans text-muted">{empty}</span>}
      </pre>
    </section>
  );
}

function ActionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-soft",
      )}
    >
      {children}
    </button>
  );
}

export function Base64EncoderDecoderTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [action, setAction] = useState<Base64Action>("encode");

  useEffect(() => trackOpen(toolSlug, "developer"), [toolSlug]);

  const result = useMemo(() => transformBase64(input, action), [action, input]);
  useTrackedUse(toolSlug, action, "developer", input, `${result.ok}:${result.output.length}`);

  function loadSample() {
    const sample = action === "encode" ? "Unannoy fixes tiny annoying digital tasks." : "VW5hbm5veSBmaXhlcyB0aW55IGFubm95aW5nIGRpZ2l0YWwgdGFza3Mu";
    setInput(sample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "developer", length_bucket: getLengthBucket(sample.length) });
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ActionButton
            active={action === "encode"}
            onClick={() => {
              setAction("encode");
              trackOption(toolSlug, "action", "encode", "developer");
            }}
          >
            Encode
          </ActionButton>
          <ActionButton
            active={action === "decode"}
            onClick={() => {
              setAction("decode");
              trackOption(toolSlug, "action", "decode", "developer");
            }}
          >
            Decode
          </ActionButton>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
          >
            <Sparkles className="h-4 w-4" />
            Load sample
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
        </div>
      </div>

      <ToolInputOutputLayout
        input={<TextPanel label={action === "encode" ? "Text to encode" : "Base64 to decode"} value={input} onChange={setInput} placeholder="Paste text or Base64 here. It stays in this browser tab." />}
        output={<OutputBox title="Output" text={result.output} empty="Converted text will appear here." error={result.error} toolSlug={toolSlug} copyLabel="Copy output" />}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Output" value={result.output.length} hint="characters" />
        <MetricCard label="Status" value={!input ? "Ready" : result.ok ? "Converted" : "Needs fix"} hint="UTF-8 friendly" />
      </div>
    </div>
  );
}

export function JsonValidatorTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [formatValidJson, setFormatValidJson] = useState(true);

  useEffect(() => trackOpen(toolSlug, "developer"), [toolSlug]);

  const validation = useMemo(() => validateJson(input), [input]);
  const formatted = useMemo(() => (input.trim() && validation.ok && formatValidJson ? formatJson(input, 2).output : ""), [formatValidJson, input, validation.ok]);
  const statusText = !input.trim() ? "" : validation.ok ? "Valid JSON. Structurally tidy enough to proceed." : "";
  const output = formatted || statusText;
  const error = friendlyJsonError(validation.error);
  useTrackedUse(toolSlug, validation.ok ? "valid" : "invalid", "developer", input, `${validation.ok}:${output.length}`);

  function loadSample() {
    setInput(jsonSample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "developer", length_bucket: getLengthBucket(jsonSample.length) });
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
        >
          <FileJson2 className="h-4 w-4" />
          Load sample
        </button>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            active={formatValidJson}
            onClick={() => {
              setFormatValidJson((current) => !current);
              trackOption(toolSlug, "format_valid_json", formatValidJson ? "disable" : "enable", "developer");
            }}
          >
            Format valid JSON
          </ActionButton>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
        </div>
      </div>

      <ToolInputOutputLayout
        input={<TextPanel label="JSON to validate" value={input} onChange={setInput} placeholder='Paste JSON like {"valid": true}. Errors will be friendlier than the usual wall of nope.' />}
        output={<OutputBox title="Validation result" text={output} empty="Validation status will appear here." error={error} toolSlug={toolSlug} copyLabel="Copy result" />}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Status" value={!input.trim() ? "Ready" : validation.ok ? "Valid" : "Invalid"} hint="browser parse" />
        <MetricCard label="Position" value={validation.error?.position ?? "-"} hint="if available" />
      </div>
    </div>
  );
}

export function JsonMinifierTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");

  useEffect(() => trackOpen(toolSlug, "developer"), [toolSlug]);

  const result = useMemo(() => (input.trim() ? minifyJson(input) : { ok: true, input, output: "" }), [input]);
  const error = friendlyJsonError(result.error);
  const before = input.length;
  const after = result.output.length;
  const saved = Math.max(0, before - after);
  useTrackedUse(toolSlug, result.ok ? "minify" : "invalid", "developer", input, `${result.ok}:${after}`);

  function loadSample() {
    setInput(jsonSample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "developer", length_bucket: getLengthBucket(jsonSample.length) });
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
        >
          <Minimize2 className="h-4 w-4" />
          Load sample
        </button>
        <div className="flex flex-wrap gap-2">
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
          <CopyButton text={result.output} toolSlug={toolSlug} label="Copy minified JSON" disabled={!result.output} />
        </div>
      </div>

      <ToolInputOutputLayout
        input={<TextPanel label="JSON to minify" value={input} onChange={setInput} placeholder='Paste formatted JSON here. Whitespace will politely leave.' />}
        output={<OutputBox title="Minified JSON" text={result.output} empty="Minified JSON will appear here." error={error} toolSlug={toolSlug} copyLabel="Copy JSON" />}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard label="Before" value={before} hint="characters" />
        <MetricCard label="After" value={after} hint="characters" />
        <MetricCard label="Saved" value={saved} hint="characters" />
        <MetricCard label="Status" value={!input.trim() ? "Ready" : result.ok ? "Minified" : "Invalid"} hint="local parse" />
      </div>
    </div>
  );
}

export function MarkdownEditorTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [breaks, setBreaks] = useState(false);
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(true);

  useEffect(() => trackOpen(toolSlug, "markdown"), [toolSlug]);

  const rendered = useMemo(() => renderMarkdownToHtml(input, { breaks, openLinksInNewTab }), [breaks, input, openLinksInNewTab]);
  useTrackedUse(toolSlug, "preview", "markdown", input, `${rendered.html.length}:${breaks}:${openLinksInNewTab}`);

  function loadSample() {
    setInput(markdownEditorSample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "markdown", length_bucket: getLengthBucket(markdownEditorSample.length) });
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
          >
            <FileText className="h-4 w-4" />
            Load sample
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
          <CopyButton text={input} toolSlug={toolSlug} label="Copy Markdown" disabled={!input} />
          <CopyButton text={rendered.html} toolSlug={toolSlug} label="Copy HTML" disabled={!rendered.html} />
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            active={breaks}
            onClick={() => {
              setBreaks((current) => !current);
              trackOption(toolSlug, "breaks", breaks ? "disable" : "enable", "markdown");
            }}
          >
            Line breaks
          </ActionButton>
          <ActionButton
            active={openLinksInNewTab}
            onClick={() => {
              setOpenLinksInNewTab((current) => !current);
              trackOption(toolSlug, "open_links", openLinksInNewTab ? "disable" : "enable", "markdown");
            }}
          >
            New-tab links
          </ActionButton>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Markdown editor</h2>
          </div>
          <TextPanel
            label="Markdown"
            value={input}
            onChange={setInput}
            placeholder="Write or paste Markdown here. The preview will keep up without getting dramatic."
            minHeight="min-h-[520px]"
          />
        </section>

        <section className="rounded-[20px] border border-border bg-surface/90 p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold">Preview</h2>
            </div>
            <CopyButton text={rendered.html} toolSlug={toolSlug} label="Copy HTML" disabled={!rendered.html} />
          </div>
          <div
            className="min-h-[520px] overflow-auto rounded-2xl bg-surface-soft p-5 text-sm leading-7 text-foreground [&_a]:font-medium [&_a]:text-primary [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-2xl [&_pre]:bg-surface [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-surface [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc"
          >
            {rendered.html ? (
              <div dangerouslySetInnerHTML={{ __html: rendered.html }} />
            ) : (
              <p className="text-muted">Your rendered preview will appear here. Headings, tables, lists, quotes, and code blocks are welcome.</p>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Markdown" value={input.length} hint="characters" />
        <MetricCard label="HTML" value={rendered.html.length} hint="characters" />
        <MetricCard label="Preview" value={input ? "Live" : "Ready"} hint="browser-only" />
      </div>

      {rendered.html ? (
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          Rendered locally. No Markdown left the tab.
        </div>
      ) : null}
    </div>
  );
}
