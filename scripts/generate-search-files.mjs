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

// Search indexing, answer grounding, and user-requested fetchers are allowed.
// Model-training crawlers use separate groups so search visibility does not
// require granting training access.
const allowedSearchAndAnswerCrawlers = [
  "Amzn-SearchBot",
  "Amzn-User",
  "Applebot",
  "bingbot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "Googlebot",
  "meta-externalfetcher",
  "OAI-AdsBot",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
];

const blockedTrainingCrawlers = [
  "Amazonbot",
  "Applebot-Extended",
  "CCBot",
  "ClaudeBot",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
];

// Only documented crawler tokens are listed. Network enforcement is handled
// separately because robots.txt is voluntary and user agents can be spoofed.
const blockedChinaCrawlers = [
  "360Spider",
  "Baiduspider",
  "Bytespider",
  "PetalBot",
  "Sogou web spider",
  "YisouSpider",
  "YoudaoBot",
];

const robots = [
  "# Allow search indexing and real-time AI answers; reserve model-training use.",
  "User-agent: *",
  "Content-signal: search=yes, ai-input=yes, ai-train=no",
  "Allow: /",
  "",
  "# International search, answer-grounding, and user-requested fetchers.",
  ...allowedSearchAndAnswerCrawlers.map((crawler) => `User-agent: ${crawler}`),
  "Content-signal: search=yes, ai-input=yes, ai-train=no",
  "Allow: /",
  "",
  "# International crawlers used for model training or bulk datasets.",
  ...blockedTrainingCrawlers.map((crawler) => `User-agent: ${crawler}`),
  "Disallow: /",
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
