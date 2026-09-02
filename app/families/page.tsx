import { SiteShell } from "../components/SiteShell";
import { createPageMetadata } from "../seo";
import { familyStories, familyStoryPath } from "./data";

export const metadata = createPageMetadata({
  title: "Real Family Experiences",
  description: "Real, permission-based family experiences from the ChantCode pilot, with context, readable transcripts, and clear evidence limits.",
  path: "/families",
});

export default function FamiliesPage() {
  return (
    <SiteShell>
      <main className="content-main hub-main">
        <header className="content-hero">
          <p className="eyebrow">ChantCode Pilot</p>
          <h1>Real Family Experiences</h1>
          <p className="content-lede">This area will contain only real, permission-based family accounts with the child’s starting point, practice, duration, parent observation, video, readable transcript, and important context.</p>
          <p>Family observations can help parents understand how practice looked in one home. They are not controlled studies and will never be presented as guaranteed results.</p>
        </header>

        {familyStories.length ? (
          <section className="article-card-grid" aria-label="Published family stories">
            {familyStories.map((story) => <a className="article-card" href={familyStoryPath(story.slug)} key={story.slug}><span>Family Story</span><h2>{story.title}</h2><p>{story.description}</p><strong>Read the complete story <span aria-hidden="true">→</span></strong></a>)}
          </section>
        ) : (
          <section className="family-empty" aria-labelledby="family-empty-title">
            <p className="eyebrow">Pilot in Progress</p>
            <h2 id="family-empty-title">Stories will be published only when they are real and ready</h2>
            <p>Real family stories will be added as families complete the ChantCode pilot.</p>
          </section>
        )}

        <section className="story-policy">
          <h2>Every future story will include</h2>
          <ul>
            <li>Permission before sharing a child’s age or media</li>
            <li>A starting point, learning challenge, and actual practice duration</li>
            <li>The parent’s observation in context</li>
            <li>A full readable transcript when video is included</li>
            <li>A fixed disclaimer separating experience from controlled evidence</li>
          </ul>
          <blockquote>“This is one family&apos;s experience and is not a controlled scientific study. Individual results may vary.”</blockquote>
        </section>
      </main>
    </SiteShell>
  );
}
