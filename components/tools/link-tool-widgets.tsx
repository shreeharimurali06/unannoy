"use client";

import { Check, Link2, Scissors, Sparkles, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { MetricCard } from "@/components/tools/metric-card";
import { ToolInputOutputLayout } from "@/components/tools/tool-input-output-layout";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { cleanUrl, generateSlug, transformUrlEncoding } from "@/lib/links";
import type { SlugSeparator, UrlCleanMode, UrlEncodingAction, UrlEncodeMode } from "@/lib/links";
import { cn } from "@/lib/utils";

const urlSample = "https://example.com/posts/tiny-tools?utm_source=newsletter&utm_medium=email&utm_campaign=launch&fbclid=abc123&ref=homepage#notes";
const slugSample = "Tiny Tools for Wildly Annoying Tasks: A Practical Guide";
const encodingSample = "name=Unannoy tools&note=tiny fixes, fewer tabs";
const encodedSample = "name%3DUnannoy%20tools%26note%3Dtiny%20fixes%2C%20fewer%20tabs";

function trackOpen(toolSlug: string, category = "links") {
  trackEvent("tool_opened", { tool_slug: toolSlug, category });
}

function trackOption(toolSlug: string, optionName: string, action: string, category = "links") {
  trackEvent("option_changed", { tool_slug: toolSlug, option_name: optionName, action, category });
}

function useTrackedUse(toolSlug: string, action: string, category: string, input: string, resultSignature: string) {
  const lastSignature = useRef("");

  useEffect(() => {
    if (!input.trim()) {
      lastSignature.current = "";
      return;
    }

    const signature = `${action}:${input.length}:${resultSignature}`;
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
  }, [action, category, input, resultSignature, toolSlug]);
}

function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  minHeight = "min-h-[280px]",
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
      <pre className="min-h-[220px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface-soft p-4 font-mono text-sm leading-6">
        {text || <span className="font-sans text-muted">{empty}</span>}
      </pre>
    </section>
  );
}

