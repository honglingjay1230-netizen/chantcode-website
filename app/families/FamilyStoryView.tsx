import { SITE } from "../config";
import type { FamilyStory } from "./data";

export const FAMILY_STORY_DISCLAIMER = "This is one family's experience and is not a controlled scientific study. Individual results may vary.";

export function FamilyStoryView({ story }: { story: FamilyStory }) {
  const videoJsonLd = story.video ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: story.video.name,
    description: story.video.description,
    thumbnailUrl: [story.video.thumbnailUrl],
    uploadDate: story.video.uploadDate,
    ...(story.video.embedUrl ? { embedUrl: story.video.embedUrl } : {}),
    ...(story.video.contentUrl ? { contentUrl: story.video.contentUrl } : {}),
    mainEntityOfPage: `${SITE.url}/families/${story.slug}`,
  } : null;

  return (
    <article>
      {videoJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} /> : null}
      <header className="content-hero article-hero">
        <p className="eyebrow">Real Family Experience</p>
        <h1>{story.title}</h1>
        <p className="content-lede">{story.description}</p>
        <p className="article-date">Published <time dateTime={story.datePublished}>{story.datePublished}</time></p>
      </header>

      <div className="article-content family-story-content">
        {story.childAge ? <section><h2>Child age</h2><p>{story.childAge} · Shared with parent or guardian permission.</p></section> : null}
        <section><h2>Starting point</h2><p>{story.startingPoint}</p></section>
        <section><h2>Learning challenge</h2><p>{story.learningChallenge}</p></section>
        <section><h2>What the child practiced</h2><p>{story.practice}</p></section>
        <section><h2>Duration</h2><p>{story.duration}</p></section>
        <section><h2>Parent observation</h2><p>{story.parentObservation}</p></section>

        {story.video ? (
          <section>
            <h2>Video</h2>
            {story.video.embedUrl ? <iframe className="family-video" src={story.video.embedUrl} title={story.video.name} allowFullScreen /> : <p><a href={story.video.contentUrl}>Watch the family video at its original location.</a></p>}
          </section>
        ) : null}

        <section>
          <h2>Full readable transcript</h2>
          {story.transcript.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section>
          <h2>Important context</h2>
          {story.importantContext.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <aside className="story-disclaimer" aria-label="Family story disclaimer"><p>{FAMILY_STORY_DISCLAIMER}</p></aside>
      </div>
    </article>
  );
}
