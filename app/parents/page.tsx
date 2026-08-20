import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Parent Guide",
  description: "Why multiplication fact recall can be difficult and how parents can support short, focused practice without replacing school mathematics.",
  alternates: { canonical: "/parents" },
  openGraph: { title: "ChantCode Parent Guide", description: "A practical guide to multiplication understanding, memory, recall, and fluency.", url: "/parents" },
};

export default function ParentsPage() {
  return (
    <SiteShell>
      <main className="content-main parent-guide">
        <header className="content-hero"><p className="eyebrow">Parent Guide</p><h1>Understanding multiplication is essential. So is remembering the facts.</h1><p className="content-lede">A child may understand equal groups and still pause to recalculate a familiar multiplication answer. That gap is about retrieval, not intelligence.</p></header>
        <div className="guide-grid">
          <article><span>01</span><h2>Why multiplication can feel difficult</h2><p>Later calculations become harder to follow when basic facts still require several mental steps. The child is using attention to rebuild answers instead of using that attention on the new problem.</p></article>
          <article><span>02</span><h2>Understanding and recall are different</h2><p>Concept models explain why an answer is correct. Fluent recall makes a known fact available without rebuilding it each time. Children need both.</p></article>
          <article><span>03</span><h2>Why chants can help</h2><p>A short, fixed, rhythmic sequence gives the child a stable reference to memorize and mentally replay. Random and mixed practice are still required before recall becomes independent.</p></article>
          <article><span>04</span><h2>Keep practice short and observable</h2><p>A focused session of about 5–10 minutes can be easier to sustain than a long drill. Check accuracy, notice whether the child still needs the sequence, and stop before fatigue turns practice into conflict.</p></article>
        </div>
        <section className="guide-cta"><div><p className="eyebrow">A support tool, not a replacement</p><h2>ChantCode works alongside school mathematics</h2><p>It does not replace conceptual teaching, problem solving, classroom instruction, or a child&apos;s teacher. Its narrower role is to support multiplication fact memory, recall, fluency, and automaticity.</p></div></section>
      </main>
    </SiteShell>
  );
}
