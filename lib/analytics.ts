export type AnalyticsEventName =
  | "tool_opened"
  | "tool_used"
  | "copy_clicked"
  | "clear_clicked"
  | "option_changed"
  | "theme_changed"
  | "related_tool_clicked"
  | "sample_loaded";

export type LengthBucket = "empty" | "1-100" | "101-500" | "501-2000" | "2001-10000" | "10000+";

export type AllowedAnalyticsProperties = {
  tool_slug?: string;
  option_name?: string;
  action?: string;
  length_bucket?: LengthBucket;
  category?: string;
  theme?: string;
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
]);

const allowedPropertyKeys = new Set<keyof AllowedAnalyticsProperties>([
  "tool_slug",
  "option_name",
  "action",
  "length_bucket",
  "category",
  "theme",
]);

export function getLengthBucket(length: number): LengthBucket {
  if (length <= 0) return "empty";
  if (length <= 100) return "1-100";
  if (length <= 500) return "101-500";
  if (length <= 2000) return "501-2000";
  if (length <= 10000) return "2001-10000";
  return "10000+";
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
