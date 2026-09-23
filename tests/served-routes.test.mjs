import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = [
  "/",
  "/Beatmaker_Cues.html",
  "/Console%20Booth.html",
  "/EchoFrame.html",
  "/FocusDraft.html",
  "/LoopForge8.html",
  "/OwaeConsole.html",
  "/PadStory.html",
  "/StagePlot.html",
  "/Swiss-VJ.html",
  "/SwissArtSampler.html",
  "/TimeCapsule.html",
  "/owae_ga_anime.html",
  "/setlist_architect_single_file_app_v_1.html",
];

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Production server did not start");
}

test("serves the homepage and every preserved legacy route", async () => {
  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { stdio: "ignore" },
  );

  try {
    await waitForServer();
    const homepage = await (await fetch(baseUrl)).text();
    assert.match(homepage, /O ano dos cuartos prestados/);
    assert.match(homepage, /L’Année des chambres empruntées/);
    assert.match(homepage, /The Year of Borrowed Rooms/);
    assert.match(homepage, /TRES DÍAS SEN FOTOGRAFÍA/);
    assert.match(homepage, /SOFIÁNIMA cover/);
    const bookOrder = [
      "O ano dos cuartos prestados",
      "L’Année des chambres empruntées",
      "The Year of Borrowed Rooms",
      "TRES DÍAS SEN FOTOGRAFÍA",
      "Trois jours sans photographie",
      "Three Days Without a Photograph",
      "SOFIÁNIMA (GL)",
      "SOFIÁNIMA (EN)",
      "SOFIÁNIMA (FR)",
    ];
    const bookPositions = bookOrder.map((title) => homepage.indexOf(title));
    assert.ok(bookPositions.every((position) => position >= 0));
    assert.deepEqual(bookPositions, [...bookPositions].sort((a, b) => a - b));
    assert.match(homepage, /O ano dos cuartos prestados<\/h3><p>Sep 2026<\/p>/);
    assert.match(homepage, /L’Année des chambres empruntées<\/h3><p>Sep 2026<\/p>/);
    assert.match(homepage, /The Year of Borrowed Rooms<\/h3><p>Sep 2026<\/p>/);
    assert.match(homepage, /TRES DÍAS SEN FOTOGRAFÍA<\/h3><p>Aug 2026<\/p>/);
    assert.match(homepage, /Trois jours sans photographie<\/h3><p>Aug 2026<\/p>/);
    assert.match(homepage, /Three Days Without a Photograph<\/h3><p>Aug 2026<\/p>/);
    assert.match(homepage, /SOFIÁNIMA \(GL\)<\/h3><p>Jul 2026<\/p>/);
    assert.match(homepage, /SOFIÁNIMA \(EN\)<\/h3><p>Jul 2026<\/p>/);
    assert.match(homepage, /SOFIÁNIMA \(FR\)<\/h3><p>Jul 2026<\/p>/);
    assert.ok((homepage.match(/SOFIÁNIMA cover/g) ?? []).length >= 2);
    assert.match(homepage, /<h3>SOFIÁNIMA<\/h3><p>15 May 2026(?:<!-- -->)? \/ (?:<!-- -->)?Album<\/p>/);

    for (const route of routes) {
      const response = await fetch(`${baseUrl}${route}`);
      assert.equal(response.status, 200, `${route} should return 200`);
    }
  } finally {
    server.kill("SIGTERM");
  }
});
