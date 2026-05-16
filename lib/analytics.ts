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

type AllowedAnalyticsProperties = {
  tool_slug?: string;
  option_name?: string;
  action?: string;
  length_bucket?: LengthBucket;
  category?: string;
  theme?: string;
};

export function getLengthBucket(length: number): LengthBucket {
  if (length <= 0) return "empty";
  if (length <= 100) return "1-100";
  if (length <= 500) return "101-500";
  if (length <= 2000) return "501-2000";
  if (length <= 10000) return "2001-10000";
  return "10000+";
}

export function trackEvent(name: AnalyticsEventName, properties: AllowedAnalyticsProperties = {}) {
  const allowedKeys = new Set(["tool_slug", "option_name", "action", "length_bucket", "category", "theme"]);
  const safeProperties = Object.fromEntries(Object.entries(properties).filter(([key]) => allowedKeys.has(key)));

  if (process.env.NODE_ENV === "development") {
    console.info("[Unannoy event]", { name, ...safeProperties });
  }
}
