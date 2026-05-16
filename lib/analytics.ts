export type AnalyticsEventName =
  | "tool_opened"
  | "tool_used"
  | "copy_clicked"
  | "clear_clicked"
  | "option_changed"
  | "theme_changed"
  | "related_tool_clicked"
  | "sample_loaded"
  | "download_clicked"
  | "file_loaded"
  | "file_processed"
  | "timer_started"
  | "timer_completed"
  | "lap_added";

export type LengthBucket = "empty" | "1-100" | "101-500" | "501-2000" | "2001-10000" | "10000+";
export type FileSizeBucket = "empty" | "1-100kb" | "101-500kb" | "501kb-2mb" | "2mb-10mb" | "10mb+";
export type DurationBucket = "under-1m" | "1-5m" | "5-15m" | "15-30m" | "30-60m" | "60m+";
export type ImageDimensionBucket = "unknown" | "small" | "medium" | "large" | "huge";

export type AllowedAnalyticsProperties = {
  tool_slug?: string;
  option_name?: string;
  action?: string;
  length_bucket?: LengthBucket;
  file_size_bucket?: FileSizeBucket;
  image_dimension_bucket?: ImageDimensionBucket;
  duration_bucket?: DurationBucket;
  category?: string;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: AnalyticsEventName,
      eventParameters?: Record<string, string>,
    ) => void;
  }
}

const allowedEventNames = new Set<AnalyticsEventName>([
  "tool_opened",
  "tool_used",
  "copy_clicked",
  "clear_clicked",
  "option_changed",
  "theme_changed",
  "related_tool_clicked",
  "sample_loaded",
  "download_clicked",
  "file_loaded",
  "file_processed",
  "timer_started",
  "timer_completed",
  "lap_added",
]);

const allowedPropertyKeys = new Set<keyof AllowedAnalyticsProperties>([
  "tool_slug",
  "option_name",
  "action",
  "length_bucket",
  "file_size_bucket",
  "image_dimension_bucket",
  "duration_bucket",
  "category",
]);

export function getLengthBucket(length: number): LengthBucket {
  if (length <= 0) return "empty";
  if (length <= 100) return "1-100";
  if (length <= 500) return "101-500";
  if (length <= 2000) return "501-2000";
  if (length <= 10000) return "2001-10000";
  return "10000+";
}

export function getFileSizeBucket(bytes: number): FileSizeBucket {
  if (bytes <= 0) return "empty";
  if (bytes <= 100 * 1024) return "1-100kb";
  if (bytes <= 500 * 1024) return "101-500kb";
  if (bytes <= 2 * 1024 * 1024) return "501kb-2mb";
  if (bytes <= 10 * 1024 * 1024) return "2mb-10mb";
  return "10mb+";
}

export function getDurationBucket(seconds: number): DurationBucket {
  if (seconds < 60) return "under-1m";
  if (seconds <= 5 * 60) return "1-5m";
  if (seconds <= 15 * 60) return "5-15m";
  if (seconds <= 30 * 60) return "15-30m";
  if (seconds <= 60 * 60) return "30-60m";
  return "60m+";
}

export function getImageDimensionBucket(width: number, height: number): ImageDimensionBucket {
  const megapixels = (width * height) / 1_000_000;
  if (!Number.isFinite(megapixels) || megapixels <= 0) return "unknown";
  if (megapixels < 0.5) return "small";
  if (megapixels < 2) return "medium";
  if (megapixels < 8) return "large";
  return "huge";
}

function getSafeAnalyticsProperties(properties: AllowedAnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key]) => allowedPropertyKeys.has(key as keyof AllowedAnalyticsProperties))
      .filter(([, value]) => typeof value === "string" && value.length > 0)
      .map(([key, value]) => [key, value.slice(0, 80)]),
  ) as Record<string, string>;
}

export function trackEvent(name: AnalyticsEventName, properties: AllowedAnalyticsProperties = {}) {
  if (!allowedEventNames.has(name)) return;

  const safeProperties = getSafeAnalyticsProperties(properties);

  if (process.env.NODE_ENV === "development") {
    console.info("[Unannoy event]", { name, ...safeProperties });
    return;
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, safeProperties);
  }
}
