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
      <p><strong>Last updated: August 21, 2026.</strong> ChantCode is designed for children and families with a data-minimizing approach.</p>
      <section><h2>No Account Required</h2><p>The core ChantCode experience does not require an account. ChantCode does not ask children to provide a name, email address, profile, or password.</p></section>
      <section><h2>Personal Information</h2><p>ChantCode does not collect a child&apos;s name or precise location, and it does not upload the child&apos;s learning record to a ChantCode server.</p></section>
      <section><h2>Learning Progress</h2><p>Learning progress and preferences are stored locally on the device. Removing the app or clearing its local data may remove that progress.</p></section>
      <section><h2>Audio and Video</h2><p>Chant recordings, music, sound effects, and videos are provided as learning media. The app does not require a child to record or upload their own voice, photo, or video for the core experience.</p></section>
      <section><h2>Purchases</h2><p>If paid content becomes available, purchases are processed by the applicable app store. ChantCode does not directly receive or store payment-card details. Store purchase records are governed by the store provider&apos;s terms and privacy policy.</p></section>
      <section><h2>Advertising and Third-Party Services</h2><p>ChantCode does not include advertising or behavioral advertising. The core app is designed without third-party account, analytics, or advertising services. Any future service that changes data handling will be reviewed and disclosed in this policy before use.</p></section>
      <section><h2>Changes to This Policy</h2><p>We may update this policy as ChantCode develops. The latest version will be published on this page with a revised update date.</p></section>
      <section><h2>Contact</h2><p>Questions about this policy can be sent to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p></section>
    </LegalPage>
  );
}
