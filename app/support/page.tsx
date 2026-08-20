import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { SITE } from "../config";

export const metadata: Metadata = {
  title: "Help & Privacy",
  description: "Official ChantCode help, privacy, purchases, terms, and support information for families and App Store review.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <SiteShell>
      <main className="support-main">
        <header className="legal-hero support-hero">
          <p className="eyebrow">Official App Information</p>
          <h1>ChantCode Help &amp; Privacy</h1>
          <p>How to use ChantCode, how learning data is handled, and where families can get support.</p>
        </header>

        <section className="faq-list" aria-label="ChantCode help and privacy information">
          <article id="how-to-use"><h2>How to Use</h2><p><strong>Learning flow:</strong> Listen → Repeat → Recall → Practice.</p><p>Children begin with a multiplication song, repeat the chant aloud, test their recall, and then apply what they remember in Challenges.</p><p>Learning progress, test results, and completion status are saved locally on the device.</p></article>
          <article id="privacy-overview"><h2>Privacy Overview</h2><p>ChantCode respects children&apos;s privacy. The app is designed for learning multiplication facts and does not collect unnecessary personal information.</p></article>
          <article id="data-collection"><h2>Data Collection</h2><p>ChantCode does not collect names, email addresses, location data, contacts, photos or videos, camera data, microphone data, or personal identifiers.</p></article>
          <article id="learning-data"><h2>Learning Data</h2><p>Learning progress, test results, and completion status are stored locally on the user&apos;s device.</p><p>ChantCode does not upload, share, sell, or transmit children&apos;s learning data.</p></article>
          <article id="third-party-services"><h2>Third-Party Services</h2><p>ChantCode does not use third-party advertising, behavioral tracking, or analytics services that collect children&apos;s personal information.</p></article>
          <article id="childrens-privacy"><h2>Children&apos;s Privacy</h2><p>ChantCode is designed for children. The app does not require children to create accounts or provide personal information.</p></article>
          <article id="data-deletion"><h2>Data Deletion</h2><p>Users can delete locally stored learning data through <strong>Settings → Reset Learning Progress</strong>.</p><p>Deleting the app will also remove locally stored learning data.</p></article>
          <article id="purchases"><h2>Purchases</h2><p>ChantCode Full Version is available through Apple App Store In-App Purchase.</p><p>All payments are processed by Apple. ChantCode does not receive or store payment information.</p></article>
          <article id="restore-purchase"><h2>Restore Purchase</h2><p>Users can restore previous purchases through their Apple account using the restore-purchase option in the app.</p></article>
          <article id="terms-of-use"><h2>Terms of Use</h2><p>ChantCode is an educational application designed to help children practice multiplication facts. The app is provided for educational purposes only.</p><p>Parents or guardians are responsible for supervising children&apos;s use of the app.</p></article>
          <article id="version-information"><h2>Version Information</h2><p>The current app version is shown in ChantCode and on its Apple App Store product page.</p></article>
        </section>

        <section className="contact-card" id="contact-support"><div><p className="eyebrow">Support</p><h2>ChantCode Support</h2><p>For questions, technical support, or privacy requests, please contact us.</p></div><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></section>

        <nav className="legal-links" aria-label="Help and privacy links">
          <a href="/about">About ChantCode</a>
          <a href="#version-information">Version Information</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="#contact-support">Support</a>
        </nav>
      </main>
    </SiteShell>
  );
}
