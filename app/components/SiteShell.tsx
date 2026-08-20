import type { ReactNode } from "react";
import { SITE } from "../config";

const links = [
  ["About", "/about"],
  ["Method", "/method"],
  ["Parents", "/parents"],
  ["Book", "/book"],
  ["FAQ", "/faq"],
  ["App", "/app"],
] as const;

export function BrandLogo() {
  return (
    <span className="brand-lockup">
      <span className="brand-name"><b>Chant</b><i>C</i><i>o</i><i>d</i><i>e</i></span>
      <span className="brand-subtitle">Multiplication</span>
    </span>
  );
}

export function RhythmMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`rhythm-mark${small ? " rhythm-mark-small" : ""}`} aria-hidden="true">
      <img src="/chantcode-rhythm-mark-transparent.png" alt="" />
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="ChantCode home"><RhythmMark small /><BrandLogo /></a>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-brand"><a className="brand" href="/" aria-label="ChantCode home"><RhythmMark small /><BrandLogo /></a><p>Rhythm · Memory · Recall</p></div>
        <div className="footer-contact"><span>Contact</span><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></div>
        <nav aria-label="Footer navigation">
          <a href="/method">Method</a>
          <a href="/about">About</a>
          <a href="/learning">Learning Structure</a>
          <a href="/book">Book</a>
          <a href="/app">App</a>
          <a href="/faq">FAQ</a>
          <a href="/parents">Parent Guide</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/support">Support</a>
        </nav>
        <p className="copyright">© 2026 ChantCode. All rights reserved.</p>
      </footer>
    </div>
  );
}
