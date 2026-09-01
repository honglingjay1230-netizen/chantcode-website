import { SiteShell } from "../../components/SiteShell";
import { createArticleJsonLd, createPageMetadata } from "../../seo";

const title = "Language and Multiplication-Fact Recall";
const description = "What research and public sources can—and cannot—say about verbal memory, bilingual arithmetic, compact spoken patterns, and multiplication recall.";
const path = "/evidence/language-and-multiplication-recall";

export const metadata = createPageMetadata({ title, description, path });

const sources = [
  {
    title: "Representation of Multiplication Facts—Evidence for Partial Verbal Coding",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3148976/",
    note: "Experimental work on whether multiplication-fact representations involve verbal coding. It supports a qualified role for verbal processes, not a claim that facts are stored only as sound.",
  },
  {
    title: "Language-specific memory for everyday arithmetic facts in Chinese-English bilinguals",
    url: "https://pubmed.ncbi.nlm.nih.gov/26265429/",
    note: "A study of 32 bilingual adults that found language-related differences in practice transfer. The adult sample and training task limit direct conclusions about children.",
  },
  {
    title: "Bilingual children access multiplication facts from semantic memory equivalently across languages",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6949017/",
    note: "A child ERP study that complicates a simple language-specific account. Its findings are a reason not to claim that one language automatically produces better recall.",
  },
  {
    title: "What Education in Singapore Looks Like",
    url: "https://www.moe.gov.sg/-/media/files/about-us/moe-corporate-brochure.pdf",
    note: "Singapore Ministry of Education material stating that English is the medium of instruction and students learn a Mother Tongue Language.",
  },
  {
    title: "Raising Bilingual Children: A Complete Guide to Benefits, Challenges & Best Practices",
    url: "https://www.sais.edu.sg/school-life/our-news-events/raising-bilingual-children/",
    note: "A Stamford American International School article containing a school observation about some bilingual children choosing Mandarin for times-table memorization. This is not a controlled research study.",
  },
  {
    title: "The effect of retrieval practice on fluently retrieving multiplication facts in an authentic elementary school setting",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/acp.4141",
    note: "A 2023 classroom study showing why active retrieval should be considered separately from chanting as restudy.",
  },
];

const articleJsonLd = {
  ...createArticleJsonLd({ headline: title, description, path, datePublished: "2026-09-01", dateModified: "2026-09-01" }),
  citation: sources.map(({ url }) => url),
};

export default function LanguageAndRecallPage() {
  return (
    <SiteShell>
      <main className="content-main article-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <article>
          <header className="content-hero article-hero">
            <p className="eyebrow">Learning Background &amp; Evidence</p>
            <h1>{title}</h1>
            <p className="content-lede">Multiplication facts are often learned and retrieved with help from verbal memory, and the language used during learning can matter for some bilingual learners. The evidence is not one-directional: it does not establish that one language is universally better, that rhythm guarantees retention, or that these findings prove ChantCode works.</p>
            <p className="article-date">Published <time dateTime="2026-09-01">September 1, 2026</time> · Source links checked September 1, 2026</p>
          </header>

          <div className="article-content">
            <section>
              <h2>Verbal memory and multiplication facts</h2>
              <p>Basic multiplication can be solved by quantity-based strategies, such as counting or deriving from a known fact, or by retrieving a learned association. Research on numerical cognition has proposed an important verbal component for familiar multiplication facts. Experimental work supports a qualified version of that idea: verbal processes can contribute, but multiplication memory should not be reduced to a single sound-only store.</p>
              <p>This distinction matters for parents. Saying a complete fact aloud can give the question and answer a stable verbal form. It does not by itself show that the child can retrieve the answer when the supporting sequence is absent.</p>
            </section>

            <section>
              <h2>Compact or rhythmic verbal structures</h2>
              <p>A short, regular phrase is easier to rehearse consistently than wording that changes on every repetition. Rhythm can organize timing and order, which may make a verbal sequence easier for some children to repeat and mentally replay.</p>
              <p>That is a design rationale, not a guaranteed learning effect. Durable fact access still needs to be checked with the answer hidden, the facts out of sequence, and review after a delay. One classroom study found stronger gains from flashcard retrieval practice than from whole-class chanting as restudy; both conditions improved, and the authors note differences between individual and group formats.</p>
            </section>

            <section>
              <h2>Bilingual learning environments</h2>
              <p>Arithmetic knowledge can interact with the language in which it was learned and practiced. Adult bilingual studies have reported language-specific effects, while research with bilingual children has also found equivalent semantic access across languages under some conditions. Age, proficiency, format, and the original language of learning can all affect the result.</p>
              <p>The responsible takeaway is modest: a bilingual child may have a preferred language for rehearsing or retrieving some facts, but parents should not assume that a particular language will be superior for every child. Practice should ultimately support accurate retrieval in the language and notation the child uses for school mathematics.</p>
            </section>

            <section className="singapore-example">
              <p className="eyebrow">Singapore Example</p>
              <h2>An educational setting, not a product proof</h2>
              <p>Singapore’s Ministry of Education describes bilingualism as a cornerstone of its education system: English is the medium of instruction, and students also learn an official Mother Tongue Language. This establishes the bilingual educational context.</p>
              <p>In a public article, Stamford American International School reports an observation that some bilingual children choose Mandarin when memorizing times tables and describes Chinese as rhythmic and compact for chanting number facts. The article explicitly frames this as having another learning tool, not as one language being universally better.</p>
              <p>These two sources support a bounded example: some children in a bilingual environment may choose a different language for verbal rehearsal. They do not show that Singapore children generally learn multiplication this way, and they do not show that Singapore proves ChantCode works.</p>
            </section>

            <section>
              <h2>What ChantCode would still need to demonstrate</h2>
              <p>Background research can motivate combining a stable verbal pattern with retrieval practice. It cannot establish whether ChantCode’s particular English materials improve accuracy, retention, transfer to mixed facts, or long-term recall for children.</p>
              <p>Those questions require direct testing with clearly described participants, practice duration, comparison conditions, delayed measures, and transparent reporting of mixed or negative results. Until such evidence exists, ChantCode should be described as designed to support recall—not as scientifically proven.</p>
            </section>

            <section className="source-section">
              <h2>Original sources</h2>
              <ul className="source-list">
                {sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title}</a><p>{source.note}</p></li>)}
              </ul>
            </section>
          </div>
        </article>

        <nav className="related-guides" aria-labelledby="related-guides-title">
          <p className="eyebrow">Related Reading</p>
          <h2 id="related-guides-title">Guides and examples</h2>
          <div>
            <a href="/guides/multiplication-chants">Can Multiplication Chants Help Children Learn Times Tables?<span aria-hidden="true">→</span></a>
            <a href="/guides/multiplication-fact-fluency">What Is Multiplication Fact Fluency?<span aria-hidden="true">→</span></a>
            <a href="/evidence/chinese-multiplication-learning-examples">Chinese Multiplication Learning Examples<span aria-hidden="true">→</span></a>
          </div>
        </nav>
      </main>
    </SiteShell>
  );
}
