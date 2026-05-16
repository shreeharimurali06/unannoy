"use client";

import { FileText, Link2, QrCode, Sparkles, Upload, Wand2 } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { DownloadButton } from "@/components/tools/download-button";
import { MetricCard } from "@/components/tools/metric-card";
import { ToolInputOutputLayout } from "@/components/tools/tool-input-output-layout";
import { getFileSizeBucket, getLengthBucket, trackEvent } from "@/lib/analytics";
import { formatXml, validateXml } from "@/lib/developer";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type FormatKind = "html" | "css" | "javascript";
type TableInputMode = "csv" | "tsv" | "html";

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

const samples = {
  html: `<main><h1>Unannoy</h1><p>Tiny browser tools.</p><ul><li>Local</li><li>Fast</li></ul></main>`,
  css: `.tool{display:flex;gap:1rem;color:#1f2937}.tool:hover{color:#2563eb}@media (max-width:640px){.tool{display:block}}`,
  javascript: `function scoreTools(items){return items.filter((item)=>item.local).map((item)=>({slug:item.slug,score:item.uses+1}));}`,
  markdown: `# Tiny Tool Note\n\n- Runs locally\n- Copies clean output\n\n[Visit Unannoy](https://example.com)`,
  htmlMarkdown: `<h1>Tiny Tool Note</h1><p>Runs locally and copies clean output.</p><ul><li>Markdown</li><li>HTML</li></ul>`,
  table: `Name,Category,Local\nJSON Formatter,Developer,Yes\nUTM Builder,Links,Yes`,
  utmUrl: "https://example.com/launch",
  qrText: "https://example.com/tools",
};

function safeTrack(name: Parameters<typeof trackEvent>[0], properties: Parameters<typeof trackEvent>[1]) {
  trackEvent(name, properties);
}

function useToolOpened(toolSlug: string, category: string) {
  useEffect(() => safeTrack("tool_opened", { tool_slug: toolSlug, category }), [category, toolSlug]);
}

function useTrackedUse(toolSlug: string, action: string, category: string, input: string, signature: string) {
  const last = useRef("");

  useEffect(() => {
    if (!input.trim()) {
      last.current = "";
      return;
    }

    const next = `${action}:${input.length}:${signature}`;
    const timeout = window.setTimeout(() => {
      if (last.current === next) return;
      last.current = next;
      safeTrack("tool_used", { tool_slug: toolSlug, action, category, length_bucket: getLengthBucket(input.length) });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [action, category, input, signature, toolSlug]);
}

function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  minHeight = "min-h-[320px]",
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
  copyLabel = "Copy output",
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
      {error ? <div className="mb-3 rounded-2xl border border-accent/45 bg-accent/10 p-3 text-sm leading-6">{error}</div> : null}
      <pre className="min-h-[260px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface-soft p-4 font-mono text-sm leading-6">
        {text || <span className="font-sans text-muted">{empty}</span>}
      </pre>
    </section>
  );
}

function ActionButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
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

function formatDelimitedCode(input: string, kind: FormatKind, spaces: number) {
  const text = input.replace(/\r\n?/g, "\n").trim();
  if (!text) return { output: "", error: "" };

  if (kind === "html") {
    const validation = validateXml(text);
    const formatted = formatXml(text, spaces);
    if (formatted.ok) return { output: formatted.output, error: "" };

    const tokens = text.replace(/>\s+</g, "><").match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g);
    if (!tokens) return { output: "", error: validation.error?.message ?? "Could not read the HTML." };
    let depth = 0;
    const lines = tokens
      .map((token) => {
        const trimmed = token.trim();
        if (!trimmed) return "";
        if (/^<\//.test(trimmed)) depth = Math.max(0, depth - 1);
        const line = `${" ".repeat(depth * spaces)}${trimmed}`;
        if (/^<[^!/][^>]*[^/]?>$/.test(trimmed) && !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(trimmed)) depth += 1;
        return line;
      })
      .filter(Boolean);
    return { output: lines.join("\n"), error: validation.ok ? "" : "Formatted as HTML. XML-only validation found tag issues, so review browser-specific markup." };
  }

  const normalized = text.replace(/\s*([{}])\s*/g, "\n$1\n").replace(/\s*;\s*/g, ";\n").replace(/\n{2,}/g, "\n");
  let depth = 0;
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("}")) depth = Math.max(0, depth - 1);
      const output = `${" ".repeat(depth * spaces)}${line}`;
      if (line.endsWith("{")) depth += 1;
      return output;
    });

  return { output: lines.join("\n"), error: depth === 0 ? "" : "Formatted output, but braces look unbalanced." };
}

