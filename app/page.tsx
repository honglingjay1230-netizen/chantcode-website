import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "./components/SiteShell";
import { StoreButtons } from "./components/StoreButtons";

export const metadata: Metadata = {
  title: { absolute: "ChantCode - Multiplication Fact Fluency Through Rhythm and Memory" },
  description: "ChantCode helps children build multiplication fact fluency through rhythmic multiplication chants and structured recall practice.",
  alternates: { canonical: "/" },
  openGraph: { title: "ChantCode - Multiplication Fact Fluency Through Rhythm and Memory", description: "A multiplication code stored in sound, designed to support faster fact recall.", url: "/" },
};

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
            <p className="knowledge-lede">ChantCode uses rhythmic multiplication chants to help children build multiplication fact fluency and recall multiplication facts more naturally.</p>
            <p>A <strong>chant</strong> turns information into a short sequence that can be repeated from memory. A <strong>code</strong> stores information in a compact form so it can be retrieved when needed.</p>
            <p className="hero-principle"><strong>Listen to the pattern. Store the fact. Retrieve the answer.</strong></p>
            <div className="hero-actions"><Link className="primary-button" href="/about">What is ChantCode?</Link><Link className="secondary-button" href="/method">How it works</Link></div>
          </div>
          <div className="hero-visual"><div className="icon-halo"><img src="/chantcode-app-icon.png" alt="ChantCode Multiplication app icon" /></div><img className="concept-image" src="/chantcode-automaticity-formula.png" alt="Memorize ChantCode times retrieval practice equals multiplication automaticity" /></div>
        </section>

        <section className="section section-centered compact-section">
          <p className="eyebrow">The ChantCode Idea</p><h2>Multiplication + Rhythm + Memory</h2>
          <div className="knowledge-grid">{pillars.map((pillar) => <article key={pillar.title}><span>{pillar.symbol}</span><h3>{pillar.title}</h3><p>{pillar.body}</p></article>)}</div>
        </section>

        <section className="section fact-section">
          <div><p className="eyebrow">A Compact Learning Structure</p><h2>36 core multiplication facts</h2></div>
          <div><p>The 1s facts and repeated commutative pairs can be removed from concentrated memorization. This leaves 36 core facts across the 2s through 9s.</p><p>ChantCode organizes those facts into compact sound patterns, then uses recall practice to help children retrieve answers more directly.</p><Link className="primary-link" href="/learning">Explore the learning structure <span aria-hidden="true">→</span></Link></div>
        </section>

        <section className="section reassurance-section">
          <p className="eyebrow">Designed to Work Alongside School</p><h2>Simple for families. Clear in purpose.</h2>
          <div className="reassurance-grid"><article><strong>No Chinese required</strong><p>The structural inspiration comes from Chinese multiplication chants, but ChantCode is designed for English-speaking children.</p></article><article><strong>Supports school mathematics</strong><p>ChantCode does not replace conceptual understanding, teachers, curriculum, or regular mathematics instruction.</p></article><article><strong>Short daily practice</strong><p>Brief practice sessions of around 5–10 minutes can fit naturally into a child&apos;s existing routine.</p></article></div>
        </section>

        <section className="section app-intro-section">
          <div><p className="eyebrow">The ChantCode App</p><h2>Structured multiplication practice for children</h2><p>The app brings together rhythmic chants, visual guidance, prompted recall, independent recall, and practice challenges in one focused learning sequence.</p><Link className="primary-link" href="/app">Learn about the app <span aria-hidden="true">→</span></Link></div>
          <div><img src="/chantcode-app-icon.png" alt="ChantCode Multiplication app icon" /><p>Available on</p><StoreButtons compact /></div>
        </section>
      </main>
    </SiteShell>
  );
}
