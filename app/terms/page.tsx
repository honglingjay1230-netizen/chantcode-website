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
      <p>These Terms of Use provide the basic rules for using ChantCode. By using the application, you agree to use it responsibly and only for its intended purposes.</p>
      <section><h2>Use of ChantCode</h2><p>You may use ChantCode for personal and educational purposes in accordance with these terms and applicable law.</p></section>
      <section><h2>Educational Purpose</h2><p>ChantCode is an educational aid designed to support multiplication practice. It does not replace professional teaching, educational assessment, or individualized advice.</p></section>
      <section><h2>Purchases</h2><p>Any purchases will be offered through the relevant app store and will be subject to that store&apos;s pricing, payment, refund, and account terms.</p></section>
      <section><h2>Intellectual Property</h2><p>ChantCode and its original educational content, audio, visual materials, learning structure, branding, and related materials are protected intellectual property.</p><p>Users may use the application for personal and educational purposes but may not copy, redistribute, reproduce, resell, or commercially exploit ChantCode content without permission.</p></section>
      <section><h2>Acceptable Use</h2><p>You may not misuse the application, attempt to interfere with its operation, bypass access controls, or use its content in a way that infringes the rights of others.</p></section>
      <section><h2>Disclaimer</h2><p>ChantCode is provided as an educational tool. While we work to keep it accurate and reliable, learning outcomes vary and uninterrupted availability cannot be guaranteed.</p></section>
      <section><h2>Limitation of Liability</h2><p>To the extent permitted by applicable law, ChantCode is not liable for indirect or consequential losses arising from use of, or inability to use, the application.</p></section>
      <section><h2>Changes to These Terms</h2><p>We may update these terms as the product develops. Updated terms will appear on this page with a revised update date.</p></section>
      <section><h2>Contact</h2><p>Questions about these terms can be sent to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p></section>
    </LegalPage>
  );
}
