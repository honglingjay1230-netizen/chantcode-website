import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pages = ["", "about/", "method/", "parents/", "learning/", "book/", "faq/", "app/", "privacy/", "support/"];

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
