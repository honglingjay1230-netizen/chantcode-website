import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pages = ["", "about/", "method/", "parents/", "guides/", "evidence/", "families/", "family-testing/", "learning/", "book/", "faq/", "app/", "privacy/", "terms/", "support/"];

test("includes every public knowledge page", async () => {
  for (const page of pages) await access(new URL(`app/${page}page.tsx`, root));
});

test("homepage explains ChantCode without exposing a web game", async () => {
  const home = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(home, /A Multiplication Code Stored in Sound/);
  assert.match(home, /ChantCode \| Rhythm-Based Multiplication Fact Learning/);
  assert.match(home, /ChantCode is a multiplication learning system/);
  assert.match(home, /multiplication facts and times tables/);
  assert.match(home, /automatic recall/);
  assert.match(home, /36 core multiplication facts/);
  await assert.rejects(access(new URL("app/game/page.tsx", root)));
  await assert.rejects(access(new URL("public/game", root)));
});

test("FAQ visible content and FAQPage schema share one source", async () => {
  const faq = await readFile(new URL("app/faq/page.tsx", root), "utf8");
  assert.match(faq, /FAQPage/);
  assert.match(faq, /Why another multiplication app\?/);
  assert.match(faq, /My child is already learning multiplication at school/);
  assert.match(faq, /Why not just use flashcards\?/);
  assert.match(faq, /Isn’t ChantCode still asking children to memorize multiplication facts\?/);
  assert.match(faq, /Why does my child need to learn them quickly\?/);
  assert.match(faq, /So what does ChantCode actually do differently\?/);
  assert.match(faq, /36 Core Multiplication Facts/);
  assert.match(faq, /See the multiplication fact\. Recall the answer\./);
  assert.match(faq, /What is ChantCode\?/);
  assert.match(faq, /Does ChantCode require learning Chinese\?/);
});

test("prerenders the priority guide as readable HTML with metadata and Article schema", async () => {
  const html = await readFile(new URL("dist/client/guides/child-understands-multiplication-but-still-calculates.html", root), "utf8");
  assert.match(html, /My Child Understands Multiplication but Still Calculates Every Answer/);
  assert.match(html, /7 × 8/);
  assert.match(html, /multiplication fact fluency/);
  assert.match(html, /rel="canonical" href="https:\/\/chantcode\.com\/guides\/child-understands-multiplication-but-still-calculates"/);
  assert.match(html, /"@type":"Article"/);
  assert.doesNotMatch(html, /noindex/i);
});

test("robots separates search and answer crawlers from training and China crawlers", async () => {
  const robots = await readFile(new URL("dist/client/robots.txt", root), "utf8");
  const sitemap = await readFile(new URL("dist/client/sitemap.xml", root), "utf8");
  const generator = await readFile(new URL("scripts/generate-search-files.mjs", root), "utf8");
  const guideData = await readFile(new URL("app/guides/data.ts", root), "utf8");
  const slugs = [...guideData.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);

  const groups = robots.trim().split(/\r?\n\s*\r?\n/);
  const groupFor = (crawler) => groups.find((group) => group.split(/\r?\n/).includes(`User-agent: ${crawler}`));
  const allowedCrawlers = [
    "Googlebot",
    "bingbot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Applebot",
    "Amzn-SearchBot",
    "Amzn-User",
  ];
  const blockedCrawlers = [
    "GPTBot",
    "Google-Extended",
    "ClaudeBot",
    "Applebot-Extended",
    "CCBot",
    "Amazonbot",
    "meta-externalagent",
    "Baiduspider",
    "Bytespider",
    "PetalBot",
    "Sogou web spider",
    "360Spider",
    "YisouSpider",
    "YoudaoBot",
  ];

  for (const crawler of allowedCrawlers) {
    const group = groupFor(crawler);
    assert.ok(group, `${crawler} must have an explicit robots.txt group`);
    assert.match(group, /^Allow: \/$/m);
    assert.match(group, /^Content-signal: search=yes, ai-input=yes, ai-train=no$/m);
    assert.doesNotMatch(group, /^Disallow:/m);
  }
  assert.doesNotMatch(robots, /BaiduImagespider|BaiduMobaider|EtaoSpider|HaosouSpider|Sosospider|ToutiaoSpider/);
  assert.match(robots, /^Sitemap: https:\/\/chantcode\.com\/sitemap\.xml$/m);
  for (const crawler of blockedCrawlers) {
    const group = groupFor(crawler);
    assert.ok(group, `${crawler} must have an explicit robots.txt group`);
    assert.match(group, /^Disallow: \/$/m);
    assert.doesNotMatch(group, /^Allow:/m);
  }
  assert.match(generator, /quotedSlugs\("app\/guides\/data\.ts"\)/);
  assert.match(sitemap, /language-and-multiplication-recall/);
  assert.match(sitemap, /https:\/\/chantcode\.com\/families/);
  for (const slug of slugs) assert.match(sitemap, new RegExp(`/guides/${slug}`));
  assert.equal(slugs.length, 8);
});

