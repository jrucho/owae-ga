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

  assert.match(page, /href="\/Beatmaker_Cues\.html"/);
  assert.match(page, /href="\/Swiss-VJ\.html"/);
  assert.match(page, /un-bound\.ai\.studio\/public\/nCzhZaiY9Vg73Y63wbrXI7ORiWy2/);
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
  assert.doesNotMatch(html, /user-scalable=no|manifest\.json|\.\/sw\.js/);
  assert.equal(html.match(/inputSelect\.addEventListener\('change'/g)?.length, 1);
  assert.equal(html.match(/outputSelect\.addEventListener\('change'/g)?.length, 1);
  assert.doesNotThrow(() => new Function(script));
});
