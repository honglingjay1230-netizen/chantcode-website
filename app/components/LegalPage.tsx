import type { ReactNode } from "react";
import { SiteShell } from "./SiteShell";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SiteShell>
      <main className="legal-main">
        <header className="legal-hero">
          <p className="eyebrow">ChantCode</p>
          <h1>{title}</h1>
          <p>Last updated: August 2026</p>
        </header>
        <article className="legal-content">{children}</article>
      </main>
    </SiteShell>
  );
}
