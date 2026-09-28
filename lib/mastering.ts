export type MasterSettings = {
  targetLufs: number;
  warmth: number;
  presence: number;
  air: number;
  width: number;
  compression: number;
  saturation: number;
  ceiling: number;
};

export type AudioMetrics = {
  peak: number;
  peakDb: number;
  rms: number;
  rmsDb: number;
  lufs: number;
  crestDb: number;
  duration: number;
};

type AudioLike = {
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  duration?: number;
  getChannelData(channel: number): Float32Array;
};

export const MASTER_PROFILES: Record<string, MasterSettings> = {
  Balanced: { targetLufs: -10, warmth: 1, presence: 0.8, air: 0.7, width: 108, compression: 38, saturation: 18, ceiling: -1 },
  Warm: { targetLufs: -11, warmth: 2.8, presence: -0.4, air: 0.2, width: 103, compression: 32, saturation: 32, ceiling: -1 },
  Open: { targetLufs: -12, warmth: 0.2, presence: 1.6, air: 2.2, width: 118, compression: 24, saturation: 10, ceiling: -1 },
  Loud: { targetLufs: -8, warmth: 1.2, presence: 1.2, air: 0.8, width: 105, compression: 62, saturation: 28, ceiling: -0.8 },
};

const db = (value: number) => value > 0 ? 20 * Math.log10(value) : -Infinity;

export function analyzeAudio(buffer: AudioLike): AudioMetrics {
  let peak = 0;
  let sumSquares = 0;
  const channels = Math.min(buffer.numberOfChannels, 2);
  const sampleCount = buffer.length * channels;

  for (let channel = 0; channel < channels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < data.length; index += 1) {
      const sample = data[index];
      const absolute = Math.abs(sample);
      if (absolute > peak) peak = absolute;
      sumSquares += sample * sample;
    }
  }

  const rms = Math.sqrt(sumSquares / Math.max(1, sampleCount));
  const rmsDb = db(rms);
  const lufs = Number.isFinite(rmsDb) ? -0.691 + rmsDb : -Infinity;
  return {
    peak,
    peakDb: db(peak),
    rms,
    rmsDb,
    lufs,
    crestDb: Number.isFinite(rmsDb) ? db(peak) - rmsDb : 0,
    duration: buffer.duration ?? buffer.length / buffer.sampleRate,
  };
}

function createStereoBuffer(source: AudioBuffer, width: number, context: BaseAudioContext): AudioBuffer {
  const output = context.createBuffer(2, source.length, source.sampleRate);
  const left = source.getChannelData(0);
  const right = source.numberOfChannels > 1 ? source.getChannelData(1) : left;
  const outputLeft = output.getChannelData(0);
  const outputRight = output.getChannelData(1);
  const sideGain = width / 100;

  for (let index = 0; index < source.length; index += 1) {
    const mid = (left[index] + right[index]) * 0.5;
    const side = (left[index] - right[index]) * 0.5 * sideGain;
    outputLeft[index] = mid + side;
    outputRight[index] = mid - side;
  }

  return output;
}

function applyCeiling(sample: number, ceiling: number): number {
  const absolute = Math.abs(sample);
  const threshold = ceiling * 0.82;
  if (absolute <= threshold) return sample;
  const range = Math.max(0.0001, ceiling - threshold);
  const limited = threshold + range * (1 - Math.exp(-(absolute - threshold) / range));
  return Math.sign(sample) * Math.min(ceiling, limited);
}

