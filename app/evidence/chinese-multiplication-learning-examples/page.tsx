import { SiteShell } from "../../components/SiteShell";
import { createArticleJsonLd, createPageMetadata } from "../../seo";

const title = "Chinese Multiplication Learning Examples";
const description = "Public school and educational examples of Chinese multiplication-table learning, presented as background rather than proof of ChantCode.";
const path = "/evidence/chinese-multiplication-learning-examples";

export const metadata = createPageMetadata({ title, description, path });

const sources = [
  {
    title: "Yantai Yulongshan School: lesson plan for the 8 times table",
    url: "https://www.yantai.gov.cn/art/2025/1/3/art_78903_3233682.html",
    note: "A school lesson plan published on the Yantai government site. It combines equal-group meaning, pattern finding, spoken recitation, clapping, and prompts between equations and chant lines.",
  },
  {
    title: "Shanghai Educational Resources Center: 九九乘法歌 resource listing",
    url: "https://isherc-market-smile.shec.edu.cn/market/videos?CP=&FirstTag=4742&OrderType=2&Page=16&SecondTag=4822&ThirdTag=5019",
    note: "A public educational-resource catalog that includes a multiplication-table chant video as part of a wider learning collection.",
  },
  {
    title: "Pinkfong public multiplication-table song video",
    url: "https://www.youtube.com/watch?v=fFtjc2ZBDz8",
    note: "A publicly available Chinese multiplication song offered only as a media example. ChantCode does not download, copy, or re-upload it.",
  },
];

const articleJsonLd = {
  ...createArticleJsonLd({ headline: title, description, path, datePublished: "2026-09-01", dateModified: "2026-09-01" }),
  citation: sources.map(({ url }) => url),
};

export default function ChineseExamplesPage() {
  return (
    <SiteShell>
      <main className="content-main article-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <article>
          <header className="content-hero article-hero">
            <p className="eyebrow">External Educational Background</p>
            <h1>{title}</h1>
            <p className="content-lede">These public examples show that spoken multiplication formulas, recitation, pattern finding, and recall prompts appear in Chinese educational materials. They do not prove a learning effect for ChantCode, and they are not a public explanation of how ChantCode’s English materials were designed.</p>
            <p className="article-date">Published <time dateTime="2026-09-01">September 1, 2026</time> · Source links checked September 1, 2026</p>
          </header>

          <div className="article-content">
            <section>
              <h2>A school lesson can combine meaning and memorization</h2>
              <p>A lesson plan from Yantai Yulongshan School introduces the 8 times table through equal groups and a real context, asks pupils to find patterns and formulate chant lines, and then includes recitation, clapping, and prompts that move between equations and spoken formulas.</p>
              <p>This is useful background because it shows that conceptual work and memorized verbal facts do not have to be competing approaches. It is one published lesson example, not evidence that every school or every child uses the same routine.</p>
            </section>

            <section>
              <h2>Public chant and song resources exist alongside lessons</h2>
              <p>The Shanghai Educational Resources Center catalog includes a “九九乘法歌” resource, and public children’s-media channels also publish multiplication-table songs. These links show examples of the format. ChantCode links to the original pages and does not copy, host, or re-upload another organization’s child-focused video.</p>
              <p>A song or chant can demonstrate ordered rehearsal. It cannot, by itself, show that a child can answer isolated multiplication questions or retain them over time. That requires separate recall checks.</p>
            </section>

            <section>
              <h2>What these examples do not establish</h2>
              <ul>
                <li>They do not show that Chinese is a universally better language for multiplication.</li>
                <li>They do not show that all children in China or Singapore learn through the same chant routine.</li>
                <li>They do not test ChantCode or prove that ChantCode improves recall.</li>
                <li>They do not disclose the full design derivation of ChantCode’s English system.</li>
              </ul>
            </section>

            <section className="source-section">
              <h2>Linked examples</h2>
              <ul className="source-list">
                {sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title}</a><p>{source.note}</p></li>)}
              </ul>
            </section>
          </div>
        </article>

        <nav className="related-guides" aria-labelledby="related-reading-title">
          <p className="eyebrow">Related Reading</p>
          <h2 id="related-reading-title">Context and practical guidance</h2>
          <div>
            <a href="/evidence/language-and-multiplication-recall">Language and Multiplication-Fact Recall<span aria-hidden="true">→</span></a>
            <a href="/guides/multiplication-chants">Can Multiplication Chants Help Children Learn Times Tables?<span aria-hidden="true">→</span></a>
            <a href="/guides/multiplication-fact-fluency">What Is Multiplication Fact Fluency?<span aria-hidden="true">→</span></a>
          </div>
        </nav>
      </main>
    </SiteShell>
  );
}
