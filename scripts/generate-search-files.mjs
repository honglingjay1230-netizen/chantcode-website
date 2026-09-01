import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = resolve(projectRoot, "public");
const canonicalOrigin = "https://chantcode.com";

const coreRoutes = [
  "/",
  "/about",
  "/app",
  "/book",
  "/evidence",
  "/evidence/chinese-multiplication-learning-examples",
  "/evidence/language-and-multiplication-recall",
  "/families",
  "/faq",
  "/guides",
  "/learning",
  "/method",
  "/parents",
  "/privacy",
  "/support",
  "/terms",
];

async function quotedSlugs(relativePath) {
  const source = await readFile(resolve(projectRoot, relativePath), "utf8");
  return [...source.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const guideRoutes = (await quotedSlugs("app/guides/data.ts")).map((slug) => `/guides/${slug}`);
const familyRoutes = (await quotedSlugs("app/families/data.ts")).map((slug) => `/families/${slug}`);
const routes = [...new Set([...coreRoutes, ...guideRoutes, ...familyRoutes])].sort();

// The wildcard group keeps the site open to search and AI crawlers by default.
// These explicit groups document the intended policy and override conflicting
// same-agent rules added by an upstream provider when the crawler follows REP.
const allowedInternationalCrawlers = [
  "Amazonbot",
  "Applebot",
  "Applebot-Extended",
  "bingbot",
  "CCBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Googlebot",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
  "Meta-ExternalFetcher",
  "OAI-AdsBot",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
];

// Identified crawlers operated by companies based in China are excluded.
// robots.txt is voluntary, so non-compliant or unidentified bots need a WAF rule.
const blockedChinaCrawlers = [
  "360Spider",
  "Baiduspider",
  "BaiduImagespider",
  "BaiduMobaider",
  "Bytespider",
  "EtaoSpider",
  "HaosouSpider",
  "PetalBot",
  "Sogou web spider",
  "Sosospider",
  "ToutiaoSpider",
  "YisouSpider",
  "YoudaoBot",
];

const robots = [
  "# Default policy: allow search engines and AI crawlers.",
  "User-agent: *",
  "Allow: /",
  "",
  "# Explicitly allow major international search and AI crawlers.",
  ...allowedInternationalCrawlers.map((crawler) => `User-agent: ${crawler}`),
  "Allow: /",
  "",
  "# Block identified crawlers operated by companies based in China.",
  ...blockedChinaCrawlers.map((crawler) => `User-agent: ${crawler}`),
  "Disallow: /",
  "",
  `Sitemap: ${canonicalOrigin}/sitemap.xml`,
  "",
].join("\n");

const sitemapEntries = routes
  .map((route) => `  <url><loc>${canonicalOrigin}${route === "/" ? "/" : route}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;

await mkdir(publicDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(publicDirectory, "robots.txt"), robots, "utf8"),
  writeFile(resolve(publicDirectory, "sitemap.xml"), sitemap, "utf8"),
]);
