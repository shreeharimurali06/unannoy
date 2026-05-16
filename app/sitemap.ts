import type { MetadataRoute } from "next";
import { CORE_ROUTES, SITE_URL } from "@/lib/constants";
import { publishedTools } from "@/lib/tools/tool-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = CORE_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`.replace(/\/$/, route ? "" : "/"),
    changeFrequency: route ? ("monthly" as const) : ("weekly" as const),
    priority: route ? 0.7 : 1,
  }));

  const toolRoutes = publishedTools.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...coreRoutes, ...toolRoutes];
}
