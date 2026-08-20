import Link from "next/link";
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
        <Link className="brand" href="/" aria-label="ChantCode home"><RhythmMark small /><BrandLogo /></Link>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-brand"><Link className="brand" href="/" aria-label="ChantCode home"><RhythmMark small /><BrandLogo /></Link><p>Rhythm · Memory · Recall</p></div>
        <div className="footer-contact"><span>Contact</span><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></div>
        <nav aria-label="Footer navigation">
          <Link href="/method">Method</Link>
          <Link href="/about">About</Link>
          <Link href="/learning">Learning Structure</Link>
          <Link href="/book">Book</Link>
          <Link href="/app">App</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/parents">Parent Guide</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/support">Support</Link>
        </nav>
        <p className="copyright">© 2026 ChantCode. All rights reserved.</p>
      </footer>
    </div>
  );
}
