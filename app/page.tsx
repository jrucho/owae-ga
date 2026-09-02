import MobileMenu from "./MobileMenu";

const links = {
  bandcamp: "https://owaega.bandcamp.com/album/sofi-nima",
  spotify: "https://open.spotify.com/album/0BtyJXp1wDrdD32R7zE1hz",
  spotifyArtist: "https://open.spotify.com/artist/3CHA9jnHDxkhqaOvWoRWoJ",
  vinyl: "https://elasticstage.com/owaega/releases/sofianima-album",
  book: "https://un-bound.ai.studio/public/nCzhZaiY9Vg73Y63wbrXI7ORiWy2?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleATcFwJwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABp3Wxh8W_Nn9VpO0eZTrNcbQ-0Whw5329G4RlwoQ1o3VBtzAKhS3NOFID9xjG_aem_iK0sLI7LjH6lIlqW9yENng",
  instagram: "https://www.instagram.com/owae.ga",
};

const projects = [
  {
    index: "01",
    name: "YT Beatmaker Cues",
    kind: "Browser instrument",
    description:
      "A browser-based beatmaking instrument that turns YouTube videos into playable cue points, loops, drum pads, and MIDI-controlled samples.",
    href: "https://github.com/jrucho/YTbeatmakercues-v2",
    cta: "Open on GitHub",
  },
  {
    index: "02",
    name: "un-released",
    kind: "Music platform",
    description:
      "A platform for presenting independent music as complete visual releases.",
    href: "https://un-released.ch/",
    cta: "Open platform",
  },
  {
    index: "03",
    name: "un-bound",
    kind: "Book platform",
    description:
      "A digital space for collecting, presenting, reading, and sharing independent books and private editions.",
    href: "https://un-bound.ai.studio/",
    cta: "Open platform",
  },
  {
    index: "04",
    name: "Epoch Writer",
    kind: "Writing tool",
    description:
      "A distraction-free browser writing environment built around focus, rhythm, and long-form work.",
    href: "https://epochwriter.ch/",
    cta: "Open writing tool",
  },
  {
    index: "05",
    name: "TerraSynth",
    kind: "Generative synth",
    description:
      "A generative browser synthesizer for exploring evolving tones, textures, and musical accidents.",
    href: "https://terrasynth-533197959751.us-west1.run.app/",
    cta: "Open synth",
  },
  {
    index: "06",
    name: "TwinSampler",
    kind: "Dual sampler",
    description:
      "A dual-sampler instrument for chopping, layering, and performing sound in one focused interface.",
    href: "https://github.com/jrucho/schwung-twinsampler",
    cta: "Open on GitHub",
  },
  {
    index: "07",
    name: "un-framed",
    kind: "Image platform",
    description:
      "A collaborative image space for galleries, shared sessions, and visual storytelling.",
    href: "https://un-framed.ai.studio/",
    cta: "Open gallery",
  },
  {
    index: "08",
    name: "my-notes.ch",
    kind: "Note-taking journal",
    description:
      "A focused space for capturing notes, shaping ideas, and keeping a personal journal.",
    href: "https://my-notes.ch/",
    cta: "Open notes",
  },
  {
    index: "09",
    name: "Second Voice",
    kind: "Audio storytelling",
    description:
      "An interactive audio series built around voice, choice, and unfolding stories.",
    href: "https://ais-pre-ll4f4fqnevrqhedkohb3km-18081576561.europe-west3.run.app/",
    cta: "Open series",
  },
];

const releases = [
  {
    title: "Vento Atlántico",
    date: "01 Jan 2026",
    kind: "Album",
    cover: "/vento-atlantico.jpg",
    href: "https://owaega.bandcamp.com/album/vento-atl-ntico",
  },
  {
    title: "Eco Atlántico",
    date: "18 Dec 2025",
    kind: "Album",
    cover: "/eco-atlantico.jpg",
    href: "https://owaega.bandcamp.com/album/eco-atl-ntico",
  },
  {
    title: "Codae Alt",
    date: "11 Dec 2025",
    kind: "Track",
    cover: "/codae-alt.jpg",
    href: "https://owaega.bandcamp.com/track/codae-alt",
  },
  {
    title: "Fenda",
    date: "04 Dec 2025",
    kind: "Track",
    cover: "/fenda.jpg",
    href: "https://owaega.bandcamp.com/track/fenda",
  },
  {
    title: "Espirais",
    date: "20 Nov 2025",
    kind: "Track",
    cover: "/espirais.jpg",
    href: "https://owaega.bandcamp.com/track/espirais",
  },
  {
    title: "Sismo",
    date: "06 Nov 2025",
    kind: "Track",
    cover: "/sismo.jpg",
    href: "https://owaega.bandcamp.com/track/sismo",
  },
  {
    title: "Fío de fume",
    date: "30 Oct 2025",
    kind: "Beat tape",
    cover: "/fio-de-fume.jpg",
    href: "https://owaega.bandcamp.com/album/f-o-de-fume",
  },
  {
    title: "Brutalismo Atlántico",
    date: "29 Sep 2025",
    kind: "Album",
    cover: "/brutalismo-atlantico.jpg",
    href: "https://owaega.bandcamp.com/album/brutalismo-atl-ntico",
  },
  {
    title: "CAMPO EP",
    date: "23 Jun 2025",
    kind: "EP",
    cover: "/campo-ep.jpg",
    href: "https://owaega.bandcamp.com/album/campo-ep",
  },
];

