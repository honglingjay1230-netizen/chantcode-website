import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { SITE } from "../config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Official terms governing use of the ChantCode multiplication learning application and educational content.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p><strong>Last updated: August 21, 2026.</strong></p>
      <section><h2>Educational Purpose</h2><p>ChantCode is an educational application designed to help children practice multiplication facts. The app is provided for educational purposes only.</p></section>
      <section><h2>Parental Supervision</h2><p>Parents or guardians are responsible for supervising children&apos;s use of the app.</p></section>
      <section><h2>Purchases</h2><p>ChantCode Full Version is available through Apple App Store In-App Purchase. Payments, refunds, and purchase restoration are handled through the user&apos;s Apple account and are subject to Apple&apos;s applicable terms.</p></section>
      <section><h2>Intellectual Property</h2><p>ChantCode and its original educational content, audio, visual materials, learning structure, and branding are protected intellectual property. They may not be copied, redistributed, resold, or commercially exploited without permission.</p></section>
      <section><h2>Responsible Use</h2><p>Users may not interfere with the app&apos;s operation, bypass purchase controls, or use ChantCode content in a way that infringes the rights of others.</p></section>
      <section><h2>Learning Results</h2><p>ChantCode supports multiplication practice, but individual learning results vary. It does not replace teachers, school instruction, educational assessment, or professional advice.</p></section>
      <section><h2>Changes to These Terms</h2><p>We may update these terms as the product develops. The latest terms will be published on this page.</p></section>
      <section><h2>Contact</h2><p>Questions about these terms can be sent to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p></section>
    </LegalPage>
  );
}
