import { SiteShell } from "./components/SiteShell";
import { StoreButtons } from "./components/StoreButtons";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "ChantCode | Rhythm-Based Multiplication Fact Learning",
  description: "ChantCode is a rhythm-based multiplication learning system for practicing multiplication facts and times tables, designed to support automatic recall.",
  path: "/",
  absoluteTitle: true,
});

const pillars = [
  { symbol: "×", title: "Multiplication", body: "Focused practice for the basic multiplication facts children need to retrieve fluently." },
  { symbol: "♪", title: "Rhythm", body: "Compact verbal patterns give facts a consistent sound structure for listening and repetition." },
  { symbol: "↻", title: "Memory", body: "Structured recall moves practice from recognizing an answer toward retrieving it independently." },
];

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero knowledge-hero section">
          <h1 className="hero-main-title">ChantCode <em>— A Multiplication Code Stored in Sound</em></h1>
          <div className="hero-copy">
            <p className="eyebrow">Chant · Memory · Recall</p>
            <p className="knowledge-lede">ChantCode is a multiplication learning system that uses rhythm, spoken patterns, and recall practice to help children learn multiplication facts and times tables and work toward automatic recall.</p>
            <p>A <strong>chant</strong> turns information into a short sequence that can be repeated from memory. A <strong>code</strong> stores information in a compact form so it can be retrieved when needed.</p>
            <p className="hero-principle"><strong>Listen to the pattern. Store the fact. Retrieve the answer.</strong></p>
            <div className="hero-actions"><a className="primary-button" href="/about">What is ChantCode?</a><a className="secondary-button" href="/method">How it works</a></div>
          </div>
          <div className="hero-visual"><div className="icon-halo"><img src="/chantcode-app-icon.png" alt="ChantCode Multiplication app icon" /></div><img className="concept-image" src="/chantcode-automaticity-formula.png" alt="Memorize ChantCode times retrieval practice equals multiplication automaticity" /></div>
        </section>

        <section className="section section-centered compact-section">
          <p className="eyebrow">The ChantCode Idea</p><h2>Multiplication + Rhythm + Memory</h2>
          <div className="knowledge-grid">{pillars.map((pillar) => <article key={pillar.title}><span>{pillar.symbol}</span><h3>{pillar.title}</h3><p>{pillar.body}</p></article>)}</div>
        </section>

        <section className="section fact-section">
          <div><p className="eyebrow">A Compact Learning Structure</p><h2>36 core multiplication facts</h2></div>
          <div><p>The 1s facts and repeated commutative pairs can be removed from concentrated memorization. This leaves 36 core facts across the 2s through 9s.</p><p>ChantCode organizes those facts into compact sound patterns, then uses recall practice to help children retrieve answers more directly.</p><a className="primary-link" href="/learning">Explore the learning structure <span aria-hidden="true">→</span></a></div>
        </section>

        <section className="section reassurance-section">
          <p className="eyebrow">Designed to Work Alongside School</p><h2>Simple for families. Clear in purpose.</h2>
          <div className="reassurance-grid"><article><strong>No Chinese required</strong><p>The structural inspiration comes from Chinese multiplication chants, but ChantCode is designed for English-speaking children.</p></article><article><strong>Supports school mathematics</strong><p>ChantCode does not replace conceptual understanding, teachers, curriculum, or regular mathematics instruction.</p></article><article><strong>Short daily practice</strong><p>Brief practice sessions of around 5–10 minutes can fit naturally into a child&apos;s existing routine.</p></article></div>
        </section>

        <section className="section section-centered compact-section home-resource-section">
          <p className="eyebrow">For Parents and Educators</p>
          <h2>Questions, evidence, and real-world context</h2>
          <div className="knowledge-grid">
            <article><span>?</span><h3>Parent guides</h3><p>Start with a real question, including why a child can understand multiplication but still calculate every answer.</p><a className="primary-link" href="/guides/child-understands-multiplication-but-still-calculates">Read the priority guide <span aria-hidden="true">→</span></a></article>
            <article><span>↗</span><h3>Evidence and background</h3><p>Review original sources, educational examples, and the limits of current claims about language, chants, and retrieval.</p><a className="primary-link" href="/evidence">Explore the evidence area <span aria-hidden="true">→</span></a></article>
            <article><span>○</span><h3>Family experiences</h3><p>See how real pilot stories will be documented without inventing cases or presenting observations as controlled science.</p><a className="primary-link" href="/families">Visit family stories <span aria-hidden="true">→</span></a></article>
          </div>
        </section>

        <section className="section app-intro-section">
          <div><p className="eyebrow">The ChantCode App</p><h2>Structured multiplication practice for children</h2><p>The app brings together rhythmic chants, visual guidance, prompted recall, independent recall, and practice challenges in one focused learning sequence.</p><a className="primary-link" href="/app">Learn about the app <span aria-hidden="true">→</span></a></div>
          <div><img src="/chantcode-app-icon.png" alt="ChantCode Multiplication app icon" /><p>Available on</p><StoreButtons compact showQr /></div>
        </section>
      </main>
    </SiteShell>
  );
}
