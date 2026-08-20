import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "ChantCode: Multiplication Book",
  description: "The book behind ChantCode: regular number-sound systems, Chinese multiplication chants, 36 core facts, and structured retrieval practice.",
  alternates: { canonical: "/book" },
  openGraph: { title: "ChantCode: Multiplication", description: "A Multiplication Code Stored in Sound.", url: "/book" },
};

const bookJsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "ChantCode: Multiplication",
  alternateName: "A Multiplication Code Stored in Sound",
  description: "A book presenting the theory, structure, and learning sequence behind ChantCode multiplication chants.",
  inLanguage: "en",
  url: "https://chantcode.com/book",
};

export default function BookPage() {
  return (
    <SiteShell>
      <main className="content-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }} />
        <header className="content-hero book-hero">
          <div><p className="eyebrow">The Book Behind ChantCode</p><h1>ChantCode: Multiplication</h1><p className="content-lede">A Multiplication Code Stored in Sound</p><p>The book is the primary long-form explanation of the ChantCode method. It examines how number sounds, compact multiplication chants, memory storage, and retrieval practice fit together.</p></div>
          <div className="book-cover" aria-label="ChantCode book cover preview"><span>CHANTCODE</span><strong>ChantCode:<br />Multiplication</strong><small>A Multiplication Code Stored in Sound</small></div>
        </header>

        <section className="book-summary">
          <p className="eyebrow">Core Ideas</p><h2>What the book explains</h2>
          <div className="guide-grid">
            <article><span>01</span><h3>Regular number-sound systems</h3><p>Why spoken number structure, place value, regularity, and brevity matter when multiplication facts are encoded into sound.</p></article>
            <article><span>02</span><h3>The Chinese multiplication-chant tradition</h3><p>How the traditional 9×9 chant functions as compact spoken memory, while remaining an educational practice rather than a controlled proof of ChantCode.</p></article>
            <article><span>03</span><h3>The 36 core facts</h3><p>Why the 1s can be understood by rule and commutative duplicates need not be stored twice, leaving the non-duplicate 2s–9s core for concentrated memorization.</p></article>
            <article><span>04</span><h3>From ordered chant to automatic recall</h3><p>How children move from listening and sequence replay to random retrieval, mixed retrieval, and increasingly direct access to known facts.</p></article>
          </div>
        </section>

        <section className="book-thesis">
          <p className="eyebrow">The Central Question</p>
          <blockquote>Can regular number sounds help children perceive place value more clearly, reduce unnecessary processing during multiplication, and support the storage and retrieval of multiplication facts?</blockquote>
          <p>This is a design and research question, not a guaranteed result. The effectiveness of ChantCode should be evaluated through children&apos;s actual learning and testing data.</p>
        </section>
        <p className="book-status">Publication and purchasing details will be added only when they are confirmed.</p>
      </main>
    </SiteShell>
  );
}