function htmlToMarkdown(html: string) {
  if (!html.trim()) return { output: "", error: "" };
  if (typeof DOMParser === "undefined") return { output: "", error: "HTML parsing is not available in this browser." };
  const doc = new DOMParser().parseFromString(html, "text/html");

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (!(node instanceof HTMLElement)) return Array.from(node.childNodes).map(walk).join("");
    const content = Array.from(node.childNodes).map(walk).join("").trim();
    const tag = node.tagName.toLowerCase();
    if (/h[1-6]/.test(tag)) return `${"#".repeat(Number(tag[1]))} ${content}\n\n`;
    if (tag === "p") return `${content}\n\n`;
    if (tag === "br") return "\n";
    if (tag === "strong" || tag === "b") return `**${content}**`;
    if (tag === "em" || tag === "i") return `_${content}_`;
    if (tag === "code") return `\`${content}\``;
    if (tag === "pre") return `\`\`\`\n${node.textContent?.trim() ?? ""}\n\`\`\`\n\n`;
    if (tag === "a") return `[${content || node.getAttribute("href")}](${node.getAttribute("href") ?? ""})`;
    if (tag === "li") return `- ${content}\n`;
    if (tag === "ul" || tag === "ol") return `${Array.from(node.children).map(walk).join("")}\n`;
    if (tag === "blockquote") return `${content.split("\n").map((line) => `> ${line}`).join("\n")}\n\n`;
    return Array.from(node.childNodes).map(walk).join("");
  }

  return { output: Array.from(doc.body.childNodes).map(walk).join("").replace(/\n{3,}/g, "\n\n").trim(), error: "" };
}

function parseRows(input: string, mode: TableInputMode) {
  if (!input.trim()) return [];
  if (mode === "html" && typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return Array.from(doc.querySelectorAll("tr")).map((row) => Array.from(row.querySelectorAll("th,td")).map((cell) => cell.textContent?.trim() ?? ""));
  }
  const delimiter = mode === "tsv" ? "\t" : ",";
  return input.replace(/\r\n?/g, "\n").split("\n").filter(Boolean).map((line) => line.split(delimiter).map((cell) => cell.trim()));
}

function rowsToMarkdown(rows: string[]) {
  return rows.map((cell) => cell.replace(/\|/g, "\\|").trim());
}

function tableToMarkdown(input: string, mode: TableInputMode) {
  const rows = parseRows(input, mode).filter((row) => row.length > 0);
  if (rows.length === 0) return "";
  const width = Math.max(...rows.map((row) => row.length));
  const filled = rows.map((row) => Array.from({ length: width }, (_, index) => row[index] ?? ""));
  const header = rowsToMarkdown(filled[0]);
  const body = filled.slice(1).map((row) => `| ${rowsToMarkdown(row).join(" | ")} |`);
  return [`| ${header.join(" | ")} |`, `| ${header.map(() => "---").join(" | ")} |`, ...body].join("\n");
}

export function CodeFormatterTool({ toolSlug, kind }: { toolSlug: string; kind: FormatKind }) {
  const [input, setInput] = useState("");
  const [spaces, setSpaces] = useState(2);
  useToolOpened(toolSlug, "developer");
  const result = useMemo(() => formatDelimitedCode(input, kind, spaces), [input, kind, spaces]);
  useTrackedUse(toolSlug, "format", "developer", input, `${result.output.length}:${spaces}`);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[2, 4].map((size) => <ActionButton key={size} active={spaces === size} onClick={() => setSpaces(size)}>{size} spaces</ActionButton>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setInput(samples[kind])} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-soft">
            <Wand2 className="h-4 w-4" /> Load sample
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
        </div>
      </div>
      <ToolInputOutputLayout
        input={<TextPanel label="Input" value={input} onChange={setInput} placeholder={`Paste ${kind.toUpperCase()} to format.`} />}
        output={<OutputBox title="Formatted output" text={result.output} empty="Formatted code will appear here." error={result.error} toolSlug={toolSlug} />}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Output" value={result.output.length} hint="characters" />
        <MetricCard label="Indent" value={spaces} hint="spaces" />
      </div>
    </div>
  );
}

export function XmlValidatorTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  useToolOpened(toolSlug, "developer");
  const result = useMemo(() => validateXml(input), [input]);
  const error = input.trim() && result.error ? `${result.error.message}${result.error.line ? ` Line ${result.error.line}, column ${result.error.column ?? 1}.` : ""}` : "";
  useTrackedUse(toolSlug, "validate", "developer", input, `${result.ok}:${error}`);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setInput(samples.html.replace("main", "tool").replace("/main", "/tool"))} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-soft">
          <Sparkles className="h-4 w-4" /> Load sample
        </button>
        <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
      </div>
      <ToolInputOutputLayout
        input={<TextPanel label="XML input" value={input} onChange={setInput} placeholder="Paste XML to validate." />}
        output={<OutputBox title={input && result.ok ? "Valid XML" : "Validation result"} text={result.ok && input ? "XML is well formed." : ""} empty="Validation status will appear here." error={error} toolSlug={toolSlug} />}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Status" value={!input ? "Ready" : result.ok ? "Valid" : "Invalid"} />
        <MetricCard label="Mode" value="XML" hint="browser parser" />
      </div>
    </div>
  );
}