function UrlCleanupTool({
  toolSlug,
  defaultMode,
  title,
  sampleLabel,
}: {
  toolSlug: string;
  defaultMode: UrlCleanMode;
  title: string;
  sampleLabel: string;
}) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<UrlCleanMode>(defaultMode);
  const [removeHash, setRemoveHash] = useState(false);

  useEffect(() => trackOpen(toolSlug), [toolSlug]);

  const result = useMemo(() => cleanUrl(input, { mode, removeHash }), [input, mode, removeHash]);
  useTrackedUse(toolSlug, mode === "utm-only" ? "remove_utm" : "clean_url", "links", input, `${result.cleanedUrl.length}:${result.removedParameters.length}:${removeHash}`);

  function loadSample() {
    setInput(urlSample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "links", length_bucket: getLengthBucket(urlSample.length) });
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link2 className="h-4 w-4 text-primary" />
          {title}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
          >
            <Sparkles className="h-4 w-4" />
            {sampleLabel}
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
          <CopyButton text={result.cleanedUrl} toolSlug={toolSlug} label="Copy cleaned URL" disabled={!result.cleanedUrl} />
        </div>
      </div>

      <ToolInputOutputLayout
        input={<TextPanel label="URL to clean" value={input} onChange={setInput} placeholder="Paste the long, suspiciously chatty URL here." />}
        output={<OutputBox title="Cleaned URL" text={result.cleanedUrl} empty="Your cleaned URL will appear here, minus the marketing confetti." error={result.error} toolSlug={toolSlug} copyLabel="Copy URL" />}
      />

      <section className="rounded-[20px] border border-border bg-surface/80 p-4 shadow-sm">
        <p className="text-sm font-semibold">Original URL</p>
        <p className="mt-2 break-all rounded-2xl bg-surface-soft p-3 font-mono text-sm leading-6 text-muted">
          {result.originalUrl || "Paste a URL and the original normalized link will appear here for comparison."}
        </p>
      </section>

      <section className="grid gap-4 rounded-[20px] border border-border bg-surface-soft/65 p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-wrap gap-2">
          <ChipToggle
            checked={mode === "utm-only"}
            label="Remove UTM only"
            onClick={() => {
              setMode("utm-only");
              trackOption(toolSlug, "clean_mode", "utm-only");
            }}
          />
          <ChipToggle
            checked={mode === "known-trackers"}
            label="Remove known trackers"
            onClick={() => {
              setMode("known-trackers");
              trackOption(toolSlug, "clean_mode", "known-trackers");
            }}
          />
          <ChipToggle
            checked={removeHash}
            label="Remove #fragment"
            onClick={() => {
              setRemoveHash((current) => !current);
              trackOption(toolSlug, "remove_hash", removeHash ? "disable" : "enable");
            }}
          />
        </div>
        <div className="rounded-2xl border border-border bg-surface/80 p-3">
          <p className="text-sm font-semibold">Removed parameters</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.removedParameters.length ? (
              result.removedParameters.map((parameter, index) => (
                <span key={`${parameter.name}-${index}`} className="rounded-full border border-border bg-surface-soft px-3 py-1 text-xs font-medium">
                  {parameter.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted">None yet. Either tidy already, or waiting for a URL.</span>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Original length" value={input.length} hint="characters" />
        <MetricCard label="Clean length" value={result.cleanedUrl.length} hint="characters" />
        <MetricCard label="Parameters removed" value={result.removedParameters.length} hint="tracked crumbs" />
      </div>
    </div>
  );
}

export function UrlCleanerTool({ toolSlug }: { toolSlug: string }) {
  return <UrlCleanupTool toolSlug={toolSlug} defaultMode="known-trackers" title="Tracking cleanup" sampleLabel="Load sample" />;
}

export function UtmRemoverTool({ toolSlug }: { toolSlug: string }) {
  return <UrlCleanupTool toolSlug={toolSlug} defaultMode="utm-only" title="UTM removal" sampleLabel="Load sample" />;
}

export function SlugGeneratorTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [separator, setSeparator] = useState<SlugSeparator>("-");
  const [maxLength, setMaxLength] = useState(80);
  const [removeSpecialCharacters, setRemoveSpecialCharacters] = useState(true);

  useEffect(() => trackOpen(toolSlug), [toolSlug]);

  const result = useMemo(
    () => generateSlug(input, { lowercase, removeStopWords, separator, maxLength, removeSpecialCharacters }),
    [input, lowercase, maxLength, removeSpecialCharacters, removeStopWords, separator],
  );
  useTrackedUse(toolSlug, "generate_slug", "links", input, `${result.slug.length}:${separator}:${maxLength}`);

  function loadSample() {
    setInput(slugSample);
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "links", length_bucket: getLengthBucket(slugSample.length) });
  }

  return (
    <div className="grid gap-5">
      <ToolInputOutputLayout
        input={<TextPanel label="Title or text" value={input} onChange={setInput} placeholder="Paste a title, heading, product name, or idea that needs a clean URL slug." minHeight="min-h-[300px]" />}
        output={<OutputBox title="Slug" text={result.slug} empty="your-clean-slug-will-appear-here" toolSlug={toolSlug} copyLabel="Copy slug" />}
      />

      <section className="grid gap-4 rounded-[20px] border border-border bg-surface-soft/65 p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex flex-wrap gap-2">
          <ChipToggle
            checked={lowercase}
            label="Lowercase"
            onClick={() => {
              setLowercase((current) => !current);
              trackOption(toolSlug, "lowercase", lowercase ? "disable" : "enable");
            }}
          />
          <ChipToggle
            checked={removeStopWords}
            label="Remove stop words"
            onClick={() => {
              setRemoveStopWords((current) => !current);
              trackOption(toolSlug, "remove_stop_words", removeStopWords ? "disable" : "enable");
            }}
          />
          <ChipToggle
            checked={separator === "-"}
            label="Hyphen"
            onClick={() => {
              setSeparator("-");
              trackOption(toolSlug, "separator", "hyphen");
            }}
          />
          <ChipToggle
            checked={separator === "_"}
            label="Underscore"
            onClick={() => {
              setSeparator("_");
              trackOption(toolSlug, "separator", "underscore");
            }}
          />
          <ChipToggle
            checked={removeSpecialCharacters}
            label="Remove symbols"
            onClick={() => {
              setRemoveSpecialCharacters((current) => !current);
              trackOption(toolSlug, "remove_special_characters", removeSpecialCharacters ? "disable" : "enable");
            }}
          />
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Max length</span>
          <input
            type="number"
            min={0}
            max={240}
            value={maxLength}
            onChange={(event) => {
              setMaxLength(Number(event.target.value));
              trackOption(toolSlug, "max_length", "change");
            }}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-sm"
          />
        </label>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
        >
          <Wand2 className="h-4 w-4" />
          Load sample
        </button>
        <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
        <CopyButton text={result.slug} toolSlug={toolSlug} label="Copy slug" disabled={!result.slug} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input words" value={result.wordsBefore} />
        <MetricCard label="Slug words" value={result.wordsAfter} />
        <MetricCard label="Slug length" value={result.slug.length} hint="characters" />
      </div>
    </div>
  );
}

