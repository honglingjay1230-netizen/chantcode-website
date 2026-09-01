import { SiteShell } from "../components/SiteShell";
import { createPageMetadata } from "../seo";
import { guidePath, guides } from "./data";

export const metadata = createPageMetadata({
  title: "Multiplication Guides for Parents",
  description: "Clear, practical guides to multiplication facts, fluency, recall, automaticity, chants, and times-table practice at home.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <SiteShell>
      <main className="content-main hub-main">
        <header className="content-hero">
          <p className="eyebrow">Parent Learning Center</p>
          <h1>Multiplication Guides for Parents</h1>
          <p className="content-lede">Practical, plain-English answers about multiplication facts, fluency, retrieval, automaticity, and times-table practice—without treating understanding and memory as opposites.</p>
          <p>Start with the question that sounds most like your child. Each guide explains the learning stage first, gives usable practice ideas, and only then describes where ChantCode may fit.</p>
        </header>

        <section aria-labelledby="guide-list-title">
          <p className="eyebrow">Eight Starting Questions</p>
          <h2 id="guide-list-title">Choose a parent question</h2>
          <div className="article-card-grid">
            {guides.map((guide, index) => (
              <a className="article-card" href={guidePath(guide.slug)} key={guide.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <strong>Read the guide <span aria-hidden="true">→</span></strong>
              </a>
            ))}
          </div>
        </section>

        <section className="hub-support-grid" aria-label="Further ChantCode resources">
          <article><p className="eyebrow">Sources &amp; Limits</p><h2>Learning background and evidence</h2><p>See the external sources, educational context, and clear limits behind claims about language, memory, chants, and retrieval.</p><a className="primary-link" href="/evidence">Explore the evidence area <span aria-hidden="true">→</span></a></article>
          <article><p className="eyebrow">Pilot Stories</p><h2>Real family experiences</h2><p>No cases are invented. Family stories will appear only when real pilot families provide permission and usable context.</p><a className="primary-link" href="/families">Visit family stories <span aria-hidden="true">→</span></a></article>
        </section>
      </main>
    </SiteShell>
  );
}
