import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  MASTER_PROFILES,
  analyzeAudio,
  encodeFlac,
  encodeMp3,
  encodeWav,
  safeFileStem,
} from "../lib/mastering.ts";

function sineBuffer(duration = 0.1, sampleRate = 44100) {
  const length = Math.round(duration * sampleRate);
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  for (let index = 0; index < length; index += 1) {
    const sample = Math.sin((index / sampleRate) * Math.PI * 2 * 440) * 0.5;
    left[index] = sample;
    right[index] = sample;
  }
  return {
    numberOfChannels: 2,
    length,
    sampleRate,
    duration,
    getChannelData(channel) { return channel === 0 ? left : right; },
  };
}

test("analyzes levels and exposes mastering profiles", () => {
  const metrics = analyzeAudio(sineBuffer());
  assert.ok(metrics.peak > 0.49 && metrics.peak <= 0.5);
  assert.ok(metrics.rms > 0.35 && metrics.rms < 0.36);
  assert.ok(Number.isFinite(metrics.lufs));
  assert.deepEqual(Object.keys(MASTER_PROFILES), ["Balanced", "Warm", "Open", "Loud"]);
});

test("exports valid 16-bit and 24-bit WAV files", async () => {
  const source = sineBuffer();
  const wav16 = new DataView(await encodeWav(source, 16).arrayBuffer());
  const wav24 = new DataView(await encodeWav(source, 24).arrayBuffer());
  const text = (view, offset, length) => String.fromCharCode(...Array.from({ length }, (_, index) => view.getUint8(offset + index)));

  assert.equal(text(wav16, 0, 4), "RIFF");
  assert.equal(text(wav16, 8, 4), "WAVE");
  assert.equal(wav16.getUint16(34, true), 16);
  assert.equal(wav24.getUint16(34, true), 24);
  assert.equal(wav16.byteLength, 44 + source.length * 2 * 2);
  assert.equal(wav24.byteLength, 44 + source.length * 2 * 3);
});

test("exports playable MP3 and FLAC containers", async () => {
  const source = sineBuffer();
  const [mp3, flac] = await Promise.all([encodeMp3(source), encodeFlac(source)]);
  const flacHeader = new Uint8Array(await flac.slice(0, 4).arrayBuffer());

  assert.ok(mp3.size > 100);
  assert.equal(String.fromCharCode(...flacHeader), "fLaC");
  assert.ok(flac.size > 100);
});

test("creates safe export file names", () => {
  assert.equal(safeFileStem("My Mix v3.wav"), "My-Mix-v3");
  assert.equal(safeFileStem("***.flac"), "owae-master");
});

test("mastering block exposes every export option", async () => {
  const component = await readFile(new URL("../app/MasteringBlock.tsx", import.meta.url), "utf8");
  assert.match(component, /WAV \/ 24-bit/);
  assert.match(component, /WAV \/ 16-bit/);
  assert.match(component, /MP3 \/ 320 kbps/);
  assert.match(component, /FLAC \/ 24-bit/);
  assert.match(component, />Save file<\/a>/);
  assert.match(component, /<h3>Original<\/h3>/);
  assert.match(component, /<h3>Mastered<\/h3>/);
  assert.match(component, /<span>RMS<\/span>/);
  assert.match(component, /<span>Crest<\/span>/);
});