const sofianimaTracks = [
  { title: "Outward", duration: "03:30", href: "https://owaega.bandcamp.com/track/outward" },
  { title: "Mark", duration: "02:19", href: "https://owaega.bandcamp.com/track/mark" },
  { title: "Weight", duration: "03:26", href: "https://owaega.bandcamp.com/track/weight" },
  { title: "Slip", duration: "02:32", href: "https://owaega.bandcamp.com/track/slip" },
  { title: "Edge", duration: "03:01", href: "https://owaega.bandcamp.com/track/edge" },
  { title: "Split", duration: "02:32", href: "https://owaega.bandcamp.com/track/split" },
  { title: "Release", duration: "03:49", href: "https://owaega.bandcamp.com/track/release" },
  { title: "Inward", duration: "02:37", href: "https://owaega.bandcamp.com/track/inward" },
  { title: "Sofiánima", duration: "03:16", href: "https://owaega.bandcamp.com/track/sofi-nima" },
];

const ExternalArrow = () => (
  <svg className="external-arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M3 9 9 3M4 3h5v5" />
  </svg>
);

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="owae.ga home">
          <img src="/logo-owae.png" alt="owae.ga" />
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#releases">Releases</a>
          <a href="#contact">Contact</a>
        </nav>
        <MobileMenu />
        <span className="location">LSN / GAL</span>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <p className="eyebrow">2026 audio / image system</p>
        <div className="hero-copy">
          <h1 id="hero-title">
            MAKING MUSIC.
            <span>BUILDING TOOLS.</span>
          </h1>
          <p>
            owae.ga is the multimedia practice of Carlos Abeijón Martínez—music
            releases, live visuals, and browser-based creative tools built for
            making, performing, and exploring.
          </p>
          <div className="hero-actions">
            <a className="button button-acid" href={links.bandcamp} target="_blank" rel="noreferrer">
              Listen to SOFIÁNIMA <ExternalArrow />
            </a>
            <a className="button button-line" href="#projects">
              Explore projects ↓
            </a>
          </div>
        </div>
        <div className="hero-footer">
          <span>Music / tools</span>
          <span>Releases / visuals</span>
          <span>Lausanne / Galicia</span>
        </div>
      </section>

      <section className="current-release" id="music" aria-labelledby="current-title">
        <div className="section-label">01 / CURRENT TRANSMISSION</div>
        <div className="album-cover-wrap">
          <img src="/sofianima-cover.png" alt="SOFIÁNIMA album cover" />
          <span>New album / 15.05.2026</span>
        </div>
        <div className="album-copy">
          <p className="kicker">Music / image / object</p>
          <h2 id="current-title">SOFIÁNIMA</h2>
          <p className="album-intro">
            An audiovisual work exploring electronic music, memory,
            distance, and the signals we send—or imagine receiving.
          </p>
          <p>
            Built around memory, projection, and inner transformation, the sound
            moves through dark electronic textures, heavy drums, Atlantic
            ambience, distorted details, and intimate melodic fragments. The
            dialogue between Sofía and Ánima turns the record into a space for
            inner wisdom, projection, and return.
          </p>
          <div className="album-links">
            <a href={links.bandcamp} target="_blank" rel="noreferrer">Bandcamp <ExternalArrow /></a>
            <a href={links.spotify} target="_blank" rel="noreferrer">Spotify <ExternalArrow /></a>
            <a href={links.vinyl} target="_blank" rel="noreferrer">Vinyl / CD <ExternalArrow /></a>
            <a href={links.book} target="_blank" rel="noreferrer">Book <ExternalArrow /></a>
          </div>
        </div>
      </section>

      <section className="sofianima-sequence" aria-labelledby="sequence-title">
        <div className="sequence-heading">
          <p className="section-label">02 / THE SEQUENCE</p>
          <h2 id="sequence-title">OUTWARD<br />TO INWARD.</h2>
          <p>Nine pieces. 12-inch vinyl with booklet. Sound, visual language, text, texture, and silence.</p>
        </div>
        <ol className="tracklist">
          {sofianimaTracks.map((track, index) => (
            <li key={track.title}>
              <a className="track-link" href={track.href} target="_blank" rel="noreferrer" aria-label={`Listen to ${track.title} on Bandcamp`}>
                <span className="track-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="track-name">
                  <strong>{track.title}</strong>
                  <span className="track-duration">{track.duration}</span>
                </span>
                <span className="track-listen">Listen <ExternalArrow /></span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="live-tools" aria-labelledby="live-tools-title">
        <div className="tools-heading">
          <p className="section-label">03 / LIVE TOOLS</p>
          <h2 id="live-tools-title">PLAY THE<br />BROWSER.</h2>
        </div>
        <a className="live-tool beatmaker" href="/Beatmaker_Cues.html" target="_blank" rel="noreferrer">
          <div className="tool-visual cue-visual" aria-hidden="true">
            <span>01</span><span>02</span><span>03</span><span>04</span>
            <span>K</span><span>S</span><span>H</span><span>LOOP</span>
          </div>
          <div>
            <p>Browser-based instrument</p>
            <h3>Beatmaker Cues</h3>
            <span>Open full instrument <ExternalArrow /></span>
          </div>
        </a>
        <a className="live-tool swiss-vj" href="/Swiss-VJ.html" target="_blank" rel="noreferrer">
          <div className="tool-visual vj-visual" aria-hidden="true">
            <i /><i /><i />
          </div>
          <div>
            <p>Audio-reactive / 30 presets</p>
            <h3>Swiss VJ</h3>
            <span>Open visual instrument <ExternalArrow /></span>
          </div>
        </a>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <p className="section-label">04 / ABOUT</p>
        <h2 id="about-title">ONE PRACTICE.<br />MANY FORMS.</h2>
        <div className="about-copy">
          <p>
            owae.ga is the multimedia practice of Carlos Abeijón Martínez,
            based in Lausanne and rooted in Galicia. His work moves between
            music, moving image, live performance, and creative technology.
          </p>
          <p>
            Alongside his releases and audiovisual projects, he builds
            browser-based instruments designed for direct interaction and
            experimentation. Each project explores a different way of making,
            performing, presenting, or experiencing creative work.
          </p>
          <div className="practice-tags" aria-label="Areas of practice">
            <span>Music releases</span>
            <span>Live visuals</span>
            <span>Writing tools</span>
            <span>Browser instruments</span>
          </div>
        </div>
      </section>

      <section className="projects" id="projects" aria-labelledby="projects-title">
        <div className="projects-heading">
          <p className="section-label">05 / PROJECTS</p>
          <h2 id="projects-title">TOOLS FOR<br />MAKING.</h2>
          <p>Platforms and tools for music, images, books, writing, synthesis, and storytelling.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a className="project-card" href={project.href} target="_blank" rel="noreferrer" key={project.name}>
              <div className="project-meta">
                <span>{project.index}</span>
                <span>{project.kind}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="project-cta">{project.cta} <ExternalArrow /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="releases" id="releases" aria-labelledby="releases-title">
        <div className="releases-heading">
          <p className="section-label">06 / LATEST RELEASES</p>
          <h2 id="releases-title">THE<br />CATALOGUE.</h2>
          <p>Recent owae.ga releases. Each cover opens its Bandcamp page.</p>
        </div>
        <div className="release-grid">
          {releases.map((release, index) => (
            <a className={`release-card release-${index + 1}`} href={release.href} target="_blank" rel="noreferrer" key={release.title}>
              <div className="release-image">
                <img src={release.cover} alt={`${release.title} cover`} loading="lazy" />
                <span>Open <ExternalArrow /></span>
              </div>
              <div className="release-info">
                <p>{release.date} / {release.kind}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="closing-statement" aria-label="Creative statement">
        <p>MUSIC.</p>
        <p>IMAGE.</p>
        <p>TOOLS.</p>
      </section>

      <footer id="contact">
        <div className="footer-top">
          <img src="/logo-owae.png" alt="owae.ga" />
          <p>Multimedia practice<br />Lausanne / Galicia</p>
        </div>
        <div className="footer-links">
          <a href={links.bandcamp} target="_blank" rel="noreferrer">Bandcamp <ExternalArrow /></a>
          <a href={links.spotifyArtist} target="_blank" rel="noreferrer">Spotify <ExternalArrow /></a>
          <a href={links.vinyl} target="_blank" rel="noreferrer">Vinyl / CD <ExternalArrow /></a>
          <a href={links.instagram} target="_blank" rel="noreferrer">Instagram <ExternalArrow /></a>
          <a href="mailto:tympaproject@gmail.com">Business inquiries <ExternalArrow /></a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 owae.ga — All rights reserved</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
