import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "How ChantCode Works",
  description: "How ChantCode moves from listening and rhythmic repetition to prompted recall, independent recall, and multiplication fluency practice.",
  alternates: { canonical: "/method" },
  openGraph: { title: "How ChantCode Works", description: "A structured path from sound patterns to independent multiplication fact recall.", url: "/method" },
};

const stages = [
  ["01", "Listen", "The child first hears a short, fixed multiplication chant with consistent pronunciation, order, rhythm, and pauses."],
  ["02", "Repeat", "Repeating with the recording helps connect the factors and answer into one stable verbal pattern."],
  ["03", "Prompted Recall", "When an answer is not yet immediate, the child can replay the matching chant group and search for the stored fact."],
  ["04", "Independent Recall", "Random questions and both factor orders help shorten the search path until the matching fact can be recalled without reciting the whole group."],
  ["05", "Practice", "Mixed retrieval practice strengthens accuracy and access across groups. Practice is what turns an ordered chant into flexible multiplication fact recall."],
];

export default function MethodPage() {
  return (
    <SiteShell>
      <main className="content-main">
        <header className="content-hero">
          <p className="eyebrow">How ChantCode Works</p>
          <h1>From a stored sound pattern to independent recall</h1>
          <p className="content-lede">Remembering is different from recognizing. ChantCode is designed to move children beyond familiarity with a chant toward retrieving multiplication facts accurately and independently.</p>
          <p>Children should first understand what multiplication means. ChantCode then supports the separate task of storing core facts and making access to those facts more fluent.</p>
        </header>

        <div className="method-sections">
          {stages.map(([number, title, body]) => (
            <section key={title}>
              <p className="section-number">{number}</p>
              <div><h2>{title}</h2><p>{body}</p></div>
            </section>
          ))}

          <blockquote>Understand the relationship → store the fact → retrieve it in random and mixed practice → build automatic recall.</blockquote>

          <section><p className="section-number">Why rhythm?</p><div><h2>A stable structure for memory</h2><p>Rhythm does not prove that a fact has been learned. Its role is to make the verbal material more regular and repeatable. Recall practice then checks whether the child can reach the answer outside the original sequence.</p></div></section>
          <section><p className="section-number">Origin</p><div><h2>A long-established approach, redesigned in English</h2><p>ChantCode is inspired by structural features of the traditional Chinese 9×9 multiplication chant (九九乘法口诀): a compact set, fixed verbal order, regular sound patterns, and repeated retrieval. ChantCode does not ask children to learn Chinese and does not claim that this educational tradition alone proves the product&apos;s effectiveness.</p></div></section>
          <section className="references-section"><p className="section-number">Evidence</p><div><h2>References &amp; further reading</h2><p>The ChantCode book develops the method&apos;s reasoning, distinguishes educational practice from controlled evidence, and identifies questions that should be tested with children. Verifiable curriculum, historical, retrieval-research, and future ChantCode testing sources will be added here as they are confirmed.</p></div></section>
        </div>
      </main>
    </SiteShell>
  );
}
