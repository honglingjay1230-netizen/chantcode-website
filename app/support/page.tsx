import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { SITE } from "../config";

export const metadata: Metadata = {
  title: "Support",
  description: "Official ChantCode support, common product questions, and contact information for families.",
  alternates: { canonical: "/support" },
};

const supportTopics = [
  ["App usage", "Help with learning stages, audio or video playback, progress, and general app use."],
  ["Purchases", "Questions about an app-store purchase or access to paid content, when purchasing becomes available."],
  ["Technical problems", "Report a crash, missing media, unexpected behavior, or a compatibility problem."],
];

export default function SupportPage() {
  return (
    <SiteShell>
      <main className="support-main">
        <header className="legal-hero support-hero"><p className="eyebrow">Official Support</p><h1>ChantCode Support</h1><p>Contact the ChantCode team about app usage, purchases, or technical problems.</p></header>
        <section className="faq-list" aria-label="Frequently asked questions">
          {supportTopics.map(([topic, detail]) => <article key={topic}><h2>{topic}</h2><p>{detail}</p></article>)}
        </section>
        <section className="contact-card"><div><p className="eyebrow">Email</p><h2>Contact ChantCode</h2><p>When reporting a technical problem, include the device model, operating-system version, and a short description of what happened. Do not send a child&apos;s personal information.</p></div><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></section>
      </main>
    </SiteShell>
  );
}