export function UrlEncoderDecoderTool({ toolSlug }: { toolSlug: string }) {
  const [input, setInput] = useState("");
  const [action, setAction] = useState<UrlEncodingAction>("encode");
  const [mode, setMode] = useState<UrlEncodeMode>("component");

  useEffect(() => trackOpen(toolSlug), [toolSlug]);

  const result = useMemo(() => transformUrlEncoding(input, action, mode), [action, input, mode]);
  useTrackedUse(toolSlug, action, "links", input, `${result.output.length}:${result.ok}:${mode}`);

  function loadSample() {
    const sample = action === "decode" ? encodedSample : encodingSample;
    setInput(sample);
    setMode("component");
    trackEvent("sample_loaded", { tool_slug: toolSlug, category: "links", length_bucket: getLengthBucket(sample.length) });
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ActionButton
            active={action === "encode"}
            onClick={() => {
              setAction("encode");
              trackOption(toolSlug, "action", "encode");
            }}
          >
            Encode
          </ActionButton>
          <ActionButton
            active={action === "decode"}
            onClick={() => {
              setAction("decode");
              trackOption(toolSlug, "action", "decode");
            }}
          >
            Decode
          </ActionButton>
          <ActionButton
            active={mode === "component"}
            onClick={() => {
              setMode("component");
              trackOption(toolSlug, "mode", "component");
            }}
          >
            Component
          </ActionButton>
          <ActionButton
            active={mode === "full-url"}
            onClick={() => {
              setMode("full-url");
              trackOption(toolSlug, "mode", "full-url");
            }}
          >
            Full URL
          </ActionButton>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-surface-soft"
          >
            <Scissors className="h-4 w-4" />
            Load sample
          </button>
          <ClearButton onClear={() => setInput("")} toolSlug={toolSlug} disabled={!input} />
        </div>
      </div>

      <ToolInputOutputLayout
        input={<TextPanel label="Input" value={input} onChange={setInput} placeholder="Paste text, query values, or URL bits that need encoding or decoding." />}
        output={<OutputBox title="Output" text={result.output} empty="Encoded or decoded output will appear here." error={result.error} toolSlug={toolSlug} copyLabel="Copy output" />}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Input" value={input.length} hint="characters" />
        <MetricCard label="Output" value={result.output.length} hint="characters" />
        <MetricCard label="Status" value={!input ? "Ready" : result.ok ? "Looks good" : "Needs fix"} hint={mode === "component" ? "component mode" : "URL mode"} />
      </div>
    </div>
  );
}