export async function masterAudio(sourceBuffer: AudioBuffer, settings: MasterSettings): Promise<AudioBuffer> {
  const context = new OfflineAudioContext(2, sourceBuffer.length, sourceBuffer.sampleRate);
  const source = context.createBufferSource();
  source.buffer = createStereoBuffer(sourceBuffer, settings.width, context);

  const warmth = context.createBiquadFilter();
  warmth.type = "lowshelf";
  warmth.frequency.value = 130;
  warmth.gain.value = settings.warmth;

  const presence = context.createBiquadFilter();
  presence.type = "peaking";
  presence.frequency.value = 3200;
  presence.Q.value = 0.85;
  presence.gain.value = settings.presence;

  const air = context.createBiquadFilter();
  air.type = "highshelf";
  air.frequency.value = 10500;
  air.gain.value = settings.air;

  const compressor = context.createDynamicsCompressor();
  const compression = settings.compression / 100;
  compressor.threshold.value = -1 - compression * 17;
  compressor.knee.value = 2 + compression * 24;
  compressor.ratio.value = 1 + compression * 4;
  compressor.attack.value = 0.012 - compression * 0.008;
  compressor.release.value = 0.16 - compression * 0.06;

  source.connect(warmth).connect(presence).connect(air).connect(compressor).connect(context.destination);
  source.start();
  const rendered = await context.startRendering();
  const measured = analyzeAudio(rendered);
  const normalizationDb = Math.max(-12, Math.min(12, settings.targetLufs - measured.lufs));
  const normalization = 10 ** (normalizationDb / 20);
  const ceiling = 10 ** (settings.ceiling / 20);
  const saturation = settings.saturation / 100;
  const drive = 1 + saturation * 3;
  const driveCompensation = Math.tanh(drive);
  const output = new AudioBuffer({ numberOfChannels: 2, length: rendered.length, sampleRate: rendered.sampleRate });

  for (let channel = 0; channel < 2; channel += 1) {
    const input = rendered.getChannelData(channel);
    const result = output.getChannelData(channel);
    for (let index = 0; index < input.length; index += 1) {
      const normalized = input[index] * normalization;
      const softClipped = Math.tanh(normalized * drive) / driveCompensation;
      const saturated = normalized * (1 - saturation) + softClipped * saturation;
      result[index] = applyCeiling(saturated, ceiling);
    }
  }

  return output;
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
}

export function encodeWav(buffer: AudioLike, bitDepth: 16 | 24 = 24): Blob {
  const channels = Math.min(buffer.numberOfChannels, 2);
  const bytesPerSample = bitDepth / 8;
  const dataSize = buffer.length * channels * bytesPerSample;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, bitDepth, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const channelData = Array.from({ length: channels }, (_, channel) => buffer.getChannelData(channel));
  let offset = 44;
  for (let frame = 0; frame < buffer.length; frame += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][frame]));
      if (bitDepth === 16) {
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      } else {
        let value = Math.round(sample < 0 ? sample * 0x800000 : sample * 0x7fffff);
        if (value < 0) value += 0x1000000;
        view.setUint8(offset, value & 0xff);
        view.setUint8(offset + 1, (value >> 8) & 0xff);
        view.setUint8(offset + 2, (value >> 16) & 0xff);
        offset += 3;
      }
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

const floatToInt16 = (data: Float32Array) => {
  const output = new Int16Array(data.length);
  for (let index = 0; index < data.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, data[index]));
    output[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
};

export async function encodeMp3(buffer: AudioLike, kbps = 320): Promise<Blob> {
  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const channels = Math.min(buffer.numberOfChannels, 2);
  const encoder = new Mp3Encoder(channels, buffer.sampleRate, kbps);
  const left = floatToInt16(buffer.getChannelData(0));
  const right = channels > 1 ? floatToInt16(buffer.getChannelData(1)) : undefined;
  const chunks: Uint8Array[] = [];
  const blockSize = 1152;

  for (let offset = 0; offset < buffer.length; offset += blockSize) {
    const chunk = encoder.encodeBuffer(left.subarray(offset, offset + blockSize), right?.subarray(offset, offset + blockSize));
    if (chunk.length) chunks.push(chunk);
  }
  const tail = encoder.flush();
  if (tail.length) chunks.push(tail);
  return new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
}

export async function encodeFlac(buffer: AudioLike): Promise<Blob> {
  const { default: createFlacEncoder } = await import("@audio/encode-flac");
  const channels = Math.min(buffer.numberOfChannels, 2);
  const encoder = await createFlacEncoder({
    sampleRate: buffer.sampleRate,
    channels,
    bitDepth: 24,
    compression: 5,
    frames: buffer.length,
  });
  const channelData = Array.from({ length: channels }, (_, channel) => buffer.getChannelData(channel));
  const body = encoder.encode(channelData);
  const tail = encoder.flush();
  encoder.free();
  return new Blob([body as BlobPart, tail as BlobPart], { type: "audio/flac" });
}

export function safeFileStem(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "") || "owae-master";
}
