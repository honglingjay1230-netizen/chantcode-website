import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { SITE } from "../config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "The official ChantCode privacy policy for children, families, and the ChantCode learning application.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p><strong>Last updated: August 21, 2026.</strong></p>
      <section><h2>Privacy Overview</h2><p>ChantCode respects children&apos;s privacy. The app is designed for learning multiplication facts and does not collect unnecessary personal information.</p></section>
      <section><h2>Data Collection</h2><p>ChantCode does not collect names, email addresses, location data, contacts, photos or videos, camera data, microphone data, or personal identifiers.</p></section>
      <section><h2>Learning Data</h2><p>Learning progress, test results, and completion status are stored locally on the user&apos;s device.</p><p>ChantCode does not upload, share, sell, or transmit children&apos;s learning data.</p></section>
      <section><h2>Audio and Video</h2><p>Chant recordings, songs, sound effects, and videos are learning resources provided by the app. ChantCode does not record or upload a child&apos;s voice, photos, or videos.</p></section>
      <section><h2>Third-Party Services</h2><p>ChantCode does not use third-party advertising, behavioral tracking, or analytics services that collect children&apos;s personal information.</p></section>
      <section><h2>Children&apos;s Privacy</h2><p>ChantCode is designed for children. The app does not require children to create accounts or provide personal information.</p></section>
      <section><h2>Data Deletion</h2><p>Users can delete locally stored learning data through <strong>Settings → Reset Learning Progress</strong>.</p><p>Deleting the app will also remove locally stored learning data.</p></section>
      <section><h2>Purchases</h2><p>ChantCode Full Version is available through Apple App Store In-App Purchase. All payments are processed by Apple. ChantCode does not receive or store payment information.</p><p>Users can restore previous purchases through their Apple account using the restore-purchase option in the app.</p></section>
      <section><h2>Changes to This Policy</h2><p>We may update this policy if ChantCode&apos;s features or data practices change. The latest version will be published on this page with a revised update date.</p></section>
      <section><h2>Contact</h2><p>For questions, technical support, or privacy requests, contact <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p></section>
    </LegalPage>
  );
}
