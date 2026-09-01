import { SITE } from "../config";
import { familyStories, familyStoryPath } from "../families/data";
import { guidePath, guides } from "../guides/data";

export const dynamic = "force-static";

const pages = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.9 },
  { path: "/method", priority: 0.9 },
  { path: "/faq", priority: 0.8 },
  { path: "/parents", priority: 0.8 },
  { path: "/guides", priority: 0.9 },
  ...guides.map(({ slug }) => ({ path: guidePath(slug), priority: 0.8 })),
  { path: "/evidence", priority: 0.8 },
  { path: "/evidence/language-and-multiplication-recall", priority: 0.8 },
  { path: "/evidence/chinese-multiplication-learning-examples", priority: 0.7 },
  { path: "/families", priority: 0.7 },
  ...familyStories.map(({ slug }) => ({ path: familyStoryPath(slug), priority: 0.6 })),
  { path: "/learning", priority: 0.8 },
  { path: "/book", priority: 0.7 },
  { path: "/app", priority: 0.8 },
  { path: "/support", priority: 0.7 },
  { path: "/privacy", priority: 0.4 },
  { path: "/terms", priority: 0.4 },
];

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function sitemapXml() {
  const entries = pages.map(({ path, priority }) => [
    "  <url>",
    `    <loc>${escapeXml(`${SITE.url}${path || "/"}`)}</loc>`,
    "    <lastmod>2026-09-01</lastmod>",
    "    <changefreq>monthly</changefreq>",
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

export function GET() {
  return new Response(sitemapXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
