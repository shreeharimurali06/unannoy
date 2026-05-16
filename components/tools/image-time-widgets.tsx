"use client";

import { Download, ImageIcon, Pause, Play, RotateCcw, Scissors, TimerReset, Upload } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { DownloadButton } from "@/components/tools/download-button";
import { MetricCard } from "@/components/tools/metric-card";
import { getDurationBucket, getFileSizeBucket, getImageDimensionBucket, getLengthBucket, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ImageToolKind = "compress" | "resize" | "webp" | "png-to-jpg" | "jpg-to-png" | "metadata";
type OutputImage = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  mimeType: string;
  extension: string;
};
type SourceImage = {
  file: File;
  url: string;
  width: number;
  height: number;
};

const imageToolConfig: Record<
  ImageToolKind,
  {
    action: string;
    title: string;
    accept: string;
    outputLabel: string;
    defaultQuality: number;
  }
> = {
  compress: {
    action: "compress",
    title: "Compress image",
    accept: "image/png,image/jpeg,image/webp",
    outputLabel: "Compressed preview",
    defaultQuality: 0.75,
  },
  resize: {
    action: "resize",
    title: "Resize image",
    accept: "image/png,image/jpeg,image/webp",
    outputLabel: "Resized preview",
    defaultQuality: 0.9,
  },
  webp: {
    action: "convert_webp",
    title: "Convert to WebP",
    accept: "image/png,image/jpeg,image/webp",
    outputLabel: "WebP preview",
    defaultQuality: 0.82,
  },
  "png-to-jpg": {
    action: "convert_jpg",
    title: "Convert PNG to JPG",
    accept: "image/png",
    outputLabel: "JPG preview",
    defaultQuality: 0.9,
  },
  "jpg-to-png": {
    action: "convert_png",
    title: "Convert JPG to PNG",
    accept: "image/jpeg",
    outputLabel: "PNG preview",
    defaultQuality: 1,
  },
  metadata: {
    action: "remove_metadata",
    title: "Remove metadata",
    accept: "image/png,image/jpeg,image/webp",
    outputLabel: "Clean image preview",
    defaultQuality: 0.92,
  },
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatTime(ms: number, includeHours = true) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((Math.max(0, ms) % 1000) / 10);
  const two = (value: number) => value.toString().padStart(2, "0");
  if (includeHours || hours > 0) return `${two(hours)}:${two(minutes)}:${two(seconds)}`;
  return `${two(minutes)}:${two(seconds)}.${two(centiseconds)}`;
}

function useToolOpened(toolSlug: string, category: "image" | "time") {
  useEffect(() => {
    trackEvent("tool_opened", { tool_slug: toolSlug, category });
  }, [category, toolSlug]);
}

function trackToolUse(toolSlug: string, action: string, category: "image" | "time", size = 1) {
  trackEvent("tool_used", {
    tool_slug: toolSlug,
    action,
    category,
    length_bucket: getLengthBucket(size),
  });
}

function playTimerBeep() {
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.5);
}

function ActionButton({
  children,
  disabled,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        primary ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-soft",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    />
  );
}

function getOutputOptions(kind: ImageToolKind, sourceType: string, quality: number) {
  if (kind === "webp") return { mimeType: "image/webp", extension: "webp", quality };
  if (kind === "png-to-jpg") return { mimeType: "image/jpeg", extension: "jpg", quality };
  if (kind === "jpg-to-png") return { mimeType: "image/png", extension: "png", quality: undefined };
  if (kind === "metadata") {
    if (sourceType === "image/png") return { mimeType: "image/png", extension: "png", quality: undefined };
    if (sourceType === "image/webp") return { mimeType: "image/webp", extension: "webp", quality };
    return { mimeType: "image/jpeg", extension: "jpg", quality };
  }
  if (sourceType === "image/png") return { mimeType: "image/png", extension: "png", quality: undefined };
  if (sourceType === "image/webp") return { mimeType: "image/webp", extension: "webp", quality };
  return { mimeType: "image/jpeg", extension: "jpg", quality };
}

