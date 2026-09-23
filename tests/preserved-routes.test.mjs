import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const legacyRoutes = [
  "Beatmaker_Cues.html",
  "Console Booth.html",
  "EchoFrame.html",
  "FocusDraft.html",
  "LoopForge8.html",
  "OwaeConsole.html",
  "PadStory.html",
  "StagePlot.html",
  "Swiss-VJ.html",
  "SwissArtSampler.html",
  "TimeCapsule.html",
  "owae_ga_anime.html",
  "setlist_architect_single_file_app_v_1.html",
];

const sharedAssets = [
  "2026_03_27_19_17_03_431_569026.png",
  "apple-touch-icon.png",
  "book-borrowed-rooms-en.webp",
  "book-borrowed-rooms-fr.webp",
  "book-borrowed-rooms-gl.webp",
  "book-sofianima-en.webp",
  "book-sofianima-fr.webp",
  "book-sofianima-gl.webp",
  "book-three-days.webp",
  "book-trois-jours.webp",
  "book-tres-dias-gl.webp",
  "googled561e012fd6882e6.html",
  "icon.svg",
  "logoowae.png",
  "logoowae2.png",
  "manifest.webmanifest",
  "owae.ga - Tudor.mp3",
  "service-worker.js",
];

test("preserves every legacy tool at its original route", async () => {
  await Promise.all(legacyRoutes.map((route) => access(new URL(`../public/${route}`, import.meta.url))));
});

test("preserves shared legacy assets", async () => {
  await Promise.all(sharedAssets.map((asset) => access(new URL(`../public/${asset}`, import.meta.url))));
});

test("homepage live-tool links use preserved local routes", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const feeds = await readFile(new URL("../lib/feeds.ts", import.meta.url), "utf8");
  const content = `${page}\n${feeds}`;

  assert.match(page, /href="\/Beatmaker_Cues\.html"/);
  assert.match(page, /href="\/Swiss-VJ\.html"/);
  assert.match(content, /un-bound\.ai\.studio/);
  assert.match(page, /https:\/\/un-framed\.ai\.studio\//);
  assert.match(page, /https:\/\/my-notes\.ch\//);
  assert.match(page, /ais-pre-ll4f4fqnevrqhedkohb3km-18081576561\.europe-west3\.run\.app/);
  assert.match(feeds, /6gqhzsm4o253xnka0jisyv/);
  assert.match(feeds, /msd2mslnczio1stlpvwzw/);
  assert.match(feeds, /i85m31uxptqsgjp26li5de/);
  assert.match(feeds, /2bxlaq1fd9vftsdx7vxjhu/);
  assert.match(feeds, /title: "SOFIÁNIMA \(GL\)"/);
  assert.match(feeds, /title: "SOFIÁNIMA \(EN\)"/);
  assert.match(feeds, /title: "SOFIÁNIMA \(FR\)"/);
  assert.ok(feeds.indexOf("6gqhzsm4o253xnka0jisyv") < feeds.indexOf("2bxlaq1fd9vftsdx7vxjhu"));
  assert.ok(feeds.indexOf('title: "SOFIÁNIMA"') < feeds.indexOf('title: "Vento Atlántico"'));
  assert.match(feeds, /unstable_cache/);
  assert.match(feeds, /revalidate: 21600/);
  assert.ok(page.indexOf("sofianima-sequence") < page.indexOf("book-strip"));
  assert.match(page, /<h3 className="visually-hidden">\{book\.title\}<\/h3>/);
  assert.doesNotMatch(page, /<span aria-hidden="true">↗<\/span>/);
});

test("Swiss VJ includes its iPhone safeguards", async () => {
  const html = await readFile(new URL("../public/Swiss-VJ.html", import.meta.url), "utf8");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

  assert.ok(script);
  assert.match(html, /min-height:100dvh/);
  assert.match(html, /env\(safe-area-inset-bottom\)/);
  assert.match(html, /if\(monitorGain\) monitorGain\.gain\.value/);
  assert.match(html, /requestFullscreen\.call\(canvas\)/);
  assert.match(html, /fsBtn\.textContent = 'Stage Only'/);
  assert.match(html, /exitStageBtn\.addEventListener/);
  assert.match(html, /pointer-events:auto;overflow-y:auto/);
  assert.match(html, /window\.visualViewport\?\.width/);
  assert.match(html, /body\.stage-only\{display:block/);
  assert.match(html, /ctx\.fillStyle = i%3===0 \? acc : fg/);
  assert.doesNotMatch(html, /user-scalable=no|manifest\.json|\.\/sw\.js/);
  assert.equal(html.match(/inputSelect\.addEventListener\('change'/g)?.length, 1);
  assert.equal(html.match(/outputSelect\.addEventListener\('change'/g)?.length, 1);
  assert.doesNotThrow(() => new Function(script));
});
