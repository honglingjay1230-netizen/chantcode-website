import { notFound } from "next/navigation";
import { SiteShell } from "../../components/SiteShell";
import { createArticleJsonLd, createPageMetadata } from "../../seo";
import { getGuide, guidePath, guides } from "../data";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return createPageMetadata({ title: guide.title, description: guide.description, path: guidePath(slug) });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const articleJsonLd = createArticleJsonLd({
    headline: guide.title,
    description: guide.description,
    path: guidePath(guide.slug),
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
  });

  return (
    <SiteShell>
      <main className="content-main article-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <article>
          <header className="content-hero article-hero">
            <p className="eyebrow">Multiplication Guide for Parents</p>
            <h1>{guide.title}</h1>
            <p className="content-lede">{guide.answer}</p>
            <p className="article-date">Published <time dateTime={guide.datePublished}>September 1, 2026</time> · Reviewed by ChantCode</p>
          </header>

          <div className="article-content">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              </section>
            ))}

            {guide.references ? (
              <section className="source-section">
                <h2>Relevant evidence and background</h2>
                <ul className="source-list">
                  {guide.references.map((reference) => (
                    <li key={reference.url}>
                      <a href={reference.url} rel="noopener noreferrer">{reference.title}</a>
                      <p>{reference.note}</p>
                    </li>
                  ))}
                </ul>
                <p>See <a href="/evidence">Learning Background &amp; Evidence</a> for wider context and research limits.</p>
              </section>
            ) : (
              <section className="source-section">
                <h2>Relevant evidence and background</h2>
                <p>For external sources and careful limits on claims about verbal memory, bilingual learning, chants, and retrieval practice, visit <a href="/evidence">Learning Background &amp; Evidence</a>.</p>
              </section>
            )}

            <section className="product-context">
              <p className="eyebrow">Where ChantCode Fits</p>
              <h2>A focused tool for the recall-building stage</h2>
              <p>{guide.chantcodeNote}</p>
              <a className="primary-link" href="/app">Learn about the ChantCode app <span aria-hidden="true">→</span></a>
            </section>
          </div>
        </article>

        <nav className="related-guides" aria-labelledby="related-guides-title">
          <p className="eyebrow">Continue Reading</p>
          <h2 id="related-guides-title">Related Guides</h2>
          <div>
            {guide.related.map((relatedSlug) => {
              const relatedGuide = getGuide(relatedSlug);
              if (!relatedGuide) return null;
              return <a href={guidePath(relatedGuide.slug)} key={relatedGuide.slug}>{relatedGuide.title}<span aria-hidden="true">→</span></a>;
            })}
          </div>
        </nav>
      </main>
    </SiteShell>
  );
}