async function loadSourceImage(file: File): Promise<SourceImage> {
  const url = URL.createObjectURL(file);
  const bitmap = await createImageBitmap(file);
  const source = { file, url, width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return source;
}

async function renderImage(source: SourceImage, kind: ImageToolKind, width: number, height: number, quality: number, backgroundColor: string) {
  const bitmap = await createImageBitmap(source.file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  if (kind === "png-to-jpg") {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const options = getOutputOptions(kind, source.file.type, quality);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (nextBlob) => {
        if (nextBlob) resolve(nextBlob);
        else reject(new Error("The browser could not export this image."));
      },
      options.mimeType,
      options.quality,
    );
  });

  return {
    blob,
    url: URL.createObjectURL(blob),
    width,
    height,
    mimeType: options.mimeType,
    extension: options.extension,
  };
}

function downloadBlob(output: OutputImage, toolSlug: string) {
  const url = URL.createObjectURL(output.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `unannoy-${toolSlug}.${output.extension}`;
  link.click();
  URL.revokeObjectURL(url);
  trackEvent("download_clicked", {
    tool_slug: toolSlug,
    action: "download_image",
    category: "image",
    file_size_bucket: getFileSizeBucket(output.blob.size),
    image_dimension_bucket: getImageDimensionBucket(output.width, output.height),
  });
}

export function ImageCanvasTool({ toolSlug, kind }: { toolSlug: string; kind: ImageToolKind }) {
  const config = imageToolConfig[kind];
  const [source, setSource] = useState<SourceImage | null>(null);
  const [output, setOutput] = useState<OutputImage | null>(null);
  const [quality, setQuality] = useState(config.defaultQuality);
  const [targetWidth, setTargetWidth] = useState(1200);
  const [targetHeight, setTargetHeight] = useState(800);
  const [scalePercent, setScalePercent] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [lockAspect, setLockAspect] = useState(true);
  const [error, setError] = useState("");
  const previousOutputUrl = useRef<string | null>(null);

  useToolOpened(toolSlug, "image");

  useEffect(() => {
    return () => {
      if (source?.url) URL.revokeObjectURL(source.url);
      if (previousOutputUrl.current) URL.revokeObjectURL(previousOutputUrl.current);
    };
  }, [source?.url]);

  useEffect(() => {
    if (!source) return;
    const timeout = window.setTimeout(async () => {
      try {
        setError("");
        const canResize = kind === "resize" || kind === "compress";
        const nextWidth = canResize ? Math.max(1, Math.min(source.width, Math.round(targetWidth))) : source.width;
        const nextHeight = canResize ? Math.max(1, Math.min(source.height, Math.round(targetHeight))) : source.height;
        const nextOutput = await renderImage(source, kind, nextWidth, nextHeight, quality, backgroundColor);
        if (previousOutputUrl.current) URL.revokeObjectURL(previousOutputUrl.current);
        previousOutputUrl.current = nextOutput.url;
        setOutput(nextOutput);
        trackEvent("file_processed", {
          tool_slug: toolSlug,
          action: config.action,
          category: "image",
          file_size_bucket: getFileSizeBucket(source.file.size),
          image_dimension_bucket: getImageDimensionBucket(source.width, source.height),
        });
      } catch (renderError) {
        setOutput(null);
        setError(renderError instanceof Error ? renderError.message : "Could not process this image.");
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [backgroundColor, config.action, kind, quality, source, targetHeight, targetWidth, toolSlug]);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, or WebP image.");
      return;
    }
    try {
      setError("");
      if (source?.url) URL.revokeObjectURL(source.url);
      const nextSource = await loadSourceImage(file);
      setSource(nextSource);
      setTargetWidth(nextSource.width);
      setTargetHeight(nextSource.height);
      setScalePercent(100);
      trackEvent("file_loaded", {
        tool_slug: toolSlug,
        category: "image",
        file_size_bucket: getFileSizeBucket(file.size),
        image_dimension_bucket: getImageDimensionBucket(nextSource.width, nextSource.height),
      });
    } catch {
      setError("This image could not be opened in the browser.");
    }
  }

  function updateWidth(width: number) {
    const safeWidth = Math.max(1, Math.min(12000, Math.round(width || 1)));
    setTargetWidth(safeWidth);
    if (lockAspect && source) setTargetHeight(Math.max(1, Math.round((safeWidth / source.width) * source.height)));
    if (source) setScalePercent(Math.round((safeWidth / source.width) * 100));
    trackEvent("option_changed", { tool_slug: toolSlug, option_name: "width", action: "resize", category: "image" });
  }

  function updateHeight(height: number) {
    const safeHeight = Math.max(1, Math.min(12000, Math.round(height || 1)));
    setTargetHeight(safeHeight);
    if (lockAspect && source) setTargetWidth(Math.max(1, Math.round((safeHeight / source.height) * source.width)));
    if (source) setScalePercent(Math.round((safeHeight / source.height) * 100));
    trackEvent("option_changed", { tool_slug: toolSlug, option_name: "height", action: "resize", category: "image" });
  }

  function updateScale(percent: number) {
    const safePercent = Math.max(1, Math.min(100, Math.round(percent || 1)));
    setScalePercent(safePercent);
    if (source) {
      setTargetWidth(Math.max(1, Math.round((source.width * safePercent) / 100)));
      setTargetHeight(Math.max(1, Math.round((source.height * safePercent) / 100)));
    }
    trackEvent("option_changed", { tool_slug: toolSlug, option_name: "scale_percent", action: "resize", category: "image" });
  }

  function clear() {
    if (source?.url) URL.revokeObjectURL(source.url);
    if (previousOutputUrl.current) URL.revokeObjectURL(previousOutputUrl.current);
    previousOutputUrl.current = null;
    setSource(null);
    setOutput(null);
    setError("");
  }

  const saved = source && output ? source.file.size - output.blob.size : 0;
  const savingsLabel = source && output ? `${Math.round((saved / source.file.size) * 100)}%` : "-";
  const showQuality = kind !== "jpg-to-png" && !(kind === "compress" && source?.file.type === "image/png");

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{config.title}</h2>
          <p className="mt-1 text-sm text-muted">Files stay in this browser. Canvas export also strips embedded metadata.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ClearButton onClear={clear} toolSlug={toolSlug} disabled={!source} />
          <ActionButton disabled={!output} onClick={() => output && downloadBlob(output, toolSlug)} primary>
            <Download className="h-4 w-4" />
            Download
          </ActionButton>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="grid gap-4 rounded-lg border border-border bg-surface/90 p-4">
          <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-soft p-5 text-center transition hover:bg-surface-strong">
            <Upload className="h-8 w-8 text-primary" />
            <span className="mt-3 text-sm font-semibold">Choose image</span>
            <span className="mt-1 text-xs text-muted">PNG, JPG, or WebP depending on the tool</span>
            <input type="file" accept={config.accept} onChange={onFileChange} className="sr-only" />
          </label>

          {kind === "resize" || kind === "compress" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={kind === "compress" ? "Max width" : "Width"}>
                <NumberInput value={targetWidth} min={1} max={12000} onChange={updateWidth} />
              </Field>
              <Field label={kind === "compress" ? "Max height" : "Height"}>
                <NumberInput value={targetHeight} min={1} max={12000} onChange={updateHeight} />
              </Field>
              <Field label="Scale percentage">
                <NumberInput value={scalePercent} min={1} max={100} onChange={updateScale} />
              </Field>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input type="checkbox" checked={lockAspect} onChange={(event) => setLockAspect(event.target.checked)} />
                Keep aspect ratio
              </label>
            </div>
          ) : null}

          {kind === "png-to-jpg" ? (
            <Field label="Transparency background">
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => {
                  setBackgroundColor(event.target.value);
                  trackEvent("option_changed", { tool_slug: toolSlug, option_name: "background_color", action: "png_to_jpg", category: "image" });
                }}
                className="h-11 w-24 rounded-lg border border-border bg-surface p-1"
              />
            </Field>
          ) : null}

          {showQuality ? (
            <Field label={`Quality: ${Math.round(quality * 100)}%`}>
              <input
                type="range"
                min="0.35"
                max="1"
                step="0.01"
                value={quality}
                onChange={(event) => {
                  setQuality(Number(event.target.value));
                  trackEvent("option_changed", { tool_slug: toolSlug, option_name: "quality", action: config.action, category: "image" });
                }}
                className="w-full accent-primary"
              />
            </Field>
          ) : null}

          {error ? <p className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm">{error}</p> : null}
        </section>

        <section className="grid gap-4 rounded-lg border border-border bg-surface/90 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Preview title="Original" imageUrl={source?.url} width={source?.width} height={source?.height} />
            <Preview title={config.outputLabel} imageUrl={output?.url} width={output?.width} height={output?.height} />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <MetricCard label="Original" value={formatBytes(source?.file.size ?? 0)} hint={source ? `${source.width} x ${source.height}` : "waiting"} />
            <MetricCard label="Output" value={formatBytes(output?.blob.size ?? 0)} hint={output ? `${output.width} x ${output.height}` : "waiting"} />
            <MetricCard label="Saved" value={saved > 0 ? formatBytes(saved) : "0 B"} hint="browser estimate" />
            <MetricCard label="Change" value={saved > 0 ? savingsLabel : "-"} hint="smaller is better" />
          </div>
        </section>
      </div>
    </div>
  );
}

function Preview({
  title,
  imageUrl,
  width,
  height,
}: {
  title: string;
  imageUrl?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted">{width && height ? `${width} x ${height}` : ""}</span>
      </div>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-soft">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="grid justify-items-center gap-2 text-muted">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">No image yet</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function OnlineTimerTool({ toolSlug }: { toolSlug: string }) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remainingMs, setRemainingMs] = useState(5 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef(0);
  const totalMs = Math.max(1000, (minutes * 60 + seconds) * 1000);
  const progress = Math.min(100, Math.max(0, ((totalMs - remainingMs) / totalMs) * 100));

  useToolOpened(toolSlug, "time");

  useEffect(() => {
    const saved = window.localStorage.getItem("unannoy-timer-duration-seconds");
    const durationSeconds = saved ? Number(saved) : 0;
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return;
    const nextMinutes = Math.floor(durationSeconds / 60);
    const nextSeconds = durationSeconds % 60;
    const frame = window.requestAnimationFrame(() => {
      setMinutes(nextMinutes);
      setSeconds(nextSeconds);
      setRemainingMs(durationSeconds * 1000);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const next = Math.max(0, endAtRef.current - Date.now());
      setRemainingMs(next);
      if (next <= 0) {
        setRunning(false);
        playTimerBeep();
        trackEvent("timer_completed", { tool_slug: toolSlug, category: "time", duration_bucket: getDurationBucket(totalMs / 1000) });
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [running, toolSlug, totalMs]);

  function start() {
    if (remainingMs <= 0) setRemainingMs(totalMs);
    endAtRef.current = Date.now() + (remainingMs > 0 ? remainingMs : totalMs);
    setRunning(true);
    window.localStorage.setItem("unannoy-timer-duration-seconds", String(Math.round(totalMs / 1000)));
    trackEvent("timer_started", { tool_slug: toolSlug, category: "time", duration_bucket: getDurationBucket(totalMs / 1000) });
  }

  function reset(nextMinutes = minutes, nextSeconds = seconds) {
    setRunning(false);
    setRemainingMs((nextMinutes * 60 + nextSeconds) * 1000);
  }

  function updateMinutes(value: number) {
    const nextMinutes = Math.max(0, Math.min(999, Math.round(value || 0)));
    setMinutes(nextMinutes);
    if (!running) setRemainingMs((nextMinutes * 60 + seconds) * 1000);
  }

  function updateSeconds(value: number) {
    const nextSeconds = Math.max(0, Math.min(59, Math.round(value || 0)));
    setSeconds(nextSeconds);
    if (!running) setRemainingMs((minutes * 60 + nextSeconds) * 1000);
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="grid gap-4 rounded-lg border border-border bg-surface/90 p-4">
          <h2 className="text-lg font-semibold">Set timer</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Minutes">
              <NumberInput value={minutes} min={0} max={999} onChange={updateMinutes} />
            </Field>
            <Field label="Seconds">
              <NumberInput value={seconds} min={0} max={59} onChange={updateSeconds} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 5, 10, 15, 25, 30, 45, 60].map((preset) => (
              <ActionButton
                key={preset}
                onClick={() => {
                  setMinutes(preset);
                  setSeconds(0);
                  reset(preset, 0);
                  trackEvent("option_changed", { tool_slug: toolSlug, option_name: "preset", action: `${preset}_minutes`, category: "time" });
                }}
              >
                {preset} min
              </ActionButton>
            ))}
          </div>
          <ActionButton
            onClick={() => {
              playTimerBeep();
              trackEvent("option_changed", { tool_slug: toolSlug, option_name: "test_sound", action: "play", category: "time" });
            }}
          >
            Test sound
          </ActionButton>
        </section>

        <section className="grid gap-5 rounded-lg border border-border bg-surface/90 p-5">
          <div className="text-center font-mono text-6xl font-semibold tracking-normal sm:text-7xl">{formatTime(remainingMs)}</div>
          <div className="h-3 overflow-hidden rounded-full bg-surface-strong">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <ActionButton onClick={running ? () => setRunning(false) : start} primary>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </ActionButton>
            <ActionButton onClick={() => reset()}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </ActionButton>
          </div>
        </section>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Duration" value={formatTime(totalMs)} hint="selected" />
        <MetricCard label="Remaining" value={formatTime(remainingMs)} hint={running ? "running" : "paused"} />
        <MetricCard label="Status" value={remainingMs <= 0 ? "Done" : running ? "Running" : "Ready"} hint="local clock" />
      </div>
    </div>
  );
}

export function StopwatchTool({ toolSlug }: { toolSlug: string }) {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [showMilliseconds, setShowMilliseconds] = useState(true);
  const startedAtRef = useRef(0);
  const carriedMsRef = useRef(0);

  useToolOpened(toolSlug, "time");

  useEffect(() => {
    if (!running) return;
    startedAtRef.current = Date.now();
    const interval = window.setInterval(() => {
      setElapsedMs(carriedMsRef.current + Date.now() - startedAtRef.current);
    }, 80);
    return () => window.clearInterval(interval);
  }, [running]);

  function startPause() {
    if (running) {
      carriedMsRef.current = elapsedMs;
      setRunning(false);
      trackToolUse(toolSlug, "pause", "time", Math.max(1, elapsedMs / 1000));
      return;
    }
    setRunning(true);
    trackEvent("timer_started", { tool_slug: toolSlug, action: "stopwatch", category: "time", duration_bucket: "under-1m" });
  }

  function reset() {
    setRunning(false);
    setElapsedMs(0);
    setLaps([]);
    carriedMsRef.current = 0;
    startedAtRef.current = 0;
  }

  function addLap() {
    if (elapsedMs <= 0) return;
    setLaps((current) => [elapsedMs, ...current]);
    trackEvent("lap_added", { tool_slug: toolSlug, category: "time", duration_bucket: getDurationBucket(elapsedMs / 1000) });
  }

  const lapCsv = useMemo(
    () =>
      ["Lap,Elapsed"]
        .concat(laps.slice().reverse().map((lap, index) => `${index + 1},${formatTime(lap, false)}`))
        .join("\n"),
    [laps],
  );

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 rounded-lg border border-border bg-surface/90 p-5 text-center">
        <div className="font-mono text-6xl font-semibold tracking-normal sm:text-7xl">
          {showMilliseconds ? formatTime(elapsedMs, false) : formatTime(elapsedMs)}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <ActionButton onClick={startPause} primary>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </ActionButton>
          <ActionButton onClick={addLap} disabled={elapsedMs <= 0}>
            <TimerReset className="h-4 w-4" />
            Lap
          </ActionButton>
          <ActionButton onClick={reset} disabled={elapsedMs <= 0 && laps.length === 0}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </ActionButton>
          <DownloadButton content={laps.length ? lapCsv : ""} filename="unannoy-stopwatch-laps.csv" mimeType="text/csv" toolSlug={toolSlug} />
        </div>
        <label className="mx-auto flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={showMilliseconds}
            onChange={(event) => {
              setShowMilliseconds(event.target.checked);
              trackEvent("option_changed", { tool_slug: toolSlug, option_name: "milliseconds", action: event.target.checked ? "show" : "hide", category: "time" });
            }}
          />
          Show milliseconds
        </label>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Elapsed" value={formatTime(elapsedMs, false)} hint={running ? "running" : "paused"} />
        <MetricCard label="Laps" value={laps.length} hint="recorded locally" />
        <MetricCard label="Best lap" value={laps.length ? formatTime(Math.min(...laps), false) : "-"} hint="shortest mark" />
      </div>

      <section className="rounded-lg border border-border bg-surface/90 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Laps</h2>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={laps.length ? lapCsv : ""} toolSlug={toolSlug} label="Copy laps" disabled={!laps.length} />
            <ActionButton onClick={() => setLaps([])} disabled={!laps.length}>
              <Scissors className="h-4 w-4" />
              Clear laps
            </ActionButton>
          </div>
        </div>
        <div className="max-h-72 overflow-auto rounded-lg bg-surface-soft">
          {laps.length ? (
            <ol className="divide-y divide-border">
              {laps.map((lap, index) => (
                <li key={`${lap}-${index}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="font-medium">Lap {laps.length - index}</span>
                  <span className="font-mono">{formatTime(lap, false)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="p-4 text-sm text-muted">No laps recorded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
