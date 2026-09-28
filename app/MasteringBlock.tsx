"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MasteringBlock.module.css";
import {
  MASTER_PROFILES,
  analyzeAudio,
  encodeFlac,
  encodeMp3,
  encodeWav,
  masterAudio,
  safeFileStem,
  type AudioMetrics,
  type MasterSettings,
} from "@/lib/mastering";

type Version = "original" | "mastered";
type ExportFormat = "wav24" | "wav16" | "mp3" | "flac";

const MAX_FILE_SIZE = 250 * 1024 * 1024;
const MAX_DURATION = 20 * 60;
const MOBILE_MAX_FILE_SIZE = 120 * 1024 * 1024;
const MOBILE_MAX_DURATION = 8 * 60;

const formatTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${Math.floor(safeSeconds % 60).toString().padStart(2, "0")}`;
};

const formatLevel = (value: number, suffix = " dB") =>
  Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : `−∞${suffix}`;

function Waveform({ buffer, progress, onSeek }: { buffer: AudioBuffer; progress: number; onSeek: (ratio: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = "#090909";
      context.fillRect(0, 0, rect.width, rect.height);

      const data = buffer.getChannelData(0);
      const columns = Math.max(1, Math.floor(rect.width));
      const samplesPerColumn = Math.max(1, Math.floor(data.length / columns));
      const middle = rect.height / 2;
      context.strokeStyle = "rgba(239, 238, 231, .62)";
      context.lineWidth = 1;
      context.beginPath();
      for (let column = 0; column < columns; column += 1) {
        let peak = 0;
        const start = column * samplesPerColumn;
        const end = Math.min(data.length, start + samplesPerColumn);
        for (let sample = start; sample < end; sample += 1) peak = Math.max(peak, Math.abs(data[sample]));
        const height = Math.max(1, peak * (rect.height - 12));
        context.moveTo(column + 0.5, middle - height / 2);
        context.lineTo(column + 0.5, middle + height / 2);
      }
      context.stroke();

      const playhead = Math.max(0, Math.min(1, progress)) * rect.width;
      context.fillStyle = "#d9ff00";
      context.fillRect(playhead, 0, 2, rect.height);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [buffer, progress]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.waveform}
      aria-label="Audio waveform. Click or tap to seek."
      onPointerDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onSeek((event.clientX - rect.left) / rect.width);
      }}
    />
  );
}

export default function MasteringBlock() {
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null);
  const [masteredBuffer, setMasteredBuffer] = useState<AudioBuffer | null>(null);
  const [sourceMetrics, setSourceMetrics] = useState<AudioMetrics | null>(null);
  const [masteredMetrics, setMasteredMetrics] = useState<AudioMetrics | null>(null);
  const [settings, setSettings] = useState<MasterSettings>(MASTER_PROFILES.Balanced);
  const [profile, setProfile] = useState("Balanced");
  const [version, setVersion] = useState<Version>("original");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("Drop a mix to begin.");
  const [working, setWorking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("wav24");
  const [preparedExport, setPreparedExport] = useState<{ url: string; name: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startedAtRef = useRef(0);
  const animationRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBuffer = version === "mastered" && masteredBuffer ? masteredBuffer : sourceBuffer;

  const stopNode = () => {
    if (!sourceNodeRef.current) return;
    sourceNodeRef.current.onended = null;
    try { sourceNodeRef.current.stop(); } catch {}
    sourceNodeRef.current.disconnect();
    sourceNodeRef.current = null;
  };

  const startPlayback = async (buffer: AudioBuffer, offset: number) => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    await context.resume();
    stopNode();
    const node = context.createBufferSource();
    node.buffer = buffer;
    node.connect(context.destination);
    const safeOffset = Math.min(Math.max(0, offset), Math.max(0, buffer.duration - 0.01));
    startedAtRef.current = context.currentTime - safeOffset;
    sourceNodeRef.current = node;
    node.onended = () => {
      if (sourceNodeRef.current !== node) return;
      sourceNodeRef.current = null;
      setIsPlaying(false);
      setCurrentTime(0);
    };
    node.start(0, safeOffset);
    setCurrentTime(safeOffset);
    setIsPlaying(true);
  };

  const pausePlayback = () => {
    const context = audioContextRef.current;
    if (context && isPlaying) setCurrentTime(Math.min(selectedBuffer?.duration ?? 0, context.currentTime - startedAtRef.current));
    stopNode();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || !selectedBuffer) return;
    const update = () => {
      const context = audioContextRef.current;
      if (context) setCurrentTime(Math.min(selectedBuffer.duration, context.currentTime - startedAtRef.current));
      animationRef.current = requestAnimationFrame(update);
    };
    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, selectedBuffer]);

  useEffect(() => () => {
    stopNode();
    if (audioContextRef.current) void audioContextRef.current.close();
  }, []);

  useEffect(() => () => {
    if (preparedExport) URL.revokeObjectURL(preparedExport.url);
  }, [preparedExport]);

  const loadFile = async (file: File) => {
    const compactDevice = window.matchMedia("(max-width: 700px)").matches;
    const fileLimit = compactDevice ? MOBILE_MAX_FILE_SIZE : MAX_FILE_SIZE;
    const durationLimit = compactDevice ? MOBILE_MAX_DURATION : MAX_DURATION;
    if (file.size > fileLimit) {
      setStatus(`File is too large. Maximum on this device: ${Math.round(fileLimit / 1024 / 1024)} MB.`);
      return;
    }

    setWorking(true);
    setStatus("Decoding audio locally…");
    pausePlayback();
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const context = new AudioContextClass();
      const decoded = await context.decodeAudioData(await file.arrayBuffer());
      await context.close();
      if (decoded.duration > durationLimit) throw new Error(`Tracks must be ${durationLimit / 60} minutes or shorter on this device.`);
      setSourceBuffer(decoded);
      setSourceMetrics(analyzeAudio(decoded));
      setMasteredBuffer(null);
      setMasteredMetrics(null);
      setPreparedExport(null);
      setVersion("original");
      setCurrentTime(0);
      setFileName(file.name);
      setStatus("Ready to master. Audio remains on this device.");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "This audio format could not be decoded.");
    } finally {
      setWorking(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const runMaster = async () => {
    if (!sourceBuffer) return;
    pausePlayback();
    setWorking(true);
    setStatus("Rendering master locally…");
    await new Promise((resolve) => setTimeout(resolve, 30));
    try {
      const result = await masterAudio(sourceBuffer, settings);
      setPreparedExport(null);
      setMasteredBuffer(result);
      setMasteredMetrics(analyzeAudio(result));
      setVersion("mastered");
      setCurrentTime(0);
      setStatus("Master ready. Compare, adjust, or export.");
    } catch (error) {
      console.error(error);
      setStatus("Mastering failed in this browser. Try a shorter WAV or MP3 file.");
    } finally {
      setWorking(false);
    }
  };

  const selectVersion = async (nextVersion: Version) => {
    const nextBuffer = nextVersion === "mastered" ? masteredBuffer : sourceBuffer;
    if (!nextBuffer) return;
    const shouldResume = isPlaying;
    pausePlayback();
    setVersion(nextVersion);
    const offset = Math.min(currentTime, nextBuffer.duration);
    setCurrentTime(offset);
    if (shouldResume) await startPlayback(nextBuffer, offset);
  };

  const seek = async (ratio: number) => {
    if (!selectedBuffer) return;
    const nextTime = Math.max(0, Math.min(1, ratio)) * selectedBuffer.duration;
    const shouldResume = isPlaying;
    pausePlayback();
    setCurrentTime(nextTime);
    if (shouldResume) await startPlayback(selectedBuffer, nextTime);
  };

  const download = async () => {
    if (!masteredBuffer) return;
    setWorking(true);
    setStatus(`Encoding ${exportFormat.toUpperCase()} locally…`);
    try {
      let blob: Blob;
      let extension: string;
      if (exportFormat === "wav16") {
        blob = encodeWav(masteredBuffer, 16);
        extension = "wav";
      } else if (exportFormat === "wav24") {
        blob = encodeWav(masteredBuffer, 24);
        extension = "wav";
      } else if (exportFormat === "mp3") {
        blob = await encodeMp3(masteredBuffer, 320);
        extension = "mp3";
      } else {
        blob = await encodeFlac(masteredBuffer);
        extension = "flac";
      }
      const url = URL.createObjectURL(blob);
      setPreparedExport({ url, name: `${safeFileStem(fileName)}-owae-master.${extension}` });
      setStatus("Export ready. Select Save file.");
    } catch (error) {
      console.error(error);
      setStatus("Export failed. WAV 24-bit is the most widely supported option.");
    } finally {
      setWorking(false);
    }
  };

  const updateSetting = (key: keyof MasterSettings, value: number) => {
    setProfile("Custom");
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className={styles.section} id="master" aria-labelledby="master-title">
      <div className={styles.heading}>
        <p className="section-label">MASTER / LOCAL AUDIO</p>
        <h2 id="master-title">MASTER IN<br />THE BROWSER.</h2>
        <div className={styles.intro}>
          <p>Shape tone, width, dynamics and loudness without uploading your mix.</p>
          <span>Private by design / processing stays on this device</span>
        </div>
      </div>

      <div className={styles.machine}>
        <div
          className={`${styles.dropzone}${dragging ? ` ${styles.dragging}` : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) void loadFile(file);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.wav,.aif,.aiff,.flac,.mp3,.m4a,.ogg"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void loadFile(file);
            }}
            aria-label="Choose an audio mix"
          />
          <strong>{fileName || "DROP YOUR MIX"}</strong>
          <span>WAV / AIFF / FLAC / MP3 / M4A / OGG · DESKTOP 250 MB / 20 MIN · MOBILE 120 MB / 8 MIN</span>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={working}>Choose audio</button>
        </div>

        {sourceBuffer && sourceMetrics ? (
          <div className={styles.workspace}>
            <div className={styles.transport}>
              <div className={styles.versionButtons} aria-label="Choose playback version">
                <button type="button" className={version === "original" ? styles.active : ""} onClick={() => void selectVersion("original")}>A / Original</button>
                <button type="button" className={version === "mastered" ? styles.active : ""} onClick={() => void selectVersion("mastered")} disabled={!masteredBuffer}>B / Mastered</button>
              </div>
              {selectedBuffer ? <Waveform buffer={selectedBuffer} progress={currentTime / selectedBuffer.duration} onSeek={(ratio) => void seek(ratio)} /> : null}
              <div className={styles.playRow}>
                <button type="button" className={styles.play} onClick={() => isPlaying ? pausePlayback() : selectedBuffer && void startPlayback(selectedBuffer, currentTime)}>
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <span>{formatTime(currentTime)} / {formatTime(selectedBuffer?.duration ?? 0)}</span>
                <span>{version === "mastered" ? "MASTERED" : "ORIGINAL"}</span>
              </div>
            </div>

            <div className={styles.metrics} aria-label="Original and mastered audio measurements">
              <section className={styles.metricSet}>
                <header><h3>Original</h3><span>{formatTime(sourceMetrics.duration)}</span></header>
                <div className={styles.metricGrid}>
                  <div><span>LUFS*</span><strong>{formatLevel(sourceMetrics.lufs, "")}</strong></div>
                  <div><span>Peak</span><strong>{formatLevel(sourceMetrics.peakDb)}</strong></div>
                  <div><span>RMS</span><strong>{formatLevel(sourceMetrics.rmsDb)}</strong></div>
                  <div><span>Crest</span><strong>{formatLevel(sourceMetrics.crestDb)}</strong></div>
                </div>
              </section>
              <section className={styles.metricSet}>
                <header><h3>Mastered</h3><span>{masteredMetrics ? formatTime(masteredMetrics.duration) : "NOT RENDERED"}</span></header>
                <div className={styles.metricGrid}>
                  <div><span>LUFS*</span><strong>{masteredMetrics ? formatLevel(masteredMetrics.lufs, "") : "—"}</strong></div>
                  <div><span>Peak</span><strong>{masteredMetrics ? formatLevel(masteredMetrics.peakDb) : "—"}</strong></div>
                  <div><span>RMS</span><strong>{masteredMetrics ? formatLevel(masteredMetrics.rmsDb) : "—"}</strong></div>
                  <div><span>Crest</span><strong>{masteredMetrics ? formatLevel(masteredMetrics.crestDb) : "—"}</strong></div>
                </div>
              </section>
            </div>

            <div className={styles.profiles} aria-label="Mastering profiles">
              {Object.entries(MASTER_PROFILES).map(([name, values]) => (
                <button
                  type="button"
                  className={profile === name ? styles.active : ""}
                  key={name}
                  onClick={() => { setProfile(name); setSettings(values); }}
                >
                  {name}
                </button>
              ))}
              {profile === "Custom" ? <span>CUSTOM</span> : null}
            </div>

            <div className={styles.controls}>
              <label><span>Target <b>{settings.targetLufs.toFixed(1)} LUFS*</b></span><input type="range" min="-16" max="-7" step="0.5" value={settings.targetLufs} onChange={(e) => updateSetting("targetLufs", Number(e.target.value))} /></label>
              <label><span>Warmth <b>{settings.warmth.toFixed(1)} dB</b></span><input type="range" min="-3" max="4" step="0.1" value={settings.warmth} onChange={(e) => updateSetting("warmth", Number(e.target.value))} /></label>
              <label><span>Presence <b>{settings.presence.toFixed(1)} dB</b></span><input type="range" min="-3" max="4" step="0.1" value={settings.presence} onChange={(e) => updateSetting("presence", Number(e.target.value))} /></label>
              <label><span>Air <b>{settings.air.toFixed(1)} dB</b></span><input type="range" min="-3" max="4" step="0.1" value={settings.air} onChange={(e) => updateSetting("air", Number(e.target.value))} /></label>
              <label><span>Width <b>{settings.width}%</b></span><input type="range" min="50" max="150" step="1" value={settings.width} onChange={(e) => updateSetting("width", Number(e.target.value))} /></label>
              <label><span>Compression <b>{settings.compression}%</b></span><input type="range" min="0" max="100" step="1" value={settings.compression} onChange={(e) => updateSetting("compression", Number(e.target.value))} /></label>
              <label><span>Saturation <b>{settings.saturation}%</b></span><input type="range" min="0" max="100" step="1" value={settings.saturation} onChange={(e) => updateSetting("saturation", Number(e.target.value))} /></label>
              <label><span>Ceiling <b>{settings.ceiling.toFixed(1)} dB</b></span><input type="range" min="-2" max="-0.3" step="0.1" value={settings.ceiling} onChange={(e) => updateSetting("ceiling", Number(e.target.value))} /></label>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.masterButton} onClick={() => void runMaster()} disabled={working}>
                {working ? "Processing…" : masteredBuffer ? "Remaster" : "Master mix"}
              </button>
              <div className={styles.exportControls}>
                <label htmlFor="master-export">Export</label>
                <select id="master-export" value={exportFormat} onChange={(event) => { setExportFormat(event.target.value as ExportFormat); setPreparedExport(null); }}>
                  <option value="wav24">WAV / 24-bit</option>
                  <option value="wav16">WAV / 16-bit</option>
                  <option value="mp3">MP3 / 320 kbps</option>
                  <option value="flac">FLAC / 24-bit</option>
                </select>
                {preparedExport ? (
                  <a href={preparedExport.url} download={preparedExport.name}>Save file</a>
                ) : (
                  <button type="button" onClick={() => void download()} disabled={!masteredBuffer || working}>Prepare file</button>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className={styles.status} role="status">
          <span>{status}</span>
          <span>* Browser loudness estimate. Check critical masters with calibrated metering.</span>
        </div>
      </div>

      <div className={styles.footnotes}>
        <p>Nothing is uploaded. Closing or refreshing the page clears the session.</p>
        <p>MP3 encoding uses LAME (LGPL-3.0). FLAC encoding uses libFLAC-based open-source software.</p>
      </div>
    </section>
  );
}
