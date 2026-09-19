import { SITE } from "../config";
import { createPageMetadata } from "../seo";
import styles from "./page.module.css";

export const metadata = {
  ...createPageMetadata({
    title: "Free Multiplication Chants for Kids | ChantCode",
    description: "Practice multiplication with ChantCode's free web learning resource: rhythmic chants, listening, recall practice, and tower challenges.",
    path: "/free-multiplication",
    absoluteTitle: true,
  }),
  robots: { index: false, follow: false },
};

export default function FreeMultiplicationPage() {
  return (
    <main className={styles.resourcePage}>
      <header className={styles.resourceHeader}>
        <div>
          <p className={styles.resourceEyebrow}>ChantCode · For families &amp; homeschool learners</p>
          <h1>Free Multiplication Chants for Kids</h1>
          <p>Explore the chants below, or practise with ChantCode on your iPhone or iPad.</p>
        </div>
      </header>
      <section className={styles.appDownloadCard} aria-labelledby="get-chantcode">
        <div className={styles.appDownloadCopy}>
          <div className={styles.appIdentity}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/free-multiplication/app-icon.webp" width="60" height="60" alt="" />
            <div><strong>ChantCode</strong><span>Multiplication through rhythm</span></div>
          </div>
          <h2 id="get-chantcode">Get ChantCode Free on iPhone &amp; iPad</h2>
          <p>Bring the chants, listening and multiplication practice to your child&apos;s device.</p>
          <a className={styles.appStoreButton} href={SITE.appStoreUrl}>Download on the App Store <span aria-hidden="true">↗</span></a>
          <p className={styles.downloadHint}>On your iPhone or iPad? Tap the button to download.</p>
          <a className={styles.tryWebLink} href="#web-learning">Or try the free web resource below ↓</a>
        </div>
        <a className={styles.appQrCard} href={SITE.appStoreUrl} aria-label="Download ChantCode from the App Store">
          {/* Preserve the existing, scannable App Store QR code unchanged. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chantcode-app-store-qr.png" width="180" height="180" alt="Scan this QR code to open ChantCode in the App Store" />
          <strong>Scan to download</strong>
          <span>Use your iPhone or iPad camera</span>
        </a>
      </section>
      <section id="web-learning" className={styles.webApp} aria-label="ChantCode web learning app">
        <div className={styles.appToolbar}>
          <span>Free web learning resource</span>
          <a href="/free-multiplication-app/index.html" target="_blank" rel="noopener noreferrer">Open in a full window <span aria-hidden="true">↗</span></a>
        </div>
        <iframe
          className={styles.appFrame}
          src="/free-multiplication-app/index.html"
          title="ChantCode multiplication learning app"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </section>
      <aside className={styles.browserNotes} aria-label="Browser information">
        <p>Your learning progress is saved in this browser. It does not sync with the iPhone or iPad app; clearing browser data can remove it.</p>
        <p>Web follow-along is child-paced: listen, repeat aloud, then tap Next. No microphone, recording, or automatic speech scoring is used.</p>
        <noscript>JavaScript is required to use the interactive learning app.</noscript>
      </aside>
      <section className={styles.appReview} aria-labelledby="app-feedback">
        <div><h2 id="app-feedback">Already tried ChantCode?</h2><p>Your honest App Store review helps other parents decide whether it is right for their family.</p></div>
        <a href={`${SITE.appStoreUrl}?action=write-review`}>Leave an honest review ↗</a>
      </section>
    </main>
  );
}
