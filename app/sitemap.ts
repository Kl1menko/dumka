export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";

const BASE = "https://nadiyadumka.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/shop/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticUk: MetadataRoute.Sitemap = [
    { url: BASE,                         changeFrequency: "daily"   as const, priority: 1,   lastModified: new Date() },
    { url: `${BASE}/shop`,               changeFrequency: "daily"   as const, priority: 0.9, lastModified: new Date() },
    { url: `${BASE}/stories`,            changeFrequency: "monthly" as const, priority: 0.7, lastModified: new Date() },
    { url: `${BASE}/delivery`,           changeFrequency: "monthly" as const, priority: 0.5, lastModified: new Date() },
    { url: `${BASE}/returns`,            changeFrequency: "monthly" as const, priority: 0.5, lastModified: new Date() },
    { url: `${BASE}/stories/maky-spring-summer-2026`,     changeFrequency: "monthly" as const, priority: 0.7, lastModified: new Date() },
    { url: `${BASE}/stories/grono-autumn-winter-2025-26`, changeFrequency: "monthly" as const, priority: 0.6, lastModified: new Date() },
    { url: `${BASE}/stories/kalyna-spring-summer-2023`,   changeFrequency: "monthly" as const, priority: 0.5, lastModified: new Date() },
    { url: `${BASE}/stories/wings-of-ukraine-2022`,       changeFrequency: "monthly" as const, priority: 0.5, lastModified: new Date() },
    { url: `${BASE}/stories/spring-summer-2021`,          changeFrequency: "monthly" as const, priority: 0.5, lastModified: new Date() },
  ];

  const staticEn: MetadataRoute.Sitemap = staticUk.map((entry) => ({
    ...entry,
    url: entry.url.replace(BASE, `${BASE}/en`),
    priority: Math.round((entry.priority ?? 0.5) * 0.9 * 10) / 10,
  }));

  return [...staticUk, ...staticEn, ...productUrls];
}
