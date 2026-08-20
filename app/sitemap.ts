import type { MetadataRoute } from "next";
import { SITE } from "./config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.9 },
    { path: "/method", priority: 0.9 },
    { path: "/faq", priority: 0.8 },
    { path: "/parents", priority: 0.8 },
    { path: "/learning", priority: 0.8 },
    { path: "/book", priority: 0.7 },
    { path: "/app", priority: 0.8 },
    { path: "/support", priority: 0.7 },
    { path: "/privacy", priority: 0.4 },
    { path: "/terms", priority: 0.4 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
