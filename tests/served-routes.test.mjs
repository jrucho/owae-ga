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
    for (const route of routes) {
      const response = await fetch(`${baseUrl}${route}`);
      assert.equal(response.status, 200, `${route} should return 200`);
    }
  } finally {
    server.kill("SIGTERM");
  }
});
