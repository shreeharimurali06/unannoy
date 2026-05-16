"use client";

import { CheckCircle2, Code2, FileCode2, FileJson2, FileText, ListChecks, Minimize2, RotateCcw, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { MetricCard } from "@/components/tools/metric-card";
import { ToolInputOutputLayout } from "@/components/tools/tool-input-output-layout";
import { formatJson, formatXml, minifyJson, validateJson, validateXml } from "@/lib/developer";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type Indentation = "2" | "4" | "tabs";
type JsonAction = "format" | "minify" | "validate";
type XmlAction = "format" | "validate";

const jsonSample = `{"name":"Unannoy","tools":[{"slug":"json-formatter","local":true},{"slug":"markdown-viewer","local":true}],"settings":{"theme":"system","uploads":false}}`;

const xmlSample = `<toolbox><tool slug="xml-formatter" local="true"><name>XML Formatter</name><features><feature>Format</feature><feature>Validate</feature></features></tool></toolbox>`;

const markdownSample = `# Release Notes

Preview Markdown before publishing.

## Changes

- Added local rendering
- Supports **bold**, _italic_, links, and \`inline code\`
- Keeps drafts in your browser

| Area | Status |
| --- | --- |
| Preview | Ready |
| Copy HTML | Ready |

> Small checks prevent loud mistakes.

\`\`\`ts
const localOnly = true;
\`\`\`
`;

function indentationSize(indentation: Indentation) {
  return indentation === "4" ? 4 : 2;
}

function applyTabIndent(text: string, spacesPerLevel = 2) {
  return text
    .split("\n")
    .map((line) => {
      const match = line.match(/^ +/);
      if (!match) return line;
      const tabs = "\t".repeat(Math.floor(match[0].length / spacesPerLevel));
      const spaces = " ".repeat(match[0].length % spacesPerLevel);
      return `${tabs}${spaces}${line.slice(match[0].length)}`;
    })
    .join("\n");
}

function friendlyJsonError(error: ReturnType<typeof validateJson>["error"]) {
  if (!error) return "";
  const location = error.line && error.column ? ` Line ${error.line}, column ${error.column}.` : "";
  return `${error.message}.${location}`;
}

function friendlyXmlError(error: ReturnType<typeof validateXml>["error"]) {
  if (!error) return "";
  const location = error.line && error.column ? ` Line ${error.line}, column ${error.column}.` : "";
  return `${error.message}.${location}`;
}

function trackToolUsed(toolSlug: string, action: string, length: number) {
  trackEvent("tool_used", { tool_slug: toolSlug, action, length_bucket: getLengthBucket(length) });
}

function trackOptionChanged(toolSlug: string, optionName: string) {
  trackEvent("option_changed", { tool_slug: toolSlug, option_name: optionName });
}

function ToolTextarea({
  label,
  value,
  onChange,
  placeholder,
  minHeight = "min-h-[360px]",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeight?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          "w-full resize-y rounded-[20px] border border-border bg-surface/90 p-4 font-mono text-sm leading-6 text-foreground shadow-sm transition placeholder:text-muted/75 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary",
          minHeight,
        )}
      />
    </label>
  );
}

function OutputPanel({
  title,
  text,
  toolSlug,
  empty,
  error,
}: {
  title: string;
  text: string;
  toolSlug: string;
  empty: string;
  error?: string;
}) {
  return (
    <section className="rounded-[20px] border border-border bg-surface/90 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <CopyButton text={text} toolSlug={toolSlug} disabled={!text} />
      </div>
      {error ? (
        <div className="mb-3 rounded-2xl border border-accent/40 bg-accent/10 p-3 text-sm leading-6 text-foreground">
          {error}
        </div>
      ) : null}
      <pre className="min-h-[320px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface-soft p-4 font-mono text-sm leading-6 text-foreground">
        {text || <span className="font-sans text-muted">{empty}</span>}
      </pre>
    </section>
  );
}

