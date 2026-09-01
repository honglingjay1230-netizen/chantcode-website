import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pages = ["", "about/", "method/", "parents/", "guides/", "evidence/", "families/", "learning/", "book/", "faq/", "app/", "privacy/", "terms/", "support/"];

test("includes every public knowledge page", async () => {
  for (const page of pages) await access(new URL(`app/${page}page.tsx`, root));
});

test("homepage explains ChantCode without exposing a web game", async () => {
  const home = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(home, /A Multiplication Code Stored in Sound/);
  assert.match(home, /36 core multiplication facts/);
  await assert.rejects(access(new URL("app/game/page.tsx", root)));
  await assert.rejects(access(new URL("public/game", root)));
});

test("FAQ visible content and FAQPage schema share one source", async () => {
  const faq = await readFile(new URL("app/faq/page.tsx", root), "utf8");
  assert.match(faq, /FAQPage/);
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

test("robots and sitemap expose search crawlers and every guide", async () => {
  const robots = await readFile(new URL("dist/client/robots.txt", root), "utf8");
  const sitemap = await readFile(new URL("dist/client/sitemap.xml", root), "utf8");
  const generator = await readFile(new URL("scripts/generate-search-files.mjs", root), "utf8");
  const guideData = await readFile(new URL("app/guides/data.ts", root), "utf8");
  const slugs = [...guideData.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);

  const groups = robots.trim().split(/\r?\n\s*\r?\n/);
  const groupFor = (crawler) => groups.find((group) => group.split(/\r?\n/).includes(`User-agent: ${crawler}`));
  const allowedCrawlers = ["Googlebot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"];
  const blockedCrawlers = ["Baiduspider", "Bytespider", "PetalBot", "Sogou web spider", "360Spider"];

  for (const crawler of allowedCrawlers) {
    const group = groupFor(crawler);
    assert.ok(group, `${crawler} must have an explicit robots.txt group`);
    assert.match(group, /^Allow: \/$/m);
    assert.doesNotMatch(group, /^Disallow:/m);
  }
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

test("Pages worker returns a real 404 only for mainland China traffic", async () => {
  const workerModule = await import(new URL("../public/_worker.js", import.meta.url));
  const worker = workerModule.default;

  const chinaResponse = await worker.fetch(
    { cf: { country: "CN" } },
    { ASSETS: { fetch: () => assert.fail("CN traffic must not reach site assets") } },
  );
  assert.equal(chinaResponse.status, 404);
  assert.match(await chinaResponse.text(), /Page not found\./);
  assert.equal(chinaResponse.headers.get("x-robots-tag"), "noindex, nofollow");

  const assetResponse = new Response("site", { status: 200 });
  const foreignRequest = { cf: { country: "US" } };
  let forwardedRequest;
  const foreignResponse = await worker.fetch(foreignRequest, {
    ASSETS: {
      fetch(request) {
        forwardedRequest = request;
        return assetResponse;
      },
    },
  });
  assert.equal(forwardedRequest, foreignRequest);
  assert.equal(foreignResponse, assetResponse);
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

test("app schema identifies the verified platform without inventing a store URL", async () => {
  const app = await readFile(new URL("dist/client/app.html", root), "utf8");
  assert.match(app, /"@type":"SoftwareApplication"/);
  assert.match(app, /"applicationCategory":"EducationalApplication"/);
  assert.match(app, /"operatingSystem":"iOS"/);
  assert.doesNotMatch(app, /"downloadUrl":""/);
});
