import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("metadata defines one canonical origin and complete social cards", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layout, /metadataBase: new URL\(siteUrl\)/);
  assert.match(layout, /alternates: \{ canonical: "\/" \}/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(layout, /owae-ga-social\.jpg/);
  assert.match(layout, /application\/ld\+json/);
  assert.doesNotMatch(layout, /codex-preview/);
});

test("sitemap contains only the canonical homepage and maintained tools", async () => {
  const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  const urls = [...sitemap.matchAll(/url: "([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(urls, [
    "https://owae.ga/",
    "https://owae.ga/Beatmaker_Cues.html",
    "https://owae.ga/Swiss-VJ.html",
  ]);
});

test("feed fallbacks remain local, ordered, and bounded on cold failures", async () => {
  const feeds = await readFile(new URL("../lib/feeds.ts", import.meta.url), "utf8");

  assert.match(feeds, /const FEED_TIMEOUT_MS = 3500/);
  assert.match(feeds, /return fallbackBooks/);
  assert.match(feeds, /return fallbackReleases/);
  assert.match(feeds, /date: "Sep 2026"/);
  assert.match(feeds, /date: "Aug 2026"/);
  assert.match(feeds, /date: "Jul 2026"/);
  assert.ok(feeds.indexOf('title: "SOFIÁNIMA"') < feeds.indexOf('title: "Vento Atlántico"'));
  assert.match(feeds, /title: "SOFIÁNIMA"[\s\S]*date: "15 May 2026"/);
});

test("mobile document is horizontally locked while the book rail remains scrollable", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /html, body \{[^}]*overflow-x: hidden/);
  assert.match(css, /html, body \{ overflow-x: clip; \}/);
  assert.match(css, /\.book-rail \{[^}]*overflow-x: auto/);
  assert.match(css, /\.book-rail \{[^}]*contain: layout paint/);
});
