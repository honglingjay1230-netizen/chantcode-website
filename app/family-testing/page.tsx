import { SiteShell } from "../components/SiteShell";
import { createPageMetadata } from "../seo";

const contactEmail = "honglingjay1230@gmail.com";

export const metadata = createPageMetadata({
  title: "ChantCode Family Testing | Free Multiplication App Testing for Ages 6–10",
  description: "ChantCode is inviting families with children ages 6–10 to join free testing of a multiplication learning app designed to support multiplication fact recall and fluency.",
  path: "/family-testing",
  absoluteTitle: true,
});

export default function FamilyTestingPage() {
  return (
    <SiteShell>
      <main className="content-main article-main">
        <header className="content-hero article-hero">
          <p className="eyebrow">Pre-release family testing</p>
          <h1>Family Testing</h1>
          <p className="content-lede">ChantCode is currently inviting families to take part in free testing before its official release.</p>
          <p>The purpose of this testing period is to observe how families use ChantCode in real learning situations and to collect practical feedback from parents.</p>
        </header>

        <div className="article-content">
          <section aria-labelledby="who-testing-is-for">
            <h2 id="who-testing-is-for">Who family testing is for</h2>
            <p>We are looking for families with children around ages 6–10 who are currently learning multiplication facts or times tables.</p>
            <p>ChantCode may be particularly relevant for children who already understand what multiplication means but still need to calculate facts such as 6 × 7 or 7 × 8 instead of recalling the answers automatically.</p>
          </section>

          <section aria-labelledby="what-families-will-test">
            <h2 id="what-families-will-test">What families will test</h2>
            <p>ChantCode is a multiplication learning app that uses rhythmic learning and spoken patterns as part of multiplication practice. The app is designed to support the transition toward automatic recall and multiplication fluency.</p>
            <p>During family testing, parents can use ChantCode with their child in an ordinary home-learning setting and share practical feedback about the experience. Participation is free.</p>
          </section>

          <section aria-labelledby="current-status">
            <h2 id="current-status">Current testing status</h2>
            <p>ChantCode is currently in testing and has not yet been officially released. This family testing period is intended to gather real-world feedback; it does not promise a particular learning result for every child.</p>
          </section>

          <section aria-labelledby="contact-family-testing">
            <h2 id="contact-family-testing">Contact ChantCode</h2>
            <p>Parents who are interested in trying ChantCode with their child can contact:</p>
            <p><a href={`mailto:${contactEmail}?subject=ChantCode%20Family%20Testing`}>{contactEmail}</a></p>
            <p>Please include “ChantCode Family Testing” in the subject line.</p>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