export function MarkdownConverterTool({ toolSlug, mode }: { toolSlug: string; mode: "to-html" | "from-html" }) {
  const [input, setInput] = useState("");
  useToolOpened(toolSlug, "markdown");
  const result = useMemo(() => mode === "to-html" ? { output: renderMarkdownToHtml(input, { openLinksInNewTab: true }).html, error: "" } : htmlToMarkdown(input), [input, mode]);
  useTrackedUse(toolSlug, mode, "markdown", input, `${result.output.length}:${result.error}`);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setInput(mode === "to-html" ? samples.markdown : samples.htmlMarkdown)} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-soft">
          <FileText className="h-4 w-4" /> Load sample
        </button>
        <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
      </div>
      <ToolInputOutputLayout
        input={<TextPanel label={mode === "to-html" ? "Markdown input" : "HTML input"} value={input} onChange={setInput} placeholder={mode === "to-html" ? "Paste Markdown to convert." : "Paste HTML to convert."} />}
        output={<OutputBox title={mode === "to-html" ? "HTML output" : "Markdown output"} text={result.output} empty="Converted output will appear here." error={result.error} toolSlug={toolSlug} />}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Output" value={result.output.length} hint="characters" />
        <MetricCard label="Conversion" value={mode === "to-html" ? "MD -> HTML" : "HTML -> MD"} />
      </div>
    </div>
  );
}

export function TableMarkdownTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<TableInputMode>("csv");
  useToolOpened(toolSlug, "markdown");
  const output = useMemo(() => tableToMarkdown(input, mode), [input, mode]);
  useTrackedUse(toolSlug, "convert", "markdown", input, `${mode}:${output.length}`);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["csv", "tsv", "html"] as const).map((next) => <ActionButton key={next} active={mode === next} onClick={() => setMode(next)}>{next.toUpperCase()}</ActionButton>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setInput(samples.table)} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-soft">
            <Sparkles className="h-4 w-4" /> Load sample
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
        </div>
      </div>
      <ToolInputOutputLayout
        input={<TextPanel label="Table input" value={input} onChange={setInput} placeholder="Paste CSV, TSV, or an HTML table." />}
        output={<OutputBox title="Markdown table" text={output} empty="Markdown table output will appear here." toolSlug={toolSlug} />}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Rows" value={parseRows(input, mode).length} />
        <MetricCard label="Output" value={output.length} hint="characters" />
        <MetricCard label="Mode" value={mode.toUpperCase()} />
      </div>
    </div>
  );
}

