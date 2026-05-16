"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Hash } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { TextAreaPanel } from "@/components/text-area-panel";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { checkCharacterLimit, getCharacterCountMetrics } from "@/lib/character-count";

type PresetKey = "x-twitter" | "instagram-bio" | "meta-description" | "sms" | "custom";

const TOOL_SLUG = "character-counter";
const presets: Record<PresetKey, { label: string; limit: number; hint: string }> = {
  "x-twitter": { label: "X/Twitter post", limit: 280, hint: "Standard post length" },
  "instagram-bio": { label: "Instagram bio", limit: 150, hint: "Profile bio limit" },
  "meta-description": { label: "Meta description", limit: 160, hint: "Search snippet target" },
  sms: { label: "SMS", limit: 160, hint: "Single SMS segment" },
  custom: { label: "Custom", limit: 500, hint: "Set your own limit" },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function normalizeLimit(value: number) {
  if (!Number.isFinite(value)) return presets.custom.limit;
  return Math.min(100000, Math.max(0, Math.round(value)));
}

export function CharacterCounterTool() {
  const [text, setText] = useState("");
  const [preset, setPreset] = useState<PresetKey>("x-twitter");
  const [customLimit, setCustomLimit] = useState(presets.custom.limit);

  useEffect(() => {
    trackEvent("tool_opened", { tool_slug: TOOL_SLUG, category: "text" });
  }, []);

  const limit = preset === "custom" ? customLimit : presets[preset].limit;
  const metrics = useMemo(() => getCharacterCountMetrics(text), [text]);
  const limitResult = useMemo(() => checkCharacterLimit(text, limit, "characters"), [limit, text]);
  const progressPercent = Math.min(100, Math.max(0, limitResult.percentUsed));

  useEffect(() => {
    if (text.length === 0) return;

    const timeout = window.setTimeout(() => {
      trackEvent("tool_used", {
        tool_slug: TOOL_SLUG,
        action: limitResult.isOverLimit ? "over_limit" : "within_limit",
        length_bucket: getLengthBucket(text.length),
        category: "text",
      });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [limit, limitResult.isOverLimit, metrics.characters, metrics.words, preset, text]);

  function updatePreset(nextPreset: PresetKey) {
    setPreset(nextPreset);
    trackEvent("option_changed", {
      tool_slug: TOOL_SLUG,
      option_name: "limit_preset",
      action: nextPreset,
      category: "text",
    });
  }

  function updateCustomLimit(nextLimit: number) {
    const normalized = normalizeLimit(nextLimit);
    setCustomLimit(normalized);
    setPreset("custom");
    trackEvent("option_changed", {
      tool_slug: TOOL_SLUG,
      option_name: "custom_limit",
      action: "custom",
      category: "text",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <TextAreaPanel
        label="Text to measure"
        value={text}
        onChange={setText}
        placeholder="Paste a post, bio, description, SMS, or any text with a character limit."
        minHeight="min-h-[380px]"
      />

      <div className="grid gap-4">
        <section className="rounded-[24px] border border-border bg-surface-soft/65 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Limit preset</h2>
          </div>

          <div className="mt-4 grid gap-2">
            {(Object.keys(presets) as PresetKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => updatePreset(key)}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left text-sm transition ${
                  preset === key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface/75 hover:bg-surface"
                }`}
              >
                <span className="font-medium">{presets[key].label}</span>
                <span className={preset === key ? "text-primary-foreground/80" : "text-muted"}>
                  {formatNumber(key === "custom" ? customLimit : presets[key].limit)}
                </span>
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted">
              Custom limit
            </span>
            <input
              type="number"
              min={0}
              max={100000}
              step={1}
              value={customLimit}
              onFocus={() => updatePreset("custom")}
              onChange={(event) => updateCustomLimit(Number(event.target.value))}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-sm"
            />
          </label>
        </section>

        <section
          className={`rounded-[24px] border p-4 shadow-sm ${
            limitResult.isOverLimit ? "border-primary/60 bg-primary/10 text-foreground" : "border-border bg-surface/80"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Limit check</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {limitResult.remaining >= 0
                  ? `${formatNumber(limitResult.remaining)} remaining`
                  : `${formatNumber(Math.abs(limitResult.remaining))} over`}
              </p>
              <p className="mt-1 text-sm text-muted">{presets[preset].hint}</p>
            </div>
            {limitResult.isOverLimit ? (
              <AlertTriangle className="h-6 w-6 shrink-0 text-primary" />
            ) : (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-accent" />
            )}
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-strong">
            <div
              className={`h-full rounded-full transition-all ${
                limitResult.isOverLimit ? "bg-primary" : "bg-accent"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {formatNumber(limitResult.used)} of {formatNumber(limitResult.limit)} characters used
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Characters" value={formatNumber(metrics.characters)} />
          <MetricCard label="No spaces" value={formatNumber(metrics.charactersWithoutSpaces)} />
          <MetricCard label="Words" value={formatNumber(metrics.words)} />
          <MetricCard label="Lines" value={formatNumber(metrics.lines)} />
          <MetricCard label="Paragraphs" value={formatNumber(metrics.paragraphs)} />
        </section>
      </div>
    </div>
  );
}
