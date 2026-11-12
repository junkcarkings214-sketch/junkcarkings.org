import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Deterministic value — Cache Components forbids run-time `new Date()` in
  // prerendered trees. Update when the site content changes meaningfully.
  const lastModified = new Date("2026-11-01T00:00:00Z");
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/sell-your-car`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