export function UtmBuilderTool({ toolSlug }: { toolSlug: string }) {
  const [baseUrl, setBaseUrl] = useState("");
  const [params, setParams] = useState({ utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" });
  useToolOpened(toolSlug, "links");
  const result = useMemo(() => {
    if (!baseUrl.trim()) return { output: "", error: "" };
    try {
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([key, value]) => {
        if (value.trim()) url.searchParams.set(key, value.trim());
      });
      return { output: url.toString(), error: "" };
    } catch {
      return { output: "", error: "Enter a full URL including https:// or http://." };
    }
  }, [baseUrl, params]);
  useTrackedUse(toolSlug, "build", "links", baseUrl + Object.values(params).join(""), result.output);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setBaseUrl(samples.utmUrl); setParams({ utm_source: "newsletter", utm_medium: "email", utm_campaign: "spring_launch", utm_term: "", utm_content: "hero_button" }); }} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-soft">
          <Link2 className="h-4 w-4" /> Load sample
        </button>
        <ClearButton onClear={() => { setBaseUrl(""); setParams({ utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" }); }} toolSlug={toolSlug} disabled={!baseUrl && Object.values(params).every((value) => !value)} />
      </div>
      <div className="grid gap-4 rounded-[20px] border border-border bg-surface/90 p-4 shadow-sm md:grid-cols-2">
        <label className="md:col-span-2"><span className="mb-2 block text-sm font-semibold">Destination URL</span><input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://example.com/page" className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm" /></label>
        {Object.keys(params).map((key) => (
          <label key={key}><span className="mb-2 block text-sm font-semibold">{key}</span><input value={params[key as keyof typeof params]} onChange={(event) => setParams((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm" /></label>
        ))}
      </div>
      <OutputBox title="Campaign URL" text={result.output} empty="Your UTM URL will appear here." error={result.error} toolSlug={toolSlug} copyLabel="Copy URL" />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="URL length" value={result.output.length} />
        <MetricCard label="Parameters" value={Object.values(params).filter(Boolean).length} />
        <MetricCard label="Status" value={!baseUrl ? "Ready" : result.error ? "Needs URL" : "Built"} />
      </div>
    </div>
  );
}

export function QrCodeGeneratorTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  useToolOpened(toolSlug, "links");

  useEffect(() => {
    if (!input.trim()) {
      return;
    }
    let cancelled = false;
    import("qrcode")
      .then((qr) => qr.toString(input, { type: "svg", margin: 2, width: 320, errorCorrectionLevel: "M" }))
      .then((next) => {
        if (!cancelled) {
          setSvg(next);
          setError("");
          safeTrack("tool_used", { tool_slug: toolSlug, action: "generate", category: "links", length_bucket: getLengthBucket(input.length) });
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not generate a QR code for this input.");
      });
    return () => {
      cancelled = true;
    };
  }, [input, toolSlug]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setInput(samples.qrText)} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-soft">
          <QrCode className="h-4 w-4" /> Load sample
        </button>
        <ClearButton onClear={() => { setInput(""); setSvg(""); setError(""); }} toolSlug={toolSlug} disabled={!input} />
        <DownloadButton content={svg} filename="qr-code.svg" mimeType="image/svg+xml" toolSlug={toolSlug} />
      </div>
      <ToolInputOutputLayout
        input={<TextPanel label="QR content" value={input} onChange={(value) => { setInput(value); if (!value) { setSvg(""); setError(""); } }} placeholder="Enter a URL, Wi-Fi string, contact card, or plain text." minHeight="min-h-[260px]" />}
        output={<section className="rounded-[20px] border border-border bg-surface/90 p-4 shadow-sm"><div className="mb-3 flex items-center justify-between gap-2"><h2 className="text-sm font-semibold">QR preview</h2><CopyButton text={svg} toolSlug={toolSlug} label="Copy SVG" disabled={!svg} /></div>{error ? <div className="mb-3 rounded-2xl border border-accent/45 bg-accent/10 p-3 text-sm">{error}</div> : null}<div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-surface-soft p-5">{svg ? <div className="h-72 w-72" dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="text-sm text-muted">QR code will appear here.</p>}</div></section>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Format" value="SVG" />
        <MetricCard label="Status" value={!input ? "Ready" : svg ? "Generated" : "Working"} />
      </div>
    </div>
  );
}

export function QrCodeReaderTool({ toolSlug }: { toolSlug: string }) {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  useToolOpened(toolSlug, "links");

  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult("");
    setError("");
    safeTrack("file_loaded", { tool_slug: toolSlug, file_size_bucket: getFileSizeBucket(file.size) });

    try {
      const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
      if (!Detector) {
        setError("This browser does not expose QR scanning yet. Try Chrome or Edge, or use your camera app for this image.");
        return;
      }
      const detector = new Detector({ formats: ["qr_code"] });
      const bitmap = await createImageBitmap(file);
      const codes = await detector.detect(bitmap);
      bitmap.close();
      const value = codes[0]?.rawValue ?? "";
      if (!value) {
        setError("No QR code was found in that image.");
        return;
      }
      setResult(value);
      safeTrack("file_processed", { tool_slug: toolSlug, action: "decode", file_size_bucket: getFileSizeBucket(file.size) });
    } catch {
      setError("Could not read that image. Try a clearer PNG or JPG with one QR code.");
    }
  }

  return (
    <div className="grid gap-5">
      <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-border bg-surface/90 p-6 text-center shadow-sm transition hover:bg-surface-soft">
        <Upload className="h-8 w-8 text-primary" />
        <span className="text-sm font-semibold">Choose a QR image</span>
        <span className="text-sm text-muted">PNG, JPG, or WebP. Processing stays in your browser.</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={readFile} className="sr-only" />
      </label>
      <OutputBox title={fileName ? `Decoded result from ${fileName}` : "Decoded result"} text={result} empty="Decoded QR text will appear here." error={error} toolSlug={toolSlug} copyLabel="Copy result" />
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Result" value={result.length} hint="characters" />
        <MetricCard label="File" value={fileName || "None"} />
        <MetricCard label="Status" value={error ? "Needs retry" : result ? "Decoded" : "Ready"} />
      </div>
    </div>
  );
}

export function MarkdownTableGeneratorTool({ toolSlug }: { toolSlug: string }) {
  return <TableMarkdownTool toolSlug={toolSlug} />;
}