test("Pages middleware blocks only mainland China and selected crawler purposes", async () => {
  const middleware = await import(new URL("../functions/_middleware.js", import.meta.url));
  const { isBlockedCrawlerRequest, isMainlandChinaRequest, onRequest } = middleware;
  const requestFor = (country, userAgent = "Mozilla/5.0") => ({
    cf: { country },
    headers: new Headers({ "user-agent": userAgent }),
  });

  assert.equal(isMainlandChinaRequest(requestFor("CN")), true);
  for (const country of ["HK", "MO", "TW", "SG", "US", "GB", "CA", "AU", "NZ", "DE", "FR"]) {
    assert.equal(isMainlandChinaRequest(requestFor(country)), false, `${country} must remain available`);
  }

  for (const userAgent of ["GPTBot/1.4", "ClaudeBot/1.0", "CCBot/2.0", "Baiduspider/2.0", "YisouSpider/5.0"]) {
    assert.equal(isBlockedCrawlerRequest(requestFor("US", userAgent)), true, `${userAgent} must be blocked`);
  }
  for (const userAgent of ["Googlebot/2.1", "bingbot/2.0", "OAI-SearchBot/1.4", "Claude-SearchBot/1.0", "PerplexityBot/1.0", "Applebot/0.1"]) {
    assert.equal(isBlockedCrawlerRequest(requestFor("US", userAgent)), false, `${userAgent} must be allowed`);
  }

  const chinaResponse = await onRequest({ request: requestFor("CN"), next: async () => new Response("public") });
  assert.equal(chinaResponse.status, 403);
  assert.match(await chinaResponse.text(), /Access denied/);
  assert.equal(chinaResponse.headers.get("x-robots-tag"), "noindex, nofollow");

  const blockedBotResponse = await onRequest({ request: requestFor("US", "GPTBot/1.4"), next: async () => new Response("public") });
  assert.equal(blockedBotResponse.status, 403);

  let nextCalls = 0;
  const publicResponse = await onRequest({
    request: requestFor("US", "OAI-SearchBot/1.4"),
    next: async () => {
      nextCalls += 1;
      return new Response("public", { status: 200 });
    },
  });
  assert.equal(publicResponse.status, 200);
  assert.equal(await publicResponse.text(), "public");
  assert.equal(nextCalls, 1);

  const routes = JSON.parse(await readFile(new URL("dist/client/_routes.json", root), "utf8"));
  assert.deepEqual(routes, { version: 1, include: ["/*"], exclude: [] });
});

