import styles from "./DecayEngine.module.css";

const processors = [
  ["PRESSURE", "Compression for density and impact."],
  ["DIRT", "Saturation, bit reduction, and aliasing for grit."],
  ["DECAY", "Tonal aging, noise, and erosion for worn-out texture."],
  ["DRIFT", "Wow, flutter, and random modulation for movement."],
  ["VOID", "Spacious echoes with controls for decay, tone, and width."],
  ["GHOST", "Diffused, modulated feedback for lingering ambience."],
];

export default function DecayEngine() {
  return (
    <section className={styles.section} id="decay-engine" aria-labelledby="decay-title">
      <div className={styles.heading}>
        <p className="section-label">PLUGIN / OWAE.GA / V1</p>
        <div>
          <h2 id="decay-title">DECAY<br />ENGINE.</h2>
          <p className={styles.tagline}>Give your sound weight, wear, and memory.</p>
        </div>
        <div className={styles.download}>
          <p>macOS 11 or later<br />Apple Silicon &amp; Intel / Stereo audio</p>
          <span>AU · VST2 · VST3</span>
          <a href="/DecayEngine-v1.0-macOS.zip" download>
            <span>Download DECAY ENGINE v1</span>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M8 2v8m-3-3 3 3 3-3M3 11v3h10v-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
          <small>macOS plugin package / ZIP</small>
        </div>
      </div>

      <p className={styles.description}>
        DECAY ENGINE by OWAE.GA is a creative audio effect that transforms clean
        signals into textured, unstable, and atmospheric sound. From subtle
        warmth to heavily degraded echoes, six processing sections shape the
        character of your audio.
      </p>

      <div className={styles.processors}>
        {processors.map(([name, description], index) => (
          <div className={styles.processor} key={name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>

      <div className={styles.details}>
        <div>
          <h3>WEIGHT / DAMAGE / MEMORY / DISTANCE</h3>
          <p>Explore the included presets, sculpt your sound with four macro controls, or dive into the individual processing sections. Blend the effect with your original signal using the global mix control.</p>
        </div>
        <div>
          <h3>BUILT FOR YOUR SESSION.</h3>
          <p>The scalable interface includes automatic window fitting and manual zoom from 75% to 200%, with automatable parameters and settings saved in your DAW session.</p>
        </div>
        <div>
          <h3>INSTALL / PLAY.</h3>
          <p>Unzip the package, close your DAW, and run Install.command. Restart your DAW and rescan plugins. Installation details are included in the README.</p>
        </div>
      </div>
      <p className={styles.closing}>Add character. Introduce instability. Leave a trace.</p>
    </section>
  );
}
