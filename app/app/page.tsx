import { SiteShell } from "../components/SiteShell";
import { StoreButtons } from "../components/StoreButtons";
import { SITE } from "../config";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Multiplication Learning App",
  description: "Learn about the ChantCode iOS app for rhythmic multiplication chants, focused recall practice, and multiplication fact fluency.",
  path: "/app",
});

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ChantCode",
  applicationCategory: "EducationalApplication",
  applicationSubCategory: "multiplication fact learning",
  educationalUse: ["multiplication fact learning", "multiplication fluency"],
  operatingSystem: "iOS",
  description: "An educational iOS app using rhythmic multiplication chants and focused recall practice to support multiplication fact fluency.",
  url: `${SITE.url}/app`,
  image: `${SITE.url}/chantcode-app-icon.png`,
  ...(SITE.appStoreUrl ? { downloadUrl: SITE.appStoreUrl } : {}),
};

export default function AppPage() {
  return (
    <SiteShell>
      <main className="content-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
        <section className="app-page-hero">
          <div>
            <p className="eyebrow">ChantCode App</p>
            <h1>Rhythm-guided multiplication recall</h1>
            <p className="content-lede">The ChantCode App helps children practice multiplication facts through rhythmic chants, structured learning steps, recall practice, and challenges.</p>
            <StoreButtons />
          </div>
          <img src="/chantcode-app-icon.png" alt="ChantCode Multiplication app icon" />
        </section>

        <section className="app-features">
          <article><h2>Rhythmic chants</h2><p>Hear compact sound patterns for multiplication facts.</p></article>
          <article><h2>Structured steps</h2><p>Move from listening and repetition toward independent recall.</p></article>
          <article><h2>Recall practice</h2><p>Practice retrieving answers instead of repeatedly recalculating them.</p></article>
          <article><h2>Challenges</h2><p>Strengthen accuracy and fluency through focused activities.</p></article>
        </section>

        <section className="app-download-section" aria-labelledby="download-chantcode-heading">
          <div>
            <p className="eyebrow">Available for iPhone and iPad</p>
            <h2 id="download-chantcode-heading">Download ChantCode on the App Store</h2>
            <p>Scan the QR code with your iPhone or iPad camera, or use the direct link to open the official ChantCode App Store page.</p>
            <a className="primary-button app-store-direct-link" href={SITE.appStoreUrl} rel="noopener noreferrer">Open ChantCode in the App Store</a>
          </div>
          <a className="app-store-qr" href={SITE.appStoreUrl} aria-label="Open ChantCode in the App Store">
            <img src="/chantcode-app-store-qr.png" alt="QR code for the official ChantCode App Store download page" />
          </a>
        </section>

        <p className="app-availability">ChantCode is available on the Apple App Store for iPhone and iPad. Google Play availability will be updated separately.</p>
      </main>
    </SiteShell>
  );
}