test("evidence pages keep source limits visible in HTML", async () => {
  const language = await readFile(new URL("dist/client/evidence/language-and-multiplication-recall.html", root), "utf8");
  const examples = await readFile(new URL("dist/client/evidence/chinese-multiplication-learning-examples.html", root), "utf8");

  assert.match(language, /Singapore’s Ministry of Education/);
  assert.match(language, /do not show that Singapore children generally learn multiplication this way/);
  assert.match(language, /not as scientifically proven/);
  assert.match(examples, /do not test ChantCode or prove that ChantCode improves recall/);
  assert.match(examples, /does not copy, host, or re-upload/);
});

test("family stories remain an honest empty state until real cases exist", async () => {
  const families = await readFile(new URL("dist/client/families.html", root), "utf8");
  const data = await readFile(new URL("app/families/data.ts", root), "utf8");

  assert.match(families, /Real family stories will be added as families complete the ChantCode pilot\./);
  assert.match(families, /This is one family&#x27;s experience and is not a controlled scientific study\. Individual results may vary\./);
  assert.match(data, /familyStories: FamilyStory\[\] = \[\]/);
});

test("family testing page is indexable, accurate, and included in discovery files", async () => {
  const page = await readFile(new URL("dist/client/family-testing.html", root), "utf8");
  const sitemap = await readFile(new URL("dist/client/sitemap.xml", root), "utf8");
  const robots = await readFile(new URL("dist/client/robots.txt", root), "utf8");

  assert.match(page, /<title>ChantCode Family Testing \| Free Multiplication App Testing for Ages 6–10<\/title>/);
  assert.match(page, /<h1>Family Testing<\/h1>/);
  assert.match(page, /children around ages 6–10/);
  assert.match(page, /6 × 7 or 7 × 8/);
  assert.match(page, /has not yet been officially released/);
  assert.match(page, /honglingjay1230@gmail\.com/);
  assert.match(page, /rel="canonical" href="https:\/\/chantcode\.com\/family-testing"/);
  assert.doesNotMatch(page, /noindex/i);
  assert.match(sitemap, /<loc>https:\/\/chantcode\.com\/family-testing<\/loc>/);
  assert.match(robots, /^Allow: \/$/m);
});

test("major pages keep unique metadata, self-canonicals, and indexable initial HTML", async () => {
  const majorPages = [
    ["index.html", "https://chantcode.com"],
    ["method.html", "https://chantcode.com/method"],
    ["parents.html", "https://chantcode.com/parents"],
    ["learning.html", "https://chantcode.com/learning"],
    ["evidence.html", "https://chantcode.com/evidence"],
    ["app.html", "https://chantcode.com/app"],
    ["family-testing.html", "https://chantcode.com/family-testing"],
  ];
  const titles = [];
  const descriptions = [];

  for (const [file, canonical] of majorPages) {
    const html = await readFile(new URL(`dist/client/${file}`, root), "utf8");
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]+)"\/>/)?.[1] ?? "";

    assert.ok(title, `${file} must have a title`);
    assert.ok(description, `${file} must have a meta description`);
    assert.match(html, new RegExp(`rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(html, /<meta property="og:title" content="[^"]+"\/>/);
    assert.match(html, /<meta property="og:description" content="[^"]+"\/>/);
    assert.match(html, /<main[^>]*>.*<h1[^>]*>/s);
    assert.doesNotMatch(html, /<meta name="(?:robots|googlebot)" content="[^"]*noindex/i);
    titles.push(title);
    descriptions.push(description);
  }

  assert.equal(new Set(titles).size, majorPages.length);
  assert.equal(new Set(descriptions).size, majorPages.length);
});

test("app schema identifies the verified platform without inventing a store URL", async () => {
  const app = await readFile(new URL("dist/client/app.html", root), "utf8");
  assert.match(app, /"@type":"SoftwareApplication"/);
  assert.match(app, /"applicationCategory":"EducationalApplication"/);
  assert.match(app, /"educationalUse":\["multiplication fact learning","multiplication fluency"\]/);
  assert.match(app, /"operatingSystem":"iOS"/);
  assert.doesNotMatch(app, /"downloadUrl":""/);
});