function IndentationControl({
  value,
  onChange,
  toolSlug,
}: {
  value: Indentation;
  onChange: (value: Indentation) => void;
  toolSlug: string;
}) {
  const options: Array<{ value: Indentation; label: string }> = [
    { value: "2", label: "2 spaces" },
    { value: "4", label: "4 spaces" },
    { value: "tabs", label: "Tabs" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold">Indentation</span>
      <div className="inline-flex rounded-full border border-border bg-surface p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              trackOptionChanged(toolSlug, "indentation");
            }}
            aria-pressed={value === option.value}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              value === option.value ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-soft hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  active,
  children,
  icon,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface hover:bg-surface-soft",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function JsonFormatterTool() {
  const toolSlug = "json-formatter";
  const [input, setInput] = useState("");
  const [action, setAction] = useState<JsonAction>("format");
  const [indentation, setIndentation] = useState<Indentation>("2");
  const lastSignature = useRef("");

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: "", valid: false };
    if (action === "minify") {
      const minified = minifyJson(input);
      return { output: minified.output, error: friendlyJsonError(minified.error), valid: minified.ok };
    }
    if (action === "validate") {
      const validation = validateJson(input);
      return {
        output: validation.ok ? "Valid JSON. The structure parses cleanly." : "",
        error: friendlyJsonError(validation.error),
        valid: validation.ok,
      };
    }

    const formatted = formatJson(input, indentationSize(indentation));
    return {
      output: formatted.ok && indentation === "tabs" ? applyTabIndent(formatted.output) : formatted.output,
      error: friendlyJsonError(formatted.error),
      valid: formatted.ok,
    };
  }, [action, indentation, input]);

  useEffect(() => {
    if (!input.trim()) {
      lastSignature.current = "";
      return;
    }

    const signature = `${action}:${indentation}:${input.length}:${result.valid}:${result.output.length}`;
    const timeout = window.setTimeout(() => {
      if (lastSignature.current === signature) return;
      lastSignature.current = signature;
      trackToolUsed(toolSlug, action, input.length);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [action, indentation, input, result.output.length, result.valid]);

  function loadSample() {
    setInput(jsonSample);
    setAction("format");
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "developer", length_bucket: getLengthBucket(jsonSample.length) });
  }

  function changeAction(nextAction: JsonAction) {
    setAction(nextAction);
    trackOptionChanged(toolSlug, "action");
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ActionButton active={action === "format"} icon={<Wand2 className="h-4 w-4" />} onClick={() => changeAction("format")}>
            Format
          </ActionButton>
          <ActionButton active={action === "minify"} icon={<Minimize2 className="h-4 w-4" />} onClick={() => changeAction("minify")}>
            Minify
          </ActionButton>
          <ActionButton active={action === "validate"} icon={<ListChecks className="h-4 w-4" />} onClick={() => changeAction("validate")}>
            Validate
          </ActionButton>
        </div>
        <IndentationControl value={indentation} onChange={setIndentation} toolSlug={toolSlug} />
      </div>

      <ToolInputOutputLayout
        input={
          <section className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Input</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={loadSample} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft">
                  <FileJson2 className="h-4 w-4" />
                  Load sample
                </button>
                <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
              </div>
            </div>
            <ToolTextarea label="JSON" value={input} onChange={setInput} placeholder='Paste JSON like {"ok": true}' />
          </section>
        }
        output={
          <OutputPanel
            title={action === "validate" ? "Validation result" : "Output"}
            text={result.output}
            toolSlug={toolSlug}
            error={result.error}
            empty="Formatted, minified, or validation output will appear here."
          />
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Output" value={result.output.length} hint="characters" />
        <MetricCard label="Status" value={input ? (result.valid ? "Valid" : "Needs fix") : "Ready"} hint="local parse" />
      </div>
    </div>
  );
}

export function XmlFormatterTool() {
  const toolSlug = "xml-formatter";
  const [input, setInput] = useState("");
  const [action, setAction] = useState<XmlAction>("format");
  const [indentation, setIndentation] = useState<Indentation>("2");
  const lastSignature = useRef("");

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: "", valid: false };
    if (action === "validate") {
      const validation = validateXml(input);
      return {
        output: validation.ok ? "Valid XML. The document has one root element and balanced tags." : "",
        error: friendlyXmlError(validation.error),
        valid: validation.ok,
      };
    }

    const formatted = formatXml(input, indentationSize(indentation));
    return {
      output: formatted.ok && indentation === "tabs" ? applyTabIndent(formatted.output) : formatted.output,
      error: friendlyXmlError(formatted.error),
      valid: formatted.ok,
    };
  }, [action, indentation, input]);

  useEffect(() => {
    if (!input.trim()) {
      lastSignature.current = "";
      return;
    }

    const signature = `${action}:${indentation}:${input.length}:${result.valid}:${result.output.length}`;
    const timeout = window.setTimeout(() => {
      if (lastSignature.current === signature) return;
      lastSignature.current = signature;
      trackToolUsed(toolSlug, action, input.length);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [action, indentation, input, result.output.length, result.valid]);

  function loadSample() {
    setInput(xmlSample);
    setAction("format");
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "developer", length_bucket: getLengthBucket(xmlSample.length) });
  }

  function changeAction(nextAction: XmlAction) {
    setAction(nextAction);
    trackOptionChanged(toolSlug, "action");
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ActionButton active={action === "format"} icon={<Wand2 className="h-4 w-4" />} onClick={() => changeAction("format")}>
            Format
          </ActionButton>
          <ActionButton active={action === "validate"} icon={<ListChecks className="h-4 w-4" />} onClick={() => changeAction("validate")}>
            Validate
          </ActionButton>
        </div>
        <IndentationControl value={indentation} onChange={setIndentation} toolSlug={toolSlug} />
      </div>

      <ToolInputOutputLayout
        input={
          <section className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Input</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={loadSample} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft">
                  <FileCode2 className="h-4 w-4" />
                  Load sample
                </button>
                <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
              </div>
            </div>
            <ToolTextarea label="XML" value={input} onChange={setInput} placeholder="<root><item>Paste XML here</item></root>" />
          </section>
        }
        output={
          <OutputPanel
            title={action === "validate" ? "Validation result" : "Output"}
            text={result.output}
            toolSlug={toolSlug}
            error={result.error}
            empty="Formatted XML or validation output will appear here."
          />
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Output" value={result.output.length} hint="characters" />
        <MetricCard label="Status" value={input ? (result.valid ? "Valid" : "Needs fix") : "Ready"} hint="local parse" />
      </div>
    </div>
  );
}

export function MarkdownViewerTool() {
  const toolSlug = "markdown-viewer";
  const [input, setInput] = useState("");
  const [breaks, setBreaks] = useState(false);
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(true);
  const lastSignature = useRef("");
  const rendered = useMemo(() => renderMarkdownToHtml(input, { breaks, openLinksInNewTab }), [breaks, input, openLinksInNewTab]);

  useEffect(() => {
    if (!input.trim()) {
      lastSignature.current = "";
      return;
    }

    const signature = `${input.length}:${rendered.html.length}:${breaks}:${openLinksInNewTab}`;
    const timeout = window.setTimeout(() => {
      if (lastSignature.current === signature) return;
      lastSignature.current = signature;
      trackToolUsed(toolSlug, "preview", input.length);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [breaks, input, openLinksInNewTab, rendered.html.length]);

  function loadSample() {
    setInput(markdownSample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "markdown", length_bucket: getLengthBucket(markdownSample.length) });
  }

  function changeBreaks(next: boolean) {
    setBreaks(next);
    trackOptionChanged(toolSlug, "breaks");
  }

  function changeLinks(next: boolean) {
    setOpenLinksInNewTab(next);
    trackOptionChanged(toolSlug, "open_links");
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={loadSample} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft">
            <FileText className="h-4 w-4" />
            Load sample
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
          <CopyButton text={rendered.html} toolSlug={toolSlug} label="Copy HTML" disabled={!rendered.html} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2">
            <input type="checkbox" checked={breaks} onChange={(event) => changeBreaks(event.target.checked)} className="h-4 w-4 accent-primary" />
            Line breaks
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2">
            <input type="checkbox" checked={openLinksInNewTab} onChange={(event) => changeLinks(event.target.checked)} className="h-4 w-4 accent-primary" />
            New-tab links
          </label>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="grid gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Markdown input</h2>
          </div>
          <ToolTextarea
            label="Source"
            value={input}
            onChange={setInput}
            placeholder="Paste Markdown with headings, lists, links, tables, quotes, or code blocks."
            minHeight="min-h-[460px]"
          />
        </section>

        <section className="rounded-[20px] border border-border bg-surface/90 p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-semibold">Rendered preview</h2>
            </div>
            <CopyButton text={rendered.html} toolSlug={toolSlug} label="Copy HTML" disabled={!rendered.html} />
          </div>
          <div
            className="min-h-[460px] overflow-auto rounded-2xl bg-surface-soft p-5 text-sm leading-7 text-foreground [&_a]:font-medium [&_a]:text-primary [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-2xl [&_pre]:bg-surface [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-surface [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc"
          >
            {rendered.html ? (
              <div dangerouslySetInnerHTML={{ __html: rendered.html }} />
            ) : (
              <p className="text-muted">Rendered Markdown will appear here as you type.</p>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Markdown" value={input.length} hint="characters" />
        <MetricCard label="HTML" value={rendered.html.length} hint="characters" />
        <MetricCard label="Preview" value={input ? "Live" : "Ready"} hint="browser-only" />
      </div>

      {input ? (
        <button
          type="button"
          onClick={() => {
            setBreaks(false);
            setOpenLinksInNewTab(true);
            trackOptionChanged(toolSlug, "preview_defaults");
          }}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
        >
          <RotateCcw className="h-4 w-4" />
          Reset preview options
        </button>
      ) : null}
    </div>
  );
}
