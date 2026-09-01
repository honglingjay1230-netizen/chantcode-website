import { SiteShell } from "../components/SiteShell";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Learning Background & Evidence",
  description: "External sources and careful evidence boundaries for language, verbal memory, multiplication chants, retrieval practice, and ChantCode.",
  path: "/evidence",
});

export default function EvidencePage() {
  return (
    <SiteShell>
      <main className="content-main hub-main">
        <header className="content-hero">
          <p className="eyebrow">Sources, Context, and Limits</p>
          <h1>Learning Background &amp; Evidence</h1>
          <p className="content-lede">This area separates educational background, published research, school observations, and future ChantCode evidence. None of these sources is presented as scientific proof that ChantCode works.</p>
          <p>Claims are kept close to what each source actually supports. Research on arithmetic memory can inform a design hypothesis, but only direct evaluation of ChantCode with children can evaluate ChantCode itself.</p>
        </header>

        <section className="evidence-principles" aria-labelledby="evidence-principles-title">
          <p className="eyebrow">How to Read This Area</p>
          <h2 id="evidence-principles-title">Three kinds of information stay distinct</h2>
          <div className="knowledge-grid">
            <article><span>1</span><h3>Research findings</h3><p>Published studies may support a narrow statement about memory, language, or practice under specific conditions. Sample, age, task, and limitations matter.</p></article>
            <article><span>2</span><h3>Educational examples</h3><p>School materials can show that a practice exists and how it is used. They do not establish a causal effect for ChantCode.</p></article>
            <article><span>3</span><h3>Product evidence</h3><p>Future pilot stories and learning data must be labeled for what they are. A family observation is not a controlled study.</p></article>
          </div>
        </section>

        <section className="article-card-grid evidence-card-grid" aria-label="Evidence topics">
          <a className="article-card" href="/evidence/language-and-multiplication-recall"><span>Language</span><h2>Language and Multiplication-Fact Recall</h2><p>Verbal coding, bilingual learning, compact spoken forms, a carefully bounded Singapore example, and research limits.</p><strong>Read the evidence page <span aria-hidden="true">→</span></strong></a>
          <a className="article-card" href="/evidence/chinese-multiplication-learning-examples"><span>Examples</span><h2>Chinese Multiplication Learning Examples</h2><p>External school and educational resources presented as background—not as proof or a public explanation of ChantCode’s design process.</p><strong>Explore the examples <span aria-hidden="true">→</span></strong></a>
        </section>

        <section className="evidence-boundary">
          <p className="eyebrow">Current Boundary</p>
          <h2>What is not yet available</h2>
          <p>ChantCode does not currently publish a controlled outcome study, a validated effect size, or a guarantee of improved recall. Real family stories will be added separately as families complete the pilot and give permission.</p>
          <a className="primary-link" href="/families">See the family-story policy <span aria-hidden="true">→</span></a>
        </section>
      </main>
    </SiteShell>
  );
}
