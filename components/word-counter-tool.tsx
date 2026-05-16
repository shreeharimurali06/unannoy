"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Gauge, Type } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { TextAreaPanel } from "@/components/text-area-panel";
import { getLengthBucket, trackEvent } from "@/lib/analytics";
import { readPreference, writePreference } from "@/lib/local-storage";
import { getWordCountMetrics } from "@/lib/word-count";

type ReadingSpeedKey = "slow" | "average" | "fast" | "custom";

const TOOL_SLUG = "word-counter";
const READING_SPEED_STORAGE_KEY = "unannoy.word-counter.reading-speed";
const DEFAULT_READING_SPEED: ReadingSpeedPreference = { mode: "average", customWordsPerMinute: 200 };

const readingSpeeds: Record<Exclude<ReadingSpeedKey, "custom">, { label: string; wordsPerMinute: number }> = {
  slow: { label: "Slow", wordsPerMinute: 150 },
  average: { label: "Average", wordsPerMinute: 200 },
  fast: { label: "Fast", wordsPerMinute: 250 },
};

type ReadingSpeedPreference = {
  mode: ReadingSpeedKey;
  customWordsPerMinute: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function normalizeWordsPerMinute(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_READING_SPEED.customWordsPerMinute;
  return Math.min(1000, Math.max(50, Math.round(value)));
}

function getReadingWordsPerMinute(preference: ReadingSpeedPreference) {
  if (preference.mode === "custom") {
    return normalizeWordsPerMinute(preference.customWordsPerMinute);
  }

  return readingSpeeds[preference.mode].wordsPerMinute;
}

export function WordCounterTool() {
  const [text, setText] = useState("");
  const [readingSpeed, setReadingSpeed] = useState<ReadingSpeedPreference>(DEFAULT_READING_SPEED);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setReadingSpeed(readPreference(READING_SPEED_STORAGE_KEY, DEFAULT_READING_SPEED));
    }, 0);

    trackEvent("tool_opened", { tool_slug: TOOL_SLUG, category: "text" });

    return () => window.clearTimeout(timeout);
  }, []);

  const readingWordsPerMinute = getReadingWordsPerMinute(readingSpeed);
  const metrics = useMemo(
    () => getWordCountMetrics(text, { readingWordsPerMinute }),
    [readingWordsPerMinute, text],
  );

  useEffect(() => {
    if (text.trim().length === 0) return;

    const timeout = window.setTimeout(() => {
      trackEvent("tool_used", {
        tool_slug: TOOL_SLUG,
        action: "count",
        length_bucket: getLengthBucket(text.length),
        category: "text",
      });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [metrics.characters, metrics.words, readingWordsPerMinute, text]);

  function updateReadingSpeed(next: ReadingSpeedPreference) {
    const normalized = {
      ...next,
      customWordsPerMinute: normalizeWordsPerMinute(next.customWordsPerMinute),
    };

    setReadingSpeed(normalized);
    writePreference(READING_SPEED_STORAGE_KEY, normalized);
    trackEvent("option_changed", {
      tool_slug: TOOL_SLUG,
      option_name: "reading_speed",
      action: normalized.mode,
      category: "text",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <TextAreaPanel
        label="Text to count"
        value={text}
        onChange={setText}
        placeholder="Paste a draft, post, essay, script, or any text with a word limit."
        minHeight="min-h-[380px]"
      />

      <div className="grid gap-4">
        <section className="rounded-[24px] border border-border bg-surface-soft/65 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Reading speed</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["slow", "average", "fast", "custom"] as ReadingSpeedKey[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateReadingSpeed({ ...readingSpeed, mode })}
                className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                  readingSpeed.mode === mode
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface/75 hover:bg-surface"
                }`}
              >
                {mode === "custom" ? "Custom" : readingSpeeds[mode].label}
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="mb-2 flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
              <span>Words per minute</span>
              <span>{readingWordsPerMinute} WPM</span>
            </span>
            <input
              type="number"
              min={50}
              max={1000}
              step={5}
              value={readingSpeed.mode === "custom" ? readingSpeed.customWordsPerMinute : readingWordsPerMinute}
              disabled={readingSpeed.mode !== "custom"}
              onChange={(event) =>
                updateReadingSpeed({
                  mode: "custom",
                  customWordsPerMinute: Number(event.target.value),
                })
              }
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard label="Words" value={formatNumber(metrics.words)} />
          <MetricCard label="Characters" value={formatNumber(metrics.characters)} />
          <MetricCard label="No spaces" value={formatNumber(metrics.charactersWithoutSpaces)} />
          <MetricCard label="Sentences" value={formatNumber(metrics.sentences)} />
          <MetricCard label="Paragraphs" value={formatNumber(metrics.paragraphs)} />
          <MetricCard label="Lines" value={formatNumber(metrics.lines)} />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard
            label="Reading time"
            value={metrics.readingTimeLabel}
            hint={`${readingWordsPerMinute} words per minute`}
          />
          <MetricCard label="Speaking time" value={metrics.speakingTimeLabel} hint="130 words per minute" />
        </section>

        <div className="rounded-[24px] border border-border bg-surface/75 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Type className="h-4 w-4 text-accent" />
            Draft shape
          </div>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <p>Average word length: {metrics.averageWordLength.toFixed(1)} characters</p>
            <p>Longest word: {formatNumber(metrics.longestWordLength)} characters</p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              Counts update locally as you type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
